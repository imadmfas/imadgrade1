// يلتقط كل صفحة على المقاسات الأربعة، ويفحص أهداف اللمس وأحجام نص الطفل، ويطبع «no errors» إن لم يجد مشكلة.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '../..');
const VPS = [['phone', 390, 844], ['phoneL', 844, 390], ['tablet', 800, 1280], ['desk', 1366, 768]];
const only = process.argv[2] ? process.argv[2].split(',') : null;
const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const errs = [], issues = [];
  for (const [vn, w, h] of VPS) {
    if (only && !only.includes(vn)) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(vn + ': ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/abacus|Failed to load resource/.test(m.text())) errs.push(vn + ' console: ' + m.text()); });
    const check = async (name) => {
      const r = await p.evaluate(() => {
        const out = []; const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !e.closest('[hidden]') && s.display !== 'none'; };
        document.querySelectorAll('.tap').forEach((e) => { if (!vis(e)) return; const r = e.getBoundingClientRect(); if (r.width < 63.5 || r.height < 63.5) out.push('هدف صغير ' + (e.id || e.className) + ' ' + Math.round(r.width) + '×' + Math.round(r.height)); if (r.right > innerWidth + 2 || r.left < -2 || r.bottom > innerHeight + 2 && !e.closest('#mapScroll,#stGrid,#books')) out.push('خارج الشاشة ' + (e.id || e.className.split(' ')[0]) + ' ' + Math.round(r.left) + ',' + Math.round(r.top) + ',' + Math.round(r.right) + ',' + Math.round(r.bottom)); });
        document.querySelectorAll('.word,.txt,.lbl,.word-card,.piece,.slot,.joined,#bubble,.st-title,.n-title,.b-title,.st-name').forEach((e) => { if (!vis(e) || !e.textContent.trim()) return; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 27.5 && !(e.classList.contains('b-title') && fs >= 20)) out.push('نص صغير ' + e.className + ' ' + fs); });
        document.querySelectorAll('.big-letter span').forEach((e) => { if (vis(e) && parseFloat(getComputedStyle(e).fontSize) < 120) out.push('الحرف أصغر من 120: ' + getComputedStyle(e).fontSize); });
        return out;
      });
      r.forEach((x) => issues.push(`${vn}/${name}: ${x}`));
      await p.screenshot({ path: path.join(OUT, `${vn}-${name}.png`) });
    };
    await p.goto('file://' + ROOT + '/index.html'); await p.waitForFunction(() => document.body.classList.contains('booted')); await p.waitForTimeout(1600); await check('0shelf');
    await p.goto('file://' + ROOT + '/reading/index.html'); await p.waitForFunction(() => document.body.classList.contains('booted'));
    await p.evaluate(() => { window.__kids.gsap.ticker.lagSmoothing(0); try { localStorage.clear(); } catch (e) {} });
    await p.waitForTimeout(1400); await check('1cover');
    await p.click('#coverGo', { force: true }); await p.waitForTimeout(1500); await check('2map');
    const L = await p.evaluate(() => window.__kids.LESSONS.map((l) => [l.id, l.games.length]));
    for (const [id, n] of L) {
      for (let g = 0; g <= n; g++) {
        await p.evaluate(([id, g]) => window.__kids.openLesson(id, g), [id, g]); await p.waitForTimeout(2600);
        await check(`3${id}-${g}`);
      }
    }
    await ctx.close();
  }
  await b.close();
  issues.forEach((x) => console.log('⚠ ' + x));
  console.log(errs.length ? errs.join('\n') : (issues.length ? issues.length + ' issues' : 'no errors'));
})();
