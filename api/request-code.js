import { emailForUsername, makeChallenge, sendCodeEmail, SECRETS, CODE_TTL_MS } from "./_lib/auth.js";

// POST { username }  ->  { ok, challenge }
// Always returns a challenge (even for unknown users) so the response does not
// reveal whether an account exists. Only real, allowlisted users receive a code.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username } = req.body || {};
  const email = emailForUsername(username);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const challenge = makeChallenge(email || `unknown@${Date.now()}.invalid`, code, CODE_TTL_MS, SECRETS.challenge());

  if (email) await sendCodeEmail(email, code);

  return res.status(200).json({ ok: true, challenge });
}
