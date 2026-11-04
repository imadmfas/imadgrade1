import { ART } from '../art.js';
// رسوم كتاب «التربية الإسلامية» — رسوم أصلية بأسلوب المكتبة (مربع 100×100، حدود بنية دافئة).
// لا رسم للأنبياء ولا الصحابة ولا الملائكة؛ الناس أطفال وأهل بلباس محتشم.
const K = '#4a3426';
const S = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const s2 = `stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const SKIN = '#f6c9a6';
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${K}"/>`;
const face = (x, y, r, mood = 'smile') => `${dot(x - r * 0.38, y - r * 0.05)}${dot(x + r * 0.38, y - r * 0.05)}${mood === 'smile' ? `<path d="M${x - r * 0.35} ${y + r * 0.35}Q${x} ${y + r * 0.7} ${x + r * 0.35} ${y + r * 0.35}" fill="none" ${s2}/>` : mood === 'angry' ? `<path d="M${x - r * 0.35} ${y + r * 0.55}Q${x} ${y + r * 0.25} ${x + r * 0.35} ${y + r * 0.55}" fill="none" ${s2}/><path d="M${x - r * 0.6} ${y - r * 0.4}l${r * 0.4} ${r * 0.2}M${x + r * 0.6} ${y - r * 0.4}l-${r * 0.4} ${r * 0.2}" ${s2}/>` : `<circle cx="${x}" cy="${y + r * 0.45}" r="${r * 0.15}" fill="${K}"/>`}`;
// ولد: رأس وشعر قصير وقميص وبنطال
const boy = (x, y, sh = '#4dabf7', pants = '#3b5b8a', mood = 'smile', h = 1) => `
  <rect x="${x - 7}" y="${y + 24 * h}" width="5.5" height="${16 * h}" rx="2.5" fill="${pants}" ${s2}/><rect x="${x + 1.5}" y="${y + 24 * h}" width="5.5" height="${16 * h}" rx="2.5" fill="${pants}" ${s2}/>
  <rect x="${x - 9}" y="${y + 6}" width="18" height="${20 * h}" rx="5" fill="${sh}" ${s2}/>
  <circle cx="${x}" cy="${y}" r="8" fill="${SKIN}" ${s2}/><path d="M${x - 8} ${y - 1}Q${x - 7} ${y - 10} ${x} ${y - 9}Q${x + 7} ${y - 10} ${x + 8} ${y - 1}Q${x + 2} ${y - 6} ${x - 8} ${y - 1}Z" fill="#5a3a22" ${s2}/>${face(x, y + 1, 7, mood)}`;
// بنت: حجاب وثوب طويل
const girl = (x, y, dr = '#e64980', hj = '#f783ac', mood = 'smile') => `
  <path d="M${x - 10} ${y + 40}L${x - 8} ${y + 8}Q${x} ${y + 4} ${x + 8} ${y + 8}L${x + 10} ${y + 40}Z" fill="${dr}" ${s2}/>
  <path d="M${x - 10} ${y + 4}Q${x - 11} ${y - 11} ${x} ${y - 11}Q${x + 11} ${y - 11} ${x + 10} ${y + 4}Q${x + 6} ${y + 12} ${x} ${y + 12}Q${x - 6} ${y + 12} ${x - 10} ${y + 4}Z" fill="${hj}" ${s2}/>
  <circle cx="${x}" cy="${y}" r="6.5" fill="${SKIN}" ${s2}/>${face(x, y + 1, 6, mood)}`;
// رجل بالغ بقميص
const man = (x, y, sh = '#2f9e44') => `
  <rect x="${x - 8}" y="${y + 30}" width="6.5" height="22" rx="3" fill="#4a4a5a" ${s2}/><rect x="${x + 1.5}" y="${y + 30}" width="6.5" height="22" rx="3" fill="#4a4a5a" ${s2}/>
  <rect x="${x - 11}" y="${y + 8}" width="22" height="25" rx="6" fill="${sh}" ${s2}/>
  <circle cx="${x}" cy="${y}" r="9" fill="${SKIN}" ${s2}/><path d="M${x - 9} ${y - 2}Q${x} ${y - 14} ${x + 9} ${y - 2}Q${x} ${y - 7} ${x - 9} ${y - 2}Z" fill="#3b2a1e" ${s2}/>
  <path d="M${x - 6} ${y + 4}Q${x} ${y + 11} ${x + 6} ${y + 4}" fill="#3b2a1e" ${s2}/>${dot(x - 3.5, y - 1)}${dot(x + 3.5, y - 1)}`;
