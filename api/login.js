import { allowedEmail, makeSession, sessionCookie, safeEqual, SECRETS, SESSION_TTL_MS } from "./_lib/auth.js";

// POST { email, password }  ->  sets a 1-hour session cookie on success.
// Email must be on the allowlist and the password must match AUTH_APP_PASSWORD.
export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body || {};
  const match = allowedEmail(email);
  const appPw = SECRETS.password();
  const pwOk = !!appPw && safeEqual(password || "", appPw);

  if (!match || !pwOk) return res.status(401).json({ error: "Invalid email or password." });

  const token = makeSession(match, SESSION_TTL_MS, SECRETS.session());
  res.setHeader("Set-Cookie", sessionCookie(token, Math.floor(SESSION_TTL_MS / 1000)));
  return res.status(200).json({ ok: true, email: match });
}
