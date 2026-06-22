import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Dev-only proxy for the "Ask the universe" feature.
 * The browser calls POST /api/ask; this middleware injects the secret
 * ANTHROPIC_API_KEY (never shipped to the client) and forwards to the
 * Anthropic Messages API, avoiding CORS and key exposure.
 *
 * Set the key in a .env file at the project root:  ANTHROPIC_API_KEY=sk-ant-...
 * (Vite loads .env automatically; the key is read server-side here, so it is
 *  NOT prefixed with VITE_ and never reaches the bundle.)
 *
 * NOTE: this runs only under `npm run dev`. A static `vite build` has no
 * server — for production, replace /api/ask with a real serverless function.
 */
function anthropicProxy(env) {
  const KEY = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  return {
    name: "anthropic-proxy",
    configureServer(server) {
      server.middlewares.use("/api/ask", async (req, res, next) => {
        if (req.method !== "POST") return next();
        const json = (status, obj) => {
          res.statusCode = status;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(obj));
        };
        if (!KEY) return json(500, { error: "ANTHROPIC_API_KEY is not set. Add it to a .env file and restart the dev server." });
        try {
          let body = "";
          for await (const chunk of req) body += chunk;
          const upstream = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-api-key": KEY,
              "anthropic-version": "2023-06-01",
            },
            body,
          });
          const text = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader("content-type", "application/json");
          res.end(text);
        } catch (e) {
          json(502, { error: "Proxy request to Anthropic failed: " + String(e) });
        }
      });
    },
  };
}

/**
 * Dev-only adapter that runs the /api auth serverless functions under
 * `npm run dev`, so the 2FA flow works locally without the Vercel runtime.
 * Wraps each Vercel-style handler (req.body, res.status().json()) over Vite's
 * raw Connect middleware. Not used in production — Vercel runs /api directly.
 */
function authDevApi() {
  const routes = {
    "/api/request-code": () => import("./api/request-code.js"),
    "/api/verify": () => import("./api/verify.js"),
    "/api/session": () => import("./api/session.js"),
    "/api/logout": () => import("./api/logout.js"),
  };
  return {
    name: "auth-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || "").split("?")[0];
        const load = routes[path];
        if (!load) return next();
        try {
          let body = {};
          if (req.method === "POST") {
            let raw = "";
            for await (const chunk of req) raw += chunk;
            if (raw) { try { body = JSON.parse(raw); } catch { body = {}; } }
          }
          const vres = {
            statusCode: 200,
            status(c) { this.statusCode = c; return this; },
            setHeader: (k, v) => res.setHeader(k, v),
            json(obj) {
              res.statusCode = this.statusCode;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify(obj));
              return this;
            },
          };
          const mod = await load();
          await mod.default({ method: req.method, headers: req.headers, body }, vres);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Make server-side secrets from .env visible to the auth handlers (which read
  // process.env directly), so the real 2FA flow works under `npm run dev`.
  ["AUTH_APP_PASSWORD", "AUTH_SESSION_SECRET", "AUTH_CHALLENGE_SECRET", "RESEND_API_KEY", "AUTH_EMAIL_FROM"].forEach((k) => {
    if (env[k] && !process.env[k]) process.env[k] = env[k];
  });
  return {
    plugins: [react(), anthropicProxy(env), authDevApi()],
    server: { port: 5173 },
  };
});
