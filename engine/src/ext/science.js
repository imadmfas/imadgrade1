// قوالب كتاب العلوم: اِلْمَسْ وَاسْمَعْ (look)، أين الجزء؟ (spot)، أصنع مخلوطاً (mix)، يطفو أم يغطس (water)
import { gsap, $, $$, SFX, state, sleep, esc, shuffle, reshuffle } from '../core.js';
import { art, ART } from '../art.js';
import { draggable, shake, glowHint, popIn, burst, tw } from '../games.js';

const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const pic = (k) => (k && ART[k] ? art(k) : '');
function tries(ctx) {
  let wrong = 0;
  return { reset() { wrong = 0; }, miss(el, good, text) { wrong++; shake(el); ctx.encourage(); if (wrong >= 2 && good) { setTimeout(() => { glowHint(good); if (text) ctx.say(text, ctx.audioOf(text)); }, 700); wrong = 0; } } };
}
const speak = (ctx, t) => t && ctx.say(t, ctx.audioOf(t));
const bounce = (el) => { if (!state.reduced) gsap.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' }); };

const STYLE = `<style id="sci-css">
.s-look{width:100%;height:100%;display:flex;overflow:auto}
.s-look .lgrid{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-content:center;max-width:980px;margin:auto}
.g-order .piece svg,.g-order .oslot svg{width:min(19vw,12vh,120px);height:min(19vw,12vh,120px)}.g-order .piece{padding:4px 8px}.g-order .oslot{min-width:calc(min(19vw,12vh,120px) + 24px);width:auto;height:auto;min-height:calc(min(19vw,12vh,120px) + 16px);padding:4px}
.s-card{position:relative;background:#fff;border-radius:24px;box-shadow:0 5px 0 rgba(0,0,0,.08);border:4px solid transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 12px;min-width:120px;max-width:min(43vw,300px)}@media (max-width:520px){.s-look .lgrid{gap:8px}.s-card{padding:6px 8px}}
.s-card .lp{width:min(22vw,17vh,130px);height:min(22vw,17vh,130px)}.s-card .lp svg{width:100%;height:100%}
.s-card .lt{font-size:clamp(28px,4.4vmin,36px);font-weight:700;line-height:1.6;text-align:center}
.s-card.seen{border-color:#8ce99a}.s-card .tick{position:absolute;top:4px;left:8px;color:#2f9e44;font-style:normal;font-size:26px;opacity:0}.s-card.seen .tick{opacity:1}
.s-card.noart{min-height:96px}
.s-spot{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.s-spot .sbox{width:min(100%,92vh,620px);max-height:100%;aspect-ratio:1;background:#fff;border-radius:26px;box-shadow:0 5px 0 rgba(0,0,0,.08);padding:8px}
.s-spot .sbox.wide{aspect-ratio:400/260;width:min(100%,140vh,760px)}
.s-spot svg{width:100%;height:100%;display:block}
.s-spot [data-k]{cursor:pointer}.s-spot .hit{fill:transparent}
.s-spot [data-k].ok{filter:drop-shadow(0 0 4px #40c057) drop-shadow(0 0 2px #40c057)}
.s-spot .hint,.s-spot [data-k].hint{animation:sglow .5s ease-in-out 4 alternate}
@keyframes sglow{to{filter:drop-shadow(0 0 7px #ffd43b) drop-shadow(0 0 4px #ffd43b)}}
.s-mix,.s-water{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-around;gap:8px}
.s-mix .bowl{position:relative;width:min(60vw,34vh,260px);aspect-ratio:1.4;border-radius:0 0 50% 50%/0 0 80% 80%;background:color-mix(in srgb,#d0ebff 70%,#fff);border:5px solid #74c0fc;border-top-width:10px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:2px;padding:6px 14px;transition:transform .2s}
.s-mix .bowl.near{transform:scale(1.06);border-color:var(--c1)}
.s-mix .bowl .bit{width:min(13vw,7vh,52px);height:min(13vw,7vh,52px)}.s-mix .bowl .bit svg{width:100%;height:100%}
.s-mix .row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;min-height:100px;align-items:center}
.s-chip{background:#fff;border-radius:22px;padding:4px 10px;box-shadow:0 6px 0 color-mix(in srgb,var(--c2) 45%,#fff);border:4px solid color-mix(in srgb,var(--c2) 50%,#fff);touch-action:none;cursor:grab;min-width:96px;min-height:96px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:3}
.s-chip svg{width:min(18vw,max(9vh,50px),74px);height:min(18vw,max(9vh,50px),74px)}.s-chip .ct{font-size:clamp(26px,4vmin,32px);font-weight:700;line-height:1.5}
.s-chip.drag{z-index:50;box-shadow:0 14px 30px rgba(0,0,0,.2)}
.s-plate{width:min(27vw,15vh,130px);aspect-ratio:1;border-radius:50%;background:#fff;border:5px dashed #ced4da;display:flex;align-items:center;justify-content:center;transition:transform .2s}
.s-plate svg{width:72%;height:72%;opacity:.35}.s-plate.near{transform:scale(1.08);border-color:var(--c1)}.s-plate.full{border-style:solid;border-color:#40c057}.s-plate.full svg{opacity:1}
.s-water .tank{position:relative;width:min(92vw,105vh,560px);aspect-ratio:2.1;border:6px solid #74c0fc;border-top:none;border-radius:0 0 26px 26px;background:linear-gradient(#fff 0 16%,#a5d8ff 16% 100%);display:flex;flex-direction:column}
.s-water .zone{flex:1;display:flex;align-items:center;gap:6px;padding:0 10px;border:4px dashed transparent;border-radius:18px;margin:4px;transition:transform .2s}
.s-water .zone.near{border-color:var(--c1);transform:scale(1.02)}
.s-water .zl{font-size:clamp(28px,4.2vmin,34px);font-weight:700;color:#1864ab;background:rgba(255,255,255,.85);border-radius:14px;padding:0 12px;line-height:1.6;min-height:64px;display:flex;align-items:center}
.s-water .zin{display:flex;gap:4px;flex-wrap:wrap}.s-water .zin svg{width:min(10vw,8vh,54px);height:min(10vw,8vh,54px)}
.s-water .tray{min-height:120px;display:flex;align-items:center}
@media (orientation:portrait){.s-water .tank{aspect-ratio:1.2}}
@media (max-height:520px){.s-water{flex-direction:row}.s-water .tank{width:min(64vw,110vh,560px)}.s-mix{flex-direction:row;flex-wrap:wrap}.s-mix .plates{order:3;width:100%;min-height:0}}
</style>`;
if (typeof document !== 'undefined' && !document.getElementById('sci-css')) document.head.insertAdjacentHTML('beforeend', STYLE);
// عناوين دروس العلوم جمل طويلة: عقدة الخريطة تصير بطاقة مستديرة بعنوان أصغر (في كتاب العلوم وحده)
if (typeof document !== 'undefined' && /\/science\//.test(location.pathname) && !document.getElementById('sci-map')) document.head.insertAdjacentHTML('beforeend', `<style id="sci-map">#road .node{width:min(236px,58vw);height:auto;min-height:104px;border-radius:32px;padding:8px 10px;gap:2px}#road .n-title{color:#fff;font-size:28px;line-height:1.45;text-align:center}#road .n-stars{font-size:18px}.g-sort .sitem svg{width:min(24vw,13vh,110px);height:min(24vw,13vh,110px)}.g-choose .opt .opic{width:min(26vw,20vh,170px);height:min(26vw,20vh,170px)}</style>`);

/* 1) اِلْمَسْ وَاسْمَعْ: بطاقات صور وكلمات، كل بطاقة تنطق اسمها */
const look = (stage, game, ctx) => {
  const items = game.data.items.map((v) => ctx.item(v));
  const box = h(`<div class="s-look"><div class="lgrid"></div></div>`); stage.appendChild(box);
  const grid = $('.lgrid', box), seen = new Set();
  items.forEach((it) => {
    const c = h(`<button class="s-card tap${it.art ? '' : ' noart'}" type="button">${it.art ? `<span class="lp">${pic(it.art)}</span>` : ''}<span class="lt">${esc(it.value)}</span><i class="tick">✓</i></button>`);
    c.addEventListener('click', () => {
      SFX.pop(); ctx.say(it.value, it.audio); bounce(c);
      if (!seen.has(it.value)) { seen.add(it.value); c.classList.add('seen'); if (seen.size === items.length) setTimeout(() => ctx.win(), 900); }
    });
    grid.appendChild(c);
  });
  popIn($$('.s-card', grid), 0.2); ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const c of $$('.s-card', grid)) { c.click(); await sleep(250); } } };
};

