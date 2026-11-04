const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = [];
  for (const bk of ['', 'reading', 'math', 'science', 'islamic', 'english', 'ethics']) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
    p.on('pageerror', (e) => errs.push(bk + ': ' + e.message));
    await p.goto('file://' + path.resolve('/home/claude/imadgrade1', bk, 'index.html')); await p.waitForTimeout(1500);
    if (bk) { const ids = await p.evaluate(() => window.__kids.LESSONS.filter((l) => l.games.length).map((l) => l.id)); for (const id of [ids[0], ids[Math.floor(ids.length / 2)], ids[ids.length - 1]]) { await p.evaluate((id) => window.__kids.openLesson(id, 0), id); await p.waitForTimeout(1500); } console.log(bk, ids.length, 'lessons ok'); }
    await p.close(); }
  console.log(errs.length ? errs.join('\n') : 'smoke: no errors'); await b.close(); })();
