// قوالب كتاب «التربية الأخلاقية»: صح أم خطأ، صورة واختيار، صل الصورة بمكانها، ضع المتشابهات معاً، المتاهة، حديقة الأفعال الحسنة.
// على نهج games2.js: بلا مؤقت ولا خسارة، بعد محاولتين خاطئتين يلمع الجواب الصحيح ويُنطق، وكل عنصر يُلمس يتكلم.
import { gsap, $, $$, SFX, state, sleep, esc, shuffle, reshuffle } from '../core.js';
import { art, ART } from '../art.js';
import { draggable, shake, glowHint, popIn, burst, tw, TEMPLATES as CORE } from '../games.js';

const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const pic = (k) => (k && ART[k] ? art(k) : '');
function tries(ctx) {
  let wrong = 0;
  return { reset() { wrong = 0; }, miss(el, good, text) { wrong++; shake(el); ctx.encourage(); if (wrong >= 2 && good) { setTimeout(() => { glowHint(good); if (text) ctx.say(text, ctx.audioOf(text)); }, 700); wrong = 0; } } };
}
function rounds(n, run, ctx) {
  let i = 0, alive = true;
  const next = async () => { if (!alive) return; if (i >= n) { ctx.win(); return; } const k = i++; await run(k, next); };
  return { start: next, stop() { alive = false; }, get i() { return i; } };
}

