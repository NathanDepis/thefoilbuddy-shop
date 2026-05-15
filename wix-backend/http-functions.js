/**
 * Velo backend — HTTP functions for the Pascalou invoice pipeline.
 *
 * Endpoints:
 *   GET  /_functions/ping              — no auth, returns {ok, ts}
 *   GET  /_functions/invoice/{id}/pdf  — Bearer auth, 302 to PDF preview
 *   GET  /_functions/pendingInvoices   — Bearer auth, list PendingInvoices
 *                                          (?status=pending|failed, ?limit=N)
 *   POST /_functions/markProcessed     — Bearer auth, mark a PendingInvoice
 *                                          as processed|failed
 *
 * Auth: `Authorization: Bearer <token>` matching Secrets Manager →
 * PASCALOU_BACKEND_SECRET.
 *
 * Storage:
 *   Wix Data collection `PendingInvoices` (created manually in CMS).
 *   See README for schema.
 */

import { invoices as legacyInvoices } from 'wix-billing-backend';
import { getSecret } from 'wix-secrets-backend';
import { ok, badRequest, forbidden, notFound, response } from 'wix-http-functions';
import wixData from 'wix-data';

const SECRET_NAME = 'PASCALOU_BACKEND_SECRET';
const COLLECTION = 'PendingInvoices';

async function checkAuth(request) {
  const header =
    (request.headers && (request.headers.authorization || request.headers.Authorization)) || '';
  if (!header.startsWith('Bearer ')) return false;
  const token = header.slice('Bearer '.length).trim();
  let expected;
  try {
    expected = await getSecret(SECRET_NAME);
  } catch (e) {
    console.error('[auth] getSecret failed:', e);
    return false;
  }
  return Boolean(expected) && token === expected;
}

function jsonBody(body) {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body, null, 2),
  };
}

// -----------------------------------------------------------------------------
// GET /_functions/ping (no auth)
// -----------------------------------------------------------------------------
export async function get_ping(request) {
  return ok(jsonBody({ ok: true, ts: new Date().toISOString() }));
}

// -----------------------------------------------------------------------------
// GET /_functions/pendingInvoices (auth)
// Query: ?status=pending|failed|processed (default pending), ?limit=N (max 100)
// -----------------------------------------------------------------------------
export async function get_pendingInvoices(request) {
  if (!(await checkAuth(request))) return forbidden(jsonBody({ error: 'unauthorized' }));

  const statusFilter = (request.query && request.query.status) || 'pending';
  const limit = Math.min(Number((request.query && request.query.limit) || 50), 100);

  if (!['pending', 'processed', 'failed'].includes(statusFilter)) {
    return badRequest(jsonBody({ error: 'invalid status' }));
  }

  let result;
  try {
    result = await wixData
      .query(COLLECTION)
      .eq('status', statusFilter)
      .ascending('createdAt')
      .limit(limit)
      .find({ suppressAuth: true });
  } catch (err) {
    console.error('[pendingInvoices] query failed:', err);
    return response({
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'collection query failed', detail: String(err) }),
    });
  }

  const items = result.items.map((i) => ({
    invoiceId: i.invoiceId,
    invoiceNumber: i.invoiceNumber,
    orderNumber: i.orderNumber,
    totalAmount: i.totalAmount,
    currency: i.currency,
    customerEmail: i.customerEmail,
    customerName: i.customerName,
    pdfUrl: i.pdfUrl,
    source: i.source,
    createdAt: i.createdAt,
    errorMessage: i.errorMessage || undefined,
  }));

  return ok(jsonBody({ count: items.length, items }));
}

// -----------------------------------------------------------------------------
// POST /_functions/markProcessed (auth)
// Body: { invoiceId, status: "processed"|"failed", driveFileId?, qontoTxnId?, errorMessage? }
// -----------------------------------------------------------------------------
export async function post_markProcessed(request) {
  if (!(await checkAuth(request))) return forbidden(jsonBody({ error: 'unauthorized' }));

  let body;
  try {
    body = await request.body.json();
  } catch (e) {
    return badRequest(jsonBody({ error: 'invalid JSON body', detail: String(e) }));
  }

  const { invoiceId, driveFileId, qontoTxnId, status, errorMessage } = body || {};
  if (!invoiceId || !['processed', 'failed'].includes(status)) {
    return badRequest(jsonBody({ error: 'invoiceId and valid status (processed|failed) required' }));
  }

  let result;
  try {
    result = await wixData.query(COLLECTION).eq('invoiceId', invoiceId).find({ suppressAuth: true });
  } catch (err) {
    return response({
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'lookup failed', detail: String(err) }),
    });
  }

  if (result.items.length === 0) {
    return notFound(jsonBody({ error: 'invoice not found in PendingInvoices' }));
  }

  const item = result.items[0];
  item.status = status;
  item.processedAt = new Date();
  if (driveFileId) item.driveFileId = driveFileId;
  if (qontoTxnId) item.qontoTxnId = qontoTxnId;
  if (errorMessage) item.errorMessage = errorMessage;

  try {
    await wixData.update(COLLECTION, item, { suppressAuth: true });
  } catch (err) {
    return response({
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'update failed', detail: String(err) }),
    });
  }

  console.log(`[markProcessed] ${invoiceId} -> ${status}`);
  return ok(jsonBody({ ok: true, invoiceId, status }));
}

// -----------------------------------------------------------------------------
// GET /_functions/invoice/{id}/pdf — 302 redirect to PDF preview URL
// Path: /_functions/invoice/<INVOICE_ID>/pdf
//   request.path = ['<INVOICE_ID>', 'pdf']
// -----------------------------------------------------------------------------
export async function get_invoice(request) {
  if (!(await checkAuth(request))) return forbidden(jsonBody({ error: 'unauthorized' }));

  const path = request.path || [];
  const id = path[0];
  const action = path[1];

  if (!id) return badRequest(jsonBody({ error: 'Missing invoice id' }));
  if (action !== 'pdf') return notFound(jsonBody({ error: `Unknown subroute "${action || ''}", expected /pdf` }));

  let previewUrl;
  try {
    previewUrl = await legacyInvoices.createInvoicePreviewUrl(id);
  } catch (err) {
    return notFound(jsonBody({ error: 'Invoice not found or no preview', detail: String(err) }));
  }

  return response({
    status: 302,
    headers: { Location: previewUrl, 'Cache-Control': 'no-store' },
    body: '',
  });
}
