// ethics-scenes — مشاهد قصص «التربية الأخلاقية» وصور الأنشطة (رسوم أصلية، 100×100)
import { person, P, at, heart, book, door, board, desk, table, floor, wall } from './ethics-kit.js';
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const S2 = `stroke="${K}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;
const UNI = { shirt: '#fff', vest: '#4263eb', pants: '#3a5a7a', hair: '#5a3420' };
const MO = { kind: 'boy', ...UNI }, ZA = { kind: 'girl', shirt: '#4263eb', hijab: '#ff8fab' }, LA = { kind: 'girl', shirt: '#ff6b6b', hijab: '#ffd8a8', glasses: true };
const SA = { kind: 'girl', shirt: '#4263eb', hijab: '#f783ac' }, YU = { kind: 'boy', shirt: '#ffd43b', pants: '#3a5a7a', hair: '#c98a3e' }, NO = { kind: 'woman', shirt: '#364fc7', hijab: '#91a7ff' };
const TE = { kind: 'woman', shirt: '#e9ecef', hijab: '#a5d8ff', glasses: true };
const MOM = { kind: 'woman', shirt: '#b197fc', hijab: '#f783ac' }, DAD = { kind: 'man', shirt: '#74c0fc', pants: '#495057' };
const room = (c) => wall(c) + floor();
const cls = () => room('#e3fafc') + board(30, 8, 46, 24);
const bubble = (x, y, w = 26, h = 14) => `<path d="M${x} ${y}h${w}a4 4 0 0 1 4 4v${h - 8}a4 4 0 0 1 -4 4h${-w + 8}l-6 6v-6h-2a4 4 0 0 1 -4 -4v${-h + 8}a4 4 0 0 1 4 -4z" fill="#fff" ${S2}/>`;
const bedArt = (x, y, made = true) => `<rect x="${x}" y="${y}" width="44" height="14" rx="3" fill="${made ? '#74c0fc' : '#a5d8ff'}" ${S}/><rect x="${x - 2}" y="${y - 12}" width="6" height="30" rx="2" fill="#c8794a" ${S2}/>${made ? `<rect x="${x + 4}" y="${y - 6}" width="12" height="7" rx="3" fill="#fff" ${S2}/>` : `<path d="M${x + 8} ${y - 4}q10 -8 20 2q8 6 16 -4" fill="#fff" ${S2}/>`}`;
const toy = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#ff6b6b" ${S2}/><rect x="${x + 8}" y="${y - 4}" width="8" height="8" fill="#ffd43b" ${S2}/><path d="M${x + 20} ${y + 4}l5 -9l5 9z" fill="#69db7c" ${S2}/>`;
const paper = (x, y, r = 0) => `<rect x="${x}" y="${y}" width="8" height="6" rx="1" fill="#fff" ${S2} transform="rotate(${r} ${x + 4} ${y + 3})"/>`;
const win = (x, y, w = 30, h = 26) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#a5d8ff" ${S}/><path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" ${S2}/>`;
const tree = (n, x = 50, y = 94) => {
  // جذع وأغصان بعددٍ محدد تماماً (لعبة العدّ: عدد عناصر .branch = n)
  const rows = Math.ceil(n / 2);
  let s = `<path d="M${x - 5} ${y}L${x - 3} ${y - 66}H${x + 3}L${x + 5} ${y}Z" fill="#a8743f" ${S}/>`;
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1, row = Math.floor(i / 2), yy = y - 24 - (rows > 1 ? (row * 42) / (rows - 1) : 20);
    const ex = x + side * (26 + (row % 2) * 8), ey = yy - 12;
    s += `<path d="M${x} ${yy}Q${(x + ex) / 2} ${yy - 2} ${ex} ${ey}" fill="none" stroke="#8a5a3b" stroke-width="3.4" stroke-linecap="round"/><ellipse class="branch" cx="${ex}" cy="${ey - 3}" rx="8" ry="5.5" fill="#69db7c" ${S2} transform="rotate(${side * 25} ${ex} ${ey - 3})"/>`;
  }
  return s;
};
export const ART_ETHICS_SCENES = {
  /* ===== التحية والتعارف (ص ٧–١١) ===== */
  e_s_greet: () => cls() + door(4, 30, 22, 50) + P(4, 30, 0.5, { ...MO, pose: 'knock' }) + P(52, 26, 0.56, { ...TE, pose: 'wave' }) + desk(30, 76, 26) + desk(64, 76, 26),
  e_knock: () => room('#fff4e6') + door(56, 14, 34, 66) + P(14, 22, 0.64, { ...ZA, pose: 'knock' }),
  e_push_door: () => room('#fff4e6') + door(56, 14, 34, 66, true) + P(30, 22, 0.64, { ...ZA, pose: 'both', emo: 'laugh' }),
  e_wave: () => room('#ebfbee') + P(0, 24, 0.6, { kind: 'boy', shirt: '#ffd43b', pose: 'wave' }) + P(42, 24, 0.6, { kind: 'boy', shirt: '#74c0fc', pose: 'wave', emo: 'laugh' }, true),
  e_ignore: () => room('#fff0f6') + P(2, 24, 0.6, { kind: 'girl', shirt: '#ff8787', hijab: '#ffd43b', emo: 'calm' }, true) + P(40, 24, 0.6, { kind: 'girl', shirt: '#91a7ff', hijab: '#69db7c', emo: 'calm' }),
  /* ===== أنا مرتب ومنظم (ص ١٢–١٩) ===== */
  e_s_mess: () => cls() + desk(10, 70, 30) + desk(60, 70, 30) + paper(20, 86, 20) + paper(46, 90, -15) + paper(74, 88, 40) + P(14, 34, 0.42, { kind: 'boy', shirt: '#ffd43b', pose: 'both', emo: 'laugh' }) + P(56, 34, 0.42, { kind: 'girl', shirt: '#ff8fab', hijab: '#69db7c', pose: 'forward', emo: 'laugh' }) + `<circle cx="46" cy="72" r="4" fill="#ff6b6b" ${S2}/>`,
  e_s_answer: () => cls() + P(4, 30, 0.6, { ...YU, pose: 'up', emo: 'laugh' }) + P(54, 30, 0.56, { ...TE, pose: 'point' }, true),
  e_s_zahraa: () => cls() + P(6, 30, 0.6, { ...ZA, pose: 'forward', emo: 'laugh' }) + P(54, 30, 0.56, { ...TE, pose: 'down' }, true),
  e_s_bags: () => cls() + desk(6, 74, 40) + desk(54, 74, 40) + P(4, 34, 0.48, { ...MO, pose: 'hold' }) + P(52, 34, 0.48, { ...ZA, pose: 'hold' }) + `<rect x="18" y="62" width="14" height="12" rx="2" fill="#e5484d" ${S2}/><rect x="66" y="62" width="14" height="12" rx="2" fill="#ffd43b" ${S2}/>`,
  e_room_tidy: () => room('#fff9db') + bedArt(40, 62) + `<rect x="8" y="40" width="22" height="40" rx="2" fill="#e0a36f" ${S}/><path d="M19 40V80" ${S2}/><rect x="12" y="18" width="18" height="14" rx="2" fill="#a5d8ff" ${S2}/>` + book(66, 30, 9) + book(78, 30, 9, '#69db7c'),
  e_room_messy: () => room('#fff9db') + bedArt(40, 62, false) + paper(10, 84, 30) + paper(30, 88, -20) + toy(60, 90) + `<path d="M8 70q8 -6 16 0q-4 8 -16 0z" fill="#b197fc" ${S2}/>` + book(14, 50, 9) + `<path d="M84 30l6 10" ${S}/>`,
  e_line: () => room('#e7f5ff') + P(0, 20, 0.62, { ...TE, pose: 'down' }) + [30, 48, 66].map((x, i) => P(x, 40, 0.42, [MO, ZA, YU][i])).join(''),
  e_crowd: () => room('#fff4e6') + `<rect x="30" y="14" width="44" height="30" rx="3" fill="#e0a36f" ${S}/><rect x="36" y="20" width="32" height="10" fill="#fff" ${S2}/>` + [[4, 36, 'both'], [24, 42, 'up'], [44, 40, 'both'], [62, 44, 'up'], [16, 50, 'down']].map(([x, y, p], i) => P(x, y, 0.42, { kind: i % 2 ? 'girl' : 'boy', shirt: ['#ff6b6b', '#74c0fc', '#ffd43b', '#69db7c', '#b197fc'][i], hijab: '#ffa94d', pose: p, emo: 'angry' })).join(''),
  e_toys_away: () => room('#f3f0ff') + `<rect x="56" y="58" width="36" height="26" rx="3" fill="#c8794a" ${S}/><path d="M56 66H92" ${S2}/>` + toy(62, 52) + P(4, 22, 0.66, { kind: 'boy', shirt: '#69db7c', pose: 'give' }),
  e_make_bed: () => room('#fff9db') + bedArt(8, 66) + P(46, 22, 0.66, { kind: 'boy', shirt: '#ffd43b', pose: 'left', emo: 'laugh' }),
  e_raise_hand: () => room('#e3fafc') + desk(20, 76, 60) + P(20, 18, 0.66, { kind: 'boy', shirt: '#38d9a9', pose: 'up', emo: 'laugh' }),
  e_wake: () => room('#fff3bf') + `<circle cx="82" cy="16" r="9" fill="#ffd43b" ${S2}/>` + `<rect x="8" y="40" width="7" height="46" rx="2" fill="#c8794a" ${S2}/><rect x="12" y="58" width="80" height="20" rx="3" fill="#c8794a" ${S}/><rect x="16" y="48" width="18" height="10" rx="4" fill="#fff" ${S2}/>` + `<circle cx="26" cy="44" r="10" fill="#f6c9a6" ${S}/><path d="M17 40Q18 32 26 33Q34 32 35 40Q30 37 26 37Q21 37 17 40Z" fill="#7a4a2a" ${S2}/><path d="M21 44q2 2 4 0M28 44q2 2 4 0M24 49q2 2 4 0" fill="none" ${S2}/>` + `<path d="M34 50Q60 42 90 50V62H34Z" fill="#74c0fc" ${S}/>` + `<path d="M36 40l-4 -12M40 40l6 -12" stroke="#ffa94d" stroke-width="5" stroke-linecap="round"/>`,
  e_brush: () => room('#e7f5ff') + `<path d="M58 54H94V64H58Z" fill="#fff" ${S}/><path d="M66 64V90H86V64" fill="#fff" ${S}/><rect x="66" y="22" width="24" height="26" rx="2" fill="#a5d8ff" ${S2}/>` + P(4, 22, 0.66, { kind: 'boy', shirt: '#ffa94d', pose: 'face', emo: 'smile' }) + `<path d="M36 40L46 32" stroke="#4dabf7" stroke-width="3" stroke-linecap="round"/>`,
  e_eat: () => room('#fff4e6') + table(30, 62, 64) + `<ellipse cx="62" cy="60" rx="14" ry="4" fill="#fff" ${S2}/><circle cx="58" cy="57" r="4" fill="#ffd43b" ${S2}/><circle cx="66" cy="57" r="3.4" fill="#ff6b6b" ${S2}/>` + P(0, 30, 0.6, { kind: 'boy', shirt: '#ffa94d', pose: 'forward', emo: 'laugh' }),
  e_go_school: () => room('#ebfbee') + `<path d="M58 30L76 16L94 30V80H58Z" fill="#ffe066" ${S}/>` + door(70, 52, 14, 28) + P(4, 22, 0.66, { ...MO, bag: '#e5484d', pose: 'wave', emo: 'laugh' }),
  /* ===== أنا صادق (ص ٢٠–٢٥) ===== */
  e_s_lana_sad: () => cls() + desk(30, 76, 40) + P(28, 34, 0.48, { ...LA, emo: 'sad', pose: 'face' }) + P(-2, 34, 0.46, { ...MO, pose: 'point' }) + P(62, 34, 0.46, { ...ZA, pose: 'down' }),
  e_s_advice: () => room('#ebfbee') + P(2, 24, 0.6, { ...YU, pose: 'point' }) + P(44, 24, 0.6, { ...LA, emo: 'sad' }, true),
  e_s_truth: () => room('#ebfbee') + P(2, 24, 0.6, { ...LA, pose: 'forward', emo: 'smile' }) + bubble(4, 4, 22, 14) + `<path d="M10 10H24M10 14H20" stroke="#adb5bd" stroke-width="1.6"/>` + P(42, 22, 0.62, { ...TE, pose: 'down' }, true),
  e_s_praise: () => room('#fff9db') + [[-4, MO], [22, LA], [48, ZA], [70, YU]].map(([x, o]) => P(x, 36, 0.44, { ...o, emo: 'laugh', pose: 'down' })).join('') + heart(50, 18, 7),
  e_bike: () => wall('#e7f5ff') + floor('#b2f2bb') + `<circle cx="26" cy="76" r="14" fill="none" ${S}/><circle cx="74" cy="76" r="14" fill="none" ${S}/><path d="M26 76L44 52H66L74 76M44 52L52 76H26M66 52L64 44" fill="none" stroke="#e5484d" stroke-width="3.4"/>` + at(26, 6, 0.52, person({ kind: 'boy', shirt: '#4dabf7', pose: 'forward', emo: 'laugh' })),
  e_teddy: () => room('#fff0f6') + P(10, 18, 0.72, { kind: 'girl', shirt: '#ff8fab', hijab: '#ffd43b', pose: 'hug', emo: 'laugh' }) + `<circle cx="50" cy="58" r="10" fill="#c8794a" ${S2}/><circle cx="43" cy="49" r="4" fill="#c8794a" ${S2}/><circle cx="57" cy="49" r="4" fill="#c8794a" ${S2}/><circle cx="47" cy="57" r="1.4" fill="${K}"/><circle cx="53" cy="57" r="1.4" fill="${K}"/>`,
  /* ===== الأمانة صفتي (ص ٢٦–٣٠) ===== */
  e_book_window: () => wall('#fff9db') + win(16, 10, 68, 56) + `<rect x="10" y="66" width="80" height="8" rx="2" fill="#e0a36f" ${S}/>` + book(54, 40, 18) + `<path d="M24 66V52" stroke="#2f9e44" stroke-width="2.4"/>` + [0, 1, 2].map((i) => `<circle cx="${20 + i * 6}" cy="${48 + (i % 2) * 4}" r="4" fill="#fff" ${S2}/>`).join(''),
  e_s_show_book: () => cls() + desk(6, 78, 36) + desk(58, 78, 36) + P(26, 26, 0.6, { ...MO, pose: 'up', emo: 'laugh' }) + book(64, 22, 10),
  e_s_cry: () => room('#f8f0fc') + door(66, 12, 28, 68) + P(30, 24, 0.6, { ...SA, pose: 'face', emo: 'cry' }) + P(-6, 24, 0.6, { ...MO, pose: 'down' }),
  e_s_return: () => room('#f8f0fc') + door(66, 12, 28, 68) + P(-2, 24, 0.6, { ...MO, pose: 'give', emo: 'laugh' }) + book(48, 52, 10) + P(42, 24, 0.6, { ...SA, emo: 'smile' }, true),
  e_s_names: () => room('#f8f0fc') + door(4, 12, 24, 68) + door(72, 12, 24, 68) + P(6, 24, 0.6, { ...SA, pose: 'point', emo: 'laugh' }) + P(40, 24, 0.6, { ...MO, pose: 'point', emo: 'laugh' }, true),
  e_give_back: () => room('#ebfbee') + P(0, 22, 0.66, { kind: 'boy', shirt: '#fff', pose: 'give', emo: 'laugh' }) + book(54, 50, 12, '#e5484d') + P(44, 20, 0.66, { kind: 'woman', shirt: '#74c0fc', hijab: '#ffa94d' }, true),
  e_hide_book: () => room('#ebfbee') + book(14, 48, 14, '#e5484d') + P(4, 22, 0.66, { kind: 'boy', shirt: '#74c0fc', pose: [[34, 60], [66, 60]], emo: 'calm' }) + P(48, 22, 0.66, { kind: 'boy', shirt: '#495057', pose: 'down', emo: 'calm' }),
  e_pencil_boy: () => P(10, 6, 0.8, { kind: 'boy', shirt: '#1c7ed6', pose: 'wave', emo: 'laugh' }),
  /* ===== الاحترام (ص ٣١–٣٥) ===== */
  e_s_lesson: () => cls() + P(48, 24, 0.58, { ...TE, pose: 'wave' }) + desk(4, 76, 40) + P(6, 50, 0.4, ZA) + P(24, 50, 0.4, MO),
  e_s_knock: () => room('#ebfbee') + door(6, 12, 32, 68, true) + P(4, 22, 0.62, { ...NO, pose: 'forward', emo: 'smile' }) + book(32, 54, 8) + P(52, 22, 0.62, { ...TE, pose: 'down' }, true),
  e_s_thanks: () => room('#ebfbee') + door(70, 12, 26, 68, true) + P(44, 20, 0.62, { ...NO, emo: 'smile' }, true) + P(4, 30, 0.54, { ...ZA, pose: 'give', emo: 'laugh' }) + book(48, 56, 8),
  e_s_remember: () => cls() + P(4, 26, 0.6, { ...TE, pose: 'point' }) + [52, 70].map((x, i) => P(x, 48, 0.4, i ? YU : LA)).join('') + desk(48, 84, 46),
  e_friends_hug: () => room('#fff9db') + P(4, 22, 0.66, { kind: 'boy', shirt: '#69db7c', pose: [[30, 68], [74, 46]], emo: 'laugh' }) + P(34, 22, 0.66, { kind: 'boy', shirt: '#ff6b6b', pose: [[26, 46], [70, 68]], emo: 'laugh' }),
  e_fight: () => room('#fff5f5') + P(2, 24, 0.62, { kind: 'boy', shirt: '#ffa94d', pose: 'give', emo: 'angry' }) + P(42, 28, 0.6, { kind: 'boy', shirt: '#74c0fc', pose: 'both', emo: 'angry' }, true) + `<path d="M50 30l4 6l6 -2l-3 6l5 4l-7 1l0 6l-4 -5l-5 4l1 -7z" fill="#ffd43b" ${S2}/>`,
  e_pick_litter: () => room('#ebfbee') + P(10, 22, 0.66, { kind: 'boy', shirt: '#4dabf7', pose: 'give', emo: 'smile' }) + `<path d="M64 60Q60 90 72 92H86Q96 90 92 60Z" fill="#dee2e6" ${S}/>` + paper(44, 86, 20),
  e_tear_paper: () => room('#fff5f5') + P(14, 18, 0.7, { kind: 'boy', shirt: '#ffd43b', pose: 'both', emo: 'angry' }) + paper(8, 34, 30) + paper(84, 36, -20) + paper(20, 88, 10) + paper(70, 90, 50),
  e_tissues: () => room('#e7f5ff') + `<path d="M44 46H82V56H44Z" fill="#fff" ${S}/><path d="M52 56V84H74V56" fill="#fff" ${S}/><rect x="52" y="14" width="24" height="24" rx="2" fill="#a5d8ff" ${S2}/>` + paper(48, 88, 20) + paper(64, 90, -30) + paper(80, 84, 10) + P(-4, 22, 0.62, { kind: 'boy', shirt: '#fff', vest: '#4263eb', pose: 'wave', emo: 'smile' }),
  e_kick_cat: () => room('#fff5f5') + P(30, 16, 0.7, { kind: 'boy', shirt: '#2b8a3e', pose: 'hips', emo: 'angry' }) + `<path d="M40 82L22 74" stroke="#1c7ed6" stroke-width="8" stroke-linecap="round"/>` + `<ellipse cx="14" cy="70" rx="9" ry="6" fill="#ffa94d" ${S2}/><circle cx="8" cy="62" r="5" fill="#ffa94d" ${S2}/><path d="M5 58l1 -4l3 3M10 58l2 -4l1 4" fill="#ffa94d" ${S2}/>`,
  e_say_truth: () => room('#e7f5ff') + P(4, 22, 0.66, { kind: 'man', shirt: '#74c0fc', pose: 'forward' }, true) + P(44, 22, 0.66, { kind: 'boy', shirt: '#ff8787', emo: 'laugh' }) + bubble(52, 4, 26, 14) + `<path d="M58 9H76M58 13H72" stroke="#adb5bd" stroke-width="1.6"/>`,
  e_grandma_boy: () => room('#e7f5ff') + P(30, 4, 0.82, { kind: 'oldwoman', shirt: '#a87132', hijab: '#ffe066', glasses: true, pose: 'hug' }) + P(4, 30, 0.6, { kind: 'boy', shirt: '#ffd43b', emo: 'shy', pose: 'face' }),
  e_share_box: () => room('#d3f9d8') + P(2, 28, 0.6, { kind: 'girl', shirt: '#99e9f2', hijab: '#ff8787', pose: 'give', emo: 'smile' }) + `<rect x="44" y="52" width="12" height="10" rx="2" fill="#c8794a" ${S2}/>` + P(42, 28, 0.6, { kind: 'boy', shirt: '#ffe066', pose: 'give', emo: 'smile' }, true),
  /* ===== أنا ومشاعري (ص ٤١–٤٨) ===== */
  e_s_cards: () => room('#e3fafc') + table(20, 70, 76) + P(2, 18, 0.66, { kind: 'woman', shirt: '#40c057', hijab: '#ffc9c9', pose: 'forward' }) + [[44, 44, LA], [60, 44, { kind: 'boy', shirt: '#ffd43b', hair: '#d9480f' }], [76, 44, { kind: 'girl', shirt: '#cc5de8', hijab: '#ffd8a8' }]].map(([x, y, o]) => P(x, y, 0.36, { ...o, emo: 'laugh' })).join('') + ['#ffd43b', '#ff8a5c', '#ffd43b'].map((c, i) => `<rect x="${38 + i * 14}" y="64" width="10" height="8" rx="1" fill="#fff" ${S2}/><circle cx="${43 + i * 14}" cy="68" r="3" fill="${c}"/>`).join(''),
  e_s_rami: () => room('#e3fafc') + P(6, 18, 0.66, { kind: 'boy', shirt: '#ffd43b', hair: '#d9480f', pose: 'wave', emo: 'angry' }) + `<rect x="50" y="22" width="18" height="20" rx="2" fill="#fff" ${S2}/><circle cx="59" cy="32" r="7" fill="#ff8a5c" ${S2}/><path d="M55 30l3 1.5M63 30l-3 1.5M56 35h6" ${S2}/>`,
  e_s_lana_card: () => room('#e3fafc') + P(6, 18, 0.66, { ...LA, pose: 'wave', emo: 'sad' }) + `<rect x="50" y="22" width="18" height="20" rx="2" fill="#fff" ${S2}/><circle cx="59" cy="32" r="7" fill="#ffd43b" ${S2}/><path d="M56 36q3 -3 6 0" fill="none" ${S2}/>`,
  /* ===== أعرف أسرتي (ص ٤٩–٥٤) ===== */
  e_s_family: () => room('#fff9db') + P(-4, 22, 0.5, { kind: 'oldman', shirt: '#fff', dishdasha: true, ghutra: true }) + P(16, 20, 0.52, DAD) + P(36, 22, 0.5, MOM) + P(54, 42, 0.4, { kind: 'boy', shirt: '#ffa94d' }) + P(70, 42, 0.4, { kind: 'girl', shirt: '#69db7c', hijab: '#ffd43b' }),
  e_s_draw_tree: () => room('#fff9db') + P(0, 22, 0.6, { ...DAD, glasses: true, pose: 'point' }) + P(44, 34, 0.5, { kind: 'boy', shirt: '#ced4da', pose: 'hold', emo: 'laugh' }) + `<rect x="58" y="48" width="22" height="26" rx="2" fill="#fff" ${S2}/>` + at(58, 48, 0.22, tree(4)),
  e_tree_4: () => wall('#e7f5ff') + tree(4),
  e_tree_8: () => wall('#e7f5ff') + tree(8),
  /* ===== أنا وأسرتي نتعاون معاً (ص ٥٥–٦٠) ===== */
  e_s_breakfast: () => room('#f1f3f5') + win(6, 6, 40, 30) + win(54, 6, 40, 30) + P(60, 10, 0.6, { kind: 'man', shirt: '#4dabf7', glasses: true, pose: 'point' }, true) + P(-2, 30, 0.5, { kind: 'woman', shirt: '#9c36b5', hijab: '#ff8787' }) + P(26, 44, 0.4, { kind: 'boy', shirt: '#f1f3f5', hair: '#e8b04a' }) + P(44, 44, 0.4, { kind: 'girl', shirt: '#d8c4a0', hijab: '#ff8787' }) + table(14, 76, 72) + `<ellipse cx="36" cy="75" rx="7" ry="2.4" fill="#fff" ${S2}/><circle cx="56" cy="73" r="3" fill="#ff6b6b" ${S2}/><rect x="66" y="66" width="7" height="10" fill="#fff" ${S2}/>`,
  e_dishes: () => room('#e7f5ff') + `<rect x="40" y="62" width="56" height="20" rx="3" fill="#ced4da" ${S}/>` + [48, 60, 72].map((x) => `<ellipse cx="${x}" cy="62" rx="7" ry="3" fill="#fff" ${S2}/>`).join('') + P(4, 18, 0.66, { kind: 'girl', shirt: '#cc5de8', hijab: '#ff8787', apron: '#ffd43b', pose: 'give', emo: 'smile' }),
  e_garden: () => wall('#e7f5ff') + floor('#b2f2bb') + `<path d="M76 92V60" stroke="#2f9e44" stroke-width="2.6"/>` + [[70, 66], [82, 72], [76, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e5484d" ${S2}/>`).join('') + P(4, 18, 0.66, { kind: 'man', shirt: '#ffe066', apron: '#364fc7', glasses: true, pose: 'give', emo: 'laugh' }) + `<path d="M50 56h14l6 -8M50 56v10h14v-10" fill="#69db7c" ${S2}/><path d="M70 50l6 10" stroke="#4dabf7" stroke-width="1.6" stroke-dasharray="2 2"/>`,
  e_window: () => wall('#e7f5ff') + win(44, 8, 50, 70) + P(-2, 18, 0.7, { kind: 'boy', shirt: '#69db7c', pants: '#e5484d', hair: '#495057', pose: 'knock', emo: 'smile' }) + `<rect x="56" y="36" width="10" height="8" rx="2" fill="#9775fa" ${S2}/>`,
  e_bed_boy: () => room('#e7f5ff') + bedArt(30, 66) + P(-2, 22, 0.66, { kind: 'boy', shirt: '#74c0fc', hair: '#e8b04a', pose: 'give', emo: 'smile' }),
  e_toys: () => toy(16, 72) + toy(48, 54) + `<circle cx="70" cy="74" r="12" fill="#c8794a" ${S}/><circle cx="62" cy="62" r="5" fill="#c8794a" ${S2}/><circle cx="78" cy="62" r="5" fill="#c8794a" ${S2}/><circle cx="66" cy="72" r="1.6" fill="${K}"/><circle cx="74" cy="72" r="1.6" fill="${K}"/>` + `<path d="M20 40l10 -16l10 16z" fill="#4dabf7" ${S}/>`,
  e_rubbish: () => `<path d="M14 86Q20 50 50 52Q80 50 86 86Z" fill="#868e96" ${S}/>` + paper(30, 56, 20) + paper(56, 54, -30) + `<path d="M40 66l8 -8l6 10z" fill="#ffd43b" ${S2}/><circle cx="66" cy="70" r="4" fill="#e5484d" ${S2}/>` + [[30, 30], [50, 24], [70, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${K}"/>`).join(''),
  e_shoe_rack: () => `<path d="M20 20V90M80 20V90" ${S}/><path d="M20 38H80M20 60H80M20 82H80" stroke="${K}" stroke-width="3.4"/>`,
  e_wardrobe: () => `<rect x="22" y="8" width="56" height="84" rx="3" fill="#e0c39a" ${S}/><path d="M50 8V92" ${S}/><path d="M45 46V56M55 46V56" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
  e_toybox: () => `<path d="M12 46H88V88H12Z" fill="#a0623a" ${S}/><path d="M12 46L20 22H96L88 46Z" fill="#c8794a" ${S}/><rect x="30" y="58" width="40" height="18" rx="2" fill="none" stroke="#f2c14e" stroke-width="2"/>`,
  e_bin: () => `<path d="M24 28H76L70 92H30Z" fill="#adb5bd" ${S}/><rect x="18" y="20" width="64" height="8" rx="3" fill="#868e96" ${S}/><path d="M42 20V14H58V20M40 40V82M50 40V82M60 40V82" fill="none" ${S2}/>`,
  /* ===== مشاعري تجاه أسرتي (ص ٦١–٦٥) ===== */
  e_s_morning: () => room('#fff9db') + `<rect x="58" y="44" width="34" height="34" rx="2" fill="#dee2e6" ${S}/><ellipse cx="74" cy="44" rx="10" ry="3" fill="#495057" ${S2}/>` + P(40, 16, 0.62, { kind: 'man', shirt: '#e9ecef', apron: '#74c0fc', pose: 'give' }, true) + P(0, 34, 0.52, { ...SA, pose: 'wave', emo: 'smile' }),
  e_s_hug_mom: () => room('#fff0f6') + P(26, 6, 0.74, { kind: 'woman', shirt: '#fff', hijab: '#fff', pose: 'hug', emo: 'laugh' }) + P(10, 36, 0.52, { ...SA, pose: [[60, 56], [70, 56]], emo: 'laugh' }) + heart(84, 16, 7),
  /* ===== قدوتي (ص ٦٦–٧١) ===== */
  e_s_jobs: () => room('#ebfbee') + [[-4, MO], [20, LA], [44, YU], [68, SA]].map(([x, o]) => P(x, 36, 0.46, { ...o, emo: 'laugh', pose: 'wave' })).join(''),
  e_airplane: () => `<path d="M10 54Q50 44 90 50Q96 52 90 56Q50 62 10 58Z" fill="#e7f5ff" ${S}/><path d="M44 52L30 24H40L62 52ZM44 58L32 82H42L62 58ZM14 54L8 40H16L24 54Z" fill="#74c0fc" ${S}/>` + [60, 68, 76].map((x) => `<circle cx="${x}" cy="53" r="2" fill="#1c7ed6"/>`).join(''),
  e_factory: () => `<path d="M8 90V46L30 58V46L52 58V46L74 58V20H88V90Z" fill="#ced4da" ${S}/><rect x="20" y="70" width="12" height="12" fill="#ffd43b" ${S2}/><rect x="44" y="70" width="12" height="12" fill="#ffd43b" ${S2}/><path d="M78 16q4 -8 10 -6" fill="none" stroke="#adb5bd" stroke-width="3"/>`,
  e_buildings: () => `<rect x="8" y="34" width="26" height="58" fill="#ffd8a8" ${S}/><rect x="38" y="12" width="26" height="80" fill="#a5d8ff" ${S}/><rect x="68" y="44" width="24" height="48" fill="#b2f2bb" ${S}/>` + [[14, 42], [24, 42], [14, 56], [24, 56], [44, 20], [54, 20], [44, 36], [54, 36], [44, 52], [54, 52], [74, 52], [84, 52]].map(([x, y]) => `<rect x="${x}" y="${y}" width="5" height="7" fill="#fff" ${S2}/>`).join(''),
  /* ===== أنشطة الوحدة الثانية (ص ٧٢–٧٥) ===== */
  e_push_water: () => room('#e7f5ff') + `<rect x="70" y="30" width="22" height="52" rx="3" fill="#dee2e6" ${S}/><rect x="74" y="34" width="14" height="16" rx="2" fill="#4dabf7" ${S2}/>` + P(-4, 22, 0.6, { kind: 'boy', shirt: '#ff6b6b', pose: 'give', emo: 'angry' }) + P(28, 26, 0.58, { kind: 'boy', shirt: '#74c0fc', pose: 'both', emo: 'scared' }),
  e_help_grandma: () => wall('#e7f5ff') + floor('#b2f2bb') + P(26, 12, 0.66, { kind: 'oldwoman', shirt: '#868e96', hijab: '#dee2e6', cane: true, emo: 'smile' }) + P(-2, 36, 0.48, { kind: 'girl', shirt: '#ffa94d', hijab: '#ffd43b', pose: 'give', emo: 'smile' }) + P(60, 36, 0.48, { kind: 'boy', shirt: '#69db7c', pose: 'give', emo: 'smile' }, true),
  e_firecracker: () => wall('#e7f5ff') + floor('#ced4da') + P(4, 22, 0.66, { kind: 'boy', shirt: '#4dabf7', pose: 'give', emo: 'laugh' }) + `<rect x="62" y="66" width="8" height="18" rx="2" fill="#e5484d" ${S2}/><path d="M66 66q2 -6 6 -8" fill="none" ${S2}/><path d="M72 54l3 -6l2 5l5 -3l-3 6l6 1l-6 3z" fill="#ffd43b" ${S2}/>`,
  e_water_plants: () => wall('#e7f5ff') + floor('#b2f2bb') + P(-2, 14, 0.66, { kind: 'man', shirt: '#4dabf7', pose: 'give', emo: 'smile' }) + P(44, 34, 0.5, { kind: 'boy', shirt: '#ffd43b', pose: 'give', emo: 'laugh' }) + `<path d="M86 92V76M80 80q6 -6 6 -4q0 -6 6 -2" fill="none" stroke="#2f9e44" stroke-width="2.4"/><circle cx="86" cy="72" r="4" fill="#ff8fab" ${S2}/>`,
};
