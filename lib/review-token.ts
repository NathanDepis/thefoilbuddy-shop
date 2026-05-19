import { createHmac, timingSafeEqual } from 'node:crypto';

export type ReviewTokenPayload = {
  orderId: string;
  firstName: string;
  productSlug: string;
  productName: string;
  locale: 'fr' | 'en';
  exp: number;
};

function getSecret(): string {
  const s = process.env.REVIEW_TOKEN_SECRET;
  if (!s) throw new Error('REVIEW_TOKEN_SECRET not set');
  return s;
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

export function signReviewToken(payload: Omit<ReviewTokenPayload, 'exp'>, ttlDays = 180): string {
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 86400;
  const body = b64urlEncode(Buffer.from(JSON.stringify({ ...payload, exp })));
  const sig = b64urlEncode(createHmac('sha256', getSecret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyReviewToken(
  token: string,
  expectedOrderId?: string,
  expectedLocale?: 'fr' | 'en',
): { valid: true; payload: ReviewTokenPayload } | { valid: false; reason: string } {
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'malformed' };
  const [body, sig] = parts;
  let expected: string;
  try {
    expected = b64urlEncode(createHmac('sha256', getSecret()).update(body).digest());
  } catch {
    return { valid: false, reason: 'server-misconfigured' };
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { valid: false, reason: 'bad-signature' };
  let payload: ReviewTokenPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString('utf8'));
  } catch {
    return { valid: false, reason: 'bad-payload' };
  }
  if (expectedOrderId && payload.orderId !== expectedOrderId) return { valid: false, reason: 'order-mismatch' };
  if (expectedLocale && payload.locale !== expectedLocale) return { valid: false, reason: 'locale-mismatch' };
  if (payload.exp < Math.floor(Date.now() / 1000)) return { valid: false, reason: 'expired' };
  return { valid: true, payload };
}
