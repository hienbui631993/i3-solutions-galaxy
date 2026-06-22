import crypto from "node:crypto";
import { readFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Shared auth helpers for the serverless functions. No external dependencies:
// HMAC challenge tokens + HS256 session JWTs are built with node:crypto.
// ---------------------------------------------------------------------------

const b64url = (buf) => Buffer.from(buf).toString("base64url");
const hmac = (data, secret) => crypto.createHmac("sha256", secret).update(data).digest("base64url");

// ---- allowlist (emails permitted to sign in) ------------------------------
export function allowedEmails() {
  try {
    const raw = readFileSync(new URL("./allowed-users.json", import.meta.url), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.emails || [];
  } catch {
    return [];
  }
}

// The user signs in with the local part of their email (everything before @).
// Return the full allowlisted email whose local part matches, or null.
export function emailForUsername(username) {
  const u = String(username || "").trim().toLowerCase();
  if (!u) return null;
  return allowedEmails().find((e) => String(e).split("@")[0].toLowerCase() === u) || null;
}

// ---- stateless OTP challenge ----------------------------------------------
// token = base64url(JSON{email,code,exp}) + "." + HMAC. The code is never
// exposed in plaintext to the client; it is only delivered by email.
export function makeChallenge(email, code, ttlMs, secret) {
  const payload = b64url(JSON.stringify({ email, code, exp: Date.now() + ttlMs }));
  return `${payload}.${hmac(payload, secret)}`;
}
export function readChallenge(token, secret) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (hmac(payload, secret) !== sig) return null;
  let data;
  try { data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch { return null; }
  if (!data || Date.now() > data.exp) return null;
  return data;
}

// ---- session JWT (HS256) ---------------------------------------------------
export function makeSession(email, ttlMs, secret) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ email, exp: Math.floor((Date.now() + ttlMs) / 1000) }));
  return `${header}.${body}.${hmac(`${header}.${body}`, secret)}`;
}
export function readSession(token, secret) {
  if (typeof token !== "string" || token.split(".").length !== 3) return null;
  const [header, body, sig] = token.split(".");
  if (hmac(`${header}.${body}`, secret) !== sig) return null;
  let data;
  try { data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch { return null; }
  if (!data || Date.now() / 1000 > data.exp) return null;
  return data;
}

// ---- helpers ---------------------------------------------------------------
export function safeEqual(a, b) {
  const ab = Buffer.from(String(a)), bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function parseCookies(req) {
  const out = {};
  (req.headers.cookie || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

export function sessionCookie(value, maxAgeSec) {
  return [`i3_session=${value}`, "Path=/", "HttpOnly", "SameSite=Strict", "Secure", `Max-Age=${maxAgeSec}`].join("; ");
}

// ---- email delivery (Resend HTTP API, no SDK) -----------------------------
export async function sendCodeEmail(toEmail, code) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM || "i3 Solution Galaxy <onboarding@resend.dev>";
  if (!key) {
    // No provider configured — log so it still works during local/dev testing.
    console.warn(`[auth] RESEND_API_KEY not set. One-time code for ${toEmail}: ${code}`);
    return { ok: false, dev: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [toEmail],
        subject: "Your i3 Solution Galaxy sign-in code",
        text: `Your one-time sign-in code is ${code}. It expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`,
      }),
    });
    return { ok: res.ok };
  } catch (e) {
    console.error("[auth] email send failed:", e);
    return { ok: false };
  }
}

export const SECRETS = {
  challenge: () => process.env.AUTH_CHALLENGE_SECRET || process.env.AUTH_SESSION_SECRET || "dev-insecure-change-me",
  session: () => process.env.AUTH_SESSION_SECRET || "dev-insecure-change-me",
  password: () => process.env.AUTH_APP_PASSWORD || "",
};

export const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
export const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
