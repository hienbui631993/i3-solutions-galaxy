import React, { useEffect, useState } from "react";

/**
 * Whole-app auth gate: allowlisted email + shared password, with a 1-hour
 * server session cookie. (Email/OTP second factor has been dropped for now.)
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
  const [stage, setStage] = useState(bypass ? "in" : "loading"); // loading | login | in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (bypass) return;
    fetch("/api/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStage(d && d.authenticated ? "in" : "login"))
      .catch(() => setStage("login"));
  }, [bypass]);

  const login = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password) { setErr("Enter your email and password."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (r.ok) { setPassword(""); setStage("in"); }
      else { const d = await r.json().catch(() => ({})); setErr(d.error || "Invalid email or password."); }
    } catch { setErr("Network error. Please try again."); }
    setBusy(false);
  };

  if (stage === "in") return children;
  if (stage === "loading") return <div style={{ ...wrap, color: "#7e8eae" }}>Loading…</div>;

  return (
    <div style={wrap}>
      <form style={card} onSubmit={login}>
        <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 4 }}>i3 Solution Galaxy</div>
        <div style={{ fontSize: 12.5, color: "#8595b3", marginBottom: 20 }}>Sign in to continue</div>

        <label style={label}>Email</label>
        <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@i3international.com" autoFocus autoComplete="email" />
        <label style={label}>Password</label>
        <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

        {err && <div style={{ color: "#ff8a93", fontSize: 12.5, marginBottom: 12 }}>{err}</div>}

        <button style={{ ...btn, opacity: busy ? 0.7 : 1 }} disabled={busy} type="submit">
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div style={{ marginTop: 16, fontSize: 10.5, color: "#5d6b87", lineHeight: 1.5, textAlign: "center" }}>
          Access is limited to approved accounts. Sessions last 1 hour.
        </div>
      </form>
    </div>
  );
}
