// قوالب إضافية: اسمع واختر، القطار، بطاقات الذاكرة، التصنيف، الترتيب، أكمل الكلمة، الأحجية، المشهد، اقرأ معي، صفحة النشيد
import { gsap, $, $$, SFX, state, sleep, esc, shuffle, reshuffle } from './core.js';
import { art, ART } from './art.js';
import { draggable, shake, glowHint, popIn, burst, tw } from './games.js';

const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const pic = (o) => (o.art && ART[o.art] ? art(o.art) : '');
function tries(ctx) {
  let wrong = 0;
  return { reset() { wrong = 0; }, miss(el, good, text) { wrong++; shake(el); ctx.encourage(); if (wrong >= 2 && good) { setTimeout(() => { glowHint(good); if (text) ctx.say(text, ctx.audioOf(text)); }, 700); wrong = 0; } } };
}
function rounds(n, run, ctx) {
  let i = 0, alive = true;
  const next = async () => { if (!alive) return; if (i >= n) { ctx.win(); return; } const k = i++; await run(k, next); };
  return { start: next, stop() { alive = false; }, get i() { return i; } };
}
const card = (o, cls = '') => h(`<button class="opt tap ${cls}" type="button">${o.art ? `<span class="opic" style="--sc:${o.scale || 1}">${pic(o)}</span>` : ''}${o.text ? `<span class="otxt">${esc(o.text)}</span>` : ''}</button>`);

/* 1) اسمع واختر: صوت واحد وخيارات من 2 إلى 4 (صور أو كلمات) */
const choose = (stage, game, ctx, opts = {}) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const box = h(`<div class="g-choose">${opts.top || ''}<div class="opts"></div></div>`); stage.appendChild(box);
  const wrap = $('.opts', box); let order = null, cur = null;
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; wrap.innerHTML = '';
    const idx = reshuffle(cur.options.map((_, i) => i), order); order = idx;
    const els = idx.map((i) => { const c = card(cur.options[i]); c.dataset.i = i; wrap.appendChild(c); return c; });
    const good = () => els.find((e) => +e.dataset.i === cur.answer);
    els.forEach((c) => c.addEventListener('click', () => {
      if (c.classList.contains('ok') || wrap.dataset.done === '1') return;
      const o = cur.options[+c.dataset.i];
      if (+c.dataset.i === cur.answer) { wrap.dataset.done = '1'; c.classList.add('ok'); burst(c, '#69db7c'); ctx.praise(); opts.onGood && opts.onGood(k); setTimeout(() => { wrap.dataset.done = ''; next(); }, 1500); }
      else { if (o.text) ctx.say(o.text, ctx.audioOf(o.text)); T.miss(c, good(), cur.say); }
    }));
    popIn(els);
    if (k === 0) await ctx.instruct(game.say, game.audio); await sleep(150); ctx.say(cur.say, ctx.audioOf(cur.say));
  }, ctx);
  ctx.replay = () => cur && ctx.say(cur.say, ctx.audioOf(cur.say));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); const g = $$('.opt', wrap).find((e) => +e.dataset.i === cur.answer); g && g.click(); await sleep(1700); } } };
};

/* 2) القطار: كل إجابة صحيحة تضيف عربة وتحرك القطار نحو المحطة */
const train = (stage, game, ctx) => {
  const n = game.data.rounds.length;
  const top = `<div class="train-track"><div class="station">🏁</div><div class="train"><span class="loco">🚂</span></div></div>`;
  let api;
  api = choose(stage, game, ctx, { top, onGood: (k) => {
    const t = $('.train', stage); t.insertAdjacentHTML('beforeend', `<span class="wagon" style="--c:${['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#b197fc'][k % 5]}"></span>`);
    SFX.hop(); tw(t, { x: -((k + 1) / n) * Math.min(stage.clientWidth * 0.55, 420), duration: 0.9, ease: 'power2.out' });
  } });
  return api;
};

