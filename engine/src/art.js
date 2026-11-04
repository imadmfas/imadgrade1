// مكتبة الرسوم المشتركة: رسوم أصلية مسطحة دافئة بحواف دائرية، تُستعمل في الكتب كلها.
// كل رسم داخل مربع 100×100. الإطار الخارجي بلون بني دافئ.
const K = '#4a3426'; // لون الحدود
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;

export const ART = {
  // بَابٌ عراقي خشبي بقوس
  bab: () => `<path d="M26 92V36Q26 12 50 12Q74 12 74 36V92Z" fill="#c8794a" ${S}/>
    <path d="M33 92V38Q33 21 50 21Q67 21 67 38V92Z" fill="#f2c14e" ${S}/>
    <path d="M33 40H67M50 21V40" fill="none" ${S}/><path d="M36 37Q38 25 50 23Q62 25 64 37Z" fill="#9bd3f0" stroke="none"/>
    <rect x="37" y="46" width="11" height="18" rx="3" fill="#f7d77a" ${S}/><rect x="52" y="46" width="11" height="18" rx="3" fill="#f7d77a" ${S}/>
    <rect x="37" y="68" width="11" height="18" rx="3" fill="#f7d77a" ${S}/><rect x="52" y="68" width="11" height="18" rx="3" fill="#f7d77a" ${S}/>
    <circle cx="61" cy="66" r="2.6" fill="${K}"/><rect x="20" y="90" width="60" height="5" rx="2.5" fill="#8a5a3b" ${S}/>`,
  // بُوقٌ ذهبي
  buq: () => `<path d="M14 58L56 44L56 64Z" fill="#f6c343" ${S}/>
    <path d="M56 40Q78 30 88 18Q92 54 88 86Q78 72 56 68Z" fill="#ffd95a" ${S}/>
    <ellipse cx="89" cy="52" rx="5" ry="34" fill="#f0a91c" ${S}/>
    <rect x="22" y="62" width="30" height="12" rx="6" fill="none" ${S}/>
    <rect x="28" y="48" width="4" height="12" rx="2" fill="#e7a51b" ${S}/><rect x="36" y="46" width="4" height="12" rx="2" fill="#e7a51b" ${S}/><rect x="44" y="44" width="4" height="12" rx="2" fill="#e7a51b" ${S}/>
    <circle cx="11" cy="59" r="4" fill="#f0a91c" ${S}/>`,
  // بَقَرَةٌ لطيفة بعينين كبيرتين
  baqara: () => `<ellipse cx="54" cy="62" rx="32" ry="20" fill="#fff" ${S}/>
    <path d="M44 46Q52 52 48 62Q40 60 40 52Z" fill="#3b3b3b"/><path d="M68 66Q78 60 82 68Q76 78 68 74Z" fill="#3b3b3b"/>
    <rect x="30" y="76" width="8" height="16" rx="4" fill="#fff" ${S}/><rect x="44" y="78" width="8" height="14" rx="4" fill="#fff" ${S}/><rect x="62" y="78" width="8" height="14" rx="4" fill="#fff" ${S}/><rect x="74" y="76" width="8" height="16" rx="4" fill="#fff" ${S}/>
    <path d="M86 58Q94 62 92 74" fill="none" ${S}/><circle cx="92" cy="76" r="3" fill="${K}"/>
    <ellipse cx="54" cy="80" rx="7" ry="4" fill="#f7a8b8" ${S}/>
    <path d="M14 30Q8 20 14 16Q18 24 22 26Z" fill="#f2e6c9" ${S}/><path d="M40 30Q46 20 40 16Q36 24 32 26Z" fill="#f2e6c9" ${S}/>
    <ellipse cx="27" cy="42" rx="17" ry="19" fill="#fff" ${S}/>
    <ellipse cx="10" cy="36" rx="7" ry="4" fill="#fff" ${S}/><ellipse cx="44" cy="36" rx="7" ry="4" fill="#fff" ${S}/>
    ${eye(21, 38)}${eye(33, 38)}
    <ellipse cx="27" cy="54" rx="12" ry="8" fill="#f7a8b8" ${S}/><circle cx="23" cy="54" r="1.8" fill="${K}"/><circle cx="31" cy="54" r="1.8" fill="${K}"/>`,
  // طَبِيبٌ بمعطف أبيض وسماعة
  tabib: () => `<path d="M28 94V62Q28 50 50 50Q72 50 72 62V94Z" fill="#fff" ${S}/>
    <path d="M44 51L50 64L56 51" fill="#9bd3f0" ${S}/><path d="M50 60L47 78L50 82L53 78Z" fill="#e5484d" ${S}/>
    <path d="M38 56Q34 74 44 76Q50 76 50 70" fill="none" stroke="#3a5a7a" stroke-width="2.6" stroke-linecap="round"/><circle cx="50" cy="69" r="3" fill="#9aa9b8" ${S}/>
    <rect x="36" y="92" width="10" height="5" rx="2" fill="${K}"/><rect x="54" y="92" width="10" height="5" rx="2" fill="${K}"/>
    <rect x="45" y="40" width="10" height="11" rx="3" fill="#f6c9a6" ${S}/>
    <circle cx="50" cy="28" r="17" fill="#f6c9a6" ${S}/>
    <path d="M33 26Q34 8 52 10Q68 12 67 26Q62 18 50 17Q40 17 33 26Z" fill="#7a4a2a" ${S}/>
    ${eye(44, 29, 3.4)}${eye(56, 29, 3.4)}<path d="M45 37Q50 41 55 37" fill="none" ${S}/>
    <circle cx="39" cy="34" r="2.6" fill="#f7a8b8" opacity=".7"/><circle cx="61" cy="34" r="2.6" fill="#f7a8b8" opacity=".7"/>`,
  // بُرْتُقَالٌ: ثلاث برتقالات
  burtuqal: () => `${['32,46', '64,46', '48,72'].map((p) => { const [x, y] = p.split(',').map(Number); return `<circle cx="${x}" cy="${y}" r="18" fill="#ff9f1c" ${S}/><circle cx="${x - 6}" cy="${y - 6}" r="4" fill="#ffc46b"/><path d="M${x} ${y - 18}q2 -6 8 -7q-1 6 -8 7z" fill="#3fa34d" ${S}/>`; }).join('')}`,
  // بِطِّيخٌ (البطيخ العراقي الأصفر) مع شريحة
  bittikh: () => `<ellipse cx="56" cy="48" rx="34" ry="30" fill="#e8dfa4" ${S}/>
    ${[30, 42, 56, 70, 82].map((x) => `<path d="M${x} 20Q${x + (x - 56) * 0.25} 48 ${x} 76" fill="none" stroke="#b8ab5c" stroke-width="2.2"/>`).join('')}
    <path d="M54 18q4 -8 10 -8" fill="none" ${S}/>
    <path d="M10 70Q30 96 58 80L36 62Z" fill="#ffa64d" ${S}/><path d="M14 72Q31 90 52 80" fill="none" stroke="#ffd29a" stroke-width="3"/>`,
  // بَصَلٌ
  basal: () => `${[[34, 58], [64, 60]].map(([x, y]) => `<path d="M${x} ${y - 32}Q${x + 6} ${y - 18} ${x + 22} ${y - 4}Q${x + 26} ${y + 18} ${x} ${y + 26}Q${x - 26} ${y + 18} ${x - 22} ${y - 4}Q${x - 6} ${y - 18} ${x} ${y - 32}Z" fill="#e8a25a" ${S}/><path d="M${x} ${y - 26}Q${x - 10} ${y} ${x - 4} ${y + 24}M${x} ${y - 26}Q${x + 10} ${y} ${x + 4} ${y + 24}" fill="none" stroke="#c97a35" stroke-width="2"/><path d="M${x - 4} ${y + 26}q4 6 8 0" fill="none" ${S}/>`).join('')}`,
  // بِسَاطٌ مخطط بشراشيب
  bisat: () => `<g transform="rotate(-12 50 50)"><rect x="12" y="34" width="76" height="34" rx="4" fill="#f4e3c3" ${S}/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${17 + i * 12}" y="34" width="6" height="34" fill="${['#e5484d', '#3aa0e0', '#f6a623', '#2f9e44', '#e5484d', '#3aa0e0'][i]}"/>`).join('')}
    <rect x="12" y="34" width="76" height="34" rx="4" fill="none" ${S}/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${8} ${37 + i * 5}h-6M${92} ${37 + i * 5}h6" ${S}/>`).join('')}</g>`,
  // حَلِيبٌ: قنينة بيضاء
  halib: () => `<rect x="38" y="8" width="24" height="10" rx="3" fill="#3aa0e0" ${S}/>
    <path d="M40 18H60V28Q72 36 72 50V88Q72 94 66 94H34Q28 94 28 88V50Q28 36 40 28Z" fill="#fdfdfb" ${S}/>
    <path d="M30 56H70V80H30Z" fill="#cfe9f7"/><path d="M28 56H72M28 80H72" fill="none" ${S}/>
    <circle cx="50" cy="68" r="7" fill="#fff" ${S}/><path d="M46 68q4 -6 8 0q-4 6 -8 0z" fill="#3aa0e0"/>`,
  // خُبْزٌ: أرغفة عراقية مستديرة
  khubz: () => `<ellipse cx="50" cy="66" rx="40" ry="16" fill="#e2a65e" ${S}/>
    <ellipse cx="50" cy="58" rx="40" ry="16" fill="#efc07d" ${S}/>
    <ellipse cx="50" cy="50" rx="40" ry="16" fill="#f5cf8f" ${S}/>
    <circle cx="36" cy="48" r="3" fill="#c9823e"/><circle cx="58" cy="44" r="4" fill="#c9823e"/><circle cx="66" cy="54" r="2.6" fill="#c9823e"/><circle cx="46" cy="56" r="2.2" fill="#c9823e"/>`,
  // زخارف عامة
  palm: () => `<path d="M48 96Q46 70 50 42Q54 70 56 96Z" fill="#a8743f" ${S}/>
    ${[-60, -25, 10, 45, 80, 200, 160].map((a) => { const c = Math.cos((a * Math.PI) / 180), sn = Math.sin((a * Math.PI) / 180), f = (n) => n.toFixed(2); return `<path d="M52 40 q${f(c * 22)} ${f(sn * 14 - 8)} ${f(c * 40)} ${f(sn * 26 + 6)} q${f(-c * 18)} -6 ${f(-c * 40)} ${f(-(sn * 26 + 6))}z" fill="#3fa34d" ${S}/>`; }).join('')}
    <circle cx="46" cy="46" r="3.4" fill="#e07b2a" ${S}/><circle cx="54" cy="47" r="3.4" fill="#e07b2a" ${S}/>`,
  cloud: () => `<path d="M20 70Q6 70 8 58Q10 46 24 48Q26 30 44 32Q56 18 70 30Q90 28 90 48Q98 56 90 66Q86 72 76 70Z" fill="#fff" ${S}/>`,
  butterfly: () => `<path d="M50 50Q30 20 16 34Q10 52 48 54Z" fill="#ff8fab" ${S}/><path d="M50 50Q70 20 84 34Q90 52 52 54Z" fill="#ffc046" ${S}/><path d="M48 54Q30 80 40 82Q50 78 50 56Z" fill="#9b8cff" ${S}/><path d="M52 54Q70 80 60 82Q50 78 50 56Z" fill="#62d2a2" ${S}/><path d="M50 44V70" ${S}/>`,
};

