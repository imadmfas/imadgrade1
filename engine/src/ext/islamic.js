// قوالب كتاب «التربية الإسلامية»:
//  quran  — آيات للاستماع والترديد (تسجيل بشري فقط، والكلمة المتلوّة تتلوّن). لا تقطيع ولا فوز ولا خسارة.
//  lines  — جمل الدرس أو الحديث الشريف أو الدعاء كما في الكتاب: يلمسها الطفل فيسمعها.
//  tick   — صورة تصرّف: صحيح ✓ أم خطأ ✗ (للآداب فقط).
// حارس القرآن: لا يُنطق نص قرآني بصوت آلي أبداً (انظر guardNarrator أسفل الملف).
import { gsap, $, $$, SFX, state, sleep, esc, Narrator, Music } from '../core.js';
import { art, ART } from '../art.js';
import { shake, glowHint, popIn, burst } from '../games.js';
import { LESSONS, BOOK } from '__BOOK__';

const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

/* ---------- حارس القرآن ---------- */
const TASH = /[ً-ٰٟۖ-ۭـ\s]/g;
export const qnorm = (t) => String(t || '').replace(/ٱ/g, 'ا').replace(TASH, '');
const QSET = new Set();
// رموز الرسم العثماني (همزة الوصل ٱ، والعلامات الصغيرة) تعني نصاً قرآنياً
const UTHMANI = /[ٱۖ-ۭ]/;
export function isQuran(text, audio) {
  if (audio && /^quran-/.test(audio)) return true;
  if (!text) return false;
  return UTHMANI.test(text) || QSET.has(qnorm(text));
}
export const QURAN_GUARD = { blocked: 0 };
function registerQuran() {
  (LESSONS || []).forEach((L) => (L.games || []).forEach((g) => {
    if (g.template !== 'quran') return;
    (g.data.ayat || []).forEach((a) => QSET.add(qnorm(a.text)));
    if (g.data.basmala) QSET.add(qnorm(g.data.basmala.text));
  }));
}
function guardNarrator() {
  if (Narrator.__quranGuard) return; Narrator.__quranGuard = true;
  const tts = Narrator.tts.bind(Narrator), say = Narrator.say.bind(Narrator);
  // أي نص قرآني يصل إلى صوت المتصفح يُرفض بصمت
  Narrator.tts = function (text, tk, onStart) {
    if (isQuran(text)) { QURAN_GUARD.blocked++; return Promise.resolve(); }
    return tts(text, tk, onStart);
  };
  // نداء الراوي بنص قرآني: التسجيل البشري وحده، ولا بديل آلي عند غيابه أو فشله
  Narrator.say = function (text, audio, opts) {
    if (isQuran(text, audio)) { QURAN_GUARD.blocked++; return audio && this.avail.has(audio) ? playRecitation(audio) : Promise.resolve(); }
    return say(text, audio, opts);
  };
}
let recitation = null;
function stopRecitation() { if (recitation) { try { recitation.pause(); } catch (e) {} recitation = null; } }
// تشغيل تسجيل التلاوة فقط؛ عند الخطأ يتوقف دون صوت بديل
function playRecitation(file, onTime) {
  Narrator.stop(); stopRecitation();
  if (!file || !Narrator.avail.has(file) || !state.sound) return Promise.resolve(false);
  return new Promise((res) => {
    const a = new Audio(Narrator.base + file); a.volume = state.vol; recitation = a; Music.duck(true);
    const end = (ok) => { if (recitation === a) recitation = null; Music.duck(false); res(ok); };
    a.ontimeupdate = () => onTime && a.duration && onTime(a.currentTime / a.duration);
    a.onended = () => end(true); a.onerror = () => end(false);
    a.play().catch(() => end(false));
  });
}
registerQuran(); guardNarrator();

