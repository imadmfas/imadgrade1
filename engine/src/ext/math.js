// قوالب كتاب الرياضيات: عُدَّ والمس، الجمع والطرح بالأشياء، المقارنة، القفز على خط الأعداد، النمط، العدد الترتيبي، القيمة المكانية.
// كل قالب: (stage, game, ctx) → { destroy, auto }. لا مؤقت ولا خسارة، وبعد محاولتين يلمع الجواب ويُنطق.
import { gsap, $, $$, SFX, state, sleep, esc, shuffle, reshuffle } from '../core.js';
import { art, ART } from '../art.js';
import { SHAPES, shake, glowHint, popIn, burst, tw } from '../games.js';

/* ---------- أشكال الأرقام للتتبّع (٠–٩) داخل مربع 100×100 ---------- */
Object.assign(SHAPES, {
  d0: { strokes: ['M50 38 C 62 38 62 60 50 60 C 38 60 38 38 50 38'], dots: [] },
  d1: { strokes: ['M50 16 L 50 86'], dots: [] },
  d2: { strokes: ['M72 16 C 68 34 52 34 42 24 L 46 86'], dots: [] },
  d3: { strokes: ['M76 14 C 74 30 62 32 60 20 C 58 32 48 32 40 22 L 44 86'], dots: [] },
  d4: { strokes: ['M66 22 C 46 12 38 34 58 42 C 34 46 30 74 54 76 C 62 77 68 72 72 66'], dots: [] },
  d5: { strokes: ['M50 22 C 28 40 24 82 50 82 C 76 82 72 40 50 22'], dots: [] },
  d6: { strokes: ['M30 22 C 44 32 58 28 62 18 L 62 86'], dots: [] },
  d7: { strokes: ['M28 18 L 50 86 L 72 18'], dots: [] },
  d8: { strokes: ['M28 86 L 50 18 L 72 86'], dots: [] },
  d9: { strokes: ['M62 30 C 54 12 32 20 36 36 C 40 50 60 46 62 30 L 64 86'], dots: [] },
});

