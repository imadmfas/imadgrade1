// قوالب كتاب «English for Iraq — 1st Primary»: الحرف وأصواته، الحوار بالفقاعات، العدّ، نعم/لا.
// ويضيف أشكال الحروف اللاتينية الصغيرة إلى قالب التتبّع، ويجعل الراوي يختار الصوت الإنكليزي
// للنص الإنكليزي والصوت العربي للتعليمات العربية (في هذا الكتاب وحده).
import { gsap, $, $$, SFX, state, sleep, esc, shuffle, reshuffle, Narrator } from '../core.js';
import { art, ART } from '../art.js';
import { SHAPES, shake, glowHint, popIn, burst } from '../games.js';
import { BOOK } from '__BOOK__';

const EN = BOOK && BOOK.lang === 'en';
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const pic = (k) => (k && ART[k] ? art(k) : '');
const isAr = (t) => /[؀-ۿ]/.test(String(t || ''));
function tries(ctx) {
  let wrong = 0;
  return { reset() { wrong = 0; }, miss(el, good, text) { wrong++; shake(el); ctx.encourage(); if (wrong >= 2 && good) { setTimeout(() => { glowHint(good); if (text) ctx.say(text, ctx.audioOf(text)); }, 700); wrong = 0; } } };
}
function rounds(n, run, ctx) {
  let i = 0, alive = true;
  const next = async () => { if (!alive) return; if (i >= n) { ctx.win(); return; } const k = i++; await run(k, next); };
  return { start: next, stop() { alive = false; }, get i() { return i; } };
}

/* ---------- أشكال الحروف اللاتينية الصغيرة (خط الأساس 80، رأس الحرف 40، الصاعد 12، النازل 96) ---------- */
const A = 'M66 47 C 58 36 34 38 34 60 C 34 82 58 84 66 72';
const BOWL = 'M34 58 C 36 40 66 38 66 60 C 66 82 38 84 34 68';
const HUMP = (x1, x2) => `M${x1} 56 C ${x1 + 2} 40 ${x2} 38 ${x2} 56 L ${x2} 80`;
const LATIN = {
  a: { strokes: [A, 'M66 40 L 66 80'], dots: [] },
  b: { strokes: ['M34 12 L 34 80', BOWL], dots: [] },
  c: { strokes: ['M66 46 C 58 36 34 38 34 60 C 34 82 58 84 66 74'], dots: [] },
  d: { strokes: [A, 'M66 12 L 66 80'], dots: [] },
  e: { strokes: ['M34 60 L 66 60 C 66 42 52 38 46 39 C 36 42 34 54 34 60 C 34 82 58 84 66 74'], dots: [] },
  f: { strokes: ['M64 18 C 58 8 44 10 44 24 L 44 80', 'M32 42 L 58 42'], dots: [] },
  g: { strokes: ['M66 47 C 58 36 34 38 34 58 C 34 78 58 80 66 66', 'M66 40 L 66 86 C 66 98 42 100 36 90'], dots: [] },
  h: { strokes: ['M34 12 L 34 80', HUMP(34, 66)], dots: [] },
  i: { strokes: ['M50 40 L 50 80'], dots: [[50, 24]] },
  j: { strokes: ['M56 40 L 56 86 C 56 98 38 100 32 90'], dots: [[56, 24]] },
  k: { strokes: ['M36 12 L 36 80', 'M64 38 L 37 62 L 66 80'], dots: [] },
  l: { strokes: ['M50 12 L 50 80'], dots: [] },
  m: { strokes: ['M24 40 L 24 80', HUMP(24, 50), HUMP(50, 76)], dots: [] },
  n: { strokes: ['M36 40 L 36 80', HUMP(36, 66)], dots: [] },
  o: { strokes: ['M50 39 C 30 39 32 81 50 81 C 68 81 70 39 50 39'], dots: [] },
  p: { strokes: ['M34 40 L 34 96', BOWL], dots: [] },
  q: { strokes: [A, 'M66 40 L 66 96 L 74 90'], dots: [] },
  r: { strokes: ['M38 40 L 38 80', 'M38 58 C 40 42 54 38 66 44'], dots: [] },
  s: { strokes: ['M64 45 C 58 36 36 36 36 50 C 36 62 64 56 64 70 C 64 84 40 84 34 74'], dots: [] },
  t: { strokes: ['M46 18 L 46 70 C 46 82 58 82 64 76', 'M32 40 L 62 40'], dots: [] },
  u: { strokes: ['M34 40 L 34 64 C 34 84 66 84 66 64', 'M66 40 L 66 80'], dots: [] },
  v: { strokes: ['M32 40 L 50 80 L 68 40'], dots: [] },
  w: { strokes: ['M20 40 L 33 80 L 50 48 L 67 80 L 80 40'], dots: [] },
  x: { strokes: ['M34 40 L 66 80', 'M66 40 L 34 80'], dots: [] },
  y: { strokes: ['M34 40 L 52 76', 'M68 40 L 40 96'], dots: [] },
  z: { strokes: ['M34 40 L 66 40 L 34 80 L 66 80'], dots: [] },
};
for (const k in LATIN) if (!SHAPES['lat_' + k]) SHAPES['lat_' + k] = LATIN[k];

