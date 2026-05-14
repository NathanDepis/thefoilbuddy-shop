# Wix Velo backend — invoice access endpoint

This folder is a **reference copy** of code that lives on a separate Wix Editor
or Wix Studio site. Vercel doesn't execute anything here — `thefoilbuddy.com`
serves the Next.js app, and these `/_functions/...` endpoints are reachable
only on the Wix-hosted URL of the Wix site that holds the invoices.

## What it exposes

| Method | Path                              | Auth        | Purpose                                  |
|--------|-----------------------------------|-------------|------------------------------------------|
| GET    | `/_functions/ping`                | none        | Health check, returns `{ok, ts}`.        |
| GET    | `/_functions/invoices`            | Bearer      | List invoices (filter `since`, `limit`). |
| GET    | `/_functions/invoice/{id}/pdf`    | Bearer      | 302 redirect to the PDF preview URL.     |

## Auth

`Authorization: Bearer <token>` where `<token>` is the secret stored in
Wix Secrets Manager under `PASCALOU_BACKEND_SECRET`.

## Deployment steps (do once, in the Wix dashboard)

1. Open the Wix site that owns the invoices in **Wix Editor** or **Wix Studio**.
2. Turn on **Dev Mode** (Velo) if it isn't already.
3. In the file tree, open `backend/http-functions.js` (Wix Studio:
   `src/backend/http-functions.js`). Replace its content with the code in
   `./http-functions.js`.
4. **Wix Dashboard → Settings → Developer Tools → Secrets Manager**:
   add a secret named `PASCALOU_BACKEND_SECRET` with the value you generated.
5. **Publish** the site (http-functions don't run in preview).
6. Note the public URL of the Wix site. Endpoints will be reachable at
   `https://<publish-url>/_functions/ping` etc. The custom domain
   `thefoilbuddy.com` points to Vercel, **not** to Wix — so it won't route here
   unless you configure it otherwise.

## Quick test

After publishing:

```sh
# 1. Should respond {"ok": true, "ts": "..."} without auth:
curl -s "https://<publish-url>/_functions/ping"

# 2. With auth, list 2 most recent invoices:
curl -s "https://<publish-url>/_functions/invoices?limit=2" \
  -H "Authorization: Bearer <PASCALOU_BACKEND_SECRET>"

# 3. With auth, follow 302 to the PDF preview:
curl -sIL "https://<publish-url>/_functions/invoice/<INVOICE_ID>/pdf" \
  -H "Authorization: Bearer <PASCALOU_BACKEND_SECRET>"
```

## Notes

- `wix-billing-backend.invoices` is the legacy stable API. If you've migrated
  to `wix-billing.v2/invoices`, the field names may differ — adjust the
  decoration step in `get_invoices` accordingly.
- The pagination loop assumes Wix returns `{ invoices: [...] }` or `{ items: [...] }`.
  If your API version returns a cursor instead of offset/limit, swap to cursor
  semantics inside the `while` loop.
- Logging goes to **Wix Dashboard → Settings → Site Monitoring**.
