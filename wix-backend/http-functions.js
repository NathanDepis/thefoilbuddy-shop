/**
 * Velo backend — HTTP functions for invoice PDF access.
 *
 * Endpoints:
 *   GET /_functions/ping              — no auth, returns {ok, ts}
 *   GET /_functions/invoice/{id}/pdf  — Bearer auth, 302 to PDF preview
 *
 * Listing invoices via Velo is not possible on this site (classic Wix Editor,
 * legacy wix-billing-backend has no list/query method, v2 module exposes only
 * tax sub-modules, and wix-fetch to the internal manage.wix.com API returns
 * 401 NOT_AUTHENTICATED). Invoice listing/data is handled by Pascalou through
 * the Wix eCom Orders REST API + own invoice generation. This Velo proxy is
 * kept only for fetching the PDF of a known Wix invoice by ID, via the
 * `createInvoicePreviewUrl(invoiceId)` Velo API.
 *
 * Auth: `Authorization: Bearer <token>` matching Secrets Manager →
 * PASCALOU_BACKEND_SECRET.
 */

import { invoices as legacyInvoices } from 'wix-billing-backend';
import { getSecret } from 'wix-secrets-backend';
import { response } from 'wix-http-functions';

const SECRET_NAME = 'PASCALOU_BACKEND_SECRET';

function jsonResponse(status, body) {
  return response({
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body, null, 2),
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
    return { ok: false, status: 500, body: { error: 'Secret config error', detail: String(e) } };
  }
  if (!expected || token !== expected) {
    return { ok: false, status: 401, body: { error: 'Invalid token' } };
  }
  return { ok: true };
}

// -----------------------------------------------------------------------------
// GET /_functions/ping (no auth)
// -----------------------------------------------------------------------------
export async function get_ping(request) {
  return jsonResponse(200, { ok: true, ts: new Date().toISOString() });
}

// -----------------------------------------------------------------------------
// GET /_functions/invoice/{id}/pdf — 302 redirect to PDF preview URL
//
// Path pattern: /_functions/invoice/<INVOICE_ID>/pdf
// `request.path` contains the segments after the function name:
//   ['<INVOICE_ID>', 'pdf']
// -----------------------------------------------------------------------------
export async function get_invoice(request) {
  const auth = await authorize(request);
  if (!auth.ok) return jsonResponse(auth.status, auth.body);

  const path = request.path || [];
  const id = path[0];
  const action = path[1];

  if (!id) return jsonResponse(400, { error: 'Missing invoice id' });
  if (action !== 'pdf') {
    return jsonResponse(404, { error: `Unknown subroute "${action || ''}", expected /pdf` });
  }

  let previewUrl;
  try {
    previewUrl = await legacyInvoices.createInvoicePreviewUrl(id);
  } catch (err) {
    return jsonResponse(404, { error: 'Invoice not found or no preview', detail: String(err) });
  }

  return response({
    status: 302,
    headers: { Location: previewUrl, 'Cache-Control': 'no-store' },
    body: '',
  });
}
