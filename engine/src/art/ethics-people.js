// ethics-people — شخصيات الكتاب ووجوه المشاعر وأفراد الأسرة والمهن (رسوم أصلية، 100×100)
import { person, P, at, emoji, heart, book } from './ethics-kit.js';
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const S2 = `stroke="${K}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;
const UNI = { shirt: '#fff', vest: '#4263eb', pants: '#3a5a7a' }; // زيّ المدرسة في قصص الكتاب
const kids = {
  mohammed: { kind: 'boy', ...UNI, hair: '#5a3420' },
  yusuf: { kind: 'boy', shirt: '#ffd43b', pants: '#3a5a7a', hair: '#c98a3e' },
  zahraa: { kind: 'girl', shirt: '#4263eb', hijab: '#ff8fab' },
  lana: { kind: 'girl', shirt: '#ff6b6b', hijab: '#ffd8a8', glasses: true },
  sara: { kind: 'girl', shirt: '#4263eb', hijab: '#f783ac' },
  nour: { kind: 'girl', shirt: '#364fc7', hijab: '#91a7ff' },
};
export const ART_ETHICS_PEOPLE = {
  // الأصدقاء الخمسة ونور
  e_mohammed: () => person(kids.mohammed),
  e_yusuf: () => person(kids.yusuf),
  e_zahraa: () => person(kids.zahraa),
  e_lana: () => person(kids.lana),
  e_sara: () => person(kids.sara),
  e_nour: () => person({ ...kids.nour, kind: 'woman' }),
  e_teacher: () => person({ kind: 'woman', shirt: '#e9ecef', hijab: '#a5d8ff', glasses: true, pose: 'wave' }),
  // أفراد الأسرة (ص ٥٢–٥٣)
  e_father: () => person({ kind: 'man', shirt: '#74c0fc', pants: '#495057' }),
  e_mother: () => person({ kind: 'woman', shirt: '#b197fc', hijab: '#f783ac' }),
  e_brother: () => person({ kind: 'boy', shirt: '#ffa94d', pants: '#1c7ed6' }),
  e_sister: () => person({ kind: 'girl', shirt: '#69db7c', hijab: '#ffd43b' }),
  e_grandpa: () => person({ kind: 'oldman', shirt: '#fff', dishdasha: true, ghutra: true, glasses: true }),
  e_grandma: () => person({ kind: 'oldwoman', shirt: '#e8590c', hijab: '#ffa94d', glasses: true }),
  e_me: () => person({ kind: 'boy', shirt: '#e5484d', pants: '#3a5a7a', pose: 'wave' }),
  // المهن (ص ٦٦–٧٠)
  e_soldier: () => person({ kind: 'man', shirt: '#6b7a3a', pants: '#5c6b30', helmet: '#4f5d23', pose: 'down' }) + `<rect x="44" y="50" width="12" height="4" fill="#3d4a1a"/>`,
  e_engineer: () => person({ kind: 'woman', shirt: '#4dabf7', hijab: '#ffd43b', apron: '#ff922b', pose: 'forward' }) + `<path d="M33 14Q34 1 50 1Q66 1 67 14Z" fill="#ffd43b" ${S}/><path d="M30 14H70" ${S}/>` + `<rect x="40" y="56" width="20" height="14" rx="1" fill="#e7f5ff" ${S2}/><path d="M43 66L49 59L53 63L57 58" fill="none" stroke="#1c7ed6" stroke-width="1.6"/>`,
  e_farmer: () => person({ kind: 'man', shirt: '#94d82d', pants: '#8a5a3b', cap: '#e8b04a', pose: 'up' }) + `<path d="M70 12V96" stroke="#8a5a3b" stroke-width="3" stroke-linecap="round"/><path d="M64 92H76L78 98H62Z" fill="#adb5bd" ${S2}/>`,
  e_builder: () => person({ kind: 'man', shirt: '#ff922b', pants: '#495057', helmet: '#ffd43b', pose: 'forward' }) + `<rect x="40" y="58" width="20" height="9" rx="1" fill="#e8590c" ${S2}/><path d="M40 62.5H60M50 58V67" stroke="#fff" stroke-width="1.2"/>`,
  e_nurse: () => person({ kind: 'woman', shirt: '#fff', hijab: '#fff', pose: 'down' }) + `<rect x="45" y="5" width="10" height="7" rx="1" fill="#fff" ${S2}/><path d="M50 6.5V10.5M48 8.5H52" stroke="#e5484d" stroke-width="1.6"/><path d="M47 52H53M50 49V55" stroke="#e5484d" stroke-width="2.4"/>`,
  e_doctor: () => person({ kind: 'man', shirt: '#fff', coat: '#fff', pants: '#495057', glasses: true }) + `<path d="M40 44Q36 62 46 64Q52 64 52 58" fill="none" stroke="#3a5a7a" stroke-width="2.4"/><circle cx="52" cy="57" r="2.6" fill="#9aa9b8" ${S2}/>`,
  e_pilot: () => person({ kind: 'man', shirt: '#fff', vest: '#1c3f6e', pants: '#1c3f6e', cap: '#1c3f6e', pose: 'wave' }) + `<path d="M44 12H56" stroke="#ffd43b" stroke-width="2.4"/>`,
  e_worker: () => person({ kind: 'man', shirt: '#1c7ed6', pants: '#1c7ed6', helmet: '#ffd43b', pose: 'hold' }) + `<path d="M58 60L74 76" stroke="#868e96" stroke-width="4" stroke-linecap="round"/><path d="M70 72l8 -2l-2 8z" fill="#868e96" ${S2}/>`,
  e_teacher_m: () => person({ kind: 'man', shirt: '#fff', vest: '#8a5a3b', pants: '#495057', glasses: true, pose: 'point' }),
  // وجوه المشاعر (بطاقات المشاعر ص ٤٢–٤٨)
  e_f_happy: () => emoji('laugh'),
  e_f_smile: () => emoji('smile'),
  e_f_sad: () => emoji('sad'),
  e_f_cry: () => emoji('cry'),
  e_f_angry: () => emoji('angry', '#ff8a5c'),
  e_f_shy: () => emoji('shy'),
  e_f_scared: () => emoji('scared', '#c5e3f6'),
  e_f_love: () => emoji('love'),
  // أشخاص يعبّرون عن مشاعرهم (ص ٤٦–٤٧، ٦٤، ٧٢)
  e_boy_angry: () => person({ kind: 'boy', shirt: '#ff6b6b', emo: 'angry', pose: 'hips' }) + [[16, 22], [84, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#f1f3f5" ${S2}/><circle cx="${x + (x < 50 ? -5 : 5)}" cy="${y - 5}" r="4.5" fill="#f1f3f5" ${S2}/>`).join(''),
  e_girl_sulky: () => person({ kind: 'girl', shirt: '#ffd43b', hijab: '#ff8787', emo: 'sad', pose: 'forward' }),
  e_girls_happy: () => P(-4, 6, 0.86, { kind: 'girl', shirt: '#74c0fc', hijab: '#e64980', emo: 'laugh', pose: 'down' }) + P(18, 6, 0.86, { kind: 'girl', shirt: '#ffd43b', hijab: '#845ef7', emo: 'laugh', pose: 'down' }),
  e_girl_cry: () => person({ kind: 'girl', shirt: '#ffa8a8', hijab: '#da77f2', emo: 'cry', pose: 'face' }),
  e_girl_sad: () => person({ kind: 'girl', shirt: '#a5d8ff', hijab: '#748ffc', emo: 'sad' }),
  e_girl_laugh: () => person({ kind: 'girl', shirt: '#ffd43b', hijab: '#ff8787', emo: 'laugh', pose: 'both' }),
  e_girl_smile: () => person({ kind: 'girl', shirt: '#b2f2bb', hijab: '#ffa94d', emo: 'smile' }),
  e_sara_sad: () => person({ ...kids.sara, emo: 'sad' }),
  e_sara_angry: () => person({ ...kids.sara, emo: 'angry' }),
  e_sara_scared: () => person({ ...kids.sara, emo: 'scared' }),
  e_sara_happy: () => person({ ...kids.sara, emo: 'laugh', pose: 'both' }),
  // حب الأم لأولادها (ص ٤٥)
  e_mother_love: () => P(6, 4, 0.9, { kind: 'woman', shirt: '#40c057', hijab: '#ffc9c9', emo: 'laugh', pose: 'both' }) + heart(14, 16, 7) + heart(86, 18, 7) + heart(86, 56, 6),
  e_book_red: () => book(30, 22, 40, '#e5484d'),
};
