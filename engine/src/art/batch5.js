// batch5 — original SVG art, 100×100 viewBox
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;
const cheeks = (x1, x2, y, r = 2.6) => `<circle cx="${x1}" cy="${y}" r="${r}" fill="#f7a8b8" opacity=".7"/><circle cx="${x2}" cy="${y}" r="${r}" fill="#f7a8b8" opacity=".7"/>`;
const smile = (x, y, w = 5) => `<path d="M${x - w} ${y}Q${x} ${y + w * 0.8} ${x + w} ${y}" fill="none" ${S}/>`;
// فتاة بحجاب وثوب طويل (مرسومة حول x=50، من y≈10 إلى 95)
const girl = (dress = '#3aa0e0', scarf = '#f2f2f2') => `<path d="M30 95L36 58Q50 50 64 58L70 95Z" fill="${dress}" ${S}/>
  <path d="M31 30Q31 10 50 10Q69 10 69 30Q70 52 50 58Q30 52 31 30Z" fill="${scarf}" ${S}/>
  <ellipse cx="50" cy="31" rx="12.5" ry="13.5" fill="#f6c9a6" ${S}/>
  ${eye(45, 30, 3.2)}${eye(55, 30, 3.2)}${smile(50, 37, 4)}${cheeks(41, 59, 36, 2.2)}`;
// صبي بقميص وبنطال
const boy = (shirt = '#2f9e44', pants = '#3a5a7a') => `<rect x="38" y="76" width="10" height="19" rx="3" fill="${pants}" ${S}/><rect x="52" y="76" width="10" height="19" rx="3" fill="${pants}" ${S}/>
  <path d="M32 80V62Q32 52 50 52Q68 52 68 62V80Z" fill="${shirt}" ${S}/>
  <circle cx="50" cy="32" r="16" fill="#f6c9a6" ${S}/>
  <path d="M34 30Q34 14 50 14Q66 14 66 30Q60 22 50 22Q40 22 34 30Z" fill="#5a3a22" ${S}/>
  ${eye(44, 32, 3.2)}${eye(56, 32, 3.2)}${smile(50, 39, 4)}${cheeks(39, 61, 38, 2.2)}`;
const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const peachAt = (x, y, r) => `<path d="M${x} ${y - r * 0.8}Q${x + r * 1.1} ${y - r * 1.1} ${x + r} ${y + r * 0.1}Q${x + r * 0.8} ${y + r} ${x} ${y + r}Q${x - r * 0.8} ${y + r} ${x - r} ${y + r * 0.1}Q${x - r * 1.1} ${y - r * 1.1} ${x} ${y - r * 0.8}Z" fill="#ffab76" ${S}/>
  <path d="M${x} ${y - r * 0.7}Q${x - r * 0.35} ${y + r * 0.1} ${x - r * 0.1} ${y + r * 0.85}" fill="none" stroke="#e5734a" stroke-width="2.2" stroke-linecap="round"/>
  <ellipse cx="${x + r * 0.45}" cy="${y - r * 0.2}" rx="${r * 0.18}" ry="${r * 0.28}" fill="#ffd0b0"/>
  <path d="M${x} ${y - r * 0.8}q${r * 0.2} ${-r * 0.5} ${r * 0.7} ${-r * 0.55}q${-r * 0.1} ${r * 0.5} ${-r * 0.7} ${r * 0.55}z" fill="#3fa34d" ${S}/>`;
const palmAt = (x, y, s) => at(x, y, s, `<path d="M-4 0Q-6 -30 -2 -58H4Q6 -30 6 0Z" fill="#a8743f" ${S}/>
  ${[-44, -32, -20, -8].map((yy) => `<path d="M-4 ${yy}h9" fill="none" stroke="${K}" stroke-width="2"/>`).join('')}
  ${[[-36, -34], [36, -34], [-34, -56], [34, -56], [-18, -84], [18, -84]].map(([dx, dy]) => `<path d="M1 -60Q${dx * 0.45} ${dy - 16} ${dx} ${dy + 8}Q${dx * 0.55} ${dy + 6} 1 -60Z" fill="#3fa34d" ${S}/>`).join('')}
  <circle cx="-5" cy="-56" r="4" fill="#c0612b" ${S}/><circle cx="6" cy="-55" r="4" fill="#c0612b" ${S}/>`);
const house = (x, y, w, h, wall, roof) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wall}" ${S}/>
  <path d="M${x - 4} ${y}L${x + w / 2} ${y - w * 0.55}L${x + w + 4} ${y}Z" fill="${roof}" ${S}/>
  <rect x="${x + w / 2 - 4}" y="${y + h - 14}" width="8" height="14" rx="2" fill="#8a5a3b" ${S}/>
  <rect x="${x + 3}" y="${y + 5}" width="7" height="7" fill="#9bd3f0" ${S}/><rect x="${x + w - 10}" y="${y + 5}" width="7" height="7" fill="#9bd3f0" ${S}/>`;
const rockAt = (x, y, s, c = '#a7a39b') => at(x, y, s, `<path d="M-30 14Q-34 -4 -18 -14Q-6 -26 10 -18Q28 -14 32 2Q34 14 26 16Z" fill="${c}" ${S}/>
  <path d="M-12 -6Q-4 -12 6 -8M8 4Q16 0 22 6" fill="none" stroke="#77736b" stroke-width="2.2" stroke-linecap="round"/>`);
const balloon = (x, y, c) => `<path d="M${x} ${y + 16}Q${x + 3} ${y + 30} ${x - 2} ${y + 42}" fill="none" stroke="${K}" stroke-width="1.8"/>
  <ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${c}" ${S}/><path d="M${x - 3} ${y + 14}h6l-3 4z" fill="${c}" ${S}/>
  <ellipse cx="${x - 4}" cy="${y - 5}" rx="2.5" ry="4" fill="#fff" opacity=".6"/>`;
const pepper = (x, y, c, rot) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 14} ${y - 10}Q${x - 18} ${y + 12} ${x - 8} ${y + 22}Q${x - 2} ${y + 26} ${x} ${y + 20}Q${x + 2} ${y + 26} ${x + 8} ${y + 22}Q${x + 18} ${y + 12} ${x + 14} ${y - 10}Q${x} ${y - 18} ${x - 14} ${y - 10}Z" fill="${c}" ${S}/>
  <path d="M${x} ${y - 14}q-2 -8 4 -12" fill="none" stroke="#2f7d32" stroke-width="4" stroke-linecap="round"/>
  <path d="M${x - 8} ${y - 12}Q${x} ${y - 8} ${x + 8} ${y - 12}" fill="#3fa34d" ${S}/><ellipse cx="${x - 7}" cy="${y + 2}" rx="2.5" ry="6" fill="#fff" opacity=".45"/></g>`;