/* ---------- أنماط العرض ---------- */
const CSS = `
.m-wrap{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;gap:8px}
.m-area{flex:1;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;gap:10px}
.m-grid{display:grid;grid-template-columns:repeat(var(--cols),var(--s));gap:8px;justify-content:center;align-content:center}
.m-obj{width:var(--s);height:var(--s);min-width:64px;min-height:64px;background:#fff;border-radius:18px;box-shadow:0 4px 0 rgba(0,0,0,.08);position:relative;display:flex;align-items:center;justify-content:center;padding:4px;border:3px solid transparent}
.m-obj svg{width:100%;height:100%}
.m-obj.sm{min-width:0;min-height:0;box-shadow:none;border-radius:10px;padding:2px;cursor:default}
.m-obj.seen{border-color:#8ce99a;background:#ebfbee}
.m-obj .m-badge{position:absolute;top:-10px;inset-inline-start:-8px;min-width:34px;height:34px;border-radius:17px;background:var(--c1);color:#fff;font-size:24px;font-weight:700;line-height:34px;text-align:center;font-style:normal;box-shadow:0 2px 0 rgba(0,0,0,.15)}
.m-obj.gone svg{opacity:.35}
.m-obj .m-x{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:calc(var(--s) * .8);color:#e03131;font-family:sans-serif;font-weight:700;line-height:1;pointer-events:none}
.m-grp{border:4px dashed color-mix(in srgb,var(--c2) 45%,#fff);border-radius:24px;padding:10px}
.m-sign{font-size:clamp(40px,8vmin,64px);font-weight:700;color:var(--c2);font-family:sans-serif}
.m-eq{direction:rtl;font-size:clamp(36px,7vmin,60px);font-weight:700;line-height:1.4;background:#fff;border-radius:22px;padding:0 22px;box-shadow:0 4px 0 rgba(0,0,0,.07);white-space:nowrap}
.m-eq .q{display:inline-block;min-width:1.3em;text-align:center;color:var(--c1);border-bottom:5px dashed var(--c1)}
.m-eq .q.on{border-bottom-color:#40c057;color:#2b8a3e}
.m-opts{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;min-height:80px;align-items:center}
.m-opt{min-width:84px;min-height:72px;padding:0 16px;background:#fff;border-radius:22px;box-shadow:0 5px 0 rgba(0,0,0,.08);border:4px solid transparent;font-size:clamp(38px,7vmin,56px);font-weight:700;line-height:1.3;display:flex;align-items:center;justify-content:center}
.m-opt.ok{border-color:#40c057;background:#ebfbee}
.m-opt svg{width:64px;height:64px}
.m-cmp{display:flex;align-items:stretch;justify-content:center;gap:12px;width:100%}
.m-side{flex:1;max-width:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#fff;border-radius:24px;box-shadow:0 4px 0 rgba(0,0,0,.07);padding:8px;border:4px solid transparent}
.m-side.ok{border-color:#40c057;background:#ebfbee}
.m-side .m-big{font-size:clamp(44px,9vmin,72px);font-weight:700;line-height:1.2}
.m-side .m-grid{gap:4px}
.m-side .m-obj{box-shadow:none;border-radius:12px;padding:2px}
.m-mid{align-self:center;min-width:84px;min-height:84px;border-radius:50%;border:5px dashed var(--c1);background:#fff;font-size:clamp(44px,8vmin,64px);font-weight:700;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:var(--c1)}
.m-line{direction:ltr;display:grid;grid-template-columns:repeat(var(--cols),var(--s));gap:6px;justify-content:center}
.m-tile{width:var(--s);height:var(--s);min-width:64px;min-height:64px;border-radius:16px;background:#fff;box-shadow:0 4px 0 rgba(0,0,0,.08);font-size:clamp(30px,5.5vmin,44px);font-weight:700;display:flex;align-items:center;justify-content:center;position:relative;border:3px solid #e9ecef}
.m-tile.start{border-color:var(--c2)}.m-tile.path{background:#fff3bf}.m-tile.end{border-color:#40c057;background:#ebfbee}
.m-tile .frog{position:absolute;inset:-14px -6px auto auto;width:46px;height:46px;pointer-events:none}
.m-tile .frog svg{width:100%;height:100%}
.m-pat{display:flex;gap:8px;flex-wrap:nowrap;justify-content:center;align-items:center;direction:rtl}
.m-tok{width:var(--s);height:var(--s);min-width:40px;min-height:40px;cursor:pointer;border:none;background:#fff;border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 rgba(0,0,0,.07);font-size:clamp(32px,6vmin,48px);font-weight:700;padding:4px}
.m-tok svg{width:100%;height:100%}
.m-pat ~ .m-opts .m-opt svg{width:84px;height:84px}
.m-tok.gap{border:4px dashed var(--c1);background:#fff9db;color:var(--c1)}
.m-tok.gap.on{border:4px solid #40c057;background:#ebfbee}
.m-row{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;direction:rtl;max-width:min(100%,760px)}
.m-row .m-obj{flex:none}
.m-pv{display:flex;gap:12px;align-items:stretch;justify-content:center}
.m-pv>.m-col{flex:none}
.m-col{display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:20px;padding:4px 10px;box-shadow:0 4px 0 rgba(0,0,0,.07)}
.m-col .m-h{font-size:28px;font-weight:700;color:var(--c1);line-height:1.5}
.m-col .m-items{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:flex-end;max-width:min(46vw,360px)}
.m-rod{width:64px;height:var(--rh);min-width:64px;min-height:64px;background:none;padding:2px 14px;display:flex;flex-direction:column;border-radius:12px;border:3px solid transparent;flex:none}
.m-rod i{flex:1;background:#ff922b;border:2px solid #4a3426;border-bottom-width:1px;border-radius:3px}
.m-rod i:last-child{border-bottom-width:2px}
.m-col .m-items.tens{gap:2px}
.m-rod.seen,.m-unit.seen{border-color:#8ce99a;background:#ebfbee}
.m-unit{width:64px;height:64px;background:none;padding:0;border-radius:12px;border:3px solid transparent}
.m-unit svg{width:100%;height:100%}
`;
if (typeof document !== 'undefined' && !document.getElementById('m-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m-css">${CSS}</style>`);

/* ---------- أدوات ---------- */
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
function tries(ctx) {
  let wrong = 0;
  return { reset() { wrong = 0; }, miss(el, good, text) { wrong++; shake(el); ctx.encourage(); if (wrong >= 2 && good) { setTimeout(() => { glowHint(good); if (text) ctx.say(text, ctx.audioOf(text)); }, 700); wrong = 0; } } };
}
function rounds(n, run, ctx) {
  let i = 0, alive = true;
  const next = async () => { if (!alive) return; if (i >= n) { ctx.win(); return; } const k = i++; await run(k, next); };
  return { start: next, stop() { alive = false; }, get i() { return i; }, get alive() { return alive; } };
}
// أسماء الأعداد كما يقرؤها الكتاب (ص ١٠–٢٤ وص ١٥٦)
export const NUMW = ['صِفْرٌ', 'وَاحِدٌ', 'اِثْنَانِ', 'ثَلَاثَةٌ', 'أَرْبَعَةٌ', 'خَمْسَةٌ', 'سِتَّةٌ', 'سَبْعَةٌ', 'ثَمَانِيَةٌ', 'تِسْعَةٌ', 'عَشَرَةٌ',
  'أَحَدَ عَشَرَ', 'اِثْنَا عَشَرَ', 'ثَلَاثَةَ عَشَرَ', 'أَرْبَعَةَ عَشَرَ', 'خَمْسَةَ عَشَرَ', 'سِتَّةَ عَشَرَ', 'سَبْعَةَ عَشَرَ', 'ثَمَانِيَةَ عَشَرَ', 'تِسْعَةَ عَشَرَ', 'عِشْرُونَ'];
export const TENW = ['', 'عَشَرَةٌ', 'عِشْرُونَ', 'ثَلَاثُونَ', 'أَرْبَعُونَ', 'خَمْسُونَ', 'سِتُّونَ', 'سَبْعُونَ', 'ثَمَانُونَ', 'تِسْعُونَ'];
const word = (n, ctx) => (n >= 0 && n <= 20 ? NUMW[n] : n % 10 === 0 && n < 100 ? TENW[n / 10] : ctx.digits(n));
const sayNum = (n, ctx) => { const w = word(n, ctx); return ctx.say(w, ctx.audioOf(w)); };
const pic = (k) => (k && ART[k] ? art(k) : '');
// أكبر مقاس لمربعات n داخل مساحة w×h
function fit(n, w, hgt, gap = 8, max = 120) {
  let best = { cols: Math.max(1, n), s: 64 };
  for (let c = 1; c <= Math.max(1, n); c++) { const r = Math.ceil(n / c); const s = Math.min((w - gap * (c - 1)) / c, (hgt - gap * (r - 1)) / r); if (s > best.s0 || best.s0 === undefined) best = { cols: c, s, s0: s }; }
  best.s = Math.max(64, Math.min(max, Math.floor(best.s))); return best;
}
function sfit(n, w, hgt, gap = 4, max = 100) { let best = { cols: 1, s: 0 }; for (let c = 1; c <= n; c++) { const r = Math.ceil(n / c), s = Math.min((w - gap * (c - 1)) / c, (hgt - gap * (r - 1)) / r); if (s > best.s) best = { cols: c, s }; } best.s = Math.max(20, Math.min(max, Math.floor(best.s))); return best; }
const box = (el) => { const r = el.getBoundingClientRect(); return [r.width, r.height]; };
// خيارات الأعداد: أزرار كبيرة، تُنطق عند الخطأ
function numOpts(wrap, list, answer, ctx, T, onGood, fmt) {
  wrap.innerHTML = '';
  const els = list.map((v) => { const b = h(`<button class="m-opt tap" type="button">${fmt ? fmt(v) : esc(ctx.digits(v))}</button>`); b.dataset.v = v; wrap.appendChild(b); return b; });
  const good = () => els.find((e) => e.dataset.v === String(answer));
  els.forEach((b) => b.addEventListener('click', () => {
    if (wrap.dataset.done === '1') return;
    if (b.dataset.v === String(answer)) { wrap.dataset.done = '1'; b.classList.add('ok'); burst(b, '#69db7c'); onGood(b); }
    else { if (!fmt) sayNum(+b.dataset.v, ctx); T.miss(b, good(), fmt ? null : word(answer, ctx)); }
  }));
  popIn(els); wrap.dataset.done = '';
  return { good };
}
const orderOpts = (opts, prev) => { const idx = reshuffle(opts.map((_, i) => i), prev); return idx; };

/* ======================================================================
   1) عُدَّ والمس: يلمس الطفل كل شيء فيُعَدّ بصوت مسموع، ثم يختار العدد
   round: { groups:[{art, n}], answer, options, ask? }
   ====================================================================== */
const count = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const root = h(`<div class="m-wrap"><div class="m-area"></div><div class="m-opts"></div></div>`); stage.appendChild(root);
  const area = $('.m-area', root), wrap = $('.m-opts', root); let cur = null, order = null, counted = 0, objs = [];
  const showOpts = () => { const idx = orderOpts(cur.options, order); order = idx; numOpts(wrap, idx.map((i) => cur.options[i]), cur.answer, ctx, T, () => { ctx.praise(word(cur.answer, ctx)); setTimeout(nx, 1800); }); if (cur.ask) ctx.say(cur.ask, ctx.audioOf(cur.ask)); };
  let nx = null;
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); nx = next; cur = R0[k]; area.innerHTML = ''; wrap.innerHTML = ''; counted = 0;
    const items = cur.groups.flatMap((g) => Array.from({ length: g.n }, () => g.art));
    const [w, hh] = box(area); const f = fit(items.length || 1, w - 16, hh - 16);
    const grid = h(`<div class="m-grid" style="--cols:${f.cols};--s:${f.s}px"></div>`); area.appendChild(grid);
    objs = items.map((a) => { const b = h(`<button class="m-obj tap" type="button">${pic(a)}</button>`); grid.appendChild(b); return b; });
    if (objs.length !== cur.answer) throw new Error(`count: drawn ${objs.length} ≠ ${cur.answer}`);
    objs.forEach((b) => b.addEventListener('click', () => {
      if (b.classList.contains('seen')) { SFX.pop(); sayNum(+b.dataset.k, ctx); return; }
      counted++; b.dataset.k = counted; b.classList.add('seen'); b.insertAdjacentHTML('beforeend', `<i class="m-badge">${esc(ctx.digits(counted))}</i>`);
      SFX.pop(); sayNum(counted, ctx); if (!state.reduced) gsap.fromTo(b, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
      if (counted === objs.length) setTimeout(showOpts, 900);
    }));
    popIn(objs);
    if (k === 0) await ctx.instruct(game.say, game.audio);
    if (!objs.length) showOpts();
  }, ctx);
  ctx.replay = () => ctx.instruct(game.say, game.audio);
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(300); for (const b of objs) { if (!b.classList.contains('seen')) b.click(); await sleep(60); } await sleep(1100); const g = $$('.m-opt', wrap).find((e) => e.dataset.v === String(cur.answer)); g && g.click(); await sleep(2000); } } };
};

