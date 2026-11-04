// مكتبة قوالب الألعاب. كل قالب: create(stage, game, ctx) → { destroy, auto }
// ctx: { lesson, item(value), audioOf(text), say(text, audio), instruct(text, audio), praise(), encourage(), win(), color }
import { gsap, $, $$, SFX, state, sleep, esc, shuffle, reshuffle } from './core.js';
import { art } from './art.js';

/* ---------- أدوات مشتركة ---------- */
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const center = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
export const tw = (el, v) => (state.reduced ? gsap.set(el, v) : gsap.to(el, v));

export function shake(el) { SFX.soft(); if (state.reduced) return; gsap.fromTo(el, { x: 0 }, { keyframes: [{ x: -9 }, { x: 8 }, { x: -6 }, { x: 4 }, { x: 0 }], duration: 0.45, ease: 'sine.inOut' }); }
export function glowHint(el) { el.classList.add('hint'); setTimeout(() => el.classList.remove('hint'), 2600); }
export function popIn(els, delay = 0) { if (state.reduced) { gsap.set(els, { scale: 1, opacity: 1 }); return; } gsap.fromTo(els, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.2)', stagger: 0.09, delay }); }

// متتبع المحاولات: بعد محاولتين خاطئتين يلمع الجواب الصحيح ويُنطق
function tries(ctx) {
  let wrong = 0;
  return {
    reset() { wrong = 0; },
    miss(el, correctEl, text) { wrong++; shake(el); ctx.encourage(); if (wrong >= 2 && correctEl) { setTimeout(() => { glowHint(correctEl); if (text) ctx.say(text, ctx.audioOf(text)); }, 700); wrong = 0; } },
  };
}

// سحب متسامح: Pointer Events + setPointerCapture + جذب مغناطيسي + عودة لطيفة
export function draggable(el, { targets, accept, onDrop, onTap }) {
  el.style.touchAction = 'none';
  let sx = 0, sy = 0, dragging = false, moved = false, near = null;
  const pick = (cx, cy) => {
    let best = null, bd = Infinity;
    targets().forEach((t) => { const r = t.getBoundingClientRect(), [tx, ty] = center(t), pad = Math.max(r.width, r.height) * 0.75; const d = Math.hypot(tx - cx, ty - cy); if (d < pad && d < bd) { bd = d; best = t; } });
    return best;
  };
  el.addEventListener('pointerdown', (e) => {
    if (el.classList.contains('done')) return; e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    dragging = true; moved = false; sx = e.clientX - (gsap.getProperty(el, 'x') || 0); sy = e.clientY - (gsap.getProperty(el, 'y') || 0);
    el.classList.add('drag'); gsap.to(el, { scale: 1.08, duration: 0.15 }); SFX.click();
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return; const x = e.clientX - sx, y = e.clientY - sy; if (Math.hypot(x, y) > 8) moved = true;
    gsap.set(el, { x, y }); const [cx, cy] = center(el); const t = pick(cx, cy);
    if (t !== near) { near && near.classList.remove('near'); near = t; near && near.classList.add('near'); }
  });
  const end = (e) => {
    if (!dragging) return; dragging = false; el.classList.remove('drag'); near && near.classList.remove('near');
    const t = near; near = null;
    if (!moved) { gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.3 }); onTap && onTap(); return; }
    if (t && accept(t)) {
      // جذب إلى مركز الهدف
      const [tx, ty] = center(t), [cx, cy] = center(el);
      gsap.to(el, { x: '+=' + (tx - cx), y: '+=' + (ty - cy), scale: 1, duration: 0.25, ease: 'power2.out', onComplete: () => onDrop(t, true) });
      SFX.snap();
    } else {
      gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.6)' });
      if (t) onDrop(t, false);
    }
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  // للاختبار الآلي: إسقاط مباشر على هدف
  el._dropOn = (t) => { const [tx, ty] = center(t), [cx, cy] = center(el); gsap.set(el, { x: '+=' + (tx - cx), y: '+=' + (ty - cy) }); if (accept(t)) { SFX.snap(); onDrop(t, true); } else { gsap.to(el, { x: 0, y: 0, duration: 0.3 }); onDrop(t, false); } };
}

