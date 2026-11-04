// لقطات عيّنة لكل قالب على مقاس محدد
const { chromium } = require('playwright'); const path = require('path');
const [w, h, tag] = (process.argv[2] || '390,844,phone').split(',');
const list = [['u0-prep',0],['u0-prep',1],['u1-open',0],['u1-open',1],['u1-fa',2],['u1-fa',3],['u2-ra',2],['u2-sin',2],['u3-tanween',3],['u6-ghayn',2],['u1-nashid',0],['u5-shadda',1]];
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../../reading/index.html') + '#map'); await p.waitForTimeout(1500);
  for (const [id, g] of list) { await p.evaluate(([id, g]) => window.__kids.openLesson(id, g), [id, g]); await p.waitForTimeout(2600); await p.screenshot({ path: `/tmp/ss-${tag}-${id}-${g}.png` }); }
  console.log(errs.join('\n') || 'no errors'); await b.close(); })();
