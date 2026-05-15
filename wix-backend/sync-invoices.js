/**
 * Daily reconcile job — safety net for the webhook-driven pipeline.
 *
 * Runs at 02:00 UTC every day (configured in jobs.config). For each Wix eCom
 * order paid in the last 72h, checks if there's already a PendingInvoices row
 * for it. If not, attempts to find the linked Wix Invoice via the Order
 * Invoices V2 REST API (Developer Preview at time of writing) and queues it.
 *
 * Failure modes are tolerated:
 *   - If the Order Invoices REST endpoint isn't accessible / not in preview
 *     for this site, we log and skip that order. The webhook path covers
 *     real-time events, this is purely backfill.
 *   - If we can't find an invoice for an order (cash payment, manual order,
 *     etc.), we skip silently.
 */

import { orders } from 'wix-ecom-backend';
import { invoices } from 'wix-billing-backend';
import { fetch } from 'wix-fetch';
import wixData from 'wix-data';

const COLLECTION = 'PendingInvoices';
const LOOKBACK_HOURS = 72;
const MAX_ORDERS = 100;

// Helper: try to find the invoice associated with a given order via the
// Wix REST API. Returns the first invoice object or null. Throws on
// transport errors so the caller can log and continue.
async function findInvoiceForOrder(orderId) {
  // Order Invoices V2 — Developer Preview path. Adjust if Wix moves it.
  // Doc: https://dev.wix.com/docs/api-reference/business-solutions/e-commerce/orders/order-invoices/introduction
  const url = 'https://www.wixapis.com/ecom/v2/orders/invoices/list-by-orders';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderIds: [orderId] }),
  });
  if (!res.ok) {
    throw new Error(`order-invoices list failed: HTTP ${res.status}`);
  }
  const data = await res.json();
  const first = data && data.orderInvoices && data.orderInvoices[0];
  return (first && first.invoices && first.invoices[0]) || null;
}

export async function reconcileRecentInvoices() {
  const since = new Date(Date.now() - LOOKBACK_HOURS * 3600 * 1000).toISOString();
  console.log(`[reconcile] starting, lookback since ${since}`);

  let paidOrders;
  try {
    paidOrders = await orders.searchOrders({
      filter: {
        paymentStatus: 'PAID',
        _createdDate: { $gte: since },
      },
      sort: [{ fieldName: 'createdDate', order: 'DESC' }],
      cursorPaging: { limit: MAX_ORDERS },
    });
  } catch (err) {
    console.error('[reconcile] searchOrders failed:', err);
    return { ok: false, reason: 'searchOrders failed', detail: String(err) };
  }

  const orderList = (paidOrders && paidOrders.orders) || [];
  console.log(`[reconcile] ${orderList.length} paid orders in window`);

  let reconciled = 0;
  let skippedExisting = 0;
  let skippedNoInvoice = 0;
  let restErrors = 0;

  for (const order of orderList) {
    const orderNumber = Number(order.number);
    if (Number.isNaN(orderNumber)) continue;

    // Skip if already queued by orderNumber.
    let existing;
    try {
      existing = await wixData
        .query(COLLECTION)
        .eq('orderNumber', orderNumber)
        .find({ suppressAuth: true });
    } catch (e) {
      console.error(`[reconcile] query failed for order ${orderNumber}:`, e);
      continue;
    }
    if (existing.items.length > 0) {
      skippedExisting++;
      continue;
    }

    let inv = null;
    try {
      inv = await findInvoiceForOrder(order.id);
    } catch (err) {
      restErrors++;
      console.error(`[reconcile] order ${orderNumber}: REST lookup failed:`, err);
      continue;
    }

    if (!inv || !inv.id) {
      skippedNoInvoice++;
      continue;
    }

    let previewUrl = '';
    try {
      const p = await invoices.createInvoicePreviewUrl(inv.id);
      previewUrl = typeof p === 'string' ? p : (p && p.url) || '';
    } catch (e) {
      console.warn(`[reconcile] previewUrl failed for ${inv.id}:`, e);
    }

    const buyerInfo = order.buyerInfo || {};
    const contact = (order.billingInfo && order.billingInfo.contactDetails) || {};
    const customerName = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim();

    try {
      await wixData.insert(
        COLLECTION,
        {
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber || inv.number || '',
          orderNumber,
          totalAmount: Number(
            (order.priceSummary && order.priceSummary.total && order.priceSummary.total.amount) || 0
          ),
          currency: order.currency || 'EUR',
          customerEmail: buyerInfo.email || '',
          customerName,
          pdfUrl: previewUrl,
          status: 'pending',
          source: 'reconcile',
          createdAt: new Date(),
        },
        { suppressAuth: true }
      );
      reconciled++;
    } catch (err) {
      console.error(`[reconcile] insert failed for order ${orderNumber}:`, err);
    }
  }

  const summary = {
    ok: true,
    totalOrders: orderList.length,
    reconciled,
    skippedExisting,
    skippedNoInvoice,
    restErrors,
  };
  console.log('[reconcile] done:', JSON.stringify(summary));
  return summary;
}
