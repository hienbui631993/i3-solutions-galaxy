import { readChallenge, makeSession, sessionCookie, safeEqual, SECRETS, SESSION_TTL_MS } from "./_lib/auth.js";

// POST { challenge, code, password }  ->  sets 1h session cookie, { ok, email }
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { challenge, code, password } = req.body || {};
  const appPw = SECRETS.password();

  // First factor: shared password (constant-time compare).
  if (!appPw || !safeEqual(password || "", appPw)) {
    return res.status(401).json({ error: "Invalid password or code." });
  }

  // Second factor: the emailed one-time code, validated against the signed challenge.
  const data = readChallenge(challenge, SECRETS.challenge());
  if (!data || String(data.email).endsWith(".invalid") || !safeEqual(String(code || ""), String(data.code))) {
    return res.status(401).json({ error: "Invalid password or code." });
  }

  const token = makeSession(data.email, SESSION_TTL_MS, SECRETS.session());
  res.setHeader("Set-Cookie", sessionCookie(token, Math.floor(SESSION_TTL_MS / 1000)));
  return res.status(200).json({ ok: true, email: data.email });
}
