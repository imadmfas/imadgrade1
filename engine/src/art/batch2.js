// batch2 — original SVG art, 100×100 viewBox
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;
const SK = '#f6c9a6';
// طرف (ذراع/ساق) بحدّ بني ولون داخلي
const limb = (d, c, w = 5) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 5.2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const smile = (x, y, w = 5) => `<path d="M${x - w} ${y}Q${x} ${y + w * 0.8} ${x + w} ${y}" fill="none" ${S}/>`;
const cheeks = (x, y, d) => `<circle cx="${x - d}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".7"/><circle cx="${x + d}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".7"/>`;
// رأس ولد بشعر قصير
const boy = (x, y, r = 15, hair = '#5a3a22') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SK}" ${S}/>
  <path d="M${x - r} ${y - 1}Q${x - r} ${y - r * 1.2} ${x} ${y - r}Q${x + r} ${y - r * 1.2} ${x + r} ${y - 1}Q${x + r * 0.5} ${y - r * 0.62} ${x} ${y - r * 0.6}Q${x - r * 0.5} ${y - r * 0.62} ${x - r} ${y - 1}Z" fill="${hair}" ${S}/>
  ${eye(x - r * 0.37, y + r * 0.08, r * 0.22)}${eye(x + r * 0.37, y + r * 0.08, r * 0.22)}${smile(x, y + r * 0.5, r * 0.3)}${cheeks(x, y + r * 0.42, r * 0.62)}`;
// رأس بنت بحجاب
const girl = (x, y, r = 15, scarf = '#e86a92') => `<path d="M${x - r * 1.3} ${y + r * 1.45}Q${x - r * 1.5} ${y - r * 1.45} ${x} ${y - r * 1.38}Q${x + r * 1.5} ${y - r * 1.45} ${x + r * 1.3} ${y + r * 1.45}Z" fill="${scarf}" ${S}/>
  <circle cx="${x}" cy="${y}" r="${r * 0.92}" fill="${SK}" ${S}/>
  ${eye(x - r * 0.35, y + r * 0.02, r * 0.22)}${eye(x + r * 0.35, y + r * 0.02, r * 0.22)}${smile(x, y + r * 0.45, r * 0.28)}${cheeks(x, y + r * 0.38, r * 0.58)}`;
const chickF = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-8 26l-3 7M-8 26l1 7M8 26l-1 7M8 26l3 7" fill="none" stroke="#e8891c" stroke-width="3" stroke-linecap="round"/>
  <circle cx="0" cy="0" r="27" fill="#ffd23f" ${S}/><path d="M-2 -27q-2 -8 4 -10M2 -27q4 -7 9 -5" fill="none" ${S}/>
  <path d="M14 4Q26 8 20 18Q12 18 12 8Z" fill="#ffc21a" ${S}/><path d="M-14 4Q-26 8 -20 18Q-12 18 -12 8Z" fill="#ffc21a" ${S}/>
  ${eye(-9, -6, 5)}${eye(9, -6, 5)}<path d="M-6 3L6 3L0 11Z" fill="#ff8c2b" ${S}/>${cheeks(0, 6, 15)}</g>`;
const crocF = (tx, ty, s = 1) => `<g transform="translate(${tx} ${ty}) scale(${s})">
  ${[34, 60].map((x) => `<path d="M${x} 60l-5 14h10l3 -12Z" fill="#4f9a3e" ${S}/>`).join('')}
  ${[22, 32, 42, 52, 62].map((x) => `<path d="M${x - 4} ${49 - (x - 22) * 0.06}l4 -6l4 6" fill="#4a8f3c" ${S}/>`).join('')}
  <path d="M4 58Q22 48 40 46Q60 42 72 46L92 50Q97 54 93 58L74 60Q60 66 40 66Q20 66 4 58Z" fill="#62ad4c" ${S}/>
  <path d="M30 63Q50 66 72 60" fill="none" stroke="#a9d97a" stroke-width="3" stroke-linecap="round"/>
  <path d="M74 55H92" fill="none" ${S}/>${[78, 83, 88].map((x) => `<path d="M${x} 55l2 3.4l2 -3.4Z" fill="#fff" stroke="${K}" stroke-width="1.4" stroke-linejoin="round"/>`).join('')}
  <circle cx="68" cy="44" r="6.5" fill="#62ad4c" ${S}/>${eye(68, 43, 3.8)}<circle cx="90" cy="50" r="1.4" fill="${K}"/></g>`;
