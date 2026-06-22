# 2FA Setup (serverless, hosted on Vercel)

The whole app is gated behind two factors:

1. **Username + password** — username is the part of your email *before* the `@`; the password is a single shared `AUTH_APP_PASSWORD`.
2. **A 6-digit one-time code** emailed to your allowlisted address.

On success the server sets a **1-hour** HttpOnly session cookie; after it expires you sign in again.

Only emails listed in [`api/_lib/allowed-users.json`](api/_lib/allowed-users.json) can sign in.

## How it works

| Endpoint | Purpose |
| --- | --- |
| `POST /api/request-code` | Looks up the username in the allowlist, generates a code, emails it, returns a signed (opaque) challenge. Returns the same shape for unknown users so accounts can't be enumerated. |
| `POST /api/verify` | Checks the password + the code against the challenge, then sets the 1-hour session cookie. |
| `GET /api/session` | Tells the client whether the cookie is still valid. |
| `POST /api/logout` | Clears the cookie. |

The one-time code is never stored on a server or committed to a file — it lives only inside a short-lived HMAC-signed challenge token and the email. No database required.

## One-time deployment (no local install needed)

1. **Create a Resend account** at https://resend.com, grab an **API key**. To email anyone other than your own Resend login, verify a sending domain.
2. **Import this repo into Vercel** at https://vercel.com/new → select `i3-solutions-galaxy`. Vercel auto-detects Vite (build `npm run build`, output `dist`) and runs the `/api` functions.
3. In the Vercel project, add **Environment Variables** (Settings → Environment Variables):
   - `AUTH_APP_PASSWORD` — the shared password
   - `AUTH_SESSION_SECRET` — random 32-byte hex (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `AUTH_CHALLENGE_SECRET` — another random 32-byte hex
   - `RESEND_API_KEY` — from step 1
   - `AUTH_EMAIL_FROM` — e.g. `i3 Solution Galaxy <noreply@yourdomain.com>`
   - *(optional)* `ANTHROPIC_API_KEY` — only if you also add an `api/ask.js` for the "Ask the universe" feature (see note below).
4. **Deploy.** Every push to this branch redeploys automatically.

## Managing who can sign in

Edit [`api/_lib/allowed-users.json`](api/_lib/allowed-users.json) — a JSON array of full emails — and push. Local parts (before the `@`) should be unique.

```json
[
  "marketing@i3international.com",
  "alice@i3international.com"
]
```

## Local development

The `/api/*` functions need the Vercel runtime, so plain `vite dev` can't serve them. Two options:

- **Test the real flow:** `npm i -g vercel && vercel dev` (serves the app *and* the functions; reads `.env`).
- **Skip auth while working on the UI:** set `VITE_DISABLE_AUTH=true` in `.env` and run `npm run dev`. Never set this in production.

## Notes / limitations

- **"Ask the universe"** still points at the dev-only `/api/ask` Vite middleware. On Vercel it won't work until a real `api/ask.js` function is added (deferred). The rest of the app is unaffected.
- This replaces the GitHub Pages host — the serverless gate can't run on Pages. The Pages workflow can be left in place or disabled; Vercel is now the live host.
- Password is shared across users. If you need per-user passwords, that requires a user store (e.g. Vercel KV) — ask and it can be added.