/* ---------- الأنماط ---------- */
const CSS = `
.g-quran,.g-lines{width:100%;height:100%;display:flex;flex-direction:column;align-items:stretch;justify-content:safe center;gap:10px;max-width:960px;margin:0 auto;overflow:auto;padding:4px 4px 10px}
.q-head{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
.q-name{font-size:clamp(28px,5vmin,40px);font-weight:700;color:var(--c1);background:#fff;border-radius:20px;padding:2px 22px;border:3px solid color-mix(in srgb,var(--c2) 45%,#fff)}
.q-frame{background:#fffdf5;border:5px double color-mix(in srgb,var(--c2) 60%,#c9a227);border-radius:26px;padding:10px 14px;display:flex;flex-direction:column;gap:6px}
.q-basmala{font-family:'Scheherazade New','Amiri',serif;text-align:center;font-size:clamp(30px,5.6vmin,46px);line-height:2.1;color:#2b5d34}
.qaya{font-family:'Scheherazade New','Amiri',serif;font-size:clamp(32px,6vmin,52px);line-height:2.15;text-align:right;background:transparent;border-radius:18px;padding:2px 12px;min-height:64px;width:100%;color:var(--ink);border:3px solid transparent}
.qaya .qw{border-radius:10px;transition:background .15s,color .15s;padding:0 2px}
.qaya .qw.on{background:#fff3bf;color:var(--c1)}
.qaya.seen{border-color:#b2f2bb}
.qaya .qn{display:inline-flex;align-items:center;justify-content:center;width:1.25em;height:1.25em;border-radius:50%;border:2px solid #c9a227;font-size:.6em;color:#8a6d00;margin:0 6px;vertical-align:middle;font-family:var(--kf)}
.q-note{text-align:center;font-size:clamp(28px,4.6vmin,34px);color:#6b5a4b}
.q-play{width:72px;height:72px}
.lrow{display:flex;align-items:center;gap:12px;background:#fff;border-radius:22px;padding:6px 14px;box-shadow:0 4px 0 rgba(0,0,0,.07);text-align:right;min-height:64px;width:100%;font-size:clamp(28px,5vmin,40px);font-weight:600;line-height:1.9;color:var(--ink)}
.lrow .lpic{flex:0 0 auto;width:min(18vmin,96px);height:min(18vmin,96px)}.lrow .lpic svg{width:100%;height:100%}
.lrow .ltxt{flex:1}.lrow .ltxt span{border-radius:8px;transition:background .2s}.lrow .ltxt span.on{background:#fff3bf;color:var(--c1)}
.lrow .lnum{flex:0 0 auto;color:var(--c1);font-weight:700}
.lrow.seen{box-shadow:0 4px 0 #8ce99a}
.lcap{font-size:clamp(28px,4.6vmin,34px);font-weight:700;color:var(--c1);text-align:center}
.g-lines.hadith .lrow{background:#fbe7c6;border:4px solid #d9a35b;justify-content:center;text-align:center;font-size:clamp(32px,6vmin,52px);font-weight:700}
.g-lines.hadith .lcap{color:#1c4fa0}
.g-tick{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}
.g-tick .tpic{background:#fff;border-radius:26px;padding:10px;width:min(56vmin,300px);height:min(46vmin,260px);display:flex;align-items:center;justify-content:center;box-shadow:0 5px 0 rgba(0,0,0,.08);border:4px solid transparent}
.g-tick .tpic svg{width:100%;height:100%}
.g-tick .ttxt{font-size:clamp(28px,5vmin,40px);font-weight:700;text-align:center;line-height:1.8;max-width:760px}
.g-tick .tbtns{display:flex;gap:28px}
.tbtn{width:min(22vmin,110px);height:min(22vmin,110px);min-width:72px;min-height:72px;border-radius:30px;background:#fff;font-size:clamp(44px,9vmin,64px);font-weight:800;box-shadow:0 6px 0 rgba(0,0,0,.12);border:5px solid}
.tbtn.yes{color:#2f9e44;border-color:#8ce99a}.tbtn.no{color:#e03131;border-color:#ffa8a8}
.tbtn.ok{background:#ebfbee}
.node:not(.nashid){width:auto;min-width:110px;max-width:min(62vw,250px);height:auto;min-height:104px;border-radius:52px;padding:6px 16px}
.node:not(.nashid) .n-title{font-size:28px;line-height:1.45;text-align:center;color:#fff;white-space:normal}
.stage[data-t=choose] .opt .opic{width:min(36vw,24vh,210px);height:min(36vw,24vh,210px)}
.stage[data-t=order] .piece{padding:6px}.stage[data-t=order] .piece svg,.stage[data-t=order] .oslot svg{width:min(20vw,13vh,110px);height:min(20vw,13vh,110px)}
.stage[data-t=order] .oslot{min-height:min(20vw,13vh,110px)}
@media (orientation:landscape) and (max-height:500px){.g-tick{flex-direction:row;flex-wrap:nowrap;gap:18px}.g-tick .ttxt{max-width:34%}.g-tick .tpic{height:min(52vh,220px);width:min(60vh,260px)}.g-tick .tbtns{flex-direction:column;gap:12px}.qaya{font-size:clamp(28px,6.5vh,40px)}}
`;
// الأنماط تخص هذا الكتاب وحده
if (BOOK && BOOK.id === 'islamic' && typeof document !== 'undefined' && !document.getElementById('isl-css')) document.head.insertAdjacentHTML('beforeend', `<style id="isl-css">${CSS}</style>`);

