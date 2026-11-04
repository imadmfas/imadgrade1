// تطبيق الكتاب: الغلاف، وخريطة المغامرة، وصفحات الدروس، والملصقات، والشهادة، وركن الوالدين
import { gsap, $, $$, SFX, Music, Narrator, state, setPref, store, sleep, esc, watchFps, kidProof, onFirstTouch, visits, registerSW } from './core.js';
import { art, mascot, MASCOT_NAME } from './art.js';
import { TEMPLATES as T1, TEMPLATE_ICON, burst, popIn } from './games.js';
import { TEMPLATES2, nashidPage } from './games2.js';
import './art/index.js';
import { EXT } from './ext/index.js';
const TEMPLATES = { ...T1, ...TEMPLATES2, ...EXT };
import { BOOK, LESSONS, COMMON, AUDIO } from '__BOOK__';
import { openAdult, initAdult } from './adult.js';

const REPO = '__REPO__';
const KEY = 'kg-prog-' + BOOK.id;
const prog = store.get(KEY, {});
const P = (id) => (prog[id] ||= { stars: [], sticker: false });
const save = () => store.set(KEY, prog);
const digits = (n) => (BOOK.digits === 'arabic-indic' ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n));
const audioOf = (t) => AUDIO[t];
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
document.documentElement.style.setProperty('--c1', BOOK.color);
document.documentElement.style.setProperty('--c2', BOOK.color2);
document.documentElement.style.setProperty('--soft', BOOK.soft);

