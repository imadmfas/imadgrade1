const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve('..')+'/reading/index.html#u1-ba/3'); await p.waitForTimeout(2500);
 const goal=await p.$eval('.word-card',e=>e.textContent.trim());
 const c=await (await p.$('.word-card')).boundingBox(); const t=await (await p.$(`.pic-card[data-v="${goal}"]`)).boundingBox();
 await p.mouse.move(c.x+c.width/2,c.y+c.height/2); await p.mouse.down(); for(let i=1;i<=15;i++){ await p.mouse.move(c.x+c.width/2+(t.x+t.width/2-c.x-c.width/2)*i/15, c.y+c.height/2+(t.y+t.height/2-c.y-c.height/2)*i/15); await p.waitForTimeout(20);} await p.mouse.up(); await p.waitForTimeout(600);
 console.log('match drop ok:', await p.$eval(`.pic-card[data-v="${goal}"]`,e=>e.classList.contains('ok')));
 // tracing with real pointer
 await p.evaluate(()=>window.__kids.openLesson('u1-ba',1)); await p.waitForTimeout(1500);
 const pts=await p.evaluate(()=>{ const svg=document.querySelector('.tr-svg'); const g=document.querySelector('.tr-guide'); const m=svg.getScreenCTM(); const L=g.getTotalLength(); const o=[]; for(let s=0;s<=L;s+=3){const q=g.getPointAtLength(s); const r=new DOMPoint(q.x,q.y).matrixTransform(m); o.push([r.x,r.y]);} const d=new DOMPoint(50,80).matrixTransform(m); return {o,d:[d.x,d.y]}; });
 await p.mouse.move(...pts.o[0]); await p.mouse.down(); for(const q of pts.o){ await p.mouse.move(q[0]+3,q[1]-2); } await p.mouse.up(); console.log('after stroke start at', await p.$eval('.tr-start',e=>e.getAttribute('cx')+','+e.getAttribute('cy')));
 await p.mouse.click(...pts.d); await p.waitForTimeout(1600);
 console.log('trace filled:', await p.$$eval('.tr-fill.on',e=>e.length)>0, 'win:', await p.evaluate(()=>document.body.dataset.lastWin));
 await p.screenshot({path:'tests/shots/trace-done.png'});
 console.log(errs.join('\n')||'no errors'); await b.close(); })();