// رسوم إجرائية لأنشطة التهيئة: كرة وصندوق في أماكن مختلفة
const box = (x, y) => `<rect x="${x}" y="${y}" width="44" height="34" rx="4" fill="#d9a066" ${S}/><path d="M${x} ${y + 12}H${x + 44}" ${S}/>`;
const ball = (x, y, r = 11) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff6b6b" ${S}/><path d="M${x - r} ${y}Q${x} ${y - 6} ${x + r} ${y}" fill="none" stroke="#fff" stroke-width="2.5"/>`;
Object.assign(ART, {
  pos_above: () => box(28, 58) + ball(50, 44),
  pos_below: () => `<rect x="20" y="30" width="60" height="8" rx="3" fill="#b07a4a" ${S}/><path d="M26 38V82M74 38V82" ${S}/>` + ball(50, 72),
  pos_front: () => box(30, 40) + ball(46, 74, 14),
  pos_behind: () => ball(62, 44, 12) + box(24, 46),
  star: () => `<path d="M50 10L61 38L91 39L67 57L76 87L50 69L24 87L33 57L9 39L39 38Z" fill="#ffd23f" ${S}/>`,
});
export const art = (name, cls = '') => {
  const f = ART[name];
  return `<svg class="art ${cls}" viewBox="0 0 100 100" aria-hidden="true">${f ? f() : `<circle cx="50" cy="50" r="30" fill="#ddd" ${S}/>`}</svg>`;
};