/* ---------- الراوي: صوت إنكليزي للنص الإنكليزي، وعربي للعربي ---------- */
if (EN && !Narrator.__en) {
  Narrator.__en = true;
  let enV = null, arV = null;
  const pick = () => {
    try {
      const vs = speechSynthesis.getVoices(), L = (v) => (v.lang || '').toLowerCase().replace('_', '-');
      enV = vs.find((v) => L(v) === 'en-us') || vs.find((v) => L(v) === 'en-gb') || vs.find((v) => L(v).startsWith('en')) || null;
      arV = vs.find((v) => L(v).startsWith('ar')) || null;
      Narrator.voice = enV || arV;
    } catch (e) {}
  };
  const init0 = Narrator.init.bind(Narrator);
  Narrator.init = (avail, lang) => { init0(avail, lang); if ('speechSynthesis' in window) { pick(); speechSynthesis.addEventListener ? speechSynthesis.addEventListener('voiceschanged', pick) : (speechSynthesis.onvoiceschanged = pick); } };
  const tts0 = Narrator.tts.bind(Narrator);
  Narrator.tts = (text, tk, onStart) => {
    const ar = isAr(text); Narrator.voice = ar ? arV : enV;
    // حرف منفرد: يُنطق باسمه (A، B…) وللعدد كذلك
    const spoken = !ar && /^[a-z]$/.test(String(text).trim()) ? String(text).trim().toUpperCase() + '.' : text;
    return tts0(spoken, tk, onStart);
  };
}

