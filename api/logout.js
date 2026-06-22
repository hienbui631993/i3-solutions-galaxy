import { sessionCookie } from "./_lib/auth.js";

// POST -> clears the session cookie.
export default function handler(req, res) {
  res.setHeader("Set-Cookie", sessionCookie("", 0));
  return res.status(200).json({ ok: true });
}
