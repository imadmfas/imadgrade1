// ethics-kit — أدوات رسم مشتركة لكتاب «التربية الأخلاقية»: شخص كامل، ووجه انفعال، وقطع أثاث بسيطة.
// تُصدَّر دوالّ فقط (لا قيم) حتى لا يدمجها build.mjs في مكتبة الرسوم.
// كل الرسوم داخل مربع 100×100 بأسلوب المكتبة (حدود بنية 2.6، ألوان مسطحة دافئة).
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const S2 = `stroke="${K}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;
const SKIN = ['#f6c9a6', '#e8b48c', '#d9a07a'];
const HAIR = { brown: '#7a4a2a', dark: '#3b2a20', light: '#c98a3e', grey: '#cfcfcf' };

const eye = (x, y, r = 2.8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S2}/><circle cx="${x + 0.4}" cy="${y + 0.4}" r="${r * 0.55}" fill="${K}"/>`;
// ملامح الوجه داخل رأس مركزه (cx,cy) ونصف قطره r
export function features(cx, cy, r, emo = 'smile') {
  const u = r / 15, ex = 6 * u, ey = cy - 1 * u, my = cy + 7 * u;
  let eyes = eye(cx - ex, ey, 2.8 * u) + eye(cx + ex, ey, 2.8 * u), mouth = '', extra = '';
  const blush = `<circle cx="${cx - 9 * u}" cy="${cy + 4 * u}" r="${2.4 * u}" fill="#f7a8b8" opacity=".7"/><circle cx="${cx + 9 * u}" cy="${cy + 4 * u}" r="${2.4 * u}" fill="#f7a8b8" opacity=".7"/>`;
  if (emo === 'smile') mouth = `<path d="M${cx - 4.5 * u} ${my - 1 * u}Q${cx} ${my + 3.5 * u} ${cx + 4.5 * u} ${my - 1 * u}" fill="none" ${S2}/>` + blush;
  if (emo === 'laugh') mouth = `<path d="M${cx - 5 * u} ${my - 2 * u}Q${cx} ${my + 6 * u} ${cx + 5 * u} ${my - 2 * u}Z" fill="#b5442e" ${S2}/>` + blush;
  if (emo === 'sad') mouth = `<path d="M${cx - 4 * u} ${my + 1.5 * u}Q${cx} ${my - 2.5 * u} ${cx + 4 * u} ${my + 1.5 * u}" fill="none" ${S2}/>`, extra = `<path d="M${cx - ex - 3 * u} ${ey - 4 * u}L${cx - ex + 2 * u} ${ey - 6 * u}M${cx + ex + 3 * u} ${ey - 4 * u}L${cx + ex - 2 * u} ${ey - 6 * u}" fill="none" ${S2}/>`;
  if (emo === 'cry') mouth = `<path d="M${cx - 4 * u} ${my + 1.5 * u}Q${cx} ${my - 3 * u} ${cx + 4 * u} ${my + 1.5 * u}Z" fill="#b5442e" ${S2}/>`, extra = `<path d="M${cx - ex} ${ey + 3 * u}q-2 ${5 * u} 0 ${7 * u}q2 -${2 * u} 0 -${7 * u}zM${cx + ex} ${ey + 3 * u}q-2 ${5 * u} 0 ${7 * u}q2 -${2 * u} 0 -${7 * u}z" fill="#4dabf7"/>`;
  if (emo === 'angry') mouth = `<rect x="${cx - 4.5 * u}" y="${my - 1.5 * u}" width="${9 * u}" height="${3.4 * u}" rx="${1 * u}" fill="#fff" ${S2}/>`, extra = `<path d="M${cx - ex - 3.5 * u} ${ey - 6 * u}L${cx - ex + 3 * u} ${ey - 3 * u}M${cx + ex + 3.5 * u} ${ey - 6 * u}L${cx + ex - 3 * u} ${ey - 3 * u}" fill="none" stroke="${K}" stroke-width="${2.6 * u}" stroke-linecap="round"/>`;
  if (emo === 'shy') eyes = `<path d="M${cx - ex - 2.5 * u} ${ey}q${2.5 * u} ${2.5 * u} ${5 * u} 0M${cx + ex - 2.5 * u} ${ey}q${2.5 * u} ${2.5 * u} ${5 * u} 0" fill="none" ${S2}/>`, mouth = `<path d="M${cx - 2.5 * u} ${my}q${2.5 * u} ${2 * u} ${5 * u} 0" fill="none" ${S2}/><circle cx="${cx - 9 * u}" cy="${cy + 4 * u}" r="${3.4 * u}" fill="#f28da3"/><circle cx="${cx + 9 * u}" cy="${cy + 4 * u}" r="${3.4 * u}" fill="#f28da3"/>`;
  if (emo === 'scared') mouth = `<ellipse cx="${cx}" cy="${my}" rx="${2.6 * u}" ry="${3.4 * u}" fill="#b5442e" ${S2}/>`, extra = `<path d="M${cx - ex - 3 * u} ${ey - 6 * u}q${3 * u} -${3 * u} ${6 * u} 0M${cx + ex - 3 * u} ${ey - 6 * u}q${3 * u} -${3 * u} ${6 * u} 0" fill="none" ${S2}/>`;
  if (emo === 'calm') mouth = `<path d="M${cx - 3 * u} ${my}H${cx + 3 * u}" ${S2}/>`;
  return eyes + mouth + extra;
}