// جولات متتابعة
function rounds(n, run, ctx) {
  let i = 0, alive = true;
  const next = async () => { if (!alive) return; if (i >= n) { ctx.win(); return; } const k = i++; ctx.progress && ctx.progress(k, n); await run(k, next); };
  return { start: next, stop() { alive = false; }, get i() { return i; } };
}

/* ======================================================================
   1) اسمع والمس: يلمس الطفل كل صورة فيسمع اسمها (نشاط «أُرَدِّدُ»)
   ====================================================================== */
const listen = (stage, game, ctx) => {
  const items = game.data.items.map(ctx.item);
  const box = h(`<div class="g-listen"><div class="big-letter pop3d" data-say="${esc(game.data.letter || '')}"><span>${esc(game.data.letter || '')}</span></div><div class="cards"></div></div>`);
  const cards = $('.cards', box); const seen = new Set();
  items.forEach((it) => {
    const c = h(`<button class="card tap${it.art ? '' : ' noart'}" type="button">${it.art ? `<div class="pic">${art(it.art)}</div>` : ''}<div class="word">${ctx.wordHtml(it.value, game.data.letter)}</div><i class="tick">✓</i></button>`);
    c.addEventListener('click', () => {
      SFX.pop(); ctx.say(it.value, it.audio); if (!state.reduced) gsap.fromTo(c, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
      if (!seen.has(it.value)) { seen.add(it.value); c.classList.add('seen'); if (seen.size === items.length) setTimeout(() => ctx.win(), 900); }
    });
    cards.appendChild(c);
  });
  const bl = $('.big-letter', box); bl.addEventListener('click', () => { SFX.hop(); ctx.say(game.data.letterSay || game.data.letter, ctx.audioOf(game.data.letterSay || game.data.letter)); });
  stage.appendChild(box); popIn($$('.card', box), 0.3);
  ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const c of $$('.card', box)) { c.click(); await sleep(250); } } };
};

/* ======================================================================
   2) تتبّع الحرف أو الرقم بالإصبع
   الأشكال داخل مربع 100×100، كل خط مسار SVG، والنقاط تُلمس لمساً.
   ====================================================================== */