/* ---------- الشخصية المرافقة: «سُهَيْل» نجمة صغيرة ضاحكة بوشاح بلون الكتاب ---------- */
const starPath = (() => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 22 : 40; p.push([60 + Math.cos(a) * r, 62 + Math.sin(a) * r]); } return p; })();
const roundStar = () => {
  // نجمة بزوايا مستديرة: منحنيات تربيعية حول كل رأس
  let d = ''; const n = starPath.length;
  for (let i = 0; i < n; i++) { const a = starPath[i], b = starPath[(i + 1) % n]; const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; d += (i ? ' Q' : 'M') + (i ? `${a[0].toFixed(1)} ${a[1].toFixed(1)} ` : '') + `${m[0].toFixed(1)} ${m[1].toFixed(1)}`; }
  const a = starPath[0], m = [(starPath[n - 1][0] + a[0]) / 2, (starPath[n - 1][1] + a[1]) / 2];
  return d + ` Q${a[0].toFixed(1)} ${a[1].toFixed(1)} ${((a[0] + starPath[1][0]) / 2).toFixed(1)} ${((a[1] + starPath[1][1]) / 2).toFixed(1)}Z`;
};
export const MASCOT_NAME = 'سُهَيْل';
export function mascot(color = '#e5484d') {
  return `<svg class="mascot" viewBox="0 0 120 124" aria-hidden="true">
  <g class="m-body">
    <ellipse cx="60" cy="118" rx="26" ry="4" fill="rgba(0,0,0,.12)" class="m-shadow"/>
    <g class="m-hand m-hl"><circle cx="18" cy="76" r="8" fill="#ffd23f" ${S}/></g>
    <g class="m-hand m-hr"><circle cx="102" cy="76" r="8" fill="#ffd23f" ${S}/></g>
    <path d="${roundStar()}" fill="#ffd23f" ${S}/>
    <path d="M50 44Q58 39 66 42" fill="none" stroke="#fff3b0" stroke-width="4" stroke-linecap="round" opacity=".8"/>
    <g class="m-eyes">${eye(50, 58, 6.5)}${eye(70, 58, 6.5)}</g>
    <g class="m-lids" fill="#ffd23f"><rect x="42" y="50" width="16" height="0" class="m-lid"/><rect x="62" y="50" width="16" height="0" class="m-lid"/></g>
    <circle cx="42" cy="70" r="4.5" fill="#ff8fab" opacity=".8"/><circle cx="78" cy="70" r="4.5" fill="#ff8fab" opacity=".8"/>
    <path class="m-mouth" d="M52 70Q60 80 68 70Z" fill="#b5442e" ${S}/>
    <path class="m-scarf" d="M40 86Q60 96 80 86L82 92Q60 102 38 92Z" fill="${color}" ${S}/>
    <path class="m-scarf" d="M70 92L78 108L86 104L78 90Z" fill="${color}" ${S}/>
  </g></svg>`;
}