/* ======================================================================
   2) الجمع والطرح بالأشياء: «٣ + ٢ = ؟» أو «٥ − ٢ = ؟» (تُشطب الأشياء المطروحة)
   round: { op:'+'|'-', a, b, art, art2?, answer, options }
   ====================================================================== */
const arith = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const root = h(`<div class="m-wrap"><div class="m-area"></div><div class="m-eq"></div><div class="m-opts"></div></div>`); stage.appendChild(root);
  const area = $('.m-area', root), eq = $('.m-eq', root), wrap = $('.m-opts', root); let cur = null, order = null;
  const sym = (op) => (op === '+' ? '+' : '−');
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; area.innerHTML = ''; const D = ctx.digits;
    eq.innerHTML = `${esc(D(cur.a))} ${sym(cur.op)} ${esc(D(cur.b))} = <span class="q">؟</span>`;
    const objs = [];
    if (cur.art) {
      const [w, hh] = box(area);
      if (cur.op === '+') {
        const nA = cur.a, nB = cur.b, half = (w - 64) / 2;
        const fa = sfit(Math.max(nA, nB, 1), half - 30, hh - 30, 4, 90);
        const s = fa.s, mk = (n, a) => { const g = h(`<div class="m-grp"><div class="m-grid" style="--cols:${Math.min(fa.cols, Math.max(1, n))};--s:${s}px;gap:4px"></div></div>`); for (let i = 0; i < n; i++) { const b = h(`<span class="m-obj sm">${pic(a)}</span>`); $('.m-grid', g).appendChild(b); objs.push(b); } return g; };
        area.appendChild(mk(nA, cur.art)); area.appendChild(h(`<div class="m-sign">+</div>`)); area.appendChild(mk(nB, cur.art2 || cur.art));
      } else {
        const f = sfit(Math.max(1, cur.a), w - 30, hh - 30, 4, 100);
        const g = h(`<div class="m-grp"><div class="m-grid" style="--cols:${f.cols};--s:${f.s}px;gap:4px"></div></div>`); area.appendChild(g);
        for (let i = 0; i < cur.a; i++) { const b = h(`<span class="m-obj sm">${pic(cur.art)}</span>`); $('.m-grid', g).appendChild(b); objs.push(b); }
        // شطب المطروح من آخر الصف
        setTimeout(() => objs.slice(cur.a - cur.b).forEach((b, i) => setTimeout(() => { b.classList.add('gone'); b.insertAdjacentHTML('beforeend', '<i class="m-x">✕</i>'); SFX.soft(); }, i * 250)), 700);
      }
      if (objs.length !== (cur.op === '+' ? cur.a + cur.b : cur.a)) throw new Error(`arith: drawn ${objs.length}`);
      popIn(objs);
    }
    const idx = orderOpts(cur.options, order); order = idx;
    numOpts(wrap, idx.map((i) => cur.options[i]), cur.answer, ctx, T, () => {
      const q = $('.q', eq); q.textContent = ctx.digits(cur.answer); q.classList.add('on');
      const full = `${D(cur.a)} ${cur.op === '+' ? '+' : '−'} ${D(cur.b)} = ${D(cur.answer)}`; ctx.praise(full); setTimeout(next, 2400);
    });
    if (k === 0) await ctx.instruct(game.say, game.audio);
  }, ctx);
  ctx.replay = () => ctx.instruct(game.say, game.audio);
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(500); const g = $$('.m-opt', wrap).find((e) => e.dataset.v === String(cur.answer)); g && g.click(); await sleep(2600); } } };
};

