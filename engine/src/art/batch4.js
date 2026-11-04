// batch4 — original SVG art, 100×100 viewBox
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;
const SK = '#f6c9a6';
const cheeks = (x1, x2, y) => `<circle cx="${x1}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".7"/><circle cx="${x2}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".7"/>`;
// رجل بالغ بأسلوب «الطبيب» في المكتبة: لون اللباس، الشعر، قبعة، إضافات فوق الجسم
const man = (coat, hat = '', extra = '', hair = true) => `<path d="M28 94V62Q28 50 50 50Q72 50 72 62V94Z" fill="${coat}" ${S}/>
    ${extra}<rect x="36" y="92" width="10" height="5" rx="2" fill="${K}"/><rect x="54" y="92" width="10" height="5" rx="2" fill="${K}"/>
    <rect x="45" y="40" width="10" height="11" rx="3" fill="${SK}" ${S}/><circle cx="50" cy="28" r="17" fill="${SK}" ${S}/>
    ${hair ? `<path d="M33 26Q34 8 52 10Q68 12 67 26Q62 18 50 17Q40 17 33 26Z" fill="#3b2a20" ${S}/>` : ''}
    ${eye(44, 29, 3.4)}${eye(56, 29, 3.4)}<path d="M45 37Q50 41 55 37" fill="none" ${S}/>${cheeks(39, 61, 34)}${hat}`;
// طفل صغير (بنت بحجاب وثوب طويل، أو ولد بقميص وبنطال)
const kid = (x, c, girl) => `<g transform="translate(${x} 0)">
    ${girl ? `<path d="M-10 34L-15 88H15L10 34Z" fill="${c}" ${S}/>` : `<rect x="-6" y="62" width="5" height="26" rx="2" fill="#3a5a7a" ${S}/><rect x="1" y="62" width="5" height="26" rx="2" fill="#3a5a7a" ${S}/><path d="M-10 64V40Q-10 34 0 34Q10 34 10 40V64Z" fill="${c}" ${S}/>`}
    ${girl ? `<path d="M-13 24Q-14 6 0 6Q14 6 13 24L11 36H-11Z" fill="#9b6bc8" ${S}/>` : ''}
    <circle cx="0" cy="21" r="${girl ? 9 : 11}" fill="${SK}" ${S}/>
    ${girl ? '' : `<path d="M-11 19Q-10 8 2 9Q11 10 11 19Q6 14 0 14Q-6 14 -11 19Z" fill="#3b2a20" ${S}/>`}
    <circle cx="-3.5" cy="21" r="1.8" fill="${K}"/><circle cx="3.5" cy="21" r="1.8" fill="${K}"/><path d="M-4 26Q0 29 4 26" fill="none" ${S}/></g>`;
const lemon = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-20 0Q-22 -4 -18 -6Q-10 -16 4 -15Q16 -13 20 -4Q23 -1 21 2Q16 14 0 15Q-14 14 -20 0Z" fill="#ffe14d" ${S}/><ellipse cx="-6" cy="-6" rx="5" ry="2.5" fill="#fff6b0"/></g>`;
const apple = (x, y) => `<path d="M${x} ${y - 12}Q${x - 6} ${y - 18} ${x - 14} ${y - 12}Q${x - 22} ${y - 2} ${x - 14} ${y + 12}Q${x - 6} ${y + 20} ${x} ${y + 14}Q${x + 6} ${y + 20} ${x + 14} ${y + 12}Q${x + 22} ${y - 2} ${x + 14} ${y - 12}Q${x + 6} ${y - 18} ${x} ${y - 12}Z" fill="#e5484d" ${S}/><path d="M${x} ${y - 12}Q${x} ${y - 20} ${x + 3} ${y - 24}" fill="none" ${S}/><path d="M${x + 2} ${y - 18}q8 -8 14 -4q-6 8 -14 4z" fill="#3fa34d" ${S}/><ellipse cx="${x - 9}" cy="${y - 4}" rx="3" ry="5" fill="#ff8a8e"/>`;
const bill = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-26" y="-14" width="52" height="28" rx="3" fill="#8fd18a" ${S}/><rect x="-20" y="-9" width="40" height="18" rx="2" fill="none" stroke="#3f8a3a" stroke-width="2"/><circle cx="0" cy="0" r="6" fill="#c7ecc2" stroke="#3f8a3a" stroke-width="2"/></g>`;

