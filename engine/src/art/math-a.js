// math-a — رسوم أصلية لكتاب الرياضيات (مربع 100×100، حدود بنية دافئة)
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;

// وجه الساعة: عقرب الساعات قصير وعقرب الدقائق طويل، والأرقام علامات صغيرة دون كتابة
const clock = (h, half) => {
  const ha = ((h % 12) + (half ? 0.5 : 0)) * 30, ma = half ? 180 : 0;
  const hand = (a, len, w, col) => { const r = (a - 90) * Math.PI / 180; return `<path d="M50 52L${(50 + Math.cos(r) * len).toFixed(1)} ${(52 + Math.sin(r) * len).toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`; };
  const ticks = Array.from({ length: 12 }, (_, i) => { const r = (i * 30 - 90) * Math.PI / 180, big = i % 3 === 0; return `<path d="M${(50 + Math.cos(r) * 34).toFixed(1)} ${(52 + Math.sin(r) * 34).toFixed(1)}L${(50 + Math.cos(r) * (big ? 27 : 30)).toFixed(1)} ${(52 + Math.sin(r) * (big ? 27 : 30)).toFixed(1)}" stroke="${big ? '#e64980' : K}" stroke-width="${big ? 4 : 2.6}" stroke-linecap="round"/>`; }).join('');
  return `<circle cx="50" cy="52" r="42" fill="#ffd43b" ${S}/><circle cx="50" cy="52" r="37" fill="#fff" ${S}/>${ticks}${hand(ma, 30, 3.4, '#1c7ed6')}${hand(ha, 19, 5.5, K)}<circle cx="50" cy="52" r="4" fill="#e64980" ${S}/>`;
};
const clocks = {};
for (let h = 1; h <= 12; h++) { clocks['m_clk_' + h] = () => clock(h, false); clocks['m_clkh_' + h] = () => clock(h, true); }

// أشكال مقسّمة: الجزء الملوّن نصف أو ربع أو غير ذلك
const P = '#f783ac', Y = '#ffe066';
const frac = {
  m_half_circle: () => `<circle cx="50" cy="50" r="38" fill="#fff" ${S}/><path d="M50 12A38 38 0 0 1 50 88Z" fill="${P}" ${S}/><path d="M50 12V88" ${S}/>`,
  m_half_rect: () => `<rect x="14" y="24" width="72" height="52" rx="3" fill="#fff" ${S}/><rect x="14" y="24" width="36" height="52" fill="${Y}" ${S}/>`,
  m_half_square: () => `<rect x="16" y="16" width="68" height="68" fill="#fff" ${S}/><path d="M16 84L84 16V84Z" fill="#b197fc" ${S}/>`,
  m_half_tri: () => `<path d="M50 14L88 84H12Z" fill="#fff" ${S}/><path d="M50 14L50 84H12Z" fill="#69db7c" ${S}/>`,
  m_part_circle: () => `<circle cx="50" cy="50" r="38" fill="#fff" ${S}/><path d="M18 30A38 38 0 0 1 82 30Z" fill="${Y}" ${S}/>`,
  m_part_rect: () => `<rect x="14" y="24" width="72" height="52" rx="3" fill="#fff" ${S}/><rect x="14" y="24" width="20" height="52" fill="${P}" ${S}/>`,
  m_part_tri: () => `<path d="M50 14L88 84H12Z" fill="#fff" ${S}/><path d="M50 14L63 38H37Z" fill="#4dabf7" ${S}/>`,
  m_quarter_square: () => `<rect x="16" y="16" width="68" height="68" fill="#fff" ${S}/><rect x="16" y="50" width="34" height="34" fill="${P}" ${S}/><path d="M50 16V84M16 50H84" ${S}/>`,
  m_quarter_circle: () => `<circle cx="50" cy="50" r="38" fill="#fff" ${S}/><path d="M50 50V12A38 38 0 0 1 88 50Z" fill="#4dabf7" ${S}/><path d="M50 12V88M12 50H88" ${S}/>`,
  m_quarter_rect: () => `<rect x="10" y="26" width="80" height="48" fill="#fff" ${S}/><rect x="10" y="26" width="20" height="48" fill="${Y}" ${S}/><path d="M30 26V74M50 26V74M70 26V74" ${S}/>`,
};

// المجسمات
const solids = {
  m_s_cube: () => `<path d="M24 38L44 24H82L62 38Z" fill="#ffc9a8" ${S}/><path d="M62 38L82 24V62L62 78Z" fill="#e8946a" ${S}/><rect x="24" y="38" width="38" height="40" fill="#ffa8a8" ${S}/>`,
  m_s_cuboid: () => `<path d="M8 44L22 32H92L78 44Z" fill="#74c0fc" ${S}/><path d="M78 44L92 32V58L78 70Z" fill="#1971c2" ${S}/><rect x="8" y="44" width="70" height="26" fill="#339af0" ${S}/>`,
  m_s_sphere: () => `<circle cx="50" cy="52" r="34" fill="#cc5de8" ${S}/><ellipse cx="38" cy="38" rx="10" ry="7" fill="#e5b3f5"/>`,
  m_s_cylinder: () => `<path d="M28 22V78A22 8 0 0 0 72 78V22" fill="#8ce99a" ${S}/><ellipse cx="50" cy="22" rx="22" ry="8" fill="#b2f2bb" ${S}/>`,
  m_s_cone: () => `<path d="M26 22L50 88L74 22" fill="#ffa94d" ${S}/><ellipse cx="50" cy="22" rx="24" ry="8" fill="#ffc078" ${S}/>`,
  m_circle: () => `<circle cx="50" cy="50" r="36" fill="#ffd43b" ${S}/>`,
};