// امرأة بحجاب وثوب طويل
const woman = (x, y, dr = '#7950f2', hj = '#b197fc') => `
  <path d="M${x - 13} ${y + 52}L${x - 10} ${y + 10}Q${x} ${y + 5} ${x + 10} ${y + 10}L${x + 13} ${y + 52}Z" fill="${dr}" ${s2}/>
  <path d="M${x - 11} ${y + 5}Q${x - 12} ${y - 12} ${x} ${y - 12}Q${x + 12} ${y - 12} ${x + 11} ${y + 5}Q${x + 7} ${y + 14} ${x} ${y + 14}Q${x - 7} ${y + 14} ${x - 11} ${y + 5}Z" fill="${hj}" ${s2}/>
  <circle cx="${x}" cy="${y}" r="7.5" fill="${SKIN}" ${s2}/>${face(x, y + 1, 7)}`;
const ground = (y = 92) => `<path d="M4 ${y}H96" ${S}/>`;
const book = (x, y, w, c) => `<rect x="${x}" y="${y}" width="${w}" height="${w * 0.72}" rx="3" fill="${c}" ${S}/><rect x="${x + w * 0.25}" y="${y + w * 0.16}" width="${w * 0.5}" height="${w * 0.4}" rx="${w * 0.2}" fill="none" stroke="#f5c518" stroke-width="2.2"/>`;

