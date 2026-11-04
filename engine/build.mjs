// البناء: يجمع الرف وكل كتاب جاهز في ملفات HTML مستقلة داخل جذر المستودع.
// الاستعمال: WA=9647XXXXXXXXX REPO=imadgrade1 node build.mjs
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const ROOT = path.resolve('..');
const WA = process.env.WA || '';
const REPO = process.env.REPO || 'imadgrade1';
const FONT = process.env.FONT || 'Noto Naskh Arabic';
const style = fs.readFileSync('src/style.css', 'utf8').replace(/KIDFONT/g, FONT);
const adult = fs.readFileSync('src/adult.html', 'utf8');
const readCsv = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/).slice(1).map((l) => l.split(',').slice(0, 2)) : []);
const listAudio = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.mp3')) : []);

async function bundle(entry, bookFile) {
  const plugin = { name: 'book', setup(b) { b.onResolve({ filter: /^__BOOK__$/ }, () => ({ path: path.resolve(bookFile || 'books/reading/lessons.js') })); } };
  const r = await build({ entryPoints: [entry], bundle: true, minify: true, format: 'iife', write: false, target: 'es2019', legalComments: 'none', plugins: [plugin] });
  return r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/__REPO__/g, REPO);
}
function page(tpl, { js, title = '', color = '', fontRoot, avail, all }) {
  return fs.readFileSync(tpl, 'utf8')
    .replace('/*STYLE*/', () => style.replace(/FONTROOT/g, fontRoot))
    .replace('/*ADULT*/', () => adult)
    .replace(/\/\*TITLE\*\//g, title).replace('/*COLOR*/', color).replace('/*WA*/', WA)
    .replace('/*AVAIL*/', () => JSON.stringify(avail)).replace('/*AUDIOALL*/', () => JSON.stringify(all))
    .replace('/*BUNDLE*/', () => js);
}

const { BOOKS } = await import(pathToFileURL(path.resolve('books/shelf.js')).href);
const sizes = {};
// الرف
fs.mkdirSync(path.join(ROOT, 'audio'), { recursive: true });
const shelfClips = [['shelf-hello.mp3', 'اِخْتَرْ كِتَابًا وَالْمِسْهُ'], ['shelf-soon.mp3', 'قَرِيبًا'], ...BOOKS.map((b) => [b.audio, b.title])];
fs.writeFileSync(path.join(ROOT, 'audio', 'audio-list.csv'), '﻿اسم الملف,النص المشكول,الدرس,الصفحة\n' + shelfClips.map(([f, t]) => `${f},${t},الرف,`).join('\n') + '\n');
let html = page('src/template-shelf.html', { js: await bundle('src/shelf.js'), fontRoot: './fonts', avail: listAudio(path.join(ROOT, 'audio')), all: shelfClips });
// مسار الصوت في الرف هو ./audio/
html = html.replace("<script>window.__WA", "<script>window.__AUDIO_BASE='audio/';window.__WA");
fs.writeFileSync(path.join(ROOT, 'index.html'), html); sizes['index.html'] = html.length;

// الكتب الجاهزة
for (const b of BOOKS.filter((x) => x.ready)) {
  const src = path.resolve('books', b.id), out = path.join(ROOT, b.id);
  fs.mkdirSync(path.join(out, 'audio'), { recursive: true });
  const js = await bundle('src/book.js', path.join(src, 'lessons.js'));
  const all = readCsv(path.join(src, 'audio-list.csv'));
  const h = page('src/template-book.html', { js, title: b.title.replace(/[ً-ْ]/g, ''), color: b.color, fontRoot: '../fonts', avail: listAudio(path.join(out, 'audio')), all });
  fs.writeFileSync(path.join(out, 'index.html'), h);
  fs.copyFileSync(path.join(src, 'lessons.json'), path.join(out, 'lessons.json'));
  fs.copyFileSync(path.join(src, 'audio-list.csv'), path.join(out, 'audio', 'audio-list.csv'));
  sizes[b.id + '/index.html'] = h.length;
}

// Service Worker: يعمل الكتاب دون إنترنت بعد أول فتح
fs.writeFileSync(path.join(ROOT, 'sw.js'), `const C='kg-v${Date.now()}';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 const html=e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
 e.respondWith(html?fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request))
 :caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));}return r})));});
`);
fs.writeFileSync(path.join(ROOT, 'manifest.webmanifest'), JSON.stringify({ name: 'مكتبتي الملوّنة — الصف الأول الابتدائي', short_name: 'مكتبتي الملوّنة', start_url: './', display: 'standalone', dir: 'rtl', lang: 'ar', background_color: '#e7f5ff', theme_color: '#3aa0e0' }, null, 1));
fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
console.log(Object.entries(sizes).map(([k, v]) => `${k}: ${(v / 1024).toFixed(0)} KB`).join('\n'));