/* ---------- الشخصية المرافقة ---------- */
function Mascot(el) {
  el.innerHTML = mascot(BOOK.color);
  const lids = $$('.m-lid', el), hr = $('.m-hr', el), hl = $('.m-hl', el), body = $('.m-body', el);
  let alive = true;
  const blink = () => { if (!alive) return; gsap.to(lids, { attr: { height: 16 }, duration: 0.08, yoyo: true, repeat: 1 }); setTimeout(blink, 2600 + Math.random() * 2500); };
  setTimeout(blink, 1500);
  const idle = () => { if (!state.reduced && !state.lite && !state.autoLite) gsap.to(body, { y: -4, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 100%' }); };
  idle();
  return {
    el,
    wave() { if (state.reduced) return; gsap.fromTo(hr, { rotation: 0, transformOrigin: '60px 70px' }, { rotation: -35, x: 4, y: -24, duration: 0.25, yoyo: true, repeat: 5, ease: 'sine.inOut' }); },
    clap() { SFX.clap(); if (state.reduced) return; gsap.timeline().to(hr, { x: -30, duration: 0.12, yoyo: true, repeat: 5 }, 0).to(hl, { x: 30, duration: 0.12, yoyo: true, repeat: 5 }, 0).to(el, { y: -18, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }, 0); },
    hop() { SFX.hop(); if (state.reduced) return; gsap.fromTo(el, { y: 0 }, { y: -26, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out' }); },
    nod() { if (state.reduced) return; gsap.fromTo(body, { rotation: 0, transformOrigin: '50% 90%' }, { rotation: 8, duration: 0.18, yoyo: true, repeat: 3 }); },
    kill() { alive = false; },
  };
}

/* ---------- الراوي وفقاعة التعليمات: ظهور النص كلمة كلمة ---------- */
const bubble = () => $('#bubble');
async function say(text, audio) { return Narrator.say(text, audio); }
async function instruct(text, audio) {
  const b = bubble(); if (!b) return say(text, audio);
  const words = String(text).split(/\s+/);
  b.innerHTML = words.map((w) => `<span>${esc(w)}</span>`).join(' ');
  const spans = $$('span', b); gsap.set(spans, { opacity: state.reduced ? 1 : 0.15 });
  return Narrator.say(text, audio, { onStart: (ms) => { if (!state.reduced) gsap.to(spans, { opacity: 1, duration: 0.2, stagger: Math.max(0.15, ms / 1000 / (spans.length + 1)) }); } });
}

/* ---------- المشاهد ---------- */
const views = ['cover', 'map', 'lesson', 'stickers'];
function show(v) { views.forEach((x) => { const e = $('#' + x); if (e) e.hidden = x !== v; }); document.body.dataset.view = v; }

/* ---------- الغلاف ---------- */
let coverMascot;
function initCover() {
  $('#cTitle').textContent = BOOK.title; $('#cGrade').textContent = BOOK.grade;
  coverMascot = Mascot($('#cMascot'));
  const go = $('#coverGo');
  const ready = () => { go.disabled = false; go.classList.add('ready'); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(ready, 300));
  go.addEventListener('click', () => { SFX.page(); Music.start(); openMap(true); });
  $('#cMascot').addEventListener('click', () => { coverMascot.wave(); say(BOOK.title, audioOf(BOOK.title)); });
  setTimeout(() => coverMascot.wave(), 900);
}

/* ---------- خريطة المغامرة ---------- */
let mapMascot;
function unitsOf() { const u = new Map(); LESSONS.forEach((L) => { if (!u.has(L.unit)) u.set(L.unit, { n: L.unit, title: L.unitTitle, lessons: [] }); u.get(L.unit).lessons.push(L); }); return [...u.values()]; }
function nextLesson() { return LESSONS.find((L) => L.games.length && P(L.id).stars.length < L.games.length) || LESSONS[0]; }
function openMap(fromCover) {
  show('map'); location.hash = 'map';
  const road = $('#road'); road.innerHTML = '';
  const nodes = [];
  unitsOf().forEach((u) => {
    nodes.push({ kind: 'unit', u });
    u.lessons.forEach((L) => nodes.push({ kind: 'lesson', L }));
  });
  // مسار متعرج: كل عقدة في صف، تتبادل يميناً ويساراً
  const W = Math.min(road.clientWidth || 360, 720), step = 160, xs = [0.5, 0.74, 0.5, 0.26];
  const H = nodes.length * step + 200; road.style.height = H + 'px';
  const pts = nodes.map((_, i) => [W * xs[i % 4], 140 + i * step]);
  let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, e] = pts[i]; d += ` C${a} ${b + step / 2} ${c} ${e - step / 2} ${c} ${e}`; }
  road.insertAdjacentHTML('beforeend', `<svg class="road-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="${d}" class="road-base"/><path d="${d}" class="road-dash"/></svg>`);
  const deco = ['palm', 'butterfly', 'cloud', 'palm']; nodes.forEach((_, i) => { if (i % 2) road.insertAdjacentHTML('beforeend', `<div class="deco" style="left:${(xs[i % 4] > 0.5 ? 0.08 : 0.72) * W}px;top:${pts[i][1] - 40}px">${art(deco[i % 4])}</div>`); });
  const nxt = nextLesson();
  nodes.forEach((n, i) => {
    const [x, y] = pts[i];
    if (n.kind === 'unit') {
      const el = document.createElement('button'); el.className = 'station tap'; el.type = 'button'; el.style.left = x + 'px'; el.style.top = y + 'px';
      el.innerHTML = `<span class="flag">${digits(n.u.n)}</span><span class="st-title">${esc(n.u.title)}</span>`;
      el.addEventListener('click', () => { SFX.hop(); say(n.u.title, audioOf(n.u.title)); });
      road.appendChild(el);
    } else {
      const L = n.L, st = P(L.id).stars.length, total = L.games.length;
      const el = document.createElement('button'); el.className = 'node tap' + (st >= total ? ' full' : '') + (L === nxt ? ' next' : ''); el.type = 'button'; el.style.left = x + 'px'; el.style.top = y + 'px';
      el.className += L.kind === 'nashid' ? ' nashid' : L.kind === 'open' ? ' open' : '';
      el.innerHTML = `<span class="n-title">${esc(L.title)}</span><span class="n-stars">${Array.from({ length: total }, (_, k) => `<i class="${k < st ? 'on' : ''}">★</i>`).join('')}</span>`;
      el.addEventListener('click', () => { SFX.pop(); openLesson(L.id, 0); });
      road.appendChild(el);
      if (L === nxt) { const m = document.createElement('div'); m.className = 'map-mascot' + (x > W / 2 ? ' left' : ''); m.style.left = x + 'px'; m.style.top = y + 'px'; road.appendChild(m); mapMascot && mapMascot.kill(); mapMascot = Mascot(m); m.addEventListener('click', () => el.click()); }
    }
  });
  { const RW = road.clientWidth || W; $$('.node,.station', road).forEach((el) => { const w = el.offsetWidth, x = parseFloat(el.style.left); if (w) el.style.left = Math.max(w / 2 + 6, Math.min(RW - w / 2 - 6, x)) + 'px'; }); }
  { const els = $$('.node,.station', road); if (state.reduced) popIn(els); else gsap.fromTo(els, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)', stagger: Math.min(0.08, 0.9 / els.length) }); }
  const nx = $('.node.next', road); if (nx) setTimeout(() => nx.scrollIntoView({ block: 'center', behavior: state.reduced ? 'auto' : 'smooth' }), 200);
  if (fromCover) setTimeout(() => instruct(COMMON.map, audioOf(COMMON.map)), 400);
}

/* ---------- صفحة الدرس ---------- */
let cur = { L: null, gi: 0, game: null, ctx: null }, lessonMascot;
function stars() { const L = cur.L; $('#lStars').innerHTML = L.games.map((g, k) => `<i class="${P(L.id).stars.includes(k) ? 'on' : ''}${k === cur.gi ? ' cur' : ''}">★</i>`).join(''); }
function item(v) { return cur.L.items.find((x) => x.value === v) || cur.L.syllables.find((x) => x.value === v) || { value: v, audio: audioOf(v) }; }
// تلوين الحرف المدروس داخل الكلمة دون تقطيع الكلمة: نلوّن الكلمة كلها ونُبرز الحرف بظل
function wordHtml(w) { return `<span>${esc(w)}</span>`; }

function openLesson(id, gi = 0, dir = 1) {
  const L = LESSONS.find((x) => x.id === id); if (!L) { openMap(); return; }
  const first = cur.L !== L || $('#lesson').hidden;
  cur.L = L; show('lesson');
  history.replaceState(null, '', '#' + L.id + (gi ? '/' + gi : ''));
  $('#lTitle').textContent = L.title; $('#lUnit').textContent = L.unitTitle + ' — ' + L.title;
  if (!lessonMascot) lessonMascot = Mascot($('#lMascot'));
  goGame(gi, dir, first);
}
async function goGame(gi, dir = 1, first = false) {
  const L = cur.L; Narrator.stop();
  if (cur.game) { try { cur.game.destroy(); } catch (e) {} cur.game = null; }
  const page = $('#page'), old = page.firstElementChild;
  const fresh = document.createElement('div'); fresh.className = 'sheet';
  if (!L.games.length) { cur.gi = 0; nashidPage(fresh, L, { say, digits, hasAudio: (a) => Narrator.avail.has(a) }); $('#lPage').textContent = ''; setTimeout(() => instruct(L.nashid.title, audioOf(L.nashid.title)), 50); }
  else if (gi >= L.games.length) { cur.gi = L.games.length; buildSticker(fresh); $('#lPage').textContent = ''; setTimeout(() => instruct(cur.L.sticker.name, cur.L.sticker.audio), 50); }
  else { cur.gi = gi; }
  stars();
  $('#bPrev').disabled = gi <= 0; $('#bNext').disabled = gi >= L.games.length; if (!L.games.length) { const nx = LESSONS[LESSONS.indexOf(L) + 1]; $('#bNext').disabled = !nx; }
  history.replaceState(null, '', '#' + L.id + (gi ? '/' + gi : ''));
  // قلب صفحة منحنٍ ثم انبثاق الصفحة الجديدة
  if (old && !state.reduced) { SFX.page(); old.classList.add(dir > 0 ? 'turn-out' : 'turn-back'); await sleep(420); }
  page.innerHTML = ''; page.appendChild(fresh);
  if (!state.reduced) fresh.classList.add('pop-up');
  if (L.games.length && gi < L.games.length) {
    const g = L.games[gi];
    fresh.insertAdjacentHTML('beforeend', `<div class="stage" data-t="${g.template}"></div>`);
    $('#lPage').textContent = 'الصفحة ' + digits(g.page) + ' في الكتاب';
    const stage = $('.stage', fresh);
    const ctx = {
      lesson: L, item, audioOf, wordHtml, color: BOOK.color, digits, hasAudio: (a) => Narrator.avail.has(a),
      say, instruct: (t, a) => { lessonMascot.nod(); return instruct(t, a); },
      praise: (extra) => { lessonMascot.hop(); const p = pickOne(COMMON.praise); say(extra ? extra : p, extra ? audioOf(extra) : audioOf(p)).then(() => extra && say(p, audioOf(p))); SFX.good(); },
      encourage: () => { const p = pickOne(COMMON.encourage); setTimeout(() => say(p, audioOf(p)), 350); },
      win: () => winGame(gi),
      replay: null,
    };
    cur.ctx = ctx;
    await sleep(first ? 250 : 80);
    try { cur.game = TEMPLATES[g.template](stage, g, ctx); } catch (e) { console.error(e); }
  }
}
function winGame(gi) {
  const L = cur.L, p = P(L.id); if (!p.stars.includes(gi)) p.stars.push(gi); save(); stars();
  lessonMascot.clap(); confetti(); SFX.celebrate(); setTimeout(() => SFX.star(), 300);
  const st = document.createElement('div'); st.className = 'big-star'; st.textContent = '★'; document.body.appendChild(st);
  gsap.fromTo(st, { scale: 0, rotation: -40, opacity: 1 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' });
  const target = $(`#lStars i:nth-child(${gi + 1})`);
  setTimeout(() => { if (target) { const r = target.getBoundingClientRect(), s = st.getBoundingClientRect(); gsap.to(st, { x: r.left + r.width / 2 - (s.left + s.width / 2), y: r.top + r.height / 2 - (s.top + s.height / 2), scale: 0.2, duration: state.reduced ? 0 : 0.6, ease: 'power2.in', onComplete: () => { st.remove(); target && gsap.fromTo(target, { scale: 1.8 }, { scale: 1, duration: 0.4 }); } }); } else st.remove(); }, 1000);
  say(COMMON.star, audioOf(COMMON.star));
  document.body.dataset.lastWin = L.id + ':' + gi;
  setTimeout(() => { if (cur.L === L && cur.gi === gi) goGame(gi + 1, 1); }, 2600);
}
function buildSticker(el) {
  const L = cur.L, p = P(L.id), all = p.stars.length >= L.games.length;
  if (all && !p.sticker) { p.sticker = true; save(); }
  el.innerHTML = `<div class="sticker-page"><div class="sticker ${p.sticker ? 'got' : ''}">${art(L.sticker.art)}</div>
    <div class="st-name">${esc(L.sticker.name)}</div>
    <div class="st-row"><button class="kbtn tap" id="toMap" type="button">🗺️</button><button class="kbtn tap" id="toBook" type="button">📒</button></div></div>`;
  $('#toMap', el).addEventListener('click', () => openMap());
  $('#toBook', el).addEventListener('click', () => openStickers());
  setTimeout(() => { if (p.sticker) { SFX.sticker(); confetti(); lessonMascot.clap(); setTimeout(() => say(COMMON.sticker, audioOf(COMMON.sticker)), 1600); popIn($('.sticker', el)); } }, 500);
  // شهادة نهاية الوحدة
  const unitDone = LESSONS.filter((x) => x.unit === L.unit).every((x) => P(x.id).sticker);
  if (unitDone) setTimeout(() => showCert(L.unitTitle), 2600);
}

/* ---------- دفتر الملصقات ---------- */
function openStickers() {
  show('stickers'); location.hash = 'stickers';
  $('#stGrid').innerHTML = LESSONS.filter((L) => L.games.length).map((L) => `<button class="st-cell tap ${P(L.id).sticker ? 'got' : ''}" type="button" data-id="${L.id}">${art(L.sticker.art)}<span>${esc(L.title)}</span></button>`).join('');
  $$('.st-cell').forEach((b) => b.addEventListener('click', () => { const L = LESSONS.find((x) => x.id === b.dataset.id); SFX.sticker(); say(L.sticker.name, L.sticker.audio); }));
  popIn($$('.st-cell'));
}

/* ---------- الشهادة ---------- */
export function showCert(unitTitle) {
  const dlg = $('#cert'); dlg.hidden = false; $('#certUnit').textContent = unitTitle || LESSONS[0].unitTitle;
  const draw = () => {
    const c = $('#certCanvas'), g = c.getContext('2d'), W = (c.width = 1200), H = (c.height = 850);
    g.fillStyle = '#fffaf0'; g.fillRect(0, 0, W, H);
    g.lineWidth = 26; g.strokeStyle = BOOK.color; g.strokeRect(30, 30, W - 60, H - 60);
    g.lineWidth = 8; g.strokeStyle = BOOK.color2; g.setLineDash([24, 16]); g.strokeRect(70, 70, W - 140, H - 140); g.setLineDash([]);
    for (let i = 0; i < 26; i++) { g.fillStyle = ['#ffd43b', '#ff8fab', '#69db7c', '#4dabf7'][i % 4]; g.beginPath(); g.arc(120 + ((i * 97) % (W - 240)), i % 2 ? 120 : H - 120, 10, 0, 7); g.fill(); }
    g.direction = 'rtl'; g.textAlign = 'center'; g.fillStyle = '#4a3426';
    const F = getComputedStyle(document.body).getPropertyValue('--kf');
    g.font = `700 78px ${F}`; g.fillText('شَهَادَةُ تَفَوُّقٍ', W / 2, 230);
    g.font = `600 48px ${F}`; g.fillStyle = BOOK.color; g.fillText($('#certName').value.trim() || '…………', W / 2, 360);
    g.fillStyle = '#4a3426'; g.font = `500 40px ${F}`; g.fillText('أَتَمَّ ' + $('#certUnit').textContent, W / 2, 460);
    g.fillText('مِنْ كِتَابِ ' + BOOK.title, W / 2, 530);
    g.font = `700 120px ${F}`; g.fillStyle = '#f5b301'; g.fillText('★ ★ ★', W / 2, 690);
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(draw);
  $('#certName').oninput = draw;
  $('#certSave').onclick = () => { draw(); const a = document.createElement('a'); a.download = 'shahada.png'; a.href = $('#certCanvas').toDataURL('image/png'); a.click(); };
  $('#certPrint').onclick = () => { draw(); const w = window.open(''); if (w) { w.document.write(`<img src="${$('#certCanvas').toDataURL()}" style="width:100%" onload="print()">`); } };
  $('#certClose').onclick = () => { dlg.hidden = true; };
  if (!state.reduced) confetti();
}

/* ---------- قصاصات ملونة ---------- */
function confetti() {
  if (state.reduced || state.lite || state.autoLite) return;
  const cs = ['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#b197fc', '#ffa94d'];
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('i'); p.className = 'confetti'; p.style.background = cs[i % cs.length]; p.style.left = Math.random() * 100 + 'vw'; document.body.appendChild(p);
    gsap.fromTo(p, { y: -30, rotation: Math.random() * 360 }, { y: innerHeight + 40, x: (Math.random() - 0.5) * 160, rotation: '+=' + (360 + Math.random() * 360), duration: 1.8 + Math.random() * 1.2, ease: 'power1.in', delay: Math.random() * 0.4, onComplete: () => p.remove() });
  }
}

/* ---------- الأزرار الثابتة ---------- */
function initButtons() {
  $('#bHome').addEventListener('click', () => { SFX.click(); Narrator.stop(); if (cur.game) { try { cur.game.destroy(); } catch (e) {} cur.game = null; } openMap(); });
  $('#bAgain').addEventListener('click', () => { SFX.click(); const g = cur.L && cur.L.games[cur.gi]; if (!g) return; if (cur.ctx && cur.ctx.replay) cur.ctx.replay(); else instruct(g.say, g.audio); });
  $('#bNext').addEventListener('click', () => { SFX.click(); if (!cur.L.games.length) { const nx = LESSONS[LESSONS.indexOf(cur.L) + 1]; if (nx) openLesson(nx.id, 0); return; } goGame(cur.gi + 1, 1); });
  $('#bPrev').addEventListener('click', () => { SFX.click(); goGame(cur.gi - 1, -1); });
  $('#bShelf').addEventListener('click', () => { SFX.whoosh(); location.href = '../'; });
  $('#bStickers').addEventListener('click', () => { SFX.sticker(); openStickers(); });
  $('#stBack').addEventListener('click', () => openMap());
}

/* ---------- الإقلاع ---------- */
function route() {
  const hsh = decodeURIComponent(location.hash.slice(1));
  const [id, gi] = hsh.split('/');
  if (LESSONS.some((L) => L.id === id)) { $('#cover').hidden = true; openLesson(id, +gi || 0); return true; }
  if (hsh === 'map') { openMap(); return true; }
  if (hsh === 'stickers') { openStickers(); return true; }
  return false;
}
function boot() {
  kidProof(); setPref('reduced', state.reduced); setPref('lite', state.lite);
  Narrator.init(window.__AVAIL || [], BOOK.lang);
  onFirstTouch(() => Music.start());
  initCover(); initButtons();
  initAdult({ book: BOOK, lessons: LESSONS, prog: () => prog, digits, showCert, visitsKey: `imadmfas-${REPO}-${BOOK.id}`, wa: window.__WA || '', where: () => (cur.L && !$('#lesson').hidden ? `${cur.L.title} — ${cur.L.unitTitle} (ص ${digits(cur.L.games[cur.gi] ? cur.L.games[cur.gi].page : cur.L.pages[0])})` : 'خريطة الكتاب'), link: () => location.href });
  if (!route()) show('cover');
  watchFps(); registerSW('../sw.js');
  window.__kids = { gsap, get game() { return cur.game; }, get gi() { return cur.gi; }, openLesson, goGame, openMap, prog: () => prog, LESSONS, Narrator, state };
  document.body.classList.add('booted');
}
boot();