export const ART_ISLAMIC = {
  // الكعبة المشرّفة
  isl_kaaba: () => `<path d="M8 86H92" ${S}/><path d="M18 34L50 22L82 34V84H18Z" fill="#2b2b2b" ${S}/><path d="M18 34L50 22L82 34L50 46Z" fill="#3d3d3d" ${S}/>
    <path d="M18 50L50 60L82 50V58L50 68L18 58Z" fill="#f2c14e" ${s2}/><rect x="58" y="66" width="10" height="16" rx="1.5" fill="#f2c14e" ${s2}/>
    <path d="M50 46V86" stroke="#555" stroke-width="1.5"/>`,
  // مصحف مغلق على كرسي (بلا كتابة)
  isl_mushaf: () => `<path d="M24 92L50 70L76 92M30 92L50 76L70 92" fill="none" stroke="#8a5a3b" stroke-width="5" stroke-linecap="round"/>
    <path d="M22 66L50 56L78 66V72L50 62L22 72Z" fill="#c8794a" ${S}/>
    <rect x="26" y="12" width="48" height="48" rx="4" fill="#2f9e44" ${S}/><rect x="31" y="17" width="38" height="38" rx="2" fill="none" stroke="#f5c518" stroke-width="2.2"/>
    <path d="M50 24L56 36L50 48L44 36Z" fill="#f5c518" ${s2}/><rect x="72" y="14" width="4" height="44" fill="#fff4d6" ${s2}/>`,
  // مصحف مفتوح على كرسي (صفحات بلا كتابة، خطوط زخرفية فقط)
  isl_mushaf_open: () => `<path d="M22 94L50 64L78 94M30 94L50 72L70 94" fill="none" stroke="#8a5a3b" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 64L12 52V18L50 30Z" fill="#fffaf0" ${S}/><path d="M50 64L88 52V18L50 30Z" fill="#fffaf0" ${S}/>
    <path d="M50 66L10 54V50M50 66L90 54V50" fill="none" stroke="#2f9e44" stroke-width="3"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M18 ${29 + i * 7}L44 ${37 + i * 7}M56 ${37 + i * 7}L82 ${29 + i * 7}" stroke="#c9b48a" stroke-width="2" stroke-linecap="round"/>`).join('')}`,
  // المسجد النبوي: قبة خضراء ومنارتان (بلا أشخاص)
  isl_madina: () => `${ground(90)}<rect x="14" y="58" width="72" height="32" fill="#f4e3c3" ${S}/>
    <path d="M34 58Q34 30 50 26Q66 30 66 58Z" fill="#2f9e44" ${S}/><path d="M50 26V16" ${S}/><circle cx="50" cy="14" r="2.6" fill="#f5c518" ${s2}/>
    ${[8, 82].map((x) => `<rect x="${x}" y="26" width="10" height="64" fill="#fffaf0" ${S}/><path d="M${x} 26L${x + 5} 12L${x + 10} 26Z" fill="#2f9e44" ${S}/><rect x="${x - 2}" y="44" width="14" height="5" rx="2" fill="#e9dcc0" ${s2}/>`).join('')}
    ${[24, 40, 56, 72].map((x) => `<path d="M${x - 4} 90V78Q${x} 72 ${x + 4} 78V90" fill="#c8794a" ${s2}/>`).join('')}`,
  // الوالدان وطفلهما
  isl_parents: () => `${ground(96)}${man(28, 34, '#2f9e44')}${woman(72, 36)}${boy(50, 58, '#ffa94d', '#3b5b8a', 'smile', 0.8)}
    <path d="M38 52Q44 62 42 66M62 54Q57 62 58 66" fill="none" ${s2}/>`,
  // مساعدة الآخرين: ولد يحمل كيساً عن جدّة
  isl_help: () => `${ground(94)}${woman(68, 40, '#8d6e63', '#d7ccc8')}<path d="M80 60L86 94" stroke="#8a5a3b" stroke-width="3.5" stroke-linecap="round"/>
    ${boy(32, 44, '#4dabf7')}<path d="M40 56L50 62" ${s2}/><rect x="46" y="58" width="14" height="16" rx="3" fill="#ffd43b" ${S}/><path d="M49 58Q53 52 57 58" fill="none" ${s2}/>`,
  // رفع الأذى عن الطريق: ولد يرفع حجراً ويضعه في سلة المهملات
  isl_trash: () => `<rect x="2" y="78" width="96" height="16" fill="#adb5bd" ${s2}/><path d="M10 86H22M34 86H46M58 86H70M82 86H94" stroke="#fff" stroke-width="2.4"/>
    ${boy(36, 30, '#ff6b6b')}<path d="M45 42L54 46" ${s2}/><ellipse cx="58" cy="47" rx="6" ry="4.5" fill="#868e96" ${S}/>
    <path d="M72 50H90L87 78H75Z" fill="#40c057" ${S}/><rect x="70" y="46" width="22" height="5" rx="2" fill="#2f9e44" ${S}/>`,
  // الإبلاغ عن خطر: ولد يشير إلى شيء غريب على الأرض ويخبر رجلاً
  isl_warn: () => `${ground(94)}${man(74, 36, '#1c7ed6')}${boy(32, 46, '#fab005')}<path d="M24 58L12 76" ${s2}/>
    <path d="M6 92L12 80L18 92Z" fill="#ffd43b" ${S}/><path d="M12 84V87" stroke="${K}" stroke-width="2.2"/>
    <path d="M44 34Q52 28 60 34" fill="none" ${s2}/><circle cx="52" cy="22" r="6" fill="#fff" ${s2}/><path d="M52 19V23" ${s2}/>${dot(52, 26)}`,
  // الحديث باحترام: ولدان يتحدثان بهدوء
  isl_talk: () => `${ground(94)}${boy(30, 44, '#4dabf7')}${boy(70, 44, '#ffa94d')}
    <path d="M38 34Q50 18 62 34" fill="none" stroke="#f06595" stroke-width="2.4" stroke-dasharray="3 4"/><path d="M47 16a3 3 0 0 1 6 0q0 4 -3 6q-3 -2 -3 -6z" fill="#f06595"/>`,
  // شجار: ولدان غاضبان يتصايحان
  isl_quarrel: () => `${ground(94)}${boy(28, 44, '#ff8787', '#3b5b8a', 'angry')}${boy(72, 44, '#74c0fc', '#3b5b8a', 'angry')}
    <path d="M37 54L48 48M63 54L52 46" ${s2}/><path d="M44 22L48 30L52 20L56 30" fill="none" stroke="#e03131" stroke-width="2.6" stroke-linecap="round"/>`,
  // يرفع يده في الصف ليتكلم
  isl_raise_hand: () => `<rect x="18" y="66" width="64" height="8" rx="2" fill="#c8794a" ${S}/><path d="M24 74V94M76 74V94" ${S}/>
    ${boy(50, 34, '#4dabf7')}<path d="M58 44L68 20" stroke="${SKIN}" stroke-width="6" stroke-linecap="round"/><path d="M58 44L68 20" fill="none" ${s2} opacity=".5"/><circle cx="68" cy="18" r="4.5" fill="${SKIN}" ${s2}/>
    <rect x="34" y="58" width="16" height="9" rx="1.5" fill="#fff" ${s2}/>`,
  // إلقاء السلام: رجلان يتصافحان
  isl_greet: () => `${ground(96)}${man(26, 30, '#2f9e44')}${man(74, 30, '#1c7ed6')}
    <path d="M36 50Q44 56 50 56Q56 56 64 50" fill="none" stroke="${SKIN}" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="56" r="4.5" fill="${SKIN}" ${s2}/>`,
  // تجاهل طفل وقع: ولد يمشي مبتعداً وطفل واقع يبكي
  isl_ignore_fallen: () => `${ground(94)}${boy(72, 36, '#868e96', '#3b5b8a', 'angry')}
    <g transform="rotate(-70 30 84)">${boy(30, 66, '#ffa94d', '#3b5b8a', 'sad', 0.7)}</g>
    <path d="M22 72q-2 4 0 6" fill="none" stroke="#4dabf7" stroke-width="2.4" stroke-linecap="round"/>`,
  // إيذاء القطة: ولد يركض خلف قطة بعصا (تصرف خاطئ)
  isl_hit_cat: () => `${ground(94)}${boy(30, 38, '#ff8787', '#3b5b8a', 'angry')}<path d="M38 50L50 30" stroke="#8a5a3b" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="74" cy="82" rx="14" ry="8" fill="#ffa94d" ${S}/><circle cx="86" cy="72" r="7" fill="#ffa94d" ${S}/><path d="M81 67L82 60L86 65M89 65L92 60L91 68" fill="#ffa94d" ${s2}/>
    ${dot(85, 72)}${dot(90, 72)}<path d="M60 80Q52 72 56 64" fill="none" ${S}/><path d="M64 92V88M82 92V88" ${S}/>`,
  // قطف ثمار الجار دون إذن: يد تمتد من وراء السياج
  isl_pick_fruit: () => `<circle cx="66" cy="30" r="24" fill="#69db7c" ${S}/><rect x="62" y="50" width="8" height="40" fill="#8a5a3b" ${S}/>
    ${[[56, 24], [74, 20], [70, 38], [54, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#ff6b6b" ${s2}/>`).join('')}
    ${[8, 22, 36, 50, 64, 78, 92].map((x) => `<path d="M${x - 5} 92V60L${x} 54L${x + 5} 60V92Z" fill="#f2c14e" ${s2}/>`).join('')}
    ${boy(24, 34, '#868e96')}<path d="M32 44L52 38" stroke="${SKIN}" stroke-width="5" stroke-linecap="round"/>`,
  // رمي الحقيبة على الأرض
  isl_throw_bag: () => `<path d="M4 92H96" ${S}/>${boy(30, 34, '#ffd43b', '#3b5b8a', 'angry')}<path d="M38 46L50 40" ${s2}/>
    <g transform="rotate(25 72 80)"><rect x="60" y="70" width="24" height="20" rx="4" fill="#e5484d" ${S}/><path d="M66 70Q72 62 78 70" fill="none" ${S}/></g>
    <path d="M54 84l-6 -2M56 76l-6 -4" stroke="${K}" stroke-width="2" stroke-linecap="round"/>`,
  // ترتيب الحذاء في مكانه
  isl_shoes_place: () => `<rect x="14" y="40" width="72" height="50" rx="3" fill="#c8794a" ${S}/><path d="M14 64H86" ${S}/>
    ${[[22, 54, '#4dabf7'], [52, 54, '#e5484d'], [22, 78, '#2f9e44'], [52, 78, '#fab005']].map(([x, y, c]) => `<path d="M${x} ${y}h10l14 4v4H${x}Z" fill="${c}" ${s2}/>`).join('')}
    <path d="M44 18l6 6l12 -14" fill="none" stroke="#2f9e44" stroke-width="4" stroke-linecap="round"/>`,
  // ملابس مرمية على السرير
  isl_clothes_bed: () => `<rect x="8" y="54" width="84" height="22" rx="4" fill="#f4e3c3" ${S}/><rect x="8" y="40" width="10" height="46" rx="2" fill="#c8794a" ${S}/><path d="M92 60V86" ${S}/>
    <rect x="20" y="46" width="18" height="10" rx="5" fill="#fff" ${S}/>
    <path d="M44 50L52 44L60 48L66 44L74 50L70 56L66 54V64H52V54L48 56Z" fill="#4dabf7" ${s2} transform="rotate(-15 60 54)"/>
    <path d="M70 60L86 52L90 58L76 68Z" fill="#3b5b8a" ${s2}/><path d="M30 64q6 -4 12 0" fill="none" stroke="#e5484d" stroke-width="3"/>`,
  // يقول بسم الله قبل الطعام: ولد أمام صحن يرفع يديه
  isl_bismillah: () => `<rect x="10" y="70" width="80" height="8" rx="2" fill="#c8794a" ${S}/><path d="M18 78V94M82 78V94" ${S}/>
    ${boy(50, 26, '#ffa94d')}<ellipse cx="50" cy="68" rx="18" ry="4" fill="#fff" ${S}/><path d="M38 66Q50 58 62 66" fill="#ffd43b" ${s2}/>
    <path d="M41 40L36 48M59 40L64 48" stroke="${SKIN}" stroke-width="5" stroke-linecap="round"/>
    <path d="M76 20l2 4l4 1l-4 2l-2 4l-2 -4l-4 -2l4 -1z" fill="#ffd43b" ${s2}/>`,
  // يأكل باليد اليمنى بالملعقة
  isl_eat_right: () => `<rect x="10" y="72" width="80" height="8" rx="2" fill="#c8794a" ${S}/><path d="M18 80V94M82 80V94" ${S}/>
    ${boy(50, 28, '#4dabf7')}<ellipse cx="50" cy="70" rx="16" ry="4" fill="#fff" ${S}/><path d="M38 68Q50 60 62 68" fill="#ff922b" ${s2}/>
    <path d="M42 42L36 52" stroke="${SKIN}" stroke-width="5" stroke-linecap="round"/><path d="M36 52L44 36" stroke="#adb5bd" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="45" cy="34" rx="3" ry="2" fill="#adb5bd" ${s2}/>`,
  // وسام نجمة
  isl_star_badge: () => `<path d="M38 8L50 34L62 8Z" fill="#e5484d" ${S}/><path d="M30 8L42 34M70 8L58 34" ${S}/>
    <circle cx="50" cy="62" r="28" fill="#f5c518" ${S}/><path d="M50 42l6 13l14 1l-11 9l4 14l-13 -8l-13 8l4 -14l-11 -9l14 -1z" fill="#fff4d6" ${s2}/>`,
  // يقرأ القرآن: طفلة جالسة من الجانب أمام مصحف على كرسي (بلا كتابة)
  isl_girl_reading: () => `<rect x="6" y="86" width="88" height="8" rx="2" fill="#2f9e44" ${S}/>
    <path d="M24 88Q20 64 30 56Q42 52 48 60L52 88Z" fill="#e64980" ${s2}/>
    <path d="M24 50Q22 32 36 30Q48 32 46 50Q40 58 32 58Q26 56 24 50Z" fill="#f783ac" ${s2}/><circle cx="38" cy="44" r="6.5" fill="${SKIN}" ${s2}/>${dot(41, 43)}
    <path d="M56 86L74 68L92 86M62 86L74 74L86 86" fill="none" stroke="#8a5a3b" stroke-width="4" stroke-linecap="round"/>
    <path d="M74 68L58 62V48L74 54Z M74 68L90 62V48L74 54Z" fill="#fffaf0" ${s2}/><path d="M46 62L60 60" stroke="${SKIN}" stroke-width="4" stroke-linecap="round"/>`,
  // ص٧ «خلق الله تعالى الإنسان»: ولد وبنت
  isl_boy_girl: () => `${ground(96)}<g transform="translate(-30 -54.4) scale(1.6)">${boy(32, 50, '#4dabf7', '#3b5b8a', 'smile', 1.1)}${girl(68, 54, '#e64980', '#f783ac')}</g>`,
  // ص٧ «خلق الله تعالى الحيوانات»: مرج فيه حيوانات المزرعة
  isl_farm_animals: () => `<rect x="4" y="4" width="92" height="92" rx="14" fill="#d0ebff" ${S}/><path d="M4 48H96V82Q96 96 82 96H18Q4 96 4 82Z" fill="#94d82d" ${S}/>
    <g transform="translate(52 6) scale(.46)">${ART.horse ? ART.horse() : ''}</g><g transform="translate(4 30) scale(.46)">${ART.goat ? ART.goat() : ''}</g>
    <g transform="translate(6 56) scale(.4)">${ART.sheep ? ART.sheep() : ''}</g><g transform="translate(56 54) scale(.4)">${ART.rooster ? ART.rooster() : ''}</g><g transform="translate(36 66) scale(.3)">${ART.chick ? ART.chick() : ''}</g>`,
};