const BA = 'M80 30 C 84 48 80 62 64 63 L 34 63 C 24 63 18 58 18 46';
const JIM = ['M28 34 C 40 28 56 28 70 34', 'M70 34 C 50 40 34 52 34 66 C 34 80 52 86 72 80'];
const SIN = 'M86 40 C 86 54 78 56 76 44 C 76 56 68 56 66 44 C 68 66 60 78 42 78 C 26 78 20 66 24 54';
const SAD = 'M58 52 C 60 38 86 36 86 50 C 86 57 74 57 58 55 C 54 70 46 78 32 76 C 20 74 16 62 20 52';
const TTA = ['M40 16 L 40 62', 'M28 64 C 30 48 60 44 76 54 C 82 62 72 66 28 64'];
const AYN = 'M64 30 C 54 20 38 28 46 40 C 52 48 64 46 70 44 C 48 52 34 62 36 74 C 38 86 56 88 72 82';
const FA = 'M68 42 C 58 30 46 40 52 48 C 58 54 68 50 70 44 C 76 58 72 64 52 64 L 26 64 C 18 64 16 56 18 48';
const QAF = 'M66 38 C 56 26 44 36 50 44 C 56 50 66 46 68 40 C 76 58 72 78 50 80 C 32 82 24 72 26 58';
const HE = 'M56 28 C 32 40 34 74 54 74 C 74 74 74 44 56 28';
const WAW = 'M62 46 C 52 34 42 44 50 52 C 58 58 64 52 62 46 C 64 66 56 80 34 86';
const YA = 'M66 28 C 52 32 48 42 60 50 C 76 58 76 72 54 74 C 40 75 30 70 26 60';
export const SHAPES = {
  ba: { strokes: [BA], dots: [[50, 80]] },
  ta: { strokes: [BA], dots: [[44, 46], [58, 46]] },
  tha: { strokes: [BA], dots: [[44, 48], [58, 48], [51, 36]] },
  nun: { strokes: ['M70 40 C 76 60 66 76 50 76 C 34 76 26 64 30 46'], dots: [[50, 42]] },
  ya: { strokes: [YA], dots: [[44, 86], [58, 86]] },
  alif_maqsura: { strokes: [YA], dots: [] },
  jim: { strokes: JIM, dots: [[54, 62]] }, hha: { strokes: JIM, dots: [] }, kha: { strokes: JIM, dots: [[50, 16]] },
  dal: { strokes: ['M40 28 C 52 38 62 50 60 64 L 32 64'], dots: [] }, dhal: { strokes: ['M40 30 C 52 40 62 52 60 66 L 32 66'], dots: [[42, 16]] },
  ra: { strokes: ['M62 30 C 66 50 58 70 32 84'], dots: [] }, zay: { strokes: ['M60 34 C 64 54 56 72 30 86'], dots: [[64, 18]] },
  sin: { strokes: [SIN], dots: [] }, shin: { strokes: [SIN], dots: [[66, 24], [78, 24], [72, 13]] },
  sad: { strokes: [SAD], dots: [] }, dad: { strokes: [SAD], dots: [[72, 28]] },
  tta: { strokes: TTA, dots: [] }, zza: { strokes: TTA, dots: [[60, 38]] },
  ayn: { strokes: [AYN], dots: [] }, ghayn: { strokes: ['M64 34 C 54 24 38 32 46 44 C 52 52 64 50 70 48 C 48 56 34 64 36 76 C 38 88 56 90 72 84'], dots: [[54, 16]] },
  fa: { strokes: [FA], dots: [[58, 24]] }, qaf: { strokes: [QAF], dots: [[50, 18], [62, 18]] },
  kaf: { strokes: ['M74 24 C 76 44 74 62 62 66 L 26 66 C 20 66 18 60 20 54', 'M40 40 C 48 36 54 42 46 46 C 54 46 56 50 50 54'], dots: [] },
  lam: { strokes: ['M64 16 L 64 58 C 64 76 52 82 40 80 C 28 78 24 68 28 58'], dots: [] },
  mim: { strokes: ['M56 34 C 42 34 40 50 52 52 C 64 54 68 38 56 34', 'M42 50 L 36 88'], dots: [] },
  he: { strokes: [HE], dots: [] }, tam: { strokes: [HE], dots: [[46, 16], [62, 16]] },
  waw: { strokes: [WAW], dots: [] },
  alif: { strokes: ['M50 16 L 50 84'], dots: [] },
  alif_hamza: { strokes: ['M50 30 L 50 86', 'M44 12 C 50 6 58 10 52 16 C 58 16 60 20 54 24'], dots: [] },
};
const trace = (stage, game, ctx) => {
  const sh = SHAPES[game.data.shape];
  const box = h(`<div class="g-trace"><div class="tr-wrap"><svg class="tr-svg" viewBox="0 0 100 100"></svg><canvas class="tr-canvas"></canvas></div></div>`);
  const svg = $('svg', box), cv = $('canvas', box), wrap = $('.tr-wrap', box);
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; };
  stage.appendChild(box);
  // الطبقات: ظل الحرف، والمسار المنقّط، والأسهم، ونقطة البداية
  const guides = sh.strokes.map((d) => mk('path', { d, class: 'tr-guide' }));
  const dotsG = sh.dots.map(([x, y]) => mk('circle', { cx: x, cy: y, r: 6.5, class: 'tr-guide-dot' }));
  const dashed = sh.strokes.map((d) => mk('path', { d, class: 'tr-dash' }));
  const samples = guides.map((g) => { const L = g.getTotalLength(), pts = []; for (let s = 0; s <= L; s += 1) { const p = g.getPointAtLength(s); pts.push([p.x, p.y]); } return pts; });
  samples.forEach((pts) => { [0.3, 0.62].forEach((f) => { const i = Math.floor(pts.length * f), a = pts[i], b = pts[Math.min(pts.length - 1, i + 3)]; const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI; mk('path', { d: 'M-3 -3 L2 0 L-3 3', class: 'tr-arrow', transform: `translate(${a[0]} ${a[1]}) rotate(${ang})` }); }); });
  const startDot = mk('circle', { r: 5, class: 'tr-start' });
  const fill = sh.strokes.map((d) => mk('path', { d, class: 'tr-fill' })).concat(sh.dots.map(([x, y]) => mk('circle', { cx: x, cy: y, r: 6.5, class: 'tr-fill-dot' })));
  const g2 = cv.getContext('2d');
  const fit = () => { const sr = stage.getBoundingClientRect(), cs = getComputedStyle(stage); const side = Math.max(160, Math.min(640, sr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), sr.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom))); wrap.style.width = wrap.style.height = side + 'px'; };
  fit();
  const size = () => { fit(); const r = wrap.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; g2.setTransform((r.width * dpr) / 100, 0, 0, (r.height * dpr) / 100, 0, 0); };
  size(); const ro = new ResizeObserver(() => { size(); redraw(); }); ro.observe(stage);
  let si = 0, idx = 0, active = false, hue = 0; const trails = []; let tail = null;
  const steps = sh.strokes.length + sh.dots.length;
  const toBox = (e) => { const m = svg.getScreenCTM().inverse(), p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m); return [p.x, p.y]; };
  const placeStart = () => {
    if (si < sh.strokes.length) { const p = samples[si][0]; startDot.setAttribute('cx', p[0]); startDot.setAttribute('cy', p[1]); }
    else if (si < steps) { const [x, y] = sh.dots[si - sh.strokes.length]; startDot.setAttribute('cx', x); startDot.setAttribute('cy', y); }
    else startDot.style.display = 'none';
    dashed.forEach((d, k) => d.classList.toggle('cur', k === si));
  };
  const redraw = () => { g2.clearRect(0, 0, 100, 100); g2.lineCap = g2.lineJoin = 'round'; g2.lineWidth = 9; trails.forEach((t) => { for (let i = 1; i < t.length; i++) { g2.strokeStyle = `hsl(${t[i][2]},85%,58%)`; g2.beginPath(); g2.moveTo(t[i - 1][0], t[i - 1][1]); g2.lineTo(t[i][0], t[i][1]); g2.stroke(); } }); };
  const stepDone = () => {
    SFX.star(); si++; idx = 0; active = false; placeStart();
    if (si >= steps) { // امتلاء الحرف بالألوان
      fill.forEach((f) => f.classList.add('on')); tw(cv, { opacity: 0, duration: 0.8 }); setTimeout(() => ctx.win(), 1000);
    }
  };
  const TOL = 11;
  svg.style.touchAction = 'none'; wrap.style.touchAction = 'none';
  wrap.addEventListener('pointerdown', (e) => {
    e.preventDefault(); if (si >= steps) return; const [x, y] = toBox(e);
    if (si >= sh.strokes.length) { const [dx, dy] = sh.dots[si - sh.strokes.length]; if (Math.hypot(dx - x, dy - y) < 14) { trails.push([[dx, dy, hue], [dx + 0.1, dy, hue]]); redraw(); stepDone(); } else { shake(startDot); glowHint(startDot); } return; }
    const p0 = samples[si][idx]; if (Math.hypot(p0[0] - x, p0[1] - y) > 14) { SFX.soft(); glowHint(startDot); return; }
    try { wrap.setPointerCapture(e.pointerId); } catch (_) {} active = true; tail = [[x, y, hue]]; trails.push(tail);
  });
  wrap.addEventListener('pointermove', (e) => {
    if (!active) return; const [x, y] = toBox(e), pts = samples[si];
    hue = (hue + 3) % 360; tail.push([x, y, hue]); redraw(); if (Math.random() < 0.15) SFX.paint();
    // أبعد نقطة قريبة من الإصبع على المسار (لا يُسمح بالقفز بعيداً)
    for (let k = Math.min(12, pts.length - 1 - idx); k >= 1; k--) { const p = pts[idx + k]; if (Math.hypot(p[0] - x, p[1] - y) < TOL) { idx += k; break; } }
    if (idx >= pts.length - 3) stepDone();
  });
  const up = () => { if (active) { active = false; /* يكمل من حيث توقف */ } };
  wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  placeStart();
  if (!state.reduced) gsap.to(startDot, { attr: { r: 6.5 }, repeat: -1, yoyo: true, duration: 0.6 });
  ctx.instruct(game.say, game.audio);
  return {
    destroy() { ro.disconnect(); gsap.killTweensOf(startDot); },
    auto: async () => { while (si < steps) { if (si < sh.strokes.length) { const pts = samples[si]; const t = []; trails.push(t); for (let k = idx; k < pts.length; k += 2) { t.push([pts[k][0], pts[k][1], (k * 3) % 360]); } idx = pts.length; redraw(); stepDone(); } else { const [dx, dy] = sh.dots[si - sh.strokes.length]; trails.push([[dx, dy, 40], [dx + 0.1, dy, 40]]); stepDone(); } await sleep(150); } },
  };
};