/* 2) أين الجزء؟ رسم واحد بأجزاء تُلمس (diagram) أو مشهد بعناصر (scene).
   كل جزء ينطق اسمه عند لمسه، والراوي يطلب جزءاً في كل جولة. */
const spot = (stage, game, ctx) => {
  const d = game.data, T = tries(ctx), names = d.parts; // {k: text}
  const wide = !!d.scene;
  const box = h(`<div class="s-spot"><div class="sbox${wide ? ' wide' : ''}"></div></div>`); stage.appendChild(box);
  const sb = $('.sbox', box);
  let slots = d.scene ? d.scene.items.map((it) => ({ x: it.x, y: it.y, w: it.w })) : null, order = null;
  const draw = () => {
    if (!d.scene) { sb.innerHTML = art(d.art); return; }
    // المشهد: تتبدّل أماكن العناصر في كل جولة
    order = reshuffle(d.scene.items.map((_, i) => i), order);
    const bg = { sky: '#cfeefe', ground: '#a8e6a1', ...(d.scene.bg || {}) };
    sb.innerHTML = `<svg viewBox="0 0 400 260" aria-hidden="true"><rect width="400" height="260" fill="${bg.sky}"/><path d="M0 150 Q100 132 200 148 T400 142 V260 H0Z" fill="${bg.ground}"/>${d.scene.items.map((it, i) => { const s = slots[order[i]]; return `<g data-k="${esc(it.k)}" transform="translate(${s.x} ${s.y}) scale(${s.w / 100})"><rect class="hit" width="100" height="100"/>${ART[it.art] ? ART[it.art]() : ''}</g>`; }).join('')}</svg>`;
  };
  let target = null, done = false;
  const els = (k) => $$(`[data-k="${CSS.escape(k)}"]`, sb);
  const wire = () => {
    $$('[data-k]', sb).forEach((g) => g.addEventListener('click', (e) => {
      e.stopPropagation(); if (done) return; const k = g.dataset.k; SFX.pop();
      if (!state.reduced) gsap.fromTo(els(k), { y: 0 }, { y: -4, yoyo: true, repeat: 1, duration: 0.18 });
      if (k === target) { done = true; els(k).forEach((x) => x.classList.add('ok')); burst(g, '#69db7c'); ctx.say(names[k], ctx.audioOf(names[k])).then(() => ctx.praise()); setTimeout(next, 2300); }
      else { speak(ctx, names[k]); T.miss(g, els(target)[0], names[target]); }
    }));
  };
  let i = 0, alive = true;
  const R = d.rounds;
  const next = async () => {
    if (!alive) return; if (i >= R.length) { ctx.win(); return; }
    target = R[i++]; done = false; T.reset(); draw(); wire();
    if (i === 1) { popIn(sb); await ctx.instruct(game.say, game.audio); }
    await sleep(200); speak(ctx, names[target]);
  };
  ctx.replay = () => target && speak(ctx, names[target]);
  next();
  return { destroy() { alive = false; }, auto: async () => { for (let n = 0; n < R.length; n++) { await sleep(500); const g = els(target)[0]; g && g.dispatchEvent(new MouseEvent('click', { bubbles: true })); await sleep(2500); } } };
};

