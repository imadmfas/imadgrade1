// batch6 — original SVG art, 100×100 viewBox
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;
const smile = (x, y, w = 5) => `<path d="M${x - w} ${y}Q${x} ${y + w * 0.9} ${x + w} ${y}" fill="none" ${S}/>`;
const cheeks = (x, y, d) => `<circle cx="${x - d}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".7"/><circle cx="${x + d}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".7"/>`;
const star = (cx, cy, R, r, fill) => {
  const p = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r : R; p.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`); }
  return `<path d="M${p.join('L')}Z" fill="${fill}" ${S}/>`;
};
const tree = (x, y, s = 1, c = '#5cb85c') => `<rect x="${x - 4 * s}" y="${y - 22 * s}" width="${8 * s}" height="${22 * s}" rx="2" fill="#a8743f" ${S}/><circle cx="${x}" cy="${y - 36 * s}" r="${18 * s}" fill="${c}" ${S}/><circle cx="${x - 6 * s}" cy="${y - 42 * s}" r="${4 * s}" fill="#8ad48a"/>`;

export const ART_BATCH6 = {
  // شَتْلاتٌ: ثلاث شتلات صغيرة في صندوق تربة
  seedlings: () => `<path d="M10 66H90L84 92H16Z" fill="#c8794a" ${S}/><path d="M10 66H90" ${S}/>
    <ellipse cx="50" cy="66" rx="40" ry="4" fill="#7a4a2a" ${S}/>
    ${[26, 50, 74].map((x, i) => `<path d="M${x} 66V${40 + i % 2 * -6}" fill="none" stroke="#3fa34d" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M${x} ${48 - i % 2 * 6}Q${x - 16} ${44 - i % 2 * 6} ${x - 14} ${32 - i % 2 * 6}Q${x - 2} ${34 - i % 2 * 6} ${x} ${48 - i % 2 * 6}Z" fill="#7cd36b" ${S}/>
    <path d="M${x} ${44 - i % 2 * 6}Q${x + 16} ${40 - i % 2 * 6} ${x + 14} ${26 - i % 2 * 6}Q${x + 2} ${28 - i % 2 * 6} ${x} ${44 - i % 2 * 6}Z" fill="#5cb85c" ${S}/>`).join('')}
    <path d="M28 80H72" stroke="#a65f35" stroke-width="2.4" stroke-linecap="round"/>`,
  // بُذُوْرٌ وحُبُوبٌ: صحن خشبي مليء بالحبوب وحبات متناثرة
  seeds: () => `<path d="M10 52Q12 86 50 88Q88 86 90 52Z" fill="#c8794a" ${S}/>
    <path d="M14 52Q30 30 50 32Q70 30 86 52Z" fill="#e8c27a" ${S}/>
    ${[[28, 46], [40, 40], [52, 38], [64, 42], [74, 48], [36, 50], [50, 47], [62, 50], [46, 44], [58, 44]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="2.6" transform="rotate(${i * 37} ${x} ${y})" fill="#b07a3a" stroke="${K}" stroke-width="1.6"/>`).join('')}
    <path d="M20 66Q50 74 80 66" fill="none" stroke="#a65f35" stroke-width="2.4" stroke-linecap="round"/>
    ${[[16, 94], [30, 96], [80, 94]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y - 2}" rx="4" ry="2.4" transform="rotate(${i * 50 - 20} ${x} ${y - 2})" fill="#d9a35a" stroke="${K}" stroke-width="1.6"/>`).join('')}`,
  // ظِلٌّ: شجرة تحت الشمس وظلها الداكن على الأرض
  shadow: () => `<circle cx="18" cy="18" r="10" fill="#ffd23f" ${S}/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i * Math.PI / 4; return `<path d="M${(18 + 14 * Math.cos(a)).toFixed(1)} ${(18 + 14 * Math.sin(a)).toFixed(1)}L${(18 + 19 * Math.cos(a)).toFixed(1)} ${(18 + 19 * Math.sin(a)).toFixed(1)}" ${S}/>`; }).join('')}
    <rect x="6" y="80" width="88" height="14" rx="4" fill="#b8e07a" ${S}/>
    <path d="M50 84Q70 78 92 82Q94 92 70 92Q54 92 50 88Z" fill="#5a6b3a" opacity=".75"/>
    <rect x="44" y="56" width="10" height="30" rx="3" fill="#a8743f" ${S}/>
    <circle cx="49" cy="42" r="22" fill="#5cb85c" ${S}/><circle cx="41" cy="34" r="5" fill="#8ad48a"/>`,
  // قِرْشٌ رمادي مبتسم فوق الموج
  shark: () => `<path d="M8 54Q30 30 62 36Q80 38 92 30Q88 46 92 64Q80 56 66 60Q40 72 8 54Z" fill="#8fa7bd" ${S}/>
    <path d="M44 36Q48 20 60 14Q58 26 62 36Z" fill="#8fa7bd" ${S}/>
    <path d="M10 54Q34 66 60 58Q40 64 24 60Z" fill="#fff" ${S}/>
    <path d="M40 60Q44 70 36 78Q38 66 32 62Z" fill="#7d93a8" ${S}/>
    ${eye(24, 46, 4)}<path d="M12 54Q20 58 28 56" fill="none" ${S}/>
    <path d="M36 46v8M41 45v8M46 44v8" fill="none" stroke="${K}" stroke-width="2" stroke-linecap="round"/>
    <path d="M6 88Q16 80 26 88Q36 96 46 88Q56 80 66 88Q76 96 86 88Q92 84 96 88" fill="none" stroke="#3aa0e0" stroke-width="3.4" stroke-linecap="round"/>`,
  // خَرُوْفٌ: صوف أبيض منفوش ووجه داكن
  sheep: () => `${[4, 5, 6, 7].map((i) => '').join('')}
    <rect x="30" y="70" width="8" height="20" rx="4" fill="#5a4a42" ${S}/><rect x="64" y="70" width="8" height="20" rx="4" fill="#5a4a42" ${S}/>
    <path d="M24 58Q14 54 20 44Q18 32 32 32Q38 22 50 28Q62 20 70 30Q84 28 84 42Q92 50 84 60Q86 72 72 72Q62 80 50 74Q38 80 30 72Q18 70 24 58Z" fill="#fff" ${S}/>
    <ellipse cx="20" cy="50" rx="13" ry="15" fill="#5a4a42" ${S}/>
    <ellipse cx="8" cy="44" rx="6" ry="3.4" fill="#5a4a42" ${S}/><ellipse cx="32" cy="42" rx="6" ry="3.4" fill="#5a4a42" ${S}/>
    <circle cx="20" cy="36" r="6" fill="#fff" ${S}/>
    ${eye(15, 48, 3.4)}${eye(25, 48, 3.4)}<path d="M16 58Q20 61 24 58" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`,
  // سَفِيْنَةٌ كبيرة بمدخنة فوق الموج
  ship: () => `<rect x="30" y="38" width="40" height="16" rx="2" fill="#fff" ${S}/>
    ${[36, 46, 56].map((x) => `<circle cx="${x + 3}" cy="46" r="3" fill="#9bd3f0" ${S}/>`).join('')}
    <rect x="38" y="26" width="24" height="12" rx="2" fill="#f4e3c3" ${S}/>
    <rect x="50" y="10" width="10" height="16" rx="2" fill="#f2c14e" ${S}/><rect x="50" y="10" width="10" height="5" fill="#e5484d" ${S}/>
    <path d="M8 54H92L80 78H20Z" fill="#e5484d" ${S}/><path d="M12 62H88" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M4 84Q14 76 24 84Q34 92 44 84Q54 76 64 84Q74 92 84 84Q90 80 96 84" fill="none" stroke="#3aa0e0" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M14 94Q24 88 34 94M58 94Q68 88 78 94" fill="none" stroke="#3aa0e0" stroke-width="3" stroke-linecap="round"/>`,
  // حِذَاءٌ: زوج أحذية جلدية بنية
  shoes: () => `${[[0, 0], [8, 22]].map(([dx, dy]) => `<g transform="translate(${dx} ${dy})"><path d="M8 54Q8 40 18 38L36 36Q42 44 54 46Q74 48 82 56Q86 64 78 66H12Q8 64 8 54Z" fill="#a8613a" ${S}/>
    <path d="M10 66H80" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
    <path d="M36 38Q40 48 54 48" fill="none" ${S}/><path d="M42 44l4 -4M48 47l3 -4" stroke="#f4e3c3" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 42Q22 40 28 40" fill="none" stroke="#c98a5a" stroke-width="2.4" stroke-linecap="round"/></g>`).join('')}`,
  // مِنْجَلٌ: نصل معقوف ومقبض خشبي
  sickle: () => `<path d="M46 66Q20 60 18 36Q20 14 46 10Q72 8 84 28Q70 18 50 20Q30 24 32 42Q36 58 52 60Z" fill="#c9d3dc" ${S}/>
    <path d="M30 26Q40 16 56 16" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="44" y="58" width="12" height="10" rx="2" fill="#9aa9b8" ${S}/>
    <path d="M50 66L78 92" stroke="${K}" stroke-width="13" stroke-linecap="round"/><path d="M50 66L78 92" stroke="#c8794a" stroke-width="8" stroke-linecap="round"/>
    <path d="M60 76l3 3M68 83l3 3" stroke="#8a5a3b" stroke-width="2" stroke-linecap="round"/>`,
  // حَلَزُوْنٌ: صدفة حلزونية وجسم بقرنين
  snail: () => `<path d="M8 82Q10 70 26 70H70Q80 60 82 44" fill="none" ${S}/>
    <path d="M10 84Q8 72 24 72H68Q78 64 80 50Q78 40 84 36Q94 40 92 52Q90 70 80 80Q74 86 62 86H14Q10 86 10 84Z" fill="#ffd38a" ${S}/>
    <path d="M82 38L78 22M88 38L94 24" fill="none" ${S}/><circle cx="78" cy="21" r="3" fill="${K}"/><circle cx="94" cy="23" r="3" fill="${K}"/>
    ${eye(84, 46, 3.4)}<path d="M82 56Q86 59 90 56" fill="none" ${S}/>
    <circle cx="40" cy="48" r="26" fill="#e8834a" ${S}/>
    <path d="M40 48m-4 0a4 4 0 1 1 8 0a9 9 0 1 1 -17 2a14 14 0 1 1 27 -4a19 19 0 1 1 -36 4" fill="none" stroke="#a84a25" stroke-width="2.8" stroke-linecap="round"/>`,
  // ثُعْبَانٌ أخضر ملتف بلسان أحمر
  snake: () => `<path d="M14 86Q4 74 22 70H66Q84 68 82 54Q80 42 62 44H40Q22 44 24 32Q26 20 44 22H58" fill="none" stroke="${K}" stroke-width="15" stroke-linecap="round"/>
    <path d="M14 86Q4 74 22 70H66Q84 68 82 54Q80 42 62 44H40Q22 44 24 32Q26 20 44 22H58" fill="none" stroke="#6cc04a" stroke-width="10" stroke-linecap="round"/>
    ${[[30, 70], [50, 70], [70, 62], [60, 44], [36, 44], [34, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#f2c14e"/>`).join('')}
    <ellipse cx="68" cy="22" rx="14" ry="11" fill="#6cc04a" ${S}/>
    ${eye(66, 18, 3.6)}${eye(76, 18, 3.6)}<path d="M66 27Q72 30 78 27" fill="none" ${S}/>
    <path d="M82 24H90L94 20M90 24L94 28" fill="none" stroke="#e5484d" stroke-width="2.4" stroke-linecap="round"/>`,
  // حِذَاءٌ رياضي بأربطة ونعل أبيض
  sneakers: () => `<path d="M8 70Q6 52 14 44Q20 32 34 34L40 40Q50 48 62 50Q84 52 90 64Q92 72 86 74H12Q8 74 8 70Z" fill="#3aa0e0" ${S}/>
    <path d="M8 70H90Q92 82 84 84H14Q6 84 8 70Z" fill="#fff" ${S}/>
    <path d="M14 78H86" stroke="#e5484d" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M14 44Q10 50 12 60" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    ${[[38, 42], [44, 46], [50, 49]].map(([x, y]) => `<path d="M${x} ${y}l6 -6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M56 58Q66 56 76 62" fill="none" stroke="#f2c14e" stroke-width="4" stroke-linecap="round"/>
    <path d="M28 36Q30 28 34 34" fill="none" ${S}/>`,
  // جُنُوْدٌ: جنديان بزي عسكري أخضر وخوذة
  soldiers: () => `${[30, 70].map((x) => `<path d="M${x - 16} 94V66Q${x - 16} 54 ${x} 54Q${x + 16} 54 ${x + 16} 66V94Z" fill="#6b7d3a" ${S}/>
    <path d="M${x - 10} 64h6v6h-6zM${x + 4} 74h7v5h-7z" fill="#4f5e2a"/>
    <path d="M${x - 16} 78H${x + 16}" stroke="${K}" stroke-width="4"/><rect x="${x - 3}" y="75" width="6" height="6" rx="1" fill="#f2c14e" ${S}/>
    <circle cx="${x}" cy="40" r="13" fill="#f6c9a6" ${S}/>
    <path d="M${x - 16} 38Q${x - 15} 20 ${x} 20Q${x + 15} 20 ${x + 16} 38Z" fill="#7d8f44" ${S}/>
    ${eye(x - 5, 43, 3)}${eye(x + 5, 43, 3)}${smile(x, 48, 4)}`).join('')}`,
  // عَنْكَبُوْتٌ لطيف معلق بخيط
  spider: () => `<path d="M50 4V34" stroke="#9aa9b8" stroke-width="2"/>
    ${[-1, 1].map((s) => [[-6, 18, 44, 18], [0, 22, 52, 14], [6, 22, 62, 16], [12, 16, 74, 22]].map(([dy, dx1, ey, dx2]) => `<path d="M${50 + s * 10} ${54 + dy}Q${50 + s * (18 + dx1)} ${40 + dy} ${50 + s * (24 + dx1)} ${ey}L${50 + s * (30 + dx2)} ${ey + 10}" fill="none" ${S}/>`).join('')).join('')}
    <ellipse cx="50" cy="60" rx="18" ry="20" fill="#4b3f6b" ${S}/>
    <circle cx="50" cy="40" r="12" fill="#5b4f7d" ${S}/>
    ${eye(45, 39, 4)}${eye(55, 39, 4)}${smile(50, 46, 4)}
    <circle cx="44" cy="62" r="3" fill="#8b7fb8"/><circle cx="56" cy="66" r="3" fill="#8b7fb8"/>`,
  // مِغْزَلٌ: عصا خشبية بقرص ملفوف عليها الصوف وخيط إلى كبة
  spindle: () => `<path d="M40 8L40 92" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M40 8L40 92" stroke="#d9a35a" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M40 22Q56 36 54 54Q40 60 26 54Q24 36 40 22Z" fill="#f4e3c3" ${S}/>
    <path d="M30 40Q40 36 50 40M28 47Q40 43 52 47" fill="none" stroke="#c9b48a" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="40" cy="70" rx="18" ry="6" fill="#a8613a" ${S}/>
    <path d="M44 22Q66 14 74 52" fill="none" stroke="#e8834a" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="76" cy="68" r="16" fill="#e8834a" ${S}/><path d="M64 60Q76 66 88 60M62 70Q76 76 90 70M68 80Q78 70 86 56" fill="none" stroke="#b85a2a" stroke-width="2" stroke-linecap="round"/>`,
  // نَاظُوْرٌ: منظار نحاسي ممدود
  spyglass: () => `<g transform="rotate(-28 50 50)"><rect x="6" y="42" width="24" height="16" rx="3" fill="#8a5a3b" ${S}/>
    <rect x="28" y="38" width="28" height="24" rx="3" fill="#f2c14e" ${S}/>
    <rect x="54" y="34" width="30" height="32" rx="3" fill="#e7a51b" ${S}/>
    <rect x="82" y="30" width="10" height="40" rx="3" fill="#c98a1b" ${S}/>
    <ellipse cx="92" cy="50" rx="3" ry="16" fill="#9bd3f0" ${S}/>
    <path d="M32 44H52M58 40H80" stroke="#fff3c4" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="6" cy="50" rx="2" ry="6" fill="#9bd3f0" ${S}/></g>`,
  // مُرَبَّعٌ
  square: () => `<rect x="18" y="18" width="64" height="64" rx="3" fill="#3aa0e0" ${S}/><path d="M26 28V40M26 28H38" fill="none" stroke="#9bd3f0" stroke-width="3" stroke-linecap="round"/>`,
  // سِنْجَابٌ بذيل كبير يحمل جوزة
  squirrel: () => `<path d="M54 84Q90 86 88 50Q86 18 66 14Q50 14 54 30Q72 30 72 52Q72 70 54 72Z" fill="#c8794a" ${S}/>
    <path d="M62 22Q74 28 78 46" fill="none" stroke="#e8a56a" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="40" cy="70" rx="18" ry="20" fill="#d98c55" ${S}/><ellipse cx="38" cy="74" rx="10" ry="13" fill="#f4d3a8"/>
    <rect x="26" y="86" width="12" height="7" rx="3.5" fill="#c8794a" ${S}/><rect x="44" y="86" width="12" height="7" rx="3.5" fill="#c8794a" ${S}/>
    <path d="M24 30L22 16L32 26Z M42 26L46 14L50 28Z" fill="#c8794a" ${S}/>
    <circle cx="36" cy="38" r="15" fill="#d98c55" ${S}/>
    ${eye(31, 36, 3.6)}${eye(42, 36, 3.6)}<circle cx="36" cy="44" r="2" fill="${K}"/>${smile(36, 47, 3.5)}
    <ellipse cx="34" cy="62" rx="7" ry="6" fill="#8a5a3b" ${S}/><path d="M28 60Q34 54 40 60" fill="#5a3a22" ${S}/>`,
  // مَلْعَبٌ: ملعب كرة قدم بمدرجات
  stadium: () => `<ellipse cx="50" cy="52" rx="44" ry="38" fill="#e5484d" ${S}/>
    <ellipse cx="50" cy="52" rx="36" ry="30" fill="#f2c14e" ${S}/>
    <rect x="22" y="30" width="56" height="44" rx="3" fill="#5cb85c" ${S}/>
    <path d="M50 30V74" stroke="#fff" stroke-width="2.2"/><circle cx="50" cy="52" r="8" fill="none" stroke="#fff" stroke-width="2.2"/>
    <rect x="22" y="42" width="9" height="20" fill="none" stroke="#fff" stroke-width="2.2"/><rect x="69" y="42" width="9" height="20" fill="none" stroke="#fff" stroke-width="2.2"/>
    <circle cx="50" cy="52" r="2" fill="#fff"/>`,
  // خَتْمٌ: ختم مطاطي وبصمته الحمراء
  stamp: () => `<ellipse cx="66" cy="84" rx="26" ry="9" fill="none" stroke="#e5484d" stroke-width="3"/><ellipse cx="66" cy="84" rx="17" ry="5" fill="none" stroke="#e5484d" stroke-width="2.4"/>
    <circle cx="36" cy="16" r="10" fill="#8a5a3b" ${S}/>
    <path d="M32 24H40L42 46H30Z" fill="#a8743f" ${S}/>
    <rect x="16" y="46" width="40" height="12" rx="3" fill="#c8794a" ${S}/>
    <rect x="18" y="58" width="36" height="8" rx="2" fill="#e5484d" ${S}/>`,
  // نَجْمٌ
  star: () => `${star(50, 52, 42, 18, '#ffd23f')}<path d="M40 30L44 22" stroke="#fff3a0" stroke-width="3" stroke-linecap="round"/>`,
  // نُجُوْمٌ: ثلاث نجوم
  stars: () => `${star(32, 34, 24, 10, '#ffd23f')}${star(72, 40, 18, 7.5, '#ffb347')}${star(52, 74, 20, 8.5, '#ffe066')}`,
  // عِيْدَانٌ: حزمة عيدان مربوطة بحبل
  sticks: () => `${[-18, -10, -3, 4, 11, 18].map((a, i) => `<g transform="rotate(${a} 50 52)"><rect x="${45 + (i % 2)}" y="8" width="8" height="86" rx="4" fill="${i % 2 ? '#c8794a' : '#d9a35a'}" ${S}/></g>`).join('')}
    <rect x="30" y="48" width="40" height="9" rx="4" fill="#e5484d" ${S}/>
    <path d="M50 57Q44 68 40 66M50 57Q56 68 60 66" fill="none" stroke="#e5484d" stroke-width="3" stroke-linecap="round"/>`,
  // قِصَّةٌ: بنت بحجاب تقرأ كتاب قصة مصورا
  story_reading: () => `<path d="M24 96V72Q24 58 50 58Q76 58 76 72V96Z" fill="#9b8cff" ${S}/>
    <path d="M28 54Q26 20 50 18Q74 20 72 54Q66 64 50 64Q34 64 28 54Z" fill="#ff8fab" ${S}/>
    <ellipse cx="50" cy="40" rx="15" ry="16" fill="#f6c9a6" ${S}/>
    ${eye(44, 40, 3.2)}${eye(56, 40, 3.2)}${smile(50, 48, 4)}${cheeks(50, 46, 10)}
    <path d="M14 70L50 76L86 70L86 96L50 100L14 96Z" fill="#fff" ${S}/><path d="M50 76V100" ${S}/>
    <circle cx="26" cy="82" r="5" fill="#ffd23f"/><path d="M22 94L32 86L42 94Z" fill="#7cd36b"/>
    <path d="M58 92Q66 80 76 88Q72 94 58 92Z" fill="#3aa0e0"/><circle cx="74" cy="82" r="3" fill="#e5484d"/>`,
  // شَارِعٌ: طريق بخطوط بيضاء وأرصفة وعمود إنارة
  street: () => `<rect x="6" y="6" width="88" height="88" rx="6" fill="#bfe6f7" ${S}/>
    <rect x="10" y="26" width="16" height="30" fill="#f2c14e" ${S}/><rect x="74" y="20" width="18" height="36" fill="#ff9f7a" ${S}/>
    <path d="M14 32h4v4h-4zM20 32h4v4h-4zM14 42h4v4h-4zM78 26h4v4h-4zM84 26h4v4h-4zM78 36h4v4h-4z" fill="#fff"/>
    <path d="M8 56H92V92H8Z" fill="#9be08a" stroke="none"/>
    <path d="M44 56H56L84 92H16Z" fill="#6b6f78" ${S}/>
    <path d="M49 60h2v6h-2zM48.5 70h3v8h-3zM48 82h4v9h-4z" fill="#fff"/>
    <path d="M6 56H94" ${S}/>
    <path d="M30 92V40Q30 34 36 34" fill="none" ${S}/><circle cx="38" cy="36" r="4" fill="#ffd23f" ${S}/>`,
  // سُكَّرٌ: سكرية مليئة بالسكر وملعقة ومكعبات
  sugar: () => `<path d="M20 44Q32 30 50 34Q68 30 80 44Z" fill="#fff" ${S}/>
    ${[[34, 40], [46, 38], [58, 39], [66, 42], [40, 43], [52, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#c9d3dc"/>`).join('')}
    <path d="M58 36L80 12" stroke="${K}" stroke-width="6.5" stroke-linecap="round"/><path d="M58 36L80 12" stroke="#c9d3dc" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M16 44H84Q84 76 50 78Q16 76 16 44Z" fill="#3aa0e0" ${S}/>
    <path d="M24 54Q50 62 76 54" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M38 78H62L60 86H40Z" fill="#2b80b8" ${S}/>
    ${[[4, 80], [78, 80]].map(([x, y]) => `<path d="M${x} ${y}l9 -5l9 5l-9 5z" fill="#fff" ${S}/><path d="M${x} ${y}v10l9 5v-10z" fill="#eef2f6" ${S}/><path d="M${x + 9} ${y + 5}v10l9 -5v-10z" fill="#dfe6ee" ${S}/>`).join('')}`,
  // شَمْسٌ مبتسمة بأشعة
  sun: () => `${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${(50 + 30 * Math.cos(a)).toFixed(1)} ${(50 + 30 * Math.sin(a)).toFixed(1)}L${(50 + 43 * Math.cos(a)).toFixed(1)} ${(50 + 43 * Math.sin(a)).toFixed(1)}" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M${(50 + 30 * Math.cos(a)).toFixed(1)} ${(50 + 30 * Math.sin(a)).toFixed(1)}L${(50 + 43 * Math.cos(a)).toFixed(1)} ${(50 + 43 * Math.sin(a)).toFixed(1)}" stroke="#ffb020" stroke-width="3.6" stroke-linecap="round"/>`; }).join('')}
    <circle cx="50" cy="50" r="25" fill="#ffd23f" ${S}/>${eye(42, 46, 3.8)}${eye(58, 46, 3.8)}${smile(50, 56, 7)}${cheeks(50, 56, 14)}`,
  // خَيَّاطٌ: رجل خلف ماكينة خياطة وشريط القياس على كتفيه
  tailor: () => `<path d="M30 70V56Q30 46 50 46Q70 46 70 56V70Z" fill="#3aa0e0" ${S}/>
    <path d="M38 48Q36 60 34 70M62 48Q64 60 66 70" fill="none" stroke="#f2c14e" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="30" r="14" fill="#f6c9a6" ${S}/><path d="M36 28Q36 14 50 15Q64 14 64 28Q58 21 50 21Q42 21 36 28Z" fill="#3b2a20" ${S}/>
    ${eye(45, 31, 3)}${eye(55, 31, 3)}<path d="M44 38Q50 42 56 38" fill="#5a3a22" ${S}/>
    <rect x="10" y="84" width="80" height="10" rx="3" fill="#a8743f" ${S}/>
    <rect x="16" y="76" width="68" height="9" rx="3" fill="#f4e3c3" ${S}/>
    <path d="M66 76V58Q66 52 60 52H26Q20 52 20 58V68H32V62H58V76Z" fill="#fff" ${S}/>
    <rect x="22" y="64" width="12" height="8" rx="2" fill="#fff" ${S}/><path d="M28 72V77" ${S}/>
    <circle cx="70" cy="62" r="6" fill="#9aa9b8" ${S}/>
    <path d="M36 77Q48 70 62 77Z" fill="#ff8fab" ${S}/>`,
  // شَايٌ: استكان عراقي بصحن وإبريق
  tea: () => `<path d="M58 22Q70 18 82 22L84 44Q70 48 56 44Z" fill="#e5484d" ${S}/>
    <path d="M50 46Q48 74 70 76Q92 74 90 46Z" fill="#f2c14e" ${S}/>
    <path d="M90 52Q100 56 94 66Q90 70 88 66" fill="none" ${S}/><path d="M50 52Q40 44 36 34" fill="none" stroke="${K}" stroke-width="6.5" stroke-linecap="round"/><path d="M50 52Q40 44 36 34" fill="none" stroke="#f2c14e" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="70" cy="20" r="3.5" fill="#e5484d" ${S}/>
    <ellipse cx="34" cy="88" rx="26" ry="6" fill="#fff" ${S}/>
    <path d="M22 54Q26 62 24 70Q22 80 28 86H40Q46 80 44 70Q42 62 46 54Z" fill="#b8501f" ${S}/>
    <path d="M22 54H46" ${S}/><path d="M26 58Q28 64 26 70" fill="none" stroke="#e8834a" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M30 46Q26 40 30 34M38 46Q34 40 38 34" fill="none" stroke="#c9d3dc" stroke-width="2.4" stroke-linecap="round"/>`,
  // مِحْرَارٌ زجاجي بخزان أحمر وتدريجات
  thermometer: () => `<rect x="38" y="6" width="24" height="70" rx="12" fill="#fff" ${S}/>
    <rect x="46" y="30" width="8" height="52" rx="4" fill="#e5484d"/>
    <circle cx="50" cy="82" r="13" fill="#e5484d" ${S}/><circle cx="46" cy="78" r="3" fill="#ff9a9a"/>
    ${[18, 26, 34, 42, 50, 58].map((y, i) => `<path d="M62 ${y}h${i % 2 ? 6 : 10}" ${S}/>`).join('')}
    <path d="M44 14V22" stroke="#d6e4ee" stroke-width="2.4" stroke-linecap="round"/>`,
  // نُمُوْرٌ: رأسا نمرين برتقاليين مخططين
  tigers: () => `${[[28, 40, 20], [70, 62, 22]].map(([x, y, r]) => `<circle cx="${x - r * 0.7}" cy="${y - r * 0.75}" r="${r * 0.3}" fill="#ff9f1c" ${S}/><circle cx="${x + r * 0.7}" cy="${y - r * 0.75}" r="${r * 0.3}" fill="#ff9f1c" ${S}/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#ff9f1c" ${S}/>
    <path d="M${x - 4} ${y - r + 1}l4 7l4 -7M${x - r + 1} ${y - 3}h7M${x - r + 1} ${y + 4}h6M${x + r - 1} ${y - 3}h-7M${x + r - 1} ${y + 4}h-6" fill="none" stroke="${K}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="${x}" cy="${y + r * 0.42}" rx="${r * 0.5}" ry="${r * 0.36}" fill="#fff" ${S}/>
    ${eye(x - r * 0.35, y - r * 0.12, r * 0.18)}${eye(x + r * 0.35, y - r * 0.12, r * 0.18)}
    <path d="M${x - 3} ${y + r * 0.26}h6l-3 3z" fill="${K}" ${S}/>${smile(x, y + r * 0.48, r * 0.2)}`).join('')}`,
  // لِسَانٌ: وجه يُخرج لسانه الوردي
  tongue: () => `<circle cx="50" cy="46" r="38" fill="#f6c9a6" ${S}/>
    <path d="M24 26Q26 8 50 8Q74 8 76 26Q64 16 50 18Q36 16 24 26Z" fill="#3b2a20" ${S}/>
    ${eye(36, 38, 5)}${eye(64, 38, 5)}${cheeks(50, 52, 24)}
    <path d="M30 58Q50 66 70 58Q66 74 50 74Q34 74 30 58Z" fill="#7a2a2a" ${S}/>
    <path d="M38 66Q36 92 50 94Q64 92 62 66Z" fill="#ff7a9a" ${S}/><path d="M50 70V84" stroke="#d94a6a" stroke-width="2.4" stroke-linecap="round"/>`,
  // ضِرْسٌ أبيض مبتسم
  tooth: () => `<path d="M22 22Q30 8 50 18Q70 8 78 22Q86 40 78 58Q74 70 72 88Q70 94 64 92Q60 78 56 70Q50 64 44 70Q40 78 36 92Q30 94 28 88Q26 70 22 58Q14 40 22 22Z" fill="#fff" ${S}/>
    <path d="M28 28Q32 20 40 20" fill="none" stroke="#d6e4ee" stroke-width="3" stroke-linecap="round"/>
    ${eye(40, 40, 4.6)}${eye(60, 40, 4.6)}${smile(50, 50, 7)}${cheeks(50, 52, 18)}`,
  // مَعْجُوْنٌ: أنبوب معجون أسنان وفرشاة عليها المعجون
  toothpaste: () => `<path d="M8 22H44L60 34V46L44 58H8Z" fill="#fff" ${S}/><path d="M8 22L4 26V54L8 58" fill="#3aa0e0" ${S}/>
    <path d="M14 34H40M14 44H34" stroke="#3aa0e0" stroke-width="4" stroke-linecap="round"/>
    <rect x="60" y="33" width="10" height="14" rx="2" fill="#e5484d" ${S}/>
    <rect x="10" y="80" width="76" height="8" rx="4" fill="#62d2a2" ${S}/>
    ${[58, 64, 70, 76, 82].map((x) => `<rect x="${x - 2}" y="70" width="4" height="10" rx="1" fill="#fff" ${S}/>`).join('')}
    <path d="M56 70Q54 62 62 62Q66 56 72 60Q80 56 84 62Q90 64 88 70Z" fill="#9bd3f0" ${S}/><path d="M62 66Q70 62 80 66" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  // شُعْلَةٌ ومِشْعَلٌ: مقبض ذهبي فوقه لهب
  torch: () => `<path d="M50 6Q30 22 34 38Q28 30 30 24Q20 36 26 50Q34 60 50 60Q66 60 74 50Q80 36 70 24Q72 30 66 38Q70 22 50 6Z" fill="#ff7a1c" ${S}/>
    <path d="M50 24Q40 36 42 46Q44 54 50 54Q56 54 58 46Q60 36 50 24Z" fill="#ffd23f" ${S}/>
    <path d="M28 56H72L66 64H34Z" fill="#c98a1b" ${S}/>
    <path d="M36 64H64L54 94H46Z" fill="#f2c14e" ${S}/><path d="M42 72H58" stroke="#c98a1b" stroke-width="2.4" stroke-linecap="round"/>`,
  // لُعْبَةٌ: قطار ألعاب خشبي ملوّن بحبل سحب
  toy_train: () => `<rect x="54" y="40" width="34" height="34" rx="3" fill="#e5484d" ${S}/><rect x="60" y="46" width="14" height="12" rx="2" fill="#9bd3f0" ${S}/>
    <rect x="50" y="34" width="42" height="8" rx="3" fill="#3aa0e0" ${S}/>
    <rect x="28" y="56" width="26" height="18" rx="2" fill="#f2c14e" ${S}/><rect x="36" y="44" width="10" height="12" rx="2" fill="#62d2a2" ${S}/><circle cx="41" cy="40" r="4" fill="#9b8cff" ${S}/>
    <rect x="8" y="56" width="18" height="18" rx="2" fill="#62d2a2" ${S}/><path d="M12 56L17 46L22 56Z" fill="#ff8fab" ${S}/>
    <path d="M26 66H28" ${S}/>
    ${[17, 41, 62, 80].map((x) => `<circle cx="${x}" cy="78" r="7" fill="#3a3a3a" ${S}/><circle cx="${x}" cy="78" r="2.4" fill="#f2c14e"/>`).join('')}
    <path d="M8 64Q2 78 6 92" fill="none" stroke="#e5484d" stroke-width="2.4" stroke-linecap="round"/>`,
  // قِطَارٌ: قاطرة وعربة على السكة
  train: () => `<path d="M4 90H96" ${S}/>${[10, 22, 34, 46, 58, 70, 82, 94].map((x) => `<path d="M${x - 2} 86V94" stroke="#8a5a3b" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <rect x="6" y="46" width="36" height="32" rx="3" fill="#3aa0e0" ${S}/><rect x="11" y="52" width="10" height="10" rx="2" fill="#fff" ${S}/><rect x="26" y="52" width="10" height="10" rx="2" fill="#fff" ${S}/>
    <rect x="48" y="34" width="22" height="44" rx="3" fill="#e5484d" ${S}/><rect x="53" y="40" width="12" height="12" rx="2" fill="#9bd3f0" ${S}/>
    <path d="M70 52H86Q92 52 92 60V78H70Z" fill="#e5484d" ${S}/><rect x="76" y="38" width="8" height="14" rx="2" fill="#3a3a3a" ${S}/>
    <circle cx="82" cy="28" r="5" fill="#d6e4ee" ${S}/><circle cx="72" cy="20" r="6" fill="#d6e4ee" ${S}/>
    <path d="M42 70H48" ${S}/>${[16, 32, 56, 82].map((x) => `<circle cx="${x}" cy="80" r="6" fill="#3a3a3a" ${S}/>`).join('')}`,
  // جَذْرٌ: شجرة وجذورها تحت التراب
  tree_roots: () => `<rect x="6" y="52" width="88" height="42" rx="4" fill="#c8945a" ${S}/>
    ${[[20, 66], [70, 84], [84, 62], [30, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#a8743f"/>`).join('')}
    <path d="M50 54Q48 70 36 76Q24 80 16 90M50 54Q52 72 64 78Q76 82 84 90M50 60Q50 76 48 90M42 66Q30 64 22 70M58 66Q70 64 80 70" fill="none" stroke="#7a4a2a" stroke-width="4.2" stroke-linecap="round"/>
    <rect x="44" y="30" width="12" height="26" rx="3" fill="#a8743f" ${S}/>
    <circle cx="50" cy="24" r="18" fill="#5cb85c" ${S}/><circle cx="34" cy="32" r="10" fill="#5cb85c" ${S}/><circle cx="66" cy="32" r="10" fill="#5cb85c" ${S}/><circle cx="44" cy="16" r="4" fill="#8ad48a"/>`,
  // أَشْجَارٌ: ثلاث أشجار
  trees: () => `<path d="M6 92H94" ${S}/>${tree(22, 92, 0.8, '#7cd36b')}${tree(78, 92, 0.85, '#3fa34d')}${tree(50, 92, 1.12, '#5cb85c')}`,
  // مُثَلَّثٌ
  triangle: () => `<path d="M50 12L90 84H10Z" fill="#ff9f1c" ${S}/><path d="M48 26L28 62" stroke="#ffd08a" stroke-width="3" stroke-linecap="round"/>`,
  // أَزْهَارٌ: ثلاث زهرات توليب ملونة
  tulips: () => `${[[26, 40, '#e5484d'], [50, 26, '#ffd23f'], [74, 40, '#ff8fab']].map(([x, y, c]) => `<path d="M${x} ${y + 16}Q${x + 2} ${y + 40} ${50} 92" fill="none" stroke="#3fa34d" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M${x - 12} ${y - 10}L${x - 6} ${y - 2}L${x} ${y - 12}L${x + 6} ${y - 2}L${x + 12} ${y - 10}Q${x + 14} ${y + 16} ${x} ${y + 16}Q${x - 14} ${y + 16} ${x - 12} ${y - 10}Z" fill="${c}" ${S}/>`).join('')}
    <path d="M50 92Q34 80 36 66Q46 74 50 92Z" fill="#7cd36b" ${S}/><path d="M50 92Q66 80 64 66Q54 74 50 92Z" fill="#5cb85c" ${S}/>`,
  // سُلَحْفَاةٌ خضراء بصدفة منقوشة
  turtle: () => `<ellipse cx="82" cy="60" rx="12" ry="11" fill="#9ad66b" ${S}/>${eye(84, 56, 3.6)}${smile(86, 64, 3.5)}
    ${[[24, 74], [40, 78], [60, 78], [76, 74]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="9" fill="#9ad66b" ${S}/>`).join('')}
    <path d="M10 66L4 70L12 72Z" fill="#9ad66b" ${S}/>
    <path d="M12 70Q12 30 48 28Q78 30 78 70Z" fill="#4f9a3a" ${S}/>
    <path d="M36 44L48 38L60 44L58 56L38 56Z" fill="#7cc05a" ${S}/>
    <path d="M36 44L22 50M60 44L72 52M38 56L26 68M58 56L68 68M48 38V30" fill="none" ${S}/>
    <path d="M12 70H78" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M14 70H76" stroke="#f2c14e" stroke-width="2.4" stroke-linecap="round"/>`,
  // مُذِيْعٌ: رجل ببدلة وربطة عنق خلف مكتب الأخبار مع لاقط صوت
  tv_presenter: () => `<rect x="6" y="6" width="88" height="66" rx="5" fill="#3a5a7a" ${S}/>
    <rect x="12" y="12" width="76" height="54" rx="3" fill="#9bd3f0" stroke="none"/>
    <path d="M24 66V56Q24 46 50 46Q76 46 76 56V66Z" fill="#3a3a5a" ${S}/>
    <path d="M42 46L50 58L58 46Z" fill="#fff" ${S}/><path d="M50 50L47 62L50 66L53 62Z" fill="#e5484d" ${S}/>
    <circle cx="50" cy="30" r="13" fill="#f6c9a6" ${S}/><path d="M37 28Q37 14 50 16Q63 14 63 28Q58 21 50 22Q42 21 37 28Z" fill="#3b2a20" ${S}/>
    ${eye(45, 31, 3)}${eye(55, 31, 3)}${smile(50, 37, 4)}
    <path d="M10 66H90L84 94H16Z" fill="#c8794a" ${S}/><path d="M30 80H70" stroke="#e8a56a" stroke-width="3" stroke-linecap="round"/>
    <path d="M62 66L68 54" ${S}/><rect x="64" y="46" width="8" height="10" rx="4" fill="#3a3a3a" ${S}/>
    <circle cx="82" cy="18" r="3" fill="#e5484d"/>`,
  // بُرْكَانٌ ينفث الحمم والدخان
  volcano: () => `<circle cx="38" cy="18" r="8" fill="#9aa9b8" ${S}/><circle cx="52" cy="12" r="9" fill="#b6c2ce" ${S}/><circle cx="66" cy="18" r="7" fill="#9aa9b8" ${S}/>
    <path d="M42 38Q36 26 44 20M58 38Q64 26 56 20" fill="none" stroke="#ff7a1c" stroke-width="5" stroke-linecap="round"/>
    <path d="M6 92L36 40H64L94 92Z" fill="#8a5a3b" ${S}/>
    <path d="M36 40Q42 46 50 42Q58 46 64 40L66 44Q60 56 62 66Q54 60 54 50Q48 58 44 70Q42 56 36 48Z" fill="#ff7a1c" ${S}/>
    <path d="M36 40H64" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 78L30 70M72 70L80 80" stroke="#6a4028" stroke-width="2.6" stroke-linecap="round"/>`,
  // مَصَايِفُ: شلال بين الصخور والأشجار
  waterfall: () => `<rect x="6" y="6" width="88" height="88" rx="6" fill="#bfe6f7" ${S}/>
    <path d="M6 30L26 18L40 28V74H6Z" fill="#a8743f" ${S}/><path d="M94 26L74 16L60 28V74H94Z" fill="#a8743f" ${S}/>
    <rect x="38" y="26" width="24" height="54" fill="#5ab8ec" ${S}/>
    <path d="M44 32V70M50 30V74M56 32V68" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M6 74Q30 70 50 76Q70 70 94 74V88Q94 94 88 94H12Q6 94 6 88Z" fill="#3aa0e0" ${S}/>
    <path d="M34 80Q42 74 50 80Q58 74 66 80" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="16" cy="26" r="9" fill="#5cb85c" ${S}/><circle cx="84" cy="22" r="9" fill="#3fa34d" ${S}/>`,
  // حُوْتٌ أزرق مبتسم ينفث الماء
  whale: () => `<path d="M50 26Q46 14 38 12M50 26Q50 12 50 8M50 26Q54 14 62 12" fill="none" stroke="#5ab8ec" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M10 60Q10 30 48 30Q78 30 84 54Q86 60 90 52Q92 42 98 40Q96 56 92 64Q96 72 98 82Q88 78 84 70Q72 84 46 84Q10 84 10 60Z" fill="#3a8fd0" ${S}/>
    <path d="M12 64Q28 78 54 76Q72 74 80 66Q70 84 46 84Q18 84 12 64Z" fill="#bfe6f7" ${S}/>
    ${eye(30, 52, 4.4)}<path d="M14 64Q24 68 34 66" fill="none" ${S}/>
    <path d="M48 70Q56 80 50 88Q46 80 40 76Z" fill="#2b74b0" ${S}/>`,
  // قَمْحٌ: ثلاث سنابل قمح ذهبية
  wheat: () => `${[[-20], [0], [20]].map(([a]) => `<g transform="rotate(${a} 50 94)"><path d="M50 94V20" stroke="#c98a1b" stroke-width="3" stroke-linecap="round"/>
    ${[22, 32, 42, 52].map((y) => `<ellipse cx="44" cy="${y + 4}" rx="4" ry="7" transform="rotate(-30 44 ${y + 4})" fill="#f2c14e" ${S}/><ellipse cx="56" cy="${y + 4}" rx="4" ry="7" transform="rotate(30 56 ${y + 4})" fill="#f2c14e" ${S}/>`).join('')}
    <ellipse cx="50" cy="16" rx="3.5" ry="7" fill="#f2c14e" ${S}/><path d="M50 9V2" stroke="#c98a1b" stroke-width="2" stroke-linecap="round"/></g>`).join('')}`,
  // صَافِرَةٌ: صفارة الحكم بحبل
  whistle: () => `<path d="M30 36Q14 20 22 10Q34 4 44 18" fill="none" stroke="#e5484d" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="40" cy="62" r="24" fill="#c9d3dc" ${S}/>
    <path d="M40 38H86Q92 38 92 46V52Q92 58 86 58H60Z" fill="#c9d3dc" ${S}/>
    <rect x="52" y="34" width="12" height="7" rx="2" fill="#9aa9b8" ${S}/>
    <circle cx="40" cy="62" r="9" fill="#9aa9b8" ${S}/>
    <circle cx="44" cy="42" r="5" fill="none" ${S}/>
    <path d="M24 56Q26 46 34 44" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  // شُبَّاكٌ: نافذة بإطار خشبي وستائر وسماء
  window: () => `<rect x="12" y="10" width="76" height="76" rx="4" fill="#c8794a" ${S}/>
    <rect x="20" y="18" width="60" height="60" fill="#bfe6f7" ${S}/>
    <circle cx="66" cy="32" r="7" fill="#ffd23f"/><path d="M26 44Q26 38 32 38Q34 32 40 36Q46 34 46 42Q50 46 44 48H30Q24 48 26 44Z" fill="#fff"/>
    <path d="M50 18V78M20 48H80" stroke="#c8794a" stroke-width="5"/><path d="M50 18V78M20 48H80" fill="none" ${S}/>
    <path d="M20 18Q30 18 34 18Q26 40 30 78H20Z" fill="#ff8fab" ${S}/><path d="M80 18H66Q74 40 70 78H80Z" fill="#ff8fab" ${S}/>
    <rect x="6" y="84" width="88" height="8" rx="3" fill="#a8613a" ${S}/>`,
  // ذِئْبٌ رمادي بأذنين مدببتين
  wolf: () => `<path d="M20 40L16 8L42 26Z" fill="#7d8a99" ${S}/><path d="M80 40L84 8L58 26Z" fill="#7d8a99" ${S}/>
    <path d="M23 34L21 18L34 28Z M77 34L79 18L66 28Z" fill="#f7c0c8"/>
    <path d="M14 46Q14 22 50 22Q86 22 86 46Q90 62 80 70L72 66Q66 88 50 92Q34 88 28 66L20 70Q10 62 14 46Z" fill="#9aa9b8" ${S}/>
    <path d="M34 60Q38 50 50 50Q62 50 66 60Q66 86 50 90Q34 86 34 60Z" fill="#eef2f6" ${S}/>
    ${eye(36, 44, 5)}${eye(64, 44, 5)}
    <ellipse cx="50" cy="64" rx="6" ry="4.4" fill="${K}"/><path d="M50 68V74M42 74Q50 80 58 74" fill="none" ${S}/>`,
  // خَشَبٌ: كومة جذوع خشب بحلقات
  wood_logs: () => `${[[30, 74], [70, 74], [50, 44]].map(([x, y]) => `<rect x="${x - 26}" y="${y - 18}" width="34" height="36" rx="4" fill="#a8613a" ${S}/><circle cx="${x + 8}" cy="${y}" r="18" fill="#e8b878" ${S}/><circle cx="${x + 8}" cy="${y}" r="11" fill="none" stroke="#c98a4a" stroke-width="2.2"/><circle cx="${x + 8}" cy="${y}" r="4.5" fill="none" stroke="#c98a4a" stroke-width="2.2"/><path d="M${x - 20} ${y - 6}h14M${x - 18} ${y + 6}h10" stroke="#7a4a2a" stroke-width="2.2" stroke-linecap="round"/>`).join('')}`,
  // دُوْدٌ: ثلاث ديدان وردية مبتسمة
  worms: () => `<rect x="6" y="80" width="88" height="14" rx="5" fill="#c8945a" ${S}/>
    ${[[14, 34, '#ff9ab0'], [40, 66, '#f7a8b8'], [56, 22, '#ff8fab']].map(([x, y, c]) => `<path d="M${x} ${y + 10}Q${x + 6} ${y} ${x + 12} ${y + 10}T${x + 24} ${y + 10}T${x + 32} ${y + 6}" fill="none" stroke="${K}" stroke-width="11" stroke-linecap="round"/>
    <path d="M${x} ${y + 10}Q${x + 6} ${y} ${x + 12} ${y + 10}T${x + 24} ${y + 10}T${x + 32} ${y + 6}" fill="none" stroke="${c}" stroke-width="6.4" stroke-linecap="round"/>
    <circle cx="${x + 34}" cy="${y + 4}" r="8" fill="${c}" ${S}/>${eye(x + 32, y + 2, 2.6)}${eye(x + 38, y + 2, 2.6)}<path d="M${x + 32} ${y + 7}Q${x + 35} ${y + 10} ${x + 38} ${y + 7}" fill="none" stroke="${K}" stroke-width="1.8" stroke-linecap="round"/>`).join('')}`,
};