const CSS = `
.eth{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;gap:12px}
.eth .tf-card{background:#fff;border-radius:24px;padding:10px 22px;font-size:clamp(28px,4.6vmin,40px);font-weight:700;line-height:1.9;box-shadow:0 5px 0 rgba(0,0,0,.08);max-width:min(94%,860px);text-align:center}
.eth .tf-row{display:flex;gap:28px;justify-content:center}
.eth .tf-btn{width:min(36vw,190px);height:min(30vw,130px);border-radius:28px;background:#fff;box-shadow:0 6px 0 rgba(0,0,0,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;border:5px solid transparent}
.eth .tf-btn b{font-family:sans-serif;font-size:min(13vw,64px);line-height:1}
.eth .tf-btn span{font-size:clamp(28px,4.4vmin,36px);font-weight:700;line-height:1.5}
.eth .tf-yes b{color:#2f9e44}.eth .tf-no b{color:#e03131}
.eth .tf-btn.ok{border-color:#40c057;background:#ebfbee}
.eth .pc-pic{width:min(46vw,30vh,250px);height:min(46vw,30vh,250px);background:#fff;border-radius:28px;box-shadow:0 5px 0 rgba(0,0,0,.08);padding:6px;display:flex}
.eth .pc-pic svg{width:100%;height:100%}
.eth .pc-q{font-size:clamp(28px,4.6vmin,40px);font-weight:700;line-height:1.8;text-align:center;max-width:94%}
.eth .opts .opt .opic{width:min(24vw,19vh,140px);height:min(24vw,19vh,140px)}
.eth .pm-pics{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.eth .pm-place{width:min(27vw,24vh,170px);height:min(27vw,24vh,170px);background:#fff;border-radius:26px;box-shadow:0 5px 0 rgba(0,0,0,.08);border:4px dashed transparent;display:flex;padding:8px;transition:transform .2s}
.eth .pm-place svg{width:100%;height:100%}
.eth .pm-place.near{border-color:var(--c2);transform:scale(1.05)}.eth .pm-place.ok{border-color:#40c057;border-style:solid;background:#ebfbee}
.eth .pm-item{width:min(30vw,22vh,150px);height:min(30vw,22vh,150px);background:#fff;border-radius:26px;border:4px solid color-mix(in srgb,var(--c2) 50%,#fff);box-shadow:0 6px 0 color-mix(in srgb,var(--c2) 45%,#fff);display:flex;padding:8px;touch-action:none;cursor:grab;position:relative;z-index:3}
.eth .pm-item svg{width:100%;height:100%}
.eth .sm-bins{display:flex;gap:12px;justify-content:center;width:100%}
.eth .sm-bin{flex:1;max-width:240px;min-height:min(30vh,170px);background:#fff;border-radius:26px;border:4px dashed color-mix(in srgb,var(--c2) 50%,#fff);display:flex;flex-direction:column;align-items:center;padding:6px;transition:transform .2s}
.eth .sm-bin.near{border-color:var(--c1);transform:scale(1.04)}
.eth .sm-bin .sm-sample{width:min(22vw,14vh,96px);height:min(22vw,14vh,96px)}
.eth .sm-bin .sm-in{display:flex;flex-wrap:wrap;justify-content:center;gap:2px}
.eth .sm-bin .sm-in svg{width:min(9vw,6vh,40px);height:min(9vw,6vh,40px)}
.eth .mz-wrap{position:relative;width:min(92vw,58vh,520px);aspect-ratio:1;background:#fff;border-radius:24px;box-shadow:0 5px 0 rgba(0,0,0,.08);touch-action:none}
.eth .mz-wrap svg{position:absolute;inset:0;width:100%;height:100%}
.eth .gd-list{display:flex;flex-direction:column;gap:10px;width:min(96%,860px);overflow:auto}
.eth .gd-line{background:#fff;border-radius:22px;padding:6px 16px;font-size:clamp(28px,4.4vmin,38px);font-weight:600;line-height:1.8;box-shadow:0 4px 0 rgba(0,0,0,.07);text-align:right;display:flex;align-items:center;gap:10px}
.eth .gd-line .gd-pot{flex:none;width:56px;height:56px;border-radius:50%;background:#f4e3c3;display:flex;align-items:center;justify-content:center}
.eth .gd-line .gd-pot svg{width:52px;height:52px}
.eth .gd-line.seen{box-shadow:0 4px 0 #8ce99a}
.eth .vt-tree{position:relative;width:min(92vw,52vh,480px);aspect-ratio:1}
.eth .vt-tree>svg{position:absolute;inset:0;width:100%;height:100%}
.eth .vt-fruit{position:absolute;width:31%;aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;box-shadow:0 5px 0 rgba(0,0,0,.12);font-size:clamp(28px,4.4vmin,36px);font-weight:700;line-height:1.4;text-align:center;border:5px solid #e5484d;padding:4px}
.eth .vt-fruit.seen{background:#ffe3e3}
.eth .vt-motto{background:#fff;border-radius:22px;padding:4px 20px;font-size:clamp(28px,4.6vmin,40px);font-weight:700;line-height:1.8;box-shadow:0 5px 0 rgba(0,0,0,.08);border:4px solid #8ce99a}.eth .vt-motto.seen{background:#ebfbee}
.eth .rp-list{min-height:0;max-height:100%;justify-content:flex-start}.eth .rp-line{flex:none}.bk-ethics .eth .gd-list.rp-list{align-content:start;grid-auto-rows:max-content}.eth .rp-line{height:auto;min-height:max-content}.eth .rp-line::before{content:"";flex:none;width:0;height:56px}.eth .rp-line .rp-pic{flex:none;width:64px;height:64px;display:flex}.eth .rp-line .rp-pic svg{width:100%;height:100%}.eth .rp-line .gd-t span.on{color:var(--c1);text-decoration:underline}
@media (max-height:520px) and (orientation:landscape){.eth .vt-tree{width:min(80vw,560px);aspect-ratio:2/1}.eth .vt-fruit{width:auto;aspect-ratio:auto;min-width:64px;min-height:64px;padding:4px 18px;border-radius:40px;white-space:nowrap}}
@media (orientation:landscape){.eth.lr{flex-direction:row}.eth .pc-pic{width:min(36vw,40vh,250px);height:min(36vw,40vh,250px)}}
@media (max-height:520px){.eth .tf-btn{height:96px}.eth .pc-q{font-size:28px;line-height:1.5}.eth .tf-card{line-height:1.6;padding:4px 18px}}
`;
// عناوين دروس هذا الكتاب جمل قصيرة (لا حروف): عقدة الخريطة تتسع لها، داخل مجلد ethics/ وحده
const MAPCSS = `.bk-ethics .node{width:auto;min-width:104px;max-width:min(232px,46vw);height:auto;min-height:104px;border-radius:44px;padding:6px 14px}.bk-ethics .node .n-title{font-size:28px;line-height:1.45;white-space:normal;text-align:center}@media (max-height:520px){.bk-ethics .g-memory .mgrid{width:min(100%,560px,calc((100vh - 150px) * 1.9))}.bk-ethics .pboard{width:min(100%,560px,calc((100vh - 150px) * 1.5))}.bk-ethics .ppiece{width:min(28vw,150px,21vh)}.bk-ethics .g-read,.bk-ethics .eth .gd-list{display:grid;grid-template-columns:1fr 1fr;align-content:center;gap:8px}.bk-ethics .rline,.bk-ethics .eth .gd-line{line-height:1.5;padding:4px 14px}}.bk-ethics .st-title{white-space:normal;max-width:min(196px,48vw);text-align:center;line-height:1.5;display:block}`;
if (typeof location !== 'undefined' && /\/ethics\//.test(location.pathname) && typeof document !== 'undefined') document.documentElement.classList.add('bk-ethics');
if (typeof document !== 'undefined' && !document.getElementById('eth-css')) document.head.insertAdjacentHTML('beforeend', `<style id="eth-css">${CSS}${MAPCSS}</style>`);

/* 1) صح أم خطأ: يسمع الطفل الجملة ويختار ✓ أو ✗ (أنشطة «ضع علامة صح أو خطأ») */
const truefalse = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx), d = game.data;
  const box = h(`<div class="eth"><button class="tf-card tap" type="button"></button><div class="tf-row"></div></div>`); stage.appendChild(box);
  const cardEl = $('.tf-card', box), row = $('.tf-row', box); let cur = null, order = null, done = false;
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; done = false; cardEl.textContent = cur.text; row.innerHTML = '';
    order = reshuffle([true, false], order);
    const els = order.map((v) => { const b = h(`<button class="tf-btn tap ${v ? 'tf-yes' : 'tf-no'}" type="button" data-v="${v ? 1 : 0}"><b>${v ? '✓' : '✗'}</b><span>${esc(v ? d.yes : d.no)}</span></button>`); row.appendChild(b); return b; });
    const good = () => els.find((e) => (e.dataset.v === '1') === cur.ok);
    els.forEach((b) => b.addEventListener('click', () => {
      if (done) return; const v = b.dataset.v === '1';
      if (v === cur.ok) { done = true; b.classList.add('ok'); burst(b, '#69db7c'); ctx.praise(); setTimeout(next, 1500); }
      else { ctx.say(v ? d.yes : d.no, ctx.audioOf(v ? d.yes : d.no)); T.miss(b, good(), cur.ok ? d.yes : d.no); }
    }));
    popIn([cardEl, ...els]);
    if (k === 0) await ctx.instruct(game.say, game.audio); await sleep(150); ctx.say(cur.text, ctx.audioOf(cur.text));
  }, ctx);
  cardEl.addEventListener('click', () => cur && ctx.say(cur.text, ctx.audioOf(cur.text)));
  ctx.replay = () => cur && ctx.say(cur.text, ctx.audioOf(cur.text));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); const g = $$('.tf-btn', row).find((e) => (e.dataset.v === '1') === cur.ok); g && g.click(); await sleep(1700); } } };
};