export const ART_BATCH4 = {
  // حِصَانٌ بني
  horse: () => `<path d="M80 46Q96 52 90 80Q84 68 78 56Z" fill="#6b3e22" ${S}/>
    ${[36, 46, 64, 74].map((x) => `<rect x="${x}" y="60" width="8" height="30" rx="3" fill="#b8693c" ${S}/><rect x="${x - 1}" y="86" width="10" height="6" rx="2" fill="${K}"/>`).join('')}
    <ellipse cx="58" cy="54" rx="27" ry="15" fill="#c8794a" ${S}/>
    <path d="M32 54L22 24L36 18L48 44Z" fill="#c8794a" ${S}/>
    <ellipse cx="20" cy="32" rx="14" ry="8.5" transform="rotate(-40 20 32)" fill="#c8794a" ${S}/>
    <path d="M26 18L28 8L33 18Z" fill="#c8794a" ${S}/>
    <path d="M32 17Q44 26 48 44L42 46Q37 32 29 22Z" fill="#6b3e22" ${S}/>
    ${eye(23, 26, 3.4)}<circle cx="11" cy="40" r="1.8" fill="${K}"/><path d="M13 45Q17 46 19 43" fill="none" ${S}/>`,
  // مُسْتَشْفَى بصليب أحمر
  hospital: () => `<rect x="14" y="34" width="72" height="58" rx="3" fill="#eaf4fb" ${S}/>
    <rect x="34" y="14" width="32" height="24" rx="3" fill="#fff" ${S}/>
    <path d="M46 18h8v6h6v8h-6v6h-8v-6h-6v-8h6z" transform="translate(0 -1)" fill="#e5484d" stroke="none"/>
    ${[22, 40, 54, 72].map((x) => [44, 60].map((y) => `<rect x="${x}" y="${y}" width="8" height="9" rx="1.5" fill="#9bd3f0" ${S}/>`).join('')).join('')}
    <rect x="42" y="74" width="16" height="18" rx="2" fill="#7cc4e8" ${S}/><path d="M50 74V92" ${S}/>
    <rect x="8" y="90" width="84" height="5" rx="2.5" fill="#a7a7a7" ${S}/>`,
  // دَارٌ: بيت بسقف أحمر
  house: () => `<rect x="22" y="48" width="56" height="42" fill="#f7d77a" ${S}/>
    <path d="M14 50L50 16L86 50Z" fill="#e5484d" ${S}/>
    <rect x="64" y="20" width="9" height="16" fill="#c8794a" ${S}/>
    <rect x="44" y="64" width="14" height="26" rx="2" fill="#c8794a" ${S}/><circle cx="54" cy="78" r="1.8" fill="${K}"/>
    <rect x="28" y="58" width="12" height="12" rx="2" fill="#9bd3f0" ${S}/><path d="M34 58V70M28 64H40" ${S}/>
    <rect x="62" y="58" width="12" height="12" rx="2" fill="#9bd3f0" ${S}/><path d="M68 58V70M62 64H74" ${S}/>
    <rect x="10" y="88" width="80" height="6" rx="3" fill="#7cc46a" ${S}/>`,
  // ظَلَامٌ: بيت في الليل مع هلال ونجوم
  house_at_night: () => `<rect x="6" y="6" width="88" height="88" rx="12" fill="#2b3a67" ${S}/>
    <path d="M28 14A12 12 0 1 0 40 30A9 9 0 1 1 28 14Z" fill="#ffe27a" ${S}/>
    ${[[62, 16], [82, 28], [52, 34], [16, 46]].map(([x, y]) => `<path d="M${x} ${y - 5}L${x + 1.6} ${y - 1.6}L${x + 5} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 5}L${x - 1.6} ${y + 1.6}L${x - 5} ${y}L${x - 1.6} ${y - 1.6}Z" fill="#fff3a8"/>`).join('')}
    <rect x="30" y="58" width="44" height="32" fill="#4b4f7a" ${S}/><path d="M24 60L52 38L80 60Z" fill="#6b4a6e" ${S}/>
    <rect x="37" y="66" width="11" height="11" rx="2" fill="#ffd95a" ${S}/><rect x="56" y="68" width="11" height="22" rx="2" fill="#3a2e4e" ${S}/>`,
  // صَيَّادٌ: صياد بقبعة وصنارة وسمكة
  hunter: () => `<path d="M76 70L94 14" fill="none" stroke="#8a5a3b" stroke-width="3.4" stroke-linecap="round"/><path d="M94 14Q96 40 88 56" fill="none" stroke="${K}" stroke-width="1.4"/>
    <path d="M80 62Q88 54 96 62Q88 70 80 62Z" fill="#7cc4e8" ${S}/><path d="M80 62L76 57V67Z" fill="#7cc4e8" ${S}/>
    ${man('#7a8a4a', `<ellipse cx="50" cy="15" rx="24" ry="5" fill="#c8a25a" ${S}/><path d="M38 14Q38 0 50 0Q62 0 62 14Z" fill="#c8a25a" ${S}/><path d="M38 11H62" stroke="#8a5a3b" stroke-width="3"/>`, `<path d="M40 52V94M60 52V94" stroke="#55622f" stroke-width="2.4"/><circle cx="74" cy="72" r="5" fill="${SK}" ${S}/>`, false)}`,
  // ثَلْجٌ: مكعبات ثلج
  ice: () => `${[[30, 58, -8], [68, 56, 10], [50, 30, 4]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-18" y="-18" width="36" height="36" rx="7" fill="#bfe6fb" ${S}/><path d="M-10 -10H2M-10 -10V2" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="9" cy="9" r="2.5" fill="#fff"/></g>`).join('')}
    <ellipse cx="50" cy="88" rx="38" ry="5" fill="#9bd3f0" opacity=".6"/>`,
  // عَلَمٌ عراقي: أحمر وأبيض وأسود مع خط أخضر
  iraqi_flag: () => `<rect x="14" y="10" width="5" height="84" rx="2.5" fill="#8a5a3b" ${S}/><circle cx="16.5" cy="9" r="4" fill="#f6c343" ${S}/>
    <rect x="19" y="16" width="70" height="17" fill="#d62828"/><rect x="19" y="33" width="70" height="17" fill="#fff"/><rect x="19" y="50" width="70" height="17" fill="#2b2b2b"/>
    <path d="M38 44Q42 36 46 42Q50 46 54 38Q58 44 62 40Q66 36 70 42" fill="none" stroke="#2e9a4a" stroke-width="3" stroke-linecap="round"/>
    <rect x="19" y="16" width="70" height="51" fill="none" ${S}/>`,
  // مِكْوَاةٌ
  iron: () => `<path d="M12 74Q14 46 46 42H86V74Z" fill="#5aa9e6" ${S}/>
    <path d="M10 74H88V82H10Z" fill="#c9d3dc" ${S}/>
    <path d="M44 42Q46 20 62 20H80Q86 20 86 28V42" fill="none" ${S}/><path d="M50 42Q52 28 62 28H78V42" fill="none" ${S}/>
    <path d="M44 42Q46 20 62 20H80Q86 20 86 28V42H78V28H62Q52 28 50 42Z" fill="#3a7fc0" ${S}/>
    <circle cx="62" cy="58" r="6" fill="#fff" ${S}/><path d="M62 58L65 55" ${S}/>
    <path d="M30 56Q34 52 38 56" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M86 48Q96 52 92 64" fill="none" stroke="${K}" stroke-width="2"/>`,
  // جَزِيرَةٌ: رمل ونخلة في البحر
  island: () => `<rect x="6" y="62" width="88" height="32" rx="10" fill="#5ab4e6" ${S}/>
    <path d="M14 76Q30 74 34 76M60 86Q72 84 80 86" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M16 68Q50 40 86 68Z" fill="#f2d28a" ${S}/>
    <path d="M52 58Q50 38 56 22" fill="none" stroke="#a0683e" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M56 22Q40 14 26 26Q42 22 56 22ZM56 22Q72 12 86 24Q70 20 56 22ZM56 22Q46 28 40 42Q50 30 56 22ZM56 22Q68 28 72 42Q64 30 56 22ZM56 22Q54 10 62 6Q58 14 56 22Z" fill="#3fa34d" ${S}/>
    <circle cx="54" cy="25" r="3" fill="#8a5a3b"/><circle cx="59" cy="26" r="3" fill="#8a5a3b"/>`,
  // سِتْرَةٌ
  jacket: () => `<path d="M36 12L22 18Q12 22 12 34V86H28V48L30 92H70L72 48V86H88V34Q88 22 78 18L64 12Q50 22 36 12Z" fill="#3a7fc0" ${S}/>
    <path d="M36 12L44 30L50 20L56 30L64 12" fill="#2d6099" ${S}/><path d="M50 22V92" ${S}/>
    ${[44, 58, 72].map((y) => `<circle cx="55" cy="${y}" r="2" fill="#f6c343" ${S}/>`).join('')}
    <path d="M34 66H44M56 66H66" ${S}/><rect x="12" y="80" width="16" height="6" fill="#2d6099" ${S}/><rect x="72" y="80" width="16" height="6" fill="#2d6099" ${S}/>`,
  // مُرَبَّى: برطمان بغطاء قماشي وفراولة
  jam: () => `<rect x="20" y="30" width="48" height="60" rx="10" fill="#d1314b" ${S}/>
    <rect x="26" y="40" width="8" height="34" rx="4" fill="#f27a8a"/>
    <path d="M14 26Q44 16 74 26L70 36Q44 30 18 36Z" fill="#fff" ${S}/>
    ${[22, 34, 46, 58].map((x) => `<rect x="${x}" y="24" width="6" height="6" fill="#e5484d"/>`).join('')}
    <path d="M18 34Q44 28 70 34" fill="none" stroke="#e5484d" stroke-width="3"/>
    <rect x="30" y="54" width="28" height="18" rx="4" fill="#fff6e0" ${S}/>
    <path d="M80 62Q92 64 90 76Q86 90 78 92Q70 90 68 76Q68 64 80 62Z" fill="#e5484d" ${S}/><path d="M72 62L80 58L88 62L80 66Z" fill="#3fa34d" ${S}/>
    ${[[76, 72], [84, 74], [79, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#ffd95a"/>`).join('')}`,
  // يَاسَمِين: أزهار بيضاء على غصن
  jasmine: () => `<path d="M14 90Q40 66 50 40Q58 22 86 12" fill="none" stroke="#3f8a3a" stroke-width="3.4" stroke-linecap="round"/>
    ${[[28, 74, 20], [70, 26, -30], [60, 66, 140]].map(([x, y, r]) => `<path d="M${x} ${y}q-6 -10 2 -16q8 6 -2 16z" transform="rotate(${r} ${x} ${y})" fill="#5fbf5a" ${S}/>`).join('')}
    ${[[32, 54], [68, 46], [50, 22]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-8" rx="5.5" ry="8" transform="rotate(${a})" fill="#fff" ${S}/>`).join('')}<circle r="3.6" fill="#ffd95a" ${S}/></g>`).join('')}
    <ellipse cx="84" cy="66" rx="4" ry="7" fill="#fff" ${S}/>`,
  // وطننا يوحدنا: ثلاثة أطفال يتشابكون بالأيدي
  joined_hands: () => `<path d="M12 50L14 38M28 40Q34 52 40 40M60 40Q66 52 72 40M88 38L86 50" fill="none" ${S}/>
    ${kid(20, '#e5484d', false)}${kid(50, '#7cc4e8', true)}${kid(80, '#3fa34d', false)}
    <circle cx="34" cy="49" r="3.4" fill="${SK}" ${S}/><circle cx="66" cy="49" r="3.4" fill="${SK}" ${S}/>`,
  // إِبْرِيقٌ نحاسي
  jug: () => `<path d="M34 32Q22 52 30 78Q36 90 50 90Q64 90 70 78Q78 52 66 32Z" fill="#e0a04a" ${S}/>
    <path d="M34 78Q50 84 66 78" fill="none" stroke="#b8732e" stroke-width="2.4"/>
    <path d="M30 56Q16 48 10 26L16 24Q22 40 32 46" fill="#e0a04a" ${S}/>
    <path d="M70 40Q90 40 86 60Q84 72 70 74" fill="none" ${S}/>
    <rect x="34" y="24" width="32" height="9" rx="4" fill="#c8823a" ${S}/><path d="M38 24Q50 8 62 24Z" fill="#e0a04a" ${S}/><circle cx="50" cy="12" r="3.4" fill="#c8823a" ${S}/>
    <ellipse cx="42" cy="54" rx="4" ry="9" fill="#f6c97a"/>`,
  // مِفْتَاحٌ ذهبي
  key: () => `<circle cx="28" cy="50" r="18" fill="#f6c343" ${S}/><circle cx="28" cy="50" r="7" fill="#fff" ${S}/>
    <path d="M44 45H90V55H84V66H76V55H70V64H62V55H44Z" fill="#f6c343" ${S}/>
    <circle cx="22" cy="42" r="2.6" fill="#fff3a8"/>`,
  // مَطْبَخٌ: خزانة وطباخ وقدر
  kitchen: () => `<rect x="10" y="10" width="80" height="18" rx="3" fill="#c8794a" ${S}/><path d="M50 10V28" ${S}/><circle cx="46" cy="20" r="1.8" fill="${K}"/><circle cx="54" cy="20" r="1.8" fill="${K}"/>
    <rect x="10" y="56" width="80" height="36" rx="3" fill="#e9e3d6" ${S}/><rect x="10" y="52" width="80" height="6" rx="2" fill="#9aa9b8" ${S}/>
    <rect x="18" y="64" width="30" height="22" rx="3" fill="#4b4f5a" ${S}/><rect x="22" y="68" width="22" height="12" rx="2" fill="#ffb44d"/>
    <rect x="56" y="62" width="28" height="26" rx="3" fill="#c8794a" ${S}/><circle cx="60" cy="75" r="1.8" fill="${K}"/>
    <path d="M22 52V40H44V52Z" fill="#e5484d" ${S}/><rect x="18" y="37" width="30" height="5" rx="2.5" fill="#c43a3f" ${S}/>
    <path d="M28 34Q25 30 28 26M38 34Q35 30 38 26" fill="none" stroke="#9aa9b8" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M70 52V36" ${S}/><ellipse cx="70" cy="42" rx="7" ry="6" fill="#9aa9b8" ${S}/>`,
  // رُكْبَةٌ: ساق مثنية والركبة مميزة
  knee: () => `<path d="M8 22H40L74 50Q80 56 76 64L66 84H50L60 62L30 48H8Z" fill="${SK}" ${S}/>
    <path d="M8 16H42L48 30L36 52H8Z" fill="#3a7fc0" ${S}/>
    <path d="M48 86H74Q86 86 88 94H48Z" fill="#e5484d" ${S}/><path d="M48 86L50 80H66L68 86" fill="#fff" ${S}/>
    <g transform="rotate(-35 68 50)"><rect x="56" y="44" width="24" height="12" rx="6" fill="#f2cfa0" ${S}/><rect x="64" y="45.5" width="8" height="9" fill="#e8b98a"/></g>
    <circle cx="68" cy="50" r="17" fill="none" stroke="#e5484d" stroke-width="2.6" stroke-dasharray="5 4"/>`,
  // دَرَجٌ: سلّم خشبي
  ladder: () => `<path d="M30 8L22 94M70 8L78 94" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M30 8L22 94M70 8L78 94" fill="none" stroke="#e0a04a" stroke-width="5" stroke-linecap="round"/>
    ${[20, 36, 52, 68, 84].map((y) => `<rect x="${28 - y * 0.09}" y="${y - 3}" width="${44 + y * 0.18}" height="7" rx="3" fill="#c8794a" ${S}/>`).join('')}`,
  // فَانُوسٌ رمضاني
  lantern: () => `<path d="M50 6V12" ${S}/><circle cx="50" cy="8" r="4" fill="none" ${S}/>
    <path d="M38 22L50 12L62 22Z" fill="#f6c343" ${S}/><rect x="34" y="22" width="32" height="6" rx="2" fill="#e0a04a" ${S}/>
    <path d="M34 28L26 52L34 76H66L74 52L66 28Z" fill="#e5484d" ${S}/>
    <path d="M42 28L38 52L42 76H58L62 52L58 28Z" fill="#ffd95a" ${S}/><path d="M26 52H74M50 28V76" fill="none" ${S}/>
    <path d="M50 62Q44 56 50 46Q56 56 50 62Z" fill="#ff9f1c" ${S}/>
    <path d="M32 76H68L60 88H40Z" fill="#f6c343" ${S}/><path d="M44 88L50 96L56 88" fill="#e0a04a" ${S}/>`,
  // حَاسُوبٌ محمول
  laptop: () => `<rect x="20" y="16" width="60" height="44" rx="4" fill="#4b4f5a" ${S}/><rect x="25" y="21" width="50" height="34" rx="2" fill="#7cc4e8"/>
    <path d="M30 46L40 34L48 42L56 30L70 46Z" fill="#3fa34d"/><circle cx="64" cy="28" r="4" fill="#ffd95a"/>
    <path d="M14 62H86L94 82H6Z" fill="#c9d3dc" ${S}/>
    ${[66, 72].map((y) => [0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${20 + i * 9 - (y - 66) * 0.3}" y="${y}" width="6" height="3.5" rx="1" fill="#8a96a3"/>`).join('')).join('')}
    <rect x="40" y="77" width="20" height="3" rx="1.5" fill="#8a96a3"/>`,
  // يَضْحَكُ: ولد يضحك
  laughing_boy: () => `<ellipse cx="14" cy="54" rx="6" ry="9" fill="${SK}" ${S}/><ellipse cx="86" cy="54" rx="6" ry="9" fill="${SK}" ${S}/>
    <circle cx="50" cy="52" r="36" fill="${SK}" ${S}/>
    <path d="M15 46Q14 12 50 14Q86 12 85 46Q78 28 62 30Q56 22 48 28Q32 24 15 46Z" fill="#3b2a20" ${S}/>
    <path d="M30 46Q36 38 42 46M58 46Q64 38 70 46" fill="none" ${S}/>
    <path d="M30 60Q50 64 70 60Q68 84 50 84Q32 84 30 60Z" fill="#a8323e" ${S}/>
    <path d="M32 61Q50 65 68 61L66 66Q50 69 34 66Z" fill="#fff"/><path d="M40 78Q50 72 60 78Q56 83 50 83Q44 83 40 78Z" fill="#f27a8a"/>
    ${cheeks(26, 74, 58)}`,
  // لَيْمُونٌ: ليمونة واحدة بورقة
  lemon: () => `${lemon(48, 56, -15).replace('translate(48 56)', 'translate(48 56) scale(1.7)')}
    <path d="M70 30Q80 14 94 18Q88 34 70 30Z" fill="#3fa34d" ${S}/><path d="M70 30Q80 24 90 20" fill="none" stroke="#2e7a3a" stroke-width="2"/>`,
  // لَيْمُونٌ: ثلاث ليمونات
  lemons: () => `${lemon(32, 40, -20)}${lemon(70, 42, 25)}${lemon(50, 72, 0)}
    <path d="M54 20Q62 8 74 12Q68 24 54 20Z" fill="#3fa34d" ${S}/>`,
  // خَسٌّ
  lettuce: () => `<path d="M14 62Q8 36 30 30Q36 12 52 18Q70 10 76 30Q96 36 88 62Q84 88 50 90Q18 88 14 62Z" fill="#8fd16a" ${S}/>
    <path d="M26 64Q22 44 38 40Q46 28 60 36Q76 38 74 60Q72 80 50 82Q30 80 26 64Z" fill="#b6e38a" ${S}/>
    <path d="M50 84V46M50 70L38 58M50 62L62 52M50 76L64 66" fill="none" stroke="#5fa040" stroke-width="2.4" stroke-linecap="round"/>`,
  // مِصْبَاحٌ: مصباح كهربائي مضيء
  light_bulb: () => `${[[50, 4, 50, 12], [20, 16, 26, 22], [80, 16, 74, 22], [8, 44, 16, 44], [92, 44, 84, 44]].map(([a, b, c, d]) => `<path d="M${a} ${b}L${c} ${d}" ${S}/>`).join('')}
    <path d="M36 66Q24 56 24 42Q24 18 50 18Q76 18 76 42Q76 56 64 66V72H36Z" fill="#ffe14d" ${S}/>
    <path d="M44 66V52L50 46L56 52V66" fill="none" stroke="#e0a04a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="38" cy="36" rx="4" ry="7" fill="#fff6b0"/>
    <rect x="36" y="72" width="28" height="14" rx="3" fill="#9aa9b8" ${S}/><path d="M36 79H64" ${S}/><path d="M42 86Q50 96 58 86Z" fill="#4b4f5a" ${S}/>`,
  // أَسَدٌ بلبدة كبيرة
  lion: () => `${Array.from({ length: 12 }, (_, i) => { const a = (i * 30 * Math.PI) / 180; return `<circle cx="${(50 + 30 * Math.cos(a)).toFixed(1)}" cy="${(52 + 30 * Math.sin(a)).toFixed(1)}" r="14" fill="#c8682e" ${S}/>`; }).join('')}
    <circle cx="50" cy="52" r="32" fill="#c8682e"/>
    <circle cx="28" cy="30" r="7" fill="#f2b04a" ${S}/><circle cx="72" cy="30" r="7" fill="#f2b04a" ${S}/>
    <circle cx="50" cy="54" r="24" fill="#f2b04a" ${S}/>
    ${eye(41, 48)}${eye(59, 48)}
    <ellipse cx="50" cy="64" rx="10" ry="7" fill="#fbe0a6" ${S}/><path d="M46 59H54L50 63Z" fill="${K}" ${S}/>
    <path d="M44 68Q50 72 56 68" fill="none" ${S}/>`,
  // شِبْلٌ: أسد صغير جالس
  lion_cub: () => `<path d="M70 80Q90 80 88 62" fill="none" ${S}/><path d="M86 64Q84 54 92 56Q94 64 86 64Z" fill="#c8682e" ${S}/>
    <ellipse cx="54" cy="74" rx="24" ry="18" fill="#f2b04a" ${S}/>
    <ellipse cx="40" cy="90" rx="9" ry="5" fill="#f2b04a" ${S}/><ellipse cx="62" cy="90" rx="9" ry="5" fill="#f2b04a" ${S}/>
    <circle cx="30" cy="22" r="8" fill="#f2b04a" ${S}/><circle cx="70" cy="22" r="8" fill="#f2b04a" ${S}/><circle cx="30" cy="22" r="4" fill="#e89a8a"/><circle cx="70" cy="22" r="4" fill="#e89a8a"/>
    <circle cx="50" cy="40" r="24" fill="#f2b04a" ${S}/>
    <path d="M44 18Q50 12 56 18" fill="none" stroke="#c8682e" stroke-width="3" stroke-linecap="round"/>
    ${eye(41, 36, 4.6)}${eye(59, 36, 4.6)}
    <ellipse cx="50" cy="50" rx="9" ry="6" fill="#fbe0a6" ${S}/><path d="M46 46H54L50 50Z" fill="${K}" ${S}/><path d="M45 54Q50 57 55 54" fill="none" ${S}/>`,
  // مُمَرِّضٌ بلباس أزرق وقبعة
  male_nurse: () => `${man('#7cc4e8', `<path d="M33 22Q32 8 50 8Q68 8 67 22Z" fill="#5aa9e6" ${S}/><path d="M48 11h4v3h3v4h-3v3h-4v-3h-3v-4h3z" fill="#e5484d"/>`, `<path d="M42 51L50 62L58 51" fill="#fff" ${S}/><rect x="56" y="68" width="10" height="12" rx="2" fill="#fff" ${S}/><path d="M59.5 74h3M61 72.5v3" stroke="#e5484d" stroke-width="2.2" stroke-linecap="round"/>`, false)}`,
  // سُوقٌ: كشك بمظلة مخططة وصناديق فاكهة
  market: () => `<path d="M16 34V90M84 34V90" ${S}/>
    <path d="M10 34L18 14H82L90 34Z" fill="#fff" ${S}/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${18 + i * 16} 14H${26 + i * 16}L${22 + i * 20} 34H${12 + i * 20}Z" fill="#e5484d"/>`).join('')}
    <path d="M10 34L18 14H82L90 34Z" fill="none" ${S}/>
    ${[10, 30, 50, 70].map((x) => `<path d="M${x} 34Q${x + 10} 44 ${x + 20} 34" fill="#e5484d" ${S}/>`).join('')}
    <rect x="12" y="66" width="76" height="24" rx="2" fill="#c8794a" ${S}/><path d="M38 66V90M62 66V90" ${S}/>
    ${[18, 25, 32].map((x) => `<circle cx="${x}" cy="62" r="5" fill="#ff9f1c" ${S}/>`).join('')}
    ${[44, 51, 58].map((x) => `<circle cx="${x}" cy="62" r="5" fill="#e5484d" ${S}/>`).join('')}
    ${[68, 75, 82].map((x) => `<circle cx="${x}" cy="62" r="5" fill="#8fd16a" ${S}/>`).join('')}`,
  // لَحْمٌ: قطعة لحم بعظمة
  meat: () => `<path d="M18 46Q14 22 44 18Q74 14 84 36Q92 60 70 76Q48 92 28 78Q16 68 18 46Z" fill="#f4e3d0" ${S}/>
    <path d="M26 48Q24 30 46 26Q70 24 76 40Q82 58 64 70Q46 82 32 72Q24 64 26 48Z" fill="#d9475a" ${S}/>
    <path d="M38 44Q50 38 62 46M40 58Q52 54 62 60" fill="none" stroke="#f08a96" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="66" cy="34" r="6" fill="#fff" ${S}/>`,
  // مِثْرَامَةٌ: مفرمة لحم يدوية
  meat_grinder: () => `<path d="M22 12H58L50 32H30Z" fill="#c9d3dc" ${S}/>
    <rect x="24" y="30" width="32" height="28" rx="6" fill="#9aa9b8" ${S}/>
    <rect x="56" y="36" width="18" height="16" rx="3" fill="#9aa9b8" ${S}/><circle cx="76" cy="44" r="10" fill="#c9d3dc" ${S}/>
    <circle cx="76" cy="44" r="4" fill="#9aa9b8" ${S}/>
    <path d="M44 44L60 22H74" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/><path d="M44 44L60 22H74" fill="none" stroke="#c9d3dc" stroke-width="2.4" stroke-linecap="round"/><rect x="72" y="16" width="8" height="14" rx="4" fill="#e5484d" ${S}/>
    <path d="M32 58H48L46 80H34Z" fill="#9aa9b8" ${S}/><rect x="24" y="80" width="32" height="6" rx="2" fill="#8a5a3b" ${S}/>
    <path d="M78 54Q76 64 80 70M84 54Q86 62 82 70M81 54V68" fill="none" stroke="#d9475a" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="81" cy="80" rx="10" ry="6" fill="#d9475a" ${S}/>`,
  // دَوَاءٌ: قنينة دواء وحبوب
  medicine: () => `<rect x="16" y="28" width="38" height="60" rx="6" fill="#ff9f1c" ${S}/><rect x="14" y="16" width="42" height="14" rx="3" fill="#fff" ${S}/>
    <rect x="20" y="44" width="30" height="28" rx="3" fill="#fff" ${S}/><path d="M31 58h8M35 54v8" stroke="#e5484d" stroke-width="3" stroke-linecap="round"/>
    <g transform="rotate(-35 76 44)"><rect x="62" y="37" width="28" height="14" rx="7" fill="#e5484d" ${S}/><path d="M76 37V51H69Q62 51 62 44Q62 37 69 37Z" fill="#fff" ${S}/></g>
    <circle cx="70" cy="74" r="8" fill="#fff" ${S}/><path d="M64 74H76" ${S}/><circle cx="86" cy="84" r="6" fill="#7cc4e8" ${S}/>`,
  // مِجْهَرٌ
  microscope: () => `<rect x="18" y="84" width="64" height="9" rx="3" fill="#4b4f5a" ${S}/>
    <path d="M58 84V68Q72 56 64 36L56 40Q62 54 50 64V84Z" fill="#5aa9e6" ${S}/>
    <rect x="28" y="62" width="34" height="5" rx="2" fill="#4b4f5a" ${S}/><rect x="36" y="58" width="16" height="4" rx="1" fill="#bfe6fb" ${S}/>
    <g transform="rotate(-30 46 32)"><rect x="40" y="10" width="14" height="40" rx="3" fill="#c9d3dc" ${S}/><rect x="38" y="6" width="18" height="7" rx="2" fill="#4b4f5a" ${S}/><rect x="43" y="50" width="8" height="8" rx="1" fill="#4b4f5a" ${S}/></g>
    <circle cx="66" cy="48" r="6" fill="#f6c343" ${S}/>`,
  // حَلِيبٌ: قنينة حليب وكأس
  milk_bottle: () => `<path d="M30 10H52V22Q64 32 64 46V86Q64 92 58 92H24Q18 92 18 86V46Q18 32 30 22Z" fill="#fff" ${S}/>
    <rect x="28" y="6" width="26" height="9" rx="3" fill="#3a7fc0" ${S}/>
    <path d="M18 52H64" stroke="#bfe6fb" stroke-width="2"/><rect x="24" y="56" width="34" height="20" rx="3" fill="#7cc4e8" ${S}/>
    <ellipse cx="41" cy="66" rx="9" ry="6" fill="#fff"/>
    <path d="M68 62H90L87 92H71Z" fill="#fff" ${S}/><path d="M69 70H89" stroke="#bfe6fb" stroke-width="2"/>
    <rect x="24" y="30" width="5" height="16" rx="2.5" fill="#eaf4fb"/>`,
  // نَعْنَاعٌ: غصن بأوراق
  mint: () => `<path d="M50 94V16" fill="none" stroke="#3f8a3a" stroke-width="3.4" stroke-linecap="round"/>
    ${[[24, -1], [44, 1], [64, -1], [80, 1]].map(([y, s]) => [-1, 1].map((d) => `<g transform="translate(50 ${y}) scale(${d} 1) rotate(${-25 * s})"><path d="M0 0Q8 -14 26 -10Q22 6 0 0Z" fill="#5fbf5a" ${S}/><path d="M2 -1Q12 -6 22 -8" fill="none" stroke="#2e7a3a" stroke-width="1.8"/></g>`).join('')).join('')}
    <path d="M50 16Q44 6 50 2Q56 6 50 16Z" fill="#5fbf5a" ${S}/>`,
  // هَاتِفٌ محمول
  mobile_phone: () => `<rect x="28" y="6" width="44" height="88" rx="8" fill="#3b3f4a" ${S}/><rect x="32" y="14" width="36" height="66" rx="3" fill="#7cc4e8"/>
    ${[0, 1, 2].map((c) => [0, 1, 2].map((r) => `<rect x="${36 + c * 11}" y="${20 + r * 12}" width="7" height="7" rx="2" fill="${['#ffd95a', '#e5484d', '#8fd16a'][(c + r) % 3]}"/>`).join('')).join('')}
    <circle cx="50" cy="87" r="3.4" fill="#9aa9b8" ${S}/><rect x="44" y="9" width="12" height="2.4" rx="1.2" fill="#9aa9b8"/>`,
  // نُقُودٌ: أوراق نقدية وعملات
  money: () => `${bill(44, 40, -12)}${bill(48, 58, 6)}
    ${[[72, 84], [84, 76], [60, 86]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="10" fill="#f6c343" ${S}/><circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#c8902a" stroke-width="2"/>`).join('')}`,
  // قِرْدٌ
  monkey: () => `<path d="M68 80Q92 80 88 56Q86 46 78 50" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M68 80Q92 80 88 56Q86 46 78 50" fill="none" stroke="#9a6233" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="50" cy="76" rx="20" ry="16" fill="#9a6233" ${S}/><ellipse cx="50" cy="78" rx="11" ry="10" fill="#f2cfa0"/>
    <ellipse cx="38" cy="92" rx="8" ry="4" fill="#9a6233" ${S}/><ellipse cx="62" cy="92" rx="8" ry="4" fill="#9a6233" ${S}/>
    <circle cx="20" cy="36" r="10" fill="#f2cfa0" ${S}/><circle cx="80" cy="36" r="10" fill="#f2cfa0" ${S}/>
    <circle cx="50" cy="36" r="26" fill="#9a6233" ${S}/>
    <path d="M30 40Q30 24 42 26Q50 30 58 26Q70 24 70 40Q72 58 50 58Q28 58 30 40Z" fill="#f2cfa0" ${S}/>
    ${eye(42, 34)}${eye(58, 34)}<circle cx="47" cy="44" r="1.4" fill="${K}"/><circle cx="53" cy="44" r="1.4" fill="${K}"/>
    <path d="M42 49Q50 55 58 49" fill="none" ${S}/>`,
  // جَامِعٌ: قبة ومئذنتان وهلال
  mosque: () => `<rect x="24" y="54" width="52" height="38" fill="#f2e6c9" ${S}/>
    <path d="M28 56Q28 28 50 22Q72 28 72 56Z" fill="#3fb0a8" ${S}/><path d="M50 22V12" ${S}/>
    <path d="M47 4A5 5 0 1 0 54 11A4 4 0 1 1 47 4Z" fill="#f6c343" ${S}/>
    ${[12, 80].map((x) => `<rect x="${x}" y="30" width="8" height="62" fill="#f2e6c9" ${S}/><rect x="${x - 2}" y="44" width="12" height="4" rx="1" fill="#3fb0a8" ${S}/><path d="M${x} 30L${x + 4} 18L${x + 8} 30Z" fill="#3fb0a8" ${S}/>`).join('')}
    <path d="M42 92V76Q42 68 50 68Q58 68 58 76V92Z" fill="#8a5a3b" ${S}/>
    <path d="M29 72V66Q29 62 33 62Q37 62 37 66V72ZM63 72V66Q63 62 67 62Q71 62 71 66V72Z" fill="#7cc4e8" ${S}/>
    <rect x="8" y="90" width="84" height="5" rx="2.5" fill="#c8a25a" ${S}/>`,
  // فَأْرٌ رمادي
  mouse: () => `<path d="M76 72Q94 74 92 58Q90 48 82 52" fill="none" stroke="#f7a8b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M18 70Q22 42 50 42Q80 42 80 70Q80 80 70 80H28Q18 80 18 70Z" fill="#b5b5bd" ${S}/>
    <circle cx="30" cy="34" r="12" fill="#b5b5bd" ${S}/><circle cx="30" cy="34" r="7" fill="#f7a8b8"/>
    <path d="M10 66Q8 50 26 44Q40 46 42 60Q42 72 26 72Q12 72 10 66Z" fill="#b5b5bd" ${S}/>
    ${eye(28, 56, 3.8)}<circle cx="9" cy="66" r="3" fill="#f27a8a" ${S}/>
    <path d="M14 70L4 74M14 64L4 62" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M18 72Q22 76 26 72" fill="none" ${S}/>
    <ellipse cx="34" cy="82" rx="7" ry="3.5" fill="#f7a8b8" ${S}/><ellipse cx="66" cy="82" rx="7" ry="3.5" fill="#f7a8b8" ${S}/>`,
  // كُوبٌ بمقبض وبخار
  mug: () => `<path d="M42 24Q38 18 42 12M54 24Q50 18 54 12" fill="none" stroke="#9aa9b8" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M70 44Q90 44 88 60Q86 76 68 76" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M70 44Q90 44 88 60Q86 76 68 76" fill="none" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 32H72V80Q72 90 62 90H28Q18 90 18 80Z" fill="#e5484d" ${S}/>
    <ellipse cx="45" cy="32" rx="27" ry="5" fill="#8a5a3b" ${S}/>
    <circle cx="45" cy="62" r="9" fill="#fff" ${S}/><path d="M45 58Q40 54 38 60Q40 66 45 70Q50 66 52 60Q50 54 45 58Z" fill="#f7a8b8"/>`,
  // مِسْمَارٌ
  nail: () => `<g transform="rotate(30 50 50)"><rect x="36" y="8" width="28" height="9" rx="3" fill="#9aa9b8" ${S}/><path d="M45 17H55V76L50 92L45 76Z" fill="#c9d3dc" ${S}/><path d="M48 22V72" stroke="#fff" stroke-width="2"/></g>
    <g transform="rotate(-20 24 66)"><rect x="16" y="46" width="16" height="6" rx="2" fill="#9aa9b8" ${S}/><path d="M21 52H27V82L24 90L21 82Z" fill="#c9d3dc" ${S}/></g>`,
  // رِبَاطٌ: ربطة عنق
  necktie: () => `<path d="M30 8L50 18L70 8L66 20L50 26L34 20Z" fill="#fff" ${S}/>
    <path d="M42 18H58L56 30H44Z" fill="#c43a3f" ${S}/>
    <path d="M44 30H56L66 78L50 94L34 78Z" fill="#e5484d" ${S}/>
    ${[42, 56, 70].map((y) => `<path d="M${40 + (y - 30) * 0.15} ${y}L${60 - (y - 30) * 0.15} ${y - 6}" stroke="#ffd95a" stroke-width="3" stroke-linecap="round"/>`).join('')}`,
  // اثْنَانِ: تفاحتان
  number_2: () => `${apple(30, 56)}${apple(70, 56)}`,
  // ثَلَاثَةٌ: ثلاث تفاحات
  number_three: () => `<g transform="translate(50 50) scale(.82) translate(-50 -50)">${apple(28, 66)}${apple(72, 66)}${apple(50, 28)}</g>`,
  // أُخْطُبُوطٌ
  octopus: () => `${[16, 28, 40, 52, 64, 76].map((x, i) => `<path d="M${x + 4} 54Q${x - 4} 74 ${x + 2} 86Q${x + 10} 94 ${x + 12} 84" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M${x + 4} 54Q${x - 4} 74 ${x + 2} 86Q${x + 10} 94 ${x + 12} 84" fill="none" stroke="#b07ad6" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <path d="M14 58Q12 12 50 10Q88 12 86 58Q70 66 50 64Q30 66 14 58Z" fill="#b07ad6" ${S}/>
    <circle cx="30" cy="24" r="4" fill="#d3aef0"/><circle cx="70" cy="22" r="3" fill="#d3aef0"/>
    ${eye(38, 40, 6)}${eye(62, 40, 6)}<path d="M42 52Q50 58 58 52" fill="none" ${S}/>${cheeks(28, 72, 50)}`,
  // ضَابِطٌ بزي رسمي وقبعة
  officer: () => `${man('#5c6b3c', `<path d="M32 18Q32 4 50 4Q68 4 68 18Z" fill="#4a5630" ${S}/><path d="M30 20Q50 14 70 20L66 24Q50 20 34 24Z" fill="#2b2b2b" ${S}/><circle cx="50" cy="11" r="3.6" fill="#f6c343" ${S}/>`, `<rect x="28" y="54" width="12" height="5" rx="2" fill="#f6c343" ${S}/><rect x="60" y="54" width="12" height="5" rx="2" fill="#f6c343" ${S}/><path d="M50 52V94" stroke="#3e4a26" stroke-width="2"/>${[64, 74, 84].map((y) => `<circle cx="50" cy="${y}" r="2" fill="#f6c343"/>`).join('')}<rect x="32" y="66" width="10" height="4" rx="1" fill="#e5484d"/><rect x="32" y="70" width="10" height="4" rx="1" fill="#3a7fc0"/>`, false)}`,
  // زَيْتٌ: قنينة زيت وقطرة
  oil: () => `<path d="M34 8H50V20Q62 26 62 40V84Q62 92 54 92H30Q22 92 22 84V40Q22 26 34 20Z" fill="#ffcf33" ${S}/>
    <rect x="32" y="4" width="20" height="8" rx="3" fill="#3fa34d" ${S}/>
    <rect x="26" y="50" width="32" height="24" rx="4" fill="#fff6e0" ${S}/><circle cx="42" cy="62" r="6" fill="#7aa83a" ${S}/>
    <rect x="28" y="28" width="5" height="16" rx="2.5" fill="#fff0a0"/>
    <path d="M80 50Q70 66 72 74Q74 82 80 82Q86 82 88 74Q90 66 80 50Z" fill="#ffcf33" ${S}/><ellipse cx="77" cy="72" rx="2" ry="3.5" fill="#fff6b0"/>`,
  // زَيْتُونٌ: غصن زيتون
  olive_branch: () => `<g transform="translate(50 52) scale(.86) translate(-50 -50)"><path d="M8 88Q40 66 92 14" fill="none" stroke="#8a6a3b" stroke-width="3.6" stroke-linecap="round"/>
    ${[[22, 78, -120], [32, 71, 30], [44, 61, -115], [54, 52, 35], [66, 41, -110], [76, 31, 40], [88, 18, -60]].map(([x, y, a]) => `<path d="M0 0Q10 -9 26 -2Q12 8 0 0Z" transform="translate(${x} ${y}) rotate(${a})" fill="#7aa83a" ${S}/>`).join('')}
    ${[[40, 76], [60, 58], [80, 42]].map(([x, y]) => `<path d="M${x - 4} ${y - 12}L${x} ${y - 6}" ${S}/><ellipse cx="${x}" cy="${y}" rx="5.5" ry="7.5" fill="#5a8a2a" ${S}/><circle cx="${x - 2}" cy="${y - 3}" r="1.6" fill="#b6d98a"/>`).join('')}</g>`,
  // زَيْتُونٍ: صحن زيتون أخضر وأسود
  olives: () => `${[[34, 48, '#6b8f2a'], [48, 44, '#3b2e3a'], [62, 48, '#6b8f2a'], [40, 58, '#3b2e3a'], [56, 58, '#6b8f2a'], [70, 56, '#3b2e3a'], [28, 58, '#6b8f2a']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="9" fill="${c}" ${S}/><circle cx="${x - 2}" cy="${y - 4}" r="1.8" fill="#fff" opacity=".7"/>`).join('')}
    <path d="M10 60H90Q86 86 50 88Q14 86 10 60Z" fill="#7cc4e8" ${S}/><path d="M24 70Q50 76 76 70" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M70 34Q78 22 90 26Q84 38 70 34Z" fill="#7aa83a" ${S}/>`,
  // نَعَامَةٌ
  ostrich: () => `<path d="M52 66L46 94M66 66L72 94" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/><path d="M52 66L46 94M66 66L72 94" fill="none" stroke="#f2a8a0" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M42 94H52M68 94H78" ${S}/>
    <path d="M36 54Q38 34 62 34Q84 34 90 46Q94 54 86 56Q90 66 78 70Q60 76 46 70Q34 66 36 54Z" fill="#3b3333" ${S}/>
    <path d="M80 44Q90 40 94 48Q88 48 86 52" fill="#fff" ${S}/><path d="M50 48Q60 44 70 50" fill="none" stroke="#6b5f5f" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M40 50Q30 40 30 22" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M40 50Q30 40 30 22" fill="none" stroke="#f2b8b0" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="28" cy="16" rx="10" ry="8" fill="#f2b8b0" ${S}/><path d="M18 16L8 19L18 21Z" fill="#f6c343" ${S}/>
    ${eye(28, 14, 3.6)}`,
  // عُودٌ: آلة العود
  oud: () => `<g transform="rotate(-35 50 50)"><path d="M50 30Q22 40 24 70Q28 94 50 94Q72 94 76 70Q78 40 50 30Z" fill="#c8794a" ${S}/>
    <path d="M44 32L46 10H54L56 32Z" fill="#8a5a3b" ${S}/><path d="M46 10L42 0H58L54 10Z" fill="#6b3e22" ${S}/>
    ${[3, 6].map((y) => `<path d="M40 ${y}H44M56 ${y}H60" ${S}/>`).join('')}
    <circle cx="50" cy="58" r="7" fill="#6b3e22" ${S}/><circle cx="50" cy="58" r="3" fill="#f2c14e"/>
    <rect x="42" y="78" width="16" height="4" rx="1" fill="#6b3e22" ${S}/>
    ${[47, 50, 53].map((x) => `<path d="M${x} 10V80" stroke="#fff6e0" stroke-width="1"/>`).join('')}</g>`,
  // فُرْنٌ بنافذة وصينية خبز
  oven: () => `<rect x="14" y="14" width="72" height="78" rx="6" fill="#e9e3d6" ${S}/>
    <rect x="14" y="14" width="72" height="16" rx="6" fill="#c9d3dc" ${S}/>
    ${[26, 40, 54].map((x) => `<circle cx="${x}" cy="22" r="3.6" fill="#4b4f5a" ${S}/>`).join('')}<rect x="64" y="19" width="14" height="6" rx="2" fill="#7cc4e8" ${S}/>
    <rect x="22" y="38" width="56" height="8" rx="4" fill="#9aa9b8" ${S}/>
    <rect x="22" y="50" width="56" height="34" rx="4" fill="#4b4f5a" ${S}/><rect x="27" y="55" width="46" height="24" rx="3" fill="#ff9f4d"/>
    <ellipse cx="50" cy="70" rx="18" ry="6" fill="#e0a04a" ${S}/><path d="M40 68Q45 65 50 68Q55 65 60 68" fill="none" stroke="#b8732e" stroke-width="2"/>
    <path d="M30 74H70" stroke="#4b4f5a" stroke-width="2"/>`,
};