/* ---------- الأنماط ---------- */
if (EN && typeof document !== 'undefined' && !document.getElementById('en-style')) {
  document.head.insertAdjacentHTML('beforeend', `<style id="en-style">
@font-face{font-family:'Andika';src:url(../fonts/andika-latin-400-normal.woff2) format('woff2');font-weight:400 500;font-display:swap}
@font-face{font-family:'Andika';src:url(../fonts/andika-latin-700-normal.woff2) format('woff2');font-weight:600 800;font-display:swap}
.en,.stage .otxt,.stage .txt,.stage .word-card,.stage .piece,.stage .slot,.stage .joined,.stage .lbl,.stage .rline,.stage .sitem .otxt,.stage .bin .in,.n-title,.st-name,.st-title,#lTitle,.n-title,.big-letter span,#lUnit{font-family:'Andika','Noto Naskh Arabic',sans-serif;unicode-bidi:plaintext}
.stage .rline{direction:ltr;text-align:left}
.g-build .slots,.g-order .oslots{direction:ltr}
.g-read{justify-content:flex-start;padding:4px 0}.g-read>.rline:first-child{margin-top:auto}.g-read>.rline:last-child{margin-bottom:auto}
@media (orientation:landscape) and (max-height:500px){.g-memory .mgrid{width:min(100%,62vh * 2.2);gap:8px}}
.en{direction:ltr}
.hl{color:var(--c1)}
/* عنوان عقدة الخريطة: قاعدة .n-title الثانية في القالب (لصفحة النشيد) تلوّنه بلون العقدة نفسه */
.node .n-title{color:#fff;font-size:clamp(34px,10vmin,48px);direction:ltr;white-space:nowrap}
/* الحرف وأصواته */
.g-abc{direction:ltr;width:100%;height:100%;display:flex;align-items:center;justify-content:center;gap:14px;--pic:min(20vmin,150px)}
.g-abc .letters{display:flex;gap:10px;flex:none}
.g-abc .bigl{width:min(30vmin,200px);height:min(30vmin,200px);border-radius:46%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 0 color-mix(in srgb,var(--c2) 40%,#fff),inset 0 0 0 6px color-mix(in srgb,var(--c2) 25%,#fff);font-family:'Andika',sans-serif;font-size:min(22vmin,150px);font-weight:700;color:var(--c1);line-height:1}
.g-abc .letters.n3 .bigl{width:min(22vmin,150px);height:min(22vmin,150px);font-size:min(16vmin,110px)}
.g-abc .cards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:720px}
.g-abc .card{min-width:120px;min-height:96px;padding:8px 14px}
.g-abc .card .word{font-family:'Andika',sans-serif;direction:ltr;line-height:1.3;font-size:clamp(30px,5vmin,44px)}
.g-abc.many{--pic:min(14vmin,110px)}
@media (orientation:portrait){.g-abc{flex-direction:column;gap:10px}.g-abc{--pic:min(16vh,30vw)}.g-abc.many{--pic:min(10vh,22vw)}.g-abc .bigl{width:min(18vh,40vw);height:min(18vh,40vw);font-size:min(13vh,30vw)}.g-abc .letters.n3 .bigl{width:min(13vh,27vw);height:min(13vh,27vw);font-size:min(10vh,21vw)}}
/* الحوار */
.g-talk{direction:ltr;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;gap:12px;max-width:820px;overflow:auto;padding:4px 0}.g-talk>.row:first-child{margin-top:auto}.g-talk>.row:last-child{margin-bottom:auto}
.g-talk .row{display:flex;align-items:center;gap:10px}
.g-talk .row.r{flex-direction:row-reverse}
.g-talk .who{flex:none;width:min(20vmin,100px);height:min(20vmin,100px);background:#fff;border-radius:50%;box-shadow:0 4px 0 rgba(0,0,0,.08);padding:4px}
.g-talk .who svg{width:100%;height:100%}
.g-talk .bub{position:relative;direction:ltr;text-align:left;background:#fff;border:4px solid color-mix(in srgb,var(--c1) 35%,#fff);border-radius:26px;padding:8px 20px;min-height:64px;font-family:'Andika',sans-serif;font-size:clamp(28px,4.8vmin,42px);font-weight:700;color:var(--ink,#3b2a1a);box-shadow:0 5px 0 rgba(0,0,0,.07);cursor:pointer;line-height:1.35}
.g-talk .bub.seen{border-color:#8ce99a}
.g-talk.many .bub{font-size:clamp(28px,3.8vmin,34px);min-height:64px;padding:6px 16px}.g-talk.many .who{width:min(11vmin,70px);height:min(11vmin,70px)}
/* العدّ */
.g-count{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;gap:10px}
.g-count .q{direction:ltr;font-family:'Andika',sans-serif;font-size:clamp(28px,4.6vmin,40px);font-weight:700;background:#fff;border-radius:20px;padding:4px 18px;min-height:56px}
.g-count .q:empty{display:none}
.g-count .things{display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:6px;width:min(92%,640px);justify-items:center}
.g-count .thing{width:min(15vmin,96px);height:min(15vmin,96px)}.g-count .things.few .thing{width:min(24vmin,140px);height:min(24vmin,140px)}.g-count .thing svg{width:100%;height:100%}
.g-count .nums{direction:ltr;display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
.g-count .num{min-width:96px;min-height:96px;border-radius:28px;background:#fff;font-family:'Andika',sans-serif;font-size:clamp(46px,8vmin,64px);font-weight:700;color:var(--c1);box-shadow:0 6px 0 color-mix(in srgb,var(--c2) 45%,#fff);border:4px solid transparent}
.g-count .num.ok{border-color:#69db7c;background:#ebfbee}
/* نعم / لا */
.g-yesno{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;gap:10px}
.g-yesno .yq{direction:ltr;font-family:'Andika',sans-serif;font-size:clamp(30px,5vmin,44px);font-weight:700;background:#fff;border-radius:22px;padding:4px 22px;cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.07)}
.g-yesno .ypic{width:min(34vmin,240px);height:min(34vmin,240px);background:#fff;border-radius:30px;padding:10px;box-shadow:0 5px 0 rgba(0,0,0,.08)}.g-yesno .ypic svg{width:100%;height:100%}
.g-yesno .yb{display:flex;gap:22px;direction:ltr}
.g-yesno .ans{min-width:150px;min-height:96px;border-radius:30px;font-family:'Andika',sans-serif;font-size:clamp(38px,6vmin,52px);font-weight:700;color:#fff;border:none;box-shadow:0 6px 0 rgba(0,0,0,.18)}
.g-yesno .ans.y{background:#40c057}.g-yesno .ans.n{background:#fa5252}.g-yesno .ans.ok{outline:6px solid #ffd43b}
@media (orientation:landscape) and (max-height:500px){.g-count .thing{width:min(11vh,70px);height:min(11vh,70px)}.g-count .num{min-width:72px;min-height:72px}.g-yesno{flex-direction:row;flex-wrap:wrap}.g-yesno .ypic{width:38vh;height:38vh}.g-talk .bub{font-size:28px;min-height:64px;padding:4px 14px;line-height:1.3}.g-talk .who{width:56px;height:56px}.g-abc{--pic:min(20vh,110px)}.g-abc .bigl{width:30vh;height:30vh;font-size:22vh}}
</style>`);
}

