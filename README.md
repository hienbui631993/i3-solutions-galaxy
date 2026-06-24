# i3 Solution Galaxy

An interactive, canvas-based visualization of i3 International's solution portfolio.
**i3Ai** sits at the core of a "galaxy" — focus areas orbit closest, individual
solutions form the middle band, and the customer pain points they solve sit on the
outer rim. Hovering, clicking, filtering, or asking a question traces the chain
**pain → solution → focus area → i3Ai** and fades everything unrelated.

## Features

- **Animated solution galaxy** rendered on an HTML5 canvas, with the core, focus
  areas, solutions, and pain points laid out in concentric orbits.
- **Interactive tracing** — hover or click any node to highlight its full
  relationship chain and dim the rest.
- **Layered filtering** — stack multiple focus-area and vertical (industry) tags,
  combined with **AND/OR** logic, to narrow the view.
- **"Ask the universe"** — a natural-language query feature backed by the Anthropic
  Messages API (dev-only proxy; see configuration below).

## Tech stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/) for dev server and build
- HTML5 Canvas for the visualization

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | App shell and mount point (`#root`). |
| `main.jsx` | React entry point — mounts `<App />`. |
| `i3-solution-universe.jsx` | UI layer: the canvas renderer, interaction, hover/click/filter/ask logic. |
| `i3-data.js` | Data/model layer: focus areas, solutions, verticals, pain points, and the derived graph (nodes, edges, layout) plus pure helpers. |
| `vite.config.js` | Vite config, including the dev-only Anthropic proxy for `/api/ask`. |
| `.env.example` | Template for the `ANTHROPIC_API_KEY` used by the proxy. |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (18+ recommended) and npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

The app is served at **http://localhost:5173/**.

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Configuration — "Ask the universe"

The "Ask the universe" feature calls a **dev-only** proxy (`POST /api/ask`) defined
in `vite.config.js`. The proxy injects a secret `ANTHROPIC_API_KEY` server-side and
forwards the request to the Anthropic Messages API — the key is never shipped to the
browser.

To enable it:

```bash
cp .env.example .env
# then edit .env and set your real key:
# ANTHROPIC_API_KEY=sk-ant-...
```

Restart the dev server after editing `.env`.

> **Note:** The proxy runs only under `npm run dev`. A static `vite build` has no
> server — for production you'd replace `/api/ask` with a real serverless function.
> The rest of the app works fully without an API key.

## Data grounding

Solutions, focus areas, and verticals are taken from
[i3international.com](https://www.i3international.com/); pain → solution links are
grounded against i3's industry pages. Pain-point names are our own framing.
