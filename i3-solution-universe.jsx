import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  TYPE,
  PILLARS,
  SOLUTIONS,
  VERTICALS,
  VCOLOR,
  PAINS,
  COLORS,
  CORE,
  NODES,
  NODE_BY_ID,
  IDX,
  EDGES,
  rebuildEdges,
  ORIGINAL_SOLS,
  ORIGINAL_VERTS,
  EDIT_PIN,
  RADIUS,
  relatedSet,
  pillarSet,
  verticalSet,
  GALAXY,
  colX,
  buildStage,
  shade,
} from "./i3-data";

/**
 * i3 SOLUTION GALAXY — UI LAYER
 * ------------------------------------------------------------------
 * i3Ai sits at the core. Focus areas orbit closest, solutions in the middle
 * band, and the pain points they solve on the outer rim. Arms radiate from the
 * core (each focus area carries its own solutions). Hover/click/filter/ask
 * traces the chain pain → solution → focus area → i3Ai and fades the rest.
 *
 * All data and the derived graph model live in ./i3-data.
 */


/* ----------------------------- COMPONENT ----------------------------- */
export default function App() {
  const canvasRef = useRef(null), wrapRef = useRef(null);
  const screen = useRef([]);
  const visRef = useRef(NODES.map(() => 1));
  const rot = useRef(0), rotSpeed = useRef(0);
  const emph = useRef(GALAXY.__sectors.map(() => 1));
  const cur = useRef([]), stageRef = useRef(null), stageKeyRef = useRef("");
  const mouse = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);
  const [active, setActive] = useState(null);
  const [vSel, setVSel] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [showNote, setShowNote] = useState(true);
  const [rnd, setRnd] = useState({ pain: true, sol: true, focus: true });
  const [nPain, setNPain] = useState(2);
  const [nSol, setNSol] = useState(2);
  const [nFocus, setNFocus] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [randOpen, setRandOpen] = useState(true);
  const [gameOn, setGameOn] = useState(false);
  const [gQs, setGQs] = useState([]);
  const [gIdx, setGIdx] = useState(0);
  const [gScore, setGScore] = useState(0);
  const [gStreak, setGStreak] = useState(0);
  const [gBest, setGBest] = useState(0);
  const [gPicked, setGPicked] = useState(null);
  const [quizMode, setQuizMode] = useState(null);
  const [qCount, setQCount] = useState(10);
  const [cBoard, setCBoard] = useState(null);
  const [cTarget, setCTarget] = useState([]);
  const [cEdges, setCEdges] = useState([]);
  const [cSelA, setCSelA] = useState(null);
  const [editorOn, setEditorOn] = useState(false);
  const [narrow, setNarrow] = useState(typeof window !== "undefined" ? window.innerWidth < 1180 : false);
  useEffect(() => { const onR = () => setNarrow(window.innerWidth < 1180); onR(); window.addEventListener("resize", onR); return () => window.removeEventListener("resize", onR); }, []);
  const [cardExpanded, setCardExpanded] = useState(false);
  const [ppTooltip, setPpTooltip] = useState(null); // {text, x, y}
  useEffect(() => { setCardExpanded(false); }, [selected]);
  const [editPain, setEditPain] = useState(null);
  const [editSearch, setEditSearch] = useState("");
  const [editVer, setEditVer] = useState(0);
  const [saveState, setSaveState] = useState("");
  const [exportText, setExportText] = useState(null);
  const [editUnlocked, setEditUnlocked] = useState(true);
  const [lockOpen, setLockOpen] = useState(false);
  const [pinEntry, setPinEntry] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [histIdx, setHistIdx] = useState(-1);

  const sel = useRef(null), hov = useRef(null), act = useRef(null), showAllRef = useRef(false), ansRef = useRef(false), vSelRef = useRef(null), vHoverRef = useRef(null), answerLeadRef = useRef(null);
  const hist = useRef({ stack: [], idx: -1, lock: false });
  useEffect(() => { sel.current = selected; }, [selected]);
  useEffect(() => { vSelRef.current = vSel; }, [vSel]);
  useEffect(() => { hov.current = hover; }, [hover]);
  useEffect(() => { act.current = active; }, [active]);
  useEffect(() => { showAllRef.current = showAll; }, [showAll]);
  useEffect(() => { ansRef.current = !!answer; }, [answer]);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas.getContext("2d");
    let stars = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = wrapRef.current.clientWidth; H = wrapRef.current.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 200 }, () => {
        const ce = Math.random() < 0.5;
        const a = Math.random() * Math.PI * 2, rr = ce ? Math.random() * Math.min(W, H) * 0.35 : Math.random() * Math.max(W, H) * 0.7;
        return { x: W / 2 + Math.cos(a) * rr, y: H * 0.46 + Math.sin(a) * rr * 0.6, r: Math.random() * 1.3 + 0.2, al: Math.random() * 0.5 + 0.1, tw: Math.random() * 7 };
      });
    };
    resize(); window.addEventListener("resize", resize);
    const TILT = 0.6;

    const planet = (n, x, y, r, alpha, detailed) => {
      const base = (n.type === TYPE.PILLAR && n.color) ? n.color : COLORS[n.type];
      ctx.save();
      ctx.globalAlpha = alpha * 0.4;
      const ag = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2.2);
      ag.addColorStop(0, shade(base, 0.12)); ag.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, 7); ctx.fill();
      if (detailed) {
        ctx.globalAlpha = alpha;
        const sg = ctx.createRadialGradient(x - r * 0.34, y - r * 0.34, r * 0.1, x, y, r);
        sg.addColorStop(0, shade(base, 0.42)); sg.addColorStop(0.5, shade(base, 0.06)); sg.addColorStop(1, shade(base, -0.28));
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        ctx.globalAlpha = alpha * 0.38; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x - r * 0.38, y - r * 0.38, r * 0.18, 0, 7); ctx.fill();
      } else {
        ctx.globalAlpha = alpha * 0.8;
        const sg = ctx.createRadialGradient(x - r * 0.28, y - r * 0.28, 0, x, y, r);
        sg.addColorStop(0, shade(base, 0.18)); sg.addColorStop(1, shade(base, -0.12));
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      ctx.restore();
    };
    const glassCore = (x, y, r, alpha) => {
      ctx.save();
      // soft outer glow (light pink)
      ctx.globalAlpha = alpha * 0.4;
      const glow = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.95);
      glow.addColorStop(0, "rgba(255,200,226,0.55)"); glow.addColorStop(1, "rgba(255,200,226,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, r * 1.95, 0, 7); ctx.fill();
      // GLASS: near-clear centre (background shows through), bright Fresnel rim
      ctx.globalAlpha = alpha;
      const body = ctx.createRadialGradient(x, y, 0, x, y, r);
      body.addColorStop(0, "rgba(255,240,248,0.05)");
      body.addColorStop(0.55, "rgba(255,205,228,0.10)");
      body.addColorStop(0.82, "rgba(255,222,238,0.30)");
      body.addColorStop(0.95, "rgba(255,250,253,0.78)");
      body.addColorStop(1, "rgba(255,255,255,0.92)");
      ctx.fillStyle = body; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      // interior highlights, clipped to the sphere
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
      // bottom caustic — light focused through the glass
      ctx.globalAlpha = alpha * 0.6;
      const ca = ctx.createRadialGradient(x, y + r * 0.42, 0, x, y + r * 0.42, r * 0.55);
      ca.addColorStop(0, "rgba(255,236,246,0.85)"); ca.addColorStop(1, "rgba(255,236,246,0)");
      ctx.fillStyle = ca; ctx.beginPath(); ctx.arc(x, y + r * 0.42, r * 0.55, 0, 7); ctx.fill();
      // soft top-left specular halo
      ctx.globalAlpha = alpha * 0.75;
      const sp = ctx.createRadialGradient(x - r * 0.34, y - r * 0.4, 0, x - r * 0.34, y - r * 0.4, r * 0.5);
      sp.addColorStop(0, "rgba(255,255,255,0.95)"); sp.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sp; ctx.beginPath(); ctx.arc(x - r * 0.34, y - r * 0.4, r * 0.5, 0, 7); ctx.fill();
      ctx.restore();
      // crisp Fresnel rim
      ctx.globalAlpha = alpha * 0.85; ctx.lineWidth = Math.max(1, r * 0.045);
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(x, y, r * 0.97, 0, 7); ctx.stroke();
      // sharp specular dot
      ctx.globalAlpha = alpha; ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath(); ctx.arc(x - r * 0.36, y - r * 0.42, r * 0.1, 0, 7); ctx.fill();
      ctx.restore();
    };
    const sun = (x, y, r, alpha, base, isCore) => {
      ctx.save();
      ctx.globalAlpha = alpha * (isCore ? 0.7 : 0.55);
      const cg = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * (isCore ? 3.2 : 2.5));
      cg.addColorStop(0, base); cg.addColorStop(0.4, isCore ? "rgba(223,30,113,0.45)" : "rgba(230,177,74,0.42)"); cg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y, r * (isCore ? 3.2 : 2.5), 0, 7); ctx.fill();
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = isCore ? "rgba(255,170,205,0.85)" : "rgba(245,222,165,0.85)"; ctx.lineWidth = Math.max(1, r * 0.05);
      ctx.translate(x, y); ctx.rotate(-0.5); ctx.scale(1, 0.32);
      ctx.beginPath(); ctx.arc(0, 0, r * 1.55, 0, 7); ctx.stroke();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = alpha;
      const sg = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
      sg.addColorStop(0, shade(base, 0.85)); sg.addColorStop(0.5, base); sg.addColorStop(1, shade(base, -0.15));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.restore();
    };

    const step = () => {
      const topRes = 96, botRes = ansRef.current ? 244 : 150;
      const availH = Math.max(220, H - topRes - botRes);
      const cx = W / 2, cy = topRes + availH / 2;
      const maxR = Math.max(110, Math.min(W * 0.5 - 72, (availH / 2) / TILT));
      const ringR = { core: 0, focus: maxR * 0.36, sol: maxR * 0.66, pain: maxR };

      // focus = committed result (click / filter / search) → drives the column layout + fade
      const s = sel.current;
      let hi = null;
      if (act.current) hi = act.current;
      else if (s && s !== "core") hi = relatedSet(s);
      // hover = light preview only — never repositions or fades anything
      const hoverSet = (!hi && hov.current && hov.current !== "core") ? relatedSet(hov.current) : null;

      // gentle rotation; pauses while hovering/focused so targets hold still to click
      const interacting = hov.current || s || act.current;
      rotSpeed.current += ((interacting ? 0 : 0.0012) - rotSpeed.current) * 0.08;
      rot.current += rotSpeed.current;

      // focus-area sectors stay fixed on hover (hover never moves planets); fan is opt-in via click
      const tgtSec = -1;
      const baseW = GALAXY.__sectors, em = emph.current, secStart = [], secSpan = [];
      let fanOffset = 0;
      { for (let i = 0; i < baseW.length; i++) { const t = i === tgtSec ? 2.4 : 1; em[i] += (t - em[i]) * 0.12; }
        const eff = baseW.map((sc, i) => sc.weight * em[i]), tot = eff.reduce((a, b) => a + b, 0); let acc = 0; const bAng = -Math.PI / 2;
        for (let i = 0; i < eff.length; i++) { secStart[i] = bAng + acc; secSpan[i] = (eff[i] / tot) * Math.PI * 2; acc += secSpan[i]; } }

      // stage layout cache (organized columns once results are established)
      const hiKey = hi ? [...hi].sort().join(",") : "";
      if (hiKey !== stageKeyRef.current) { stageKeyRef.current = hiKey; stageRef.current = hi ? buildStage([...hi].sort((a, b) => IDX[a] - IDX[b])) : null; }
      const stage = stageRef.current, cP = cur.current;

      // sub-column layout: wrap an over-long column into 2 sub-columns so items never crowd
      const lmS = Math.max(322, Math.min(W * 0.28, 344));
      const rmS = Math.max(sel.current ? 332 : 0, Math.min(90, W * 0.1));
      const bandS = Math.max(W - lmS - rmS, 160);
      let colLayout = null;
      if (stage) {
        const counts = {}; Object.values(stage).forEach((e) => { counts[e.type] = e.count; });
        let leadType = "pain";
        if (sel.current && NODE_BY_ID[sel.current]) leadType = NODE_BY_ID[sel.current].type;
        else if (ansRef.current && answerLeadRef.current) leadType = answerLeadRef.current;
        const LEAD_ORDER = { pain: ["pain", "solution", "pillar", "core"], solution: ["solution", "pain", "pillar", "core"], pillar: ["pillar", "solution", "pain", "core"], core: ["core", "pillar", "solution", "pain"] };
        const types = (LEAD_ORDER[leadType] || LEAD_ORDER.pain).filter((t) => counts[t]);
        const ROWSFIT = Math.max(6, Math.floor(availH / 28));
        const info = {}; let totalSubs = 0;
        types.forEach((t) => { const sc = Math.min(2, Math.max(1, Math.ceil(counts[t] / ROWSFIT))); info[t] = { subCols: sc, rowsPerSub: Math.ceil(counts[t] / sc) }; totalSubs += sc; });
        const gaps = 38 * Math.max(types.length - 1, 0);
        const SUBW = Math.max(120, Math.min(182, (bandS - gaps) / Math.max(totalSubs, 1)));
        let x = lmS;
        types.forEach((t, gi) => { info[t].baseX = x; x += info[t].subCols * SUBW; if (gi < types.length - 1) x += 38; });
        colLayout = { SUBW, info };
      }
      const vh = vHoverRef.current, vhSet = vh ? verticalSet(vh) : null, vhColor = vh ? VCOLOR[vh] : null;

      // positions: ease toward galaxy orbit at rest, organized columns when focused
      const proj = NODES.map((n, i) => {
        const L = GALAXY[n.id], st = hi && hi.has(n.id) && stage && stage[n.id];
        let tx, ty, depth = 0;
        if (st) { const ci = colLayout.info[st.type], rps = ci.rowsPerSub, sub = Math.floor(st.slot / rps), rowInSub = st.slot % rps; const thisCount = sub < ci.subCols - 1 ? rps : st.count - rps * (ci.subCols - 1); const colTop = topRes + 36; const gap = Math.min((availH - 36) / Math.max(rps, 1), 60); const colStart = Math.max(colTop, cy - (thisCount - 1) / 2 * gap); tx = ci.baseX + sub * colLayout.SUBW; ty = colStart + rowInSub * gap; }
        else if (L.ring === "core") { tx = cx; ty = cy; }
        else { const a = secStart[L.sector] + L.frac * secSpan[L.sector] + rot.current, R = ringR[L.ring]; tx = cx + Math.cos(a) * R; ty = cy + Math.sin(a) * R * TILT; depth = Math.sin(a); }
        if (!cP[i]) cP[i] = { x: tx, y: ty };
        cP[i].x += (tx - cP[i].x) * 0.16; cP[i].y += (ty - cP[i].y) * 0.16;
        return { x: cP[i].x, y: cP[i].y, depth, ring: L.ring };
      });

      // visibility easing
      const vis = visRef.current;
      for (let i = 0; i < NODES.length; i++) { const tgt = hi ? (hi.has(NODES[i].id) ? 1 : 0) : 1; vis[i] += (tgt - vis[i]) * 0.14; }

      // background
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#002446"); bg.addColorStop(0.5, "#0a1428"); bg.addColorStop(1, "#050a16");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // galactic disc glow
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, TILT);
      const disc = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR * 1.15);
      disc.addColorStop(0, "rgba(0,88,143,0.28)"); disc.addColorStop(0.5, "rgba(0,60,110,0.12)"); disc.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = disc; ctx.beginPath(); ctx.arc(0, 0, maxR * 1.15, 0, 7); ctx.fill();
      ctx.restore();
      // stars
      stars.forEach((st) => { st.tw += 0.02; ctx.globalAlpha = st.al * (0.6 + 0.4 * Math.sin(st.tw)); ctx.fillStyle = "#cfe0ff"; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill(); });
      ctx.globalAlpha = 1;

      // orbit guide ellipses
      ["focus", "sol", "pain"].forEach((ring) => {
        ctx.save(); ctx.globalAlpha = hi ? 0.06 : 0.13; ctx.strokeStyle = "#4f7fb0"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cx, cy, ringR[ring], ringR[ring] * TILT, 0, 0, 7); ctx.stroke(); ctx.restore();
      });
      // focus-area sector dividers (the three pies)
      if (!hi) {
        ctx.globalAlpha = 0.5; ctx.strokeStyle = "rgba(230,177,74,0.16)"; ctx.lineWidth = 1;
        for (let i = 0; i < secStart.length; i++) {
          const a = secStart[i] + rot.current, r0 = ringR.focus * 0.72, r1 = ringR.pain * 1.06;
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * TILT); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * TILT); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // edges
      const coreIdx = IDX["core"], corePos = proj[coreIdx];
      if (hi) {
        for (const e of EDGES) {
          if (!(hi.has(e.a) && hi.has(e.b))) continue;
          const ia = IDX[e.a], ib = IDX[e.b], v = Math.min(vis[ia], vis[ib]);
          if (v < 0.05) continue;
          const pa = proj[ia], pb = proj[ib];
          ctx.globalAlpha = v * 0.6; ctx.strokeStyle = "#7fc0ff"; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }
      } else {
        if (showAllRef.current) {
          // full relationship web — every real connection for all pain points & solutions
          ctx.lineWidth = 1;
          for (const e of EDGES) {
            const pa = proj[IDX[e.a]], pb = proj[IDX[e.b]];
            ctx.strokeStyle = e.kind === "addr" ? "rgba(245,232,150,0.13)" : e.kind === "painfocus" ? "rgba(245,232,150,0.15)" : e.kind === "arm" ? "rgba(248,236,165,0.22)" : "rgba(250,242,185,0.28)";
            ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
          }
        } else {
          // i3Ai is connected to everything — faint filaments from the core to every body
          ctx.strokeStyle = "rgba(160,180,225,0.07)"; ctx.lineWidth = 1;
          for (let i = 0; i < NODES.length; i++) {
            if (i === coreIdx) continue;
            const p = proj[i];
            ctx.beginPath(); ctx.moveTo(corePos.x, corePos.y); ctx.lineTo(p.x, p.y); ctx.stroke();
          }
        }
        // hovered chain highlighted on top
        if (hoverSet) {
          ctx.strokeStyle = "#7fc0ff"; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.6;
          for (const e of EDGES) {
            if (!(hoverSet.has(e.a) && hoverSet.has(e.b))) continue;
            const pa = proj[IDX[e.a]], pb = proj[IDX[e.b]];
            ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
          }
          // leader line to the corner card
          const hp = proj[IDX[hov.current]], ht = NODE_BY_ID[hov.current].type;
          const lc = ht === "solution" ? "#5fd6f2" : ht === "pillar" ? COLORS.pillar : ht === "core" ? "#ff9ec5" : COLORS.pain;
          const cardX = W - 248, cardY = 118;
          ctx.setLineDash([4, 4]); ctx.strokeStyle = lc; ctx.lineWidth = 1; ctx.globalAlpha = 0.45;
          ctx.beginPath(); ctx.moveTo(hp.x, hp.y); ctx.lineTo(cardX, cardY); ctx.stroke();
          ctx.setLineDash([]); ctx.globalAlpha = 0.9; ctx.fillStyle = lc;
          ctx.beginPath(); ctx.arc(cardX, cardY, 3, 0, 7); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // nodes, sorted back (low y) -> front
      const order = NODES.map((n, i) => i).sort((a, b) => proj[a].y - proj[b].y);
      const out = [];
      order.forEach((i) => {
        const n = NODES[i], p = proj[i], v = vis[i];
        const focused = hi ? hi.has(n.id) : null;
        const hovered = !hi && hoverSet && hoverSet.has(n.id);
        const restA = 0.86 + p.depth * 0.14;
        const alpha = v * (hi ? 1 : (hovered ? 1 : restA));
        if (alpha <= 0.02) { out[i] = { hidden: true }; return; }
        const dsc = 1 + p.depth * 0.14;
        const boost = (hi && focused && n.type !== TYPE.CORE) ? 1.22 : (hovered && n.type !== TYPE.CORE) ? 1.1 : 1;
        const r = RADIUS[n.id] * dsc * boost;
        if (n.type === TYPE.CORE) glassCore(p.x, p.y, r, alpha);
        else if (n.type === TYPE.PILLAR) sun(p.x, p.y, r, alpha, COLORS.pillar, false);
        else planet(n, p.x, p.y, r, alpha, n.type === TYPE.PAIN || focused === true || hovered);
        const isPS = n.type === TYPE.PAIN || n.type === TYPE.SOLUTION;
        const auraV = (vhSet && vhSet.has(n.id) && isPS) ? vhColor : null;
        if (auraV) {
          ctx.save(); ctx.globalAlpha = alpha * 0.55;
          const ga = ctx.createRadialGradient(p.x, p.y, r * 0.7, p.x, p.y, r * 2.1);
          ga.addColorStop(0, auraV + "00"); ga.addColorStop(0.5, auraV + "38"); ga.addColorStop(1, auraV + "00");
          ctx.fillStyle = ga; ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.1, 0, 7); ctx.fill(); ctx.restore();
        }
        if ((sel.current === n.id || hov.current === n.id) && alpha > 0.25) {
          ctx.globalAlpha = alpha; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, r + 6, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
        }
        out[i] = { x: p.x, y: p.y, r };
      });
      screen.current = out.map((o) => o && !o.hidden ? { x: o.x, y: o.y, r: o.r + 14 } : { x: -999, y: -999, r: 0 });

      // node labels
      ctx.textBaseline = "middle";
      NODES.forEach((n, i) => {
        const o = out[i]; if (!o || o.hidden) return;
        const focused = hi ? hi.has(n.id) : null;
        const isAnchor = n.type === TYPE.CORE || n.type === TYPE.PILLAR;
        const show = isAnchor || focused === true || (hoverSet && hoverSet.has(n.id)) || sel.current === n.id || hov.current === n.id;
        if (!show) return;
        const la = vis[i] * (hi ? (focused ? 1 : 0) : 1); if (la < 0.3) return;
        ctx.font = (isAnchor ? "700 12px" : "600 10.5px") + " 'Hanken Grotesk', system-ui, sans-serif";
        const txt = n.short || n.label, tw = ctx.measureText(txt).width;
        const inCol = !!(stage && stage[n.id] && focused);
        const fill = n.type === TYPE.CORE ? "#ffffff" : n.type === TYPE.PILLAR ? "#eaf4ff" : n.type === TYPE.PAIN ? "#ffd0e6" : "#cfe3ff";
        const verts = (n.type === TYPE.PAIN && n.verts) ? n.verts.filter((vid) => VCOLOR[vid]) : [];
        const dotsW = verts.length * 7.5;
        if (inCol) {
          ctx.textAlign = "left";
          const lx = o.x + o.r + 7, ly = o.y;
          let dx = lx + 3;
          verts.forEach((vid) => { ctx.globalAlpha = la * 0.8; ctx.fillStyle = VCOLOR[vid]; ctx.beginPath(); ctx.arc(dx, ly, 2.1, 0, 7); ctx.fill(); dx += 7.5; });
          const tx0 = lx + (verts.length ? dotsW + 4 : 0);
          const maxW = (colLayout ? colLayout.SUBW : 150) - (o.r + 14) - (verts.length ? dotsW + 4 : 0);
          let t2 = txt;
          if (ctx.measureText(t2).width > maxW) { while (t2.length > 1 && ctx.measureText(t2 + "…").width > maxW) t2 = t2.slice(0, -1); t2 += "…"; }
          const w2 = ctx.measureText(t2).width;
          ctx.globalAlpha = la * 0.82; ctx.fillStyle = "rgba(5,8,18,0.72)";
          ctx.fillRect(tx0 - 4, ly - 8, w2 + 8, 16);
          ctx.globalAlpha = la; ctx.fillStyle = fill; ctx.fillText(t2, tx0, ly + 0.5);
        } else {
          ctx.textAlign = "center";
          const ly = o.y + o.r + (isAnchor ? 14 : 11);
          ctx.globalAlpha = la * 0.82; ctx.fillStyle = "rgba(5,8,18,0.72)";
          ctx.fillRect(o.x - tw / 2 - 5, ly - 8, tw + 10, 16);
          ctx.globalAlpha = la; ctx.fillStyle = fill; ctx.fillText(txt, o.x, ly + 0.5);
          let dx = o.x - tw / 2 - 6 - (verts.length - 1) * 7.5;
          verts.forEach((vid) => { ctx.globalAlpha = la * 0.8; ctx.fillStyle = VCOLOR[vid]; ctx.beginPath(); ctx.arc(dx, ly, 2.1, 0, 7); ctx.fill(); dx += 7.5; });
          if (n.type === TYPE.CORE && !hi) {
            ctx.font = "600 9.5px 'Hanken Grotesk', system-ui, sans-serif";
            ctx.globalAlpha = la * 0.6; ctx.fillStyle = "#9fb0d0";
            ctx.fillText(showAllRef.current ? "tap to hide links" : "tap: show all links", o.x, ly + 14.5);
          }
        }
        ctx.globalAlpha = 1;
      });

      // zone labels: orbit tags at rest, column headers once organized
      ctx.font = "700 10px 'Sora', system-ui, sans-serif"; ctx.textAlign = "center";
      const drawTag = (txt, x, y, col) => {
        const tw = ctx.measureText(txt).width;
        ctx.globalAlpha = 0.72; ctx.fillStyle = "rgba(5,8,18,0.85)";
        ctx.fillRect(x - tw / 2 - 8, y - 9, tw + 16, 18);
        ctx.globalAlpha = 0.9; ctx.strokeStyle = col; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x - tw / 2 - 8, y + 9.5); ctx.lineTo(x + tw / 2 + 8, y + 9.5); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillText(txt, x, y + 1);
      };
      if (hi && stage) {
        const tname = { pain: "PAIN POINTS", solution: "SOLUTIONS", pillar: "FOCUS AREAS", core: "i3Ai" };
        const tcol = { pain: "#ff8a93", solution: "#5fd6f2", pillar: "#f2cf76", core: "#ff6aa6" };
        const seen = {}; Object.values(stage).forEach((e) => { seen[e.type] = e; });
        const headerY = topRes + 8;
        Object.keys(seen).forEach((type) => {
          const ci = colLayout.info[type];
          const hx = ci.baseX + ((ci.subCols - 1) * colLayout.SUBW) / 2;
          let col = tcol[type];
          if (type === "pillar") { const pe = Object.entries(stage).find(([, e]) => e.type === "pillar"); if (pe) { const pn = NODE_BY_ID[pe[0]]; col = pn?.color || tcol.pillar; } }
          drawTag(tname[type], hx, headerY, col);
        });
      } else if (!hi) {
        [["FOCUS AREAS", ringR.focus, "#f2cf76"], ["SOLUTIONS", ringR.sol, "#5fd6f2"], ["PAIN POINTS", ringR.pain, "#ff8a93"]].forEach(([txt, R, col]) => drawTag(txt, cx, cy - R * TILT - 9, col));
      }
      ctx.globalAlpha = 1; ctx.textAlign = "left";

      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);

  const hitTest = (mx, my) => {
    const sc = screen.current; let best = null, bd = 1e9;
    for (let i = 0; i < NODES.length; i++) { const p = sc[i]; if (!p) continue; const d = Math.hypot(p.x - mx, p.y - my); if (d < p.r && d < bd) { bd = d; best = NODES[i].id; } }
    return best;
  };
  const onMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    mouse.current.x = mx; mouse.current.y = my;
    const id = hitTest(mx, my);
    if (id !== hover) { setHover(id); const sc = id ? screen.current[IDX[id]] : null; setHoverPos(sc ? { x: sc.x, y: sc.y, r: sc.r } : null); }
    canvasRef.current.style.cursor = id ? "pointer" : "default";
  };
  const onClick = (e) => {
    if (gameOn) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const id = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (id === "core") { setSelected(null); setActive(null); setVSel(null); setAnswer(null); setShowAll((v) => !v); }
    else if (id) { setSelected(id); setActive(null); setVSel(null); setAnswer(null); setShowAll(false); } else { setSelected(null); }
  };

  const sampleN = (arr, n) => { const a = [...arr], out = []; n = Math.max(0, Math.min(n, a.length)); for (let i = 0; i < n; i++) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]); return out; };
  const randomize = () => {
    setVSel(null); setSelected(null); setAnswer(null);
    let np = rnd.pain ? 1 + Math.floor(Math.random() * 4) : nPain;
    let ns = rnd.sol ? Math.floor(Math.random() * 4) : nSol;
    let nf = rnd.focus ? Math.floor(Math.random() * 3) : nFocus;
    const ids = new Set(["core"]);
    const countType = (t) => [...ids].filter((id) => NODE_BY_ID[id].type === t).length;
    // seed the minimum pain points and pull their connections (the natural fill)
    sampleN(PAINS, np).forEach((p) => {
      ids.add(p.id);
      if (p.sols.length) p.sols.forEach((sid) => { ids.add(sid); ids.add(NODE_BY_ID[sid].pillar); });
      else if (p.pillar) ids.add(p.pillar);
    });
    // top up to the minimum solutions (each stays connected via its focus area)
    let availS = SOLUTIONS.filter((s) => !ids.has(s.id));
    while (countType("solution") < ns && availS.length) { const s = availS.splice(Math.floor(Math.random() * availS.length), 1)[0]; ids.add(s.id); ids.add(s.pillar); }
    // top up to the minimum focus areas
    let availP = PILLARS.filter((p) => !ids.has(p.id));
    while (countType("pillar") < nf && availP.length) { const p = availP.splice(Math.floor(Math.random() * availP.length), 1)[0]; ids.add(p.id); }
    setActive(ids.size > 1 ? ids : null);
  };
  const filterPillar = (pid) => { setVSel(null); setActive(pillarSet(pid)); setSelected(pid); setAnswer(null); };
  const filterVertical = (vid) => { setVSel(vid); setActive(verticalSet(vid)); setSelected(null); setAnswer(null); };
  const reset = () => { setActive(null); setSelected(null); setVSel(null); setAnswer(null); setShowAll(false); setQuery(""); };

  const matchPains = (q) => {
    const toks = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
    return PAINS.map((p) => {
      let sc = 0; const hay = (p.label + " " + p.kw.join(" ")).toLowerCase();
      toks.forEach((tk) => { if (hay.includes(tk)) sc += 2; p.kw.forEach((k) => { if (k.includes(tk) || tk.includes(k)) sc += 1; }); });
      VERTICALS.forEach((v) => { if (toks.some((tk) => v.label.toLowerCase().includes(tk)) && p.verts.includes(v.id)) sc += 2; });
      return { p, sc };
    }).filter((x) => x.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, 3).map((x) => x.p);
  };
  const buildExplanation = (pains) => !pains.length ? "I couldn't map that to a pain point in this concept's set. Try terms like shrink, drive-thru, loitering, staffing, slip-and-fall, or campus safety." : "Here's how this maps in the i3 galaxy:\n" + pains.map((p) => `• ${p.label} → ${p.sols.map((s) => NODE_BY_ID[s].label).join(", ")}`).join("\n");
  const applyActive = (pains) => {
    const ids = new Set(["core"]);
    pains.forEach((p) => { ids.add(p.id); p.sols.forEach((sd) => { ids.add(sd); ids.add(NODE_BY_ID[sd].pillar); }); });
    setActive(ids.size > 1 ? ids : null);
  };
  const applyIds = (idList) => {
    const ids = new Set(["core"]);
    idList.forEach((id) => { if (NODE_BY_ID[id]) ids.add(id); });
    // add focus-area context only for what's shown — never pull in extra solutions or pains
    [...ids].forEach((id) => {
      const n = NODE_BY_ID[id]; if (!n) return;
      if (n.type === "solution") ids.add(n.pillar);
      else if (n.type === "pain") { n.sols.forEach((sd) => { if (ids.has(sd)) ids.add(NODE_BY_ID[sd].pillar); }); if (n.pillar) ids.add(n.pillar); }
      else if (n.type === "pillar") { SOLUTIONS.filter((s) => s.pillar === id && ids.has(s.id)).forEach((s) => ids.add(s.id)); }
    });
    setActive(ids.size > 1 ? ids : null);
  };
  const askUniverse = useCallback(async (qRaw) => {
    const q = qRaw.trim(); if (!q) return;
    setThinking(true); setSelected(null); setVSel(null);
    // analytics over the CURRENT map (reflects any edits)
    const solPains = {}; SOLUTIONS.forEach((s) => { solPains[s.id] = PAINS.filter((p) => p.sols.includes(s.id)).map((p) => p.id); });
    const focusPains = {}; PILLARS.forEach((pl) => { focusPains[pl.id] = PAINS.filter((p) => p.sols.some((sd) => NODE_BY_ID[sd].pillar === pl.id) || p.pillar === pl.id).map((p) => p.id); });
    const vertPains = {}; VERTICALS.forEach((v) => { vertPains[v.id] = PAINS.filter((p) => p.verts.includes(v.id)).map((p) => p.id); });
    const solRank = SOLUTIONS.map((s) => ({ id: s.id, label: s.label, focusArea: s.pillar, painCount: solPains[s.id].length })).sort((a, b) => b.painCount - a.painCount);
    const focusRank = PILLARS.map((pl) => ({ id: pl.id, label: pl.label, solutionCount: SOLUTIONS.filter((s) => s.pillar === pl.id).length, painCount: focusPains[pl.id].length })).sort((a, b) => b.painCount - a.painCount);
    const vertRank = VERTICALS.map((v) => ({ id: v.id, label: v.label, painCount: vertPains[v.id].length })).sort((a, b) => b.painCount - a.painCount);
    // deterministic fallback / instant highlight for superlative questions (also works offline)
    const lc = q.toLowerCase();
    const sup = /(most|highest|greatest|biggest|widest|broadest|top|cover the most)/.test(lc), low = /(fewest|least|lowest|smallest|narrowest)/.test(lc);
    const numWord = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
    let topN = 1; const mNum = lc.match(/\b(\d+)\b/); if (mNum) topN = Math.max(1, Math.min(8, parseInt(mNum[1], 10))); else Object.keys(numWord).forEach((w) => { if (new RegExp("\\b" + w + "\\b").test(lc)) topN = numWord[w]; });
    answerLeadRef.current = /solution/.test(lc) ? "solution" : /(focus area|pillar|category)/.test(lc) ? "pillar" : "pain";
    let fb = null;
    if ((sup || low) && /solution/.test(lc)) {
      const sorted = low ? [...solRank].sort((a, b) => a.painCount - b.painCount) : solRank;
      const cutoff = sorted[Math.min(topN, sorted.length) - 1].painCount;
      const chosen = sorted.filter((s) => low ? s.painCount <= cutoff : s.painCount >= cutoff);
      const painUnion = new Set(); chosen.forEach((c) => solPains[c.id].forEach((pid) => painUnion.add(pid)));
      fb = { ids: [...chosen.map((c) => c.id), ...painUnion], text: (low ? "Fewest" : "Top") + " by pain points: " + chosen.map((c) => c.label + " (" + c.painCount + ")").join(", ") + (chosen.length > topN ? " — tied at this rank." : ".") + " Their pain points are organized beside them." };
    }
    else if ((sup || low) && /(focus area|pillar|category)/.test(lc)) { const fc = low ? focusRank[focusRank.length - 1] : focusRank[0]; fb = { ids: [fc.id, ...SOLUTIONS.filter((s) => s.pillar === fc.id).map((s) => s.id)], text: fc.label + " is the " + (low ? "smallest" : "largest") + " focus area here, with " + fc.solutionCount + " solutions spanning about " + fc.painCount + " pain points." }; }
    else if ((sup || low) && /vertical/.test(lc)) { const v = low ? vertRank[vertRank.length - 1] : vertRank[0]; const vsol = new Set(); vertPains[v.id].forEach((pid) => NODE_BY_ID[pid].sols.forEach((sd) => vsol.add(sd))); fb = { ids: [...vertPains[v.id], ...vsol], text: v.label + " has the " + (low ? "fewest" : "most") + " mapped pain points (" + v.painCount + "); they are highlighted with the solutions that address them." }; }
    let pains = fb ? [] : matchPains(q);
    if (fb) applyIds(fb.ids); else applyActive(pains);
    const fallbackText = fb ? fb.text : buildExplanation(pains);
    try {
      const catalog = {
        pains: PAINS.map((p) => ({ id: p.id, label: p.label, solutions: p.sols, verticals: p.verts })),
        solutions: solRank.map((s) => ({ id: s.id, label: s.label, focusArea: s.focusArea, painCount: s.painCount })),
        focusAreas: PILLARS.map((pl) => ({ id: pl.id, label: pl.label })),
        verticals: VERTICALS.map((v) => ({ id: v.id, label: v.label })),
        stats: { solutionsByPainCount: solRank, focusAreasByPainCount: focusRank, verticalsByPainCount: vertRank, totals: { pains: PAINS.length, solutions: SOLUTIONS.length } },
      };
      const sys = `You are a graph analyst for i3 International's solution map. Node types: pain points, solutions, focus areas, and one core node with id "core" (i3Ai). Answer the user's question, INCLUDING analytical or superlative ones (most / fewest / compare / how many / top N), using ONLY the provided data. The numbers in "stats" are authoritative: never recount, estimate, or invent counts, ids, or solution names. If the user asks for a top N, return exactly that many (plus genuine ties), ranked by the stats. Also map described real-world problems to the most relevant pains by meaning (e.g. OSHA or fire code -> blocked exits; ORC or grab-and-run -> external theft; curbside -> donation capture; sweethearting -> POS exceptions). Respond with JSON only, no markdown fences: {"ids":["nodeId"],"explanation":"2-4 plain sentences answering the question"}. "ids" must be the MINIMAL set of nodes that shows the answer — only the answer node(s) plus their directly attached pains/solutions. For a solution answer, include that solution's id AND the ids of the pain points it addresses, but do NOT include other solutions those pains also touch. For a focus area, include its id and its solution ids. For a problem mapping, include the relevant pain ids and their solution ids. Use only real ids that appear in the data.`;
      const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1100, system: sys, messages: [{ role: "user", content: "Data: " + JSON.stringify(catalog) + "\n\nUser question: \"" + q + "\"" }] }) });
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const ids = (parsed.ids || []).filter((id) => NODE_BY_ID[id]);
      if (ids.length) applyIds(ids); else if (fb) applyIds(fb.ids); else applyActive(pains);
      setAnswer({ text: parsed.explanation || fallbackText });
    } catch { if (fb) applyIds(fb.ids); else applyActive(pains); setAnswer({ text: fallbackText }); } finally { setThinking(false); }
  }, []);

  const stepBtn = { width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "1px solid rgba(120,150,210,0.3)", background: "rgba(13,20,38,0.6)", color: "#bcd0ee", fontWeight: 700, lineHeight: 1 };
  const SectRow = (label, key, val, setter, max) => {
    const on = rnd[key];
    return (
      <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5, color: "#bcd0ee" }}>
        <span>{label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {on ? (
            <span style={{ fontSize: 10.5, color: "#9fb6d6", fontStyle: "italic", marginRight: 2 }}>random</span>
          ) : (<>
            <span className="chip" onClick={() => setter(Math.max(1, val - 1))} style={stepBtn}>−</span>
            <span style={{ minWidth: 16, textAlign: "center", fontWeight: 700, color: "#fff" }}>{val}</span>
            <span className="chip" onClick={() => setter(Math.min(max, val + 1))} style={stepBtn}>+</span>
          </>)}
          <span className="chip" onClick={() => setRnd((r) => ({ ...r, [key]: !r[key] }))} title="Randomize this section" style={{ ...stepBtn, width: 22, borderColor: on ? "#7cb2dd" : "rgba(120,150,210,0.3)", background: on ? "rgba(124,178,221,0.22)" : "rgba(13,20,38,0.6)" }}>🎲</span>
        </span>
      </div>
    );
  };
  const selNode = selected ? NODE_BY_ID[selected] : null;
  const selColor = selNode ? (selNode.type === "solution" ? "#5fd6f2" : selNode.type === "core" ? "#ff9ec5" : selNode.type === "pillar" ? (selNode.color || COLORS.pillar) : COLORS[selNode.type]) : "#7cb2dd";
  const qPrimary = { background: "linear-gradient(135deg,#00588f,#2b9fd6)", border: "none", color: "#eaf4ff", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" };
  const qGhost = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(120,150,210,0.3)", color: "#cdd9ef", fontWeight: 600, fontSize: 13, padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" };
  const openQuiz = () => { setActive(null); setVSel(null); setAnswer(null); setShowAll(false); setHover(null); setSelected(null); setQuizMode(null); setGameOn(true); };
  const startQuiz = (mode) => {
    const pool = PAINS.filter((p) => p.sols.length > 0);
    if (mode === "connect") {
      const pains = sampleN(pool, Math.min(qCount, pool.length));
      const solIds = [...new Set(pains.flatMap((p) => p.sols))];
      const sols = solIds.map((id) => NODE_BY_ID[id]);
      const focusIds = [...new Set(sols.map((s) => s.pillar))];
      const focus = PILLARS.filter((p) => focusIds.includes(p.id));
      const target = [];
      pains.forEach((p) => p.sols.forEach((sid) => target.push(p.id + ">" + sid)));
      sols.forEach((s) => target.push(s.id + ">" + s.pillar));
      setCBoard({ pains, sols, focus }); setCTarget(target); setCEdges([]); setCSelA(null); setSelected(null); setQuizMode("connect");
      return;
    }
    const qs = sampleN(pool, Math.min(qCount, pool.length)).map((p) => {
      const correct = sampleN(p.sols, 1)[0];
      const distract = sampleN(SOLUTIONS.filter((s) => !p.sols.includes(s.id)), 3);
      return { painId: p.id, painLabel: p.label, options: sampleN([NODE_BY_ID[correct], ...distract], 4), answerId: correct };
    });
    setGQs(qs); setGIdx(0); setGScore(0); setGStreak(0); setGBest(0); setGPicked(null); setSelected(null); setQuizMode("mc");
  };
  const pickAnswer = (i) => {
    if (gPicked !== null) return;
    const q = gQs[gIdx];
    setGPicked(i);
    if (q.options[i].id === q.answerId) { setGScore(gScore + 1); const ns = gStreak + 1; setGStreak(ns); setGBest(Math.max(gBest, ns)); }
    else setGStreak(0);
    setSelected(q.painId);
  };
  const nextQ = () => { setGPicked(null); setSelected(null); setGIdx(gIdx + 1); };
  const cKey = (a, b) => {
    const ta = NODE_BY_ID[a].type, tb = NODE_BY_ID[b].type;
    if (ta === "pain" && tb === "solution") return a + ">" + b;
    if (ta === "solution" && tb === "pain") return b + ">" + a;
    if (ta === "solution" && tb === "pillar") return a + ">" + b;
    if (ta === "pillar" && tb === "solution") return b + ">" + a;
    return null;
  };
  const clickNode = (id) => {
    if (!cSelA) { setCSelA(id); return; }
    if (cSelA === id) { setCSelA(null); return; }
    const k = cKey(cSelA, id);
    if (!k) { setCSelA(id); return; }
    setCEdges((es) => es.includes(k) ? es.filter((x) => x !== k) : [...es, k]);
    setCSelA(null);
  };
  const exitQuiz = () => { setGameOn(false); setQuizMode(null); setGPicked(null); setCBoard(null); setCEdges([]); setCSelA(null); setSelected(null); setActive(null); };
  const saveMap = async () => {
    if (typeof localStorage === "undefined") { setSaveState("Session only — export to keep"); return; }
    try { const map = {}; PAINS.forEach((p) => (map[p.id] = { sols: p.sols, verts: p.verts || [] })); localStorage.setItem("i3_pain_sol_map_v1", JSON.stringify(map)); setSaveState("Saved ✓"); }
    catch (e) { setSaveState("Save failed — export to keep"); }
  };
  const reapply = () => { if (vSelRef.current) setActive(verticalSet(vSelRef.current)); };
  const toggleLink = (painId, solId) => {
    const p = NODE_BY_ID[painId]; if (!p) return;
    p.sols = p.sols.includes(solId) ? p.sols.filter((x) => x !== solId) : [...p.sols, solId];
    rebuildEdges(); setEditVer((v) => v + 1); reapply(); saveMap();
  };
  const toggleVert = (painId, vId) => {
    const p = NODE_BY_ID[painId]; if (!p) return;
    p.verts = (p.verts || []).includes(vId) ? p.verts.filter((x) => x !== vId) : [...(p.verts || []), vId];
    setEditVer((v) => v + 1); reapply(); saveMap();
  };
  const revertMap = () => { PAINS.forEach((p) => { p.sols = ORIGINAL_SOLS[p.id].slice(); p.verts = ORIGINAL_VERTS[p.id].slice(); }); rebuildEdges(); setEditVer((v) => v + 1); reapply(); saveMap(); setSaveState("Reverted to inferred"); };
  const exportMap = () => {
    const changed = PAINS.filter((p) => JSON.stringify(p.sols) !== JSON.stringify(ORIGINAL_SOLS[p.id] || []) || JSON.stringify(p.verts || []) !== JSON.stringify(ORIGINAL_VERTS[p.id] || []));
    const src = changed.length ? changed : PAINS;
    const map = {}; src.forEach((p) => (map[p.id] = { label: p.label, sols: p.sols.map((id) => ({ id, label: NODE_BY_ID[id].label })), verts: (p.verts || []).map((id) => ({ id, label: (VERTICALS.find((v) => v.id === id) || {}).label })) }));
    setExportText((changed.length ? "// " + changed.length + " changed pain point(s)\n" : "// no changes from the current baseline — full map below\n") + JSON.stringify(map, null, 2));
  };
  const importMap = (file) => {
    const r = new FileReader();
    r.onload = () => { try { const m = JSON.parse(r.result); Object.entries(m).forEach(([pid, v]) => { const p = NODE_BY_ID[pid]; if (!p) return; const sols = Array.isArray(v) ? v : v.sols; if (Array.isArray(sols)) p.sols = sols.map((s) => (typeof s === "string" ? s : s.id)).filter((id) => NODE_BY_ID[id]); const verts = (!Array.isArray(v) && v.verts) ? v.verts : null; if (Array.isArray(verts)) p.verts = verts.map((x) => (typeof x === "string" ? x : x.id)).filter((id) => VERTICALS.some((vv) => vv.id === id)); }); rebuildEdges(); setEditVer((v) => v + 1); saveMap(); } catch (e) {} };
    r.readAsText(file);
  };
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem("i3_pain_sol_map_v1");
      if (!raw) return;
      const m = JSON.parse(raw); let changed = false;
      Object.entries(m).forEach(([pid, v]) => { const p = NODE_BY_ID[pid]; if (!p) return; if (Array.isArray(v)) { p.sols = v.filter((id) => NODE_BY_ID[id]); changed = true; } else { if (Array.isArray(v.sols)) p.sols = v.sols.filter((id) => NODE_BY_ID[id]); if (Array.isArray(v.verts)) p.verts = v.verts.filter((id) => VERTICALS.some((vv) => vv.id === id)); changed = true; } });
      if (changed) { rebuildEdges(); setEditVer((v) => v + 1); setSaveState("Loaded saved links"); }
    } catch (e) {}
  }, []);
  useEffect(() => {
    if (gameOn || editorOn) return;
    const snap = { selected, active, vSel, answer, showAll }, h = hist.current;
    if (h.lock) { h.lock = false; return; }
    const t = h.stack[h.idx];
    if (t && t.selected === snap.selected && t.active === snap.active && t.vSel === snap.vSel && t.answer === snap.answer && t.showAll === snap.showAll) return;
    h.stack = h.stack.slice(0, h.idx + 1); h.stack.push(snap); if (h.stack.length > 60) h.stack.shift(); h.idx = h.stack.length - 1;
    setHistIdx(h.idx);
  }, [selected, active, vSel, answer, showAll, gameOn, editorOn]);
  const goHist = (d) => {
    const h = hist.current, ni = h.idx + d; if (ni < 0 || ni >= h.stack.length) return;
    h.idx = ni; h.lock = true; const s = h.stack[ni];
    setSelected(s.selected); setActive(s.active); setVSel(s.vSel); setAnswer(s.answer); setShowAll(s.showAll); setHistIdx(ni);
  };
  const selNeighbors = selected ? [...relatedSet(selected)].filter((id) => id !== selected).map((id) => NODE_BY_ID[id]).filter(Boolean) : [];
  const selGroups = selNode ? (() => { const g = { pain: [], solution: [], pillar: [] }; selNeighbors.forEach((n) => { if (g[n.type]) g[n.type].push(n); }); return g; })() : null;
  const selMetrics = selNode ? (() => {
    if (selNode.type === "solution") { const ps = PAINS.filter((p) => p.sols.includes(selNode.id)); const vc = new Set(); ps.forEach((p) => (p.verts || []).forEach((v) => vc.add(v))); const fa = NODE_BY_ID[selNode.pillar]; return [ps.length + " pain point" + (ps.length === 1 ? "" : "s"), vc.size + " vertical" + (vc.size === 1 ? "" : "s"), fa ? fa.label : ""].filter(Boolean); }
    if (selNode.type === "pain") { const sc = selNode.sols.length, vc = (selNode.verts || []).length; return [sc + " solution" + (sc === 1 ? "" : "s"), vc + " vertical" + (vc === 1 ? "" : "s")]; }
    if (selNode.type === "pillar") { const sc = SOLUTIONS.filter((s) => s.pillar === selNode.id).length, pc = PAINS.filter((p) => p.sols.some((sd) => NODE_BY_ID[sd].pillar === selNode.id) || p.pillar === selNode.id).length; return [sc + " solutions", "~" + pc + " pain points"]; }
    if (selNode.type === "core") return [PILLARS.length + " focus areas", SOLUTIONS.length + " solutions", PAINS.length + " pain points"];
    return [];
  })() : [];
  const histBack = histIdx > 0, histFwd = histIdx < hist.current.stack.length - 1;
  const viewLabel = selected ? (NODE_BY_ID[selected] ? NODE_BY_ID[selected].label : "Item") : vSel ? ((VERTICALS.find((v) => v.id === vSel) || {}).label || "Vertical") : answer ? "Search result" : active ? "Filtered view" : "Overview";
  const hoverNode = (hover && hover !== "core" && !active && !selected && !vSel && !answer) ? NODE_BY_ID[hover] : null;
  const hoverGroups = hoverNode ? (() => {
    const g = { pain: [], solution: [], pillar: [] };
    [...relatedSet(hover)].forEach((id) => { if (id === hover || id === "core") return; const n = NODE_BY_ID[id]; if (g[n.type]) g[n.type].push(n); });
    return g;
  })() : null;
  const EXAMPLES = ["Which solution covers the most pain points?", "Reduce shrink in grocery", "Speed up my drive-thru", "Campus vaping & safety", "Find footage faster"];

  return (
    <div style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", background: COLORS.bg, color: "#dce6f7", height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        .ttl{font-family:'Sora',system-ui,sans-serif}.chip{transition:all .15s ease;cursor:pointer}.chip:hover{transform:translateY(-1px)}
        ::placeholder{color:#5d6b86}.fade{animation:f .35s ease}@keyframes f{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 5, pointerEvents: "none" }}>
        <div style={{ pointerEvents: "auto" }}>
          <div className="ttl" style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>i3 Solution Galaxy</div>
          <div style={{ fontSize: 12.5, color: "#8595b3", marginTop: 2 }}>i3Ai at the core — focus areas, solutions and the pain points they solve orbit outward.</div>
        </div>
        <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(13,20,38,0.6)", border: "1px solid rgba(120,150,210,0.18)", padding: "8px 12px", borderRadius: 10, backdropFilter: "blur(8px)", fontSize: 11.5 }}>
            {[["Pain point", COLORS.pain], ["Solution", COLORS.solution], ["Focus area", COLORS.pillar], ["i3Ai", "#ffc0dc"]].map(([t, c], i, arr) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "#aab8d4" }}><span style={{ width: 9, height: 9, borderRadius: 9, background: c, boxShadow: `0 0 8px ${c}` }} />{t}{i < arr.length - 1 && <span style={{ margin: "0 2px 0 8px", color: "#5d6b87" }}>▸</span>}</span>
            ))}
          </div>
        </div>
      </div>


      {!gameOn && (<div style={{ position: "absolute", top: 70, left: 22, zIndex: 5, display: "flex", flexDirection: "column", gap: 8, maxWidth: 250 }}>
        <button onClick={openQuiz} style={{ background: "linear-gradient(135deg,#ff5d6c,#ff8a5c)", border: "none", color: "#fff", fontWeight: 700, fontSize: 12.5, padding: "9px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 18px rgba(255,93,108,0.3)" }}>🎮 Quiz mode</button>
        <button onClick={() => { if (editUnlocked) { setEditorOn(true); setSaveState(""); } else { setPinEntry(""); setPinErr(false); setLockOpen(true); } }} style={{ background: "rgba(13,20,38,0.7)", border: "1px solid rgba(124,178,221,0.35)", color: "#cfe0f6", fontWeight: 600, fontSize: 12, padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>✏️ Edit links {editUnlocked ? "" : "🔒"}</button>
        <div style={{ background: "rgba(13,20,38,0.7)", border: "1px solid rgba(124,178,221,0.3)", borderRadius: 12, padding: "10px 11px", display: "flex", flexDirection: "column", gap: 8, backdropFilter: "blur(8px)" }}>
          <div onClick={() => setRandOpen((o) => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#e6f1ff" }}>🎲 Randomizer</div>
            <span style={{ fontSize: 11, color: "#9fb6d6", transform: randOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▸</span>
          </div>
          {randOpen && (<>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span className="chip" onClick={() => { const all = rnd.pain && rnd.sol && rnd.focus; setRnd({ pain: !all, sol: !all, focus: !all }); }} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: "1px solid rgba(120,150,210,0.3)", color: "#9fb6d6" }}>{rnd.pain && rnd.sol && rnd.focus ? "all fixed" : "all random"}</span>
            </div>
            <div style={{ fontSize: 10, color: "#7e8eae", lineHeight: 1.4 }}>🎲 = random count · a number is the minimum, the rest connects in naturally.</div>
            {SectRow("Pain points", "pain", nPain, setNPain, PAINS.length)}
            {SectRow("Solutions", "sol", nSol, setNSol, SOLUTIONS.length)}
            {SectRow("Focus areas", "focus", nFocus, setNFocus, PILLARS.length)}
            <button onClick={randomize} style={{ background: "linear-gradient(135deg,#00588f,#2b9fd6)", border: "none", color: "#eaf4ff", fontWeight: 700, fontSize: 12.5, padding: "8px 12px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>🎲 Surprise me</button>
          </>)}
        </div>
        <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#e6b14a", fontWeight: 700 }}>Focus area</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          {PILLARS.map((p) => (<span key={p.id} className="chip" onClick={() => filterPillar(p.id)} style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 20, border: `1px solid ${selected === p.id ? (p.color || COLORS.pillar) : (p.color || COLORS.pillar) + "66"}`, background: selected === p.id ? (p.color || COLORS.pillar) + "2b" : "rgba(13,20,38,0.55)", color: selected === p.id ? "#fff" : "#aebed0", display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 8, background: p.color || COLORS.pillar, boxShadow: `0 0 6px ${p.color || COLORS.pillar}` }} />{p.label}</span>))}
        </div>
        <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#c4b0f7", fontWeight: 700, marginTop: 4 }}>Vertical</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          {VERTICALS.map((v) => (<span key={v.id} className="chip" onClick={() => filterVertical(v.id)} onMouseEnter={() => { vHoverRef.current = v.id; }} onMouseLeave={() => { if (vHoverRef.current === v.id) vHoverRef.current = null; }} style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 20, border: `1px solid ${vSel === v.id ? v.color : v.color + "66"}`, background: vSel === v.id ? v.color + "2b" : "rgba(13,20,38,0.55)", color: vSel === v.id ? "#fff" : "#cdd9ef", display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 8, background: v.color, boxShadow: `0 0 6px ${v.color}` }} />{v.label}</span>))}
        </div>
      </div>)}

      <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
        <canvas ref={canvasRef} onMouseMove={onMove} onClick={onClick} style={{ display: "block" }} />
        {hoverNode && (() => {
          const group = (title, arr, col) => arr.length ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7a99", marginBottom: 3 }}>{title}</div>
              {arr.slice(0, 8).map((n) => (<div key={n.id} style={{ fontSize: 11.5, color: "#d7e3f7", lineHeight: 1.45, display: "flex", gap: 6, alignItems: "flex-start" }}><span style={{ width: 6, height: 6, borderRadius: 6, background: col, flex: "0 0 auto", marginTop: 5 }} /><span>{n.short || n.label}</span></div>))}
              {arr.length > 8 && <div style={{ fontSize: 10.5, color: "#7e8eae", marginTop: 2 }}>+{arr.length - 8} more</div>}
            </div>
          ) : null;
          const bc = hoverNode.type === "solution" ? "#5fd6f2" : hoverNode.type === "pillar" ? (hoverNode.color || COLORS.pillar) : hoverNode.type === "core" ? "#ff9ec5" : COLORS.pain;
          return (
            <div className="fade" style={{ position: "absolute", top: 100, right: 22, zIndex: 7, pointerEvents: "none", width: 240, maxHeight: "calc(100% - 140px)", overflowY: "auto", background: "rgba(11,17,33,0.92)", border: `1px solid ${bc}`, borderTop: `3px solid ${bc}`, borderRadius: 12, padding: "12px 14px", backdropFilter: "blur(10px)", boxShadow: `0 12px 36px rgba(0,0,0,0.55), 0 0 18px ${bc}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: 9, background: bc, boxShadow: `0 0 8px ${bc}`, flex: "0 0 auto" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{hoverNode.label}</span>
              </div>
              {hoverNode.type === "pain" && hoverNode.desc && (
                <div style={{ fontSize: 11, color: "#8fa3c2", marginTop: 7, lineHeight: 1.5, borderLeft: `2px solid ${COLORS.pain}55`, paddingLeft: 8 }}>{hoverNode.desc}</div>
              )}
              {group("Pain points", hoverGroups.pain, COLORS.pain)}
              {group("Solutions", hoverGroups.solution, "#5fd6f2")}
              {group("Focus areas", hoverGroups.pillar, COLORS.pillar)}
              {hoverNode.type === "pain" && hoverNode.verts && hoverNode.verts.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7a99", marginBottom: 4 }}>Verticals</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {hoverNode.verts.map((vid) => { const vv = VERTICALS.find((x) => x.id === vid); return vv ? (<span key={vid} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: vv.color + "22", border: `1px solid ${vv.color}88`, color: "#e6eefc", display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: vv.color }} />{vv.label}</span>) : null; })}
                  </div>
                </div>
              )}
              <div style={{ fontSize: 10, color: "#6b7a99", marginTop: 8, fontStyle: "italic" }}>Click to organize ↗</div>
            </div>
          );
        })()}
      </div>

      {selNode && (() => {
        const cap = cardExpanded ? 99 : 6;
        const hidden = (selGroups.pain.length + selGroups.solution.length + selGroups.pillar.length) - Math.min(selGroups.pain.length, cap) - Math.min(selGroups.solution.length, cap) - Math.min(selGroups.pillar.length, cap);
        const grp = (title, arr, col) => arr.length ? (
          <div style={{ marginTop: 11 }}>
            <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7a99", marginBottom: 5 }}>{title} · {arr.length}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{arr.slice(0, cap).map((n) => (<span key={n.id} className="chip" onClick={() => setSelected(n.id)} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, background: col + "1f", border: `1px solid ${col}66`, color: "#dce7f8", display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: col }} />{n.short || n.label}</span>))}</div>
          </div>
        ) : null;
        return (
        <div className="fade" style={{ position: "absolute", top: 100, right: 22, width: 290, maxHeight: cardExpanded ? "calc(100vh - 130px)" : "auto", overflowY: cardExpanded ? "auto" : "visible", zIndex: 6, background: "rgba(11,17,33,0.92)", border: `1px solid ${selColor}55`, borderTop: `3px solid ${selColor}`, borderRadius: 14, padding: 16, backdropFilter: "blur(12px)", boxShadow: `0 16px 50px rgba(0,0,0,0.5), 0 0 22px ${selColor}2b` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ width: 10, height: 10, borderRadius: 10, background: selColor, boxShadow: `0 0 10px ${selColor}` }} /><span style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7e8eae" }}>{selNode.type === "pillar" ? "focus area" : selNode.type === "core" ? "core" : selNode.type}</span></div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div className="ttl" style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.25, flex: 1 }}>{selNode.label}</div>
            {selNode.type === "pain" && selNode.desc && (
              <span title={selNode.desc} style={{ flex: "0 0 auto", marginTop: 2, width: 18, height: 18, borderRadius: 9, background: "rgba(143,163,194,0.18)", border: "1px solid rgba(143,163,194,0.35)", color: "#8fa3c2", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", cursor: "default", lineHeight: 1 }}>i</span>
            )}
          </div>
          {selNode.type === "pain" && selNode.desc && (
            <div style={{ fontSize: 11.5, color: "#8fa3c2", marginTop: 7, lineHeight: 1.55, borderLeft: `2px solid ${selColor}55`, paddingLeft: 9 }}>{selNode.desc}</div>
          )}
          {selMetrics.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9 }}>{selMetrics.map((m, k) => (<span key={k} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: selColor + "1f", border: `1px solid ${selColor}44`, color: "#eaf2ff" }}>{m}</span>))}</div>}
          {selNode.desc && <div style={{ fontSize: 12.5, color: "#9fb0cd", marginTop: 10, lineHeight: 1.5 }}>{selNode.desc}</div>}
          {grp("Pain points", selGroups.pain, COLORS.pain)}
          {grp("Solutions", selGroups.solution, "#5fd6f2")}
          {grp("Focus areas", selGroups.pillar, COLORS.pillar)}
          {selNode.type === "pain" && selNode.verts && selNode.verts.length > 0 && (
            <div style={{ marginTop: 11 }}>
              <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7a99", marginBottom: 5 }}>Verticals</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{selNode.verts.map((vid) => { const vv = VERTICALS.find((x) => x.id === vid); return vv ? (<span key={vid} className="chip" onClick={() => filterVertical(vid)} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, background: vv.color + "22", border: `1px solid ${vv.color}88`, color: "#eaf2ff", display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 7, background: vv.color }} />{vv.label}</span>) : null; })}</div>
            </div>
          )}
          {(hidden > 0 || cardExpanded) && <div onClick={() => setCardExpanded((v) => !v)} style={{ marginTop: 12, fontSize: 11.5, color: "#9fb6d6", cursor: "pointer", fontWeight: 600 }}>{cardExpanded ? "Show less ↑" : `Show all (+${hidden}) ↓`}</div>}
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            {selNode.type === "solution" && (<a href="https://i3live.i3international.com/en/resource-library" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#0a1428", background: "#5fd6f2", padding: "8px 13px", borderRadius: 9, textDecoration: "none", fontWeight: 700 }}>View solution brief ↗</a>)}
            {selNode.url && <a href={selNode.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#5db8ff", textDecoration: "none", fontWeight: 600 }}>View on i3international.com →</a>}
          </div>
        </div>
        );
      })()}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 18px" }}>
        {gameOn ? (!quizMode ? (
          <div className="fade" style={{ maxWidth: 470, width: "100%", background: "rgba(11,17,33,0.95)", border: "1px solid rgba(124,178,221,0.4)", borderRadius: 16, padding: "20px 22px", backdropFilter: "blur(12px)", boxShadow: "0 16px 50px rgba(0,0,0,0.55)", textAlign: "center" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7e8eae" }}>Quiz mode</div>
            <div className="ttl" style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "6px 0 3px" }}>Pick how you want to play</div>
            <div style={{ fontSize: 12.5, color: "#9fb0cd", marginBottom: 12 }}>Match pain points to the right solution(s)</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#bcd0ee" }}>Pain points</span>
              <span className="chip" onClick={() => setQCount(Math.max(3, qCount - 1))} style={stepBtn}>−</span>
              <span style={{ minWidth: 20, textAlign: "center", fontWeight: 700, color: "#fff", fontSize: 15 }}>{qCount}</span>
              <span className="chip" onClick={() => setQCount(Math.min(14, qCount + 1))} style={stepBtn}>+</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => startQuiz("mc")} style={{ ...qPrimary, flex: 1, padding: "13px 10px", display: "flex", flexDirection: "column", gap: 3 }}><span style={{ fontSize: 14.5 }}>🔘 Multiple choice</span><span style={{ fontSize: 10.5, fontWeight: 500, opacity: 0.85 }}>{qCount} questions · pick one</span></button>
              <button onClick={() => startQuiz("connect")} style={{ ...qPrimary, flex: 1, padding: "13px 10px", background: "linear-gradient(135deg,#ff5d6c,#ff8a5c)", display: "flex", flexDirection: "column", gap: 3 }}><span style={{ fontSize: 14.5 }}>🔗 Connect the lines</span><span style={{ fontSize: 10.5, fontWeight: 500, opacity: 0.9 }}>Rebuild the whole map</span></button>
            </div>
            <button onClick={exitQuiz} style={{ ...qGhost, marginTop: 12 }}>Cancel</button>
          </div>
        ) : quizMode === "connect" ? (() => {
          if (!cBoard) return null;
          const { pains, sols, focus } = cBoard;
          const correct = cEdges.filter((k) => cTarget.includes(k)).length, wrong = cEdges.length - correct;
          const done = correct === cTarget.length && wrong === 0;
          const colW = 150, gapW = 60, rowPitch = 42, coreW = 56, headerH = 22;
          const cols = [pains, sols, focus];
          const maxRows = Math.max(pains.length, sols.length, focus.length, 1), usable = maxRows * rowPitch, boardH = headerH + usable;
          const colX = [0, colW + gapW, 2 * (colW + gapW)], coreX = 3 * (colW + gapW), boardW = coreX + coreW;
          const nodeY = (arr, i) => headerH + (usable - arr.length * rowPitch) / 2 + i * rowPitch + rowPitch / 2;
          const posOf = (id) => { for (let c = 0; c < 3; c++) { const idx = cols[c].findIndex((n) => n.id === id); if (idx >= 0) return { x: colX[c], y: nodeY(cols[c], idx) }; } return null; };
          const colCol = [COLORS.pain, "#5fd6f2", COLORS.pillar], colTitle = ["PAIN POINTS", "SOLUTIONS", "FOCUS"];
          return (
            <div className="fade" style={{ maxWidth: 880, width: "100%", background: "rgba(11,17,33,0.96)", border: "1px solid rgba(124,178,221,0.4)", borderRadius: 16, padding: "14px 16px", backdropFilter: "blur(12px)", boxShadow: "0 16px 50px rgba(0,0,0,0.55)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>🔗 Connect the lines</span>
                <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: done ? "#43c479" : "#cdd9ef" }}>{correct} / {cTarget.length} links{wrong ? ` · ${wrong} wrong` : ""}</span>
                  <span onClick={exitQuiz} style={{ cursor: "pointer", color: "#8595b3", fontSize: 14 }}>✕</span>
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: "#7e8eae", marginBottom: 4 }}>Tap a pain then a solution to link them — then link each solution to its focus area. Green = correct, coral = wrong.</div>
              <div style={{ overflow: "auto", maxHeight: "50vh" }}>
                <div style={{ position: "relative", width: boardW, height: boardH, margin: "0 auto" }}>
                  <svg width={boardW} height={boardH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    {focus.map((f) => { const fp = posOf(f.id); return <path key={"fc" + f.id} d={`M ${colX[2] + colW} ${fp.y} C ${coreX - 28} ${fp.y}, ${coreX - 28} ${headerH + usable / 2}, ${coreX} ${headerH + usable / 2}`} stroke="rgba(124,178,221,0.28)" strokeWidth="1.5" fill="none" />; })}
                    {cEdges.map((k) => { const [a, b] = k.split(">"); const pa = posOf(a), pb = posOf(b); if (!pa || !pb) return null; const ok = cTarget.includes(k); return <path key={k} d={`M ${pa.x + colW} ${pa.y} C ${pa.x + colW + gapW * 0.5} ${pa.y}, ${pb.x - gapW * 0.5} ${pb.y}, ${pb.x} ${pb.y}`} stroke={ok ? "#43c479" : "#ff5d6c"} strokeWidth="2.5" fill="none" opacity="0.9" />; })}
                  </svg>
                  {colTitle.map((t, c) => <div key={t} style={{ position: "absolute", left: colX[c], top: 0, width: colW, textAlign: "center", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", color: colCol[c] }}>{t}</div>)}
                  <div style={{ position: "absolute", left: coreX, top: 0, width: coreW, textAlign: "center", fontSize: 9.5, fontWeight: 700, color: "#ffc0dc" }}>CORE</div>
                  <div style={{ position: "absolute", left: coreX, top: headerH + usable / 2 - 18, width: coreW, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "rgba(255,158,197,0.16)", border: "1px solid #ff9ec5", color: "#ffd9ec", fontSize: 11, fontWeight: 700 }}>i3Ai</div>
                  {cols.map((arr, c) => arr.map((n, i) => { const y = nodeY(arr, i), sel = cSelA === n.id; return <button key={n.id} onClick={() => clickNode(n.id)} title={n.label} style={{ position: "absolute", left: colX[c], top: y - 17, width: colW, height: 34, textAlign: "left", background: sel ? "rgba(255,255,255,0.14)" : "rgba(20,30,52,0.9)", border: sel ? "2px solid #fff" : `1px solid ${colCol[c]}`, color: "#dce7f8", borderRadius: 9, padding: "0 9px", fontSize: 10.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", transition: "all .12s" }}>{n.short || n.label}</button>; }))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, gap: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: done ? "#43c479" : "#9fb0cd" }}>{done ? "Complete! 🎉 You rebuilt the map." : cSelA ? "Now tap a node in the next column…" : "Tap a node to start a link."}</span>
                <span style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setCEdges([]); setCSelA(null); }} style={qGhost}>Reset</button>
                  <button onClick={openQuiz} style={qPrimary}>New board</button>
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#5d6b87", marginTop: 8, fontStyle: "italic" }}>Mappings are our logical inference for validation — not final.</div>
            </div>
          );
        })() : (() => {
          const len = gQs.length;
          if (gIdx >= len) return (
            <div className="fade" style={{ maxWidth: 460, width: "100%", background: "rgba(11,17,33,0.95)", border: "1px solid rgba(124,178,221,0.4)", borderRadius: 16, padding: "20px 22px", backdropFilter: "blur(12px)", boxShadow: "0 16px 50px rgba(0,0,0,0.55)", textAlign: "center" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7e8eae" }}>Quiz complete</div>
              <div className="ttl" style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "6px 0" }}>{gScore} / {len}</div>
              <div style={{ fontSize: 13, color: "#9fb0cd" }}>Best streak: {gBest} 🔥</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
                <button onClick={() => startQuiz(quizMode)} style={qPrimary}>Play again</button>
                <button onClick={openQuiz} style={qGhost}>Change mode</button>
                <button onClick={exitQuiz} style={qGhost}>Exit</button>
              </div>
            </div>
          );
          const q = gQs[gIdx], answered = gPicked !== null, right = answered && q.options[gPicked].id === q.answerId;
          const head = (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "#7e8eae", letterSpacing: "0.06em" }}>Question {gIdx + 1} / {len}</span>
              <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#cdd9ef" }}>Score <b style={{ color: "#fff" }}>{gScore}</b></span>
                <span style={{ fontSize: 12, color: gStreak > 0 ? "#ffb24d" : "#7e8eae" }}>🔥 {gStreak}</span>
                <span onClick={exitQuiz} style={{ cursor: "pointer", color: "#8595b3", fontSize: 14 }}>✕</span>
              </span>
            </div>
          );
          return (
            <div className="fade" style={{ maxWidth: 540, width: "100%", background: "rgba(11,17,33,0.95)", border: "1px solid rgba(124,178,221,0.4)", borderRadius: 16, padding: "16px 18px", backdropFilter: "blur(12px)", boxShadow: "0 16px 50px rgba(0,0,0,0.55)" }}>
              {head}
              <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7a99" }}>Which solution addresses…</div>
              <div className="ttl" style={{ fontSize: 18, fontWeight: 700, color: COLORS.pain, margin: "4px 0 12px", lineHeight: 1.25 }}>{q.painLabel}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {q.options.map((o, i) => {
                  const isAns = o.id === q.answerId, isPicked = gPicked === i;
                  let bg = "rgba(20,30,52,0.8)", bd = "rgba(120,150,210,0.25)", cl = "#cfdcf2";
                  if (answered) {
                    if (isAns) { bg = "rgba(46,160,90,0.22)"; bd = "#43c479"; cl = "#d6ffe6"; }
                    else if (isPicked) { bg = "rgba(223,60,70,0.2)"; bd = "#ff5d6c"; cl = "#ffd5d8"; }
                    else { bg = "rgba(20,30,52,0.45)"; cl = "#7d8aa8"; }
                  }
                  return (<button key={o.id} onClick={() => pickAnswer(i)} disabled={answered} style={{ textAlign: "left", background: bg, border: `1px solid ${bd}`, color: cl, borderRadius: 10, padding: "10px 12px", fontSize: 12.5, fontWeight: 600, cursor: answered ? "default" : "pointer", fontFamily: "inherit", transition: "all .15s" }}>{o.short || o.label}{answered && isAns ? "  ✓" : answered && isPicked ? "  ✗" : ""}</button>);
                })}
              </div>
              {answered && (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: right ? "#43c479" : "#ff8a93" }}>{right ? "Correct!" : `It's ${NODE_BY_ID[q.answerId].short || NODE_BY_ID[q.answerId].label}`}</span>
                <button onClick={nextQ} style={qPrimary}>{gIdx + 1 >= len ? "See results →" : "Next →"}</button>
              </div>)}
              <div style={{ fontSize: 10, color: "#5d6b87", marginTop: 10, fontStyle: "italic" }}>Mappings are our logical inference for validation — not final.</div>
            </div>
          );
        })()) : (<>
        {answer && (<div className="fade" style={{ maxWidth: 620, width: "100%", marginBottom: 10, background: "rgba(11,17,33,0.9)", border: "1px solid rgba(0,88,143,0.55)", borderRadius: 14, padding: "13px 16px", backdropFilter: "blur(12px)" }}><div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5db8ff", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: "#5db8ff" }} /> Galaxy guide</div><div style={{ fontSize: 13, color: "#d7e3f7", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{answer.text}</div></div>)}
        <div style={{ maxWidth: 620, width: "100%", position: "relative" }}>
          <div style={narrow ? { display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", marginBottom: 8 } : { position: "absolute", left: "calc(100% + 12px)", bottom: 0, display: "flex", alignItems: "center", gap: 8, zIndex: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(13,20,38,0.72)", border: "1px solid rgba(120,150,210,0.25)", borderRadius: 22, padding: "5px 7px", backdropFilter: "blur(8px)" }}>
              <button onClick={() => goHist(-1)} disabled={!histBack} title="Back" style={{ width: 26, height: 26, flex: "0 0 auto", borderRadius: 13, border: "1px solid rgba(120,150,210,0.3)", background: "rgba(13,20,38,0.6)", color: histBack ? "#dbecff" : "#4a5772", cursor: histBack ? "pointer" : "default", fontFamily: "inherit", fontSize: 12 }}>◀</button>
              <span style={{ width: 130, textAlign: "center", fontSize: 11.5, color: "#aab8d4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{viewLabel}</span>
              <button onClick={() => goHist(1)} disabled={!histFwd} title="Forward" style={{ width: 26, height: 26, flex: "0 0 auto", borderRadius: 13, border: "1px solid rgba(120,150,210,0.3)", background: "rgba(13,20,38,0.6)", color: histFwd ? "#dbecff" : "#4a5772", cursor: histFwd ? "pointer" : "default", fontFamily: "inherit", fontSize: 12 }}>▶</button>
            </div>
            {(active || selected || vSel || answer || showAll) && (<button onClick={reset} title="Reset view" style={{ width: 34, height: 34, flex: "0 0 auto", borderRadius: 17, border: "1px solid rgba(223,30,113,0.45)", background: "rgba(223,30,113,0.16)", color: "#ff9ec5", fontSize: 17, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(8px)", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0 }}>⟳</button>)}
          </div>
          <div style={{ display: "flex", gap: 7, marginBottom: 9, flexWrap: "wrap", justifyContent: "center" }}>{EXAMPLES.map((ex) => (<span key={ex} className="chip" onClick={() => { setQuery(ex); askUniverse(ex); }} style={{ fontSize: 11, padding: "5px 11px", borderRadius: 18, background: "rgba(13,20,38,0.6)", border: "1px solid rgba(120,150,210,0.2)", color: "#9fb0cd" }}>{ex}</span>))}</div>
          <div style={{ display: "flex", gap: 8, background: "rgba(11,17,33,0.9)", border: "1px solid rgba(120,150,210,0.3)", borderRadius: 14, padding: 7, backdropFilter: "blur(12px)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") askUniverse(query); }} placeholder="Ask the galaxy — describe a problem, vertical, or focus area…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#eaf1ff", fontSize: 13.5, padding: "8px 12px", fontFamily: "inherit" }} />
            <button onClick={() => askUniverse(query)} disabled={thinking} style={{ background: thinking ? "rgba(0,88,143,0.5)" : "linear-gradient(135deg,#00588f,#2b9fd6)", border: "none", color: "#eaf4ff", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>{thinking ? "Tracing…" : "Trace"}</button>
          </div>
        </div>
        </>)}
      </div>

      {showNote && !editorOn && (<div style={{ position: "absolute", bottom: 18, left: 22, zIndex: 6, maxWidth: 240, background: "rgba(0,88,143,0.18)", border: "1px solid rgba(0,88,143,0.5)", borderRadius: 10, padding: "10px 12px", fontSize: 11, color: "#bcd6ff", lineHeight: 1.5 }}><strong style={{ color: "#9cc6ff" }}>Concept note.</strong> Pain points and solution names come from your mapping sheet. The focus-area grouping and the pain→solution links are our logical inference — the sheet's matrix cells were blank — so they're for validation, not final.<span onClick={() => setShowNote(false)} style={{ display: "block", marginTop: 6, color: "#7fb0ff", cursor: "pointer", fontWeight: 600 }}>Got it ✕</span></div>)}

      {lockOpen && (<div style={{ position: "absolute", inset: 0, zIndex: 22, background: "rgba(6,11,22,0.9)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="fade" style={{ width: 320, background: "rgba(11,17,33,0.97)", border: "1px solid rgba(124,178,221,0.4)", borderRadius: 16, padding: "20px 22px", boxShadow: "0 16px 50px rgba(0,0,0,0.6)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>🔒 Editor access</div>
          <div style={{ fontSize: 12, color: "#9fb0cd", margin: "6px 0 14px" }}>Enter the passcode to edit the pain → solution links.</div>
          <input type="password" autoFocus value={pinEntry} onChange={(e) => { setPinEntry(e.target.value); setPinErr(false); }} onKeyDown={(e) => { if (e.key === "Enter") { if (pinEntry === EDIT_PIN) { setEditUnlocked(true); setLockOpen(false); setEditorOn(true); setSaveState(""); } else setPinErr(true); } }} placeholder="Passcode" style={{ width: "100%", boxSizing: "border-box", background: "rgba(13,20,38,0.9)", border: `1px solid ${pinErr ? "#ff5d6c" : "rgba(120,150,210,0.3)"}`, borderRadius: 9, color: "#eaf1ff", fontSize: 14, padding: "10px 12px", outline: "none", fontFamily: "inherit" }} />
          {pinErr && <div style={{ fontSize: 11.5, color: "#ff8a93", marginTop: 6 }}>Incorrect passcode.</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => { if (pinEntry === EDIT_PIN) { setEditUnlocked(true); setLockOpen(false); setEditorOn(true); setSaveState(""); } else setPinErr(true); }} style={{ ...qPrimary, flex: 1 }}>Unlock</button>
            <button onClick={() => setLockOpen(false)} style={qGhost}>Cancel</button>
          </div>
          <div style={{ fontSize: 10, color: "#5d6b87", marginTop: 12, fontStyle: "italic" }}>Light gate to prevent accidental edits — not full security on a client-side tool.</div>
        </div>
      </div>)}

      {editorOn && (() => {
        const ep = editPain ? NODE_BY_ID[editPain] : null;
        const list = PAINS.filter((p) => !editSearch || p.label.toLowerCase().includes(editSearch.toLowerCase()));
        const ebtn = { background: "rgba(13,20,38,0.8)", border: "1px solid rgba(124,178,221,0.35)", color: "#cfe0f6", fontWeight: 600, fontSize: 12, padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" };
        return (
          <div style={{ position: "absolute", inset: 0, zIndex: 20, background: "rgba(6,11,22,0.97)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", color: "#e6f1ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(120,150,210,0.2)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span className="ttl" style={{ fontSize: 16, fontWeight: 800 }}>✏️ Edit pain → solution links</span>
                <span style={{ fontSize: 11.5, color: /✓|Reverted|Loaded/.test(saveState) ? "#43c479" : "#e6b14a" }}>{saveState}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={exportMap} style={ebtn}>⧉ Copy changes</button>
                <label style={{ ...ebtn, display: "inline-block" }}>⬆ Import<input type="file" accept="application/json,.json" onChange={(e) => { if (e.target.files[0]) importMap(e.target.files[0]); e.target.value = ""; }} style={{ display: "none" }} /></label>
                <button onClick={revertMap} style={ebtn}>↺ Revert to inferred</button>
                <button onClick={() => { setEditorOn(false); if (editPain) { setActive(null); setVSel(null); setAnswer(null); setSelected(editPain); } }} style={{ ...ebtn, background: "linear-gradient(135deg,#00588f,#2b9fd6)", border: "none", color: "#eaf4ff", fontWeight: 700 }}>Done</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
              <div style={{ width: 310, borderRight: "1px solid rgba(120,150,210,0.18)", display: "flex", flexDirection: "column", minHeight: 0 }}>
                <div style={{ padding: "10px 12px" }}>
                  <input value={editSearch} onChange={(e) => setEditSearch(e.target.value)} placeholder="Search pain points…" style={{ width: "100%", boxSizing: "border-box", background: "rgba(13,20,38,0.8)", border: "1px solid rgba(120,150,210,0.3)", borderRadius: 8, color: "#eaf1ff", fontSize: 12.5, padding: "8px 10px", outline: "none", fontFamily: "inherit" }} />
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
                  {list.map((p) => { const sel = editPain === p.id, n = p.sols.length; return (
                    <div key={p.id} onClick={() => setEditPain(p.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: "pointer", background: sel ? "rgba(255,93,108,0.16)" : "transparent", border: sel ? "1px solid rgba(255,93,108,0.5)" : "1px solid transparent", marginBottom: 3 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: sel ? "#ffd5d8" : "#cdd9ef", lineHeight: 1.3 }}>{p.label}</div>
                        {(p.verts || []).length > 0 && <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>{(p.verts || []).map((vid) => { const vv = VERTICALS.find((v) => v.id === vid); return vv ? (<span key={vid} style={{ width: 7, height: 7, borderRadius: 7, background: vv.color, display: "inline-block" }} title={vv.label} />) : null; })}</div>}
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: n ? "#7fc0a0" : "#ff8a93", flex: "0 0 auto" }}>{n}</span>
                    </div>
                  ); })}
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px", minHeight: 0 }}>
                {!ep ? (
                  <div style={{ color: "#7e8eae", fontSize: 13, marginTop: 20 }}>Select a pain point on the left to edit which solutions address it.</div>
                ) : (<>
                  <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7a99" }}>Editing pain point</div>
                  <div className="ttl" style={{ fontSize: 19, fontWeight: 700, color: COLORS.pain, margin: "3px 0 4px" }}>{ep.label}</div>
                  <div style={{ fontSize: 12, color: "#9fb0cd", marginBottom: ep.desc ? 10 : 16 }}>{ep.sols.length} solution{ep.sols.length === 1 ? "" : "s"} · {(ep.verts || []).length} vertical{(ep.verts || []).length === 1 ? "" : "s"} linked · tap to toggle</div>
                  {ep.desc && <div style={{ fontSize: 12.5, color: "#8fa3c2", lineHeight: 1.6, marginBottom: 16, padding: "10px 12px", background: "rgba(143,163,194,0.07)", borderLeft: `3px solid ${COLORS.pain}55`, borderRadius: "0 8px 8px 0" }}>{ep.desc}</div>}
                  {PILLARS.map((pl) => { const sols = SOLUTIONS.filter((s) => s.pillar === pl.id); return (
                    <div key={pl.id} style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: pl.color || COLORS.pillar, marginBottom: 8, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: 8, background: pl.color || COLORS.pillar, boxShadow: `0 0 6px ${pl.color || COLORS.pillar}` }} />{pl.label}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {sols.map((s) => { const on = ep.sols.includes(s.id); return (
                          <span key={s.id} onClick={() => toggleLink(ep.id, s.id)} title={s.desc || ""} style={{ fontSize: 12, padding: "7px 11px", borderRadius: 8, cursor: "pointer", border: `1px solid ${on ? "#43c479" : "rgba(120,150,210,0.3)"}`, background: on ? "rgba(46,160,90,0.2)" : "rgba(20,30,52,0.7)", color: on ? "#d6ffe6" : "#aebed0", transition: "all .12s" }}>{s.label}{on ? "  ✓" : ""}</span>
                        ); })}
                      </div>
                    </div>
                  ); })}
                  <div style={{ marginTop: 4, paddingTop: 14, borderTop: "1px solid rgba(120,150,210,0.15)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#c4b0f7", marginBottom: 8, letterSpacing: "0.04em" }}>VERTICALS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {VERTICALS.map((v) => { const on = (ep.verts || []).includes(v.id); return (
                        <span key={v.id} onClick={() => toggleVert(ep.id, v.id)} style={{ fontSize: 12, padding: "7px 11px", borderRadius: 8, cursor: "pointer", border: `1px solid ${on ? v.color : v.color + "55"}`, background: on ? v.color + "2e" : "rgba(20,30,52,0.7)", color: on ? "#fff" : "#aebed0", transition: "all .12s", display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 8, background: v.color, boxShadow: on ? `0 0 6px ${v.color}` : "none", opacity: on ? 1 : 0.5 }} />{v.label}{on ? " ✓" : ""}</span>
                      ); })}
                    </div>
                  </div>
                </>)}
              </div>
            </div>
            <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(120,150,210,0.18)", fontSize: 11, color: "#7e8eae" }}>Edits update the galaxy, filters, search, and quiz immediately, and auto-save to this browser when storage is available (watch the status above). If it shows "session only" or "save failed", use Export JSON to keep your changes or hand them back for baking in permanently. Solution → focus-area grouping is fixed by each solution's pillar.</div>
          </div>
        );
      })()}
      {exportText !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(4,8,18,0.78)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setExportText(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(680px,100%)", maxHeight: "82vh", display: "flex", flexDirection: "column", background: "rgba(11,17,33,0.97)", border: "1px solid rgba(120,150,210,0.3)", borderRadius: 14, padding: 18, boxShadow: "0 24px 70px rgba(0,0,0,0.6)" }}>
            <div className="ttl" style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Copy your changes</div>
            <div style={{ fontSize: 12.5, color: "#9fb0cd", marginBottom: 12, lineHeight: 1.5 }}>Downloads are blocked in this view, so copy the text below and paste it back to me in chat. I'll bake the links into the app permanently.</div>
            <textarea id="exp-ta" readOnly value={exportText} onFocus={(e) => e.target.select()} style={{ flex: 1, minHeight: 220, width: "100%", boxSizing: "border-box", background: "#0a1426", border: "1px solid rgba(120,150,210,0.25)", borderRadius: 10, color: "#cfe0f6", fontSize: 12, fontFamily: "ui-monospace,Menlo,monospace", padding: 12, resize: "vertical", outline: "none" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
              <button onClick={() => setExportText(null)} style={{ fontSize: 13, padding: "9px 15px", borderRadius: 9, border: "1px solid rgba(120,150,210,0.3)", background: "rgba(20,30,52,0.7)", color: "#cdd9ef", cursor: "pointer", fontFamily: "inherit" }}>Close</button>
              <button onClick={async () => { try { await navigator.clipboard.writeText(exportText); setSaveState("Copied to clipboard ✓"); } catch (e) { const ta = document.getElementById("exp-ta"); if (ta) { ta.focus(); ta.select(); } } }} style={{ fontSize: 13, fontWeight: 700, padding: "9px 17px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#00588f,#2b9fd6)", color: "#eaf4ff", cursor: "pointer", fontFamily: "inherit" }}>Copy to clipboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