/* 2) صورة وسؤال: صورة الموقف في الأعلى، والخيارات صور أو كلمات (حوّط الوجه، أفكر وأستكشف، اختر الصورة المناسبة) */
const picchoose = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const box = h(`<div class="eth"><div class="pc-top" style="display:flex;flex-direction:column;align-items:center;gap:6px"></div><div class="opts"></div></div>`); stage.appendChild(box);
  const top = $('.pc-top', box), wrap = $('.opts', box); let cur = null, order = null, done = false;
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; done = false; wrap.innerHTML = '';
    top.innerHTML = cur.art ? `<button class="pc-pic tap" type="button">${pic(cur.art)}</button>` : (cur.show ? `<button class="pc-q tap" type="button">${esc(cur.say)}</button>` : '');
    const tp = top.firstElementChild; if (tp) tp.addEventListener('click', () => ctx.say(cur.say, ctx.audioOf(cur.say)));
    const idx = reshuffle(cur.options.map((_, i) => i), order); order = idx;
    const els = idx.map((i) => { const o = cur.options[i]; const c = h(`<button class="opt tap" type="button" data-i="${i}">${o.art ? `<span class="opic" style="--sc:1">${pic(o.art)}</span>` : ''}${o.text ? `<span class="otxt">${esc(o.text)}</span>` : ''}</button>`); wrap.appendChild(c); return c; });
    const good = () => els.find((e) => +e.dataset.i === cur.answer);
    els.forEach((c) => c.addEventListener('click', () => {
      if (done) return; const o = cur.options[+c.dataset.i];
      if (+c.dataset.i === cur.answer) { done = true; c.classList.add('ok'); burst(c, '#69db7c'); ctx.praise(); setTimeout(next, 1500); }
      else { if (o.text) ctx.say(o.text, ctx.audioOf(o.text)); T.miss(c, good(), cur.say); }
    }));
    popIn([...(tp ? [tp] : []), ...els]);
    if (k === 0) await ctx.instruct(game.say, game.audio); await sleep(150); ctx.say(cur.say, ctx.audioOf(cur.say));
  }, ctx);
  ctx.replay = () => cur && ctx.say(cur.say, ctx.audioOf(cur.say));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); const g = $$('.opt', wrap).find((e) => +e.dataset.i === cur.answer); g && g.click(); await sleep(1700); } } };
};

