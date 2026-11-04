// english-1 — رسوم أصلية لكتاب «English for Iraq — 1st Primary»، مربع 100×100، بأسلوب المكتبة نفسه
import { ART } from '../art.js';
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const s2 = `stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 4.2) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x + 0.6}" cy="${y + 0.6}" r="${r * 0.55}" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 0.8}" r="${r * 0.2}" fill="#fff"/></g>`;
const dot = (x, y, r = 2.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/>`;
const smile = (x, y, w = 5) => `<path d="M${x - w} ${y}Q${x} ${y + w * 0.9} ${x + w} ${y}" fill="none" ${S}/>`;
const cheeks = (x1, x2, y) => `<circle cx="${x1}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".75"/><circle cx="${x2}" cy="${y}" r="2.6" fill="#f7a8b8" opacity=".75"/>`;
const g = (k, x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})">${ART[k] ? ART[k]() : ''}</g>`;
const COL = { red: '#e5484d', blue: '#3a7bd5', yellow: '#ffd43b', orange: '#ff922b', green: '#40c057', pink: '#f783ac', black: '#343a40', white: '#ffffff', brown: '#a0673a', grey: '#adb5bd' };

// وجه إنسان بسيط داخل المربع (للعائلة)
const faceBase = (skin = '#f6c9a6') => `<circle cx="50" cy="44" r="22" fill="${skin}" ${S}/>${eye(42, 44, 3.6)}${eye(58, 44, 3.6)}${smile(50, 53, 6)}${cheeks(36, 64, 52)}`;
const shirt = (c) => `<path d="M22 96Q22 72 50 70Q78 72 78 96Z" fill="${c}" ${S}/>`;
const hijab = (c) => `<path d="M24 50Q22 18 50 16Q78 18 76 50Q78 74 66 80H34Q22 74 24 50Z" fill="${c}" ${S}/><path d="M30 92Q28 76 34 72H66Q72 76 70 92Z" fill="${c}" ${S}/>`;

const car = (c, taxi) => `<path d="M10 66V56Q12 48 22 47L32 32Q36 28 44 28H64Q72 28 76 34L84 47Q92 49 92 58V66Z" fill="${c}" ${S}/>
  <path d="M36 34H50V46H28Z" fill="#cfe9f7" ${S}/><path d="M55 34H66L74 46H55Z" fill="#cfe9f7" ${S}/>
  ${taxi ? `<rect x="42" y="20" width="16" height="8" rx="2" fill="#fff" ${S}/><path d="M12 58H90" stroke="${K}" stroke-width="2" stroke-dasharray="4 4"/>` : ''}
  <circle cx="28" cy="68" r="10" fill="#495057" ${S}/><circle cx="28" cy="68" r="4" fill="#dee2e6"/><circle cx="74" cy="68" r="10" fill="#495057" ${S}/><circle cx="74" cy="68" r="4" fill="#dee2e6"/>
  <rect x="86" y="52" width="6" height="5" rx="2" fill="#ffe066" ${s2}/>`;
