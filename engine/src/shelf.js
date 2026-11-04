// الصفحة الرئيسية: رف خشبي عليه ستة أغلفة تتمايل، تنطق اسمها، وتنفتح بحركة انبثاق
import { gsap, $, $$, SFX, Music, Narrator, state, setPref, esc, kidProof, onFirstTouch, visits, watchFps, registerSW } from './core.js';
import { mascot } from './art.js';
import { BOOKS, LIBRARY, SHELF_SAY } from '../books/shelf.js';
import { initAdult } from './adult.js';

const REPO = '__REPO__';
const ICON = {
  leaf: `<svg viewBox="0 0 100 100"><path d="M20 80Q20 24 80 20Q80 76 24 80Z" fill="#8ce99a" stroke="#4a3426" stroke-width="3"/><path d="M24 78Q46 54 70 30" fill="none" stroke="#4a3426" stroke-width="3" stroke-linecap="round"/></svg>`,
  dome: `<svg viewBox="0 0 100 100"><path d="M22 84V58Q22 30 50 22Q78 30 78 58V84Z" fill="#ffd8a8" stroke="#4a3426" stroke-width="3"/><path d="M50 22V10" stroke="#4a3426" stroke-width="3"/><circle cx="50" cy="9" r="4" fill="#fab005" stroke="#4a3426" stroke-width="2"/><path d="M40 84V64Q40 56 50 56Q60 56 60 64V84" fill="#74c0fc" stroke="#4a3426" stroke-width="3"/></svg>`,
  heart: `<svg viewBox="0 0 100 100"><path d="M50 82Q14 58 16 36Q18 18 36 18Q46 18 50 30Q54 18 64 18Q82 18 84 36Q86 58 50 82Z" fill="#ff8fab" stroke="#4a3426" stroke-width="3"/></svg>`,
};
const iconHtml = (b) => (ICON[b.icon] ? ICON[b.icon] : `<span class="txt-ico" ${/[A-Z]/.test(b.icon) ? 'dir="ltr"' : ''}>${esc(b.icon)}</span>`);

function render() {
  $('#libTitle').textContent = LIBRARY.title; $('#libGrade').textContent = LIBRARY.grade;
  const sh = $('#books');
  sh.innerHTML = BOOKS.map((b, i) => `<button class="book tap ${b.ready ? 'ready' : 'soon'}" type="button" data-i="${i}" style="--bc:${b.color};--bc2:${b.color2}">
     <span class="spine"></span><span class="b-ico">${iconHtml(b)}</span><span class="b-title">${esc(b.title)}</span>${b.ready ? '' : '<span class="ribbon">قَرِيبًا</span>'}</button>`).join('') + '<i class="shelf2"></i>';
  $$('.book', sh).forEach((el) => {
    const b = BOOKS[+el.dataset.i];
    if (!state.reduced) gsap.to(el, { rotation: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random()), duration: 1.6 + Math.random(), yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 100%' });
    el.addEventListener('click', async () => {
      SFX.pop(); gsap.killTweensOf(el);
      if (!b.ready) { gsap.fromTo(el, { rotation: -4 }, { rotation: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }); await Narrator.say(b.title, b.audio); Narrator.say(SHELF_SAY.soon, 'shelf-soon.mp3'); return; }
      Narrator.say(b.title, b.audio);
      el.classList.add('opening'); SFX.page();
      if (!state.reduced) await gsap.to(el, { scale: 1.6, rotationY: -25, y: -30, duration: 0.55, ease: 'back.in(1.4)' });
      location.href = './' + b.id + '/';
    });
  });
  if (!state.reduced) gsap.fromTo('.book', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'bounce.out', stagger: 0.08 });
}

function boot() {
  kidProof(); setPref('reduced', state.reduced); setPref('lite', state.lite);
  Narrator.init(window.__AVAIL || [], 'ar');
  $('#shMascot').innerHTML = mascot('#3aa0e0');
  render();
  onFirstTouch(() => Music.start());
  $('#shMascot').addEventListener('click', () => { SFX.hop(); gsap.fromTo('#shMascot', { y: 0 }, { y: -24, yoyo: true, repeat: 1, duration: 0.22 }); Narrator.say(SHELF_SAY.hello, 'shelf-hello.mp3'); });
  window.__BOOKS = BOOKS;
  initAdult({ book: null, prog: () => ({}), visitsKey: `imadmfas-${REPO}-library`, wa: window.__WA || '', where: () => 'رف المكتبة', link: () => location.href });
  visits(`imadmfas-${REPO}-library`, (v) => { const e = $('#shVisits'); e.textContent = 'عدد مرات الفتح: ' + v; e.hidden = false; });
  watchFps(); registerSW('./sw.js');
  window.__kids = { gsap, BOOKS };
  document.body.classList.add('booted');
}
boot();
