// يثبت أن القرآن لا يُنطق بصوت آلي أبداً، وأن زر التلاوة يختفي حين يغيب التسجيل.
// الاستعمال: node books/islamic/tests/quran-guard.cjs   (بعد البناء)
let pw; try { pw = require('playwright'); } catch (e) { pw = require('/home/claude/.npm-global/lib/node_modules/playwright'); }
const path = require('path');
const ROOT = path.resolve(__dirname, '../../../..');
(async () => {
  const b = await pw.chromium.launch(); const fails = [], errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  p.on('pageerror', (e) => errs.push(e.message));
  // صوت متصفح مزيف يسجّل كل ما يُطلب نطقه
  await p.addInitScript(() => {
    window.__spoken = [];
    const fake = { speak(u) { window.__spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 5); }, cancel() {}, getVoices() { return [{ lang: 'ar-SA', name: 'fake' }]; }, onvoiceschanged: null };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
    window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  });
  await p.goto('file://' + ROOT + '/islamic/index.html');
  await p.waitForFunction(() => document.body.classList.contains('booted'));
  await p.evaluate(() => { const N = window.__kids.Narrator; N.voice = { lang: 'ar-SA' }; window.__kids.state.sound = true; window.__kids.gsap.ticker.lagSmoothing(0); });
  const Q = await p.evaluate(() => { const out = []; window.__kids.LESSONS.forEach((L) => L.games.forEach((g, i) => { if (g.template === 'quran') out.push({ id: L.id, gi: i, ayat: g.data.ayat.map((a) => [a.text, a.audio]), basmala: g.data.basmala }); })); return out; });
  const isQ = (t, all) => all.some((q) => t && t.replace(/\s/g, '') === q.replace(/\s/g, ''));
  const allQ = Q.flatMap((q) => q.ayat.map((a) => a[0]).concat(q.basmala ? [q.basmala.text] : []));
  // 1) لا تسجيلات: لا زر تلاوة، ولمس الآيات لا ينطق شيئاً من القرآن
  for (const q of Q) {
    await p.evaluate(([id, g]) => window.__kids.openLesson(id, g), [q.id, q.gi]); await p.waitForTimeout(900);
    const btn = await p.$$eval('.q-play', (x) => x.length); if (btn) fails.push(q.id + ': زر التلاوة ظاهر بلا تسجيل');
    for (const el of await p.$$('.qaya')) { await el.click(); await p.waitForTimeout(80); }
  }
  // 2) نداء الراوي مباشرة بنص قرآني، بملف أو بدونه أو بملف غير موجود
  await p.evaluate((all) => Promise.all(all.flatMap((t) => [window.__kids.Narrator.say(t), window.__kids.Narrator.say(t, 'quran-missing.mp3'), window.__kids.Narrator.say(t, 'x.mp3'), window.__kids.Narrator.tts(t, window.__kids.Narrator.token)])), allQ);
  // 3) تسجيل «موجود» لكنه يفشل في التحميل: لا بديل آلي
  await p.evaluate((q) => { q.ayat.forEach(([, a]) => window.__kids.Narrator.avail.add(a)); }, Q[0]);
  await p.evaluate(([id, g]) => window.__kids.openLesson(id, g), [Q[0].id, Q[0].gi]); await p.waitForTimeout(900);
  const btn2 = await p.$$eval('.q-play', (x) => x.length); if (!btn2) fails.push('زر التلاوة لا يظهر مع وجود التسجيل');
  for (const el of await p.$$('.qaya')) { await el.click(); await p.waitForTimeout(300); }
  await p.evaluate((q) => Promise.all(q.ayat.map(([t, a]) => window.__kids.Narrator.say(t, a))), Q[0]);
  await p.waitForTimeout(500);
  // 4) فحص سلامة الاختبار نفسه: نص عادي يصل فعلاً إلى الصوت المزيف
  await p.evaluate(() => window.__kids.Narrator.say('أَحْسَنْتَ!'));
  const spoken = await p.evaluate(() => window.__spoken);
  const leaked = spoken.filter((t) => isQ(t, allQ) || /[ٱۖ-ۭ]/.test(t));
  if (leaked.length) fails.push('نُطق نص قرآني آلياً: ' + leaked.join(' | '));
  if (!spoken.includes('أَحْسَنْتَ!')) fails.push('الصوت المزيف لا يعمل (الاختبار غير صالح)');
  await b.close();
  fails.forEach((f) => console.log('✗ ' + f));
  console.log(`quran passages ${Q.length}, ayat ${allQ.length}, machine utterances ${spoken.length}`);
  console.log(errs.length ? errs.join('\n') : fails.length ? fails.length + ' failures' : 'quran guard: no errors');
  process.exit(fails.length || errs.length ? 1 : 0);
})();