// فقاعة التعليمات: الاتجاه حسب لغة النص (العربي من اليمين، والإنكليزي من اليسار)
if (EN && typeof MutationObserver !== 'undefined') {
  const fix = () => { const b = document.getElementById('bubble'); if (b) b.style.direction = isAr(b.textContent) || !b.textContent.trim() ? 'rtl' : 'ltr'; };
  const start = () => { const b = document.getElementById('bubble'); if (b) new MutationObserver(fix).observe(b, { childList: true }); else setTimeout(start, 300); };
  start();
}

/* ======================================================================
   1) الحرف وأصواته / كلمات بصور: يلمس الطفل الحرف والصور فيسمعها، والحرف الأول ملوّن
   data: { letters: ['a'], items: ['apple','ant'] }
   ====================================================================== */
const wordHL = (w, letters) => { const s = String(w); const f = letters && letters.find((l) => s.toLowerCase().startsWith(l)); return f ? `<span class="hl">${esc(s.slice(0, f.length))}</span>${esc(s.slice(f.length))}` : esc(s); };
const abc = (stage, game, ctx) => {
  const d = game.data, items = d.items.map(ctx.item), L = d.letters || [];
  const box = h(`<div class="g-abc${items.length > 4 ? ' many' : ''}">${L.length ? `<div class="letters n${L.length}">${L.map((l) => `<button class="bigl tap en" type="button" data-l="${esc(l)}">${esc(l)}</button>`).join('')}</div>` : ''}<div class="cards"></div></div>`);
  const cards = $('.cards', box), seen = new Set(), total = items.length + L.length;
  const mark = (k) => { if (!seen.has(k)) { seen.add(k); if (seen.size === total) setTimeout(() => ctx.win(), 1100); } };
  $$('.bigl', box).forEach((b) => b.addEventListener('click', () => { SFX.hop(); ctx.say(b.dataset.l, ctx.audioOf(b.dataset.l)); if (!state.reduced) gsap.fromTo(b, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' }); mark('L' + b.dataset.l); }));
  items.forEach((it) => {
    const c = h(`<button class="card tap${it.art ? '' : ' noart'}" type="button">${it.art ? `<div class="pic">${pic(it.art)}</div>` : ''}<div class="word en">${wordHL(it.value, L)}</div><i class="tick">✓</i></button>`);
    c.addEventListener('click', () => { SFX.pop(); ctx.say(it.value, it.audio); if (!state.reduced) gsap.fromTo(c, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' }); c.classList.add('seen'); mark('W' + it.value); });
    cards.appendChild(c);
  });
  stage.appendChild(box); popIn([...$$('.bigl', box), ...$$('.card', box)], 0.2);
  ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const c of [...$$('.bigl', box), ...$$('.card', box)]) { c.click(); await sleep(200); } } };
};

/* ======================================================================
   2) الحوار: جمل الكتاب في فقاعات، يلمسها الطفل فيسمعها
   data: { lines: [{ text, audio, who }] }
   ====================================================================== */
const TALKERS = ['en_brother', 'en_sister'];
const talk = (stage, game, ctx) => {
  const S = game.data.lines;
  const box = h(`<div class="g-talk${S.length > 4 ? ' many' : ''}"></div>`); stage.appendChild(box); const heard = new Set();
  S.forEach((s, i) => {
    const row = h(`<div class="row ${i % 2 ? 'r' : ''}"><div class="who">${pic(s.who || TALKERS[i % 2])}</div><button class="bub tap" type="button">${esc(s.text)}</button></div>`); box.appendChild(row);
    const b = $('.bub', row);
    b.addEventListener('click', () => { SFX.pop(); ctx.say(s.text, s.audio); b.classList.add('seen'); if (!state.reduced) gsap.fromTo(row, { y: 0 }, { y: -6, yoyo: true, repeat: 1, duration: 0.18 }); heard.add(i); if (heard.size === S.length) setTimeout(() => ctx.win(), 1800); });
  });
  popIn($$('.row', box)); ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const b of $$('.bub', box)) { b.click(); await sleep(200); } } };
};

/* ======================================================================
   3) العدّ: عدد الرسوم يساوي الجواب دائماً (يتحقق منه المولّد)
   data: { rounds: [{ say?, items: [artKey…], options: [n…], answer, after? }] }
   ====================================================================== */
const count = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const box = h(`<div class="g-count"><div class="q"></div><div class="things"></div><div class="nums"></div></div>`); stage.appendChild(box);
  const q = $('.q', box), things = $('.things', box), nums = $('.nums', box); let cur = null, order = null, lock = false;
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; lock = false; q.textContent = cur.say || '';
    const n = cur.items.length; things.style.setProperty('--cols', Math.min(5, Math.max(1, Math.ceil(n > 5 ? n / 2 : n))));
    things.classList.toggle('few', n <= 3); things.innerHTML = cur.items.map((a, i) => `<div class="thing" data-i="${i}">${pic(a)}</div>`).join('');
    $$('.thing', things).forEach((t) => t.addEventListener('click', () => { SFX.pop(); if (!state.reduced) gsap.fromTo(t, { y: 0 }, { y: -8, yoyo: true, repeat: 1, duration: 0.15 }); }));
    nums.innerHTML = ''; const idx = reshuffle(cur.options.map((_, i) => i), order); order = idx;
    const els = idx.map((i) => { const b = h(`<button class="num tap" type="button" data-i="${i}">${esc(String(cur.options[i]))}</button>`); nums.appendChild(b); return b; });
    const good = () => els.find((e) => +e.dataset.i === cur.answer);
    els.forEach((b) => b.addEventListener('click', () => {
      if (lock) return; const v = String(cur.options[+b.dataset.i]);
      if (+b.dataset.i === cur.answer) { lock = true; b.classList.add('ok'); burst(b, '#69db7c'); const say = cur.after || v; ctx.praise(say); setTimeout(next, 2400); }
      else { ctx.say(v, ctx.audioOf(v)); T.miss(b, good(), String(cur.options[cur.answer])); }
    }));
    popIn([...$$('.thing', things), ...els]);
    if (k === 0) await ctx.instruct(game.say, game.audio);
    if (cur.say) { await sleep(150); ctx.say(cur.say, ctx.audioOf(cur.say)); }
  }, ctx);
  ctx.replay = () => (cur && cur.say ? ctx.say(cur.say, ctx.audioOf(cur.say)) : ctx.instruct(game.say, game.audio));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); const g = $$('.num', nums).find((e) => +e.dataset.i === cur.answer); g && g.click(); await sleep(2700); } } };
};