/* ======================================================================
   3) المقارنة: أكبر من، أصغر من، يساوي — أو المس المجموعة الأكثر/الأقل
   round: { a, b, artA?, artB?, mode:'sign'|'more'|'less', say? }  (a يمين، b يسار)
   ====================================================================== */
const SIGNW = { '>': 'أَكْبَرُ مِنْ', '<': 'أَصْغَرُ مِنْ', '=': 'يُسَاوِي' };
const compare = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const root = h(`<div class="m-wrap"><div class="m-cmp"></div><div class="m-opts"></div></div>`); stage.appendChild(root);
  const cmp = $('.m-cmp', root), wrap = $('.m-opts', root); let cur = null, order = null;
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; cmp.innerHTML = ''; wrap.innerHTML = ''; const D = ctx.digits;
    const side = (n, a) => {
      const s = h(`<button class="m-side tap" type="button"></button>`);
      if (a && n <= 20) { const W = Math.min(340, (stage.clientWidth - 140) / 2), H = stage.clientHeight * (cur.mode === 'sign' ? 0.42 : 0.6); const f0 = sfit(Math.max(1, cur.a, cur.b), W - 20, H - 70, 4, 64), f = { s: f0.s, cols: Math.min(f0.cols, Math.max(1, n)) }; s.insertAdjacentHTML('beforeend', `<div class="m-grid" style="--cols:${f.cols};--s:${f.s}px;gap:4px">${Array.from({ length: n }, () => `<span class="m-obj sm">${pic(a)}</span>`).join('')}</div>`); }
      s.insertAdjacentHTML('beforeend', `<div class="m-big">${esc(D(n))}</div>`); s.addEventListener('click', () => { if (cur.mode === 'sign') sayNum(n, ctx); }); return s;
    };
    const A = side(cur.a, cur.artA), B = side(cur.b, cur.artB || cur.artA), mid = h(`<div class="m-mid">${cur.mode === 'sign' ? '؟' : ''}</div>`);
    cmp.append(A, mid, B); if (cur.mode !== 'sign') mid.remove();
    const ans = cur.a > cur.b ? '>' : cur.a < cur.b ? '<' : '=';
    const sentence = `${D(cur.a)} ${SIGNW[ans]} ${D(cur.b)}`;
    if (cur.mode === 'sign') {
      const syms = reshuffle(['>', '<', '='], order); order = syms;
      numOpts(wrap, syms, ans, ctx, T, () => { mid.textContent = ans; mid.style.borderStyle = 'solid'; mid.style.borderColor = '#40c057'; ctx.praise(sentence); setTimeout(next, 2600); }, (v) => `<span dir="rtl">${esc(v)}</span>`);
      $$('.m-opt', wrap).forEach((b) => b.addEventListener('click', () => { if (b.dataset.v !== ans) ctx.say(SIGNW[b.dataset.v], ctx.audioOf(SIGNW[b.dataset.v])); }));
    } else {
      const goodEl = (cur.mode === 'more') === (cur.a > cur.b) ? A : B, badEl = goodEl === A ? B : A; let done = false;
      goodEl.addEventListener('click', () => { if (done) return; done = true; goodEl.classList.add('ok'); burst(goodEl, '#69db7c'); ctx.praise(sentence); setTimeout(next, 2400); });
      badEl.addEventListener('click', () => { if (done) return; sayNum(goodEl === A ? cur.b : cur.a, ctx); T.miss(badEl, goodEl, cur.say); });
      A.dataset.good = goodEl === A ? '1' : ''; B.dataset.good = goodEl === B ? '1' : '';
    }
    popIn([A, B]);
    if (k === 0 || cur.say) { await ctx.instruct(cur.say || game.say, ctx.audioOf(cur.say || game.say)); }
  }, ctx);
  ctx.replay = () => ctx.instruct(cur && cur.say || game.say, ctx.audioOf(cur && cur.say || game.say));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(500); if (cur.mode === 'sign') { const ans = cur.a > cur.b ? '>' : cur.a < cur.b ? '<' : '='; $$('.m-opt', wrap).find((e) => e.dataset.v === ans).click(); } else $$('.m-side', cmp).find((e) => e.dataset.good === '1').click(); await sleep(2800); } } };
};