// ذراع: خط سميك بلون الكمّ ينتهي بيد
export const arm = (x1, y1, x2, y2, c, skin) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="4.6" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="3.6" fill="${skin}" ${S2}/>`;
const POSE = {
  down: [[30, 68], [70, 68]], up: [[30, 68], [70, 12]], wave: [[30, 68], [78, 30]], forward: [[44, 60], [56, 60]],
  point: [[30, 68], [84, 44]], knock: [[30, 68], [86, 40]], give: [[30, 68], [84, 54]], both: [[18, 40], [82, 40]], hips: [[28, 58], [72, 58]],
  hold: [[38, 64], [62, 64]], hug: [[64, 56], [36, 56]], face: [[44, 34], [56, 34]], left: [[16, 54], [70, 68]],
};
/** شخص كامل في مربعه المحلي 100×100. kind: boy|girl|man|woman|oldman|oldwoman */
export function person(o = {}) {
  const kind = o.kind || 'boy', skin = o.skin || SKIN[0], female = /girl|woman/.test(kind), old = /^old/.test(kind), adult = /man|woman/.test(kind);
  const shirt = o.shirt || (female ? '#ff8fab' : '#4dabf7'), pants = o.pants || '#3a5a7a', hij = o.hijab || '#9b8cff';
  const [a, b] = (typeof o.pose === 'object' ? o.pose : POSE[o.pose || 'down']);
  let s = '';
  // الساقان والحذاء
  if (!female && !o.dishdasha) s += `<rect x="38" y="72" width="10" height="20" rx="3" fill="${pants}" ${S}/><rect x="52" y="72" width="10" height="20" rx="3" fill="${pants}" ${S}/>`;
  s += `<ellipse cx="42" cy="94" rx="7" ry="3.6" fill="${K}"/><ellipse cx="58" cy="94" rx="7" ry="3.6" fill="${K}"/>`;
  // الجسم: ثوب طويل للنساء والبنات، قميص للأولاد والرجال
  if (female || o.dishdasha) s += `<path d="M36 40Q50 36 64 40L72 92H28Z" fill="${shirt}" ${S}/>`;
  else s += `<path d="M36 40Q50 36 64 40L67 74H33Z" fill="${shirt}" ${S}/>`;
  if (o.vest) s += `<path d="M38 41L44 70H33ZM62 41L56 70H67Z" fill="${o.vest}" ${S2}/>`;
  if (o.apron) s += `<path d="M41 50H59L61 80H39Z" fill="${o.apron}" ${S2}/>`;
  if (o.coat) s += `<path d="M36 40Q50 36 64 40L68 80H32Z" fill="${o.coat}" ${S}/><path d="M50 40V80" ${S2}/>`;
  // الذراعان
  s += arm(37, 45, a[0], a[1], o.sleeve || o.coat || shirt, skin) + arm(63, 45, b[0], b[1], o.sleeve || o.coat || shirt, skin);
  // الرأس
  if (female) {
    s += `<path d="M31 30Q31 7 50 7Q69 7 69 30L70 46Q50 54 30 46Z" fill="${hij}" ${S}/>`;
    s += `<ellipse cx="50" cy="26" rx="12" ry="13" fill="${skin}" ${S}/>`;
    s += features(50, 27, 12, o.emo);
    if (old) s += `<path d="M42 21H48M52 21H58" stroke="#cfcfcf" stroke-width="1.6"/>`;
  } else {
    s += `<circle cx="50" cy="24" r="15" fill="${skin}" ${S}/>`;
    if (o.ghutra) s += `<path d="M33 26Q32 6 50 6Q68 6 67 26L70 40Q66 30 63 20Q50 14 37 20Q34 30 30 40Z" fill="#fff" ${S}/><path d="M36 15Q50 9 64 15" fill="none" stroke="${K}" stroke-width="3"/>`;
    else if (o.cap) s += `<path d="M35 20Q36 6 50 6Q64 6 65 20Z" fill="${o.cap}" ${S}/><path d="M62 18H74" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>`;
    else if (o.helmet) s += `<path d="M33 22Q34 4 50 4Q66 4 67 22Z" fill="${o.helmet}" ${S}/><path d="M31 22H69" ${S}/>`;
    else s += `<path d="M35 22Q35 7 50 8Q65 7 65 22Q60 14 50 15Q40 14 35 22Z" fill="${old ? HAIR.grey : (o.hair || HAIR.brown)}" ${S}/>`;
    s += features(50, 25, 15, o.emo);
    if (o.mustache || adult && !old && o.mustache !== false) s += `<path d="M45 29.5Q50 27.5 55 29.5" fill="none" stroke="${old ? '#bbb' : K}" stroke-width="2.4" stroke-linecap="round"/>`;
    if (old) s += `<path d="M38 30Q40 44 50 44Q60 44 62 30Q56 36 50 36Q44 36 38 30Z" fill="#eee" ${S2}/>`;
  }
  if (o.glasses) { const gy = female ? 26 : 24; s += `<circle cx="44" cy="${gy}" r="4.4" fill="none" ${S2}/><circle cx="56" cy="${gy}" r="4.4" fill="none" ${S2}/><path d="M48.4 ${gy}H51.6" ${S2}/>`; }
  if (o.bag) s += `<rect x="62" y="44" width="12" height="18" rx="3" fill="${o.bag}" ${S2}/>`;
  if (o.cane) s += `<path d="M76 60V94M76 60q0 -6 -5 -5" fill="none" stroke="#8a5a3b" stroke-width="3" stroke-linecap="round"/>`;
  if (o.held) s += o.held;
  return s;
}
// يضع شخصاً (أو أي رسم في مربع 100) في موضع ومقياس داخل المشهد
export const at = (x, y, sc, inner, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})${flip ? ' translate(-100 0)' : ''}">${inner}</g>`;
export const P = (x, y, sc, o, flip) => at(x, y, sc, person(o), flip);