// مكعّب الوحدة وقضيب العشرة
const cube = (x, y, s, c) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="2" fill="${c}" ${S}/><circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 5}" fill="none" stroke="${K}" stroke-width="2"/>`;
const blocks = {
  m_cube: () => cube(28, 28, 44, '#ff922b'),
  m_cube_red: () => cube(28, 28, 44, '#fa5252'),
  m_cube_blue: () => cube(28, 28, 44, '#4dabf7'),
  m_rod: () => Array.from({ length: 10 }, (_, i) => cube(40, 3 + i * 9.4, 20, '#ff922b').replace(/height="20"/, 'height="9.4"').replace(/r="4"/, 'r="2"')).join(''),
};
// أبراج مكعبات للأطوال
for (const n of [5, 8]) blocks['m_tower_' + n] = () => Array.from({ length: n }, (_, i) => `<rect x="38" y="${92 - (i + 1) * (84 / 8)}" width="24" height="${84 / 8}" fill="${n === 8 ? '#fa5252' : '#fcc419'}" ${S}/>`).join('');

// كائنات صغيرة تُعدّ
const things = {
  m_bee: () => `<ellipse cx="34" cy="34" rx="15" ry="11" fill="#d0ebff" ${S} transform="rotate(-25 34 34)"/><ellipse cx="60" cy="30" rx="15" ry="11" fill="#d0ebff" ${S} transform="rotate(25 60 30)"/>
    <ellipse cx="50" cy="60" rx="30" ry="22" fill="#ffd43b" ${S}/><path d="M42 40Q38 60 42 80M56 39Q60 60 56 81" fill="none" stroke="${K}" stroke-width="7"/>
    <path d="M80 60L90 60" ${S}/>${eye(28, 54, 4.6)}<path d="M24 66Q28 70 32 66" fill="none" ${S}/>`,
  m_strawberry: () => `<path d="M50 90C24 76 14 50 22 36C30 26 70 26 78 36C86 50 76 76 50 90Z" fill="#fa5252" ${S}/>
    ${[[34, 46], [50, 44], [66, 46], [40, 60], [58, 60], [50, 74]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="#fff3bf"/>`).join('')}
    <path d="M30 32Q40 18 50 30Q60 18 70 32Q60 38 50 34Q40 38 30 32Z" fill="#51cf66" ${S}/><path d="M50 30V16" ${S}/>`,
  m_pear: () => `<path d="M50 22C40 22 40 40 36 50C24 62 28 90 50 90C72 90 76 62 64 50C60 40 60 22 50 22Z" fill="#c0eb75" ${S}/>
    <path d="M50 22Q52 12 58 8" fill="none" ${S}/><path d="M54 16Q66 10 72 16Q64 22 54 16Z" fill="#51cf66" ${S}/><ellipse cx="40" cy="64" rx="5" ry="8" fill="#e9fac8"/>`,
  m_ladybug: () => `<circle cx="50" cy="26" r="11" fill="#343a40" ${S}/><ellipse cx="50" cy="58" rx="32" ry="30" fill="#fa5252" ${S}/><path d="M50 28V88" ${S}/>
    ${[[36, 48], [64, 48], [32, 70], [68, 70], [50, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#343a40"/>`).join('')}${eye(45, 24, 3)}${eye(55, 24, 3)}`,
  m_tree: () => `<rect x="44" y="58" width="12" height="32" rx="3" fill="#a9713f" ${S}/><circle cx="50" cy="40" r="28" fill="#51cf66" ${S}/><circle cx="38" cy="34" r="6" fill="#8ce99a"/><path d="M30 90H70" ${S}/>`,
  m_cherries: () => `<path d="M34 68Q40 36 56 16M66 66Q62 40 56 16" fill="none" ${S}/><path d="M56 16Q72 8 82 20Q70 26 56 16Z" fill="#51cf66" ${S}/>
    <circle cx="32" cy="72" r="15" fill="#e03131" ${S}/><circle cx="68" cy="70" r="15" fill="#e03131" ${S}/><circle cx="27" cy="67" r="4" fill="#ffa8a8"/><circle cx="63" cy="65" r="4" fill="#ffa8a8"/>`,
};


// وردة وكرة بألوان مختلفة (للأنماط والتصنيف بحسب اللون)
const bloomC = (c, mid) => `<path d="M50 92V52" fill="none" stroke="#2f9e44" stroke-width="5" stroke-linecap="round"/><path d="M50 76Q64 62 76 70Q64 82 50 76Z" fill="#69db7c" ${S}/>
    ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="50" cy="20" rx="11" ry="15" fill="${c}" ${S} transform="rotate(${a} 50 36)"/>`).join('')}<circle cx="50" cy="36" r="10" fill="${mid}" ${S}/>`;
const ballC = (c, hi) => `<circle cx="50" cy="52" r="34" fill="${c}" ${S}/><ellipse cx="39" cy="40" rx="10" ry="7" fill="${hi}"/>`;
const colored = {
  m_flower_pink: () => bloomC('#f783ac', '#ffd43b'),
  m_flower_green: () => bloomC('#a9e34b', '#fd7e14'),
  m_flower_red: () => bloomC('#f03e3e', '#ffd43b'),
  m_flower_purple: () => bloomC('#cc5de8', '#495057'),
  m_flower_yellow: () => bloomC('#fcc419', '#7f4f24'),
  m_ball_red: () => ballC('#f03e3e', '#ffa8a8'),
  m_ball_blue: () => ballC('#339af0', '#a5d8ff'),
  m_ball_green: () => ballC('#40c057', '#b2f2bb'),
};

export const ART_MATH_A = { ...clocks, ...frac, ...solids, ...blocks, ...things, ...colored };
