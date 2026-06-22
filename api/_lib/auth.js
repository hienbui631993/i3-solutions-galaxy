import crypto from "node:crypto";
import { readFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Shared auth helpers. Gate = allowlisted email + shared password, with a
// signed 1-hour session. Email/OTP delivery has been dropped for now.
// No external dependencies: HS256 session tokens are built with node:crypto.
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

// Return the canonical allowlisted email matching the supplied email
// (case-insensitive exact match), or null if it is not on the list.
export function allowedEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) return null;
  return allowedEmails().find((a) => String(a).trim().toLowerCase() === e) || null;
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

// Today's date as YYYYMMDD — the daily-rotating password. Timezone defaults to
// UTC; override with AUTH_DATE_TZ (an IANA name, e.g. "America/Toronto").
export function dateCode(date = new Date(), tz = process.env.AUTH_DATE_TZ || "UTC") {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  return `${get("year")}${get("month")}${get("day")}`;
}

export const SECRETS = {
  session: () => process.env.AUTH_SESSION_SECRET || "dev-insecure-change-me",
  // Optional fixed override password; when unset, only the daily date works.
  override: () => process.env.AUTH_APP_PASSWORD || "",
};

export const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
