// النواة المشتركة: التخزين، والحالة، والأصوات المولّدة، والراوي، والموسيقى، وأدوات صغيرة
import gsap from 'gsap';
export { gsap };

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// خلط يضمن تغيّر الترتيب عن السابق حين يمكن ذلك
export const reshuffle = (a, prev) => { for (let k = 0; k < 8; k++) { const s = shuffle(a); if (!prev || s.join('|') !== prev.join('|') || a.length < 2) return s; } return shuffle(a); };

/* ---------- التخزين (لا يكسر شيئاً إذا فشل) ---------- */
export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

/* ---------- الحالة العامة ---------- */
export const state = {
  sound: store.get('kg-sound', true),
  vol: store.get('kg-vol', 0.85),
  music: store.get('kg-music', false),
  reduced: store.get('kg-rm', null) ?? (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches),
  lite: store.get('kg-lite', false),
  autoLite: false,
};
export const setPref = (k, v) => { state[k] = v; store.set('kg-' + ({ reduced: 'rm' }[k] || k), v); document.body.classList.toggle('rm', !!state.reduced); document.body.classList.toggle('lite', !!(state.lite || state.autoLite)); };

/* ---------- الأصوات المولّدة بـ WebAudio (من المحرك السابق مع إضافات للأطفال) ---------- */
export const SFX = {
  ctx: null, master: null,
  ensure() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  },
  out() { const c = this.ctx; if (!this.master) { this.master = c.createGain(); this.master.gain.value = state.vol; this.master.connect(c.destination); } return this.master; },
  setVol(v) { if (this.master) this.master.gain.value = v; },
  // آيفون: يجب تشغيل صوت داخل حدث اللمسة الأولى نفسه
  unlock() {
    const c = this.ensure(); if (!c) return;
    try { const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch (e) {}
    try { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } } catch (e) {}
  },
  tone(f0, f1, dur, type = 'sine', vol = 0.12, delay = 0) {
    if (!state.sound) return; const c = this.ensure(); if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.out()); o.start(t); o.stop(t + dur + 0.05);
  },
  noise(dur, f0, f1, vol = 0.2, delay = 0) {
    if (!state.sound) return; const c = this.ensure(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 1.5);
    const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
    const t = c.currentTime + delay; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = c.createGain(); g.gain.value = vol; s.connect(f).connect(g).connect(this.out()); s.start(t);
  },
  click() { this.tone(1500, 900, 0.06, 'triangle', 0.05); },
  pop() { this.tone(300, 820, 0.18, 'sine', 0.12); },
  balloon() { this.noise(0.09, 2500, 900, 0.5); this.tone(700, 180, 0.12, 'triangle', 0.06); },
  clap() { for (let i = 0; i < 6; i++) this.noise(0.07, 1800, 1200, 0.35, i * 0.13 + Math.random() * 0.03); },
  star() { [880, 1175, 1568].forEach((f, i) => this.tone(f, f * 1.01, 0.22, 'sine', 0.07, i * 0.07)); },
  sticker() { this.tone(1046, 1046, 0.5, 'sine', 0.07); this.tone(1568, 1570, 0.6, 'sine', 0.04, 0.06); this.tone(2093, 2095, 0.5, 'sine', 0.025, 0.12); },
  hop() { this.tone(260, 620, 0.14, 'sine', 0.09); },
  soft() { this.tone(330, 262, 0.22, 'sine', 0.05); }, // نغمة خطأ ناعمة جداً
  good() { this.tone(660, 990, 0.18, 'sine', 0.08); this.tone(990, 1320, 0.25, 'sine', 0.06, 0.1); },
  celebrate() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, f, 0.24, 'triangle', 0.06, i * 0.09)); this.noise(0.5, 3000, 6000, 0.04); },
  page() { this.noise(0.5, 500, 3400, 0.16); },
  whoosh() { this.noise(0.35, 1800, 300, 0.1); },
  snap() { this.tone(520, 780, 0.08, 'triangle', 0.08); },
  paint() { this.tone(900 + Math.random() * 300, 1300, 0.04, 'sine', 0.015); },
};

/* ---------- موسيقى خلفية هادئة مولّدة (مطفأة افتراضياً) ---------- */
export const Music = {
  on: false, timer: null, gain: null, step: 0,
  notes: [392, 440, 523.25, 587.33, 659.25, 783.99],
  start() {
    if (this.on || !state.music || !state.sound) return; const c = SFX.ensure(); if (!c) return;
    this.on = true; this.gain = c.createGain(); this.gain.gain.value = 0.035; this.gain.connect(SFX.out());
    const tick = () => {
      if (!this.on) return; const t = c.currentTime, f = this.notes[[0, 2, 4, 3, 2, 1, 2, 0, 1, 3, 5, 4, 2, 3, 1, 0][this.step++ % 16]];
      [f, f / 2].forEach((ff, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = ff; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(i ? 0.5 : 0.8, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1); o.connect(g).connect(this.gain); o.start(t); o.stop(t + 1.2); });
      this.timer = setTimeout(tick, 620);
    };
    tick();
  },
  stop() { this.on = false; clearTimeout(this.timer); if (this.gain) { try { this.gain.disconnect(); } catch (e) {} this.gain = null; } },
  duck(on) { if (this.gain && SFX.ctx) this.gain.gain.setTargetAtTime(on ? 0.008 : 0.035, SFX.ctx.currentTime, 0.15); },
};

