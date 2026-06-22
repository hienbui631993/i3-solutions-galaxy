import { allowedEmail, makeChallenge, sendCodeEmail, SECRETS, CODE_TTL_MS } from "./_lib/auth.js";

// POST { email }  ->  { ok, challenge }
// Always returns a challenge (even for unknown emails) so the response does not
// reveal whether an account exists. Only allowlisted emails receive a code.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body || {};
  const match = allowedEmail(email);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const challenge = makeChallenge(match || `unknown@${Date.now()}.invalid`, code, CODE_TTL_MS, SECRETS.challenge());

  if (match) await sendCodeEmail(match, code);

  return res.status(200).json({ ok: true, challenge });
}