const ayaNum = (n, digits) => `<span class="qn">${digits(n)}</span>`;
const words = (t) => t.split(/\s+/).filter(Boolean);
// أطوال الكلمات (بالحروف الأصلية) لتوزيع التلوين على مدة التسجيل
const weights = (ws) => { const l = ws.map((w) => qnorm(w).length || 1), s = l.reduce((a, b) => a + b, 0); let acc = 0; return l.map((x) => (acc += x) / s); };

/* 1) القرآن: استماع وترديد */
const quran = (stage, game, ctx) => {
  const d = game.data, A = d.ayat, seen = new Set();
  const anyAudio = A.some((a) => ctx.hasAudio(a.audio));
  const box = h(`<div class="g-quran"><div class="q-head"><span class="q-name">${esc(d.name)}</span>${anyAudio ? '<button class="kbtn tap q-play q-all" type="button" aria-label="all">▶️</button>' : ''}</div>
    <div class="q-frame">${d.basmala ? `<div class="q-basmala">${esc(d.basmala.text)}</div>` : ''}</div>
    ${anyAudio ? '' : `<div class="q-note">${esc(d.noAudio)}</div>`}${d.note ? `<div class="q-note">${esc(d.note)}</div>` : ''}</div>`);
  const frame = $('.q-frame', box);
  const els = A.map((a, i) => {
    const has = ctx.hasAudio(a.audio);
    const el = h(`<button class="qaya tap" type="button" data-i="${i}" data-has="${has ? 1 : 0}">${words(a.text).map((w) => `<span class="qw">${esc(w)}</span>`).join(' ')} ${ayaNum(a.n, ctx.digits)}</button>`);
    frame.appendChild(el); return el;
  });
  stage.appendChild(box);
  let alive = true, playing = false;
  const mark = (i) => { els[i].classList.add('seen'); seen.add(i); if (seen.size === A.length && alive) setTimeout(() => alive && ctx.win(), 1200); };
  const recite = async (i) => {
    const el = els[i], ws = $$('.qw', el), cut = weights(ws.map((w) => w.textContent));
    $$('.qw.on', box).forEach((w) => w.classList.remove('on'));
    if (el.dataset.has !== '1') { gsap.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.3 }); mark(i); return; } // لا تسجيل: لا صوت إطلاقاً
    playing = true;
    await playRecitation(A[i].audio, (p) => { const k = cut.findIndex((c) => p <= c); ws.forEach((w, j) => w.classList.toggle('on', j === (k < 0 ? ws.length - 1 : k))); });
    ws.forEach((w) => w.classList.remove('on')); playing = false; mark(i);
  };
  els.forEach((el, i) => el.addEventListener('click', () => { if (alive) recite(i); }));
  const all = $('.q-all', box);
  if (all) all.addEventListener('click', async () => { for (let i = 0; i < A.length && alive; i++) await recite(i); });
  popIn(els);
  ctx.replay = () => ctx.instruct(game.say, game.audio);
  ctx.instruct(game.say, game.audio);
  return { destroy() { alive = false; stopRecitation(); }, auto: async () => { for (const el of els) { if (el.dataset.has === '1') await sleep(100); el.click(); await sleep(250); } } };
};

