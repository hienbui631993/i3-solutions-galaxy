# Auth Setup (serverless, hosted on Vercel)

The whole app is gated behind a sign-in:

1. **Email** — must be on the allowlist in [`api/_lib/allowed-users.json`](api/_lib/allowed-users.json).
2. **Password** — **today's date as `YYYYMMDD`** (e.g. `20260622`), which rotates daily. Timezone for "today" defaults to UTC; set `AUTH_DATE_TZ` (e.g. `America/Toronto`) to change it. An optional fixed `AUTH_APP_PASSWORD` is also accepted as an admin override.

On success the server sets a **1-hour** HttpOnly session cookie; after it expires you sign in again.

> Email one-time codes have been dropped for now. The second factor can be re-added later (emailed code via a provider, or a TOTP authenticator app).

## How it works

| Endpoint | Purpose |
| --- | --- |
| `POST /api/login` | Verifies the email is allowlisted and the password matches, then sets the 1-hour session cookie. |
| `GET /api/session` | Tells the client whether the cookie is still valid. |
| `POST /api/logout` | Clears the cookie. |

No database required — the session is a stateless HMAC-signed token.

## One-time deployment (no local install needed)

1. **Import this repo into Vercel** at https://vercel.com/new → select `i3-solutions-galaxy`. Vercel auto-detects Vite (build `npm run build`, output `dist`) and runs the `/api` functions.
2. In the Vercel project, add **Environment Variables** (Settings → Environment Variables):
   - `AUTH_SESSION_SECRET` — random 32-byte hex (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - *(optional)* `AUTH_DATE_TZ` — IANA timezone for the daily date password (default UTC)
   - *(optional)* `AUTH_APP_PASSWORD` — fixed admin-override password
   - *(optional)* `ANTHROPIC_API_KEY` — only if you also add an `api/ask.js` for the "Ask the universe" feature.
3. **Deploy.** Every push to this branch redeploys automatically.

## Managing who can sign in

Edit [`api/_lib/allowed-users.json`](api/_lib/allowed-users.json) — a JSON array of full emails — and push. Users sign in with their full email.

```json
[
  "marketing@i3international.com",
  "alice@i3international.com"
]
```

## Local development

The `/api/*` functions run as Vite dev middleware, so the full sign-in works with plain `npm run dev`. Create a `.env` in the project root:

```
AUTH_SESSION_SECRET=any-long-random-string
# optional override; otherwise the password is today's date (YYYYMMDD)
# AUTH_APP_PASSWORD=demo1234
```

Then `npm run dev` and sign in with an allowlisted email and today's date as the password (e.g. `20260622`).

To skip the gate entirely while working on the UI, set `VITE_DISABLE_AUTH=true` in `.env`. Never set this in production.

## Notes

- **"Ask the universe"** still uses the dev-only `/api/ask` Vite middleware. On Vercel it won't work until a real `api/ask.js` function is added (deferred). The rest of the app is unaffected.
- This runs on Vercel — the serverless gate can't run on GitHub Pages.
- Password is shared across users. Per-user passwords would need a user store (e.g. Vercel KV) — ask and it can be added.
