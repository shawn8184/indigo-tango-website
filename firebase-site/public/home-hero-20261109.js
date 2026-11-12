/* Indigo Tango — home hero animations, 2026-11-09.
   Drop-in replacement for home-teal.js. Same markup, same pause button,
   same reduced-motion and off-screen behaviour.

   Pick the scene on the canvas element:
     <canvas id="network-canvas" data-scene="orbit"></canvas>
   orbit    Separate systems settle into one connected business (default)
   threads  Tangled strands resolve into one clean ribbon
   pipeline Requests flow through AI, then team approval, to outcomes
*/
(() => {
  'use strict';
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const hero = canvas.closest('.network-hero') || document.querySelector('.network-hero');
  const pauseButton = hero.querySelector('.network-pause');
  const ctx = canvas.getContext('2d');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  const MONO = "ui-monospace,'SF Mono',SFMono-Regular,Menlo,Consolas,monospace";

  let paused = preference.matches, visible = true, raf = 0, last = 0;
  let time = 0, intro = preference.matches ? 1 : 0;
  let W = 0, H = 0, px = 0, py = 0, tx = 0, ty = 0;

  /* ---------- helpers ---------- */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const teal = a => `rgba(0,194,209,${a})`;
  const aqua = a => `rgba(124,232,237,${a})`;
  const ice = a => `rgba(214,252,253,${a})`;
  const dim = a => `rgba(90,156,163,${a})`;
  // Deterministic pseudo-random so every visit draws the same composition.
  const rand = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function label(text, x, y, align, alpha, size = 9) {
    ctx.font = `${size}px ${MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.4px';
    ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(150,196,201,${alpha})`;
    ctx.fillText(text, x, y);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }
  function glowDot(x, y, r, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, ice(.95 * a)); g.addColorStop(.18, `rgba(0,214,228,${.55 * a})`); g.addColorStop(1, teal(0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  const frameBox = () => {
    const mobile = W < 700;
    return mobile
      ? {mobile, cx: W * .5, cy: H * .7, r: Math.min(W * .36, H * .18)}
      : {mobile, cx: W * .755, cy: H * .425, r: Math.min(W * .22, H * .34)};
  };

  /* ---------- shared backdrop: quiet dot lattice ---------- */
  const stars = Array.from({length: 64}, (_, i) => ({x: ((i * 37.731) % 100) / 100, y: ((i * 59.137) % 100) / 100, phase: i * 1.73}));
  function backdrop(box) {
    const g = ctx.createRadialGradient(box.cx, box.cy, 0, box.cx, box.cy, box.r * 2.1);
    g.addColorStop(0, teal(.075)); g.addColorStop(.5, teal(.035)); g.addColorStop(1, teal(0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = .6;
    stars.forEach((a, i) => {
      const ax = a.x * W + px * -10, ay = a.y * H + py * -10;
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j], bx = b.x * W + px * -10, by = b.y * H + py * -10, d = Math.hypot(ax - bx, ay - by);
        if (d < 130) { ctx.strokeStyle = `rgba(77,151,163,${.06 * (1 - d / 130)})`; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); }
      }
      ctx.fillStyle = `rgba(64,187,198,${.1 + (Math.sin(time * .5 + a.phase) + 1) * .06})`;
      ctx.beginPath(); ctx.arc(ax, ay, 1, 0, TAU); ctx.fill();
    });
  }

  /* =====================================================================
     Scene 1 — ORBIT
     Six everyday systems start out scattered and unlinked, then settle
     onto one orbit around the business and begin handing work to each other.
     ===================================================================== */
  const orbit = (() => {
    const names = ['INBOX', 'CRM', 'ACCOUNTING', 'DOCUMENTS', 'CALENDAR', 'SERVICE DESK'];
    const N = names.length, R = .98;
    const nodes = names.map((name, i) => {
      const a = rand(i + 1) * TAU, rr = .62 + rand(i + 11) * .72;
      return {name, slot: i / N * TAU, sx: Math.cos(a) * rr, sy: (rand(i + 21) - .5) * 1.0, sz: Math.sin(a) * rr, seed: rand(i + 31) * TAU, flash: 0, x: 0, y: 0, z: 0, s: 1, m: [0, 0, 0]};
    });
    const core = Array.from({length: 230}, (_, i) => {
      const y = 1 - (i + .5) / 115, r = Math.sqrt(1 - y * y), a = i * 2.39996323;
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    });
    const pulses = Array.from({length: 5}, (_, i) => ({from: i % N, to: (i * 2 + 3) % N, p: -i * .42, n: i * 7}));
    let box, yaw, cosT, sinT, cosR, sinR;
    function project(x, y, z, out) {
      const cy_ = Math.cos(yaw), sy_ = Math.sin(yaw);
      let X = x * cy_ - z * sy_, Z = x * sy_ + z * cy_, Y = y;
      const Y2 = Y * cosT - Z * sinT; Z = Y * sinT + Z * cosT; Y = Y2;
      const X2 = X * cosR - Y * sinR; Y = X * sinR + Y * cosR; X = X2;
      const s = 3.2 / (3.2 - Z);
      out.x = box.cx + X * box.r * s; out.y = box.cy + Y * box.r * s; out.z = Z; out.s = s;
      return out;
    }
    const tmp = {x: 0, y: 0, z: 0, s: 1}, tmp2 = {x: 0, y: 0, z: 0, s: 1};
    // Point along node -> core (t 0..1) or core -> node (t 1..2), in model space, gently bowed.
    function along(node, t, out) {
      const m = node.m, bow = Math.sin(t * Math.PI) * .16;
      return project(m[0] * (1 - t), m[1] * (1 - t) - bow, m[2] * (1 - t), out);
    }
    function draw(b) {
      box = b;
      const tilt = 1.02 + Math.sin(time * .11) * .05 + py * .16;
      yaw = px * .35; cosT = Math.cos(tilt); sinT = Math.sin(tilt); cosR = Math.cos(-.34); sinR = Math.sin(-.34);
      const spin = time * .05;
      const settle = easeInOut(smooth(.05, .8, intro));

      // Instrument rings in the orbital plane.
      const ringAlpha = smooth(.25, .85, intro);
      ctx.lineWidth = 1;
      [[R, .2, []], [R, .5, [1, 8]], [.6, .26, [1, 9]], [1.5, .12, [1, 12]]].forEach(([rad, alpha, dash]) => {
        ctx.setLineDash(dash); ctx.strokeStyle = teal(alpha * ringAlpha); ctx.beginPath();
        for (let i = 0; i <= 96; i++) { const a = i / 96 * TAU + spin * .4; project(Math.cos(a) * rad, 0, Math.sin(a) * rad, tmp); i ? ctx.lineTo(tmp.x, tmp.y) : ctx.moveTo(tmp.x, tmp.y); }
        ctx.stroke();
      });
      ctx.setLineDash([]);
      for (let i = 0; i < 90; i++) {
        const a = i / 90 * TAU - spin * .6, long = i % 15 === 0, r1 = 1.24, r2 = long ? 1.32 : 1.27;
        project(Math.cos(a) * r1, 0, Math.sin(a) * r1, tmp); project(Math.cos(a) * r2, 0, Math.sin(a) * r2, tmp2);
        ctx.strokeStyle = dim((long ? .85 : .42) * ringAlpha * (.6 + tmp.z * .4)); ctx.beginPath(); ctx.moveTo(tmp.x, tmp.y); ctx.lineTo(tmp2.x, tmp2.y); ctx.stroke();
      }

      // Node positions: scattered -> seated on the shared orbit.
      nodes.forEach((n, i) => {
        const k = easeInOut(clamp((settle * 1.35) - i * .07));
        const a = n.slot + spin, bob = Math.sin(time * .7 + n.seed) * .03;
        const drift = (1 - k) * .06;
        n.m[0] = lerp(n.sx + Math.sin(time * .4 + n.seed) * drift, Math.cos(a) * R, k);
        n.m[1] = lerp(n.sy + Math.cos(time * .33 + n.seed) * drift, bob, k);
        n.m[2] = lerp(n.sz, Math.sin(a) * R, k);
        project(n.m[0], n.m[1], n.m[2], n);
        n.flash *= .94;
      });

      // Links from each system to the centre draw in one by one.
      nodes.forEach((n, i) => {
        const grow = easeOut(clamp((intro - .34 - i * .07) / .3));
        if (grow <= 0) return;
        const steps = 22, upto = Math.ceil(steps * grow);
        ctx.beginPath();
        for (let s = 0; s <= upto; s++) { along(n, Math.min(s / steps, grow), tmp); s ? ctx.lineTo(tmp.x, tmp.y) : ctx.moveTo(tmp.x, tmp.y); }
        ctx.lineWidth = 5; ctx.strokeStyle = teal(.05 + n.flash * .08); ctx.stroke();
        ctx.lineWidth = 1; ctx.strokeStyle = aqua(.36 + n.flash * .4); ctx.stroke();
      });

      // The business at the centre.
      const coreR = .27, coreSpin = time * .16;
      project(0, 0, 0, tmp);
      const cg = ctx.createRadialGradient(tmp.x, tmp.y, 0, tmp.x, tmp.y, box.r * .62);
      cg.addColorStop(0, teal(.26 + .12 * ringAlpha)); cg.addColorStop(.4, teal(.09)); cg.addColorStop(1, teal(0));
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(tmp.x, tmp.y, box.r * .62, 0, TAU); ctx.fill();
      const ccx = tmp.x, ccy = tmp.y;
      core.forEach(p => {
        const c = Math.cos(coreSpin), s = Math.sin(coreSpin);
        project((p[0] * c - p[2] * s) * coreR, p[1] * coreR, (p[0] * s + p[2] * c) * coreR, tmp);
        const front = (tmp.z / coreR + 1) / 2;
        ctx.fillStyle = aqua(.16 + front * .7); ctx.beginPath(); ctx.arc(tmp.x, tmp.y, .7 + front * 1.1, 0, TAU); ctx.fill();
      });
      // Three great circles give the centre a readable volume.
      ctx.lineWidth = 1;
      for (let g = 0; g < 3; g++) {
        ctx.strokeStyle = aqua(.2); ctx.beginPath();
        for (let i = 0; i <= 48; i++) {
          const a = i / 48 * TAU, ca = Math.cos(a) * coreR, sa = Math.sin(a) * coreR, q = coreSpin + g * 1.05, c = Math.cos(q), s = Math.sin(q);
          g === 2 ? project(ca, 0, sa, tmp) : project(ca * c, sa, ca * s, tmp);
          i ? ctx.lineTo(tmp.x, tmp.y) : ctx.moveTo(tmp.x, tmp.y);
        }
        ctx.stroke();
      }
      if (!box.mobile) label('YOUR BUSINESS', ccx, ccy + box.r * .42, 'center', .9 * ringAlpha);

      // Work handed from one system, through the business, to another.
      if (intro > .82 && !preference.matches) {
        pulses.forEach(p => {
          if (p.p >= 2) { nodes[p.to].flash = 1; p.from = p.to; p.n++; p.to = (p.from + 1 + Math.floor(rand(p.n) * (N - 1))) % N; p.p = -rand(p.n + 5) * .5; }
          if (p.p < 0) return;
          const node = p.p < 1 ? nodes[p.from] : nodes[p.to];
          for (let k = 9; k >= 0; k--) {
            const t = p.p - k * .018; if (t < 0 || (p.p >= 1 && t < 1)) continue;
            along(node, t < 1 ? t : 2 - t, tmp);
            if (k === 0) glowDot(tmp.x, tmp.y, 11, 1);
            else { ctx.fillStyle = aqua(.5 * (1 - k / 10)); ctx.beginPath(); ctx.arc(tmp.x, tmp.y, 1.4, 0, TAU); ctx.fill(); }
          }
        });
      }

      // System nodes and their labels.
      nodes.forEach((n, i) => {
        const linked = clamp((intro - .34 - i * .07) / .3), r = (box.mobile ? 5 : 7) * n.s, depth = .55 + clamp(n.z + .5) * .45;
        if (n.flash > .02) { ctx.strokeStyle = aqua(n.flash * .6); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(n.x, n.y, r + (1 - n.flash) * 20, 0, TAU); ctx.stroke(); }
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4.5);
        halo.addColorStop(0, teal((.1 + linked * .2 + n.flash * .25) * depth)); halo.addColorStop(1, teal(0));
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(n.x, n.y, r * 4.5, 0, TAU); ctx.fill();
        // Each system keeps its own small cluster of records.
        ctx.lineWidth = 1; ctx.strokeStyle = aqua(.16 * depth); ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.5, 0, TAU); ctx.stroke();
        for (let q = 0; q < 3; q++) {
          const a = n.seed + q * 2.1 + time * (.35 + q * .12) * (i % 2 ? 1 : -1);
          ctx.fillStyle = aqua((.4 + linked * .4) * depth); ctx.beginPath(); ctx.arc(n.x + Math.cos(a) * r * 2.5, n.y + Math.sin(a) * r * 2.5, 1.3, 0, TAU); ctx.fill();
        }
        ctx.fillStyle = '#081a1e'; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, TAU); ctx.fill();
        ctx.lineWidth = 1.2; ctx.strokeStyle = aqua((.35 + linked * .55) * depth); ctx.stroke();
        ctx.fillStyle = ice((.3 + linked * .7) * depth); ctx.beginPath(); ctx.arc(n.x, n.y, r * .34, 0, TAU); ctx.fill();
        if (!box.mobile) {
          const right = n.x < W - 170;   // keep labels clear of the headline and the right edge
          label(n.name, n.x + (right ? r * 2.5 + 9 : -r * 2.5 - 9), n.y, right ? 'left' : 'right', (.5 + linked * .5) * depth);
        }
      });
    }
    function step(dt) { if (intro > .82) pulses.forEach(p => { p.p += dt * .42; }); }
    return {draw, step};
  })();

  /* =====================================================================
     Scene 2 — THREADS
     Loose, crossing strands (busywork) are gathered into one ribbon that
     moves together (business). Light runs faster once the strands align.
     ===================================================================== */
  const threads = (() => {
    const COUNT = 58, SEG = 96;
    const strands = Array.from({length: COUNT}, (_, i) => ({
      o: (i / (COUNT - 1)) * 2 - 1,
      f1: 3 + rand(i) * 6, f2: 8 + rand(i + 50) * 10, w1: .2 + rand(i + 100) * .3, w2: .15 + rand(i + 150) * .3,
      p1: rand(i + 200) * TAU, p2: rand(i + 250) * TAU, spark: i % 4 === 0, sp: .045 + rand(i + 300) * .04, ph: rand(i + 350)
    }));
    const xs = new Float32Array(SEG + 1), ys = new Float32Array(SEG + 1), zs = new Float32Array(SEG + 1);
    const cxs = new Float32Array(SEG + 1), cys = new Float32Array(SEG + 1), nxs = new Float32Array(SEG + 1), nys = new Float32Array(SEG + 1);
    const bez = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
    const dbez = (a, b, c, d, t) => { const u = 1 - t; return 3 * u * u * (b - a) + 6 * u * t * (c - b) + 3 * t * t * (d - c); };
    function draw(box) {
      const m = box.mobile;
      // One sweeping curve: in from the top right, around, and out to the right.
      const P = m
        ? [W * 1.06, H * .55, W * .02, H * .5, W * -.12, H * .93, W * 1.06, H * .82]
        : [W * 1.03, H * .1, W * .44, H * -.06, W * .5, H * .82, W * 1.05, H * .53];
      const halfW = m ? H * .05 : H * .105, amp = m ? H * .07 : H * .16;
      const edge = lerp(1.4, .5, easeInOut(intro));        // where tangled becomes ordered
      const sway = Math.sin(time * .21) * (m ? 6 : 14);
      for (let k = 0; k <= SEG; k++) {
        const t = k / SEG;
        const dx = dbez(P[0], P[2], P[4], P[6], t), dy = dbez(P[1], P[3], P[5], P[7], t), len = Math.hypot(dx, dy) || 1;
        nxs[k] = -dy / len; nys[k] = dx / len;
        cxs[k] = bez(P[0], P[2], P[4], P[6], t) + nxs[k] * sway * Math.sin(t * 3.1) + px * -16;
        cys[k] = bez(P[1], P[3], P[5], P[7], t) + nys[k] * sway * Math.sin(t * 3.1) + py * -12;
      }
      ctx.lineCap = 'butt';
      ctx.globalCompositeOperation = 'lighter';
      strands.forEach(st => {
        for (let k = 0; k <= SEG; k++) {
          const s = k / SEG, chaos = 1 - smooth(edge - .36, edge, s);
          const twist = s * 5.2 - time * .22 + px * .6;
          const width = halfW * (.7 + .3 * Math.sin(s * 4 + time * .17 + 1));
          const noise = Math.sin(s * st.f1 + time * st.w1 + st.p1) * .62 + Math.sin(s * st.f2 - time * st.w2 + st.p2) * .38;
          const off = st.o * Math.cos(twist) * width * (1 - chaos * .3) + noise * amp * chaos;
          zs[k] = st.o * Math.sin(twist) * (1 - chaos * .5);
          xs[k] = cxs[k] + nxs[k] * off; ys[k] = cys[k] + nys[k] * off;
        }
        for (let k = 0; k < SEG; k += 3) {
          const s = k / SEG, end = Math.min(k + 3, SEG);
          const ordered = smooth(edge - .36, edge, s), depth = .5 + zs[k] * .5;
          const fadeEnds = smooth(0, .05, s) * (1 - smooth(.96, 1, s));
          ctx.strokeStyle = `rgba(${Math.round(lerp(30, 70, ordered))},${Math.round(lerp(120, 205, ordered))},${Math.round(lerp(135, 215, ordered))},${((.15 + ordered * .21) * (.3 + depth * .7) + .02) * fadeEnds})`;
          ctx.lineWidth = .7 + ordered * depth * .9;
          ctx.beginPath(); ctx.moveTo(xs[k], ys[k]);
          for (let q = k + 1; q <= end; q++) ctx.lineTo(xs[q], ys[q]);
          ctx.stroke();
        }
        if (st.spark && !preference.matches) {
          // Light crawls through the tangle and speeds up along the ribbon.
          const u = (time * st.sp + st.ph) % 1, s = Math.pow(u, .6);
          const f = s * SEG, k = Math.min(SEG - 1, Math.floor(f)), t = f - k;
          const x = lerp(xs[k], xs[k + 1], t), y = lerp(ys[k], ys[k + 1], t);
          const ordered = smooth(edge - .36, edge, s), fade = Math.sin(u * Math.PI);
          const tail = Math.max(1, Math.round(2 + ordered * 9)), from = Math.max(0, k - tail);
          ctx.strokeStyle = ice(.5 * fade * (.3 + ordered * .7)); ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(xs[from], ys[from]);
          for (let q = from + 1; q <= k; q++) ctx.lineTo(xs[q], ys[q]);
          ctx.lineTo(x, y); ctx.stroke();
          glowDot(x, y, 5 + ordered * 7, fade * (.35 + ordered * .65));
        }
      });
      ctx.globalCompositeOperation = 'source-over';
    }
    return {draw, step() {}};
  })();

  /* =====================================================================
     Scene 3 — PIPELINE
     A live schematic of the promise: a request comes in, AI does the
     busywork, your team approves, the outcome lands.
     ===================================================================== */
  const pipeline = (() => {
    const sources = ['INBOX', 'WEB FORM', 'PHONE', 'CRM'].map((name, i) => ({name, y: .06 + i * .293, lit: 0}));
    const outcomes = ['QUOTE SENT', 'RECORD UPDATED', 'TICKET CLOSED'].map((name, i) => ({name, y: .2 + i * .3, lit: 0, count: 0}));
    const packets = [];
    let spawnIn = 0, serial = 0, hubLoad = 0, gateFlash = 0, g = null;
    function geometry(box) {
      const m = box.mobile;
      const x = m ? W * .06 : W * .535, y = m ? H * .57 : H * .15, w = m ? W * .88 : W * .415, h = m ? H * .23 : H * .56;
      const chipW = m ? 68 : 100, outW = m ? 106 : 150, chipH = m ? 20 : 28;
      return {m, x, y, w, h, chipW, outW, chipH, hubX: x + w * .4, gateX: x + w * .6, midY: y + h * .5, hubR: m ? 20 : 34,
        busIn: x + chipW + (w * .4 - chipW) * .42, busOut: x + w * .6 + (w - outW - w * .6) * .6, py: v => y + h * v};
    }
    // Polyline routes with square corners, like traces on a board.
    const routeIn = i => { const sy = g.py(sources[i].y); return [[g.x + g.chipW, sy], [g.busIn, sy], [g.busIn, g.midY], [g.hubX - g.hubR, g.midY]]; };
    const routeMid = () => [[g.hubX + g.hubR, g.midY], [g.gateX - 15, g.midY]];
    const routeOut = i => { const oy = g.py(outcomes[i].y); return [[g.gateX + 15, g.midY], [g.busOut, g.midY], [g.busOut, oy], [g.x + g.w - g.outW, oy]]; };
    const lengthOf = r => r.reduce((sum, p, i) => i ? sum + Math.hypot(p[0] - r[i - 1][0], p[1] - r[i - 1][1]) : 0, 0);
    function at(r, d, out) {
      for (let i = 1; i < r.length; i++) {
        const seg = Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]);
        if (d <= seg || i === r.length - 1) { const t = clamp(d / seg); out[0] = lerp(r[i - 1][0], r[i][0], t); out[1] = lerp(r[i - 1][1], r[i][1], t); return out; }
        d -= seg;
      }
      return out;
    }
    function trace(r, grow, alpha) {
      const total = lengthOf(r) * grow; if (total <= 0) return;
      let left = total; ctx.beginPath(); ctx.moveTo(r[0][0], r[0][1]);
      for (let i = 1; i < r.length && left > 0; i++) {
        const seg = Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]), t = clamp(left / seg);
        ctx.lineTo(lerp(r[i - 1][0], r[i][0], t), lerp(r[i - 1][1], r[i][1], t)); left -= seg;
      }
      ctx.strokeStyle = teal(alpha); ctx.lineWidth = 1; ctx.lineJoin = 'round'; ctx.stroke();
    }
    function chip(x, y, name, lit, alpha, alignRight, count) {
      const w = alignRight ? g.outW : g.chipW, h = g.chipH, left = alignRight ? x - w : x;
      roundRect(left, y - h / 2, w, h, 4);
      ctx.fillStyle = `rgba(11,32,38,${.92 * alpha})`; ctx.fill();
      ctx.strokeStyle = aqua((.42 + lit * .55) * alpha); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = aqua((.6 + lit * .4) * alpha); ctx.beginPath(); ctx.arc(left + 11, y, 2.2, 0, TAU); ctx.fill();
      label(name, left + (g.m ? 18 : 21), y + .5, 'left', (.8 + lit * .2) * alpha, g.m ? 7 : 9);
      if (count != null && !g.m) label(String(count).padStart(2, '0'), left + w - 10, y + .5, 'right', (count ? .9 : .4) * alpha, 9);
    }
    const pos = [0, 0];
    function draw(box) {
      g = geometry(box);
      const ox = px * -8, oy = py * -6;
      ctx.save(); ctx.translate(ox, oy);
      const tr = k => easeOut(clamp((intro - .28 - k * .05) / .3));     // trace growth, staggered
      sources.forEach((s, i) => trace(routeIn(i), tr(i), .46));
      trace(routeMid(), tr(4), .6);
      outcomes.forEach((o, i) => trace(routeOut(i), tr(5 + i), .46));
      // Junction marks where the traces meet their bus.
      const junction = (x, y, a) => { ctx.fillStyle = '#081a1e'; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill(); ctx.strokeStyle = aqua(.7 * a); ctx.lineWidth = 1; ctx.stroke(); };
      sources.forEach((s, i) => junction(g.busIn, g.py(s.y), tr(i) > .4 ? 1 : 0));
      outcomes.forEach((o, i) => junction(g.busOut, g.py(o.y), tr(5 + i) > .7 ? 1 : 0));

      // Packets of work.
      packets.forEach(p => {
        if (p.hidden) return;
        at(p.route, p.d, pos);
        ctx.fillStyle = ice(.9); roundRect(pos[0] - 4, pos[1] - 2.5, 8, 5, 1.5); ctx.fill();
        glowDot(pos[0], pos[1], 10, .75);
        for (let k = 1; k <= 5; k++) { if (p.d - k * 7 < 0) break; at(p.route, p.d - k * 7, pos); ctx.fillStyle = aqua(.4 * (1 - k / 6)); ctx.beginPath(); ctx.arc(pos[0], pos[1], 1.2, 0, TAU); ctx.fill(); }
      });

      // AI hub.
      const hubA = easeOut(clamp((intro - .1) / .3)), hx = g.hubX, hy = g.midY, hr = g.hubR;
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr * 2.6);
      hg.addColorStop(0, teal(.16 + hubLoad * .1)); hg.addColorStop(1, teal(0)); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, hr * 2.6, 0, TAU); ctx.fill();
      ctx.fillStyle = `rgba(9,40,46,${.95 * hubA})`; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.fill();
      ctx.strokeStyle = aqua(.75 * hubA); ctx.lineWidth = 1.2; ctx.stroke();
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(time * (.35 + hubLoad * 1.4)); ctx.setLineDash([3, 7]); ctx.strokeStyle = aqua(.5 * hubA);
      ctx.beginPath(); ctx.arc(0, 0, hr + 7, 0, TAU); ctx.stroke(); ctx.restore(); ctx.setLineDash([]);
      ctx.strokeStyle = dim(.35 * hubA); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(hx, hy, hr + 20 + Math.sin(time * 1.1) * 2, 0, TAU); ctx.stroke();
      ctx.font = `500 ${g.m ? 13 : 17}px 'Manrope',Arial,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = ice(.95 * hubA); ctx.fillText('AI', hx, hy + 1);
      label(g.m ? 'READ · ROUTE' : 'READ · ROUTE · PREPARE', hx - hr, hy + hr + 26, 'left', .8 * hubA, g.m ? 7 : 9);

      // Team approval gate.
      const gx = g.gateX, gateA = easeOut(clamp((intro - .2) / .3));
      ctx.save(); ctx.translate(gx, hy); ctx.rotate(Math.PI / 4);
      roundRect(-11, -11, 22, 22, 3); ctx.fillStyle = `rgba(11,32,38,${.95 * gateA})`; ctx.fill();
      ctx.strokeStyle = aqua((.45 + gateFlash * .55) * gateA); ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      ctx.strokeStyle = ice((.45 + gateFlash * .55) * gateA); ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(gx - 5, hy); ctx.lineTo(gx - 1.5, hy + 3.5); ctx.lineTo(gx + 5, hy - 3.5); ctx.stroke();
      if (gateFlash > .02) { ctx.strokeStyle = aqua(gateFlash * .5); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(gx, hy, 16 + (1 - gateFlash) * 16, 0, TAU); ctx.stroke(); }
      label(g.m ? 'TEAM OK' : 'TEAM APPROVES', gx, hy - 34, 'center', .8 * gateA, g.m ? 7 : 9);

      sources.forEach((s, i) => chip(g.x, g.py(s.y), s.name, s.lit, easeOut(clamp((intro - i * .05) / .25)), false));
      outcomes.forEach((o, i) => chip(g.x + g.w, g.py(o.y), o.name, o.lit, easeOut(clamp((intro - .3 - i * .05) / .25)), true, o.count));
      ctx.restore();
    }
    function step(dt) {
      sources.forEach(s => { s.lit *= .95; }); outcomes.forEach(o => { o.lit *= .96; });
      gateFlash *= .93; hubLoad += ((packets.some(p => p.stage === 1) ? 1 : 0) - hubLoad) * .08;
      if (intro < .95 || !g) return;
      spawnIn -= dt;
      if (spawnIn <= 0 && packets.length < 7) {
        const i = Math.floor(rand(++serial) * sources.length);
        sources[i].lit = 1; packets.push({route: routeIn(i), d: 0, stage: 0, wait: 0, hidden: false}); spawnIn = .75 + rand(serial + 9) * .9;
      }
      const speed = (g.m ? 110 : 170) * dt;
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        if (p.wait > 0) { p.wait -= dt; if (p.wait > 0) continue; p.hidden = false; }
        p.d += speed * (p.stage === 2 ? 1.25 : 1);
        if (p.d < lengthOf(p.route)) continue;
        if (p.stage === 0) { p.stage = 1; p.route = routeMid(); p.d = 0; p.wait = .55; p.hidden = true; }           // AI works on it
        else if (p.stage === 1) { p.stage = 2; gateFlash = 1; const i = Math.floor(rand(++serial + 40) * outcomes.length); p.out = i; p.route = routeOut(i); p.d = 0; p.wait = .28; p.hidden = true; }
        else { const o = outcomes[p.out]; o.lit = 1; o.count = (o.count + 1) % 100; packets.splice(k, 1); }
      }
    }
    return {draw, step};
  })();

  /* ---------- engine ---------- */
  const scenes = {orbit, threads, pipeline};
  let scene = scenes[canvas.dataset.scene] || orbit;
  function draw() {
    if (!ctx || !W) return;
    ctx.clearRect(0, 0, W, H);
    const box = frameBox();
    backdrop(box);
    scene.draw(box);
  }
  function frame(now) {
    raf = 0;
    if (paused || !visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, .05); last = now;
    time += dt; intro = Math.min(1, intro + dt / 4.2);
    px += (tx - px) * .04; py += (ty - py) * .04;
    scene.step(dt); draw();
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); raf = 0; last = performance.now();
    if (pauseButton) {
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.innerHTML = paused ? 'Resume animation <span aria-hidden="true">▷</span>' : 'Pause animation <span aria-hidden="true">Ⅱ</span>';
    }
    if (!paused && visible && !document.hidden && ctx) raf = requestAnimationFrame(frame); else draw();
  }
  function resize() {
    const rect = hero.getBoundingClientRect(); W = rect.width; H = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  }
  if (ctx) {
    new ResizeObserver(resize).observe(hero); resize();
    hero.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const r = hero.getBoundingClientRect(); tx = (event.clientX - r.left) / r.width - .5; ty = (event.clientY - r.top) / r.height - .5;
    });
    hero.addEventListener('pointerleave', () => { tx = ty = 0; });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(hero);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', event => { paused = event.matches; if (event.matches) intro = 1; sync(); });
    pauseButton?.addEventListener('click', () => { paused = !paused; sync(); });
    sync();
  } else {
    canvas.parentElement.classList.add('canvas-unavailable');
    if (pauseButton) pauseButton.hidden = true;
  }
  // Lets you switch scenes from the console or a preview control.
  window.IndigoHero = {
    scenes: Object.keys(scenes),
    setScene(name, replay = true) { if (!scenes[name]) return; scene = scenes[name]; canvas.dataset.scene = name; if (replay && !preference.matches) intro = 0; if (paused) draw(); },
    seek(t, i = 1) { time = t; intro = i; draw(); }
  };

  /* ---------- carried over unchanged from home-teal.js: section reveal ---------- */
  if ('IntersectionObserver' in window && !preference.matches) {
    const items = [...document.querySelectorAll('.section-heading,.feature-card,.benefit-card,.workflow-grid,.about-grid,.center-heading,.price-card,.insight-card,.faq-section,.footer-invitation')];
    items.forEach(el => el.classList.add('home-reveal')); document.body.classList.add('home-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), {threshold: .06});
    items.forEach(el => observer.observe(el));
    document.addEventListener('focusin', event => event.target.closest('.home-reveal')?.classList.add('in-view'));
    preference.addEventListener('change', event => { if (event.matches) { document.body.classList.remove('home-motion'); observer.disconnect(); } });
  }
})();