/* 3) أصنع مخلوطاً: أسحب المواد إلى الإناء فتختلط، ثم أفصلها باليد كلّاً إلى صحنه */
const mix = (stage, game, ctx) => {
  const d = game.data, T = tries(ctx), items = d.items.map((v) => ctx.item(v));
  const box = h(`<div class="s-mix"><div class="row plates"></div><div class="bowl tap" role="button"></div><div class="row tray"></div></div>`); stage.appendChild(box);
  const bowl = $('.bowl', box), tray = $('.tray', box), plates = $('.plates', box);
  bowl.addEventListener('click', () => speak(ctx, bowl.dataset.full ? d.result : d.bowl));
  let phase = 1, left = items.length;
  const chip = (it, i) => { const c = h(`<div class="s-chip tap" role="button" data-i="${i}">${pic(it.art)}<span class="ct">${esc(it.value)}</span></div>`); return c; };
  // المرحلة الأولى: الخلط
  items.forEach((it, i) => {
    const c = chip(it, i); tray.appendChild(c);
    draggable(c, { targets: () => [bowl], accept: () => true, onTap: () => speak(ctx, it.value),
      onDrop: (t, ok) => { if (!ok) return; c.remove(); speak(ctx, it.value); for (let k = 0; k < 3; k++) bowl.insertAdjacentHTML('beforeend', `<span class="bit" data-i="${i}">${pic(it.art)}</span>`); burst(bowl, '#ffd43b');
        if (--left === 0) setTimeout(mixed, 700); } });
  });
  const mixed = () => {
    bowl.dataset.full = '1'; const bits = shuffle($$('.bit', bowl)); bits.forEach((b) => bowl.appendChild(b));
    if (!state.reduced) gsap.fromTo(bowl, { rotation: -6 }, { rotation: 0, duration: 0.8, ease: 'elastic.out(1,0.3)' });
    SFX.good(); ctx.say(d.result, ctx.audioOf(d.result)).then(() => setTimeout(separate, 400));
  };
  // المرحلة الثانية: الفصل باليد
  const separate = async () => {
    phase = 2; left = items.length; bowl.innerHTML = '';
    reshuffle(items.map((_, i) => i)).forEach((i) => plates.appendChild(h(`<div class="s-plate" data-i="${i}">${pic(items[i].art)}</div>`)));
    reshuffle(items.map((_, i) => i)).forEach((i) => {
      const it = items[i], c = chip(it, i); c.querySelector('.ct').remove(); bowl.appendChild(c);
      draggable(c, { targets: () => $$('.s-plate:not(.full)', plates), accept: (t) => +t.dataset.i === i, onTap: () => speak(ctx, it.value),
        onDrop: (t, ok) => { if (!ok) { T.miss(t, $(`.s-plate[data-i="${i}"]`, plates), it.value); return; }
          T.reset(); t.classList.add('full'); c.remove(); speak(ctx, it.value); burst(t, '#69db7c');
          if (--left === 0) { ctx.praise(); setTimeout(() => ctx.win(), 1200); } } });
    });
    popIn([...$$('.s-plate', plates), ...$$('.s-chip', bowl)]);
    await ctx.instruct(d.say2, ctx.audioOf(d.say2));
  };
  popIn([bowl, ...$$('.s-chip', tray)]); ctx.instruct(game.say, game.audio);
  ctx.replay = () => (phase === 1 ? ctx.instruct(game.say, game.audio) : ctx.instruct(d.say2, ctx.audioOf(d.say2)));
  return { destroy() {}, auto: async () => {
    for (const c of $$('.s-chip', tray)) { c._dropOn(bowl); await sleep(300); }
    for (let g = 0; g < 40 && phase !== 2; g++) await sleep(200);
    await sleep(600);
    for (const c of $$('.s-chip', bowl)) { c._dropOn($(`.s-plate[data-i="${c.dataset.i}"]`, plates)); await sleep(300); }
  } };
};