// وجه انفعالي مستدير (بطاقات المشاعر)
export function emoji(emo, bg = '#ffd43b') {
  let s = `<circle cx="50" cy="50" r="40" fill="${bg}" ${S}/>`;
  s += features(50, 50, 34, emo).replace(/stroke-width="1.8"/g, 'stroke-width="2.8"');
  if (emo === 'love') s = `<circle cx="50" cy="50" r="40" fill="${bg}" ${S}/>` + features(50, 50, 34, 'smile').replace(/stroke-width="1.8"/g, 'stroke-width="2.8"') + [[14, 20], [84, 22], [12, 78], [86, 80]].map(([x, y]) => heart(x, y, 9)).join('');
  return s;
}
export const heart = (x, y, r = 8) => `<path d="M${x} ${y + r * 0.9}C${x - r * 1.6} ${y - r * 0.2} ${x - r * 0.8} ${y - r * 1.4} ${x} ${y - r * 0.4}C${x + r * 0.8} ${y - r * 1.4} ${x + r * 1.6} ${y - r * 0.2} ${x} ${y + r * 0.9}Z" fill="#e5484d" ${S2}/>`;

// قطع مشتركة
export const book = (x, y, w = 14, c = '#3aa0e0') => `<rect x="${x}" y="${y}" width="${w}" height="${w * 1.3}" rx="1.5" fill="${c}" ${S2}/><rect x="${x + w * 0.2}" y="${y + w * 0.25}" width="${w * 0.6}" height="${w * 0.3}" fill="#fff" opacity=".8"/>`;
export const door = (x, y, w = 30, h = 60, open = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#c8794a" ${S}/>${open ? `<path d="M${x} ${y}L${x + w * 0.55} ${y + 6}V${y + h - 4}L${x} ${y + h}Z" fill="#e0a36f" ${S}/>` : `<rect x="${x + 5}" y="${y + 6}" width="${w - 10}" height="${h * 0.38}" rx="2" fill="#e0a36f" ${S2}/><circle cx="${x + w - 6}" cy="${y + h * 0.55}" r="2" fill="${K}"/>`}`;
export const board = (x, y, w = 50, h = 28) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#2f6b4f" stroke="#8a5a3b" stroke-width="3.4"/>`;
export const desk = (x, y, w = 30) => `<rect x="${x}" y="${y}" width="${w}" height="6" rx="2" fill="#c8794a" ${S2}/><path d="M${x + 3} ${y + 6}V${y + 18}M${x + w - 3} ${y + 6}V${y + 18}" ${S2}/>`;
export const table = (x, y, w = 60) => `<rect x="${x}" y="${y}" width="${w}" height="7" rx="2" fill="#f2c14e" ${S}/><path d="M${x + 5} ${y + 7}V${y + 24}M${x + w - 5} ${y + 7}V${y + 24}" ${S}/>`;
export const floor = (c = '#f4e3c3') => `<rect x="2" y="78" width="96" height="20" rx="3" fill="${c}"/>`;
export const wall = (c = '#e7f5ff') => `<rect x="2" y="2" width="96" height="96" rx="8" fill="${c}"/>`;
export const ART_ETHICS_KIT = {};
