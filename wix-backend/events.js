/**
 * Velo backend events — billing hooks.
 *
 * Wired up by Wix when the file is named `backend/events.js` and exports
 * functions named after the event (e.g. `wixBilling_onInvoicePaid`).
 *
 * Source of truth for invoice "paid" events. Each event creates a row in the
 * `PendingInvoices` collection so Pascalou can pick it up via /pendingInvoices.
 * The handler is idempotent: re-running for the same invoiceId is a no-op.
 *
 * If the exact event name `wixBilling_onInvoicePaid` is not what fires on this
 * site, add a matching handler (e.g. `wixBilling_onInvoiceCreated` or the v2
 * dispatch under wix-billing.v2/invoices_onInvoicePaid) — Wix will only call
 * exports that match registered event names.
 */

import { invoices } from 'wix-billing-backend';
import wixData from 'wix-data';

const COLLECTION = 'PendingInvoices';

async function queueInvoice(invoiceId, source) {
  // Idempotence — skip if already queued.
  const existing = await wixData
    .query(COLLECTION)
    .eq('invoiceId', invoiceId)
    .find({ suppressAuth: true });
  if (existing.items.length > 0) {
    console.log(`[queueInvoice] ${invoiceId} already queued, skipping`);
    return { skipped: true };
  }

  // Fetch invoice detail for number, customer, total.
  const inv = await invoices.getInvoice(invoiceId);
  const previewUrl = await invoices.createInvoicePreviewUrl(invoiceId);

  const customer = inv.customer || {};
  const customerName =
    [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() ||
    customer.name ||
    '';
  const orderNumberRaw = inv.metadata && inv.metadata.sourceRefId;
  const orderNumber = orderNumberRaw && !Number.isNaN(Number(orderNumberRaw))
    ? Number(orderNumberRaw)
    : null;
  const totalAmount = Number(
    (inv.totals && inv.totals.total) || inv.total || 0
  );

  await wixData.insert(
    COLLECTION,
    {
      invoiceId,
      invoiceNumber: inv.invoiceNumber || inv.number || '',
      orderNumber,
      totalAmount,
      currency: inv.currency || (inv.totals && inv.totals.currency) || 'EUR',
      customerEmail: customer.email || '',
      customerName,
      pdfUrl: typeof previewUrl === 'string' ? previewUrl : (previewUrl && previewUrl.url) || '',
      status: 'pending',
      source,
      createdAt: new Date(),
    },
    { suppressAuth: true }
  );

  console.log(`[queueInvoice] queued ${invoiceId} (source=${source})`);
  return { skipped: false };
}

export async function wixBilling_onInvoicePaid(event) {
  try {
    const invoiceId = (event && (event.invoiceId || event.id)) || (event && event.invoice && event.invoice.id);
    if (!invoiceId) {
      console.error('[wixBilling_onInvoicePaid] no invoice id in event payload:', JSON.stringify(event).slice(0, 500));
      return;
    }
    await queueInvoice(invoiceId, 'webhook');
  } catch (err) {
    console.error('[wixBilling_onInvoicePaid] error:', err);
  }
}

// Also handle the "created" and "sent" events as belt-and-suspenders — if a
// paid invoice is created in a single step (e.g. POS or manual mark-as-paid
// without status transition), at least the "created" event will fire.
export async function wixBilling_onInvoiceCreated(event) {
  try {
    const invoiceId = (event && (event.invoiceId || event.id)) || (event && event.invoice && event.invoice.id);
    if (!invoiceId) return;
    // Only queue if it's already paid — avoid queuing drafts.
    const inv = await invoices.getInvoice(invoiceId);
    if (inv && (inv.status === 'PAID' || inv.status === 'paid')) {
      await queueInvoice(invoiceId, 'webhook');
    }
  } catch (err) {
    console.error('[wixBilling_onInvoiceCreated] error:', err);
  }
}