/* ======================================================================
   4) القفز على خط الأعداد: يبدأ الضفدع من عدد، ويقفز إلى الأمام أو إلى الوراء
   round: { start, step (موجب أو سالب), from, to }
   ====================================================================== */
const hop = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const root = h(`<div class="m-wrap"><div class="m-eq"></div><div class="m-area"></div></div>`); stage.appendChild(root);
  const eq = $('.m-eq', root), area = $('.m-area', root); let cur = null, pos = 0, left = 0, tiles = [];
  const frog = h(`<span class="frog">${art('frog')}</span>`);
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; area.innerHTML = ''; const D = ctx.digits, end = cur.start + cur.step, dir = Math.sign(cur.step);
    eq.innerHTML = `${esc(D(cur.start))} ${dir > 0 ? '+' : '−'} ${esc(D(Math.abs(cur.step)))} = <span class="q">؟</span>`;
    const n = cur.to - cur.from + 1, [w] = box(area), cols = Math.max(1, Math.min(n, Math.floor((w - 6) / 70))), sz = Math.max(64, Math.min(96, Math.floor((w - 6 * (cols - 1) - 8) / cols)));
    const line = h(`<div class="m-line" style="--cols:${cols};--s:${sz}px"></div>`); area.appendChild(line);
    tiles = []; for (let v = cur.from; v <= cur.to; v++) { const t = h(`<button class="m-tile tap" type="button" data-v="${v}">${esc(D(v))}</button>`); line.appendChild(t); tiles.push(t); }
    const tileOf = (v) => tiles[v - cur.from];
    pos = cur.start; left = Math.abs(cur.step); tileOf(pos).classList.add('start'); tileOf(pos).appendChild(frog);
    tiles.forEach((t) => t.addEventListener('click', () => {
      const v = +t.dataset.v; if (left <= 0) { sayNum(v, ctx); return; }
      if (v === pos + dir) { pos = v; left--; t.classList.add('path'); t.appendChild(frog); SFX.hop(); if (!state.reduced) gsap.fromTo(frog, { y: -26 }, { y: 0, duration: 0.35, ease: 'bounce.out' }); sayNum(v, ctx);
        if (left === 0) { t.classList.add('end'); const q = $('.q', eq); q.textContent = D(end); q.classList.add('on'); burst(t, '#69db7c'); setTimeout(() => { ctx.praise(`${D(cur.start)} ${dir > 0 ? '+' : '−'} ${D(Math.abs(cur.step))} = ${D(end)}`); }, 700); setTimeout(next, 3000); } }
      else { sayNum(v, ctx); T.miss(t, tileOf(pos + dir), word(pos + dir, ctx)); }
    }));
    popIn(tiles);
    if (k === 0) await ctx.instruct(game.say, game.audio);
    sayNum(cur.start, ctx);
  }, ctx);
  ctx.replay = () => ctx.instruct(game.say, game.audio);
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(500); const dir = Math.sign(cur.step); while (left > 0) { tiles[pos + dir - cur.from].click(); await sleep(220); } await sleep(3200); } } };
};

