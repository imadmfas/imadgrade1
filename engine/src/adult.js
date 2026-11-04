// ركن الوالدين والمعلم: بوابة للكبار (ضغط مطوّل 3 ثوانٍ ثم سؤال جمع) ثم لوحة الإعدادات والملاحظات
import { $, $$, SFX, Music, Narrator, state, setPref, store, esc, visits, shuffle } from './core.js';

let cfg = null;
export function initAdult(c) {
  cfg = c;
  const btn = $('#bAdult'); if (!btn) return;
  let t = null;
  const start = (e) => { e.preventDefault(); btn.classList.add('holding'); t = setTimeout(() => { btn.classList.remove('holding'); gate(); }, 3000); };
  const stop = () => { clearTimeout(t); btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
  btn.addEventListener('click', (e) => e.preventDefault());
  $('#adultClose').addEventListener('click', () => { $('#adult').hidden = true; });
  // اختصارات لوحة المفاتيح لا تعمل داخل الحقول
  $$('#adult input,#adult textarea,#adult select,#note input,#note textarea,#note select').forEach((el) => el.addEventListener('keydown', (e) => e.stopPropagation()));
  if (c.visitsKey) visits(c.visitsKey, (v) => { const e = $('#aVisits'); if (e) { e.textContent = 'عدد مرات الفتح: ' + v; e.hidden = false; } });
}

function gate() {
  const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7), s = a + b;
  const opts = shuffle([s, s + 1 + Math.floor(Math.random() * 2), s - 1 - Math.floor(Math.random() * 2)]);
  const g = $('#gate'); g.hidden = false;
  $('#gateQ').textContent = `${a} + ${b} = ؟`;
  $('#gateA').innerHTML = opts.map((o) => `<button type="button" data-v="${o}">${o}</button>`).join('');
  $$('#gateA button').forEach((x) => x.addEventListener('click', () => { if (+x.dataset.v === s) { g.hidden = true; openAdult(); } else { SFX.soft(); g.hidden = true; } }));
  $('#gateX').onclick = () => { g.hidden = true; };
}

export function openAdult() {
  const p = $('#adult'); p.hidden = false; Narrator.stop();
  // التقدم في كل كتاب (من التخزين المحلي)
  const books = window.__BOOKS || (cfg.book ? [{ id: cfg.book.id, title: cfg.book.title }] : []);
  $('#aProg').innerHTML = books.map((bk) => {
    const pr = store.get('kg-prog-' + bk.id, {}), ls = Object.values(pr); const st = ls.reduce((n, x) => n + (x.stars ? x.stars.length : 0), 0), sk = ls.filter((x) => x.sticker).length;
    return `<li><b>${esc(bk.title)}</b>: ${st} نجمة، ${sk} ملصق</li>`;
  }).join('') || '<li>لا تقدم بعد.</li>';
  // الإعدادات
  const snd = $('#aSound'), vol = $('#aVol'), mus = $('#aMusic'), rm = $('#aRm'), lite = $('#aLite');
  snd.checked = state.sound; vol.value = state.vol; mus.checked = state.music; rm.checked = !!state.reduced; lite.checked = !!state.lite;
  snd.onchange = () => { setPref('sound', snd.checked); if (!snd.checked) { Narrator.stop(); Music.stop(); } };
  vol.oninput = () => { setPref('vol', +vol.value); SFX.setVol(+vol.value); };
  mus.onchange = () => { setPref('music', mus.checked); mus.checked ? Music.start() : Music.stop(); };
  rm.onchange = () => setPref('reduced', rm.checked);
  lite.onchange = () => setPref('lite', lite.checked);
  // المقاطع الصوتية الناقصة
  const miss = window.__AUDIO_ALL ? window.__AUDIO_ALL.filter(([f]) => !(window.__AVAIL || []).includes(f)) : [];
  $('#aMissing').innerHTML = miss.length ? `<p>${miss.length} مقطعاً بلا تسجيل بعد (يُستعمل الصوت الآلي إن وُجد في الجهاز${Narrator.hasVoice() ? '' : '، وهو غير متوفر في هذا الجهاز'}):</p><ol>${miss.slice(0, 400).map(([f, t]) => `<li><code>${esc(f)}</code> ${esc(t)}</li>`).join('')}</ol>` : '<p>كل المقاطع مسجّلة.</p>';
  const cb = $('#aCert'); if (cb) cb.onclick = () => { p.hidden = true; cfg.showCert && cfg.showCert(); };
  $('#aNote').onclick = () => openNote();
}

function openNote() {
  const n = $('#note'); n.hidden = false;
  $('#noteWhere').textContent = (cfg.book ? cfg.book.title + ' — ' : '') + (cfg.where ? cfg.where() : '');
  $('#noteCancel').onclick = () => { n.hidden = true; };
  $('#noteF').onsubmit = (e) => {
    e.preventDefault(); const t = $('#noteText').value.trim(); if (!t) return;
    const msg = 'ملاحظة على «مكتبتي الملوّنة — الصف الأول الابتدائي»\n' +
      'الكتاب والدرس: ' + $('#noteWhere').textContent + '\n' +
      'الرابط: ' + (cfg.link ? cfg.link() : location.href) + '\n' +
      'النوع: ' + $('#noteType').value + '\n' +
      'المرسل: ' + ($('#noteName').value.trim() || 'دون اسم') + ' (' + $('#noteRole').value + ')\n\n' + t;
    const url = 'https://wa.me/' + cfg.wa + '?text=' + encodeURIComponent(msg);
    window.__lastWa = url; window.open(url, '_blank', 'noopener');
    $('#noteText').value = ''; n.hidden = true;
  };
}