/* 3) صل الصورة بمكانها: تُسحب صورة الشيء أو الشخص إلى صورة مكانه (أماكن الأشياء في البيت، أماكن العمل) */
const picmatch = (stage, game, ctx) => {
  const d = game.data, per = Math.min(4, Math.max(2, d.per || 3)), T = tries(ctx), all = d.pairs;
  const box = h(`<div class="eth"><div class="pm-pics"></div><div class="pm-dock" style="min-height:100px;display:flex;align-items:center"></div></div>`); stage.appendChild(box);
  const pics = $('.pm-pics', box), dock = $('.pm-dock', box); let order = null, item = null, goal = null;
  const R = rounds(all.length, async (k, next) => {
    T.reset(); pics.innerHTML = ''; dock.innerHTML = ''; goal = all[k];
    const others = shuffle(all.filter((x) => x !== goal)).slice(0, per - 1);
    order = reshuffle([goal, ...others].map((x) => all.indexOf(x)), order);
    order.forEach((i) => { const p = all[i]; const el = h(`<button class="pm-place tap" type="button" data-i="${i}">${pic(p.to)}</button>`); el.addEventListener('click', () => p.toSay && ctx.say(p.toSay, ctx.audioOf(p.toSay))); pics.appendChild(el); });
    item = h(`<div class="pm-item tap" role="button">${pic(goal.from)}</div>`); dock.appendChild(item);
    const gi = all.indexOf(goal);
    draggable(item, {
      targets: () => $$('.pm-place', pics), accept: (t) => +t.dataset.i === gi,
      onTap: () => ctx.say(goal.say, ctx.audioOf(goal.say)),
      onDrop: (t, ok) => {
        if (ok) { item.classList.add('done'); t.classList.add('ok'); tw(item, { opacity: 0, scale: 0.5, duration: 0.3 }); burst(t, '#69db7c'); ctx.praise(); setTimeout(next, 1400); }
        else T.miss(t, $(`.pm-place[data-i="${gi}"]`, pics), goal.say);
      },
    });
    popIn([...$$('.pm-place', pics), item]);
    if (k === 0) await ctx.instruct(game.say, game.audio); ctx.say(goal.say, ctx.audioOf(goal.say));
  }, ctx);
  ctx.replay = () => goal && ctx.say(goal.say, ctx.audioOf(goal.say));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < all.length; n++) { await sleep(400); item._dropOn($(`.pm-place[data-i="${all.indexOf(goal)}"]`, pics)); await sleep(1600); } } };
};