/* ======================================================================
   5) النمط والعدد الناقص: صف من أشكال أو أعداد فيه خانة فارغة
   round: { seq:[tok|null], options:[tok], answer, say? }  tok: {shape, color} | {art} | {n}
   ====================================================================== */
const SH = {
  circle: (c) => `<circle cx="50" cy="50" r="36" fill="${c}" stroke="#4a3426" stroke-width="4"/>`,
  square: (c) => `<rect x="16" y="16" width="68" height="68" rx="4" fill="${c}" stroke="#4a3426" stroke-width="4"/>`,
  triangle: (c) => `<path d="M50 12L88 84H12Z" fill="${c}" stroke="#4a3426" stroke-width="4" stroke-linejoin="round"/>`,
  cube: (c) => `<rect x="18" y="18" width="64" height="64" rx="6" fill="${c}" stroke="#4a3426" stroke-width="4"/><circle cx="50" cy="50" r="12" fill="none" stroke="#4a3426" stroke-width="3"/>`,
};
const tokHtml = (t, ctx) => (t.n !== undefined ? esc(ctx.digits(t.n)) : t.art ? pic(t.art) : `<svg viewBox="0 0 100 100">${SH[t.shape](t.color)}</svg>`);
const tokKey = (t) => JSON.stringify(t);
const pattern = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const root = h(`<div class="m-wrap"><div class="m-pat"></div><div class="m-opts"></div></div>`); stage.appendChild(root);
  const row = $('.m-pat', root), wrap = $('.m-opts', root); let cur = null, order = null;
  const speak = (t) => { if (t.n !== undefined) sayNum(t.n, ctx); else if (t.say) ctx.say(t.say, ctx.audioOf(t.say)); else SFX.pop(); };
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; row.innerHTML = '';
    const n = cur.seq.length, s = Math.max(40, Math.min(104, Math.floor((stage.clientWidth - 30 - 8 * (n - 1)) / n)));
    row.style.setProperty('--s', s + 'px');
    const els = cur.seq.map((t) => { const e = h(`<button class="m-tok ${t ? '' : 'gap'}" type="button">${t ? tokHtml(t, ctx) : '؟'}</button>`); e.addEventListener('click', () => (t ? speak(t) : SFX.click())); row.appendChild(e); return e; });
    const gapEl = els[cur.seq.indexOf(null)];
    const idx = orderOpts(cur.options, order); order = idx;
    numOpts(wrap, idx.map((i) => i), cur.answer, ctx, T, () => {
      const t = cur.options[cur.answer]; gapEl.innerHTML = tokHtml(t, ctx); gapEl.classList.add('on'); speak(t); setTimeout(() => ctx.praise(), 600); setTimeout(next, 2200);
    }, (i) => tokHtml(cur.options[i], ctx));
    $$('.m-opt', wrap).forEach((b) => { b.style.setProperty('--s', '72px'); b.addEventListener('click', () => { if (+b.dataset.v !== cur.answer) speak(cur.options[+b.dataset.v]); }); });
    popIn([...els]);
    if (k === 0) await ctx.instruct(game.say, game.audio); else if (cur.say) ctx.say(cur.say, ctx.audioOf(cur.say));
  }, ctx);
  ctx.replay = () => ctx.instruct(game.say, game.audio);
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); $$('.m-opt', wrap).find((e) => +e.dataset.v === cur.answer).click(); await sleep(2400); } } };
};

