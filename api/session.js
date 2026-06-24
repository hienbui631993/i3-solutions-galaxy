import { parseCookies, readSession, SECRETS } from "./_lib/auth.js";

// GET -> { authenticated, email? }. Used by the client gate on load.
export default function handler(req, res) {
  const token = parseCookies(req).i3_session;
  const data = token ? readSession(token, SECRETS.session()) : null;
  if (!data) return res.status(401).json({ authenticated: false });
  return res.status(200).json({ authenticated: true, email: data.email });
}