/* 2) جمل وأحاديث: يلمس الطفل السطر فيسمعه وتتلون الكلمة المقروءة */
const lines = (stage, game, ctx) => {
  const d = game.data, L = d.lines, heard = new Set();
  const box = h(`<div class="g-lines ${d.style || ''}">${d.intro ? `<div class="lcap">${esc(d.intro)}</div>` : ''}</div>`);
  const els = L.map((ln, i) => {
    const el = h(`<button class="lrow tap" type="button">${ln.art && ART[ln.art] ? `<span class="lpic">${art(ln.art)}</span>` : ''}${d.numbered ? `<span class="lnum">${ctx.digits(i + 1)}.</span>` : ''}<span class="ltxt">${ln.text.split(/\s+/).map((w) => `<span>${esc(w)}</span>`).join(' ')}</span></button>`);
    box.appendChild(el); return el;
  });
  if (d.outro) box.insertAdjacentHTML('beforeend', `<div class="lcap">${esc(d.outro)}</div>`);
  stage.appendChild(box);
  let alive = true;
  els.forEach((el, i) => el.addEventListener('click', () => {
    const sp = $$('.ltxt span', el); $$('.ltxt span.on', box).forEach((x) => x.classList.remove('on'));
    ctx.say(L[i].text, L[i].audio).then(() => sp.forEach((x) => x.classList.remove('on')));
    sp.forEach((x, k) => setTimeout(() => { sp.forEach((y) => y.classList.remove('on')); x.classList.add('on'); }, k * 560));
    heard.add(i); el.classList.add('seen');
    if (heard.size === L.length) setTimeout(() => alive && ctx.win(), Math.min(sp.length * 560 + 600, 4000));
  }));
  popIn(els);
  ctx.instruct(game.say, game.audio);
  return { destroy() { alive = false; }, auto: async () => { for (const el of els) { el.click(); await sleep(150); } } };
};

/* 3) صحيح أم خطأ: صورة تصرف وزرّان */
const tick = (stage, game, ctx) => {
  const R = game.data.rounds; let k = 0, wrong = 0, lock = false, alive = true;
  const box = h(`<div class="g-tick"><button class="tpic tap" type="button"></button><div class="ttxt"></div><div class="tbtns"><button class="tbtn tap yes" type="button" data-v="1">✓</button><button class="tbtn tap no" type="button" data-v="0">✗</button></div></div>`);
  stage.appendChild(box);
  const pic = $('.tpic', box), txt = $('.ttxt', box), btns = $$('.tbtn', box);
  const show = () => {
    const r = R[k]; wrong = 0; lock = false; btns.forEach((b) => b.classList.remove('ok'));
    pic.innerHTML = art(r.art); txt.textContent = r.text || ''; txt.hidden = !r.text;
    // تبديل موضع الزرين في كل جولة
    const yesFirst = (k % 2 === 0) !== (Math.random() < 0.5); $('.tbtns', box).style.flexDirection = yesFirst ? 'row' : 'row-reverse';
    popIn([pic, ...btns]); if (r.text) ctx.say(r.text, r.audio);
  };
  pic.addEventListener('click', () => { SFX.pop(); const r = R[k]; if (r && r.text) ctx.say(r.text, r.audio); else ctx.say(game.say, game.audio); });
  btns.forEach((b) => b.addEventListener('click', () => {
    if (lock || !alive) return; const r = R[k], right = (b.dataset.v === '1') === !!r.good;
    ctx.say(b.dataset.v === '1' ? game.data.yes : game.data.no, ctx.audioOf(b.dataset.v === '1' ? game.data.yes : game.data.no));
    if (right) {
      lock = true; b.classList.add('ok'); burst(b, '#69db7c'); ctx.praise();
      setTimeout(() => { if (!alive) return; k++; if (k >= R.length) ctx.win(); else show(); }, 1500);
    } else { wrong++; shake(b); ctx.encourage(); if (wrong >= 2) { const g = btns.find((x) => (x.dataset.v === '1') === !!r.good); setTimeout(() => { glowHint(g); ctx.say(r.good ? game.data.yes : game.data.no, ctx.audioOf(r.good ? game.data.yes : game.data.no)); }, 700); wrong = 0; } }
  }));
  ctx.replay = () => ctx.instruct(game.say, game.audio);
  ctx.instruct(game.say, game.audio).then(() => {}); show();
  return { destroy() { alive = false; }, auto: async () => { for (let n = 0; n < R.length; n++) { await sleep(400); const r = R[k]; btns.find((x) => (x.dataset.v === '1') === !!r.good).click(); await sleep(1700); } } };
};

export const TEMPLATES = { quran, lines, tick };
