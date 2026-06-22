import React, { useEffect, useState } from "react";

/**
 * Whole-app auth gate. Two factors:
 *   1. username (email local part) + shared password
 *   2. a 6-digit one-time code emailed to the allowlisted address
 * On success the server sets a 1-hour HttpOnly session cookie; this gate
 * checks it on load and re-prompts once it expires.
 *
 * Local dev without the serverless backend: set VITE_DISABLE_AUTH=true.
 */

const wrap = { position: "fixed", inset: 0, background: "#0a1428", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", color: "#e6f1ff", padding: 20 };
const card = { width: "100%", maxWidth: 360, background: "rgba(11,17,33,0.95)", border: "1px solid rgba(120,150,210,0.25)", borderRadius: 16, padding: "26px 24px", boxShadow: "0 18px 60px rgba(0,0,0,0.55)" };
const label = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7e8eae", marginBottom: 6, display: "block" };
const input = { width: "100%", boxSizing: "border-box", background: "rgba(13,20,38,0.9)", border: "1px solid rgba(120,150,210,0.3)", borderRadius: 9, color: "#eaf1ff", fontSize: 14, padding: "10px 12px", outline: "none", marginBottom: 14, fontFamily: "inherit" };
const btn = { width: "100%", background: "linear-gradient(135deg,#00588f,#2b9fd6)", border: "none", color: "#eaf4ff", fontWeight: 700, fontSize: 14, padding: "11px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" };

export default function AuthGate({ children }) {
  const bypass = import.meta.env.VITE_DISABLE_AUTH === "true";
  const [stage, setStage] = useState(bypass ? "in" : "loading"); // loading | login | code | in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (bypass) return;
    fetch("/api/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStage(d && d.authenticated ? "in" : "login"))
      .catch(() => setStage("login"));
  }, [bypass]);

  const sendCode = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password) { setErr("Enter your email and password."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const d = await r.json();
      if (d && d.challenge) { setChallenge(d.challenge); setCode(""); setStage("code"); }
      else setErr("Could not start sign-in. Please try again.");
    } catch { setErr("Network error. Please try again."); }
    setBusy(false);
  };

  const verify = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge, code: code.trim(), password }),
      });
      if (r.ok) { setPassword(""); setStage("in"); }
      else { const d = await r.json().catch(() => ({})); setErr(d.error || "Invalid password or code."); }
    } catch { setErr("Network error. Please try again."); }
    setBusy(false);
  };

  if (stage === "in") return children;
  if (stage === "loading") return <div style={{ ...wrap, color: "#7e8eae" }}>Loading…</div>;

  return (
    <div style={wrap}>
      <form style={card} onSubmit={stage === "login" ? sendCode : verify}>
        <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 4 }}>i3 Solution Galaxy</div>
        <div style={{ fontSize: 12.5, color: "#8595b3", marginBottom: 20 }}>
          {stage === "login" ? "Sign in to continue" : "Enter the 6-digit code we emailed you."}
        </div>

        {stage === "login" ? (
          <>
            <label style={label}>Email</label>
            <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@i3international.com" autoFocus autoComplete="email" />
            <label style={label}>Password</label>
            <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </>
        ) : (
          <>
            <label style={label}>6-digit code</label>
            <input style={{ ...input, letterSpacing: "0.3em", fontSize: 18, textAlign: "center" }} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" inputMode="numeric" autoFocus />
          </>
        )}

        {err && <div style={{ color: "#ff8a93", fontSize: 12.5, marginBottom: 12 }}>{err}</div>}

        <button style={{ ...btn, opacity: busy ? 0.7 : 1 }} disabled={busy} type="submit">
          {busy ? "Please wait…" : stage === "login" ? "Send code →" : "Verify & enter"}
        </button>

        {stage === "code" && (
          <div onClick={() => { setStage("login"); setErr(""); }} style={{ textAlign: "center", marginTop: 14, fontSize: 12.5, color: "#7fb0ff", cursor: "pointer" }}>← Use a different account</div>
        )}

        <div style={{ marginTop: 16, fontSize: 10.5, color: "#5d6b87", lineHeight: 1.5, textAlign: "center" }}>
          Access is limited to approved accounts. Sessions last 1 hour.
        </div>
      </form>
    </div>
  );
}