/* 3) بطاقات الذاكرة: صورة وكلمتها، من 4 إلى 8 بطاقات */
const memory = (stage, game, ctx) => {
  const pairs = game.data.pairs.slice(0, 4);
  const cards = shuffle(pairs.flatMap((p, i) => [{ i, art: p.art }, { i, text: p.text }]));
  const box = h(`<div class="g-memory"><div class="mgrid" style="--cols:${cards.length > 6 ? 4 : 3}"></div></div>`); stage.appendChild(box);
  const grid = $('.mgrid', box); let open = [], done = 0, lock = false;
  cards.forEach((c) => {
    const el = h(`<button class="mcard tap" type="button"><span class="back">⭐</span><span class="face">${c.art ? pic(c) : `<span class="otxt">${esc(c.text)}</span>`}</span></button>`);
    el.dataset.i = c.i; grid.appendChild(el);
    el.addEventListener('click', () => {
      if (lock || el.classList.contains('up')) return;
      el.classList.add('up'); SFX.click(); const p = pairs[c.i]; ctx.say(p.text, ctx.audioOf(p.text)); open.push(el);
      if (open.length === 2) {
        lock = true; const [a, b] = open; open = [];
        if (a.dataset.i === b.dataset.i) { setTimeout(() => { a.classList.add('ok'); b.classList.add('ok'); burst(b, '#ffd43b'); SFX.good(); done++; lock = false; if (done === pairs.length) setTimeout(() => ctx.win(), 700); }, 500); }
        else setTimeout(() => { a.classList.remove('up'); b.classList.remove('up'); SFX.soft(); lock = false; }, 1100);
      }
    });
  });
  popIn($$('.mcard', grid));
  ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (let i = 0; i < pairs.length; i++) { const two = $$(`.mcard[data-i="${i}"]`, grid); two[0].click(); await sleep(150); two[1].click(); await sleep(900); } } };
};

/* 4) التصنيف في سلّتين */
const sort = (stage, game, ctx) => {
  const d = game.data, T = tries(ctx);
  const box = h(`<div class="g-sort"><div class="bins"></div><div class="tray"></div></div>`); stage.appendChild(box);
  const bins = $('.bins', box), tray = $('.tray', box);
  d.bins.forEach((b, i) => { const el = h(`<button class="bin tap" type="button" data-b="${i}"><span class="bl">${esc(b.label)}</span><span class="basket">🧺</span><span class="in"></span></button>`); el.addEventListener('click', () => ctx.say(b.say || b.label, ctx.audioOf(b.say || b.label))); bins.appendChild(el); });
  const items = shuffle(d.items).slice(0, 6); let left = items.length;
  const showNext = () => {
    tray.innerHTML = ''; const it = items[items.length - left]; if (!it) return;
    const el = h(`<div class="sitem tap" role="button">${pic(it)}${it.text ? `<span class="otxt">${esc(it.text)}</span>` : ''}</div>`); tray.appendChild(el); popIn(el);
    if (it.text) ctx.say(it.text, ctx.audioOf(it.text));
    draggable(el, {
      targets: () => $$('.bin', bins), accept: (t) => +t.dataset.b === it.bin,
      onTap: () => it.text && ctx.say(it.text, ctx.audioOf(it.text)),
      onDrop: (t, ok) => { if (!ok) { T.miss(t, $(`.bin[data-b="${it.bin}"]`, bins), d.bins[it.bin].say || d.bins[it.bin].label); return; }
        $('.in', t).insertAdjacentHTML('beforeend', `<i>${it.text ? esc(it.text) : '●'}</i>`); burst(t, '#69db7c'); SFX.good(); T.reset();
        left--; if (left === 0) { ctx.praise(); setTimeout(() => ctx.win(), 900); } else setTimeout(showNext, 500); },
    });
  };
  ctx.instruct(game.say, game.audio).then(() => {}); showNext();
  return { destroy() {}, auto: async () => { let guard = 0; while (left > 0 && guard++ < 40) { await sleep(300); const el = $('.sitem', tray); if (!el || !el._dropOn) continue; const it = items[items.length - left]; el._dropOn($(`.bin[data-b="${it.bin}"]`, bins)); await sleep(700); } } };
};

/* 5) الترتيب: كلمات جملة أو صور بترتيبها (الخانة الأولى يميناً) */
const order = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const box = h(`<div class="g-order"><div class="oslots"></div><div class="opool"></div></div>`); stage.appendChild(box);
  const slots = $('.oslots', box), pool = $('.opool', box); let cur = null;
  const R = rounds(R0.length, async (k, next) => {
    cur = R0[k]; slots.innerHTML = ''; pool.innerHTML = ''; T.reset();
    cur.items.forEach((it, i) => slots.appendChild(h(`<div class="slot oslot" data-i="${i}"></div>`)));
    shuffle(cur.items.map((it, i) => ({ it, i }))).forEach(({ it, i }) => {
      const el = h(`<div class="piece tap" role="button" data-i="${i}">${it.art ? pic(it) : esc(it.text)}</div>`); pool.appendChild(el);
      draggable(el, {
        targets: () => $$('.oslot:not(.full)', slots), accept: (t) => +t.dataset.i === i && !t.classList.contains('full'),
        onTap: () => it.text && ctx.say(it.text, ctx.audioOf(it.text)),
        onDrop: (t, ok) => { if (!ok) { T.miss(t, null); return; } t.classList.add('full'); t.innerHTML = el.innerHTML; el.remove(); if (it.text) ctx.say(it.text, ctx.audioOf(it.text));
          if (!$$('.oslot:not(.full)', slots).length) setTimeout(() => { if (cur.result) { slots.innerHTML = `<div class="joined small">${esc(cur.result)}</div>`; popIn($('.joined', slots)); ctx.say(cur.result, ctx.audioOf(cur.result)); } ctx.praise(); setTimeout(next, 2400); }, 400); },
      });
    });
    popIn([...$$('.oslot', slots), ...$$('.piece', pool)]);
    if (k === 0) await ctx.instruct(game.say, game.audio);
  }, ctx);
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); for (const s of $$('.oslot', slots)) { const el = $(`.piece[data-i="${s.dataset.i}"]`, pool); el && el._dropOn && el._dropOn(s); await sleep(250); } await sleep(2800); } } };
};