/* 4) ضع المتشابهات معاً: في كل سلّة صورة نموذج، ويضع الطفل كل صورة مع ما يشبهها (ص ١٦) */
const similar = (stage, game, ctx) => {
  const d = game.data, T = tries(ctx);
  const box = h(`<div class="eth"><div class="sm-bins"></div><div class="tray" style="min-height:110px;display:flex;align-items:center"></div></div>`); stage.appendChild(box);
  const bins = $('.sm-bins', box), tray = $('.tray', box);
  d.groups.forEach((g, i) => { const el = h(`<button class="sm-bin tap" type="button" data-b="${i}"><span class="sm-sample">${pic(g.sample)}</span><span class="sm-in"></span></button>`); el.addEventListener('click', () => g.say && ctx.say(g.say, ctx.audioOf(g.say))); bins.appendChild(el); });
  const items = shuffle(d.groups.flatMap((g, b) => g.items.map((a) => ({ art: a, b })))).slice(0, d.max || 6); let left = items.length;
  const showNext = () => {
    tray.innerHTML = ''; const it = items[items.length - left]; if (!it) return;
    const el = h(`<div class="pm-item tap" role="button">${pic(it.art)}</div>`); tray.appendChild(el); popIn(el);
    draggable(el, {
      targets: () => $$('.sm-bin', bins), accept: (t) => +t.dataset.b === it.b,
      onTap: () => { SFX.pop(); },
      onDrop: (t, ok) => { if (!ok) { T.miss(t, $(`.sm-bin[data-b="${it.b}"]`, bins)); return; }
        $('.sm-in', t).insertAdjacentHTML('beforeend', pic(it.art)); burst(t, '#69db7c'); SFX.good(); T.reset();
        left--; if (left === 0) { ctx.praise(); setTimeout(() => ctx.win(), 900); } else setTimeout(showNext, 450); },
    });
  };
  ctx.instruct(game.say, game.audio); popIn($$('.sm-bin', bins)); showNext();
  return { destroy() {}, auto: async () => { let guard = 0; while (left > 0 && guard++ < 30) { await sleep(300); const el = $('.pm-item', tray); if (!el || !el._dropOn) continue; const it = items[items.length - left]; el._dropOn($(`.sm-bin[data-b="${it.b}"]`, bins)); await sleep(650); } } };
};

/* 5) المتاهة: يسحب الطفل القلم في الممرات حتى يصل إلى صاحبه (ص ٣٠) */
const maze = (stage, game, ctx) => {
  const d = game.data, G = d.grid, N = G.length, C = 100 / N; // الشبكة: '#' جدار، '.' ممر، 'S' بداية، 'E' نهاية
  let sr = 0, sc = 0, er = 0, ec = 0; G.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'S') { sr = r; sc = c; } if (ch === 'E') { er = r; ec = c; } }));
  const open = (r, c) => r >= 0 && c >= 0 && r < N && c < N && G[r][c] !== '#';
  const walls = G.flatMap((row, r) => [...row].map((ch, c) => (ch === '#' ? `<rect x="${c * C}" y="${r * C}" width="${C}" height="${C}" rx="1.5" fill="#495057"/>` : ''))).join('');
  const box = h(`<div class="eth"><div class="mz-wrap"><svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff9db"/>${walls}<path class="mz-trail" d="" fill="none" stroke="#ffd43b" stroke-width="${C * 0.42}" stroke-linecap="round" stroke-linejoin="round"/><g class="mz-goal" transform="translate(${ec * C} ${er * C}) scale(${C / 100})">${ART[d.goal] ? ART[d.goal]() : ''}</g><g class="mz-pen"><g transform="scale(${C / 100})">${ART[d.pen] ? ART[d.pen]() : ''}</g></g></svg></div></div>`);
  stage.appendChild(box);
  const wrap = $('.mz-wrap', box), svg = $('svg', box), pen = $('.mz-pen', box), trail = $('.mz-trail', box);
  let r = sr, c = sc, path = [[r, c]], active = false, won = false;
  const place = () => { pen.setAttribute('transform', `translate(${c * C} ${r * C})`); trail.setAttribute('d', path.map(([a, b], i) => `${i ? 'L' : 'M'}${b * C + C / 2} ${a * C + C / 2}`).join('')); };
  const step = (nr, nc) => {
    if (!open(nr, nc) || Math.abs(nr - r) + Math.abs(nc - c) !== 1) return false;
    const back = path.length > 1 && path[path.length - 2][0] === nr && path[path.length - 2][1] === nc;
    if (back) path.pop(); else path.push([nr, nc]);
    r = nr; c = nc; place(); if (Math.random() < 0.3) SFX.paint();
    if (r === er && c === ec && !won) { won = true; SFX.star(); burst(wrap, '#ffd43b', 20); ctx.praise(); setTimeout(() => ctx.win(), 1000); }
    return true;
  };
  const toCell = (e) => { const m = svg.getScreenCTM().inverse(), p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m); return [Math.floor(p.y / C), Math.floor(p.x / C)]; };
  wrap.addEventListener('pointerdown', (e) => { e.preventDefault(); if (won) return; const [a, b] = toCell(e); if (Math.abs(a - r) + Math.abs(b - c) <= 1) { active = true; try { wrap.setPointerCapture(e.pointerId); } catch (_) {} step(a, b); } else { SFX.soft(); glowHint(pen); } });
  wrap.addEventListener('pointermove', (e) => { if (!active || won) return; const [a, b] = toCell(e); if (a === r && b === c) return; if (!step(a, b)) { // نقلة قطرية أو بعيدة: نحاول خطوة أفقية أو عمودية نحو الإصبع
      if (a !== r && open(r + Math.sign(a - r), c)) step(r + Math.sign(a - r), c); else if (b !== c && open(r, c + Math.sign(b - c))) step(r, c + Math.sign(b - c)); } });
  const up = () => { active = false; }; wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  $('.mz-goal', box).addEventListener('click', () => d.goalSay && ctx.say(d.goalSay, ctx.audioOf(d.goalSay)));
  place(); popIn(wrap); ctx.instruct(game.say, game.audio);
  // أقصر طريق (للحل الآلي وللمساعدة)
  const solve = () => { const q = [[r, c]], prev = new Map([[r + ',' + c, null]]); while (q.length) { const [a, b] = q.shift(); if (a === er && b === ec) break; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([x, y]) => { const k = a + x + ',' + (b + y); if (open(a + x, b + y) && !prev.has(k)) { prev.set(k, [a, b]); q.push([a + x, b + y]); } }); } const out = []; let k = [er, ec]; while (k) { out.unshift(k); k = prev.get(k[0] + ',' + k[1]); } return out.slice(1); };
  return { destroy() {}, auto: async () => { for (const [a, b] of solve()) { step(a, b); await sleep(60); } } };
};