const key = (c) => `<circle cx="28" cy="50" r="17" fill="${c}" ${S}/><circle cx="28" cy="50" r="6" fill="#fff" ${S}/><path d="M44 46H90V54H84V64H76V54H70V62H62V54H44Z" fill="${c}" ${S}/>`;
const jumper = (c) => `<path d="M34 14H66L84 24L96 74L84 78L72 44V90H28V44L16 78L4 74L16 24Z" fill="${c}" ${S}/><path d="M40 14Q50 26 60 14" fill="none" ${S}/><path d="M28 82H72M6 68L16 66M94 68L84 66" stroke="${K}" stroke-width="2" stroke-dasharray="3 3"/>`;
const fishC = (c) => `<path d="M14 50Q34 24 62 34Q76 40 82 50Q76 60 62 66Q34 76 14 50Z" fill="${c}" ${S}/><path d="M82 50L96 36V64Z" fill="${c}" ${S}/><path d="M44 34Q50 24 60 32" fill="${c}" ${S}/>${eye(30, 46, 4.2)}<path d="M50 42Q56 50 50 58" fill="none" ${s2}/>`;
const bus = (c = '#ffd43b') => `<rect x="8" y="22" width="84" height="48" rx="8" fill="${c}" ${S}/><rect x="8" y="56" width="84" height="8" fill="#40c057"/><rect x="8" y="22" width="84" height="48" rx="8" fill="none" ${S}/>
  ${[14, 32, 50].map((x) => `<rect x="${x}" y="30" width="14" height="14" rx="2" fill="#cfe9f7" ${s2}/>`).join('')}<rect x="70" y="30" width="16" height="30" rx="2" fill="#cfe9f7" ${s2}/>
  <circle cx="26" cy="72" r="9" fill="#495057" ${S}/><circle cx="26" cy="72" r="3.5" fill="#dee2e6"/><circle cx="72" cy="72" r="9" fill="#495057" ${S}/><circle cx="72" cy="72" r="3.5" fill="#dee2e6"/>`;
const blob = (c) => `<path d="M50 10Q62 26 78 18Q74 38 92 46Q74 56 82 78Q62 70 52 90Q42 72 22 82Q28 62 8 52Q26 42 18 22Q36 28 50 10Z" fill="${c}" ${S}/>`;