/* ======================================================================
   6) العدد الترتيبي: صف من الأشياء يبدأ من اليمين، يلمس الطفل الذي يُذكر ترتيبه
   round: { art, n, target (يبدأ من ١ يميناً), say }
   ====================================================================== */
export const ORDW = ['الْأَوَّلُ', 'الثَّانِي', 'الثَّالِثُ', 'الرَّابِعُ', 'الْخَامِسُ', 'السَّادِسُ', 'السَّابِعُ', 'الثَّامِنُ', 'التَّاسِعُ', 'الْعَاشِرُ'];
const rowpick = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const root = h(`<div class="m-wrap"><div class="m-row"></div></div>`); stage.appendChild(root);
  const row = $('.m-row', root); let cur = null, els = [];
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; row.innerHTML = '';
    const W = Math.min(stage.clientWidth - 26, 760), per = cur.n <= 5 || W >= 64 * cur.n + 3 * (cur.n - 1) ? cur.n : Math.ceil(cur.n / 2);
    const s = Math.max(64, Math.min(110, Math.floor((W - 3 * (per - 1)) / per)));
    row.style.maxWidth = per * s + (per - 1) * 3 + 'px';
    els = Array.from({ length: cur.n }, (_, i) => { const b = h(`<button class="m-obj tap" type="button" style="--s:${s}px">${pic(cur.art)}</button>`); b.dataset.i = i + 1; row.appendChild(b); return b; });
    let done = false;
    els.forEach((b) => b.addEventListener('click', () => {
      if (done) return; const i = +b.dataset.i;
      if (i === cur.target) { done = true; b.classList.add('seen'); burst(b, '#69db7c'); ctx.say(ORDW[i - 1], ctx.audioOf(ORDW[i - 1])).then(() => ctx.praise()); setTimeout(next, 2400); }
      else { if (i <= 10) ctx.say(ORDW[i - 1], ctx.audioOf(ORDW[i - 1])); T.miss(b, els[cur.target - 1], cur.say); }
    }));
    popIn(els);
    if (k === 0) await ctx.instruct(game.say, game.audio);
    await sleep(100); ctx.say(cur.say, ctx.audioOf(cur.say));
  }, ctx);
  ctx.replay = () => cur && ctx.say(cur.say, ctx.audioOf(cur.say));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); els[cur.target - 1].click(); await sleep(2600); } } };
};

