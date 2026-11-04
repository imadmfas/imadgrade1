// batch3 — original SVG art, 100×100 viewBox
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;

// ---- helpers ----
const f = (n) => +n.toFixed(1);
const SK = '#f6c9a6';
const de = (x, y, r = 1.9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/><circle cx="${x + 0.6}" cy="${y - 0.6}" r="${r * 0.35}" fill="#fff"/>`;
const blush = (x, y, r = 2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f7a8b8" opacity=".7"/>`;
const limb = (d, c, w = 5) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const smile = (x, y, w = 3.5) => `<path d="M${x - w} ${y}Q${x} ${y + w * 0.85} ${x + w} ${y}" fill="none" ${S}/>`;

// girl / woman with hijab and long dress; local height ≈ -2..84
const girl = (x, y, s, dress = '#e5484d', scarf = '#9b8cff') => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-11" y="79" width="9" height="5" rx="2.5" fill="${K}"/><rect x="2" y="79" width="9" height="5" rx="2.5" fill="${K}"/>
  <path d="M-17 82L-12 36Q-10 30 0 30Q10 30 12 36L17 82Z" fill="${dress}" ${S}/>
  ${limb('M-11 40L-18 60', dress)}${limb('M11 40L18 60', dress)}
  <circle cx="-18" cy="62" r="3.6" fill="${SK}" ${S}/><circle cx="18" cy="62" r="3.6" fill="${SK}" ${S}/>
  <path d="M-16 16Q-16 -2 0 -2Q16 -2 16 16Q16 34 0 39Q-16 34 -16 16Z" fill="${scarf}" ${S}/>
  <circle cx="0" cy="15" r="10.5" fill="${SK}" ${S}/>
  ${de(-4, 14)}${de(4, 14)}${smile(0, 19.5, 3.2)}${blush(-7, 18, 2)}${blush(7, 18, 2)}</g>`;

// man in dishdasha; local height ≈ 2..84
const man = (x, y, s, o = {}) => {
  const robe = o.robe || '#fff', hair = o.hair || '#3b2a20';
  return `<g transform="translate(${x} ${y}) scale(${s})">
  ${o.cane ? `<path d="M21 60V84M21 60Q21 52 15 54" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M21 60V84M21 60Q21 52 15 54" fill="none" stroke="#a8743f" stroke-width="3.4" stroke-linecap="round"/>` : ''}
  <rect x="-11" y="79" width="9" height="5" rx="2.5" fill="${K}"/><rect x="2" y="79" width="9" height="5" rx="2.5" fill="${K}"/>
  <path d="M-16 82L-14 36Q-12 30 0 30Q12 30 14 36L16 82Z" fill="${robe}" ${S}/><path d="M0 32V50" fill="none" ${S}/>
  ${limb('M-11 38L-18 58', robe)}${limb('M11 38L19 58', robe)}
  <circle cx="-18" cy="60" r="3.6" fill="${SK}" ${S}/><circle cx="19.5" cy="60" r="3.6" fill="${SK}" ${S}/>
  <rect x="-4" y="25" width="8" height="7" fill="${SK}" ${S}/>
  <circle cx="0" cy="15" r="12" fill="${SK}" ${S}/>
  <path d="M-12 14Q-13 1 0 1Q13 1 12 14Q9 7 0 7Q-9 7 -12 14Z" fill="${hair}" ${S}/>
  ${o.beard ? `<path d="M-11.5 17Q-10 33 0 33Q10 33 11.5 17Q7 23 0 23Q-7 23 -11.5 17Z" fill="#f2f2ee" ${S}/><path d="M-5 21Q0 19 5 21" fill="none" stroke="#f2f2ee" stroke-width="3" stroke-linecap="round"/>` : smile(0, 20, 3.4)}
  ${de(-4.5, 14)}${de(4.5, 14)}${blush(-8, 18, 2)}${blush(8, 18, 2)}
  ${o.glasses ? `<circle cx="-4.5" cy="14" r="4" fill="none" stroke="${K}" stroke-width="1.6"/><circle cx="4.5" cy="14" r="4" fill="none" stroke="${K}" stroke-width="1.6"/><path d="M-.5 14H.5" stroke="${K}" stroke-width="1.6"/>` : ''}</g>`;
};

const gazelle = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M24 -6Q32 -10 30 -1" fill="none" ${S}/>
  ${[-16, -9, 11, 18].map((lx) => `<rect x="${lx}" y="2" width="4.6" height="36" rx="2.3" fill="#d9a066" ${S}/>`).join('')}
  <ellipse cx="2" cy="-2" rx="24" ry="12" fill="#d9a066" ${S}/>
  <path d="M-18 4Q2 12 22 4Q2 7 -18 4Z" fill="#fff"/>
  <path d="M-12 -8L-24 -32L-15 -36L-4 -11Z" fill="#d9a066" ${S}/>
  <path d="M-22 -39Q-22 -54 -12 -62M-17 -38Q-15 -51 -5 -57" fill="none" ${S}/>
  <ellipse cx="-25" cy="-33" rx="10" ry="6.5" transform="rotate(25 -25 -33)" fill="#d9a066" ${S}/>
  <path d="M-17 -38L-6 -43L-13 -33Z" fill="#d9a066" ${S}/>
  ${eye(-24, -35, 3)}<circle cx="-32" cy="-28" r="1.4" fill="${K}"/></g>`;

const flame = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 -74Q10 -54 22 -46Q33 -30 24 -14Q16 0 0 0Q-16 0 -24 -14Q-32 -30 -20 -44Q-15 -32 -9 -34Q-14 -54 0 -74Z" fill="#ff7a1a" ${S}/>
  <path d="M0 -46Q8 -32 12 -23Q14 -7 0 -6Q-14 -7 -12 -20Q-10 -28 -4 -26Q-6 -36 0 -46Z" fill="#ffd23f" ${S}/></g>`;

const bloom = (x, y, r, c, m = '#ffd23f') => [0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3; return `<circle cx="${f(x + Math.cos(a) * r * 0.75)}" cy="${f(y + Math.sin(a) * r * 0.75)}" r="${f(r * 0.5)}" fill="${c}" ${S}/>`; }).join('') + `<circle cx="${x}" cy="${y}" r="${f(r * 0.42)}" fill="${m}" ${S}/>`;
const stem = (x1, y1, x2, y2, b = 4) => { const d = `M${x1} ${y1}Q${(x1 + x2) / 2 + b} ${(y1 + y2) / 2} ${x2} ${y2}`; return `<path d="${d}" fill="none" stroke="${K}" stroke-width="6.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#3fa34d" stroke-width="3" stroke-linecap="round"/>`; };
const leaf = (x, y, r, sc = 1) => `<path d="M0 0Q10 -9 22 0Q10 8 0 0Z" transform="translate(${x} ${y}) rotate(${r}) scale(${sc})" fill="#3fa34d" ${S}/>`;
const tulip = (x, y, c) => `<path d="M${x - 9} ${y - 6}Q${x - 10} ${y + 10} ${x} ${y + 11}Q${x + 10} ${y + 10} ${x + 9} ${y - 6}L${x + 4.5} ${y}L${x} ${y - 9}L${x - 4.5} ${y}Z" fill="${c}" ${S}/>`;

const hand = (nails) => {
  const fs = [[29, 22, 11, 40], [41, 12, 12, 46], [54, 14, 12, 44], [67, 24, 10, 36]];
  const nail = (x, y, w) => (nails ? `<path d="M${x + 2} ${y + w * 0.9}V${y + w / 2}Q${x + 2} ${y + 2} ${x + w / 2} ${y + 2}Q${x + w - 2} ${y + 2} ${x + w - 2} ${y + w / 2}V${y + w * 0.9}Z" fill="#fbd3dc" stroke="${K}" stroke-width="1.8" stroke-linejoin="round"/>` : '');
  return `<rect x="36" y="86" width="30" height="10" rx="3" fill="#3aa0e0" ${S}/>
  ${fs.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="${SK}" ${S}/>${nail(x, y, w)}`).join('')}
  <path d="M32 76Q20 66 12 50Q9 42 15 40Q21 39 25 47L34 60Z" fill="${SK}" ${S}/>
  ${nails ? `<ellipse cx="14.5" cy="44" rx="3" ry="4" transform="rotate(-25 14.5 44)" fill="#fbd3dc" stroke="${K}" stroke-width="1.8"/>` : ''}
  <path d="M28 52H77V72Q77 90 52 90Q28 90 28 72Z" fill="${SK}" ${S}/>
  <path d="M38 68Q50 63 64 70" fill="none" stroke="#d99b77" stroke-width="2.2" stroke-linecap="round"/>`;
};

const ball = (x, y, r) => {
  const p = [0, 1, 2, 3, 4].map((i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return [x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, a]; });
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><path d="M${p.map((q) => `${f(q[0])} ${f(q[1])}`).join('L')}Z" fill="${K}"/>` +
    p.map(([px, py, a]) => `<path d="M${f(px)} ${f(py)}L${f(x + Math.cos(a) * r)} ${f(y + Math.sin(a) * r)}" stroke="${K}" stroke-width="1.8"/>`).join('');
};

const pine = (x, y, s, c = '#2f9e44') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-12" width="8" height="13" fill="#a8743f" ${S}/><path d="M0 -70L-14 -48H-8L-20 -29H-12L-24 -10H24L12 -29H20L8 -48H14Z" fill="${c}" ${S}/></g>`;
const roundTree = (x, y, s, c = '#62c370') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-5 0V-30H5V0Z" fill="#a8743f" ${S}/><circle cx="-14" cy="-36" r="15" fill="${c}" ${S}/><circle cx="14" cy="-36" r="15" fill="${c}" ${S}/><circle cx="0" cy="-50" r="18" fill="${c}" ${S}/></g>`;

const gift = (x, y, w, h, c, rb) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}" ${S}/><rect x="${x - 3}" y="${y - 8}" width="${w + 6}" height="10" rx="3" fill="${c}" ${S}/><rect x="${x + w / 2 - 4}" y="${y - 8}" width="8" height="${h + 8}" fill="${rb}" ${S}/><path d="M${x + w / 2} ${y - 8}q-12 -12 -14 -2q2 6 14 2q12 4 14 -2q-2 -10 -14 2z" fill="${rb}" ${S}/>`;

const nut = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -20Q4 -19 6 -16Q17 -11 17 2Q17 19 0 20Q-17 19 -17 2Q-17 -11 -6 -16Q-4 -19 0 -20Z" fill="#b5763a" ${S}/><path d="M-12 12Q0 22 12 12Q10 19 0 20Q-10 19 -12 12Z" fill="#e2c18f" stroke="${K}" stroke-width="1.8"/><path d="M-9 -6Q-10 2 -7 8" fill="none" stroke="#d9a066" stroke-width="3" stroke-linecap="round"/><path d="M4 -12Q10 0 6 14" fill="none" stroke="#8a5a2b" stroke-width="1.8" stroke-linecap="round"/></g>`;

const heart = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 16C-6 10 -20 2 -20 -8C-20 -18 -8 -22 0 -12C8 -22 20 -18 20 -8C20 2 6 10 0 16Z" fill="${c}" ${S}/><path d="M-13 -9Q-12 -14 -7 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/></g>`;

const smallFish = (x, y) => `<path d="M${x + 6} ${y}L${x + 13} ${y - 5}V${y + 5}Z" fill="#f08a24" ${S}/><ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="#ff9f1c" ${S}/><circle cx="${x - 3.5}" cy="${y - 1}" r="1.3" fill="${K}"/>`;

export const ART_BATCH3 = {
  finger: () => `<rect x="33" y="84" width="34" height="12" rx="3" fill="#3aa0e0" ${S}/>
    <rect x="36" y="8" width="15" height="54" rx="7.5" fill="${SK}" ${S}/>
    <path d="M39 22V17Q39 11 43.5 11Q48 11 48 17V22Z" fill="#fbd3dc" stroke="${K}" stroke-width="1.8"/><path d="M40 40h7" fill="none" stroke="#d99b77" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="30" y="48" width="42" height="40" rx="14" fill="${SK}" ${S}/>
    <path d="M54 58H68M54 68H70M54 78H68" fill="none" stroke="#d99b77" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M30 60Q46 58 52 68Q48 76 32 76" fill="${SK}" ${S}/>`,
  fingernail: () => `<path d="M28 96V40Q28 8 50 8Q72 8 72 40V96Z" fill="${SK}" ${S}/>
    <path d="M36 46V28Q36 16 50 16Q64 16 64 28V46Q64 53 50 53Q36 53 36 46Z" fill="#fbd3dc" ${S}/>
    <path d="M37.3 27Q38 17.5 50 17.5Q62 17.5 62.7 27Q50 22 37.3 27Z" fill="#fff"/>
    <path d="M42 36Q42 30 46 28" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M38 72Q50 76 62 72M40 80Q50 83 60 80" fill="none" stroke="#d99b77" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M82 14l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#ffd23f" ${S}/>`,
  fingernails: () => hand(true),
  fire: () => `${flame(50, 82, 0.95)}
    <rect x="12" y="74" width="76" height="12" rx="6" transform="rotate(-12 50 80)" fill="#a8743f" ${S}/>
    <rect x="12" y="74" width="76" height="12" rx="6" transform="rotate(12 50 80)" fill="#c8894f" ${S}/>`,
  fires: () => `<path d="M8 90H92" fill="none" ${S}/>${flame(24, 90, 0.6)}${flame(76, 90, 0.6)}${flame(50, 90, 0.88)}`,
  fish: () => `<path d="M70 50L92 32Q88 50 92 68Z" fill="#f08a24" ${S}/>
    <path d="M34 32Q46 14 60 30" fill="#f08a24" ${S}/>
    <path d="M8 50Q28 24 58 28Q76 34 76 50Q76 66 58 72Q28 76 8 50Z" fill="#ff9f1c" ${S}/>
    <path d="M44 56Q54 66 60 54" fill="#f08a24" ${S}/>
    <path d="M50 38q5 8 0 16M60 38q5 8 0 16" fill="none" stroke="#e07b2a" stroke-width="2.2" stroke-linecap="round"/>
    ${eye(26, 44, 5)}${smile(17, 55, 3)}
    <circle cx="14" cy="26" r="3.4" fill="#cfe9f7" ${S}/><circle cx="20" cy="15" r="2.4" fill="#cfe9f7" ${S}/>`,
  fishing_rod: () => `<path d="M6 76Q16 70 26 76T46 76T66 76T86 76T94 75V94H6Z" fill="#9bd3f0" ${S}/>
    <path d="M80 12V82" stroke="${K}" stroke-width="1.6" fill="none"/>
    <path d="M80 82v5q0 5 -5 5q-4 0 -4 -4" fill="none" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>
    ${limb('M14 92L82 10', '#a8743f', 3.4)}${limb('M14 92L26 78', '#3b3b3b', 4)}
    <circle cx="30" cy="82" r="6" fill="#9aa9b8" ${S}/>
    <circle cx="80" cy="60" r="5" fill="#fff" ${S}/><path d="M75 60A5 5 0 0 1 85 60Z" fill="#e5484d" ${S}/>
    ${smallFish(56, 88)}`,
  flatbread: () => `<ellipse cx="50" cy="54" rx="43" ry="35" fill="#e8b06a" ${S}/>
    <ellipse cx="50" cy="54" rx="33" ry="25" fill="#f5cf8f" stroke="#d99a4e" stroke-width="2.4"/>
    ${[[36, 46, 3.4], [58, 40, 4], [66, 58, 3], [44, 64, 2.6], [52, 52, 2], [30, 58, 2.2], [62, 70, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#c9823e"/>`).join('')}`,
  flight_ticket: () => `<g transform="rotate(-10 50 50)">
    <path d="M6 28H94V44Q88 44 88 50Q88 56 94 56V74H6V56Q12 56 12 50Q12 44 6 44Z" fill="#fff" ${S}/>
    <rect x="7.4" y="29.4" width="85.2" height="10" fill="#3aa0e0"/><path d="M6 40H94" fill="none" ${S}/>
    <path d="M68 44V72" stroke="${K}" stroke-width="2" stroke-dasharray="3 4"/>
    <g fill="#2f6fb0"><ellipse cx="38" cy="57" rx="17" ry="3.6"/><path d="M34 56L25 44H30L44 56ZM34 58L25 70H30L44 58ZM22 57L18 50H22L27 57Z"/></g>
    <path d="M74 50h13M74 57h10M74 64h13" fill="none" stroke="#9aa9b8" stroke-width="3" stroke-linecap="round"/></g>`,
  flour_sack: () => `<path d="M64 94Q78 76 94 94Z" fill="#fff" ${S}/>
    <path d="M30 36Q28 22 36 14L43 23L50 12L57 23L64 14Q72 22 70 36Z" fill="#f4ead6" ${S}/>
    <path d="M26 36Q18 60 20 84Q22 94 48 94Q74 94 76 84Q78 60 70 36Z" fill="#f4ead6" ${S}/>
    <path d="M27 37Q48 44 70 37" fill="none" stroke="#c8794a" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M48 86V56" fill="none" stroke="#c99a3e" stroke-width="2.6" stroke-linecap="round"/>
    ${[58, 66, 74].map((y) => `<ellipse cx="43" cy="${y}" rx="5" ry="2.6" transform="rotate(-35 43 ${y})" fill="#e6b84a" ${S}/><ellipse cx="53" cy="${y}" rx="5" ry="2.6" transform="rotate(35 53 ${y})" fill="#e6b84a" ${S}/>`).join('')}
    <ellipse cx="48" cy="52" rx="2.6" ry="5" fill="#e6b84a" ${S}/>`,
  flower: () => `${stem(50, 94, 50, 36, 6)}${leaf(52, 74, -35)}${leaf(50, 66, 215)}${bloom(50, 32, 22, '#ff6b8b')}`,
  flower_pot: () => `${stem(50, 64, 28, 30)}${stem(50, 64, 50, 22, 0)}${stem(50, 64, 72, 30, -4)}
    ${bloom(28, 28, 14, '#ff6b8b')}${bloom(72, 28, 14, '#9b8cff')}${bloom(50, 20, 14, '#ffc046', '#e5484d')}
    <path d="M30 70H70L64 94H36Z" fill="#d9733f" ${S}/><rect x="25" y="60" width="50" height="11" rx="3" fill="#e8874f" ${S}/>`,
  flower_vase: () => `${stem(50, 54, 30, 28)}${stem(50, 54, 50, 20, 0)}${stem(50, 54, 70, 28, -4)}${leaf(46, 44, 200, 0.8)}${leaf(54, 44, -20, 0.8)}
    ${tulip(30, 24, '#e5484d')}${tulip(70, 24, '#ffc046')}${tulip(50, 15, '#ff8fab')}
    <path d="M41 46H59V54Q72 62 70 78Q68 94 50 94Q32 94 30 78Q28 62 41 54Z" fill="#3aa0e0" ${S}/>
    <path d="M31 72Q50 78 69 72" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    ${[38, 50, 62].map((x) => `<circle cx="${x}" cy="82" r="2.4" fill="#fff"/>`).join('')}`,
  flowers: () => `${stem(50, 92, 26, 34)}${stem(50, 92, 50, 24, 0)}${stem(50, 92, 74, 34, -4)}${stem(50, 92, 36, 54)}${stem(50, 92, 64, 54, -4)}
    ${bloom(26, 32, 13, '#ff6b8b')}${bloom(74, 32, 13, '#9b8cff')}${bloom(50, 21, 13, '#ffc046', '#e5484d')}${bloom(35, 54, 11, '#62d2a2')}${bloom(65, 54, 11, '#ff8fab')}
    <path d="M50 76q-14 -10 -16 0q2 8 16 0q14 8 16 0q-2 -10 -16 0z" fill="#e5484d" ${S}/><path d="M48 77L42 92M52 77L58 92" fill="none" stroke="#e5484d" stroke-width="3.4" stroke-linecap="round"/><circle cx="50" cy="76" r="3.4" fill="#e5484d" ${S}/>`,
  flute: () => `<g transform="rotate(-40 50 50)"><rect x="4" y="44" width="92" height="12" rx="6" fill="#d9a066" ${S}/>
    <rect x="4" y="44" width="12" height="12" rx="6" fill="#a8743f" ${S}/>
    <rect x="22" y="44" width="4" height="12" fill="#a8743f"/><rect x="84" y="44" width="4" height="12" fill="#a8743f"/>
    <rect x="4" y="44" width="92" height="12" rx="6" fill="none" ${S}/>
    ${[40, 50, 60, 70].map((x) => `<circle cx="${x}" cy="50" r="2.4" fill="${K}"/>`).join('')}</g>
    ${[[20, 30], [76, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#9b8cff" ${S}/><path d="M${x + 4.4} ${y}V${y - 18}q7 2 9 9" fill="none" ${S}/>`).join('')}`,
  fly: () => `<ellipse cx="32" cy="36" rx="21" ry="12" transform="rotate(30 32 36)" fill="#dff2fb" ${S}/>
    <ellipse cx="68" cy="36" rx="21" ry="12" transform="rotate(-30 68 36)" fill="#dff2fb" ${S}/>
    <path d="M37 54L22 50L16 58M36 66L20 70L16 80M63 54L78 50L84 58M64 66L80 70L84 80M42 78L36 90M58 78L64 90" fill="none" ${S}/>
    <ellipse cx="50" cy="62" rx="16" ry="22" fill="#5b5f66" ${S}/>
    <path d="M36 62Q50 67 64 62M38 72Q50 77 62 72" fill="none" stroke="#3b3e44" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="50" cy="36" r="14" fill="#5b5f66" ${S}/>
    ${eye(43, 34, 6)}${eye(57, 34, 6)}${smile(50, 44, 4)}`,
  foal: () => `<path d="M80 48Q94 54 90 76Q84 66 78 58Z" fill="#7a4a2a" ${S}/>
    ${[40, 48, 68, 76].map((x) => `<rect x="${x}" y="58" width="6.4" height="32" rx="3" fill="#c98a55" ${S}/><rect x="${x}" y="86" width="6.4" height="5" rx="1.6" fill="${K}"/>`).join('')}
    <ellipse cx="60" cy="54" rx="25" ry="13" fill="#c98a55" ${S}/>
    <path d="M42 52L28 26L40 18L52 46Z" fill="#c98a55" ${S}/>
    <path d="M38 13Q52 20 54 44Q46 40 41 26Z" fill="#7a4a2a" ${S}/>
    <path d="M33 18L35 6L41 16Z" fill="#c98a55" ${S}/>
    <ellipse cx="25" cy="28" rx="14" ry="9" transform="rotate(25 25 28)" fill="#c98a55" ${S}/>
    ${eye(28, 24, 3.6)}<circle cx="15" cy="32" r="1.5" fill="${K}"/>${smile(19, 36, 3)}`,
  food_plate: () => `<ellipse cx="50" cy="58" rx="45" ry="30" fill="#fff" ${S}/>
    <ellipse cx="50" cy="57" rx="34" ry="21" fill="#eef4f7" stroke="#cfdde5" stroke-width="2"/>
    <path d="M18 62Q22 38 42 40Q54 42 56 60Q38 72 18 62Z" fill="#fffbea" ${S}/>
    ${[[28, 52], [36, 46], [44, 52], [32, 60], [42, 60], [48, 46]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.2" fill="#e8dfa4"/>`).join('')}
    ${limb('M60 54L52 62', '#fff', 4)}<circle cx="50" cy="61" r="3" fill="#fff" ${S}/><circle cx="53" cy="65" r="3" fill="#fff" ${S}/>
    <path d="M58 52Q62 36 76 40Q86 48 76 58Q68 60 58 52Z" fill="#c9823e" ${S}/>
    <circle cx="66" cy="68" r="7" fill="#e5484d" ${S}/><path d="M66 62V74M60 68H72" fill="none" stroke="#ffb3b3" stroke-width="1.8"/>
    <circle cx="79" cy="62" r="5.4" fill="#9ccf6a" ${S}/><circle cx="79" cy="62" r="2.4" fill="#e5f5c8"/>`,
  foot: () => `<path d="M40 94Q26 92 28 74Q30 60 27 46Q26 30 48 30Q74 30 74 48Q72 64 66 76Q60 94 40 94Z" fill="${SK}" ${S}/>
    ${[[36, 22, 8.5], [51, 18, 6.6], [62, 21, 5.6], [71, 27, 4.8], [77, 35, 4.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SK}" ${S}/><ellipse cx="${x}" cy="${f(y - r * 0.25)}" rx="${f(r * 0.5)}" ry="${f(r * 0.45)}" fill="#fbd3dc" stroke="${K}" stroke-width="1.6"/>`).join('')}
    <path d="M38 60Q44 66 40 76" fill="none" stroke="#d99b77" stroke-width="2.2" stroke-linecap="round"/>`,
  football_goal: () => `<rect x="4" y="80" width="92" height="14" rx="4" fill="#7cc66b" ${S}/>
    <rect x="14" y="20" width="72" height="60" fill="#f4f8fa"/>
    <path d="${[22, 30, 38, 46, 54, 62, 70, 78].map((x) => `M${x} 20V80`).join('')}${[28, 36, 44, 52, 60, 68, 76].map((y) => `M14 ${y}H86`).join('')}" fill="none" stroke="#b9cbd6" stroke-width="1.6"/>
    <path d="M14 82V20H86V82" fill="none" stroke="${K}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/><path d="M14 82V20H86V82" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    ${ball(56, 74, 10)}`,
  football_player: () => `${limb('M44 66V88', SK, 6)}${limb('M56 66L74 78', SK, 6)}
    <ellipse cx="44" cy="91" rx="7" ry="4" fill="${K}"/><ellipse cx="77" cy="80" rx="6" ry="4" transform="rotate(35 77 80)" fill="${K}"/>
    ${limb('M38 38L24 26', SK, 5)}${limb('M62 38L74 50', SK, 5)}
    <path d="M37 34H63L65 60H35Z" fill="#e5484d" ${S}/><path d="M37 34L28 42L32 47L37 42M63 34L72 42L68 47L63 42" fill="#e5484d" ${S}/>
    <path d="M50 34V58" fill="none" stroke="#fff" stroke-width="3"/>
    <path d="M35 58H65L67 70H53L50 66L47 70H33Z" fill="#fff" ${S}/>
    <circle cx="50" cy="21" r="12" fill="${SK}" ${S}/><path d="M38 20Q37 8 50 8Q63 8 62 20Q58 13 50 13Q42 13 38 20Z" fill="#3b2a20" ${S}/>
    ${de(45.5, 21)}${de(54.5, 21)}${smile(50, 26, 3.4)}${blush(41, 25)}${blush(59, 25)}
    ${ball(86, 84, 8)}`,
  forest: () => `<path d="M4 90Q50 82 96 90V95H4Z" fill="#8fd16a" ${S}/>
    ${pine(17, 88, 0.95)}${pine(83, 88, 0.95)}${roundTree(50, 88, 1.05)}${pine(31, 93, 0.75, '#3fa34d')}${pine(69, 93, 0.75, '#3fa34d')}`,
  fountain: () => `<path d="M50 28Q50 12 50 10M50 16Q34 12 30 42M50 16Q66 12 70 42M29 46Q16 50 16 74M71 46Q84 50 84 74" fill="none" stroke="#3aa0e0" stroke-width="3.4" stroke-linecap="round"/>
    ${[[14, 64], [86, 64], [36, 26], [64, 26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#3aa0e0"/>`).join('')}
    <path d="M8 76H92Q90 93 50 93Q10 93 8 76Z" fill="#c8b8a6" ${S}/><ellipse cx="50" cy="76" rx="42" ry="6" fill="#9bd3f0" ${S}/>
    <rect x="45" y="46" width="10" height="30" fill="#d8ccbd" ${S}/>
    <path d="M27 44H73Q71 57 50 57Q29 57 27 44Z" fill="#c8b8a6" ${S}/><ellipse cx="50" cy="44" rx="23" ry="4" fill="#9bd3f0" ${S}/>
    <rect x="47" y="28" width="6" height="15" rx="2" fill="#d8ccbd" ${S}/>`,
  fox: () => `<path d="M64 88Q96 88 90 58Q86 44 76 54Q80 74 62 78Z" fill="#f08a24" ${S}/>
    <path d="M86 50Q92 56 90 64Q84 60 80 52Q82 48 86 50Z" fill="#fff" ${S}/>
    <path d="M32 93Q28 62 50 52Q72 62 68 93Z" fill="#f08a24" ${S}/>
    <path d="M42 93Q42 68 50 62Q58 68 58 93Z" fill="#fff"/>
    <ellipse cx="42" cy="93" rx="7" ry="3.6" fill="#5a3a2a" ${S}/><ellipse cx="58" cy="93" rx="7" ry="3.6" fill="#5a3a2a" ${S}/>
    <path d="M26 30L20 5L44 20Z" fill="#f08a24" ${S}/><path d="M27 24L24 11L36 20Z" fill="#5a3a2a"/>
    <path d="M74 30L80 5L56 20Z" fill="#f08a24" ${S}/><path d="M73 24L76 11L64 20Z" fill="#5a3a2a"/>
    <path d="M20 26Q24 14 50 14Q76 14 80 26Q78 44 50 60Q22 44 20 26Z" fill="#f08a24" ${S}/>
    <path d="M24 32Q38 36 50 59Q30 49 24 32ZM76 32Q62 36 50 59Q70 49 76 32Z" fill="#fff"/>
    ${eye(40, 31, 4.4)}${eye(60, 31, 4.4)}<ellipse cx="50" cy="51" rx="4" ry="3" fill="${K}"/>`,
  frog: () => `<circle cx="30" cy="38" r="14" fill="#62c370" ${S}/><circle cx="70" cy="38" r="14" fill="#62c370" ${S}/>
    <ellipse cx="50" cy="66" rx="40" ry="26" fill="#62c370" ${S}/>
    <ellipse cx="50" cy="74" rx="22" ry="15" fill="#c9eeb0"/>
    ${eye(30, 37, 8)}${eye(70, 37, 8)}
    <path d="M30 56Q50 70 70 56" fill="none" ${S}/>${blush(24, 58, 4)}${blush(76, 58, 4)}
    <ellipse cx="26" cy="90" rx="11" ry="5" fill="#3fa34d" ${S}/><ellipse cx="74" cy="90" rx="11" ry="5" fill="#3fa34d" ${S}/>`,
  fruit_basket: () => `${limb('M16 54Q50 -4 84 54', '#c8794a', 4)}
    <path d="M26 44Q44 66 76 40Q72 54 50 56Q32 56 26 44Z" fill="#ffd23f" ${S}/>
    ${[[44, 30], [52, 30], [48, 37], [56, 37], [40, 37], [44, 44], [52, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#8e5bb5" ${S}/>`).join('')}
    <circle cx="28" cy="44" r="13" fill="#e5484d" ${S}/><path d="M28 31q1 -6 6 -7" fill="none" ${S}/>
    <circle cx="72" cy="44" r="13" fill="#ff9f1c" ${S}/><circle cx="68" cy="40" r="3" fill="#ffc46b"/>
    <path d="M10 54H90L80 90Q78 94 72 94H28Q22 94 20 90Z" fill="#d9a066" ${S}/>
    <path d="M14 66H86M17 78H83M34 56V92M50 56V93M66 56V92" fill="none" stroke="#a8743f" stroke-width="2.2"/>
    <rect x="7" y="49" width="86" height="9" rx="4.5" fill="#c8794a" ${S}/>`,
  fruit_tree: () => `<path d="M10 92Q50 86 90 92" fill="none" ${S}/>
    <path d="M44 92V58H56V92Z" fill="#a8743f" ${S}/>
    <path d="M24 62Q6 58 10 40Q12 24 28 24Q32 8 50 8Q68 8 72 24Q88 24 90 40Q94 58 76 62Q64 70 50 64Q36 70 24 62Z" fill="#3fa34d" ${S}/>
    ${[[28, 42], [50, 26], [70, 40], [42, 50], [60, 54], [36, 30], [64, 24], [80, 50], [20, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.4" fill="#e5484d" ${S}/><circle cx="${x - 1.6}" cy="${y - 1.6}" r="1.4" fill="#fff" opacity=".8"/>`).join('')}`,
  furniture: () => `<rect x="10" y="40" width="54" height="30" rx="8" fill="#3aa0e0" ${S}/>
    <rect x="14" y="60" width="46" height="18" rx="5" fill="#5bb6ea" ${S}/><path d="M37 60V78" fill="none" ${S}/>
    <rect x="5" y="54" width="13" height="28" rx="6" fill="#3aa0e0" ${S}/><rect x="56" y="54" width="13" height="28" rx="6" fill="#3aa0e0" ${S}/>
    <rect x="9" y="82" width="5" height="7" rx="1.5" fill="${K}"/><rect x="60" y="82" width="5" height="7" rx="1.5" fill="${K}"/>
    <path d="M74 89V68M90 89V68" fill="none" ${S}/><rect x="72" y="64" width="20" height="5" rx="2" fill="#a8743f" ${S}/>
    <path d="M82 64V40" fill="none" ${S}/><path d="M76 64H88L85 60H79Z" fill="#a8743f" ${S}/>
    <path d="M73 40H91L87 24H77Z" fill="#ffd23f" ${S}/>`,
  garlic: () => `<path d="M44 18Q40 30 26 40Q10 52 16 70Q24 88 44 88Q64 88 72 70Q78 52 62 40Q48 30 44 18Z" fill="#f7f1e3" ${S}/>
    <path d="M44 30Q30 52 34 86M44 30Q58 52 54 86M38 36Q18 56 26 82M50 36Q72 56 64 82" fill="none" stroke="#d8cbb0" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M40 20Q42 10 46 7Q49 13 48 20Z" fill="#e8dcc0" ${S}/>
    <path d="M36 88q-2 6 -6 6M44 88v7M52 88q2 6 6 6" fill="none" ${S}/>
    <path d="M78 64Q92 72 86 88Q80 94 74 90Q82 80 78 64Z" fill="#f7f1e3" ${S}/><path d="M78 64Q76 80 74 90" fill="none" stroke="#d8cbb0" stroke-width="2"/>`,
  gazelle: () => gazelle(52, 60, 0.84),
  gazelles: () => gazelle(28, 66, 0.64) + gazelle(72, 58, 0.64),
  gift_boxes: () => `${gift(10, 54, 40, 38, '#e5484d', '#ffd23f')}${gift(58, 64, 32, 28, '#3aa0e0', '#ff8fab')}${gift(64, 38, 20, 16, '#62c370', '#fff')}`,
  girl: () => girl(50, 8, 1, '#e5484d', '#9b8cff'),
  girls: () => girl(22, 30, 0.68, '#3aa0e0', '#ffc046') + girl(78, 30, 0.68, '#62c370', '#ff8fab') + girl(50, 22, 0.76, '#e5484d', '#9b8cff'),
  glue_tube: () => `<g transform="rotate(-30 50 50)">
    <path d="M24 34H66L70 40V60L66 66H24Q20 58 20 50Q20 42 24 34Z" fill="#fff" ${S}/>
    <path d="M18 32V68" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
    <rect x="30" y="40" width="28" height="20" rx="4" fill="#ffc046" ${S}/><path d="M38 50q6 -8 12 0q-6 8 -12 0z" fill="#e5484d"/>
    <rect x="70" y="44" width="8" height="12" fill="#e9e9e9" ${S}/><rect x="78" y="42" width="14" height="16" rx="3" fill="#e5484d" ${S}/></g>
    <path d="M78 74Q82 82 82 86Q82 91 78 91Q74 91 74 86Q74 82 78 74Z" fill="#fff" ${S}/>`,
  goat: () => `${[38, 46, 66, 74].map((x) => `<rect x="${x}" y="62" width="6.4" height="26" rx="3" fill="#f2ede4" ${S}/><rect x="${x}" y="85" width="6.4" height="5" rx="1.6" fill="${K}"/>`).join('')}
    <path d="M82 46q8 -6 6 -12" fill="none" ${S}/>
    <ellipse cx="60" cy="56" rx="26" ry="15" fill="#f2ede4" ${S}/><path d="M60 44Q72 46 74 58Q64 60 58 50Z" fill="#c8a07a"/>
    <path d="M44 54L30 38L42 30L52 48Z" fill="#f2ede4" ${S}/>
    <path d="M30 28Q34 10 48 14Q40 17 36 30Z" fill="#a8743f" ${S}/>
    <path d="M22 46L19 62L30 50Z" fill="#d8cbb0" ${S}/>
    <ellipse cx="28" cy="38" rx="12" ry="10" fill="#f2ede4" ${S}/>
    <ellipse cx="42" cy="38" rx="8" ry="3.6" transform="rotate(25 42 38)" fill="#e8dcc8" ${S}/>
    ${eye(26, 35, 3.8)}<circle cx="18" cy="42" r="1.4" fill="${K}"/>${smile(22, 45, 2.6)}`,
  gold_bars: () => `${[[8, 90], [36, 90], [64, 90], [22, 74], [50, 74], [36, 58]].map(([x, y]) => `<path d="M${x} ${y}H${x + 28}L${x + 24} ${y - 16}H${x + 4}Z" fill="#f6c343" ${S}/><path d="M${x + 8} ${y - 12}H${x + 18}" stroke="#fff3b0" stroke-width="3" stroke-linecap="round"/>`).join('')}
    ${[[22, 30, 1], [78, 36, 0.8], [52, 22, 0.6]].map(([x, y, s]) => `<path d="M0 -9L2.4 -2.4L9 0L2.4 2.4L0 9L-2.4 2.4L-9 0L-2.4 -2.4Z" transform="translate(${x} ${y}) scale(${s})" fill="#ffd23f" ${S}/>`).join('')}`,
  goose: () => `${limb('M50 76V89M60 76V89', '#f6a623', 3)}<path d="M42 92L50 87L58 92ZM52 92L60 87L68 92Z" fill="#f6a623" ${S}/>
    <path d="M30 62Q18 40 24 22Q28 10 38 10Q46 12 46 22Q42 36 46 50Z" fill="#fff" ${S}/>
    <path d="M30 62Q30 46 54 46Q76 46 86 52L93 48Q91 62 80 70Q66 80 46 78Q30 74 30 62Z" fill="#fff" ${S}/>
    <path d="M46 58Q64 50 80 60Q66 72 50 68Z" fill="#e3eaef" ${S}/>
    <path d="M28 14L7 21L28 27Z" fill="#f6a623" ${S}/><path d="M9 21H26" fill="none" stroke="${K}" stroke-width="1.6"/>
    <circle cx="35" cy="20" r="10" fill="#fff" ${S}/>${eye(33, 18, 3.6)}`,
  gorilla: () => `<path d="M24 48Q6 66 12 92H30L34 56Z" fill="#4b4b55" ${S}/><path d="M76 48Q94 66 88 92H70L66 56Z" fill="#4b4b55" ${S}/>
    <ellipse cx="50" cy="68" rx="28" ry="26" fill="#4b4b55" ${S}/><ellipse cx="50" cy="72" rx="16" ry="15" fill="#7d7d8a"/>
    <ellipse cx="21" cy="92" rx="11" ry="4" fill="#7d7d8a" ${S}/><ellipse cx="79" cy="92" rx="11" ry="4" fill="#7d7d8a" ${S}/>
    <circle cx="28" cy="34" r="5" fill="#4b4b55" ${S}/><circle cx="72" cy="34" r="5" fill="#4b4b55" ${S}/>
    <ellipse cx="50" cy="32" rx="22" ry="21" fill="#4b4b55" ${S}/>
    <path d="M34 31Q34 22 42 24Q50 27 58 24Q66 22 66 31Q68 49 50 50Q32 49 34 31Z" fill="#b5a797" ${S}/>
    ${eye(43, 31, 3.8)}${eye(57, 31, 3.8)}<circle cx="47" cy="40" r="1.6" fill="${K}"/><circle cx="53" cy="40" r="1.6" fill="${K}"/>${smile(50, 45, 5)}`,
  grandfather: () => man(46, 4, 1.07, { robe: '#e9e2d0', hair: '#d9d9d9', beard: true, cane: true, glasses: true }),
  grapes: () => `<path d="M50 30Q50 18 56 10" fill="none" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/>
    <path d="M56 22Q66 6 82 14Q78 30 60 28Z" fill="#3fa34d" ${S}/><path d="M60 26Q68 18 78 16" fill="none" stroke="#2f7d3a" stroke-width="1.8"/>
    ${[[27.5, 36], [42.5, 36], [57.5, 36], [72.5, 36], [35, 50], [50, 50], [65, 50], [42.5, 64], [57.5, 64], [50, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#8e5bb5" ${S}/><circle cx="${x - 3}" cy="${y - 3}" r="2" fill="#c9a6e6"/>`).join('')}`,
  grass: () => `<rect x="4" y="80" width="92" height="14" rx="4" fill="#8a5a3b" ${S}/>
    ${[8, 15, 22, 29, 36, 43, 50, 57, 64, 71, 78, 85, 92].map((x, i) => { const h = [44, 30, 52, 36, 46, 28, 56, 34, 48, 30, 50, 38, 42][i]; const c = i % 2 ? '#62c370' : '#3fa34d'; return `<path d="M${x - 5} 84Q${x - 2} ${84 - h / 2} ${x + (i % 3 - 1) * 4} ${84 - h}Q${x + 2} ${84 - h / 2} ${x + 5} 84Z" fill="${c}" ${S}/>`; }).join('')}
    ${bloom(26, 46, 7, '#fff')}${bloom(74, 50, 7, '#ffc046', '#e5484d')}`,
  guests: () => `${man(26, 12, 0.88, { robe: '#cfe9f7', hair: '#3b2a20' })}${girl(58, 12, 0.88, '#9b8cff', '#f6a623')}${man(85, 42, 0.56, { robe: '#62c370', hair: '#5a3a2a' })}
    ${gift(36, 64, 14, 12, '#e5484d', '#ffd23f')}`,
  guests_at_door: () => `<rect x="6" y="12" width="36" height="82" rx="3" fill="#8a5a3b" ${S}/>
    <rect x="12" y="18" width="24" height="76" fill="#f7d77a" ${S}/>
    <path d="M12 18L26 24V90L12 94Z" fill="#c8794a" ${S}/><circle cx="23" cy="58" r="2" fill="${K}"/>
    <rect x="4" y="92" width="92" height="4" rx="2" fill="#c8b8a6" ${S}/>
    ${man(60, 18, 0.86, { robe: '#fff', hair: '#3b2a20' })}${girl(82, 22, 0.8, '#62c370', '#e5484d')}`,
  hammer: () => `<g transform="rotate(-35 50 52)">
    <rect x="44" y="36" width="12" height="56" rx="6" fill="#d9a066" ${S}/><rect x="44" y="70" width="12" height="22" rx="6" fill="#e5484d" ${S}/>
    <path d="M26 20H66Q78 20 82 14Q82 28 72 38H26Z" fill="#9aa9b8" ${S}/>
    <rect x="16" y="17" width="12" height="24" rx="3" fill="#7d8b99" ${S}/>
    <path d="M32 25H58" stroke="#d5dee6" stroke-width="3" stroke-linecap="round"/></g>`,
  hand: () => hand(false),
  hazelnut: () => `${leaf(50, 30, -150, 1.4)}${leaf(50, 30, -30, 1.4)}${nut(50, 60, 1.6)}`,
  hazelnuts: () => `${nut(28, 68, 1.05)}${nut(72, 68, 1.05)}${nut(50, 38, 1.05)}`,
  hearts: () => `${heart(30, 38, 1.05, '#e5484d')}${heart(72, 44, 0.9, '#ff8fab')}${heart(48, 74, 0.8, '#f0566a')}`,
  hedgehog: () => {
    const pts = []; const N = 18;
    for (let i = 0; i <= N; i++) { const a = Math.PI + (i * Math.PI) / N; const r = i % 2 ? 1 : 0.78; pts.push(`${f(58 + Math.cos(a) * 34 * r)} ${f(70 + Math.sin(a) * 36 * r)}`); }
    return `<path d="M${pts.join('L')}L90 82L30 82Z" fill="#8a5a3b" ${S}/>
    <path d="M60 60Q42 52 12 72Q30 88 62 84Z" fill="#e8c39a" ${S}/>
    <ellipse cx="46" cy="86" rx="6" ry="3.4" fill="#e8c39a" ${S}/><ellipse cx="74" cy="86" rx="6" ry="3.4" fill="#e8c39a" ${S}/>
    <circle cx="46" cy="58" r="4" fill="#e8c39a" ${S}/>
    <circle cx="12" cy="72" r="4" fill="${K}"/>${eye(32, 66, 3.8)}${smile(22, 77, 3)}${blush(38, 74, 3)}`;
  },
  helmet: () => `<path d="M18 72Q16 26 50 22Q84 26 82 72Z" fill="#ffd23f" ${S}/>
    <path d="M42 24Q50 20 58 24V72H42Z" fill="#f6c343" ${S}/>
    <path d="M26 56Q28 40 37 32" fill="none" stroke="#fff3b0" stroke-width="4" stroke-linecap="round"/>
    <path d="M6 70H94Q94 82 82 82H18Q6 82 6 70Z" fill="#f6c343" ${S}/>`,
  hoopoe: () => `${limb('M6 86H94', '#a8743f', 4)}
    <path d="M52 74V86M60 74V86" fill="none" stroke="${K}" stroke-width="3"/>
    <path d="M66 62L93 68L89 80L64 72Z" fill="#3b3b3b" ${S}/><path d="M78 66L76 77" stroke="#fff" stroke-width="3"/>
    <ellipse cx="54" cy="62" rx="22" ry="15" fill="#e8a25a" ${S}/>
    <path d="M46 58Q66 48 82 64Q68 76 50 70Z" fill="#3b3b3b" ${S}/><path d="M56 57L59 71M65 55L68 71M73 58L75 69" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    ${[-160, -130, -100, -70, -40].map((a) => { const r = (a * Math.PI) / 180, cx = f(38 + Math.cos(r) * 15), cy = f(38 + Math.sin(r) * 15); return `<ellipse cx="${cx}" cy="${cy}" rx="4.6" ry="11" transform="rotate(${a + 90} ${cx} ${cy})" fill="#f08a24" ${S}/><circle cx="${f(38 + Math.cos(r) * 24)}" cy="${f(38 + Math.sin(r) * 24)}" r="3" fill="#3b3b3b"/>`; }).join('')}
    <path d="M26 44Q12 50 6 60Q16 52 27 50Z" fill="#3b3b3b" ${S}/>
    <circle cx="36" cy="44" r="12" fill="#e8a25a" ${S}/>${eye(33, 42, 3.4)}`,
  horn: () => `${limb('M22 58V70H62V58', '#f6c343', 4)}
    <rect x="10" y="50" width="56" height="9" rx="4" fill="#f6c343" ${S}/>
    ${[30, 39, 48].map((x) => `<rect x="${x}" y="36" width="5" height="14" rx="1.5" fill="#e7a51b" ${S}/><rect x="${x - 1.5}" y="32" width="8" height="4" rx="2" fill="#f0a91c" ${S}/>`).join('')}
    <path d="M62 48L82 30Q86 54 82 78L62 61Z" fill="#ffd95a" ${S}/>
    <ellipse cx="83" cy="54" rx="4.4" ry="24" fill="#f0a91c" ${S}/>
    <path d="M5 50v9l6 -2.4v-4.2z" fill="#f0a91c" ${S}/>
    <path d="M91 42Q95 54 91 66" fill="none" ${S}/>`,
};