export const ART_EN1 = {
  en_ant: () => `<ellipse cx="22" cy="54" rx="12" ry="11" fill="#f2c94c" ${S}/><ellipse cx="46" cy="56" rx="9" ry="8" fill="#f2c94c" ${S}/><ellipse cx="72" cy="56" rx="16" ry="13" fill="#f2c94c" ${S}/>
    ${[38, 46, 54].map((x, i) => `<path d="M${x} 62L${x - 8 + i * 8} 84" fill="none" ${S}/><path d="M${x} 50L${x - 10 + i * 10} 34" fill="none" ${S}/>`).join('')}
    <path d="M16 45Q10 30 4 28M24 44Q24 28 30 22" fill="none" ${S}/>${eye(18, 52, 3.4)}${smile(20, 60, 4)}`,
  en_bus: () => bus(),
  en_egg: () => `<ellipse cx="50" cy="54" rx="28" ry="36" fill="#fffdf6" ${S}/><ellipse cx="40" cy="38" rx="6" ry="10" fill="#fff" opacity=".9"/><ellipse cx="50" cy="92" rx="24" ry="4" fill="#e9ecef"/>`,
  en_ink: () => `<path d="M30 22H70L78 34V70H22V34Z" fill="#364fc7" ${S}/><rect x="36" y="12" width="28" height="12" rx="3" fill="#212529" ${S}/><rect x="30" y="40" width="40" height="18" rx="3" fill="#fff" ${s2}/><path d="M36 49h28" stroke="#364fc7" stroke-width="4" stroke-linecap="round"/>
    <path d="M14 82Q20 72 34 76Q48 70 60 78Q76 74 86 84Q70 92 50 88Q30 94 14 82Z" fill="#212529" ${s2}/>`,
  en_in: () => `<path d="M14 46L50 34L86 46V84L50 94L14 84Z" fill="#d9a066" ${S}/><path d="M14 46L50 58L86 46M50 58V94" fill="none" ${S}/><path d="M14 46L4 30L38 20L50 34Z" fill="#e8b980" ${S}/><path d="M86 46L96 30L62 20L50 34Z" fill="#e8b980" ${S}/>
    <circle cx="50" cy="46" r="6" fill="#e5484d" ${S}/><path d="M74 6L56 30" stroke="${K}" stroke-width="3" stroke-linecap="round"/><path d="M52 34L54 22L64 28Z" fill="${K}"/>`,
  en_juice: () => `<path d="M24 30L60 20L80 32V88L44 96L24 86Z" fill="#69db7c" ${S}/><path d="M24 30L44 40L80 32M44 40V96" fill="none" ${S}/><path d="M60 22L66 4" stroke="#e5484d" stroke-width="4" stroke-linecap="round"/>
    <circle cx="34" cy="62" r="8" fill="#ff922b" ${s2}/><path d="M34 54q4 -6 8 -4" fill="none" stroke="#2f9e44" stroke-width="2.4"/>${[50, 58, 66].map((y) => `<path d="M52 ${y}h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join('')}`,
  en_jumper: () => jumper('#e5484d'),
  en_kite: () => `<path d="M50 6L82 40L50 70L18 40Z" fill="#ff922b" ${S}/><path d="M50 6L50 70M18 40H82" fill="none" ${s2}/><path d="M50 6L82 40L50 40Z" fill="#69db7c"/><path d="M50 40L18 40L50 70Z" fill="#69db7c"/><path d="M50 6L82 40L50 70L18 40Z" fill="none" ${S}/>
    <path d="M50 70Q40 80 52 86T48 98" fill="none" ${s2}/>${[[44, 80], [56, 90]].map(([x, y]) => `<path d="M${x - 6} ${y - 4}L${x} ${y}L${x - 6} ${y + 4}ZM${x + 6} ${y - 4}L${x} ${y}L${x + 6} ${y + 4}Z" fill="#e5484d" ${s2}/>`).join('')}`,
  en_net: () => `<path d="M58 40L94 10" stroke="#a0673a" stroke-width="6" stroke-linecap="round"/><path d="M58 40L94 10" fill="none" ${s2}/>
    <ellipse cx="38" cy="44" rx="24" ry="14" fill="none" stroke="#e8590c" stroke-width="4"/><path d="M16 48Q24 90 40 92Q52 88 60 48" fill="#fff4e6" fill-opacity=".6" stroke="#e8590c" stroke-width="2"/>
    ${[24, 32, 40, 48].map((x) => `<path d="M${x} 52Q${x + 2} 76 40 90" fill="none" stroke="#e8590c" stroke-width="1.6"/>`).join('')}${[60, 70, 80].map((y) => `<path d="M${18 + (y - 52) / 3} ${y}H${58 - (y - 52) / 3}" stroke="#e8590c" stroke-width="1.6"/>`).join('')}`,
  en_nose: () => `<path d="M46 12Q40 50 26 64Q20 74 30 80Q40 84 50 78Q58 84 70 80Q80 74 72 64Q62 52 58 12" fill="#f6c9a6" ${S}/><ellipse cx="38" cy="72" rx="5" ry="3" fill="${K}"/><ellipse cx="62" cy="72" rx="5" ry="3" fill="${K}"/>`,
  en_orange: () => `<circle cx="50" cy="54" r="34" fill="#ff922b" ${S}/><circle cx="38" cy="42" r="7" fill="#ffc078"/><path d="M50 20q4 -10 14 -10q-2 10 -14 10z" fill="#40c057" ${S}/>${[[60, 60], [44, 66], [64, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#e8590c"/>`).join('')}`,
  en_plane: () => `<path d="M8 52Q8 42 22 42H78Q94 44 94 52Q94 60 78 62H22Q8 62 8 52Z" fill="#e5484d" ${S}/><path d="M44 46L30 14H42L64 46Z" fill="#c92a2a" ${S}/><path d="M44 58L32 86H44L64 58Z" fill="#c92a2a" ${S}/><path d="M12 44L6 26H16L24 42Z" fill="#c92a2a" ${S}/>
    ${[58, 68, 78].map((x) => `<circle cx="${x}" cy="50" r="3.6" fill="#cfe9f7" ${s2}/>`).join('')}`,
  en_pizza: () => `<circle cx="50" cy="52" r="40" fill="#f4a261" ${S}/><circle cx="50" cy="52" r="33" fill="#ffd43b"/>
    ${[[36, 38], [62, 34], [70, 58], [44, 66], [30, 56], [56, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e5484d" ${s2}/>`).join('')}${[[48, 36], [64, 70], [34, 46], [58, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#2f9e44"/>`).join('')}
    <path d="M50 52L90 52M50 52L22 80" fill="none" ${s2}/>`,
  en_question: () => `<path d="M28 34Q28 10 52 10Q76 10 76 32Q76 46 60 52Q54 56 54 66V70H40V62Q40 48 54 42Q62 38 62 32Q62 24 52 24Q42 24 42 34Z" fill="#e5484d" ${S}/><circle cx="47" cy="86" r="9" fill="#e5484d" ${S}/>`,
  en_queen: () => `${hijab('#9775fa')}<circle cx="50" cy="48" r="18" fill="#f6c9a6" ${S}/>${eye(43, 47, 3.2)}${eye(57, 47, 3.2)}${smile(50, 55, 5)}${cheeks(38, 62, 54)}
    <path d="M30 26L34 8L42 20L50 4L58 20L66 8L70 26Z" fill="#ffd43b" ${S}/>${[[34, 10], [50, 6], [66, 10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#e5484d"/>`).join('')}<circle cx="50" cy="82" r="3" fill="#ffd43b" ${s2}/>`,
  en_robot: () => `<rect x="30" y="14" width="40" height="30" rx="6" fill="#74c0fc" ${S}/><path d="M50 14V6" ${S}/><circle cx="50" cy="5" r="3.4" fill="#e5484d" ${S}/>
    <circle cx="41" cy="27" r="5" fill="#fff" ${S}/><circle cx="59" cy="27" r="5" fill="#fff" ${S}/>${dot(41, 27, 2)}${dot(59, 27, 2)}<rect x="40" y="36" width="20" height="4" rx="2" fill="${K}"/>
    <rect x="26" y="46" width="48" height="32" rx="6" fill="#4dabf7" ${S}/><rect x="36" y="52" width="10" height="8" fill="#ffd43b" ${s2}/><rect x="54" y="52" width="10" height="8" fill="#e5484d" ${s2}/><circle cx="50" cy="68" r="4" fill="#69db7c" ${s2}/>
    <path d="M26 54L14 66M74 54L86 66" ${S}/><circle cx="13" cy="68" r="4" fill="#adb5bd" ${S}/><circle cx="87" cy="68" r="4" fill="#adb5bd" ${S}/><rect x="34" y="78" width="10" height="14" fill="#adb5bd" ${S}/><rect x="56" y="78" width="10" height="14" fill="#adb5bd" ${S}/>`,
  en_cake: () => `<rect x="16" y="52" width="68" height="34" rx="6" fill="#f783ac" ${S}/><path d="M16 60Q26 70 34 60Q42 70 50 60Q58 70 66 60Q74 70 84 60" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><rect x="16" y="52" width="68" height="34" rx="6" fill="none" ${S}/>
    ${[30, 44, 58, 72].map((x, i) => `<rect x="${x - 2}" y="34" width="5" height="18" rx="2" fill="${['#4dabf7', '#ffd43b', '#69db7c', '#ff922b'][i]}" ${s2}/><path d="M${x + 0.5} 32q-4 -6 0 -12q4 6 0 12z" fill="#ffa94d"/>`).join('')}<ellipse cx="50" cy="88" rx="40" ry="5" fill="#dee2e6" ${s2}/>`,
  en_taxi: () => car('#ffd43b', true),
  en_tomato: () => `<circle cx="50" cy="56" r="34" fill="#e5484d" ${S}/><circle cx="38" cy="44" r="6" fill="#ff8787"/><path d="M50 24L40 16L48 22L50 12L54 22L62 16Z" fill="#40c057" ${S}/>`,
  en_umbrella: () => `<path d="M8 48Q12 14 50 12Q88 14 92 48Q84 42 76 48Q68 42 58 48Q50 42 42 48Q32 42 24 48Q16 42 8 48Z" fill="#ffd43b" ${S}/><path d="M50 12Q36 28 42 48M50 12Q64 28 58 48M50 12Q22 22 24 48M50 12Q78 22 76 48" fill="none" stroke="#e5484d" stroke-width="5"/><path d="M8 48Q12 14 50 12Q88 14 92 48" fill="none" ${S}/>
    <path d="M50 48V84Q50 94 40 94Q32 94 32 86" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/><path d="M50 12V6" ${S}/>`,
  en_up: () => `<path d="M60 92V30" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M46 36L60 10L74 36Z" fill="${K}" ${S}/>
    <circle cx="28" cy="28" r="10" fill="#f6c9a6" ${S}/><path d="M18 22Q22 12 34 16Q36 22 28 22Z" fill="${K}"/><path d="M28 38V64" stroke="#e5484d" stroke-width="10" stroke-linecap="round"/><path d="M28 42L14 26M28 42L42 28" ${S}/><path d="M28 64L18 82M28 64L38 82" stroke="#3a7bd5" stroke-width="5" stroke-linecap="round"/>`,
  en_van: () => `<path d="M8 70V30Q8 24 14 24H64Q70 24 74 30L88 46Q92 50 92 56V70Z" fill="#3a7bd5" ${S}/><path d="M66 30H70L84 48H66Z" fill="#cfe9f7" ${S}/><rect x="14" y="32" width="44" height="18" rx="2" fill="#e5484d" ${s2}/><path d="M62 30V68" ${s2}/>
    <circle cx="26" cy="72" r="9" fill="#495057" ${S}/><circle cx="26" cy="72" r="3.5" fill="#dee2e6"/><circle cx="74" cy="72" r="9" fill="#495057" ${S}/><circle cx="74" cy="72" r="3.5" fill="#dee2e6"/>`,
  en_violin: () => `<g transform="rotate(-35 50 50)"><path d="M50 30Q36 30 36 42Q36 48 40 50Q32 54 32 66Q32 84 50 84Q68 84 68 66Q68 54 60 50Q64 48 64 42Q64 30 50 30Z" fill="#c8794a" ${S}/><path d="M44 58q-3 4 0 8M56 58q3 4 0 8" fill="none" ${s2}/><rect x="47" y="6" width="6" height="26" fill="#5c3b21" ${S}/><path d="M46 70H54" ${S}/><path d="M48 8V74M52 8V74" stroke="#fff" stroke-width=".8"/></g>
    <path d="M14 30L86 74" stroke="#8a5a3b" stroke-width="3" stroke-linecap="round"/>`,
  en_watch: () => `<rect x="38" y="4" width="24" height="92" rx="8" fill="#e5484d" ${S}/><circle cx="50" cy="50" r="22" fill="#ffd43b" ${S}/><circle cx="50" cy="50" r="16" fill="#fff" ${S}/><path d="M50 50V40M50 50L58 54" ${S}/>${[0, 90, 180, 270].map((a) => `<circle cx="${50 + 12 * Math.cos((a * Math.PI) / 180)}" cy="${50 + 12 * Math.sin((a * Math.PI) / 180)}" r="1.4" fill="${K}"/>`).join('')}`,
  en_xray: () => `<rect x="10" y="8" width="80" height="84" rx="6" fill="#212529" ${S}/><path d="M42 86V62L30 40M46 62L42 30M52 62L54 26M58 62L64 32M62 64L76 50" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>${[[30, 40], [42, 30], [54, 26], [64, 32], [76, 50], [36, 50], [43, 44], [53, 42], [61, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join('')}<path d="M40 86H60" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  en_yoyo: () => `<path d="M62 30Q80 10 88 4" fill="none" ${s2}/><circle cx="44" cy="54" r="34" fill="#e5484d" ${S}/><circle cx="44" cy="54" r="22" fill="#ff8787" ${S}/><circle cx="44" cy="54" r="8" fill="#ffd43b" ${S}/><path d="M44 54L62 30" ${s2}/>`,
  en_zebra: () => `<ellipse cx="54" cy="58" rx="28" ry="16" fill="#fff" ${S}/>${[40, 50, 60, 70].map((x) => `<path d="M${x} 44Q${x - 4} 58 ${x} 72" fill="none" stroke="${K}" stroke-width="4"/>`).join('')}
    ${[34, 46, 64, 76].map((x) => `<rect x="${x - 3}" y="70" width="7" height="22" rx="3" fill="#fff" ${S}/><path d="M${x - 3} 80h7" ${s2}/>`).join('')}<path d="M82 52Q92 56 90 70" fill="none" ${S}/>
    <path d="M30 50L20 22Q18 12 28 12Q36 14 36 24L40 46" fill="#fff" ${S}/><path d="M24 16l6 -8M30 18l8 -6M32 26l8 -4M34 34l8 -2" ${S}/><ellipse cx="18" cy="26" rx="10" ry="8" fill="#fff" ${S}/><ellipse cx="12" cy="28" rx="4" ry="4" fill="#495057"/>${eye(22, 20, 3)}`,
  en_tiger: () => `<ellipse cx="58" cy="62" rx="30" ry="18" fill="#ff922b" ${S}/>${[46, 58, 70].map((x) => `<path d="M${x} 45Q${x - 3} 54 ${x + 2} 60" fill="none" stroke="${K}" stroke-width="3"/>`).join('')}
    ${[38, 52, 66, 78].map((x) => `<rect x="${x - 4}" y="72" width="9" height="18" rx="4" fill="#ff922b" ${S}/>`).join('')}<path d="M88 56Q98 46 94 34" fill="none" stroke="#ff922b" stroke-width="5" stroke-linecap="round"/>
    <circle cx="28" cy="44" r="20" fill="#ff922b" ${S}/><circle cx="14" cy="28" r="6" fill="#ff922b" ${S}/><circle cx="40" cy="28" r="6" fill="#ff922b" ${S}/><ellipse cx="28" cy="52" rx="11" ry="8" fill="#fff" ${s2}/>${eye(21, 42, 3.4)}${eye(35, 42, 3.4)}${dot(28, 49, 2.4)}<path d="M22 34l2 6M28 30v6M34 34l-2 6" ${s2}/>`,
  en_camel: () => `<path d="M28 60Q30 36 44 40Q50 28 58 40Q66 28 74 42Q86 46 84 62Z" fill="#e9c46a" ${S}/>${[34, 46, 66, 78].map((x) => `<rect x="${x - 3}" y="60" width="7" height="30" rx="3" fill="#e9c46a" ${S}/>`).join('')}
    <path d="M30 56Q20 46 20 30L14 24Q10 18 18 16H26Q30 20 28 28Q30 40 38 48" fill="#e9c46a" ${S}/>${eye(20, 22, 2.8)}<path d="M84 54Q92 60 88 70" fill="none" ${S}/>`,
  en_pen: () => `<g transform="rotate(-40 50 50)"><rect x="44" y="6" width="12" height="70" rx="4" fill="#3a7bd5" ${S}/><path d="M44 76L50 94L56 76Z" fill="#e9ecef" ${S}/><rect x="42" y="12" width="4" height="22" rx="2" fill="#adb5bd" ${s2}/><rect x="44" y="6" width="12" height="10" rx="3" fill="#1c3f7a" ${S}/></g>`,
  en_head: () => `<circle cx="50" cy="48" r="32" fill="#f6c9a6" ${S}/><path d="M18 44Q20 12 50 14Q80 12 82 44Q70 28 50 28Q30 28 18 44Z" fill="#5c3b21" ${S}/><ellipse cx="17" cy="52" rx="5" ry="8" fill="#f6c9a6" ${S}/><ellipse cx="83" cy="52" rx="5" ry="8" fill="#f6c9a6" ${S}/>${eye(39, 50)}${eye(61, 50)}${smile(50, 62, 8)}${cheeks(30, 70, 60)}<path d="M32 90Q50 80 68 90" fill="none" ${S}/>`,
  en_eyes: () => `<path d="M8 40Q30 18 46 40Q30 58 8 40Z" fill="#fff" ${S}/><path d="M54 40Q70 18 92 40Q70 58 54 40Z" fill="#fff" ${S}/><circle cx="28" cy="40" r="8" fill="#5c940d" ${S}/><circle cx="72" cy="40" r="8" fill="#5c940d" ${S}/>${dot(28, 40, 3.6)}${dot(72, 40, 3.6)}<circle cx="30" cy="37" r="1.6" fill="#fff"/><circle cx="74" cy="37" r="1.6" fill="#fff"/>
    <path d="M8 28Q28 12 46 26M54 26Q72 12 92 28" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/><path d="M36 80Q50 92 64 80" fill="none" ${S}/>`,
  en_hair: () => `<circle cx="50" cy="56" r="26" fill="#f6c9a6" ${S}/><path d="M22 56Q14 20 50 14Q86 20 78 56Q74 34 60 34Q50 26 40 34Q26 34 22 56Z" fill="#5c3b21" ${S}/>${eye(41, 58, 3.6)}${eye(59, 58, 3.6)}${smile(50, 68, 6)}
    ${[[30, 10], [50, 4], [70, 10]].map(([x, y]) => `<circle cx="${x}" cy="${y + 4}" r="4" fill="#cfe9f7" ${s2}/>`).join('')}`,
  en_dad: () => `${shirt('#7950f2')}${faceBase()}<path d="M28 40Q28 18 50 18Q72 18 72 40Q66 28 50 28Q34 28 28 40Z" fill="#212529" ${S}/><path d="M40 52Q50 48 60 52Q56 56 50 54Q44 56 40 52Z" fill="#212529"/>`,
  en_mum: () => `${hijab('#f783ac')}${faceBase()}`,
  en_sister: () => `${hijab('#ffd43b')}<circle cx="50" cy="46" r="18" fill="#f6c9a6" ${S}/>${eye(43, 46, 3.2)}${eye(57, 46, 3.2)}${smile(50, 54, 5)}${cheeks(38, 62, 53)}<circle cx="64" cy="82" r="5" fill="#4dabf7" ${s2}/>`,
  en_brother: () => `${shirt('#4dabf7')}<circle cx="50" cy="48" r="20" fill="#f6c9a6" ${S}/>${eye(43, 48, 3.4)}${eye(57, 48, 3.4)}${smile(50, 56, 5)}${cheeks(37, 63, 55)}<path d="M30 44Q32 24 50 26Q68 24 70 44Q64 34 54 36Q48 30 42 36Q34 36 30 44Z" fill="#212529" ${S}/>`,
  en_grandma: () => `${hijab('#e9ecef')}${faceBase()}<circle cx="42" cy="44" r="6" fill="none" stroke="#7950f2" stroke-width="2"/><circle cx="58" cy="44" r="6" fill="none" stroke="#7950f2" stroke-width="2"/><path d="M48 44h4" stroke="#7950f2" stroke-width="2"/>`,
  en_grandpa: () => `${shirt('#3a7bd5')}${faceBase()}<path d="M28 40Q26 30 32 28M72 40Q74 30 68 28" fill="none" stroke="#ced4da" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="44" r="6" fill="none" ${s2}/><circle cx="58" cy="44" r="6" fill="none" ${s2}/><path d="M48 44h4" ${s2}/><path d="M40 52Q50 47 60 52Q55 56 50 54Q45 56 40 52Z" fill="#ced4da" ${s2}/>`,
  en_desk: () => `<rect x="8" y="34" width="84" height="12" rx="2" fill="#a0673a" ${S}/><rect x="12" y="46" width="30" height="40" fill="#8a5a3b" ${S}/><path d="M12 60H42M12 74H42" ${s2}/><circle cx="27" cy="54" r="2" fill="${K}"/><circle cx="27" cy="68" r="2" fill="${K}"/><rect x="80" y="46" width="8" height="40" fill="#8a5a3b" ${S}/>`,
  en_bin: () => `<path d="M24 26H76L68 92H32Z" fill="#3a7bd5" ${S}/><rect x="20" y="18" width="60" height="10" rx="4" fill="#1c3f7a" ${S}/><path d="M38 36L40 84M50 36V84M62 36L60 84" stroke="#74c0fc" stroke-width="3" stroke-linecap="round"/>`,
  en_chair: () => `<rect x="28" y="8" width="44" height="40" rx="6" fill="#40c057" ${S}/><rect x="20" y="50" width="60" height="10" rx="3" fill="#2f9e44" ${S}/><path d="M26 60L22 94M74 60L78 94M30 60L34 84M70 60L66 84" fill="none" stroke="#868e96" stroke-width="4" stroke-linecap="round"/>`,
  en_table: () => `<path d="M6 40L30 28H94L70 40Z" fill="#c8794a" ${S}/><rect x="6" y="40" width="64" height="8" fill="#a0673a" ${S}/><path d="M70 40L94 28V36L70 48Z" fill="#8a5a3b" ${S}/><path d="M10 48V90M66 48V90M90 36V76" stroke="#8a5a3b" stroke-width="5" stroke-linecap="round"/>`,
  en_roof: () => `<path d="M6 54L50 14L94 54Z" fill="#3a7bd5" ${S}/><path d="M18 54V90H82V54" fill="#fff3bf" ${S}/><rect x="64" y="20" width="12" height="20" fill="#a0673a" ${S}/><path d="M6 54L50 14L94 54" fill="none" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/>`,
  en_wall: () => `<rect x="6" y="20" width="88" height="66" fill="#f4a261" ${S}/>${[20, 36, 52, 68].map((y, i) => `<path d="M6 ${y + 16}H94" ${s2}/>${[0, 1, 2, 3, 4].map((k) => `<path d="M${(i % 2 ? 14 : 24) + k * 20} ${y}V${y + 16}" ${s2}/>`).join('')}`).join('')}<rect x="6" y="20" width="88" height="66" fill="none" ${S}/>`,
  // ألوان: بقع مرسومة
  ...Object.fromEntries(Object.entries(COL).map(([n, c]) => ['en_c_' + n, () => blob(c)])),
  en_fish_red: () => fishC('#e5484d'),
  en_fish_blue: () => fishC('#4dabf7'),
  en_fish_green: () => fishC('#40c057'),
  en_car_yellow: () => car('#ffd43b'),
  en_car_green: () => car('#40c057'),
  en_taxi_green: () => car('#40c057', true),
  en_key_green: () => key('#40c057'),
  en_key_red: () => key('#e5484d'),
  en_jumper_blue: () => jumper('#3a7bd5'),
  en_jumper_yellow: () => jumper('#ffd43b'),
  // مشاهد صغيرة لجمل الصفحة ٥١ و٧٦
  en_s_antbag: () => `${g('schoolbag', 10, 22, 0.78)}${g('en_ant', 30, 0, 0.55)}`,
  en_s_dogbus: () => `${bus('#ffd43b')}${g('dog', 22, 2, 0.5)}`,
  en_s_goatbus: () => `${bus('#ffd43b')}${g('goat', 22, 0, 0.5)}`,
  en_s_dogcathorse: () => `${g('horse', 4, 20, 0.8)}${g('dog', 26, 4, 0.34)}${g('cat', 50, 4, 0.32)}`,
  en_s_3cats: () => `${g('cat', 0, 30, 0.42)}${g('cat', 30, 18, 0.42)}${g('cat', 60, 30, 0.42)}`,
  en_s_pen: () => `<ellipse cx="50" cy="50" rx="44" ry="30" fill="#e7f5ff" ${s2}/>${g('en_pen', 20, 18, 0.62)}`,
  en_s_penpencil: () => `<ellipse cx="50" cy="50" rx="44" ry="30" fill="#e7f5ff" ${s2}/>${g('en_pen', 8, 20, 0.58)}${g('pencil', 42, 20, 0.58)}`,
};