/* ======================================================================
   3) فرقعة البالونات: يسمع الطفل مقطعاً ويفرقع البالون الذي يحمله
   ====================================================================== */
const BCOL = ['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#b197fc', '#ffa94d'];
const balloons = (stage, game, ctx) => {
  const d = game.data, per = Math.min(4, Math.max(2, d.per || 3)), T = tries(ctx);
  const box = h(`<div class="g-balloons"><div class="sky"></div></div>`); const sky = $('.sky', box); stage.appendChild(box);
  let target = null, order = null, cur = [];
  const R = rounds(d.targets.length, async (k, next) => {
    T.reset(); sky.innerHTML = ''; target = d.targets[k];
    const others = shuffle(d.choices.filter((c) => c !== target)).slice(0, per - 1);
    order = reshuffle([target, ...others], order); cur = [];
    order.forEach((txt, i) => {
      const col = BCOL[(i + k) % BCOL.length];
      const b = h(`<button class="balloon tap" type="button" style="--c:${col}"><svg viewBox="0 0 80 120" aria-hidden="true"><path d="M40 4C18 4 6 22 6 42C6 66 26 84 38 88L34 96H46L42 88C54 84 74 66 74 42C74 22 62 4 40 4Z" fill="${col}" stroke="#4a3426" stroke-width="2.5"/><ellipse cx="26" cy="28" rx="7" ry="12" fill="#fff" opacity=".45"/><path d="M40 96Q34 106 42 112T40 120" fill="none" stroke="#4a3426" stroke-width="2"/></svg><span class="txt">${esc(txt)}</span></button>`);
      b.dataset.v = txt; sky.appendChild(b); cur.push(b);
      if (!state.reduced) gsap.to(b, { y: -10 - Math.random() * 8, rotation: (Math.random() - 0.5) * 6, duration: 1.4 + Math.random() * 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      b.addEventListener('click', () => {
        if (b.classList.contains('popped')) return;
        if (txt === target) {
          b.classList.add('popped'); SFX.balloon(); burst(b, col); gsap.killTweensOf(b);
          tw(b, { scale: 1.5, opacity: 0, duration: 0.25 }); ctx.praise(); setTimeout(next, 1300);
        } else { T.miss(b, cur.find((x) => x.dataset.v === target), target); ctx.say(txt, ctx.audioOf(txt)); }
      });
    });
    popIn(cur);
    await ctx.instruct(game.say, game.audio); await sleep(200); ctx.say(target, ctx.audioOf(target));
  }, ctx);
  ctx.replay = () => { ctx.instruct(game.say, game.audio).then(() => target && ctx.say(target, ctx.audioOf(target))); };
  R.start();
  return { destroy() { R.stop(); $$('.balloon', box).forEach((b) => gsap.killTweensOf(b)); }, auto: async () => { while (R.i <= d.targets.length && $('.sky', box)) { const b = cur.find((x) => x.dataset.v === target && !x.classList.contains('popped')); if (!b) break; b.click(); await sleep(1500); if (R.i >= d.targets.length && !cur.some((x) => !x.classList.contains('popped') && x.dataset.v === target)) break; } } };
};

// قصاصات وجسيمات (تتوقف في وضع تقليل الحركة والوضع الخفيف)
export function burst(el, col = '#ffd43b', n = 14) {
  if (state.reduced || state.lite || state.autoLite) return;
  const [cx, cy] = center(el);
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'); p.className = 'spark'; p.style.background = i % 2 ? col : '#ffd43b'; p.style.left = cx + 'px'; p.style.top = cy + 'px'; document.body.appendChild(p);
    const a = Math.random() * Math.PI * 2, r = 50 + Math.random() * 70;
    gsap.to(p, { x: Math.cos(a) * r, y: Math.sin(a) * r, opacity: 0, scale: 0.4, duration: 0.7 + Math.random() * 0.3, ease: 'power2.out', onComplete: () => p.remove() });
  }
}

/* ======================================================================
   4) اسحب وطابق: كلمة إلى صورتها
   ====================================================================== */
const match = (stage, game, ctx) => {
  const d = game.data, per = Math.min(4, Math.max(2, d.per || 3)), T = tries(ctx), all = d.pairs.map(ctx.item);
  const box = h(`<div class="g-match"><div class="pics"></div><div class="dock"></div></div>`); stage.appendChild(box);
  const pics = $('.pics', box), dock = $('.dock', box); let order = null, card = null, goal = null;
  const R = rounds(all.length, async (k, next) => {
    T.reset(); pics.innerHTML = ''; dock.innerHTML = ''; goal = all[k];
    const others = shuffle(all.filter((x) => x !== goal)).slice(0, per - 1);
    order = reshuffle([goal, ...others].map((x) => x.value), order);
    order.forEach((v) => { const it = ctx.item(v); const p = h(`<button class="pic-card tap" type="button" data-v="${esc(v)}">${art(it.art)}<span class="lbl"></span></button>`); p.addEventListener('click', () => ctx.say(it.value, it.audio)); pics.appendChild(p); });
    card = h(`<div class="word-card tap" role="button" tabindex="0">${esc(goal.value)}</div>`); dock.appendChild(card);
    draggable(card, {
      targets: () => $$('.pic-card', pics),
      accept: (t) => t.dataset.v === goal.value,
      onTap: () => ctx.say(goal.value, goal.audio),
      onDrop: (t, ok) => {
        if (ok) { card.classList.add('done'); t.classList.add('ok'); $('.lbl', t).textContent = goal.value; tw(card, { opacity: 0, duration: 0.2 }); burst(t, '#69db7c'); ctx.praise(); setTimeout(next, 1400); }
        else T.miss(t, $(`.pic-card[data-v="${CSS.escape(goal.value)}"]`, pics), goal.value);
      },
    });
    popIn([...$$('.pic-card', pics), card]);
    await ctx.instruct(game.say, game.audio); ctx.say(goal.value, goal.audio);
  }, ctx);
  ctx.replay = () => ctx.instruct(game.say, game.audio).then(() => goal && ctx.say(goal.value, goal.audio));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < all.length; n++) { await sleep(300); const t = $(`.pic-card[data-v="${CSS.escape(goal.value)}"]`, pics); card._dropOn(t); await sleep(1600); } } };
};

