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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // Served from a project GitHub Pages URL (/<repo>/) in production; root in dev.
    base: mode === "production" ? "/i3-solutions-galaxy/" : "/",
    plugins: [react(), anthropicProxy(env)],
    server: { port: 5173 },
  };
});
