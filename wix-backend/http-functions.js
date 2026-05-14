/**
 * Velo backend — HTTP functions for invoice access.
 *
 * ⚠️ THIS FILE IS NOT EXECUTED BY VERCEL / NEXT.JS.
 * It belongs in your Wix Editor / Wix Studio site, under
 *   backend/http-functions.js
 * (or `src/backend/http-functions.js` on Wix Studio).
 *
 * It's checked into this repo only as a versioned reference / source of truth.
 *
 * Endpoints:
 *   GET /_functions/ping                 — no auth, returns {ok, ts}
 *   GET /_functions/invoices?since&limit — Bearer auth, paginated list
 *   GET /_functions/invoice/{id}/pdf     — Bearer auth, 302 redirect to PDF
 *
 * Auth: `Authorization: Bearer <token>` where <token> matches the secret
 * stored in Wix Secrets Manager under PASCALOU_BACKEND_SECRET.
 *
 * Required Velo permissions on the Wix site:
 *   - Billing (invoices.read)
 *   - Secrets Manager (read)
 */

import { invoices } from 'wix-billing-backend';
import { getSecret } from 'wix-secrets-backend';
import { response } from 'wix-http-functions';

const SECRET_NAME = 'PASCALOU_BACKEND_SECRET';
const MAX_LIMIT = 500;
const PAGE_SIZE = 100;

function jsonResponse(status, body) {
  return response({
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function authorize(request) {
  const header =
    (request.headers && (request.headers.authorization || request.headers.Authorization)) || '';
  if (!header.startsWith('Bearer ')) {
    return { ok: false, status: 401, body: { error: 'Missing bearer token' } };
  }
  const token = header.slice('Bearer '.length).trim();
  let expected;
  try {
    expected = await getSecret(SECRET_NAME);
  } catch (e) {
    console.error('[auth] getSecret failed:', e);
    return { ok: false, status: 500, body: { error: 'Backend secret not configured' } };
  }
  if (!expected || token !== expected) {
    return { ok: false, status: 401, body: { error: 'Invalid token' } };
  }
  return { ok: true };
}

// -----------------------------------------------------------------------------
// GET /_functions/ping  (no auth)
// -----------------------------------------------------------------------------
export async function get_ping(request) {
  return jsonResponse(200, { ok: true, ts: new Date().toISOString() });
}

// -----------------------------------------------------------------------------
// GET /_functions/invoices?since=<ISO>&limit=<N>
// -----------------------------------------------------------------------------
export async function get_invoices(request) {
  const auth = await authorize(request);
  if (!auth.ok) return jsonResponse(auth.status, auth.body);

  const sinceRaw = request.query.since;
  const limitRaw = request.query.limit;
  const limit = Number.parseInt(limitRaw || '50', 10);

  if (!Number.isFinite(limit) || limit < 1 || limit > MAX_LIMIT) {
    return jsonResponse(400, { error: `limit must be an integer between 1 and ${MAX_LIMIT}` });
  }

  let sinceDate = null;
  if (sinceRaw) {
    sinceDate = new Date(sinceRaw);
    if (Number.isNaN(sinceDate.getTime())) {
      return jsonResponse(400, { error: 'since must be a valid ISO-8601 date' });
    }
  }

  console.log(`[invoices] authorized: since=${sinceRaw || 'none'} limit=${limit}`);

  const collected = [];
  let offset = 0;

  while (collected.length < limit) {
    const wanted = Math.min(PAGE_SIZE, limit - collected.length);
    const options = {
      paging: { offset, limit: wanted },
      sort: [{ fieldName: 'issueDate', order: 'DESC' }],
    };
    if (sinceDate) {
      // Wix uses MongoDB-style operators for filters.
      options.filter = { issueDate: { $gte: sinceDate.toISOString() } };
    }

    let page;
    try {
      page = await invoices.listInvoices(options);
    } catch (err) {
      console.error('[invoices] listInvoices failed:', err);
      return jsonResponse(502, { error: 'Wix listInvoices failed', detail: String(err) });
    }

    const items = page.invoices || page.items || [];
    if (items.length === 0) break;

    for (const inv of items) {
      collected.push(inv);
      if (collected.length >= limit) break;
    }

    offset += items.length;
    if (items.length < wanted) break; // no more pages
  }

  // Decorate each invoice with previewUrl.
  const out = await Promise.all(
    collected.map(async (inv) => {
      let previewUrl = null;
      try {
        previewUrl = await invoices.createInvoicePreviewUrl(inv.id);
      } catch (e) {
        console.warn(`[invoices] previewUrl failed for ${inv.id}:`, e);
      }

      const customer = inv.customer || {};
      const customerName =
        [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() ||
        customer.name ||
        null;

      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber || inv.number || null,
        status: inv.status,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        total: inv.totals?.total ?? inv.total ?? null,
        currency: inv.currency || inv.totals?.currency || null,
        customerEmail: customer.email || null,
        customerName,
        orderId: inv.metadata?.orderId || inv.orderId || null,
        previewUrl,
      };
    })
  );

  return jsonResponse(200, { invoices: out });
}

// -----------------------------------------------------------------------------
// GET /_functions/invoice/{id}/pdf   →  302 redirect to PDF preview URL
//
// In Velo http-functions, anything after the function name is in request.path
// as an array of segments. So /_functions/invoice/abc-123/pdf yields:
//   function name: invoice
//   request.path:  ['abc-123', 'pdf']
// -----------------------------------------------------------------------------
export async function get_invoice(request) {
  const auth = await authorize(request);
  if (!auth.ok) return jsonResponse(auth.status, auth.body);

  const path = request.path || [];
  const id = path[0];
  const action = path[1];

  if (!id) {
    return jsonResponse(400, { error: 'Missing invoice id' });
  }
  if (action !== 'pdf') {
    return jsonResponse(404, { error: `Unknown subroute "${action || ''}", expected /pdf` });
  }

  console.log(`[invoice/${id}/pdf] authorized, fetching preview URL`);

  let previewUrl;
  try {
    previewUrl = await invoices.createInvoicePreviewUrl(id);
  } catch (err) {
    console.error('[invoice pdf] createInvoicePreviewUrl failed:', err);
    return jsonResponse(404, { error: 'Invoice not found or no preview', detail: String(err) });
  }

  return response({
    status: 302,
    headers: { Location: previewUrl, 'Cache-Control': 'no-store' },
    body: '',
  });
}