/* 4) يطفو أم يغطس: أسحب الشيء إلى سطح الماء أو إلى قاع الحوض */
const water = (stage, game, ctx) => {
  const d = game.data, T = tries(ctx);
  const items = shuffle(d.items).slice(0, 6).map((x) => ({ ...ctx.item(x.value), floats: x.floats }));
  const box = h(`<div class="s-water"><div class="tank"><div class="zone tap" data-z="1" role="button"><span class="zl">${esc(d.float)}</span><span class="zin"></span></div><div class="zone tap" data-z="0" role="button"><span class="zl">${esc(d.sink)}</span><span class="zin"></span></div></div><div class="tray"></div></div>`);
  stage.appendChild(box);
  const tray = $('.tray', box), zones = $$('.zone', box);
  zones.forEach((z) => z.addEventListener('click', () => speak(ctx, z.dataset.z === '1' ? d.float : d.sink)));
  let k = 0;
  const show = () => {
    tray.innerHTML = ''; const it = items[k]; if (!it) return;
    const c = h(`<div class="s-chip tap" role="button">${pic(it.art)}<span class="ct">${esc(it.value)}</span></div>`); tray.appendChild(c); popIn(c); speak(ctx, it.value);
    const want = it.floats ? '1' : '0', good = () => zones.find((z) => z.dataset.z === want);
    draggable(c, { targets: () => zones, accept: (t) => t.dataset.z === want, onTap: () => speak(ctx, it.value),
      onDrop: (t, ok) => { if (!ok) { T.miss(t, good(), want === '1' ? d.float : d.sink); return; }
        T.reset(); $('.zin', t).insertAdjacentHTML('beforeend', pic(it.art)); const last = $('.zin', t).lastElementChild;
        if (!state.reduced && last) gsap.fromTo(last, { y: want === '1' ? -30 : -60, opacity: 0 }, { y: 0, opacity: 1, duration: want === '1' ? 0.6 : 1.1, ease: want === '1' ? 'bounce.out' : 'power1.in' });
        burst(t, '#69db7c'); SFX.good(); k++;
        if (k >= items.length) { tray.innerHTML = ''; ctx.praise(); setTimeout(() => ctx.win(), 1100); } else setTimeout(show, 600); } });
  };
  ctx.instruct(game.say, game.audio).then(() => {}); show();
  return { destroy() {}, auto: async () => { let g = 0; while (k < items.length && g++ < 40) { await sleep(400); const c = $('.s-chip', tray); if (!c || !c._dropOn) continue; c._dropOn(zones.find((z) => z.dataset.z === (items[k].floats ? '1' : '0'))); await sleep(800); } } };
};

export const TEMPLATES = { look, spot, mix, water };
