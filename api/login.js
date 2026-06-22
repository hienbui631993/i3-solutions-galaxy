import { allowedEmail, dateCode, makeSession, sessionCookie, safeEqual, SECRETS, SESSION_TTL_MS } from "./_lib/auth.js";

// POST { email, password }  ->  sets a 1-hour session cookie on success.
// Email must be on the allowlist. Password is today's date as YYYYMMDD
// (rotates daily); an optional AUTH_APP_PASSWORD override is also accepted.
export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body || {};
  const match = allowedEmail(email);

  const pw = String(password || "");
  const override = SECRETS.override();
  const pwOk = safeEqual(pw, dateCode()) || (!!override && safeEqual(pw, override));

  if (!match || !pwOk) return res.status(401).json({ error: "Invalid email or password." });

  const token = makeSession(match, SESSION_TTL_MS, SECRETS.session());
  res.setHeader("Set-Cookie", sessionCookie(token, Math.floor(SESSION_TTL_MS / 1000)));
  return res.status(200).json({ ok: true, email: match });
}