/* ======================================================================
   4) نعم أو لا: سؤال من الكتاب وصورة، يجيب الطفل Yes. أو No.
   data: { yes: 'Yes.', no: 'No.', rounds: [{ say, art, answer: true|false }] }
   ====================================================================== */
const yesno = (stage, game, ctx) => {
  const d = game.data, R0 = d.rounds, T = tries(ctx);
  const box = h(`<div class="g-yesno"><button class="yq tap" type="button"></button><div class="ypic"></div><div class="yb"><button class="ans y tap" type="button">${esc(d.yes)}</button><button class="ans n tap" type="button">${esc(d.no)}</button></div></div>`); stage.appendChild(box);
  const yq = $('.yq', box), yp = $('.ypic', box), by = $('.ans.y', box), bn = $('.ans.n', box); let cur = null, lock = false;
  yq.addEventListener('click', () => cur && ctx.say(cur.say, ctx.audioOf(cur.say)));
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; lock = false; yq.textContent = cur.say; yp.innerHTML = pic(cur.art); by.classList.remove('ok'); bn.classList.remove('ok');
    popIn([yp, yq]);
    if (k === 0) await ctx.instruct(game.say, game.audio);
    await sleep(150); ctx.say(cur.say, ctx.audioOf(cur.say));
  }, ctx);
  const pickA = (b, yes) => {
    if (lock || !cur) return; const txt = yes ? d.yes : d.no;
    if (yes === cur.answer) { lock = true; b.classList.add('ok'); burst(b, '#69db7c'); ctx.praise(txt); setTimeout(R.start, 2200); }
    else { ctx.say(txt, ctx.audioOf(txt)); T.miss(b, cur.answer ? by : bn, cur.answer ? d.yes : d.no); }
  };
  by.addEventListener('click', () => pickA(by, true)); bn.addEventListener('click', () => pickA(bn, false));
  ctx.replay = () => cur && ctx.say(cur.say, ctx.audioOf(cur.say));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); (cur.answer ? by : bn).click(); await sleep(2500); } } };
};

export const TEMPLATES = { abc, talk, count, yesno };