/* 6) أكمل الكلمة: الحرف الناقص يظهر فراغاً داخل الكلمة المتصلة */
const complete = (stage, game, ctx) => {
  const R0 = game.data.rounds, T = tries(ctx);
  const box = h(`<div class="g-complete"><div class="cword"></div><div class="opts"></div></div>`); stage.appendChild(box);
  const wordEl = $('.cword', box), wrap = $('.opts', box); let cur = null, order = null;
  const R = rounds(R0.length, async (k, next) => {
    T.reset(); cur = R0[k]; const w = cur.word, a = cur.start, b = cur.end;
    wordEl.innerHTML = `${cur.art && ART[cur.art] ? `<div class="cpic">${art(cur.art)}</div>` : ''}<div class="ctext">${esc(w.slice(0, a))}<span class="gap">${esc(w.slice(a, b))}</span>${esc(w.slice(b))}</div>`;
    wrap.innerHTML = ''; const idx = reshuffle(cur.options.map((_, i) => i), order); order = idx;
    const els = idx.map((i) => { const c = card({ text: cur.options[i] }, 'letter'); c.dataset.i = i; wrap.appendChild(c); return c; });
    els.forEach((c) => c.addEventListener('click', () => {
      if (+c.dataset.i === cur.answer) { $('.gap', wordEl).classList.add('filled'); c.classList.add('ok'); ctx.praise(w); setTimeout(next, 2000); }
      else T.miss(c, els.find((e) => +e.dataset.i === cur.answer), w);
    }));
    popIn([wordEl, ...els]);
    if (k === 0) await ctx.instruct(game.say, game.audio); ctx.say(w, ctx.audioOf(w));
  }, ctx);
  ctx.replay = () => cur && ctx.say(cur.word, ctx.audioOf(cur.word));
  R.start();
  return { destroy() { R.stop(); }, auto: async () => { for (let n = 0; n < R0.length; n++) { await sleep(400); $$('.opt', wrap).find((e) => +e.dataset.i === cur.answer).click(); await sleep(2200); } } };
};

/* 7) المشهد التفاعلي: صورة مركّبة تُلمس عناصرها، والراوي يقول أسئلة «أنا أتحدّث» */
export function sceneSvg(sc) {
  const bg = { sky: '#cfeefe', ground: '#a8e6a1', ...sc.bg };
  return `<svg class="scene-svg" viewBox="0 0 400 260" aria-hidden="true"><rect width="400" height="260" fill="${bg.sky}"/><path d="M0 170 Q100 150 200 168 T400 162 V260 H0Z" fill="${bg.ground}"/>${sc.sun !== false ? '<circle cx="350" cy="48" r="24" fill="#ffd43b"/>' : ''}${(sc.items || []).map((it, i) => `<g class="sitem-g" data-i="${i}" transform="translate(${it.x} ${it.y}) scale(${(it.w || 70) / 100})">${ART[it.art] ? ART[it.art]() : ''}</g>`).join('')}</svg>`;
}
const scene = (stage, game, ctx) => {
  const d = game.data;
  const box = h(`<div class="g-scene"><div class="sframe">${sceneSvg(d.scene)}</div><div class="prompts"></div></div>`); stage.appendChild(box);
  $$('.sitem-g', box).forEach((g) => g.addEventListener('click', () => { SFX.pop(); if (!state.reduced) gsap.fromTo(g, { y: 0 }, { y: -10, yoyo: true, repeat: 1, duration: 0.2, transformOrigin: 'center' }); }));
  const heard = new Set();
  d.prompts.forEach((p, i) => { const b = h(`<button class="prompt tap" type="button"><span>💬</span>${ctx.digits(i + 1)}</button>`); b.addEventListener('click', () => { ctx.say(p.text, p.audio); b.classList.add('seen'); heard.add(i); if (heard.size === d.prompts.length) setTimeout(() => ctx.win(), 2500); }); $('.prompts', box).appendChild(b); });
  popIn($$('.prompt', box));
  ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const b of $$('.prompt', box)) { b.click(); await sleep(200); } } };
};

