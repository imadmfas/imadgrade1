// batch1 — original SVG art, 100×100 viewBox
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const S2 = `stroke="${K}" stroke-width="5.2" stroke-linejoin="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;
const SK = '#f6c9a6';
const R = (n) => Math.round(n * 10) / 10;

// outlined limb / thick stroke with colour inside
const limb = (d, col, w = 4) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// friendly front-facing child head
const head = (x, y, r = 13, hair = '#5a3a22') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SK}" ${S}/>
  <path d="M${R(x - r)} ${y}Q${R(x - r)} ${R(y - r - 3)} ${x} ${R(y - r - 1)}Q${R(x + r)} ${R(y - r - 3)} ${R(x + r)} ${y}Q${R(x + r * 0.5)} ${R(y - r * 0.5)} ${x} ${R(y - r * 0.55)}Q${R(x - r * 0.5)} ${R(y - r * 0.5)} ${R(x - r)} ${y}Z" fill="${hair}" ${S}/>
  ${eye(R(x - r * 0.38), R(y + r * 0.12), R(r * 0.24))}${eye(R(x + r * 0.38), R(y + r * 0.12), R(r * 0.24))}
  <path d="M${R(x - r * 0.3)} ${R(y + r * 0.5)}Q${x} ${R(y + r * 0.78)} ${R(x + r * 0.3)} ${R(y + r * 0.5)}" fill="none" ${S}/>
  <circle cx="${R(x - r * 0.64)}" cy="${R(y + r * 0.45)}" r="${R(r * 0.16)}" fill="#f7a8b8" opacity=".7"/><circle cx="${R(x + r * 0.64)}" cy="${R(y + r * 0.45)}" r="${R(r * 0.16)}" fill="#f7a8b8" opacity=".7"/>`;
// profile head facing right, white cap
const headP = (x, y, r = 12) => `<circle cx="${R(x + r * 0.95)}" cy="${y + 2}" r="2.6" fill="${SK}" ${S}/><circle cx="${x}" cy="${y}" r="${r}" fill="${SK}" ${S}/>
  <path d="M${R(x - r)} ${y - 1}Q${R(x - r)} ${R(y - r - 3)} ${x} ${R(y - r - 3)}Q${R(x + r)} ${R(y - r - 3)} ${R(x + r)} ${y - 3}Z" fill="#fff" ${S}/>
  <circle cx="${R(x - r * 0.25)}" cy="${y + 2}" r="3" fill="${SK}" ${S}/>
  ${eye(R(x + r * 0.45), y + 1, 2.8)}<path d="M${R(x + r * 0.35)} ${R(y + r * 0.55)}Q${R(x + r * 0.6)} ${R(y + r * 0.72)} ${R(x + r * 0.8)} ${R(y + r * 0.45)}" fill="none" ${S}/>
  <circle cx="${R(x + r * 0.15)}" cy="${R(y + r * 0.45)}" r="2" fill="#f7a8b8" opacity=".7"/>`;
// small bird at origin (≈52×36), facing right
const bird = (x, y, s, col, wing = '#8a5a3b') => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-2 11v7M5 11v7" fill="none" ${S}/>
  <path d="M-13 -2L-27 -9L-25 5Z" fill="${wing}" ${S}/>
  <ellipse cx="0" cy="2" rx="16" ry="12" fill="${col}" ${S}/><ellipse cx="4" cy="6" rx="9" ry="5.5" fill="#f2e6c9"/>
  <path d="M-10 -1Q0 -6 6 3Q-2 10 -11 4Z" fill="${wing}" ${S}/>
  <circle cx="11" cy="-9" r="9" fill="${col}" ${S}/>
  <path d="M19 -11L26 -8L19 -5Z" fill="#f6a623" ${S}/>${eye(13, -11, 3)}</g>`;
const bone = (x, y, rot, s = 1) => {
  const shape = (st) => `<rect x="-24" y="-6" width="48" height="12" fill="#fbf2dc" ${st}/>${[[-24, -7], [-24, 7], [24, -7], [24, 7]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="8" fill="#fbf2dc" ${st}/>`).join('')}`;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${shape(S2)}${shape('')}<path d="M-14 -2H10" stroke="#e6d3a8" stroke-width="2.4" stroke-linecap="round"/></g>`;
};
const wrapped = (x, y, rot, s, col, st = '#fff') => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <path d="M-12 0L-27 -11L-24 0L-27 11Z" fill="${col}" ${S}/><path d="M12 0L27 -11L24 0L27 11Z" fill="${col}" ${S}/>
  <ellipse cx="0" cy="0" rx="15" ry="11" fill="${col}" ${S}/>
  <path d="M-6 -9Q-1 0 -6 9M4 -10Q9 0 4 10" fill="none" stroke="${st}" stroke-width="3" stroke-linecap="round"/></g>`;
const bull = (x, y, s, col) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M30 -2Q40 6 37 16" fill="none" ${S}/><circle cx="37" cy="17" r="2.6" fill="${K}"/>
  ${[-4, 6, 18, 28].map((a) => `<rect x="${a}" y="10" width="7" height="16" rx="3" fill="${col}" ${S}/>`).join('')}
  <ellipse cx="12" cy="4" rx="22" ry="14" fill="${col}" ${S}/>
  <path d="M-22 -12Q-34 -20 -30 -30Q-26 -20 -18 -18Z" fill="#f2e6c9" ${S}/><path d="M-10 -12Q2 -20 -2 -30Q-6 -20 -14 -18Z" fill="#f2e6c9" ${S}/>
  <ellipse cx="-16" cy="-4" rx="12" ry="13" fill="${col}" ${S}/>
  ${eye(-21, -7, 3)}${eye(-11, -7, 3)}
  <ellipse cx="-16" cy="5" rx="9" ry="6" fill="#f2b8a0" ${S}/><circle cx="-19" cy="5" r="1.4" fill="${K}"/><circle cx="-13" cy="5" r="1.4" fill="${K}"/></g>`;
const peel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-6 0Q-28 8 -34 36Q-20 30 -3 12Z" fill="#ffd95a" ${S}/>
  <path d="M6 0Q28 8 34 36Q20 30 3 12Z" fill="#ffd95a" ${S}/>
  <path d="M-6 6Q-4 32 0 46Q8 32 6 6Z" fill="#fff3c4" ${S}/>
  <ellipse cx="0" cy="2" rx="10" ry="8" fill="#ffd95a" ${S}/>
  <path d="M-3 -4L-1 -16H4L3 -4Z" fill="#8a5a3b" ${S}/>
  ${[[-34, 36], [0, 46], [34, 36]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.6" fill="#6b4a2a"/>`).join('')}</g>`;
const leaf = (x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0Q12 -11 26 0Q12 11 0 0Z" fill="#3fa34d" ${S}/><path d="M3 0H20" stroke="#2c7a37" stroke-width="2" stroke-linecap="round"/></g>`;
const drop = (x, y) => `<path d="M${x} ${y - 5}Q${x + 4} ${y + 1} ${x} ${y + 3}Q${x - 4} ${y + 1} ${x} ${y - 5}Z" fill="#8fd3f5" ${S}/>`;