/* ======================================================================
   7) القيمة المكانية: قضبان العشرات ومكعبات الآحاد، يعدّها الطفل ثم يختار العدد
   round: { tens, ones, answer, options }
   ====================================================================== */
const place = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const root = h(`<div class="m-wrap"><div class="m-pv"></div><div class="m-opts"></div></div>`); stage.appendChild(root);
  const pv = $('.m-pv', root), wrap = $('.m-opts', root); let cur = null, order = null, all = [];
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; pv.innerHTML = ''; wrap.innerHTML = '';
    const tw = Math.max(140, stage.clientWidth - 210), per = Math.max(1, Math.floor((tw + 2) / 66)), rowsN = Math.max(1, Math.ceil(cur.tens / per));
    const rh = Math.max(72, Math.min(200, (stage.clientHeight * 0.58 - 50) / rowsN));
    const ones = h(`<div class="m-col"><div class="m-h">آحَادٌ</div><div class="m-items"></div></div>`), tens = h(`<div class="m-col"><div class="m-h">عَشَرَاتٌ</div><div class="m-items tens" style="--rh:${rh}px;max-width:${per * 66}px;width:${Math.min(per, Math.max(1, cur.tens)) * 66}px"></div></div>`);
    pv.append(ones, tens);
    $('.m-h', ones).addEventListener('click', () => ctx.say('آحَادٌ', ctx.audioOf('آحَادٌ'))); $('.m-h', tens).addEventListener('click', () => ctx.say('عَشَرَاتٌ', ctx.audioOf('عَشَرَاتٌ')));
    const rods = Array.from({ length: cur.tens }, () => { const b = h(`<button class="m-rod tap" type="button">${'<i></i>'.repeat(10)}</button>`); $('.m-items', tens).appendChild(b); return b; });
    const units = Array.from({ length: cur.ones }, () => { const b = h(`<button class="m-unit tap" type="button">${art('m_cube')}</button>`); $('.m-items', ones).appendChild(b); return b; });
    all = [...rods, ...units]; let tc = 0, oc = 0;
    const check = () => { if (all.every((b) => b.classList.contains('seen'))) setTimeout(() => { const idx = orderOpts(cur.options, order); order = idx; numOpts(wrap, idx.map((i) => cur.options[i]), cur.answer, ctx, T, () => { ctx.praise(); setTimeout(next, 1800); }); }, 700); };
    rods.forEach((b) => b.addEventListener('click', () => { if (!b.dataset.k) { tc++; b.dataset.k = tc; b.classList.add('seen'); SFX.pop(); const w = TENW[tc]; ctx.say(w, ctx.audioOf(w)); check(); } else { const w = TENW[+b.dataset.k]; ctx.say(w, ctx.audioOf(w)); } }));
    units.forEach((b) => b.addEventListener('click', () => { if (!b.dataset.k) { oc++; b.dataset.k = oc; b.classList.add('seen'); SFX.pop(); sayNum(oc, ctx); check(); } else sayNum(+b.dataset.k, ctx); }));
    popIn(all);
    if (k === 0) await ctx.instruct(game.say, game.audio);
    if (!all.length) check();
  }, ctx);
  ctx.replay = () => ctx.instruct(game.say, game.audio);
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(300); for (const b of all) { if (!b.classList.contains('seen')) b.click(); await sleep(60); } await sleep(1000); const g = $$('.m-opt', wrap).find((e) => e.dataset.v === String(cur.answer)); g && g.click(); await sleep(2000); } } };
};

export const TEMPLATES = { count, arith, compare, hop, pattern, rowpick, place };