const pomegranate = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#d63a3a" ${S}/>
  <path d="M${x - 6} ${y - r + 1}L${x - 7} ${y - r - 8}L${x - 2} ${y - r - 4}L${x} ${y - r - 9}L${x + 2} ${y - r - 4}L${x + 7} ${y - r - 8}L${x + 6} ${y - r + 1}Z" fill="#b8292f" ${S}/>
  <ellipse cx="${x - r * 0.4}" cy="${y - r * 0.35}" rx="${r * 0.18}" ry="${r * 0.28}" fill="#fff" opacity=".45"/>`;
const saw = (y, c) => `<path d="M14 ${y - 10}H74L70 ${y + 8}H14Z" fill="#cfd6dc" ${S}/>
  <path d="M14 ${y + 8}${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `l3.5 5l3.5 -5`).join('')}" fill="#cfd6dc" ${S}/>
  <path d="M72 ${y - 14}H90Q94 ${y - 14} 94 ${y - 8}V${y + 6}Q94 ${y + 12} 88 ${y + 12}H76Q72 ${y + 12} 72 ${y + 6}Z" fill="${c}" ${S}/>
  <rect x="78" y="${y - 7}" width="10" height="12" rx="4" fill="#fff" ${S}/>`;

export const ART_BATCH5 = {
  // بُومَةٌ على غصن
  owl: () => `<rect x="12" y="86" width="76" height="8" rx="4" fill="#8a5a3b" ${S}/>
    <path d="M30 22L26 8L40 16Z" fill="#8a5a3b" ${S}/><path d="M70 22L74 8L60 16Z" fill="#8a5a3b" ${S}/>
    <ellipse cx="50" cy="52" rx="28" ry="36" fill="#a8754a" ${S}/>
    <ellipse cx="50" cy="66" rx="17" ry="19" fill="#f2d6a6" ${S}/>
    ${[[44, 60], [56, 60], [50, 70], [44, 78], [56, 78]].map(([x, y]) => `<path d="M${x - 3} ${y}l3 3l3 -3" fill="none" stroke="#c99a62" stroke-width="2" stroke-linecap="round"/>`).join('')}
    <path d="M23 46Q14 64 26 78Q30 64 28 50Z" fill="#8a5a3b" ${S}/><path d="M77 46Q86 64 74 78Q70 64 72 50Z" fill="#8a5a3b" ${S}/>
    <circle cx="39" cy="38" r="12" fill="#f7e3bf" ${S}/><circle cx="61" cy="38" r="12" fill="#f7e3bf" ${S}/>
    ${eye(39, 38, 7)}${eye(61, 38, 7)}<path d="M45 47H55L50 56Z" fill="#f6a623" ${S}/>
    <path d="M40 86v4M46 86v4M54 86v4M60 86v4" stroke="#f6a623" stroke-width="3.5" stroke-linecap="round"/>`,
  // فُرْشَاةُ رسم
  paintbrush: () => `<g transform="rotate(40 50 50)"><rect x="44" y="40" width="12" height="54" rx="6" fill="#e5484d" ${S}/>
    <rect x="42" y="28" width="16" height="16" rx="2" fill="#cfd6dc" ${S}/><path d="M42 34H58M42 39H58" fill="none" stroke="#9aa9b8" stroke-width="2"/>
    <path d="M42 28Q40 14 50 4Q60 14 58 28Z" fill="#c8794a" ${S}/><path d="M43 16Q50 2 57 16Q50 6 43 16Z" fill="#3aa0e0" ${S}/></g>
    <path d="M10 82Q14 72 24 76Q34 72 34 84Q30 94 20 92Q8 92 10 82Z" fill="#3aa0e0" ${S}/><circle cx="18" cy="82" r="2.5" fill="#fff" opacity=".6"/>`,
  // تَلْوِينٌ: لوحة ألوان وفرشاة
  painting: () => `<path d="M50 12Q88 12 90 46Q92 70 70 70Q58 70 62 80Q66 92 48 92Q10 90 10 54Q10 12 50 12Z" fill="#f2d6a6" ${S}/>
    <ellipse cx="72" cy="80" rx="0" ry="0"/>
    ${[[30, 36, '#e5484d'], [50, 26, '#f6c343'], [70, 34, '#3fa34d'], [76, 52, '#3aa0e0'], [26, 58, '#9b5de5']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="${c}" ${S}/>`).join('')}
    <circle cx="42" cy="70" r="7" fill="#fff" ${S}/>
    <g transform="rotate(-35 62 60)"><rect x="58" y="44" width="8" height="46" rx="4" fill="#8a5a3b" ${S}/><rect x="57" y="38" width="10" height="8" fill="#cfd6dc" ${S}/><path d="M57 38Q57 28 62 24Q67 28 67 38Z" fill="#e5484d" ${S}/></g>`,
  // قَصْرٌ بقباب وأبراج
  palace: () => `<rect x="8" y="88" width="84" height="6" rx="3" fill="#c8a26a" ${S}/>
    <rect x="12" y="40" width="16" height="48" fill="#f4e3c3" ${S}/><rect x="72" y="40" width="16" height="48" fill="#f4e3c3" ${S}/>
    <path d="M10 40Q20 22 30 40Z" fill="#3aa0e0" ${S}/><path d="M70 40Q80 22 90 40Z" fill="#3aa0e0" ${S}/>
    <path d="M20 26v-6M80 26v-6" ${S}/><circle cx="20" cy="18" r="2.4" fill="#f6c343" ${S}/><circle cx="80" cy="18" r="2.4" fill="#f6c343" ${S}/>
    <rect x="28" y="50" width="44" height="38" fill="#fbeed6" ${S}/>
    <path d="M30 50Q30 26 50 18Q70 26 70 50Z" fill="#f6c343" ${S}/><path d="M50 18v-8" ${S}/><circle cx="50" cy="8" r="3" fill="#f6c343" ${S}/>
    <path d="M42 88V72Q42 62 50 62Q58 62 58 72V88Z" fill="#c8794a" ${S}/>
    <path d="M17 58Q17 52 20 52Q23 52 23 58V66H17Z" fill="#2f6f9e" ${S}/><path d="M77 58Q77 52 80 52Q83 52 83 58V66H77Z" fill="#2f6f9e" ${S}/>
    <path d="M32 64Q32 56 36 56Q40 56 40 64V72H32Z" fill="#2f6f9e" ${S}/><path d="M60 64Q60 56 64 56Q68 56 68 64V72H60Z" fill="#2f6f9e" ${S}/>`,
  // نَخْلَةٌ
  palm_tree: () => `<ellipse cx="50" cy="92" rx="26" ry="4" fill="#d8c08a" ${S}/>${palmAt(50, 92, 1)}`,
  // نَخِيْلٌ: ثلاث نخلات
  palm_trees: () => `<path d="M6 92Q50 84 94 92" fill="#d8c08a" ${S}/>${palmAt(25, 92, 0.6)}${palmAt(75, 92, 0.6)}${palmAt(50, 90, 0.82)}`,
  // وَرَقَةٌ بيضاء مطوية الزاوية
  paper_sheet: () => `<path d="M22 8H64L80 24V92H22Z" fill="#fff" ${S}/><path d="M64 8V24H80" fill="#e8e2d4" ${S}/>
    ${[36, 46, 56, 66, 76].map((y) => `<path d="M30 ${y}H72" stroke="#9bd3f0" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
    <path d="M30 26H54" stroke="#9bd3f0" stroke-width="2.4" stroke-linecap="round"/>`,
  // بَبَّغَاءُ على عود
  parrot: () => `<rect x="20" y="78" width="66" height="7" rx="3.5" fill="#8a5a3b" ${S}/>
    <path d="M42 70L36 96L46 94L50 72Z" fill="#3aa0e0" ${S}/><path d="M50 70L50 96L58 92L56 70Z" fill="#e5484d" ${S}/>
    <ellipse cx="52" cy="54" rx="18" ry="24" fill="#3fa34d" ${S}/>
    <path d="M58 44Q76 54 66 74Q58 70 56 56Z" fill="#2f7d32" ${S}/><path d="M62 60Q70 64 66 72" fill="none" stroke="#f6c343" stroke-width="3" stroke-linecap="round"/>
    <circle cx="44" cy="28" r="16" fill="#e5484d" ${S}/>
    <path d="M30 30Q20 30 22 42Q26 48 32 42Q30 38 34 36Z" fill="#f6c343" ${S}/>
    <ellipse cx="44" cy="30" rx="6" ry="5" fill="#fff"/>${eye(44, 28, 4.4)}
    <path d="M46 78v6M54 78v6" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
  // حَفْلَةُ: كعكة بشموع وبالونات
  party: () => `${balloon(18, 22, '#e5484d')}${balloon(82, 20, '#3aa0e0')}${balloon(50, 14, '#f6c343')}
    <rect x="20" y="62" width="60" height="28" rx="5" fill="#f7a8b8" ${S}/>
    <path d="M20 70Q27 78 35 70Q42 78 50 70Q57 78 65 70Q72 78 80 70V66Q80 62 75 62H25Q20 62 20 66Z" fill="#fff" ${S}/>
    <rect x="14" y="88" width="72" height="6" rx="3" fill="#c8794a" ${S}/>
    ${[34, 50, 66].map((x) => `<rect x="${x - 2.5}" y="46" width="5" height="16" rx="1.5" fill="#9bd3f0" ${S}/><path d="M${x} 36Q${x + 4} 42 ${x} 45Q${x - 4} 42 ${x} 36Z" fill="#ff9f1c" ${S}/>`).join('')}
    ${[[30, 80, '#e5484d'], [46, 82, '#3fa34d'], [62, 80, '#3aa0e0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}`,
  // زِيْنَةٌ: حبال أعلام ملونة ونجوم معلقة
  party_decorations: () => `<path d="M6 14Q50 40 94 14" fill="none" ${S}/>
    ${[[14, 19], [26, 25], [38, 28], [50, 29], [62, 28], [74, 25], [86, 19]].map(([x, y], i) => `<path d="M${x - 5} ${y}L${x + 5} ${y + 1}L${x} ${y + 13}Z" fill="${['#e5484d', '#f6c343', '#3fa34d', '#3aa0e0', '#9b5de5', '#ff9f1c', '#e5484d'][i]}" ${S}/>`).join('')}
    <path d="M6 50Q50 74 94 50" fill="none" ${S}/>
    ${[[16, 55], [32, 61], [50, 64], [68, 61], [84, 55]].map(([x, y], i) => `<path d="M${x - 5} ${y}L${x + 5} ${y + 1}L${x} ${y + 13}Z" fill="${['#3aa0e0', '#ff9f1c', '#e5484d', '#f6c343', '#3fa34d'][i]}" ${S}/>`).join('')}
    ${[[24, '#f6c343'], [76, '#f6c343']].map(([x, c]) => `<path d="M${x} 70V78" stroke="${K}" stroke-width="1.8"/><path d="M${x} 78l2.6 5.4l6 .8l-4.4 4.2l1 6l-5.2 -2.8l-5.2 2.8l1 -6l-4.4 -4.2l6 -.8z" fill="${c}" ${S}/>`).join('')}
    <path d="M50 77V82" stroke="${K}" stroke-width="1.8"/><circle cx="50" cy="88" r="6" fill="#ff8fab" ${S}/>`,
  // خَوْخٌ: خوخة واحدة
  peach: () => peachAt(50, 54, 34),
  // خَوْخٌ: ثلاث خوخات
  peaches: () => `${peachAt(30, 46, 20)}${peachAt(70, 46, 20)}${peachAt(50, 74, 20)}`,
  // طَاوُوْسٌ بذيل مروحي
  peacock: () => `${[...Array(9)].map((_, i) => { const a = Math.PI * (1.05 + i * 0.1125); const x = 50 + Math.cos(a) * 38, y = 68 + Math.sin(a) * 50; return `<path d="M50 68L${(50 + Math.cos(a - 0.09) * 40).toFixed(1)} ${(68 + Math.sin(a - 0.09) * 52).toFixed(1)}Q${(50 + Math.cos(a) * 46).toFixed(1)} ${(68 + Math.sin(a) * 58).toFixed(1)} ${(50 + Math.cos(a + 0.09) * 40).toFixed(1)} ${(68 + Math.sin(a + 0.09) * 52).toFixed(1)}Z" fill="#3fa34d" ${S}/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#f6c343" stroke="#2f6f9e" stroke-width="2.4"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#2f6f9e"/>`; }).join('')}
    <path d="M42 94L44 86M58 94L56 86" ${S}/>
    <ellipse cx="50" cy="74" rx="11" ry="14" fill="#2f6f9e" ${S}/>
    <path d="M46 64Q44 46 50 40Q56 46 54 64Z" fill="#2f6f9e" ${S}/><circle cx="50" cy="38" r="8" fill="#2f6f9e" ${S}/>
    ${eye(48, 37, 3)}<path d="M57 37l6 2l-6 2z" fill="#f6a623" ${S}/>
    <path d="M48 30l-2 -7M50 30v-8M52 30l2 -7" stroke="${K}" stroke-width="1.8"/><circle cx="46" cy="22" r="1.8" fill="#2f6f9e"/><circle cx="50" cy="21" r="1.8" fill="#2f6f9e"/><circle cx="54" cy="22" r="1.8" fill="#2f6f9e"/>`,
  // قَلَمٌ رصاص
  pencil: () => `<g transform="rotate(-40 50 50)"><rect x="18" y="41" width="56" height="18" fill="#f6c343" ${S}/>
    <path d="M18 47H74M18 53H74" stroke="#e0a21b" stroke-width="2"/>
    <rect x="8" y="41" width="12" height="18" rx="4" fill="#f7a8b8" ${S}/><rect x="17" y="40" width="6" height="20" fill="#cfd6dc" ${S}/>
    <path d="M74 41L94 50L74 59Z" fill="#f2d6a6" ${S}/><path d="M88 47.3L94 50L88 52.7Z" fill="${K}"/></g>`,
  // مِحْفَظَةٌ أقلام بسحّاب
  pencil_case: () => `<rect x="42" y="12" width="7" height="30" fill="#e5484d" ${S}/><path d="M42 12L45.5 4L49 12Z" fill="#f2d6a6" ${S}/>
    <rect x="54" y="18" width="7" height="24" fill="#3aa0e0" ${S}/><path d="M54 18L57.5 10L61 18Z" fill="#f2d6a6" ${S}/>
    <rect x="30" y="20" width="7" height="22" fill="#f6c343" ${S}/><path d="M30 20L33.5 12L37 20Z" fill="#f2d6a6" ${S}/>
    <path d="M10 44Q10 36 20 36H80Q90 36 90 44V80Q90 90 80 90H20Q10 90 10 80Z" fill="#9b5de5" ${S}/>
    <path d="M10 46H90" fill="none" ${S}/><path d="M14 46H86" stroke="#f2f2f2" stroke-width="2" stroke-dasharray="3 3"/>
    <rect x="70" y="44" width="8" height="14" rx="3" fill="#cfd6dc" ${S}/>
    <circle cx="34" cy="68" r="7" fill="#f6c343" ${S}/><circle cx="56" cy="70" r="5" fill="#ff8fab" ${S}/><circle cx="72" cy="74" r="4" fill="#62d2a2" ${S}/>`,
  // مِبْرَاةُ مع قلم وبُراية
  pencil_sharpener: () => `<rect x="56" y="46" width="34" height="16" fill="#f6c343" ${S}/><path d="M56 51H90M56 57H90" stroke="#e0a21b" stroke-width="2"/>
    <rect x="86" y="46" width="8" height="16" rx="3" fill="#f7a8b8" ${S}/>
    <rect x="16" y="36" width="44" height="38" rx="7" fill="#3aa0e0" ${S}/><path d="M60 46V62" ${S}/>
    <rect x="20" y="40" width="36" height="10" rx="2" fill="#cfd6dc" ${S}/><circle cx="38" cy="45" r="2.4" fill="#9aa9b8" ${S}/>
    <path d="M26 40Q16 24 28 16Q42 10 44 24Q44 32 36 30Q30 28 34 22" fill="#f2d6a6" ${S}/><path d="M26 40Q16 24 28 16Q42 10 44 24" fill="none" stroke="#f6c343" stroke-width="2" stroke-dasharray="3 3"/>
    <path d="M12 88Q18 78 26 86Q32 78 40 86Q48 80 52 90H12Z" fill="#f2d6a6" ${S}/><path d="M18 86q4 -3 8 0M34 86q4 -3 8 0" fill="none" stroke="#f6c343" stroke-width="2.2" stroke-linecap="round"/>`,
  // بِطْرِيْقٌ
  penguin: () => `<path d="M38 90h-10q0 -6 10 -6zM62 90h10q0 -6 -10 -6z" fill="#f6a623" ${S}/>
    <path d="M50 8Q78 10 78 50Q80 88 50 90Q20 88 22 50Q22 10 50 8Z" fill="#2e3a4a" ${S}/>
    <path d="M24 46Q12 60 16 74Q24 66 26 56Z" fill="#2e3a4a" ${S}/><path d="M76 46Q88 60 84 74Q76 66 74 56Z" fill="#2e3a4a" ${S}/>
    <path d="M50 22Q34 22 34 40Q30 60 34 74Q40 86 50 86Q60 86 66 74Q70 60 66 40Q66 22 50 22Z" fill="#fff" ${S}/>
    ${eye(43, 34, 4.6)}${eye(57, 34, 4.6)}<path d="M44 43H56L50 51Z" fill="#f6a623" ${S}/>${cheeks(38, 62, 46, 2.6)}`,
  // نِظَامٌ: أطفال يقفون في طابور
  people_in_a_line: () => `<path d="M4 93H96" ${S}/>
    ${[[16, 0.64, girl('#e5484d', '#f6c343')], [39, 0.6, boy('#3aa0e0', '#3a5a7a')], [62, 0.56, girl('#3fa34d', '#fff')], [84, 0.52, boy('#f6c343', '#8a5a3b')]].map(([c, k, g]) => at(c - 50 * k, 92 - 95 * k, k, g)).join('')}`,
  // فُلْفُلٌ: فليفلة حمراء وخضراء وصفراء
  peppers: () => `${pepper(28, 54, '#3fa34d', -12)}${pepper(72, 54, '#f6c343', 12)}${pepper(50, 64, '#e5484d', 0)}`,
  // عُطُوْرٌ: ثلاث قوارير عطر
  perfumes: () => `<path d="M10 92H90" ${S}/>
    <rect x="12" y="50" width="22" height="42" rx="6" fill="#ff8fab" ${S}/><rect x="18" y="40" width="10" height="10" fill="#cfd6dc" ${S}/><circle cx="23" cy="34" r="6" fill="#e5484d" ${S}/>
    <path d="M50 46Q70 58 64 80Q60 92 50 92Q40 92 36 80Q30 58 50 46Z" fill="#9b5de5" ${S}/><rect x="45" y="34" width="10" height="12" fill="#f6c343" ${S}/><path d="M42 34H58L54 24H46Z" fill="#f6c343" ${S}/>
    <path d="M70 62H88V92H70Z" fill="#62d2a2" ${S}/><rect x="75" y="54" width="8" height="8" fill="#cfd6dc" ${S}/><rect x="73" y="46" width="12" height="8" rx="2" fill="#3aa0e0" ${S}/>
    <ellipse cx="18" cy="62" rx="2" ry="6" fill="#fff" opacity=".6"/><ellipse cx="44" cy="66" rx="2" ry="7" fill="#fff" opacity=".6"/><ellipse cx="75" cy="72" rx="2" ry="6" fill="#fff" opacity=".6"/>
    <path d="M62 30q4 -4 0 -8M68 34q4 -4 0 -8" fill="none" stroke="#9b5de5" stroke-width="2" stroke-linecap="round"/>`,
  // صُوْرَةٌ بإطار: جبال وشمس
  picture: () => `<path d="M38 18L50 8L62 18" fill="none" ${S}/><circle cx="50" cy="8" r="2.4" fill="${K}"/>
    <rect x="10" y="18" width="80" height="70" rx="3" fill="#c8794a" ${S}/><rect x="18" y="26" width="64" height="54" fill="#9bd3f0" ${S}/>
    <circle cx="66" cy="40" r="7" fill="#f6c343" ${S}/>
    <path d="M18 80L38 50L52 66L62 56L82 80Z" fill="#3fa34d" ${S}/><path d="M34 56L38 50L42 56Q38 58 34 56Z" fill="#fff"/>`,
  // حَمَامَةٌ
  pigeon: () => `<path d="M24 52Q8 46 6 34Q20 36 30 46Z" fill="#9aa9b8" ${S}/>
    <path d="M22 54Q24 82 54 82Q78 80 80 58Q78 40 64 40Q46 48 22 54Z" fill="#cfd6dc" ${S}/>
    <path d="M36 54Q50 44 66 54Q58 70 40 70Q32 62 36 54Z" fill="#9aa9b8" ${S}/><path d="M42 62H58M44 57H60" fill="none" stroke="#77838f" stroke-width="2" stroke-linecap="round"/>
    <path d="M66 58Q62 44 70 30Q76 22 84 28Q88 38 80 56Z" fill="#cfd6dc" ${S}/>
    <path d="M70 44Q76 52 80 44Q76 40 70 44Z" fill="#8bc6a8"/>${eye(78, 32, 3.6)}
    <path d="M86 32l8 3l-8 2z" fill="#f6a623" ${S}/><path d="M48 82l-2 8M58 82l2 8" stroke="#e5734a" stroke-width="3" stroke-linecap="round"/>`,
  // وِسَادَةٌ
  pillow: () => `<path d="M14 26Q30 30 50 26Q70 22 86 26Q82 50 86 74Q70 78 50 74Q30 70 14 74Q18 50 14 26Z" fill="#9bd3f0" ${S}/>
    <path d="M14 26l-6 -4M86 26l6 -4M14 74l-6 4M86 74l6 4" ${S}/>
    ${[[34, 42], [56, 40], [44, 58], [68, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#fff"/>`).join('')}
    <path d="M30 32Q50 36 70 30" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`,
  // سُهُوْلٌ: حقول منبسطة حتى الأفق
  plain: () => `<rect x="6" y="8" width="88" height="84" rx="6" fill="#bfe6f7" ${S}/>
    <circle cx="74" cy="26" r="9" fill="#f6c343" ${S}/>
    <path d="M7 50Q50 44 93 50V86Q93 91 88 91H12Q7 91 7 86Z" fill="#8fd16a" ${S}/>
    <path d="M7 60Q50 52 93 60V86Q93 91 88 91H12Q7 91 7 86Z" fill="#62b84a" ${S}/>
    <path d="M7 72Q50 64 93 72V86Q93 91 88 91H12Q7 91 7 86Z" fill="#f2c14e" ${S}/>
    ${[[20, 80], [40, 84], [62, 80], [80, 84]].map(([x, y]) => `<path d="M${x} ${y}v-6M${x - 3} ${y - 4}l3 -3l3 3" fill="none" stroke="#c48a1e" stroke-width="2" stroke-linecap="round"/>`).join('')}
    <path d="M22 26q4 -4 8 0q4 -4 8 0" fill="none" ${S}/>`,
  // وِعَاءٌ (طاسة)
  plate: () => `<ellipse cx="50" cy="44" rx="40" ry="11" fill="#fff" ${S}/>
    <path d="M10 44Q12 80 50 82Q88 80 90 44Q70 56 50 55Q30 56 10 44Z" fill="#3aa0e0" ${S}/>
    <ellipse cx="50" cy="44" rx="32" ry="6.5" fill="#cfe9f7"/>
    <path d="M22 60Q50 72 78 60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M36 82L34 90H66L64 82" fill="#2f6f9e" ${S}/>`,
  // رُمَّانٌ: رمانتان ونصف مفتوح
  pomegranates: () => `${pomegranate(30, 44, 20)}${pomegranate(70, 44, 20)}
    <path d="M24 74Q24 94 50 94Q76 94 76 74Z" fill="#d63a3a" ${S}/><ellipse cx="50" cy="74" rx="26" ry="7" fill="#fbe3c8" ${S}/>
    ${[[36, 74], [42, 71], [48, 76], [54, 71], [60, 75], [66, 73], [45, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#c2185b"/>`).join('')}`,
  // بِرْكَةُ ماء بزنابق وقصب
  pond: () => `<ellipse cx="50" cy="66" rx="44" ry="24" fill="#8fd16a" ${S}/>
    <ellipse cx="50" cy="66" rx="36" ry="17" fill="#5bb6e8" ${S}/>
    <path d="M30 62q6 -3 12 0M54 74q6 -3 12 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M60 58A8 5 0 1 0 68 56L62 58Z" fill="#3fa34d" ${S}/><circle cx="34" cy="72" r="4" fill="#ff8fab" ${S}/><path d="M28 72A7 4 0 1 0 40 72" fill="none" stroke="#3fa34d" stroke-width="2.4"/>
    ${[[16, 22], [22, 14], [84, 20], [78, 28]].map(([x, h]) => `<path d="M${x} 58V${h + 10}" stroke="#2f7d32" stroke-width="2.6" stroke-linecap="round"/><rect x="${x - 2.5}" y="${h + 6}" width="5" height="14" rx="2.5" fill="#8a5a3b" ${S}/>`).join('')}`,
  // يَقْطِيْنٌ
  pumpkin: () => `<path d="M48 26Q46 14 54 8" fill="none" stroke="#2f7d32" stroke-width="6" stroke-linecap="round"/>
    <path d="M56 22Q72 10 80 22Q68 28 56 22Z" fill="#3fa34d" ${S}/>
    <ellipse cx="28" cy="60" rx="20" ry="30" fill="#f08c1c" ${S}/><ellipse cx="72" cy="60" rx="20" ry="30" fill="#f08c1c" ${S}/>
    <ellipse cx="40" cy="60" rx="15" ry="32" fill="#ff9f1c" ${S}/><ellipse cx="60" cy="60" rx="15" ry="32" fill="#ff9f1c" ${S}/>
    <ellipse cx="50" cy="60" rx="12" ry="33" fill="#ffad33" ${S}/><ellipse cx="46" cy="44" rx="3" ry="8" fill="#fff" opacity=".4"/>`,
  // أَرْنَبٌ
  rabbit: () => `<ellipse cx="38" cy="22" rx="7" ry="20" fill="#fff" ${S}/><ellipse cx="38" cy="24" rx="3" ry="13" fill="#f7a8b8"/>
    <ellipse cx="62" cy="22" rx="7" ry="20" fill="#fff" ${S}/><ellipse cx="62" cy="24" rx="3" ry="13" fill="#f7a8b8"/>
    <circle cx="80" cy="78" r="7" fill="#fff" ${S}/>
    <ellipse cx="54" cy="76" rx="26" ry="18" fill="#fff" ${S}/>
    <ellipse cx="38" cy="90" rx="9" ry="5" fill="#fff" ${S}/><ellipse cx="62" cy="90" rx="9" ry="5" fill="#fff" ${S}/>
    <circle cx="50" cy="50" r="19" fill="#fff" ${S}/>
    ${eye(43, 47, 4)}${eye(57, 47, 4)}<path d="M47 55h6l-3 3z" fill="#f7a8b8" ${S}/><path d="M50 58q-3 4 -6 2M50 58q3 4 6 2" fill="none" ${S}/>${cheeks(38, 62, 56, 2.8)}`,
  // مِذْيَاعٌ قديم بهوائي
  radio: () => `<path d="M62 32L82 8" ${S}/><circle cx="82" cy="8" r="3" fill="${K}"/>
    <rect x="10" y="32" width="80" height="54" rx="10" fill="#e5484d" ${S}/>
    <circle cx="36" cy="59" r="17" fill="#f4e3c3" ${S}/>
    ${[-10, -5, 0, 5, 10].map((d) => `<path d="M${36 - Math.sqrt(150 - d * d).toFixed(1)} ${59 + d}H${(36 + Math.sqrt(150 - d * d)).toFixed(1)}" stroke="#c8a26a" stroke-width="2.2" stroke-linecap="round"/>`).join('')}
    <rect x="60" y="42" width="22" height="12" rx="2" fill="#fff8e0" ${S}/><path d="M64 48H78M70 44V52" stroke="#e5484d" stroke-width="2"/>
    <circle cx="64" cy="70" r="5" fill="#f6c343" ${S}/><circle cx="78" cy="70" r="5" fill="#f6c343" ${S}/>
    <rect x="18" y="86" width="10" height="6" rx="2" fill="${K}"/><rect x="72" y="86" width="10" height="6" rx="2" fill="${K}"/>`,
  // مِزْمَارٌ (فلوت)
  recorder_flute: () => `<g transform="rotate(-45 50 50)"><path d="M6 44H20Q22 42 26 42H86Q94 44 94 50Q94 56 86 58H26Q22 58 20 56H6Q2 50 6 44Z" fill="#f2d6a6" ${S}/>
    <path d="M6 44Q2 50 6 56L14 52V48Z" fill="#c8794a" ${S}/><rect x="20" y="46" width="6" height="4" fill="${K}"/>
    <path d="M84 42V58" ${S}/><path d="M30 42V58" stroke="#c8a26a" stroke-width="2"/>
    ${[38, 46, 54, 62, 70, 77].map((x) => `<circle cx="${x}" cy="50" r="2.6" fill="${K}"/>`).join('')}</g>
    <path d="M70 18q6 -2 8 4M80 12q6 -2 8 4" fill="none" stroke="#9b5de5" stroke-width="2.4" stroke-linecap="round"/><circle cx="70" cy="22" r="3" fill="#9b5de5"/><circle cx="80" cy="16" r="3" fill="#9b5de5"/>`,
  // مُسْتَطِيْلٌ
  rectangle: () => `<rect x="10" y="26" width="80" height="48" rx="2" fill="#3aa0e0" ${S}/>
    <circle cx="10" cy="26" r="3.4" fill="${K}"/><circle cx="90" cy="26" r="3.4" fill="${K}"/><circle cx="10" cy="74" r="3.4" fill="${K}"/><circle cx="90" cy="74" r="3.4" fill="${K}"/>`,
  // رُزٌّ: صحن رز أبيض
  rice: () => `<path d="M14 54Q14 36 50 30Q86 36 86 54Z" fill="#fffdf6" ${S}/>
    ${[[30, 46, 20], [40, 40, -30], [50, 36, 10], [60, 41, 40], [70, 47, -20], [36, 50, 60], [48, 46, -10], [58, 48, 30], [44, 42, 70], [64, 52, -50], [26, 52, 0], [54, 41, -60]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="1.4" transform="rotate(${r} ${x} ${y})" fill="#e8dcc0"/>`).join('')}
    <ellipse cx="50" cy="56" rx="44" ry="10" fill="#f6c343" ${S}/><ellipse cx="50" cy="55" rx="36" ry="6" fill="#fff" ${S}/>
    <path d="M6 56Q8 80 50 82Q92 80 94 56" fill="#3aa0e0" ${S}/><path d="M28 72Q50 78 72 72" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="68" y="12" width="6" height="26" rx="3" transform="rotate(30 71 25)" fill="#cfd6dc" ${S}/>`,
  // خَاتَمٌ بفص
  ring: () => `<ellipse cx="50" cy="62" rx="30" ry="28" fill="none" stroke="${K}" stroke-width="13"/>
    <ellipse cx="50" cy="62" rx="30" ry="28" fill="none" stroke="#f6c343" stroke-width="8"/>
    <path d="M36 50Q30 58 32 70" fill="none" stroke="#fff3b0" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M38 30H62L54 42H46Z" fill="#f0a91c" ${S}/>
    <path d="M36 22L42 12H58L64 22L50 38Z" fill="#e5484d" ${S}/><path d="M36 22H64M42 12L46 22L50 38L54 22L58 12" fill="none" stroke="#a8282d" stroke-width="1.8"/>
    <path d="M70 12l2 -4M76 18l4 -2" stroke="#f6c343" stroke-width="2.4" stroke-linecap="round"/>`,
  // صَخْرَةٌ
  rock: () => `<ellipse cx="50" cy="86" rx="40" ry="5" fill="#8fd16a" ${S}/>
    <path d="M12 86Q8 60 24 46Q32 24 54 26Q74 22 84 44Q94 62 88 86Z" fill="#a7a39b" ${S}/>
    <path d="M30 50Q40 40 52 44M58 60Q70 56 76 66M24 72Q34 68 40 74" fill="none" stroke="#77736b" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M40 34Q50 30 60 32" fill="none" stroke="#d2cfc8" stroke-width="3" stroke-linecap="round"/>`,
  // صَارُوْخٌ
  rocket: () => `<path d="M42 78Q50 100 58 78Z" fill="#ff9f1c" ${S}/><path d="M46 78Q50 90 54 78Z" fill="#f6c343"/>
    <path d="M36 58L22 80L38 76Z" fill="#e5484d" ${S}/><path d="M64 58L78 80L62 76Z" fill="#e5484d" ${S}/>
    <path d="M50 6Q70 24 66 60L62 78H38L34 60Q30 24 50 6Z" fill="#f2f2f2" ${S}/>
    <path d="M50 6Q60 14 64 26H36Q40 14 50 6Z" fill="#e5484d" ${S}/>
    <circle cx="50" cy="44" r="9" fill="#9bd3f0" ${S}/><circle cx="47" cy="41" r="2.5" fill="#fff"/>
    <path d="M50 78V66" stroke="#e5484d" stroke-width="3" stroke-linecap="round"/>
    <circle cx="16" cy="20" r="2" fill="#f6c343"/><circle cx="84" cy="34" r="2" fill="#f6c343"/><circle cx="82" cy="12" r="1.6" fill="#f6c343"/>`,
  // لُعْبَةٌ: حصان هزاز
  rocking_horse: () => `<path d="M8 82Q50 102 92 82" fill="none" stroke="#c8794a" stroke-width="9" stroke-linecap="round"/><path d="M8 82Q50 102 92 82" fill="none" stroke="${K}" stroke-width="2"/>
    <path d="M30 60L22 86M40 62L38 90M62 62L64 90M72 60L80 86" ${S} stroke-width="5"/>
    <path d="M30 50Q30 40 44 40H64Q76 40 76 52Q76 64 62 64H40Q30 64 30 50Z" fill="#f6c343" ${S}/>
    <path d="M44 42H60V64H44Z" fill="#e5484d" ${S}/>
    <path d="M64 46Q64 26 72 14Q86 14 88 30Q84 34 78 30Q76 40 76 52Z" fill="#f6c343" ${S}/>
    <path d="M70 14Q60 18 62 32Q66 22 72 22" fill="#c8794a" ${S}/><path d="M30 46Q20 48 18 62Q26 56 30 54Z" fill="#c8794a" ${S}/>
    ${eye(78, 22, 3)}<circle cx="86" cy="28" r="1.4" fill="${K}"/><path d="M74 14l2 -8l4 8" fill="#f6c343" ${S}/>`,
  // صُخُوْرٌ: كومة صخور
  rocks: () => `<path d="M6 90H94" ${S}/>${rockAt(28, 76, 0.7, '#a7a39b')}${rockAt(72, 76, 0.75, '#b9a58d')}${rockAt(50, 50, 0.85, '#8f8b84')}`,
  // دِيْكٌ
  rooster: () => `<path d="M32 56Q10 46 16 16Q24 38 36 48Z" fill="#2f7d32" ${S}/><path d="M30 60Q4 58 6 32Q16 50 32 54Z" fill="#3aa0e0" ${S}/><path d="M30 64Q6 72 8 50Q18 62 30 60Z" fill="#a8282d" ${S}/>
    <path d="M44 80L42 92M58 80L60 92M36 92H48M54 92H66" stroke="#f6a623" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="50" cy="62" rx="24" ry="20" fill="#c8794a" ${S}/>
    <path d="M40 58Q50 52 60 62Q52 76 40 70Z" fill="#a8582e" ${S}/>
    <path d="M62 56Q60 30 70 22Q82 20 82 36Q80 48 72 62Z" fill="#e07b2a" ${S}/>
    <path d="M66 22Q66 12 70 16Q72 8 76 14Q80 10 80 22Z" fill="#e5484d" ${S}/>
    ${eye(73, 31, 3.4)}<path d="M82 32l9 3l-9 4z" fill="#f6c343" ${S}/>
    <path d="M78 40Q80 48 76 50Q72 46 76 40Z" fill="#e5484d" ${S}/>`,
  // وَرْدَةٌ حمراء
  rose: () => `<path d="M50 50V94" stroke="#2f7d32" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 74Q34 60 22 68Q34 82 50 76Z" fill="#3fa34d" ${S}/><path d="M50 66Q66 52 78 60Q66 74 50 68Z" fill="#3fa34d" ${S}/>
    <path d="M28 30Q24 54 50 58Q76 54 72 30Q62 40 50 36Q38 40 28 30Z" fill="#d63a3a" ${S}/>
    <path d="M32 26Q36 8 50 12Q64 8 68 26Q60 36 50 34Q40 36 32 26Z" fill="#e5484d" ${S}/>
    <path d="M40 24Q44 16 52 18Q60 20 58 28Q50 32 44 28" fill="none" ${S}/><path d="M48 24Q52 20 54 24" fill="none" ${S}/>`,
  // دُوْرٌ: صف بيوت
  row_of_houses: () => `<path d="M4 92H96" ${S}/>${house(8, 54, 24, 38, '#f4e3c3', '#e5484d')}${house(38, 46, 26, 46, '#fbd38d', '#3aa0e0')}${house(70, 56, 22, 36, '#cfe9c7', '#c8794a')}`,
  // مِسْطَرَةٌ
  ruler: () => `<g transform="rotate(-30 50 50)"><rect x="4" y="38" width="92" height="24" rx="3" fill="#f6c343" ${S}/>
    ${[...Array(17)].map((_, i) => `<path d="M${10 + i * 5} 38v${i % 4 === 0 ? 11 : i % 2 === 0 ? 8 : 5}" stroke="${K}" stroke-width="1.8" stroke-linecap="round"/>`).join('')}</g>`,
  // شِرَاعٌ: قارب شراعي
  sailboat: () => `<path d="M6 86Q18 80 30 86Q42 92 54 86Q66 80 78 86Q88 92 94 86V94H6Z" fill="#5bb6e8" ${S}/>
    <path d="M48 10V72" ${S}/><path d="M52 14Q80 40 82 66H52Z" fill="#fff" ${S}/><path d="M44 22Q24 44 20 66H44Z" fill="#e5484d" ${S}/>
    <path d="M48 10l12 4l-12 4" fill="#f6c343" ${S}/>
    <path d="M12 70H88L78 86H22Z" fill="#c8794a" ${S}/><circle cx="36" cy="77" r="2.6" fill="#fff" ${S}/><circle cx="64" cy="77" r="2.6" fill="#fff" ${S}/>`,
  // قُبْطَانٌ بقبعة وسترة كحلية
  sailor_captain: () => `<rect x="38" y="78" width="10" height="16" rx="3" fill="#1f3a5f" ${S}/><rect x="52" y="78" width="10" height="16" rx="3" fill="#1f3a5f" ${S}/>
    <path d="M28 82V64Q28 52 50 52Q72 52 72 64V82Z" fill="#1f3a5f" ${S}/>
    <path d="M44 53L50 64L56 53Z" fill="#fff" ${S}/><circle cx="44" cy="70" r="2" fill="#f6c343"/><circle cx="56" cy="70" r="2" fill="#f6c343"/><circle cx="44" cy="77" r="2" fill="#f6c343"/><circle cx="56" cy="77" r="2" fill="#f6c343"/>
    <path d="M28 60h8M64 60h8" stroke="#f6c343" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="34" r="15" fill="#f6c9a6" ${S}/>
    <path d="M38 40Q50 54 62 40Q60 48 50 50Q40 48 38 40Z" fill="#9aa9b8" ${S}/>
    ${eye(44, 33, 3.2)}${eye(56, 33, 3.2)}${smile(50, 40, 3.5)}
    <path d="M32 24Q30 10 50 10Q70 10 68 24Z" fill="#fff" ${S}/><path d="M30 24H70Q70 28 66 28H34Q30 28 30 24Z" fill="#1f3a5f" ${S}/>
    <path d="M46 16H54L50 21Z" fill="#f6c343" ${S}/>`,
  // رَمْلٌ: كثبان رملية ودلو ومجرفة
  sand: () => `<circle cx="76" cy="20" r="9" fill="#f6c343" ${S}/>
    <path d="M6 56Q30 36 54 56Q74 40 94 54V92H6Z" fill="#f2c98a" ${S}/>
    <path d="M6 72Q36 58 60 74Q78 64 94 72V92H6Z" fill="#e8b46a" ${S}/>
    <path d="M22 50q8 -6 16 0M70 50q6 -4 12 0" fill="none" stroke="#d29a4e" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M30 70H50L47 88H33Z" fill="#e5484d" ${S}/><path d="M32 70Q40 58 48 70" fill="none" ${S}/>
    <path d="M66 58L62 78" ${S} stroke-width="3"/><path d="M58 76L68 78L64 88L56 84Z" fill="#3aa0e0" ${S}/>
    ${[[18, 84], [76, 86], [84, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#c48a3e"/>`).join('')}`,
  // مَنَاشِيْرُ: منشاران
  saws: () => `${saw(28, '#e5484d')}${saw(68, '#3aa0e0')}`,
  // مِيْزَانٌ بكفتين
  scale: () => `<path d="M30 92H70L64 84H36Z" fill="#c8794a" ${S}/><rect x="47" y="24" width="6" height="62" fill="#f6c343" ${S}/>
    <path d="M14 30H86" ${S} stroke-width="4"/><circle cx="50" cy="24" r="6" fill="#f6c343" ${S}/>
    <path d="M18 30L8 58M18 30L28 58M82 30L72 58M82 30L92 58" stroke="${K}" stroke-width="1.8"/>
    <path d="M4 58H32Q30 70 18 70Q6 70 4 58Z" fill="#f6c343" ${S}/><path d="M68 58H96Q94 70 82 70Q70 70 68 58Z" fill="#f6c343" ${S}/>
    <circle cx="13" cy="54" r="5" fill="#e5484d" ${S}/><circle cx="23" cy="54" r="5" fill="#3fa34d" ${S}/><rect x="74" y="48" width="16" height="10" rx="2" fill="#9aa9b8" ${S}/>`,
  // مَدْرَسَةٌ بعلم وساحة
  school: () => `<path d="M50 8V26" ${S}/>
    <rect x="50" y="8" width="18" height="4" fill="#e5484d"/><rect x="50" y="12" width="18" height="4" fill="#fff"/><rect x="50" y="16" width="18" height="4" fill="#2e2e2e"/><rect x="50" y="8" width="18" height="12" fill="none" stroke="${K}" stroke-width="1.8"/><path d="M56 14q3 -1.5 6 0" stroke="#2f9e44" stroke-width="1.4" fill="none"/>
    <rect x="8" y="40" width="84" height="52" fill="#fbd38d" ${S}/>
    <path d="M4 42L50 24L96 42Z" fill="#e5484d" ${S}/>
    <circle cx="50" cy="34" r="4" fill="#fff" ${S}/>
    <path d="M42 92V72Q42 66 50 66Q58 66 58 72V92Z" fill="#3aa0e0" ${S}/><path d="M50 66V92" stroke="${K}" stroke-width="1.8"/>
    ${[14, 30, 62, 78].map((x) => `<rect x="${x}" y="50" width="10" height="10" fill="#9bd3f0" ${S}/><rect x="${x}" y="70" width="10" height="10" fill="#9bd3f0" ${S}/>`).join('')}
    <rect x="44" y="48" width="12" height="10" fill="#9bd3f0" ${S}/>`,
  // حَقِيْبَةٌ مدرسية
  schoolbag: () => `<path d="M38 22Q38 8 50 8Q62 8 62 22" fill="none" ${S} stroke-width="5"/><path d="M38 22Q38 8 50 8Q62 8 62 22" fill="none" stroke="#e5484d" stroke-width="2.2"/>
    <rect x="20" y="20" width="60" height="72" rx="14" fill="#e5484d" ${S}/>
    <path d="M20 44Q50 54 80 44" fill="none" ${S}/><path d="M20 34Q20 20 34 20H66Q80 20 80 34V44Q50 54 20 44Z" fill="#c8323a" ${S}/>
    <rect x="30" y="58" width="40" height="26" rx="6" fill="#f6c343" ${S}/><path d="M30 66H70" fill="none" ${S}/>
    <rect x="46" y="44" width="8" height="10" rx="2" fill="#cfd6dc" ${S}/>`,
  // تِلْمِيْذَةٌ بحجاب وزي مدرسي وحقيبة
  schoolgirl: () => `${girl('#7d93b5', '#fff')}
    <path d="M42 58H58V95H42Z" fill="#f2f2f2" opacity="0"/>
    <path d="M44 58L50 66L56 58" fill="#fff" ${S}/>
    <rect x="62" y="56" width="22" height="28" rx="6" fill="#e5484d" ${S}/><path d="M60 58Q58 66 62 70" fill="none" ${S}/>
    <rect x="66" y="68" width="14" height="10" rx="3" fill="#f6c343" ${S}/>
    <rect x="12" y="66" width="20" height="16" rx="2" fill="#3fa34d" ${S}/><path d="M22 66V82" stroke="#fff" stroke-width="2"/>`,
  // عَالِمٌ بمعطف ونظارة ودورق
  scientist: () => `<rect x="38" y="78" width="10" height="16" rx="3" fill="#3a5a7a" ${S}/><rect x="52" y="78" width="10" height="16" rx="3" fill="#3a5a7a" ${S}/>
    <path d="M28 86V64Q28 52 50 52Q72 52 72 64V86Z" fill="#fff" ${S}/><path d="M50 56V86" stroke="${K}" stroke-width="1.8"/>
    <path d="M44 53L50 62L56 53" fill="#9bd3f0" ${S}/>
    <circle cx="50" cy="32" r="16" fill="#f6c9a6" ${S}/>
    <path d="M34 30Q32 12 50 13Q68 12 66 30Q62 20 50 20Q38 20 34 30Z" fill="#5a3a22" ${S}/>
    <circle cx="44" cy="32" r="5.5" fill="#fff" ${S}/><circle cx="56" cy="32" r="5.5" fill="#fff" ${S}/><path d="M49.5 32h1" ${S}/>
    <circle cx="44.6" cy="32.6" r="2.2" fill="${K}"/><circle cx="56.6" cy="32.6" r="2.2" fill="${K}"/>${smile(50, 41, 4)}
    <path d="M78 54V64L88 82Q90 88 84 88H72Q66 88 68 82L76 64V54Z" fill="#fff" ${S}/><path d="M71 76H85L88 82Q90 88 84 88H72Q66 88 68 82Z" fill="#62d2a2"/>
    <path d="M78 54V64L88 82Q90 88 84 88H72Q66 88 68 82L76 64V54Z" fill="none" ${S}/><path d="M74 54H80" ${S}/>
    <circle cx="80" cy="46" r="2.6" fill="#62d2a2" ${S}/><circle cx="84" cy="38" r="1.8" fill="#62d2a2" ${S}/>
    <circle cx="70" cy="74" r="4" fill="#f6c9a6" ${S}/>`,
  // مِقَصٌّ
  scissors: () => `<path d="M48 54L86 12Q90 14 88 18L56 60Z" fill="#cfd6dc" ${S}/><path d="M52 54L14 12Q10 14 12 18L44 60Z" fill="#e8edf1" ${S}/>
    <circle cx="50" cy="55" r="3" fill="${K}"/>
    <path d="M44 60Q30 64 26 76" fill="none" ${S}/><path d="M56 60Q70 64 74 76" fill="none" ${S}/>
    <ellipse cx="28" cy="80" rx="13" ry="11" fill="none" stroke="${K}" stroke-width="10"/><ellipse cx="28" cy="80" rx="13" ry="11" fill="none" stroke="#e5484d" stroke-width="5"/>
    <ellipse cx="72" cy="80" rx="13" ry="11" fill="none" stroke="${K}" stroke-width="10"/><ellipse cx="72" cy="80" rx="13" ry="11" fill="none" stroke="#e5484d" stroke-width="5"/>
    <path d="M44 62L36 68M56 62L64 68" stroke="#e5484d" stroke-width="6" stroke-linecap="round"/>`,
  // عَقْرَبٌ لطيف
  scorpion: () => `${[0, 1, 2].map((i) => `<path d="M40 ${60 + i * 7}L${28 - i * 2} ${62 + i * 9}L${24 - i * 2} ${70 + i * 9}M60 ${60 + i * 7}L${72 + i * 2} ${62 + i * 9}L${76 + i * 2} ${70 + i * 9}" fill="none" ${S}/>`).join('')}
    <path d="M50 76Q50 92 64 92Q82 90 86 72Q88 60 80 54" fill="none" stroke="${K}" stroke-width="12" stroke-linecap="round"/>
    <path d="M50 76Q50 92 64 92Q82 90 86 72Q88 60 80 54" fill="none" stroke="#e0a03a" stroke-width="7" stroke-linecap="round"/>
    <path d="M80 56Q70 50 74 42Q80 46 84 52Z" fill="#c8794a" ${S}/>
    ${[1, -1].map((d) => { const X = (x) => 50 + d * (x - 50); return `<path d="M${X(42)} 46L${X(28)} 32" ${S} stroke-width="5" fill="none"/><path d="M${X(28)} 34Q${X(12)} 34 ${X(14)} 20Q${X(20)} 16 ${X(24)} 24Q${X(22)} 12 ${X(32)} 14Q${X(36)} 28 ${X(28)} 34Z" fill="#e0a03a" ${S}/>`; }).join('')}
    <ellipse cx="50" cy="66" rx="13" ry="16" fill="#e0a03a" ${S}/><path d="M38 64H62M39 72H61" stroke="#b97f2a" stroke-width="2"/>
    <circle cx="50" cy="46" r="12" fill="#e0a03a" ${S}/>${eye(45, 45, 3.6)}${eye(55, 45, 3.6)}${smile(50, 52, 3)}`,
};