/* 6) حديقة الأفعال الحسنة: يلمس الطفل كل فعل فيسمعه وتنبت وردة بجانبه (ص ٧٣) */
const garden = (stage, game, ctx) => {
  const d = game.data; const heard = new Set();
  const box = h(`<div class="eth"><div class="gd-list"></div></div>`); stage.appendChild(box); const list = $('.gd-list', box);
  d.items.forEach((s, i) => {
    const el = h(`<button class="gd-line tap" type="button"><span class="gd-pot"></span><span class="gd-t">${esc(s.text)}</span></button>`); list.appendChild(el);
    el.addEventListener('click', () => {
      ctx.say(s.text, ctx.audioOf(s.text)); const pot = $('.gd-pot', el);
      if (!heard.has(i)) { heard.add(i); el.classList.add('seen'); pot.innerHTML = pic(d.flower); SFX.pop(); if (!state.reduced) gsap.fromTo(pot.firstElementChild, { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.6, ease: 'back.out(2)' }); if (heard.size === d.items.length) setTimeout(() => { burst(list, '#ff8fab', 20); ctx.win(); }, 1800); }
    });
  });
  popIn($$('.gd-line', box)); ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const l of $$('.gd-line', box)) { l.click(); await sleep(150); } } };
};

/* 7) شجرة القيم: ثمار الشجرة تحمل القيم، يلمسها الطفل فيسمعها وتتلوّن (ص ٣٧) */
const valuetree = (stage, game, ctx) => {
  const d = game.data; const heard = new Set();
  const spots = [[26, 32], [74, 32], [50, 18], [50, 52], [24, 62], [76, 62]];
  const crown = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M44 98L46 60H54L56 98Z" fill="#a8743f" stroke="#4a3426" stroke-width="1.6"/><path d="M50 4C76 4 98 22 94 46C98 68 76 80 50 74C24 80 2 68 6 46C2 22 24 4 50 4Z" fill="#8ce99a" stroke="#4a3426" stroke-width="1.6"/></svg>`;
  const box = h(`<div class="eth">${d.motto ? `<button class="vt-motto tap" type="button">${esc(d.motto.text)}</button>` : ''}<div class="vt-tree">${crown}</div></div>`); stage.appendChild(box); const tree = $('.vt-tree', box);
  const all = d.items.length + (d.motto ? 1 : 0);
  if (d.motto) { const m = $('.vt-motto', box); m.addEventListener('click', () => { ctx.say(d.motto.text, d.motto.audio || ctx.audioOf(d.motto.text)); if (!heard.has('m')) { heard.add('m'); m.classList.add('seen'); SFX.pop(); if (heard.size === all) setTimeout(() => { burst(tree, '#e5484d', 20); ctx.win(); }, 1600); } }); }
  d.items.forEach((s, i) => {
    const [x, y] = spots[i % spots.length];
    const el = h(`<button class="vt-fruit tap" type="button" style="left:${x}%;top:${y}%">${esc(s.text)}</button>`); tree.appendChild(el); gsap.set(el, { xPercent: -50, yPercent: -50 });
    el.addEventListener('click', () => { ctx.say(s.text, ctx.audioOf(s.text)); if (!state.reduced) gsap.fromTo(el, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' }); if (!heard.has(i)) { heard.add(i); el.classList.add('seen'); SFX.pop(); if (heard.size === all) setTimeout(() => { burst(tree, '#e5484d', 20); ctx.win(); }, 1600); } });
  });
  popIn($$('.vt-fruit, .vt-motto', box)); ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const l of $$('.vt-fruit, .vt-motto', box)) { l.click(); await sleep(150); } } };
};