/* ======================================================================
   5) ركّب الكلمة من مقاطعها: النتيجة نص واحد متصل يشكّله المتصفح
   ====================================================================== */
const build = (stage, game, ctx) => {
  const d = game.data, T = tries(ctx);
  const box = h(`<div class="g-build"><div class="target"></div><div class="slots"></div><div class="pool"></div></div>`); stage.appendChild(box);
  const target = $('.target', box), slots = $('.slots', box), pool = $('.pool', box); let order = null, w = null;
  const R = rounds(d.words.length, async (k, next) => {
    T.reset(); w = d.words[k]; slots.innerHTML = ''; pool.innerHTML = ''; target.innerHTML = '';
    const it = w.art ? `<div class="t-pic">${art(w.art)}</div>` : ''; target.innerHTML = it + `<button class="ear tap" type="button" aria-label="اسمع الكلمة">🔊</button>`;
    $('.ear', target).addEventListener('click', () => ctx.say(w.word, ctx.audioOf(w.word)));
    // الخانات من اليمين إلى اليسار بترتيب الكلمة
    w.parts.forEach((p, i) => { const s = h(`<div class="slot" data-i="${i}" data-p="${esc(p)}"></div>`); slots.appendChild(s); });
    order = reshuffle(d.pieces, order);
    order.forEach((p) => {
      const pc = h(`<div class="piece tap" role="button" tabindex="0" data-p="${esc(p)}">${esc(p)}</div>`); pool.appendChild(pc);
      draggable(pc, {
        targets: () => $$('.slot:not(.full)', slots),
        accept: (t) => t.dataset.p === p,
        onTap: () => ctx.say(p, ctx.audioOf(p)),
        onDrop: (t, ok) => {
          if (!ok) { T.miss(t, $(`.piece[data-p="${CSS.escape(t.dataset.p)}"]`, pool), t.dataset.p); return; }
          t.classList.add('full'); t.textContent = p; gsap.set(pc, { x: 0, y: 0 }); pc.classList.remove('done');
          ctx.say(p, ctx.audioOf(p));
          if ($$('.slot:not(.full)', slots).length === 0) {
            // دمج المقاطع في نص واحد متصل
            setTimeout(() => {
              slots.innerHTML = `<div class="joined">${esc(w.word)}</div>`; popIn($('.joined', slots)); burst(slots, '#ffd43b', 20); ctx.praise(w.word); setTimeout(next, 2200);
            }, 500);
          }
        },
      });
    });
    popIn([...$$('.slot', slots), ...$$('.piece', pool)]);
    await ctx.instruct(game.say, game.audio); ctx.say(w.word, ctx.audioOf(w.word));
  }, ctx);
  ctx.replay = () => ctx.instruct(game.say, game.audio).then(() => w && ctx.say(w.word, ctx.audioOf(w.word)));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < d.words.length; n++) { await sleep(300); for (const s of $$('.slot', slots)) { const pc = $(`.piece[data-p="${CSS.escape(s.dataset.p)}"]`, pool); pc._dropOn(s); await sleep(250); } await sleep(2600); } } };
};

export const TEMPLATES = { listen, trace, balloons, match, build };
export const TEMPLATE_NAMES = { listen: 'اِسْمَعْ وَالْمِسْ', trace: 'تَتَبَّعْ', balloons: 'فَرْقِعْ', match: 'طَابِقْ', build: 'رَكِّبْ' };
export const TEMPLATE_ICON = { listen: '👂', trace: '✍️', balloons: '🎈', match: '🧩', build: '🧱' };