export const ART_BATCH1 = {
  // وُضُوء: ماء من الصنبور في كفّين
  ablution: () => `<path d="M24 96L30 74L44 80L38 96Z" fill="${SK}" ${S}/><path d="M80 96L74 74L60 80L66 96Z" fill="${SK}" ${S}/>
    <rect x="16" y="88" width="24" height="10" rx="3" fill="#3aa0e0" ${S}/><rect x="64" y="88" width="24" height="10" rx="3" fill="#3aa0e0" ${S}/>
    <path d="M26 64Q28 88 52 88Q76 88 78 64Q66 72 52 72Q38 72 26 64Z" fill="${SK}" ${S}/>
    <path d="M38 76Q40 81 38 86M66 76Q64 81 66 86" fill="none" ${S}/>
    <ellipse cx="52" cy="70" rx="13" ry="3.6" fill="#8fd3f5"/>
    <path d="M6 14H46Q58 14 58 26V32H46V26H6Z" fill="#b9c4cf" ${S}/><rect x="20" y="5" width="12" height="9" rx="3" fill="#3aa0e0" ${S}/>
    <rect x="47" y="32" width="10" height="38" rx="5" fill="#8fd3f5" ${S}/>
    ${drop(34, 56)}${drop(72, 52)}${drop(80, 62)}${drop(24, 50)}`,
  // مُنَبِّه
  alarm_clock: () => `<path d="M32 80L22 94M68 80L78 94" fill="none" ${S}/>
    <path d="M30 18Q50 4 70 18" fill="none" ${S}/><rect x="47" y="8" width="6" height="10" rx="2" fill="#9aa9b8" ${S}/>
    <path d="M14 30A14 14 0 0 1 36 12Z" fill="#f6c343" ${S}/><path d="M86 30A14 14 0 0 0 64 12Z" fill="#f6c343" ${S}/>
    <circle cx="50" cy="54" r="34" fill="#e5484d" ${S}/><circle cx="50" cy="54" r="26" fill="#fff" ${S}/>
    ${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${R(50 + 21 * Math.sin(a))} ${R(54 - 21 * Math.cos(a))}L${R(50 + 24 * Math.sin(a))} ${R(54 - 24 * Math.cos(a))}" ${S}/>`; }).join('')}
    <path d="M50 54V38M50 54H63" fill="none" ${S}/><circle cx="50" cy="54" r="3" fill="${K}"/>`,
  // نَمْل: ثلاث نملات
  ants: () => [[52, 22, 1], [30, 52, 1], [64, 80, 1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-3 0L-10 -11M-3 0L-12 12M1 0L0 -13M1 0L1 14M5 0L12 -11M5 0L13 12M13 -5Q16 -15 23 -15M16 -3Q22 -11 27 -8" fill="none" ${S}/>
    <ellipse cx="-14" cy="1" rx="11" ry="8.5" fill="#8b3a2a" ${S}/><circle cx="2" cy="0" r="5.5" fill="#8b3a2a" ${S}/>
    <circle cx="15" cy="0" r="7.5" fill="#8b3a2a" ${S}/>${eye(17, -1, 2.8)}<path d="M15 4Q18 6 21 4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g>`).join(''),
  // تُفَّاحَة
  apple: () => `<path d="M50 30Q36 18 24 28Q10 42 18 66Q28 92 50 84Q72 92 82 66Q90 42 76 28Q64 18 50 30Z" fill="#e5484d" ${S}/>
    <path d="M50 30Q50 18 56 10" fill="none" ${S}/><path d="M55 20Q66 6 80 12Q70 26 55 20Z" fill="#3fa34d" ${S}/>
    <ellipse cx="32" cy="46" rx="5" ry="10" fill="#ff8a8a" transform="rotate(20 32 46)"/>`,
  // مِشْمِش
  apricots: () => `${[[32, 44], [68, 44], [50, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="#f9a43c" ${S}/><circle cx="${x + 6}" cy="${y + 5}" r="9" fill="#f07a34" opacity=".55"/>
    <path d="M${x} ${y - 18}Q${x - 8} ${y} ${x - 2} ${y + 16}" fill="none" stroke="#d9802a" stroke-width="2.2" stroke-linecap="round"/><circle cx="${x - 8}" cy="${y - 7}" r="3.5" fill="#ffd08a"/>`).join('')}
    ${leaf(32, 26, -60, 0.8)}${leaf(68, 26, -120, 0.8)}`,
  // ذِرَاع مثنية تُظهر العضلة
  arm: () => `<path d="M14 60Q32 42 52 56L50 36Q50 28 58 28H64Q72 28 72 36L74 74Q74 86 60 86H14Z" fill="${SK}" ${S}/>
    <path d="M30 56Q40 50 48 58" fill="none" ${S}/>
    <rect x="44" y="8" width="32" height="26" rx="11" fill="${SK}" ${S}/>
    <path d="M52 10V20M60 9V20M68 10V20" fill="none" ${S}/><path d="M44 24Q52 30 60 26" fill="none" ${S}/>
    <rect x="4" y="52" width="20" height="38" rx="6" fill="#3aa0e0" ${S}/>`,
  // سَهْم
  arrow: () => `<g transform="rotate(-30 50 50)"><rect x="18" y="47" width="60" height="6" rx="2" fill="#c8794a" ${S}/>
    <path d="M76 36L96 50L76 64Z" fill="#9aa9b8" ${S}/>
    <path d="M6 38H20L30 50H16Z" fill="#e5484d" ${S}/><path d="M6 62H20L30 50H16Z" fill="#e5484d" ${S}/></g>`,
  // فَأْس
  axe: () => `<g transform="rotate(32 50 50)"><rect x="45" y="18" width="10" height="78" rx="5" fill="#c8794a" ${S}/>
    <path d="M55 14H66Q86 12 90 36Q76 34 66 38H55Z" fill="#9aa9b8" ${S}/><path d="M80 18Q88 24 89 34" fill="none" stroke="#e8eef3" stroke-width="3" stroke-linecap="round"/>
    <path d="M45 14H56V40H45Z" fill="#6f7c8a" ${S}/></g>`,
  // رَضِيْع ملفوف بقماط
  baby: () => `<path d="M22 54Q18 12 50 12Q82 12 78 54Z" fill="#9bd3f0" ${S}/>
    <path d="M24 50Q18 94 50 95Q82 94 76 50Z" fill="#9bd3f0" ${S}/><path d="M28 62Q50 76 74 60M30 78Q50 88 70 76" fill="none" stroke="#5fb2e0" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="50" cy="42" r="20" fill="${SK}" ${S}/>
    <path d="M46 24Q48 16 56 20Q50 20 52 26" fill="none" ${S}/>
    ${eye(43, 42, 3.6)}${eye(57, 42, 3.6)}<path d="M46 52Q50 56 54 52" fill="none" ${S}/>
    <circle cx="37" cy="50" r="3.4" fill="#f7a8b8" opacity=".75"/><circle cx="63" cy="50" r="3.4" fill="#f7a8b8" opacity=".75"/>`,
  // حَقِيْبَة مدرسية
  bag: () => `<path d="M38 22Q38 8 50 8Q62 8 62 22" fill="none" ${S}/>
    <rect x="20" y="20" width="60" height="72" rx="14" fill="#e5484d" ${S}/>
    <path d="M20 42Q20 20 50 20Q80 20 80 42V52H20Z" fill="#c73a3f" ${S}/>
    <rect x="44" y="46" width="12" height="12" rx="3" fill="#f6c343" ${S}/>
    <rect x="30" y="64" width="40" height="22" rx="7" fill="#f6a623" ${S}/><path d="M36 70H64" fill="none" ${S}/>`,
  // كُرَة ملوّنة
  ball: () => `<circle cx="50" cy="50" r="38" fill="#fff" ${S}/>
    <path d="M50 12Q28 50 50 88Q18 86 12 50Q16 14 50 12Z" fill="#e5484d"/><path d="M50 12Q72 50 50 88Q82 86 88 50Q84 14 50 12Z" fill="#3aa0e0"/>
    <path d="M50 12Q38 50 50 88Q62 50 50 12Z" fill="#f6c343"/>
    <path d="M50 12Q28 50 50 88M50 12Q72 50 50 88M50 12Q38 50 50 88M50 12Q62 50 50 88" fill="none" ${S}/>
    <circle cx="50" cy="50" r="38" fill="none" ${S}/><ellipse cx="30" cy="32" rx="5" ry="8" fill="#fff" opacity=".6" transform="rotate(35 30 32)"/>`,
  // بَالُوْن
  balloon: () => `<path d="M50 74Q42 84 52 88Q60 92 48 98" fill="none" ${S}/>
    <path d="M50 8Q82 8 82 40Q82 66 52 76Q18 66 18 40Q18 8 50 8Z" fill="#e5484d" ${S}/>
    <path d="M46 75H56L58 82H44Z" fill="#c73a3f" ${S}/>
    <ellipse cx="35" cy="28" rx="5" ry="10" fill="#ff9a9a" transform="rotate(25 35 28)"/>`,
  // قُشُوْر موز
  banana_peels: () => `${peel(32, 34, 0.75)}${peel(66, 52, 0.95)}`,
  // مَوْز: عنقود
  bananas: () => `<g transform="translate(14 18) scale(0.85)">${[-28, -8, 12].map((r) => `<g transform="rotate(${r})"><path d="M2 0Q8 54 62 58Q68 56 64 50Q22 42 12 -2Z" fill="#ffd95a" ${S}/><path d="M10 12Q20 42 56 52" fill="none" stroke="#e6b830" stroke-width="2.2" stroke-linecap="round"/><circle cx="64" cy="54" r="2.6" fill="#6b4a2a"/></g>`).join('')}
    <rect x="0" y="-8" width="12" height="12" rx="3" fill="#8a5a3b" ${S}/></g>`,
  // سَلّة فيها فاكهة
  basket: () => `${limb('M22 46Q22 8 50 8Q78 8 78 46', '#c8794a', 5)}
    <circle cx="40" cy="40" r="10" fill="#e5484d" ${S}/><circle cx="60" cy="38" r="10" fill="#ff9f1c" ${S}/>
    <path d="M16 48H84L76 88Q74 93 69 93H31Q26 93 24 88Z" fill="#d9a35b" ${S}/>
    ${[30, 42, 54, 66].map((x) => `<path d="M${x} 52L${x + (x - 50) * 0.12} 90" stroke="#a8743a" stroke-width="2.2" stroke-linecap="round"/>`).join('')}
    <path d="M20 64H80M22 77H78" stroke="#a8743a" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="12" y="44" width="76" height="10" rx="5" fill="#c8794a" ${S}/>`,
  // مِضْرَب وكرة
  bat: () => `<g transform="rotate(-35 46 50)"><rect x="42" y="62" width="9" height="34" rx="4" fill="#3aa0e0" ${S}/>
    <ellipse cx="46.5" cy="34" rx="22" ry="28" fill="#f4fbff"/>
    ${[-14, -7, 0, 7, 14].map((d) => { const h = 28 * Math.sqrt(1 - (d / 22) ** 2); return `<path d="M${46.5 + d} ${R(34 - h)}V${R(34 + h)}" stroke="#9aa9b8" stroke-width="1.6"/>`; }).join('')}
    ${[-18, -9, 0, 9, 18].map((d) => { const w = 22 * Math.sqrt(1 - (d / 28) ** 2); return `<path d="M${R(46.5 - w)} ${34 + d}H${R(46.5 + w)}" stroke="#9aa9b8" stroke-width="1.6"/>`; }).join('')}
    <ellipse cx="46.5" cy="34" rx="22" ry="28" fill="none" stroke="${K}" stroke-width="9"/><ellipse cx="46.5" cy="34" rx="22" ry="28" fill="none" stroke="#e5484d" stroke-width="4"/>
    <path d="M42 62L46.5 56L51 62" fill="#e5484d" ${S}/></g>
    <circle cx="80" cy="80" r="10" fill="#d4e157" ${S}/><path d="M71 76Q80 82 88 74" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`,
  // دُبّ
  bear: () => `<circle cx="28" cy="20" r="10" fill="#a86a3d" ${S}/><circle cx="72" cy="20" r="10" fill="#a86a3d" ${S}/><circle cx="28" cy="20" r="5" fill="#e8b98a"/><circle cx="72" cy="20" r="5" fill="#e8b98a"/>
    <ellipse cx="50" cy="74" rx="28" ry="20" fill="#a86a3d" ${S}/><ellipse cx="50" cy="78" rx="15" ry="12" fill="#e8b98a"/>
    <circle cx="34" cy="90" r="8" fill="#a86a3d" ${S}/><circle cx="66" cy="90" r="8" fill="#a86a3d" ${S}/>
    <circle cx="50" cy="40" r="25" fill="#a86a3d" ${S}/>
    <ellipse cx="50" cy="50" rx="12" ry="9" fill="#e8b98a" ${S}/><ellipse cx="50" cy="46" rx="4.5" ry="3.2" fill="${K}"/><path d="M45 53Q50 57 55 53" fill="none" ${S}/>
    ${eye(40, 35)}${eye(60, 35)}`,
  // رجل ذو ذَقْن (لحية)
  bearded_man: () => `<path d="M16 98Q16 74 50 72Q84 74 84 98Z" fill="#3aa0e0" ${S}/><path d="M42 72L50 82L58 72" fill="#fff" ${S}/>
    <circle cx="27" cy="42" r="5" fill="${SK}" ${S}/><circle cx="73" cy="42" r="5" fill="${SK}" ${S}/>
    <circle cx="50" cy="40" r="23" fill="${SK}" ${S}/>
    <path d="M27 36Q26 12 50 14Q74 12 73 36Q66 24 50 24Q34 24 27 36Z" fill="#3b2a1e" ${S}/>
    <path d="M27 40Q26 76 50 78Q74 76 73 40Q68 56 50 56Q32 56 27 40Z" fill="#3b2a1e" ${S}/>
    <path d="M40 56Q50 50 60 56Q50 58 40 56Z" fill="#3b2a1e" ${S}/><path d="M44 62Q50 66 56 62" fill="#f7a8b8" ${S}/>
    ${eye(41, 38, 3.6)}${eye(59, 38, 3.6)}<path d="M36 30L45 31M55 31L64 30" fill="none" ${S}/>`,
  // سَرِيْر
  bed: () => `<rect x="8" y="26" width="14" height="66" rx="5" fill="#c8794a" ${S}/><rect x="80" y="50" width="12" height="42" rx="5" fill="#c8794a" ${S}/>
    <rect x="14" y="56" width="72" height="14" rx="4" fill="#fff" ${S}/>
    <path d="M40 50H82V72H40Z" fill="#3aa0e0" ${S}/><path d="M40 50Q38 60 40 72" fill="none" ${S}/>
    ${[50, 62, 74].map((x) => `<circle cx="${x}" cy="61" r="2.6" fill="#9bd3f0"/>`).join('')}
    <ellipse cx="32" cy="52" rx="12" ry="7" fill="#fff8e6" ${S}/>
    <rect x="12" y="70" width="76" height="12" rx="3" fill="#8a5a3b" ${S}/>`,
  // حِزَام بإبزيم
  belt: () => `<g transform="rotate(-10 50 50)"><rect x="24" y="42" width="62" height="16" fill="#8a5a3b" ${S}/>
    <path d="M86 42Q96 50 86 58Z" fill="#8a5a3b" ${S}/>
    ${[66, 74, 82].map((x) => `<circle cx="${x}" cy="50" r="2" fill="${K}"/>`).join('')}
    <rect x="36" y="38" width="7" height="24" rx="2" fill="#6b4a2a" ${S}/>
    <rect x="6" y="34" width="24" height="32" rx="5" fill="#f6c343" ${S}/><rect x="12" y="40" width="12" height="20" rx="2" fill="#8a5a3b" ${S}/>
    <path d="M12 50H32" fill="none" stroke="#9aa9b8" stroke-width="3.4" stroke-linecap="round"/></g>`,
  // تُوْت (توت عراقي)
  berries: () => `${leaf(40, 22, -10, 1.3)}
    ${[[28, 54, '#6b2a5e'], [52, 62, '#8e2a4a'], [74, 52, '#5a2350']].map(([x, y, c]) => `<path d="M${x} ${y - 16}Q${x + 2} ${y - 26} ${x + 8} ${y - 30}" fill="none" stroke="#3fa34d" stroke-width="3" stroke-linecap="round"/>
    ${[[0, -12], [-5, -6], [5, -6], [0, -3], [-6, 2], [6, 2], [0, 6], [-4, 10], [4, 10], [0, 15]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="5.4" fill="${c}" ${S}/>`).join('')}
    <circle cx="${x - 2}" cy="${y - 7}" r="1.6" fill="#fff" opacity=".7"/>`).join('')}`,
  // عُصْفُوْر على غصن
  bird: () => `${limb('M6 82Q50 74 94 80', '#8a5a3b', 5)}${bird(50, 52, 1.55, '#c98b4a')}`,
  // قَفَص فيه عصفور
  birdcage: () => `<path d="M22 84V44A28 28 0 0 1 78 44V84Z" fill="#fff8e6"/>
    ${bird(50, 54, 0.7, '#f6c343', '#e09a1c')}
    <path d="M30 66H70" fill="none" ${S}/>
    ${[31, 40.5, 50, 59.5, 69].map((x) => `<path d="M${x} ${R(44 - Math.sqrt(784 - (x - 50) ** 2) + 1)}V84" stroke="#c8794a" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
    <path d="M22 84V44A28 28 0 0 1 78 44V84" fill="none" ${S}/><path d="M22 56H78" fill="none" stroke="#c8794a" stroke-width="2.4"/>
    <circle cx="50" cy="11" r="5" fill="none" ${S}/>
    <rect x="16" y="82" width="68" height="10" rx="4" fill="#c8794a" ${S}/>`,
  // طُيُوْر
  birds: () => `${bird(32, 28, 0.78, '#3aa0e0', '#1f6fa8')}${bird(70, 50, 0.78, '#f6a623', '#c97a12')}${bird(34, 76, 0.78, '#e5484d', '#a8302f')}`,
  // سَبُّوْرَة
  blackboard: () => `<path d="M24 72L14 95M76 72L86 95" fill="none" ${S}/>
    <rect x="6" y="10" width="88" height="62" rx="5" fill="#c8794a" ${S}/><rect x="13" y="17" width="74" height="48" rx="2" fill="#2f6b4f" ${S}/>
    <circle cx="30" cy="34" r="6" fill="none" stroke="#fff" stroke-width="2.4"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i * Math.PI / 4; return `<path d="M${R(30 + 9 * Math.cos(a))} ${R(34 + 9 * Math.sin(a))}L${R(30 + 12 * Math.cos(a))} ${R(34 + 12 * Math.sin(a))}" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`; }).join('')}
    <path d="M48 52Q54 42 60 52T72 52T84 52" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M50 30L60 24L70 30V40H50Z" fill="none" stroke="#f6e27a" stroke-width="2.2" stroke-linejoin="round"/>
    <rect x="16" y="70" width="68" height="6" rx="2" fill="#8a5a3b" ${S}/><rect x="60" y="66" width="12" height="4" rx="1.5" fill="#fff" ${S}/>`,
  // قَارِب شراعي
  boat: () => `<rect x="48" y="12" width="4" height="54" fill="#8a5a3b" ${S}/>
    <path d="M53 16L84 60H53Z" fill="#fff" ${S}/><path d="M47 24L22 60H47Z" fill="#f6c343" ${S}/>
    <path d="M52 12L64 15L52 19Z" fill="#e5484d" ${S}/>
    <path d="M10 62H90L76 82H24Z" fill="#c8794a" ${S}/><path d="M18 70H82" stroke="#8a5a3b" stroke-width="2.4"/>
    <path d="M4 82Q12 76 20 82T36 82T52 82T68 82T84 82T96 82V95H4Z" fill="#7cc8f0" ${S}/>`,
  // عَظْم
  bone: () => bone(50, 50, -30, 1.3),
  // عِظَام
  bones: () => `${bone(50, 40, 35, 1.05)}${bone(50, 40, -35, 1.05)}${bone(50, 80, 0, 0.9)}`,
  // كِتَاب مفتوح
  book: () => `<path d="M6 30V86Q30 82 50 90Q70 82 94 86V30Z" fill="#e5484d" ${S}/>
    <path d="M50 30Q32 20 12 24V80Q32 76 50 84Z" fill="#fff" ${S}/><path d="M50 30Q68 20 88 24V80Q68 76 50 84Z" fill="#fff" ${S}/>
    ${[36, 46, 56, 66].map((y) => `<path d="M18 ${y}Q32 ${y - 4} 44 ${y + 2}M56 ${y + 2}Q68 ${y - 4} 82 ${y}" fill="none" stroke="#c9c2b3" stroke-width="2.4" stroke-linecap="round"/>`).join('')}`,
  // زُجَاجَة
  bottle: () => `<path d="M42 16H58V30Q72 38 72 52V86Q72 93 65 93H35Q28 93 28 86V52Q28 38 42 30Z" fill="#cdeefa" ${S}/>
    <path d="M30.5 58H69.5V86Q69.5 90.5 65 90.5H35Q30.5 90.5 30.5 86Z" fill="#7cc8f0"/>
    <path d="M42 16H58V30Q72 38 72 52V86Q72 93 65 93H35Q28 93 28 86V52Q28 38 42 30Z" fill="none" ${S}/>
    <rect x="40" y="6" width="20" height="11" rx="3" fill="#3aa0e0" ${S}/>
    <rect x="35" y="42" width="5" height="40" rx="2.5" fill="#fff" opacity=".7"/>`,
  // غِطَاء القنينة
  bottle_cap: () => `<path d="M42 40H58V52Q72 58 72 70V88Q72 94 66 94H34Q28 94 28 88V70Q28 58 42 52Z" fill="#a5dba6" ${S}/>
    <rect x="39" y="36" width="22" height="6" rx="2" fill="#a5dba6" ${S}/><rect x="35" y="60" width="5" height="26" rx="2.5" fill="#fff" opacity=".7"/>
    <g transform="rotate(-18 52 18)"><rect x="34" y="8" width="36" height="18" rx="4" fill="#e5484d" ${S}/>
    ${[40, 46, 52, 58, 64].map((x) => `<path d="M${x} 12V22" stroke="#a8302f" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g>
    <path d="M24 30Q20 24 24 18M80 30Q84 24 80 18" fill="none" ${S}/>`,
  // قَوْس وسهم
  bow_arrow: () => `<path d="M30 10L18 50L30 90" fill="none" stroke="${K}" stroke-width="2"/>
    ${limb('M30 10Q74 50 30 90', '#c8794a', 5)}<rect x="47" y="42" width="10" height="16" rx="3" fill="#e5484d" ${S}/>
    <rect x="18" y="48" width="64" height="4" rx="2" fill="#8a5a3b" ${S}/><path d="M80 42L96 50L80 58Z" fill="#9aa9b8" ${S}/>
    <path d="M10 41H20L26 50H16Z" fill="#3aa0e0" ${S}/><path d="M10 59H20L26 50H16Z" fill="#3aa0e0" ${S}/>`,
  // صُنْدُوْق كرتون مفتوح
  box: () => `<path d="M34 36L40 14H90L86 36Z" fill="#e2b06e" ${S}/>
    <path d="M18 46L34 36H86L70 46Z" fill="#7a4f2a" ${S}/>
    <rect x="18" y="46" width="52" height="46" fill="#d9a35b" ${S}/><path d="M70 46L86 36V82L70 92Z" fill="#c08a45" ${S}/>
    <path d="M18 46L4 30L22 22L34 36Z" fill="#e2b06e" ${S}/>
    <path d="M26 60H44" stroke="#a8743a" stroke-width="2.4" stroke-linecap="round"/>`,
  // مَكْتَبَة: ولد يحمل كتابًا أمام رفوف
  boy_at_library: () => `<rect x="44" y="6" width="52" height="88" rx="3" fill="#c8794a" ${S}/>
    ${[8, 36, 64].map((y, r) => `<rect x="48" y="${y + 2}" width="44" height="24" fill="#8a5a3b"/>${[0, 1, 2, 3, 4, 5].map((i) => { const c = ['#e5484d', '#3aa0e0', '#f6c343', '#2f9e44', '#f6a623', '#9b6bd1'][(i + r * 2) % 6]; const h = [22, 18, 21, 16, 22, 19][(i + r) % 6]; return `<rect x="${49 + i * 7.2}" y="${y + 26 - h}" width="6.4" height="${h}" rx="1" fill="${c}" ${S}/>`; }).join('')}<rect x="44" y="${y + 26}" width="52" height="4" fill="#c8794a" ${S}/>`).join('')}
    <path d="M6 96V62Q6 50 22 50Q38 50 38 62V96Z" fill="#2f9e44" ${S}/>
    ${head(22, 34, 12)}
    <rect x="12" y="62" width="20" height="15" rx="2" fill="#e5484d" ${S}/><path d="M22 62V77" fill="none" ${S}/>
    <circle cx="11" cy="70" r="4" fill="${SK}" ${S}/><circle cx="33" cy="70" r="4" fill="${SK}" ${S}/>`,
  // رَأْس ولد
  boy_head: () => `<path d="M14 99Q14 82 50 80Q86 82 86 99Z" fill="#3aa0e0" ${S}/><rect x="42" y="70" width="16" height="12" fill="${SK}" ${S}/>
    <circle cx="20" cy="48" r="6" fill="${SK}" ${S}/><circle cx="80" cy="48" r="6" fill="${SK}" ${S}/>
    ${head(50, 44, 30)}<path d="M50 48Q47 54 51 55" fill="none" ${S}/>`,
  // يَضْرِبُ الكرة
  boy_kicking_ball: () => `${limb('M36 58L33 90', '#3a5a8a', 6)}${limb('M40 58L52 72L66 74', '#3a5a8a', 6)}
    <ellipse cx="30" cy="92" rx="7" ry="4" fill="${K}"/><ellipse cx="69" cy="73" rx="4" ry="6" fill="${K}" transform="rotate(-20 69 73)"/>
    ${limb('M30 36L16 50', SK, 4)}${limb('M44 36L58 44', SK, 4)}
    <rect x="26" y="30" width="22" height="30" rx="7" fill="#e5484d" ${S}/>
    ${head(37, 18, 12)}
    <circle cx="82" cy="72" r="11" fill="#fff" ${S}/><path d="M82 66L87 70L85 76H79L77 70Z" fill="${K}"/>
    <path d="M78 52Q84 50 90 52M80 90Q86 92 92 89" fill="none" ${S}/>`,
  // يُصَلِّي: ولد من الخلف على سجادة صلاة يكبّر
  boy_praying: () => `<path d="M10 94L24 54H76L90 94Z" fill="#2f9e44" ${S}/><path d="M18 89L28 59H72L82 89Z" fill="none" stroke="#f6c343" stroke-width="2.4"/>
    <path d="M38 66Q50 50 62 66" fill="none" stroke="#f6c343" stroke-width="2.4"/>
    ${limb('M40 54L32 40', '#f4f4f4', 5)}${limb('M60 54L68 40', '#f4f4f4', 5)}
    <circle cx="31" cy="36" r="4.5" fill="${SK}" ${S}/><circle cx="69" cy="36" r="4.5" fill="${SK}" ${S}/>
    <path d="M34 88L38 52Q50 46 62 52L66 88Z" fill="#f4f4f4" ${S}/>
    <circle cx="38" cy="38" r="3" fill="${SK}" ${S}/><circle cx="62" cy="38" r="3" fill="${SK}" ${S}/>
    <circle cx="50" cy="36" r="12" fill="#5a3a22" ${S}/><path d="M38 33Q38 22 50 22Q62 22 62 33Z" fill="#fff" ${S}/>`,
  // حَافِظ: ولد يقرأ في كتاب على حامل
  boy_reading_quran: () => `<ellipse cx="34" cy="88" rx="24" ry="8" fill="#f4f4f4" ${S}/>
    <path d="M16 86Q14 56 30 50Q44 50 46 62L48 86Z" fill="#f4f4f4" ${S}/>
    ${limb('M58 90L84 62', '#a8743a', 4)}${limb('M84 90L58 62', '#a8743a', 4)}
    <path d="M54 44L71 52L88 44V60L71 68L54 60Z" fill="#2f9e44" ${S}/>
    <path d="M57 41L71 49V64L57 56Z" fill="#fff" ${S}/><path d="M85 41L71 49V64L85 56Z" fill="#fff" ${S}/>
    ${limb('M38 60L56 58', '#f4f4f4', 5)}<circle cx="58" cy="58" r="3.6" fill="${SK}" ${S}/>
    ${headP(30, 34, 13)}`,
  // مِغْسَلَة: ولد يغسل يديه
  boy_washing_at_sink: () => `<rect x="58" y="66" width="16" height="28" rx="3" fill="#fff" ${S}/>
    <path d="M40 54H92Q90 72 66 72Q42 72 40 54Z" fill="#f4f8fb" ${S}/><rect x="38" y="48" width="56" height="7" rx="3" fill="#fff" ${S}/>
    <path d="M80 48V30Q80 26 76 26H58V33H74V48Z" fill="#b9c4cf" ${S}/><rect x="74" y="18" width="10" height="7" rx="2" fill="#3aa0e0" ${S}/>
    <rect x="58" y="33" width="6" height="22" rx="3" fill="#8fd3f5" ${S}/>
    <path d="M6 96V60Q6 48 20 48Q34 48 36 58V96Z" fill="#f6c343" ${S}/>
    ${limb('M28 58L52 52', '#f6c343', 5)}<circle cx="56" cy="50" r="5" fill="${SK}" ${S}/>
    ${head(20, 32, 12)}
    <circle cx="48" cy="40" r="3" fill="#fff" ${S}/><circle cx="44" cy="32" r="2" fill="#fff" ${S}/>`,
  // سِوَار ذهبي
  bracelet: () => `<path d="M12 54a38 22 0 1 0 76 0a38 22 0 1 0 -76 0ZM23 52a27 12 0 1 0 54 0a27 12 0 1 0 -54 0Z" fill="#f6c343" fill-rule="evenodd" ${S}/>
    <path d="M20 66Q50 82 80 66" fill="none" stroke="#ffe08a" stroke-width="2.4" stroke-linecap="round"/>
    ${[0.35, 0.95, 1.57, 2.19, 2.79].map((t, i) => `<circle cx="${R(50 + 32.5 * Math.cos(t))}" cy="${R(54 + 17 * Math.sin(t))}" r="${i === 2 ? 5.5 : 4.2}" fill="${['#3aa0e0', '#e5484d', '#2f9e44', '#e5484d', '#3aa0e0'][i]}" ${S}/>`).join('')}`,
  // ضَفِيْرَة شعر بشريطة
  braid: () => `<path d="M38 6H62L56 18H44Z" fill="#7a4a2a" ${S}/><rect x="42" y="14" width="16" height="6" rx="3" fill="#e5484d" ${S}/>
    ${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${i % 2 ? 54 : 46}" cy="${28 + i * 11}" rx="10" ry="7.5" fill="#7a4a2a" transform="rotate(${i % 2 ? -28 : 28} ${i % 2 ? 54 : 46} ${28 + i * 11})" ${S}/>`).join('')}
    <path d="M44 80L40 96M50 80V97M56 80L60 96" fill="none" stroke="#7a4a2a" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 80L34 72L34 88Z" fill="#f78fb3" ${S}/><path d="M50 80L66 72L66 88Z" fill="#f78fb3" ${S}/><circle cx="50" cy="80" r="4" fill="#e5484d" ${S}/>`,
  // غُصْن بأوراق
  branch: () => `${limb('M8 86Q40 66 84 34', '#8a5a3b', 6)}${limb('M50 60Q56 44 66 38', '#8a5a3b', 3)}${limb('M28 72Q28 56 20 46', '#8a5a3b', 3)}
    ${leaf(66, 38, -40)}${leaf(66, 38, 20)}${leaf(20, 46, -110)}${leaf(20, 46, -40, 0.85)}${leaf(76, 40, 60)}${leaf(42, 64, 70, 0.9)}${leaf(80, 34, -60, 0.85)}`,
  // حَائِط من الطابوق
  brick_wall: () => [0, 1, 2, 3, 4].map((r) => { const y = 10 + r * 16; const off = r % 2 ? 11 : 0; let out = ''; for (let x = 8 - off; x < 92; x += 22) { const a = Math.max(x, 8), b = Math.min(x + 22, 92); if (b - a > 3) out += `<rect x="${a}" y="${y}" width="${b - a}" height="16" fill="${['#d9653b', '#c8552f', '#e07a4f'][(r + Math.round(x / 22)) % 3 < 0 ? 0 : (r + Math.round((x + 11) / 22)) % 3]}" ${S}/>`; } return out; }).join('') + `<path d="M4 92H96" fill="none" ${S}/>`,
  // جِسْر بقوس فوق نهر
  bridge: () => `<path d="M4 68H96V94H4Z" fill="#7cc8f0" ${S}/>
    <path d="M30 80Q38 76 46 80M56 86Q64 82 72 86" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M4 40H96V72H82Q82 50 50 50Q18 50 18 72H4Z" fill="#d9b48a" ${S}/>
    ${[26, 38, 50, 62, 74].map((x) => `<path d="M${x} ${x === 50 ? 42 : 42}V${R(50 + Math.abs(x - 50) * 0.35)}" stroke="#b08a60" stroke-width="2" stroke-linecap="round"/>`).join('')}
    <path d="M4 26H96" fill="none" ${S}/>${[8, 22, 36, 50, 64, 78, 92].map((x) => `<path d="M${x} 26V40" fill="none" ${S}/>`).join('')}
    <rect x="4" y="38" width="92" height="5" rx="2" fill="#c8794a" ${S}/>`,
  // دَلْو فيه ماء
  bucket: () => `${limb('M24 38Q50 0 76 38', '#9aa9b8', 3)}
    <path d="M22 36H78L70 90Q69 94 65 94H35Q31 94 30 90Z" fill="#3aa0e0" ${S}/>
    <path d="M26 60H74" stroke="#1f6fa8" stroke-width="2.6"/>
    <ellipse cx="50" cy="36" rx="28" ry="7" fill="#bfe6f5" ${S}/><ellipse cx="50" cy="37" rx="20" ry="4" fill="#7cc8f0"/>
    <rect x="34" y="44" width="5" height="40" rx="2.5" fill="#fff" opacity=".45"/>`,
  // جَامُوْسَة في الماء
  buffalo: () => `<g transform="translate(5 4) scale(0.92)"><path d="M88 58Q96 64 94 76" fill="none" ${S}/>
    ${[40, 52, 68, 80].map((x) => `<rect x="${x - 4}" y="72" width="9" height="18" rx="4" fill="#4b4e56" ${S}/>`).join('')}
    <ellipse cx="62" cy="62" rx="30" ry="18" fill="#5b5e66" ${S}/>
    <path d="M18 30Q-2 24 6 6Q12 22 26 26Z" fill="#e8dcc0" ${S}/><path d="M40 30Q60 24 52 6Q46 22 32 26Z" fill="#e8dcc0" ${S}/>
    <ellipse cx="12" cy="40" rx="7" ry="4" fill="#5b5e66" ${S}/><ellipse cx="46" cy="40" rx="7" ry="4" fill="#5b5e66" ${S}/>
    <ellipse cx="29" cy="44" rx="15" ry="17" fill="#5b5e66" ${S}/>
    ${eye(23, 40)}${eye(35, 40)}
    <ellipse cx="29" cy="56" rx="11" ry="7" fill="#8a8d96" ${S}/><circle cx="25" cy="56" r="1.8" fill="${K}"/><circle cx="33" cy="56" r="1.8" fill="${K}"/>
    <path d="M4 84Q12 79 20 84T36 84T52 84T68 84T84 84T96 84V96H4Z" fill="#7cc8f0" ${S}/></g>`,
  // ثِيْرَان: ثوران
  bulls: () => `${bull(36, 34, 0.82, '#a0522d')}${bull(62, 72, 0.82, '#7a4a32')}`,
  // فَرَاشَة
  butterfly: () => `${[1, -1].map((d) => `<ellipse cx="${50 - d * 22}" cy="36" rx="20" ry="16" fill="#f6a623" transform="rotate(${d * 20} ${50 - d * 22} 36)" ${S}/>
    <ellipse cx="${50 - d * 17}" cy="66" rx="14" ry="13" fill="#e5484d" ${S}/>
    <circle cx="${50 - d * 26}" cy="34" r="5" fill="#fff" ${S}/><circle cx="${50 - d * 18}" cy="68" r="4" fill="#ffd95a" ${S}/>`).join('')}
    <path d="M47 24Q40 10 34 10M53 24Q60 10 66 10" fill="none" ${S}/><circle cx="34" cy="10" r="2.6" fill="${K}"/><circle cx="66" cy="10" r="2.6" fill="${K}"/>
    <ellipse cx="50" cy="56" rx="5.5" ry="24" fill="#6b4a3a" ${S}/><circle cx="50" cy="28" r="8" fill="#6b4a3a" ${S}/>
    ${eye(47, 27, 2.6)}${eye(53, 27, 2.6)}`,
  // زِرّ
  button: () => `<circle cx="50" cy="50" r="38" fill="#3aa0e0" ${S}/><circle cx="50" cy="50" r="29" fill="none" stroke="#1f6fa8" stroke-width="3.4"/>
    ${[[40, 40], [60, 40], [40, 60], [60, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" ${S}/>`).join('')}
    <path d="M40 40L60 60M60 40L40 60" stroke="#e5484d" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M24 34Q30 20 44 16" fill="none" stroke="#9bd3f0" stroke-width="4" stroke-linecap="round"/>`,
  // حَلْوَى: قطع ومصاصة
  candies: () => `${limb('M68 52V94', '#fff', 3)}<circle cx="68" cy="34" r="20" fill="#f78fb3" ${S}/>
    <path d="M68 34m0 0a4 4 0 0 1 8 0a8 8 0 0 1 -16 0a12 12 0 0 1 24 0a16 16 0 0 1 -26 10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    ${wrapped(28, 26, -20, 0.85, '#e5484d')}${wrapped(30, 60, 15, 0.85, '#3aa0e0')}${wrapped(36, 88, -6, 0.75, '#2f9e44', '#ffd95a')}`,
  // شَمْعَة
  candle: () => `<circle cx="50" cy="24" r="16" fill="#ffe9a0" opacity=".6"/>
    <path d="M78 86Q92 86 90 76Q88 70 80 74" fill="none" ${S}/><ellipse cx="50" cy="88" rx="32" ry="7" fill="#f6c343" ${S}/>
    <rect x="37" y="40" width="26" height="48" rx="3" fill="#fdf0d5" ${S}/>
    <path d="M37 46Q44 50 48 46Q50 58 54 56Q56 48 63 46V42H37Z" fill="#fff" ${S}/>
    <path d="M50 40V33" fill="none" ${S}/>
    <path d="M50 10Q62 24 50 34Q38 24 50 10Z" fill="#ffb02e" ${S}/><path d="M50 20Q55 27 50 31Q45 27 50 20Z" fill="#ffe066"/>`,
  // حَلْوَى: قطعة ملفوفة
  candy: () => wrapped(50, 50, -15, 1.6, '#e5484d'),
  // قُبَّعَة
  cap: () => `<path d="M58 62Q90 58 96 72Q80 78 52 70Z" fill="#c73a3f" ${S}/>
    <path d="M14 66Q12 28 48 26Q84 28 82 66Z" fill="#e5484d" ${S}/>
    <path d="M48 26Q38 44 40 66M48 26Q62 44 64 66" fill="none" stroke="#a8302f" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="12" y="62" width="72" height="9" rx="4" fill="#f6c343" ${S}/><circle cx="48" cy="25" r="4" fill="#f6c343" ${S}/>
    <circle cx="28" cy="48" r="2" fill="#a8302f"/><circle cx="70" cy="48" r="2" fill="#a8302f"/>`,
};