/* 8) أحجية الصورة: 4 أو 6 قطع من مشهد الوحدة */
const puzzle = (stage, game, ctx) => {
  const n = game.data.pieces === 6 ? 6 : 4, cols = n === 6 ? 3 : 2, rows = 2, W = 400, H = 260, pw = W / cols, ph = H / rows;
  const svg = sceneSvg(game.data.scene).replace('viewBox="0 0 400 260"', 'viewBox="VB"');
  const box = h(`<div class="g-puzzle"><div class="pboard" style="--cols:${cols}"></div><div class="ppool"></div></div>`); stage.appendChild(box);
  const board = $('.pboard', box), pool = $('.ppool', box); let left = n;
  for (let i = 0; i < n; i++) board.appendChild(h(`<div class="pslot" data-i="${i}"></div>`));
  shuffle([...Array(n).keys()]).forEach((i) => {
    const x = (i % cols) * pw, y = Math.floor(i / cols) * ph;
    const el = h(`<div class="ppiece tap" role="button" data-i="${i}" style="aspect-ratio:${pw}/${ph}">${svg.replace('VB', `${x} ${y} ${pw} ${ph}`)}</div>`); pool.appendChild(el);
    draggable(el, { targets: () => $$('.pslot:not(.full)', board), accept: (t) => +t.dataset.i === i,
      onDrop: (t, ok) => { if (!ok) { shake(t); SFX.soft(); return; } t.classList.add('full'); t.innerHTML = el.innerHTML; el.remove(); SFX.snap(); left--; if (!left) { ctx.praise(); burst(board, '#ffd43b', 24); setTimeout(() => ctx.win(), 1000); } } });
  });
  popIn($$('.ppiece', pool)); ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const s of $$('.pslot', board)) { await sleep(200); $(`.ppiece[data-i="${s.dataset.i}"]`, pool)._dropOn(s); } } };
};

/* 9) اقرأ معي: جمل الدرس، يلمسها الطفل فيقرؤها الراوي وتتلون الكلمة المقروءة */
const read = (stage, game, ctx) => {
  const S = game.data.sentences;
  const box = h(`<div class="g-read"></div>`); stage.appendChild(box); const heard = new Set();
  S.forEach((s, i) => {
    const el = h(`<button class="rline tap" type="button">${s.text.split(/\s+/).map((w) => `<span>${esc(w)}</span>`).join(' ')}</button>`); box.appendChild(el);
    el.addEventListener('click', () => {
      const sp = $$('span', el); $$('.rline span.on').forEach((x) => x.classList.remove('on'));
      ctx.say(s.text, s.audio).then(() => sp.forEach((x) => x.classList.remove('on')));
      sp.forEach((x, k) => setTimeout(() => { sp.forEach((y) => y.classList.remove('on')); x.classList.add('on'); }, k * 620));
      heard.add(i); el.classList.add('seen'); if (heard.size === S.length) setTimeout(() => ctx.win(), sp.length * 620 + 600);
    });
  });
  popIn($$('.rline', box)); ctx.instruct(game.say, game.audio);
  return { destroy() {}, auto: async () => { for (const l of $$('.rline', box)) { l.click(); await sleep(150); } } };
};

/* 10) صفحة النشيد: بلا لعب ولا نجمة، والنص لا يُعرض */
export function nashidPage(el, L, ctx) {
  const n = L.nashid; const has = n.audio && ctx.hasAudio(n.audio);
  el.innerHTML = `<div class="nashid"><div class="n-art">${sceneSvg(L.scene || { items: [] })}</div><div class="n-title">${esc(n.title)}</div>${n.poet ? `<div class="n-poet">${esc(n.poet)}</div>` : ''}<div class="n-book">الصفحة ${ctx.digits(n.page)} في الكتاب</div>${has ? '<button class="kbtn tap n-play" type="button">▶️</button>' : ''}</div>`;
  const b = $('.n-play', el); if (b) b.addEventListener('click', () => ctx.say(n.title, n.audio));
}

export const TEMPLATES2 = { choose, train, memory, sort, order, complete, scene, puzzle, read };
