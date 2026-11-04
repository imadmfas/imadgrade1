// يحلّ كل لعبة في كل درس بالإجابات الصحيحة آلياً، ويتأكد من ظهور النجمة وحفظ التقدم في localStorage.
const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const book = process.argv[2] || 'reading'; const only = process.argv[3] ? new RegExp(process.argv[3]) : null;
(async () => {
  const b = await chromium.launch(); const errs = [], fails = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })).newPage();
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + ROOT + '/' + book + '/index.html');
  await p.waitForFunction(() => document.body.classList.contains('booted'));
  await p.evaluate(() => { window.__kids.gsap.ticker.lagSmoothing(0); try { localStorage.clear(); } catch (e) {} });
  const L = await p.evaluate(() => window.__kids.LESSONS.map((l) => ({ id: l.id, games: l.games.map((g) => g.template) })));
  let solved = 0;
  for (const l of L) {
    if (only && !only.test(l.id)) continue;
    for (let g = 0; g < l.games.length; g++) {
      await p.evaluate(([id, g]) => window.__kids.openLesson(id, g), [l.id, g]); await p.waitForTimeout(1500);
      try { await p.evaluate(() => window.__kids.game.auto()); } catch (e) { fails.push(`${l.id}/${g} ${l.games[g]}: auto ${e.message.split('\n')[0]}`); }
      try {
        await p.waitForFunction(([id, g]) => document.body.dataset.lastWin === id + ':' + g, [l.id, g], { timeout: 30000 });
        const saved = await p.evaluate(([id, g]) => { const s = JSON.parse(localStorage.getItem('kg-prog-' + document.location.pathname.split('/').slice(-2, -1)[0]) || '{}'); return !!(s[id] && s[id].stars.includes(g)); }, [l.id, g]);
        const starOn = await p.evaluate((g) => !!document.querySelector(`#lStars i:nth-child(${g + 1}).on`), g);
        if (!saved || !starOn) fails.push(`${l.id}/${g} ${l.games[g]}: saved=${saved} star=${starOn}`); else solved++;
      } catch (e) { fails.push(`${l.id}/${g} ${l.games[g]}: لم تُحلّ`); }
      await p.waitForTimeout(800);
    }
    if (l.games.length) { await p.waitForTimeout(3000); const sticker = await p.evaluate((id) => { const s = JSON.parse(localStorage.getItem('kg-prog-' + location.pathname.split('/').slice(-2, -1)[0]) || '{}'); return !!(s[id] && s[id].sticker); }, l.id);
    if (!sticker) fails.push(l.id + ': الملصق لم يُحفظ'); }
  }
  await b.close();
  fails.forEach((f) => console.log('✗ ' + f));
  console.log(`solved ${solved} games`);
  console.log(errs.length ? errs.join('\n') : fails.length ? fails.length + ' failures' : 'no errors');
})();