// «رتّب الحروف» بقطع لكل كلمة: قالب build نفسه، لكن تُعرض في كل جولة حروف الكلمة وما يكمّلها من حروف الكتاب حتى d.per قطعة
// (سبع قطع لا تتسع لها شاشة الهاتف الأفقية).
const buildw = (stage, game, ctx) => {
  const d = game.data, all = d.pieces;
  const data = { ...d, get pieces() {
    const need = [...new Set($$('.g-build .slot', stage).map((s) => s.dataset.p))];
    return need.concat(all.filter((p) => !need.includes(p))).slice(0, Math.max(need.length, d.per || 5));
  } };
  return CORE.build(stage, { ...game, data }, ctx);
};

/* 8) اسمع وردّد بالصور: جمل الكتاب، وبعضها مع صورته (كلام الشخصيات، المفردات)؛ يلمس الطفل السطر فيسمعه وتتلوّن كلماته. بلا تقييم. */
const readpics = (stage, game, ctx) => {
  const S = game.data.sentences; const heard = new Set();
  const box = h(`<div class="eth"><div class="gd-list rp-list"></div></div>`); stage.appendChild(box); const list = $('.gd-list', box);
  S.forEach((s, i) => {
    const el = h(`<button class="gd-line rp-line tap" type="button">${s.art ? `<span class="rp-pic">${pic(s.art)}</span>` : ''}<span class="gd-t">${s.text.split(/\s+/).map((w) => `<span>${esc(w)}</span>`).join(' ')}</span></button>`); list.appendChild(el);
    el.addEventListener('click', () => {
      const sp = $$('.gd-t span', el); $$('.rp-line .gd-t span.on', box).forEach((x) => x.classList.remove('on'));
      ctx.say(s.text, s.audio || ctx.audioOf(s.text)).then(() => sp.forEach((x) => x.classList.remove('on')));
      sp.forEach((x, k) => setTimeout(() => { sp.forEach((y) => y.classList.remove('on')); x.classList.add('on'); }, k * 620));
      if (!heard.has(i)) { heard.add(i); el.classList.add('seen'); if (heard.size === S.length) setTimeout(() => ctx.win(), sp.length * 620 + 600); }
    });
  });
  popIn($$('.gd-line', box)); ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const l of $$('.gd-line', box)) { l.click(); await sleep(150); } } };
};

export const TEMPLATES = { truefalse, picchoose, picmatch, similar, maze, garden, valuetree, buildw, readpics };