/* ---------- الراوي: التسجيلات أولاً، ثم صوت المتصفح مؤقتاً ---------- */
// AVAIL: أسماء ملفات الصوت الموجودة فعلاً في مجلد audio/ (يحقنها البناء)
export const Narrator = {
  base: 'audio/', avail: new Set(), missing: new Map(), cur: null, token: 0, voice: null, lang: 'ar',
  init(avail, lang = 'ar') {
    this.avail = new Set(avail || []); this.lang = lang;
    const pick = () => { try { const vs = speechSynthesis.getVoices(); this.voice = vs.find((v) => v.lang && v.lang.toLowerCase().startsWith(lang)) || null; } catch (e) {} };
    if ('speechSynthesis' in window) { pick(); speechSynthesis.onvoiceschanged = pick; }
  },
  hasVoice() { return !!this.voice; },
  stop() { this.token++; if (this.cur) { try { this.cur.pause(); } catch (e) {} this.cur = null; } try { speechSynthesis.cancel(); } catch (e) {} Music.duck(false); },
  // يعيد وعداً يتحقق عند انتهاء النطق (أو بعد مدة تقديرية إن لم يوجد صوت)
  say(text, audio, { onStart } = {}) {
    this.stop(); const tk = this.token;
    if (!state.sound || !text) { onStart && onStart(this.est(text)); return sleep(10); }
    Music.duck(true);
    const done = () => { if (tk === this.token) Music.duck(false); };
    if (audio && this.avail.has(audio)) {
      return new Promise((res) => {
        const a = new Audio(this.base + audio); a.volume = state.vol; this.cur = a;
        a.onended = () => { done(); res(); }; a.onerror = () => { this.tts(text, tk, onStart).then(() => { done(); res(); }); };
        a.onloadedmetadata = () => onStart && onStart((a.duration || this.est(text) / 1000) * 1000);
        a.play().catch(() => { this.tts(text, tk, onStart).then(() => { done(); res(); }); });
      });
    }
    if (audio) this.missing.set(audio, text);
    return this.tts(text, tk, onStart).then(done);
  },
  est(t) { return 500 + String(t || '').split(/\s+/).length * 520; },
  tts(text, tk, onStart) {
    return new Promise((res) => {
      const ms = this.est(text); onStart && onStart(ms);
      if (!('speechSynthesis' in window) || !this.voice) { setTimeout(res, Math.min(ms, 1800)); return; }
      try {
        const u = new SpeechSynthesisUtterance(text); u.voice = this.voice; u.lang = this.voice.lang; u.rate = 0.82; u.pitch = 1.1; u.volume = state.vol;
        let fin = false; const end = () => { if (!fin) { fin = true; res(); } };
        u.onend = end; u.onerror = end; setTimeout(end, ms + 4000);
        if (tk === this.token) speechSynthesis.speak(u); else end();
      } catch (e) { res(); }
    });
  },
};

/* ---------- مراقبة الإطارات: الوضع الخفيف التلقائي ---------- */
export function watchFps() {
  let last = performance.now(), frames = 0, low = 0;
  const f = (t) => {
    frames++;
    if (t - last >= 1000) { const fps = (frames * 1000) / (t - last); frames = 0; last = t; low = fps < 25 ? low + 1 : 0; if (low >= 4 && !state.autoLite) { state.autoLite = true; setPref('lite', state.lite); } }
    requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/* ---------- منع الإزعاجات داخل مناطق اللعب ---------- */
export function kidProof() {
  document.addEventListener('contextmenu', (e) => { if (!e.target.closest('input,textarea,select,.adult')) e.preventDefault(); });
  document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
  let lastT = 0; document.addEventListener('touchend', (e) => { const n = Date.now(); if (n - lastT < 320 && !e.target.closest('input,textarea,select')) e.preventDefault(); lastT = n; }, { passive: false });
  document.addEventListener('gesturestart', (e) => e.preventDefault());
}

/* ---------- لمسة أولى تفتح الصوت ---------- */
export function onFirstTouch(fn) {
  const h = () => { SFX.unlock(); window.removeEventListener('pointerdown', h, true); fn && fn(); };
  window.addEventListener('pointerdown', h, true);
}

/* ---------- عدّاد الزيارات (Abacus) ---------- */
export function visits(key, cb) {
  try {
    const live = /github\.io$/.test(location.hostname);
    fetch('https://abacus.jasoncameron.dev/' + (live ? 'hit' : 'get') + '/' + key + '/visits').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && typeof d.value === 'number') cb(d.value.toLocaleString('ar-IQ')); }).catch(() => {});
  } catch (e) {}
}

/* ---------- Service Worker ---------- */
export function registerSW(path) { try { if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register(path).catch(() => {}); } catch (e) {} }
