// math-b — رسوم أصلية لدرس «البعد المكاني» (ص١٤٨–١٤٩): مكتبة، مستوصف، بقرة، ولد يركض، وخريطة مبسطة للعراق
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/><circle cx="${x + 0.9}" cy="${y - 0.9}" r="${r * 0.35}" fill="#fff"/>`;
const win = (x, y, w = 12, hh = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="2" fill="#a5d8ff" ${S}/><path d="M${x + w / 2} ${y}V${y + hh}" ${S} stroke-width="1.6"/>`;

// خريطة العراق المبسطة: الحدود من نقاط طول وعرض تقريبية (س = (الطول − ٣٨٫٥) × ١٠، ص = (٣٧٫٦ − العرض) × ١١ + ٢)
const LL = [[42.4, 37.1], [43.6, 37.25], [44.3, 37.3], [44.8, 37.1], [45.0, 36.7], [45.4, 35.9], [46.1, 35.1], [45.6, 34.5], [45.8, 33.6], [46.6, 33.1], [47.6, 32.4], [47.8, 31.7], [48.0, 30.9], [48.6, 30.0], [48.4, 29.9], [47.7, 30.1], [47.1, 29.6], [46.5, 29.1], [44.7, 29.2], [42.1, 31.1], [40.4, 31.9], [39.2, 32.2], [38.8, 33.4], [41.2, 34.4], [41.3, 35.6], [41.4, 36.5]];
const iraq = 'M' + LL.map(([lo, la]) => `${((lo - 38.5) * 10).toFixed(1)} ${((37.6 - la) * 11 + 2).toFixed(1)}`).join('L') + 'Z';
// دجلة والفرات خطّان أزرقان رفيعان (تقريبيان)
const tigris = 'M43.6 37.25L43.1 36.3L43.5 35.3L43.9 34.2L44.4 33.3L45.3 32.6L46.2 31.9L47.3 31.0L47.8 30.5';
const euphrates = 'M41.0 34.4L42.2 34.1L43.3 33.4L44.0 32.6L44.6 31.9L45.6 31.3L46.6 31.0L47.3 31.0';
const river = (d) => d.replace(/([\d.]+) ([\d.]+)/g, (_, lo, la) => `${((+lo - 38.5) * 10).toFixed(1)} ${((37.6 - +la) * 11 + 2).toFixed(1)}`);

export const ART_MATH_B = {
  m_library: () => `<rect x="12" y="38" width="76" height="54" rx="3" fill="#ffe3e3" ${S}/><path d="M8 40L50 14L92 40Z" fill="#fa5252" ${S}/>
    <rect x="30" y="26" width="40" height="12" rx="3" fill="#fff" ${S}/><path d="M36 32H64" stroke="#fa5252" stroke-width="2.4" stroke-linecap="round"/>
    ${win(20, 48)}${win(68, 48)}<rect x="40" y="58" width="20" height="34" rx="2" fill="#a5d8ff" ${S}/>
    <rect x="18" y="68" width="16" height="16" rx="2" fill="#fff" ${S}/><path d="M21 72V82M25 72V82M29 72V82" stroke="#1c7ed6" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="66" y="68" width="16" height="16" rx="2" fill="#fff" ${S}/><path d="M69 72V82M73 72V82M77 72V82" stroke="#e8590c" stroke-width="2.6" stroke-linecap="round"/>`,
  m_clinic: () => `<rect x="10" y="40" width="80" height="52" rx="3" fill="#fcc2d7" ${S}/><rect x="6" y="34" width="88" height="10" rx="4" fill="#e64980" ${S}/>
    <rect x="36" y="14" width="28" height="22" rx="4" fill="#fff" ${S}/><path d="M50 18V32M43 25H57" stroke="#e03131" stroke-width="5" stroke-linecap="round"/>
    ${win(18, 52)}${win(70, 52)}<path d="M38 92V66Q50 54 62 66V92Z" fill="#ffd8a8" ${S}/><path d="M50 60V92" ${S}/>`,
  m_cow: () => `<path d="M24 52Q22 38 38 38H70Q82 38 82 52V62Q82 70 74 70H32Q24 70 24 62Z" fill="#fff" ${S}/>
    <path d="M40 40Q46 50 56 44Q60 52 52 58Q44 60 40 52Z" fill="#5c3d2e"/><path d="M64 56Q70 52 74 58Q72 66 64 64Z" fill="#5c3d2e"/>
    <path d="M30 68V88M40 68V88M64 68V88M74 68V88" ${S} stroke-width="5"/><path d="M27 88H33M37 88H43M61 88H67M71 88H77" ${S} stroke-width="3"/>
    <path d="M82 46Q92 50 90 62" fill="none" ${S}/><path d="M88 60L92 66" ${S}/>
    <path d="M10 34L6 26M24 34L28 26" ${S} stroke-width="3"/>
    <path d="M6 40Q6 30 17 30Q28 30 28 40V50Q28 60 17 60Q6 60 6 50Z" fill="#fff" ${S}/>
    <ellipse cx="17" cy="54" rx="9" ry="6" fill="#ffc9c9" ${S}/><circle cx="13" cy="54" r="1.4" fill="${K}"/><circle cx="21" cy="54" r="1.4" fill="${K}"/>
    ${eye(12, 41)}${eye(22, 41)}<path d="M44 70Q50 76 56 70" fill="#ffc9c9" ${S}/>`,
  m_boy: () => `<path d="M40 64L32 78L22 80" fill="none" stroke="#1c5d99" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M52 64L60 78L56 92" fill="none" stroke="#1c5d99" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 80L26 80M52 92H62" ${S} stroke-width="5"/>
    <path d="M34 38Q46 32 58 38L56 66H38Z" fill="#ffd43b" ${S}/>
    <path d="M36 42L24 54L30 58M56 42L68 34L74 38" fill="none" stroke="#ffd43b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36 42L24 54L30 58M56 42L68 34L74 38" fill="none" ${S} stroke-width="1.2"/>
    <circle cx="30" cy="58" r="3.4" fill="#f1c27d" ${S}/><circle cx="75" cy="38" r="3.4" fill="#f1c27d" ${S}/>
    <circle cx="47" cy="22" r="13" fill="#f1c27d" ${S}/><path d="M34 20Q36 6 48 8Q60 8 60 20Q54 14 46 16Q40 14 34 20Z" fill="#8a4b20" ${S}/>
    ${eye(43, 23, 2.2)}${eye(52, 23, 2.2)}<path d="M44 29Q48 32 52 29" fill="none" ${S}/>`,
  m_iraq: () => `<path d="${iraq}" fill="#d3f9d8" stroke="${K}" stroke-width="1.1" stroke-linejoin="round"/><path d="${river(tigris)}" fill="none" stroke="#4dabf7" stroke-width="1.6" stroke-linecap="round"/><path d="${river(euphrates)}" fill="none" stroke="#4dabf7" stroke-width="1.6" stroke-linecap="round"/>`,
};