const fig1 = (x, y, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
  <path d="M0 -24Q4 -14 14 -6Q24 6 18 18Q10 28 0 28Q-10 28 -18 18Q-24 6 -14 -6Q-4 -14 0 -24Z" fill="#7b3f86" ${S}/>
  <path d="M-8 -4Q-14 6 -10 16" fill="none" stroke="#a46bb0" stroke-width="3" stroke-linecap="round"/>
  <path d="M-3 -24Q-2 -32 4 -34" fill="none" stroke="#6b8f2a" stroke-width="4" stroke-linecap="round"/></g>`;
const feath = (x, y, r, c, c2, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
  <path d="M0 -38Q16 -20 12 10Q8 26 0 32Q-8 26 -12 10Q-16 -20 0 -38Z" fill="${c}" ${S}/>
  ${[-22, -10, 2, 14].map((v) => `<path d="M0 ${v}l-9 -6M0 ${v}l9 -6" fill="none" stroke="${c2}" stroke-width="2.2" stroke-linecap="round"/>`).join('')}
  <path d="M0 -32V44" fill="none" ${S}/></g>`;
const env = (x, y, r, c, k = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${k})"><rect x="-30" y="-20" width="60" height="40" rx="3" fill="${c}" ${S}/>
  <path d="M-30 -18L0 4L30 -18M-30 20L-8 0M30 20L8 0" fill="none" ${S}/></g>`;

export const ART_BATCH2 = {
  // سَيَّارَةٌ حمراء
  car: () => `<path d="M8 70V60Q8 52 20 50L32 34Q35 30 42 30H62Q68 30 72 36L82 50Q94 52 94 62V70Q94 74 90 74H12Q8 74 8 70Z" fill="#e5484d" ${S}/>
    <path d="M36 49L44 36H53V49Z" fill="#9bd3f0" ${S}/><path d="M58 36H64Q67 36 69 40L75 49H58Z" fill="#9bd3f0" ${S}/>
    <path d="M52 56h7" ${S}/><circle cx="89" cy="58" r="3" fill="#ffd23f" ${S}/><rect x="6" y="58" width="6" height="5" rx="2" fill="#f6a623" ${S}/>
    ${[28, 72].map((x) => `<circle cx="${x}" cy="74" r="11" fill="#3b3b3b" ${S}/><circle cx="${x}" cy="74" r="4.5" fill="#cfd6dd" ${S}/>`).join('')}`,
  // هَيْلٌ: قرون خضراء
  cardamom: () => `<ellipse cx="50" cy="80" rx="40" ry="10" fill="#f4e3c3" ${S}/>
    ${[[30, 52, -35], [52, 44, 10], [72, 56, 40], [42, 70, 80], [62, 74, -70]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -16Q11 -14 11 0Q11 14 0 16Q-11 14 -11 0Q-11 -14 0 -16Z" fill="#9ccc6a" ${S}/><path d="M-3 -10Q-6 0 -3 10M4 -10Q7 0 4 10" fill="none" stroke="#6f9f45" stroke-width="2" stroke-linecap="round"/><path d="M0 -16l0 -4" ${S}/></g>`).join('')}`,
  // جَزَرٌ: ثلاث جزرات
  carrots: () => `${[[32, 30, -20], [50, 24, 0], [68, 30, 20]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})">
    <path d="M0 0Q-9 -12 -6 -20M0 0Q0 -14 3 -22M0 0Q8 -10 10 -17" fill="none" stroke="#3fa34d" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M-10 0Q0 -5 10 0L2 54Q0 57 -2 54Z" fill="#ff8c2b" ${S}/><path d="M-6 14h5M3 26h4M-4 38h4" ${S}/></g>`).join('')}`,
  // قِطَّةٌ جالسة
  cat: () => `<path d="M70 86Q94 84 88 62Q86 54 80 58" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M70 86Q94 84 88 62Q86 54 80 58" fill="none" stroke="#f4a259" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="50" cy="72" rx="23" ry="20" fill="#f4a259" ${S}/><ellipse cx="50" cy="76" rx="11" ry="13" fill="#ffe2bf"/>
    <ellipse cx="40" cy="90" rx="7" ry="4.5" fill="#f4a259" ${S}/><ellipse cx="60" cy="90" rx="7" ry="4.5" fill="#f4a259" ${S}/>
    <path d="M32 34L30 10L46 24Z" fill="#f4a259" ${S}/><path d="M68 34L70 10L54 24Z" fill="#f4a259" ${S}/>
    <circle cx="50" cy="38" r="21" fill="#f4a259" ${S}/><path d="M44 18l2 7M50 17v7M56 18l-2 7" stroke="#c9742f" stroke-width="2.4" stroke-linecap="round"/>
    ${eye(42, 36, 5)}${eye(58, 36, 5)}<path d="M47 44h6l-3 3Z" fill="#f7a8b8" ${S}/><path d="M44 49Q47 52 50 48Q53 52 56 49" fill="none" ${S}/>
    <path d="M38 46H22M38 50l-15 4M62 46h16M62 50l15 4" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>`,
  // حَظِيْرَةٌ حمراء
  cattle_barn: () => `<path d="M6 92H94" ${S}/><path d="M18 92V46L50 20L82 46V92Z" fill="#d1493f" ${S}/>
    <path d="M10 50L50 14L90 50" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 50L50 14L90 50" fill="none" stroke="#f4f0e6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="42" y="30" width="16" height="12" rx="2" fill="#f2c14e" ${S}/>
    <rect x="34" y="56" width="32" height="36" fill="#a8322b" ${S}/><path d="M34 56L66 92M66 56L34 92M50 56V92" fill="none" stroke="#f4f0e6" stroke-width="3.4"/><rect x="34" y="56" width="32" height="36" fill="none" ${S}/>
    <path d="M70 92q2 -10 8 -8q4 -6 8 0q4 2 2 8Z" fill="#f2c14e" ${S}/>`,
  // طَبَاشِيْرُ وسبورة
  chalk: () => `<rect x="12" y="10" width="76" height="52" rx="4" fill="#2f6b4f" stroke="#a8743f" stroke-width="5"/><rect x="9" y="7" width="82" height="58" rx="6" fill="none" ${S}/>
    <path d="M22 30q8 -10 14 0t14 0M58 26l8 16l8 -16M24 48h30" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>
    ${[['#fff', 20, 78, -12], ['#ffb3c7', 40, 82, 6], ['#ffe27a', 62, 78, -6]].map(([c, x, y, a]) => `<rect x="${x}" y="${y}" width="22" height="9" rx="4" fill="${c}" transform="rotate(${a} ${x + 11} ${y + 4})" ${S}/>`).join('')}`,
  // فَحْمٌ: كومة قطع سوداء بجمرات
  charcoal: () => `<path d="M8 76H92L84 90H16Z" fill="#9aa9b8" ${S}/>
    ${[[24, 66, 13], [46, 62, 15], [70, 66, 13], [34, 48, 12], [58, 46, 13], [46, 32, 11]].map(([x, y, r], i) => `<path d="M${x - r} ${y + 4}L${x - r * 0.6} ${y - r * 0.8}L${x + r * 0.4} ${y - r}L${x + r} ${y - 2}L${x + r * 0.6} ${y + r * 0.8}L${x - r * 0.5} ${y + r * 0.9}Z" fill="${i % 2 ? '#3b3b3b' : '#2b2b2b'}" ${S}/><path d="M${x - r * 0.4} ${y - r * 0.4}l${r * 0.5} -${r * 0.2}" stroke="#777" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
    <circle cx="36" cy="60" r="3" fill="#ff7a1a"/><circle cx="58" cy="58" r="3.4" fill="#ff5a1a"/><circle cx="46" cy="44" r="2.4" fill="#ffb21a"/>`,
  // جُبْنٌ: قطعة صفراء بثقوب
  cheese: () => `<path d="M10 54L58 24L90 50Z" fill="#ffe27a" ${S}/><path d="M10 54H90V82H10Z" fill="#ffc93c" ${S}/><path d="M90 50V82" ${S}/>
    <ellipse cx="54" cy="44" rx="6" ry="3" fill="#e8a91c"/>
    ${[[24, 66, 5], [44, 72, 4], [64, 64, 6], [80, 74, 3.4], [34, 78, 2.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8a91c" ${S}/>`).join('')}`,
  // فَهْدُ مرقّط
  cheetah: () => `<path d="M80 54Q96 60 92 84" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M80 54Q96 60 92 84" fill="none" stroke="#f2c14e" stroke-width="4" stroke-linecap="round"/>
    ${[38, 48, 68, 78].map((x) => `<rect x="${x - 4}" y="62" width="8" height="28" rx="4" fill="#f2c14e" ${S}/>`).join('')}
    <ellipse cx="58" cy="58" rx="28" ry="14" fill="#f2c14e" ${S}/>
    ${[[46, 52], [56, 50], [66, 52], [76, 56], [52, 62], [62, 60], [72, 64], [42, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${K}"/>`).join('')}
    <circle cx="16" cy="28" r="5" fill="#f2c14e" ${S}/><circle cx="36" cy="28" r="5" fill="#f2c14e" ${S}/>
    <circle cx="26" cy="42" r="16" fill="#f2c14e" ${S}/><ellipse cx="26" cy="50" rx="8" ry="6" fill="#fff4d6"/>
    ${eye(20, 39, 4)}${eye(32, 39, 4)}<path d="M18 44Q17 50 20 54M34 44Q35 50 32 54" fill="none" stroke="${K}" stroke-width="2"/>
    <path d="M24 47h4l-2 2Z" fill="${K}" ${S}/><path d="M22 52Q26 55 30 52" fill="none" ${S}/>`,
  // صُوْصٌ
  chick: () => chickF(50, 54, 1.25),
  // صِيْصَانٌ: ثلاثة صيصان
  chicks: () => `${chickF(26, 42, 0.68)}${chickF(74, 42, 0.68)}${chickF(50, 70, 0.72)}`,
  // يُصَفِّقُ: ولد يصفّق
  clapping: () => `<g transform="translate(-10 -6) scale(1.2)"><path d="M30 96V70Q30 58 50 58Q70 58 70 70V96Z" fill="#3aa0e0" ${S}/>
    ${limb('M36 66Q30 56 45 52', '#3aa0e0')}${limb('M64 66Q70 56 55 52', '#3aa0e0')}
    <ellipse cx="47" cy="50" rx="5" ry="6.5" fill="${SK}" ${S}/><ellipse cx="53" cy="50" rx="5" ry="6.5" fill="${SK}" ${S}/>
    ${boy(50, 28, 15)}
    <path d="M34 50l-7 -3M34 56l-8 1M66 50l7 -3M66 56l8 1" fill="none" stroke="#f6a623" stroke-width="3" stroke-linecap="round"/></g>`,
  // سَاعَةُ حائط
  clock: () => `<circle cx="50" cy="50" r="42" fill="#3aa0e0" ${S}/><circle cx="50" cy="50" r="34" fill="#fff" ${S}/>
    ${[...Array(12)].map((_, i) => { const a = (i * Math.PI) / 6, r1 = i % 3 ? 29 : 26; return `<path d="M${(50 + Math.sin(a) * r1).toFixed(1)} ${(50 - Math.cos(a) * r1).toFixed(1)}L${(50 + Math.sin(a) * 31).toFixed(1)} ${(50 - Math.cos(a) * 31).toFixed(1)}" stroke="${K}" stroke-width="${i % 3 ? 2 : 3}" stroke-linecap="round"/>`; }).join('')}
    <path d="M50 50V30M50 50L64 58" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="3.6" fill="#e5484d" ${S}/>`,
  // ثِيَابٌ: قميص وبنطال
  clothes: () => `<path d="M58 40H88L90 92H76L73 58L70 92H56Z" fill="#8a5a3b" ${S}/><path d="M58 46H90" ${S}/>
    <path d="M24 14L38 10Q44 18 50 10L64 14L72 34L62 38L60 32V80H22V32L20 38L10 34Z" fill="#3aa0e0" ${S}/>
    <path d="M38 10Q44 22 50 10" fill="#2a7fbf" ${S}/>${[36, 50, 64].map((y) => `<circle cx="44" cy="${y}" r="2.2" fill="#fff" ${S}/>`).join('')}`,
  // مُهَرِّجٌ
  clown: () => `<path d="M28 92Q50 70 72 92Z" fill="#9b8cff" ${S}/><path d="M26 76Q38 86 50 78Q62 86 74 76Q74 90 50 88Q26 90 26 76Z" fill="#fff" ${S}/>
    <circle cx="20" cy="46" r="11" fill="#ff8c2b" ${S}/><circle cx="80" cy="46" r="11" fill="#ff8c2b" ${S}/>
    <circle cx="50" cy="50" r="25" fill="#fff6ea" ${S}/>
    <path d="M32 30L50 2L68 30Z" fill="#3fa34d" ${S}/><circle cx="50" cy="4" r="5" fill="#ffd23f" ${S}/><circle cx="46" cy="20" r="3" fill="#ffd23f"/><circle cx="55" cy="25" r="3" fill="#e5484d"/>
    ${eye(40, 44, 4.4)}${eye(60, 44, 4.4)}<path d="M36 36l8 -2M56 34l8 2" ${S}/>
    <path d="M36 58Q50 74 64 58Q50 64 36 58Z" fill="#e5484d" ${S}/><circle cx="50" cy="53" r="6" fill="#e5484d" ${S}/>`,
  // مِعْطَفُ طويل بأزرار
  coat: () => `<path d="M34 12L50 20L66 12L82 22L90 66L78 68L74 44V92H26V44L22 68L10 66L18 22Z" fill="#7a5a3a" ${S}/>
    <path d="M34 12L44 36L50 20L56 36L66 12" fill="#5e4329" ${S}/><path d="M50 22V92" ${S}/>
    ${[44, 58, 72].map((y) => `<circle cx="56" cy="${y}" r="2.6" fill="#f2c14e" ${S}/>`).join('')}
    <path d="M30 66h10M60 66h10" ${S}/>`,
  // دَلَّةُ القهوة العربية
  coffee_pot: () => `<path d="M40 56Q20 52 14 26L22 22Q26 42 42 48" fill="#e3b23c" ${S}/>
    <path d="M62 44Q84 46 76 70Q72 80 64 84" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M62 44Q84 46 76 70Q72 80 64 84" fill="none" stroke="#e3b23c" stroke-width="4" stroke-linecap="round"/>
    <path d="M38 90Q26 70 42 58Q36 50 42 42H58Q64 50 58 58Q74 70 62 90Z" fill="#f2c14e" ${S}/>
    <path d="M36 74H64" fill="none" stroke="#c8902a" stroke-width="2.6"/><rect x="34" y="88" width="32" height="6" rx="3" fill="#c8902a" ${S}/>
    <path d="M40 42Q50 20 60 42Z" fill="#e3b23c" ${S}/><circle cx="50" cy="20" r="4" fill="#c8902a" ${S}/>`,
  // دِرْهَمُ: نقود معدنية
  coin: () => `${[78, 70, 62].map((y) => `<ellipse cx="68" cy="${y}" rx="20" ry="7" fill="#e3b23c" ${S}/>`).join('')}
    <circle cx="38" cy="52" r="28" fill="#f6c343" ${S}/><circle cx="38" cy="52" r="20" fill="none" stroke="#d99a1c" stroke-width="3"/>
    <path d="M38 40l3.5 7.5l8 1l-6 5.5l1.6 8l-7.1 -4l-7.1 4l1.6 -8l-6 -5.5l8 -1Z" fill="#e8a91c"/><path d="M24 36q4 -6 10 -8" fill="none" stroke="#fff3b0" stroke-width="3" stroke-linecap="round"/>`,
  // مِشْطٌ
  comb: () => `<g transform="rotate(-10 50 50)">${[...Array(13)].map((_, i) => `<rect x="${15 + i * 5.6}" y="44" width="3.4" height="${i < 3 ? 28 : 24}" rx="1.7" fill="#ff8fab" ${S}/>`).join('')}
    <rect x="10" y="28" width="80" height="20" rx="8" fill="#ff8fab" ${S}/><path d="M18 36H82" stroke="#ffc2d1" stroke-width="3" stroke-linecap="round"/></g>`,
  // طَاهِي بقبعة بيضاء
  cook: () => `<path d="M26 96V70Q26 58 50 58Q74 58 74 70V96Z" fill="#fff" ${S}/><path d="M38 66H62V96H38Z" fill="#9bd3f0" ${S}/>
    ${limb('M70 68Q84 72 80 58', '#fff')}<path d="M80 58L84 30" stroke="#a8743f" stroke-width="4" stroke-linecap="round"/><ellipse cx="84" cy="26" rx="5" ry="7" fill="#c8894a" ${S}/><circle cx="80" cy="60" r="5" fill="${SK}" ${S}/>
    <circle cx="50" cy="42" r="14" fill="${SK}" ${S}/>${eye(45, 41, 3.2)}${eye(55, 41, 3.2)}
    <path d="M42 50Q46 46 50 49Q54 46 58 50Q54 52 50 50Q46 52 42 50Z" fill="#5a3a22" ${S}/>
    <path d="M36 30Q28 14 40 12Q44 2 52 6Q60 2 64 12Q74 14 64 30Z" fill="#fff" ${S}/><rect x="36" y="26" width="28" height="7" rx="2" fill="#fff" ${S}/>`,
  // قِدْرُ طبخ بغطاء وبخار
  cooking_pot: () => `<path d="M38 26q-4 -6 0 -12M50 24q-4 -6 0 -12M62 26q-4 -6 0 -12" fill="none" stroke="#9aa9b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M18 50H82V80Q82 90 72 90H28Q18 90 18 80Z" fill="#e5484d" ${S}/><path d="M18 58H82" stroke="#c4383d" stroke-width="3"/>
    <rect x="6" y="52" width="14" height="7" rx="3.5" fill="#3b3b3b" ${S}/><rect x="80" y="52" width="14" height="7" rx="3.5" fill="#3b3b3b" ${S}/>
    <path d="M14 50Q50 30 86 50Z" fill="#ef6b6f" ${S}/><rect x="44" y="32" width="12" height="6" rx="3" fill="#3b3b3b" ${S}/>`,
  // هِلالٌ في السماء
  crescent_moon: () => `<rect x="6" y="6" width="88" height="88" rx="16" fill="#2e3a6b" ${S}/>
    <path d="M58 16A34 34 0 1 0 72 78A27 27 0 1 1 58 16Z" fill="#ffd23f" ${S}/>
    ${[[72, 26, 4], [82, 50, 3], [66, 54, 2.4]].map(([x, y, r]) => `<path d="M${x} ${y - r * 2}L${x + r * 0.6} ${y - r * 0.6}L${x + r * 2} ${y}L${x + r * 0.6} ${y + r * 0.6}L${x} ${y + r * 2}L${x - r * 0.6} ${y + r * 0.6}L${x - r * 2} ${y}L${x - r * 0.6} ${y - r * 0.6}Z" fill="#fff3b0"/>`).join('')}`,
  // تِمْسَاحُ
  crocodile: () => crocF(-3, -20, 1.06),
  // تَماسِيْحُ: تمساحان
  crocodiles: () => `${crocF(4, -22, 0.88)}${crocF(8, 24, 0.88)}`,
  // تَاجُ ذهبي بجواهر
  crown: () => `<path d="M14 78L12 34L32 54L50 22L68 54L88 34L86 78Z" fill="#f6c343" ${S}/>
    <rect x="12" y="70" width="76" height="16" rx="4" fill="#e3a51b" ${S}/>
    ${[[12, 32], [50, 20], [88, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#ffd95a" ${S}/>`).join('')}
    <circle cx="32" cy="78" r="4" fill="#e5484d" ${S}/><path d="M50 72l5 6l-5 6l-5 -6Z" fill="#3aa0e0" ${S}/><circle cx="68" cy="78" r="4" fill="#3fa34d" ${S}/><circle cx="50" cy="52" r="5" fill="#e5484d" ${S}/>`,
  // خِيَارٌ: خيارتان
  cucumber: () => `${[[50, 38, -18], [50, 64, 8]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-40" y="-11" width="80" height="22" rx="11" fill="#4f9a3e" ${S}/>
    <path d="M-30 -4H24" stroke="#8cc96a" stroke-width="3.4" stroke-linecap="round"/>${[-22, -8, 6, 20].map((v) => `<circle cx="${v}" cy="4" r="1.4" fill="#2e6b25"/>`).join('')}<path d="M40 0l5 -2" ${S}/></g>`).join('')}`,
  // فِنْجَانُ على صحن
  cup: () => `<path d="M40 26q-4 -6 0 -12M54 26q-4 -6 0 -12" fill="none" stroke="#9aa9b8" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="48" cy="80" rx="40" ry="10" fill="#9bd3f0" ${S}/>
    <path d="M70 44Q90 44 86 58Q82 68 66 66" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M70 44Q90 44 86 58Q82 68 66 66" fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M20 36H76Q76 76 48 78Q20 76 20 36Z" fill="#fff" ${S}/><ellipse cx="48" cy="36" rx="28" ry="6" fill="#8a4b25" ${S}/>
    <path d="M26 52Q48 60 70 52" fill="none" stroke="#3aa0e0" stroke-width="3" stroke-linecap="round"/>`,
  // سِتَارَةُ نافذة
  curtain: () => `<rect x="18" y="16" width="64" height="72" fill="#9bd3f0" ${S}/><path d="M50 16V88M18 52H82" ${S}/>
    <path d="M10 14H44Q36 40 40 54Q30 58 30 88H10Z" fill="#e5484d" ${S}/><path d="M90 14H56Q64 40 60 54Q70 58 70 88H90Z" fill="#e5484d" ${S}/>
    <path d="M18 18V86M24 18Q28 50 22 86M82 18V86M76 18Q72 50 78 86" fill="none" stroke="#b8323a" stroke-width="2.4"/>
    <rect x="30" y="50" width="12" height="7" rx="3" fill="#ffd23f" ${S}/><rect x="58" y="50" width="12" height="7" rx="3" fill="#ffd23f" ${S}/>
    <rect x="4" y="9" width="92" height="6" rx="3" fill="#a8743f" ${S}/>`,
  // دِبْسُ: علبة دبس تمر
  date_syrup_tin: () => `<path d="M24 22V82Q24 90 50 90Q76 90 76 82V22Z" fill="#cfd6dd" ${S}/>
    <path d="M24 36Q50 42 76 36V72Q50 78 24 72Z" fill="#f2c14e" ${S}/>
    <path d="M50 46V62" stroke="#a8743f" stroke-width="3" stroke-linecap="round"/><path d="M50 48q-10 -2 -14 4M50 48q10 -2 14 4M50 48q-6 -8 -12 -6M50 48q6 -8 12 -6" fill="none" stroke="#3fa34d" stroke-width="3" stroke-linecap="round"/>
    <circle cx="46" cy="58" r="2.6" fill="#8a3b1c"/><circle cx="54" cy="58" r="2.6" fill="#8a3b1c"/>
    <ellipse cx="50" cy="22" rx="26" ry="8" fill="#e6eaee" ${S}/><ellipse cx="50" cy="22" rx="15" ry="4" fill="#6b2f12" ${S}/>
    <path d="M30 26Q30 34 32 38Q34 34 34 27" fill="#6b2f12" ${S}/>`,
  // تَمْرُ على صحن
  dates: () => `<ellipse cx="50" cy="74" rx="42" ry="14" fill="#f4e3c3" ${S}/><ellipse cx="50" cy="72" rx="32" ry="8" fill="#fff8ea"/>
    ${[[30, 62, -30], [50, 64, 10], [70, 62, 40], [40, 46, 60], [60, 46, -50]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse cx="0" cy="0" rx="8" ry="13" fill="#8a3b1c" ${S}/><path d="M-3 -6Q-5 0 -3 6" fill="none" stroke="#b5643a" stroke-width="2.4" stroke-linecap="round"/><path d="M0 -13v-2" ${S}/></g>`).join('')}`,
  // غَزَالٌ بقرنين
  deer: () => `${[44, 52, 70, 78].map((x) => `<rect x="${x - 2.5}" y="58" width="5" height="34" rx="2.5" fill="#d9a066" ${S}/>`).join('')}
    <path d="M84 50q8 -2 6 8" fill="none" ${S}/>
    <ellipse cx="62" cy="54" rx="24" ry="13" fill="#d9a066" ${S}/><path d="M44 60Q62 70 80 60" fill="none" stroke="#fff4dd" stroke-width="4" stroke-linecap="round"/>
    <path d="M40 52L24 30L38 24L54 46Z" fill="#d9a066" ${S}/>
    <path d="M30 22Q24 8 30 4M36 20Q36 8 44 6" fill="none" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M38 24Q46 18 48 26Q42 28 38 24Z" fill="#c4854a" ${S}/>
    <ellipse cx="28" cy="28" rx="12" ry="9" fill="#d9a066" ${S}/>${eye(28, 26, 3.6)}<circle cx="17" cy="30" r="2" fill="${K}"/><path d="M18 34Q22 36 26 34" fill="none" ${S}/>`,
  // كَلْبٌ جالس
  dog: () => `<path d="M72 80Q88 78 86 62" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M72 80Q88 78 86 62" fill="none" stroke="#d9a066" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="50" cy="74" rx="22" ry="18" fill="#d9a066" ${S}/><ellipse cx="50" cy="78" rx="10" ry="11" fill="#fff4dd"/>
    <ellipse cx="40" cy="90" rx="7" ry="4.5" fill="#d9a066" ${S}/><ellipse cx="60" cy="90" rx="7" ry="4.5" fill="#d9a066" ${S}/>
    <circle cx="50" cy="38" r="22" fill="#d9a066" ${S}/>
    <path d="M30 26Q18 30 22 54Q30 54 32 40Z" fill="#8a5a3b" ${S}/><path d="M70 26Q82 30 78 54Q70 54 68 40Z" fill="#8a5a3b" ${S}/>
    ${eye(42, 34, 4.6)}${eye(58, 34, 4.6)}<ellipse cx="50" cy="48" rx="10" ry="7" fill="#fff4dd" ${S}/>
    <ellipse cx="50" cy="44" rx="4" ry="3" fill="${K}"/><path d="M47 52Q48 60 52 60Q55 58 53 52Z" fill="#ff8fab" ${S}/>`,
  // دُمْيَةُ بنت بحجاب وفستان
  doll: () => `<path d="M30 92L38 50H62L70 92Z" fill="#9b8cff" ${S}/>${[[42, 66], [56, 74], [46, 84], [60, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join('')}
    ${limb('M40 54L28 72', '#9b8cff')}${limb('M60 54L72 72', '#9b8cff')}<circle cx="27" cy="74" r="4.4" fill="${SK}" ${S}/><circle cx="73" cy="74" r="4.4" fill="${SK}" ${S}/>
    ${girl(50, 30, 15, '#ffc046')}`,
  // عَجِيْنٌ في وعاء ومرقاق
  dough: () => `<path d="M30 46Q30 26 50 26Q70 26 70 46Z" fill="#f7e7c6" ${S}/><path d="M42 34q4 -3 8 0" fill="none" stroke="#e2c99a" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M14 46H86Q84 76 50 78Q16 76 14 46Z" fill="#3aa0e0" ${S}/><path d="M20 56H80" stroke="#7cc4ef" stroke-width="3"/>
    <g transform="rotate(-8 50 88)"><rect x="22" y="82" width="56" height="12" rx="6" fill="#d9a066" ${S}/><rect x="8" y="85" width="16" height="6" rx="3" fill="#a8743f" ${S}/><rect x="76" y="85" width="16" height="6" rx="3" fill="#a8743f" ${S}/></g>`,
  // فُسْتَانُ طويل بأكمام
  dress: () => `<path d="M40 8Q50 16 60 8" fill="none" ${S}/><path d="M36 14L50 8L64 14L86 44L78 50L64 34L74 94H26L36 34L22 50L14 44Z" fill="#ff8fab" ${S}/>
    <path d="M42 12Q50 22 58 12" fill="#ffc2d1" ${S}/><path d="M36 40H64" stroke="#e5484d" stroke-width="4"/>
    ${[[42, 56], [58, 62], [46, 76], [62, 82], [34, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" ${S}/>`).join('')}`,
  // طَبْلٌ بعصاتين
  drum: () => `<path d="M18 40V78Q18 90 50 90Q82 90 82 78V40Z" fill="#e5484d" ${S}/>
    <path d="M18 44L30 82L42 46L54 86L66 46L78 82" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
    <path d="M18 78Q18 90 50 90Q82 90 82 78" fill="none" stroke="#f6c343" stroke-width="5"/><path d="M18 40V78Q18 90 50 90Q82 90 82 78V40" fill="none" ${S}/>
    <ellipse cx="50" cy="40" rx="32" ry="11" fill="#fff4dd" ${S}/>
    <path d="M30 10L46 36M74 8L56 36" stroke="${K}" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="10" r="5" fill="#f6c343" ${S}/><circle cx="74" cy="8" r="5" fill="#f6c343" ${S}/>`,
  // بَطَّةُ بيضاء على الماء
  duck: () => `<path d="M16 54Q14 78 40 80H70Q90 78 88 56Q78 62 68 58Q60 46 46 52Q30 58 16 54Z" fill="#fff" ${S}/>
    <path d="M42 62Q56 56 66 66Q54 72 42 62Z" fill="#e8eef3" ${S}/>
    <path d="M60 52Q58 40 64 32" fill="none" stroke="${K}" stroke-width="15" stroke-linecap="round"/><path d="M60 52Q58 40 64 32" fill="none" stroke="#fff" stroke-width="9.8" stroke-linecap="round"/>
    <circle cx="68" cy="26" r="13" fill="#fff" ${S}/><path d="M78 24Q92 24 92 30Q86 34 78 32Z" fill="#ff8c2b" ${S}/>${eye(68, 23, 4)}
    <path d="M6 84q8 -6 16 0t16 0t16 0t16 0t16 0t10 0" fill="none" stroke="#3aa0e0" stroke-width="3.4" stroke-linecap="round"/>`,
  // أَثْقَالٌ: دمبلان
  dumbbells: () => `${[[50, 34, -8, '#3aa0e0'], [50, 70, 8, '#e5484d']].map(([x, y, a, c]) => `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-26" y="-3.5" width="52" height="7" rx="3.5" fill="#9aa9b8" ${S}/>
    <rect x="-40" y="-14" width="12" height="28" rx="4" fill="${c}" ${S}/><rect x="28" y="-14" width="12" height="28" rx="4" fill="${c}" ${S}/>
    <rect x="-28" y="-9" width="6" height="18" rx="2" fill="${c}" ${S}/><rect x="22" y="-9" width="6" height="18" rx="2" fill="${c}" ${S}/></g>`).join('')}`,
  // صَقْرٌ / نَسْرٌ بجناحين مفرودين
  eagle: () => `<path d="M42 44Q20 30 4 36Q10 44 16 46Q8 50 12 56Q20 54 22 58Q24 62 32 60Q38 62 44 58Z" fill="#8a5a3b" ${S}/>
    <path d="M58 44Q80 30 96 36Q90 44 84 46Q92 50 88 56Q80 54 78 58Q76 62 68 60Q62 62 56 58Z" fill="#8a5a3b" ${S}/>
    <path d="M42 76L36 92H64L58 76Z" fill="#6b4329" ${S}/>
    <ellipse cx="50" cy="60" rx="14" ry="20" fill="#7a4a2a" ${S}/>
    <path d="M44 80l-2 8M48 80v8M52 80v8M56 80l2 8" stroke="#f2b01e" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="50" cy="30" r="14" fill="#fff" ${S}/>${eye(44, 28, 3.6)}${eye(56, 28, 3.6)}
    <path d="M45 34Q50 32 55 34Q55 42 50 46Q49 40 45 34Z" fill="#f2b01e" ${S}/>`,
  // أُذُنٌ
  ear: () => `<path d="M38 88Q50 92 52 80Q54 70 64 62Q78 50 76 32Q72 10 50 10Q28 10 24 34Q22 44 30 46Q34 44 34 36Q36 22 50 22Q64 22 64 34Q64 46 54 52Q42 60 42 72Q42 80 36 80Z" fill="${SK}" ${S}/>
    <path d="M40 38Q42 30 50 30Q58 32 56 40Q54 46 48 48" fill="none" stroke="#d99a7a" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M46 56Q50 64 46 70" fill="none" stroke="#d99a7a" stroke-width="3" stroke-linecap="round"/>`,
  // بَيْضٌ في سلّة
  eggs: () => `${[[32, 50, -10], [50, 44, 0], [68, 50, 10]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="17" transform="rotate(${a} ${x} ${y})" fill="#fff7e8" ${S}/><path d="M${x - 5} ${y - 8}q2 -4 5 -5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M10 56H90L80 88H20Z" fill="#d9a066" ${S}/>${[66, 76].map((y) => `<path d="M${14 + (y - 56) * 0.3} ${y}H${86 - (y - 56) * 0.3}" stroke="#a8743f" stroke-width="2.6"/>`).join('')}
    ${[30, 44, 58, 72].map((x) => `<path d="M${x} 58v28" stroke="#a8743f" stroke-width="2"/>`).join('')}<path d="M10 56H90" ${S}/>`,
  // فِيْلُ رمادي
  elephant: () => `${[44, 58, 74, 86].map((x) => `<rect x="${x - 6}" y="64" width="12" height="26" rx="5" fill="#a7b4c2" ${S}/>`).join('')}
    <path d="M92 50q6 4 2 12" fill="none" ${S}/>
    <ellipse cx="64" cy="56" rx="30" ry="22" fill="#a7b4c2" ${S}/>
    <circle cx="30" cy="44" r="18" fill="#a7b4c2" ${S}/>
    <path d="M16 48Q6 62 10 80Q12 86 19 84Q21 78 17 74Q16 64 26 58" fill="#a7b4c2" ${S}/>
    <path d="M38 30Q60 22 60 48Q58 64 42 60Z" fill="#c1ccd7" ${S}/>
    ${eye(26, 40, 4)}<path d="M28 58Q30 66 36 66Q32 60 34 56Z" fill="#fff" ${S}/>`,
  // ظَرْفٌ برسالة
  envelope: () => `${env(50, 52, -6, '#fff4d6', 1.3)}<circle cx="50" cy="54" r="6" fill="#e5484d" ${S}/>`,
  // أَظْرُفٌ: ثلاثة أظرف
  envelopes: () => `${env(38, 30, -10, '#ffe27a', 0.9)}${env(62, 50, 8, '#9bd3f0', 0.9)}${env(42, 72, -4, '#fff4d6', 0.9)}`,
  // مِمْحَاةُ
  eraser: () => `<g transform="rotate(-18 50 50)"><rect x="14" y="36" width="72" height="28" rx="5" fill="#ff8fab" ${S}/><rect x="50" y="36" width="36" height="28" rx="5" fill="#3aa0e0" ${S}/>
    <path d="M18 42h28" stroke="#ffc2d1" stroke-width="3" stroke-linecap="round"/><path d="M14 64Q12 60 14 56" fill="none" ${S}/></g>
    ${[[18, 80], [26, 86], [12, 88], [34, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#ff8fab" ${S}/>`).join('')}`,
  // وَجْهٌ
  face: () => `<circle cx="14" cy="52" r="7" fill="${SK}" ${S}/><circle cx="86" cy="52" r="7" fill="${SK}" ${S}/>
    <circle cx="50" cy="52" r="36" fill="${SK}" ${S}/>
    <path d="M14 46Q12 12 50 14Q88 12 86 46Q80 30 64 30Q50 22 36 30Q20 30 14 46Z" fill="#5a3a22" ${S}/>
    ${eye(37, 50, 6.4)}${eye(63, 50, 6.4)}<path d="M28 40q6 -4 12 -1M60 39q6 -3 12 1" fill="none" ${S}/>
    <path d="M50 54Q46 64 52 64" fill="none" ${S}/><path d="M36 70Q50 82 64 70Q50 76 36 70Z" fill="#c94b4b" ${S}/>${cheeks(50, 64, 22)}`,
  // وُجُوْهٌ: ثلاثة وجوه
  faces: () => `${boy(26, 34, 15)}${girl(74, 36, 14, '#3fa34d')}${boy(50, 72, 15, '#2b2b2b')}`,
  // رِيْشَةُ
  feather: () => feath(50, 48, 25, '#3aa0e0', '#9bd3f0', 1.1),
  // رِيْشُ: ثلاث ريشات
  feathers: () => `${feath(28, 50, -20, '#e5484d', '#ffb0a8', 0.95)}${feath(50, 46, 0, '#ffc046', '#fff1b8', 0.95)}${feath(72, 50, 20, '#3fa34d', '#a9d97a', 0.95)}`,
  // جَنِيْنُ: طفل نائم ملتفّ داخل رحم
  fetus: () => `<ellipse cx="50" cy="52" rx="42" ry="40" fill="#ffd6dc" ${S}/>
    <path d="M52 86Q66 92 76 82" fill="none" stroke="#e86a92" stroke-width="3" stroke-linecap="round"/>
    <path d="M46 52Q30 54 32 70Q36 84 54 80Q72 76 70 60Q68 48 56 48Z" fill="${SK}" ${S}/>
    <path d="M58 74Q66 70 60 62Q52 60 50 68" fill="${SK}" ${S}/><path d="M38 66Q44 58 50 60" fill="none" ${S}/>
    <circle cx="44" cy="36" r="18" fill="${SK}" ${S}/>
    <path d="M36 36q3 3 6 0M48 36q3 3 6 0" fill="none" ${S}/><path d="M42 44q3 2 6 0" fill="none" ${S}/>${cheeks(44, 41, 10)}
    <path d="M58 70Q64 80 52 86" fill="none" stroke="#e86a92" stroke-width="3" stroke-linecap="round"/>`,
  // حَقْلٌ أخضر بخطوط زرع
  field: () => `<rect x="6" y="6" width="88" height="88" rx="10" fill="#bfe6f7" ${S}/><circle cx="76" cy="22" r="9" fill="#ffd23f" ${S}/>
    <path d="M7 42Q30 34 50 40Q72 46 93 38V86Q93 93 86 93H14Q7 93 7 86Z" fill="#7cc35a" ${S}/>
    ${[[30, 12], [40, 31], [50, 50], [60, 69], [70, 88]].map(([x, b]) => `<path d="M${x} 46L${b} 92" stroke="#4f9a3e" stroke-width="3" stroke-linecap="round"/>`).join('')}
    ${[[30, 70], [50, 62], [70, 72], [40, 84], [62, 86]].map(([x, y]) => `<path d="M${x} ${y}v-8M${x} ${y - 3}q-5 -2 -6 -7M${x} ${y - 3}q5 -2 6 -7" fill="none" stroke="#2e7d32" stroke-width="2.6" stroke-linecap="round"/>`).join('')}`,
  // تِيْنُ: حبة تين مع ورقة
  fig: () => `<path d="M60 24Q86 12 92 34Q80 32 78 44Q66 36 60 24Z" fill="#3fa34d" ${S}/><path d="M62 26Q76 30 84 32" fill="none" stroke="#2e7d32" stroke-width="2"/>${fig1(46, 56, 1.35, -8)}`,
  // تِيْنُ: ثلاث حبات
  figs: () => `${fig1(28, 44, 0.9, -15)}${fig1(72, 44, 0.9, 15)}${fig1(50, 64, 0.95, 0)}`,
};
