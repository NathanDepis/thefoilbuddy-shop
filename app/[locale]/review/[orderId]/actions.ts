'use server';

import { verifyReviewToken } from '@/lib/review-token';

type SubmitInput = {
  locale: 'fr' | 'en';
  orderId: string;
  token: string;
  productSlug: string;
  productName: string;
  firstName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  body?: string;
  location?: string;
};

const STAR = '★';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function submitReview(input: SubmitInput): Promise<{ ok: true } | { ok: false; reason: string }> {
  const verified = verifyReviewToken(input.token, input.orderId, input.locale);
  if (!verified.valid) return { ok: false, reason: verified.reason };
  if (input.rating < 1 || input.rating > 5) return { ok: false, reason: 'bad-rating' };

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[submitReview] BREVO_API_KEY missing');
    return { ok: false, reason: 'server-misconfigured' };
  }

  const stars = STAR.repeat(input.rating) + '☆'.repeat(5 - input.rating);
  const subject = `🌟 Nouvel avis — ${input.rating}★ ${input.productName} — ${input.firstName}`;

  const structured = {
    type: 'review-submission',
    orderId: input.orderId,
    productSlug: input.productSlug,
    productName: input.productName,
    firstName: input.firstName,
    rating: input.rating,
    title: input.title || null,
    body: input.body || null,
    location: input.location || null,
    locale: input.locale,
    submittedAt: new Date().toISOString(),
  };

  const html = `
<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#222;line-height:1.6;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px;font-size:20px">Nouvel avis reçu</h2>
  <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
    <tr><td style="color:#888">Produit</td><td><strong>${escapeHtml(input.productName)}</strong></td></tr>
    <tr><td style="color:#888">Client</td><td><strong>${escapeHtml(input.firstName)}</strong>${input.location ? ` (${escapeHtml(input.location)})` : ''}</td></tr>
    <tr><td style="color:#888">Commande</td><td>${escapeHtml(input.orderId)}</td></tr>
    <tr><td style="color:#888">Langue</td><td>${input.locale.toUpperCase()}</td></tr>
    <tr><td style="color:#888">Note</td><td style="font-size:20px;color:#FFC937">${stars} <span style="color:#222;font-size:14px">(${input.rating}/5)</span></td></tr>
    ${input.title ? `<tr><td style="color:#888">Titre</td><td><strong>${escapeHtml(input.title)}</strong></td></tr>` : ''}
  </table>
  ${input.body ? `<div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px;white-space:pre-wrap">${escapeHtml(input.body)}</div>` : '<p style="color:#999;font-style:italic;margin-top:20px">(pas de commentaire libre)</p>'}
  <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
  <p style="font-size:12px;color:#888">${input.rating >= 4 ? '✅ <strong>Auto-publication suggérée</strong> (≥4★).' : '⚠️ <strong>Modération requise</strong> (&lt;4★).'} Décision finale dans le pipeline Pascalou.</p>
  <details style="margin-top:12px"><summary style="font-size:11px;color:#aaa;cursor:pointer">Payload structuré (pour parsing)</summary>
  <pre style="font-size:11px;background:#fafafa;padding:12px;border-radius:6px;overflow-x:auto">${escapeHtml(JSON.stringify(structured, null, 2))}</pre>
  </details>
</body></html>`.trim();

  const text = [
    `Nouvel avis reçu`,
    ``,
    `Produit  : ${input.productName}`,
    `Client   : ${input.firstName}${input.location ? ` (${input.location})` : ''}`,
    `Commande : ${input.orderId}`,
    `Langue   : ${input.locale}`,
    `Note     : ${stars} (${input.rating}/5)`,
    input.title ? `Titre    : ${input.title}` : '',
    ``,
    input.body || '(pas de commentaire libre)',
    ``,
    `---`,
    input.rating >= 4 ? 'Auto-publication suggérée (>=4★).' : 'Modération requise (<4★).',
    ``,
    `JSON payload:`,
    JSON.stringify(structured, null, 2),
  ].filter(Boolean).join('\n');

  const payload = {
    sender: { email: 'support@thefoilbuddy.com', name: 'TheFoilBuddy reviews' },
    to: [{ email: 'depis.sarl@gmail.com', name: 'Nathan' }],
    replyTo: { email: 'support@thefoilbuddy.com' },
    subject,
    htmlContent: html,
    textContent: text,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    console.error('[submitReview] Brevo send failed:', res.status, errBody);
    return { ok: false, reason: 'send-failed' };
  }
  return { ok: true };
}
