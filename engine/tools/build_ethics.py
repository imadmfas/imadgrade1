#!/usr/bin/env python3
"""يبني دروس «التربية الأخلاقية — الصف الأول الابتدائي» من books/ethics/source/u1.json و u2.json
ويكتب books/ethics/lessons.js و lessons.json و audio-list.csv و report.json.
كل نص يراه الطفل أو يسمعه منقول من الكتاب مع رقم صفحته (الحقل الثاني في كل زوج [نص الكتاب، النص المشكول]).
تعليمات الألعاب القصيرة (≤ ٦ كلمات) مصوغة من عبارات تعليمات الكتاب نفسها.
"""
import json, csv, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'books', 'ethics', 'source')
OUT = os.path.join(ROOT, 'books', 'ethics')
U1 = json.load(open(os.path.join(SRC, 'u1.json'), encoding='utf-8'))
U2 = json.load(open(os.path.join(SRC, 'u2.json'), encoding='utf-8'))
HAR = re.compile('[ً-ْٰ]')
def base(s):
    s = re.sub('[ً-ْٰـ«»"()]', '', s)
    s = re.sub('[أإآٱ]', 'ا', s).replace('ى', 'ي')
    return re.sub(r'[\s.،,:؛؟!…\-]+', ' ', s).strip()
V = lambda p: p[1]                      # النص المشكول
LES = {L['id']: L for U in (U1, U2) for L in U['lessons']}
bad, report = [], {'inferred': [], 'notes': [], 'outside': [], 'merges': [], 'skipped': [], 'checks': []}
report['inferred'] = U1['uncertain'] + U2['uncertain']

# ---------- السجل الصوتي ----------
audio, rows = {}, []
def reg(text, lid, page, key=None):
    if not text: return None
    text = text.strip()
    if text in audio: return audio[text]
    fn = f'{lid}-{key or "x" + str(len(rows))}.mp3'
    audio[text] = fn; rows.append([fn, text, lid, page]); return fn

SAY = {
    'scene': 'اِلْمَسِ الصُّورَةَ وَتَحَدَّثْ', 'puzzle': 'رَكِّبِ الصُّورَةَ', 'read': 'اِسْمَعْ وَرَدِّدْ مَعِي', 'order': 'رَتِّبْ أَحْدَاثَ الْقِصَّةِ',
    'sort': 'ضَعْ كُلَّ صُورَةٍ فِي سَلَّتِهَا', 'truefalse': 'اِسْمَعْ: صَحٌّ أَمْ خَطَأٌ؟', 'picchoose': 'اِخْتَرِ الصُّورَةَ الْمُنَاسِبَةَ',
    'picmatch': 'صِلْ كُلَّ صُورَةٍ بِمَكَانِهَا', 'similar': 'ضَعِ الْمُتَشَابِهَاتِ مَعًا', 'maze': 'أَوْصِلِ الْقَلَمَ إِلَى صَاحِبِهِ',
    'garden': 'اِزْرَعْ وَرْدَةً لِكُلِّ فِعْلٍ', 'valuetree': 'اِلْمَسْ قِيَمَ الْوَحْدَةِ', 'memory': 'اِقْلِبْ بِطَاقَتَيْنِ مُتَشَابِهَتَيْنِ',
    'match': 'اِسْحَبِ الْكَلِمَةَ إِلَى صُورَتِهَا', 'buildw': 'رَتِّبِ الْحُرُوفَ لِتُكَوِّنَ كَلِمَةً', 'readpics': 'اِسْمَعْ وَرَدِّدْ مَعِي', 'build': 'رَتِّبِ الْحُرُوفَ لِتُكَوِّنَ كَلِمَةً', 'choose': 'اِسْمَعْ وَاخْتَرِ الْوَجْهَ',
}
COMMON = {'praise': ['أَحْسَنْتَ!', 'رَائِعٌ!', 'مُمْتَازٌ!'], 'encourage': ['حَاوِلْ مَرَّةً أُخْرَى', 'هَيَّا مَرَّةً أُخْرَى'], 'star': 'نَجْمَةٌ جَدِيدَةٌ!', 'sticker': 'مُلْصَقٌ جَدِيدٌ لِدَفْتَرِكَ!', 'welcome': 'هَيَّا نَلْعَبُ وَنَتَعَلَّمُ!', 'map': 'اِخْتَرْ دَرْسًا مِنَ الطَّرِيقِ'}
YES, NO = 'صَحٌّ', 'خَطَأٌ'
for k, v in COMMON.items():
    for j, t in enumerate(v if isinstance(v, list) else [v]): reg(t, 'c', '', f'{k}{j+1}')
for k, t in SAY.items(): reg(t, 'c', '', k)
reg(YES, 'c', '', 'yes'); reg(NO, 'c', '', 'no')

UNITS = {1: (V(U1['section']), U1['pages'][0]), 2: (V(U2['section']), U2['pages'][0])}
def scene(main, deco=('butterfly', 'trees'), bg=None):
    it = [{'art': main, 'x': 70, 'y': 0, 'w': 260}]
    if deco[0]: it.append({'art': deco[0], 'x': 4, 'y': 40, 'w': 64})
    if deco[1]: it.append({'art': deco[1], 'x': 332, 'y': 120, 'w': 66})
    return {'items': it, 'bg': bg or {}, 'sun': False}
def lesson(lid, unit, title, pages, games, sticker, **kw):
    t, up = UNITS[unit]
    L = {'id': lid, 'book': 'ethics', 'unit': unit, 'unitTitle': t, 'unitPage': up, 'pages': pages, 'title': title, 'kind': kw.pop('kind', 'lesson'), 'items': kw.pop('items', []), 'syllables': [], 'games': games, 'sticker': sticker}
    L.update(kw); return L
def g(t, page, data, say=None): return {'template': t, 'page': page, 'say': say or SAY[t], 'data': data}
def prompts(src, extra=None): return [{'text': V(q), 'page': src['questions']['page']} for q in src['questions']['items']] + (extra['sentences'] if extra else [])
def read_lines(pairs, page): return {'sentences': [{'text': V(p), 'page': page} for p in pairs]}
def src_lines(*parts):
    # كل جزء كتلة من المصدر فيها page؛ تُحفظ صفحة كل جملة
    out = []
    for blk, key in parts:
        items = blk[key] if isinstance(blk[key][0], list) else [blk[key]]
        out += [{'text': V(x), 'page': blk['page']} for x in items]
    return {'sentences': out}
def explore_round(src):
    e = src['explore']; return {'say': V(e['q']), 'show': True, 'options': [{'text': V(o)} for o in e['options']], 'answer': e['answer'], 'page': e['page']}
def story_order(src, keys, art):
    st = {s['key']: s for s in src['story'] if s.get('key')}
    return {'rounds': [{'items': [{'art': art[k], 'text': V(st[k]['text'])} for k in keys]}]}
def tf_rounds(src, idx=None):
    it = src['truefalse']['items']; it = [it[i] for i in idx] if idx else it
    return {'rounds': [{'text': V(x['text']), 'ok': x['ok']} for x in it], 'yes': YES, 'no': NO}
def opt_text(pairs): return [{'text': V(p)} for p in pairs]

LESSONS = []
# ======================= الوحدة الأولى: أنا =======================
S = LES['u1-greet']
LESSONS.append(lesson('u1-greet', 1, V(S['title']), [7, 11], [
    g('scene', 8, {'scene': scene('e_s_greet'), 'prompts': prompts(S)}),
    g('picchoose', 9, {'rounds': [
        {'say': V(S['activities'][0]['content'][0]['value']), 'options': [{'art': 'e_knock'}, {'art': 'e_push_door'}], 'answer': 0, 'page': 9},
        {'say': V(S['activities'][0]['content'][1]['value']), 'options': [{'art': 'e_wave'}, {'art': 'e_ignore'}], 'answer': 0, 'page': 10},
        explore_round(S)]}),
    g('read', 9, read_lines(S['repeat']['items'], 9)),
    g('sort', 10, {'bins': [{'label': 'عِنْدَ الْحُضُورِ'}, {'label': 'عِنْدَ الْمُغَادَرَةِ'}],
                   'items': [{'text': V(x), 'bin': 0} for x in S['repeat']['items'] if base(V(x)) in ('السلام عليكم', 'صباح الخير', 'مرحبا بك', 'اهلا وسهلا')][:3] + [{'text': V(x), 'bin': 1} for x in S['enrich']['items']]},
      'ضَعْ كُلَّ تَحِيَّةٍ فِي سَلَّتِهَا'),
], {'name': 'مُلْصَقُ التَّحِيَّةِ', 'art': 'e_wave'}))
report['notes'].append('u1-greet: عنوانا السلّتين «عِنْدَ الْحُضُورِ / عِنْدَ الْمُغَادَرَةِ» من قاعدة ص١١ «ألقي التحية عند الحضور والمغادرة»؛ تحيات الحضور من ص٩ وعبارات المغادرة من ص١٠.')

S = LES['u1-tidy']
A = S['activities']
st = {s['key']: s for s in S['story']}
LESSONS.append(lesson('u1-tidy', 1, V(S['title']), [12, 19], [
    g('scene', 13, {'scene': scene('e_s_mess', ('butterfly', 'star')), 'prompts': prompts(S) + [{'text': V(S['explore']['q']) + ' ' + ' أَمْ '.join(V(o) for o in S['explore']['options']) + '؟', 'page': S['explore']['page']}]}),
    g('order', 16, story_order(S, ['mess', 'answer', 'zahraa', 'bags'], {'mess': 'e_s_mess', 'answer': 'e_s_answer', 'zahraa': 'e_s_zahraa', 'bags': 'e_s_bags'})),
    g('picchoose', 17, {'rounds': [{'say': V(c['value']), 'options': [{'art': a} for a in opts], 'answer': 0, 'page': 17} for c, opts in zip(A[3]['content'], [['e_knock', 'e_make_bed', 'e_raise_hand'], ['e_toys_away', 'e_knock', 'e_make_bed'], ['e_make_bed', 'e_toys_away', 'e_raise_hand'], ['e_raise_hand', 'e_knock', 'e_toys_away']])] + [
        {'say': 'اِخْتَرِ الصُّورَةَ الَّتِي تَدُلُّ عَلَى التَّرْتِيبِ', 'options': [{'art': 'e_room_tidy'}, {'art': 'e_room_messy'}], 'answer': 0, 'page': 15},
        {'say': 'اِخْتَرِ الصُّورَةَ الَّتِي تَدُلُّ عَلَى التَّرْتِيبِ', 'options': [{'art': 'e_line'}, {'art': 'e_crowd'}], 'answer': 0, 'page': 15}]}, 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ'),
    g('buildw', 18, {'pieces': ['د', 'ا', 'ر', 'ز', 'و', 'ق', 'ب'], 'per': 5, 'words': [{'word': V(w['word']), 'parts': list(base(V(w['word']))), 'art': {'house': 'house', 'sailboat': 'sailboat', 'door': 'bab'}[w['picture']]} for w in A[4]['words']]}),
], {'name': 'مُلْصَقُ التَّرْتِيبِ', 'art': 'e_room_tidy'}))
report['notes'].append('u1-tidy: جولتا ص١٥ نشاط ١ (الغرفتان والصفّان) دُمجتا في لعبة صور ص١٧، وسؤال «أفكر وأستكشف» ص١٥ صار سؤالاً يُسمع في صفحة القصة (الدرس أربع ألعاب).')
report['skipped'].append('ص١٦ نشاط ٣ (رتّب المتشابهات: حيوانات وفواكه وأدوات، صور بلا نص): حُذف ليبقى الدرس أربع ألعاب.')
report['skipped'].append('ص١٩ «رتّب أحداث هذه القصة» (أستيقظ، أغسل أسناني، أفطر، أذهب إلى المدرسة): الكتاب يترك المربعات فارغة ولا يحسم أسبق الفطور أم غسل الأسنان، والصور بلا نص يُسمع؛ فلم تُبنَ لعبة مُقيَّمة.')
report['notes'].append('u1-tidy/build (ص١٨): الكتاب يكتب «دار، زورق، باب» بأحرف منفصلة بلا شكل؛ القطع أحرف الكتاب كما هي، والكلمة المركّبة مشكولة.')
report['skipped'].append('ص١٨ «رتب الأرقام من الأصغر إلى الأكبر» (١–١٠): نشاط رياضيات لم يُبنَ لعبةً؛ الأرقام تُستعمل مشتِّتاتٍ في لعبة العدّ (u2-family).')

S = LES['u1-honest']
st = {s['key']: s for s in S['story']}
A = S['activities'][1]['content']
honest_rounds = [{'say': V(c['value']), 'show': True, 'options': [{'text': V(o) if isinstance(o, list) else o} for o in c['options']], 'answer': c['answer'], 'page': 24} for c in A]
if len(A[2]['count']) != 3 or A[2]['options'][A[2]['answer']] != '٣': bad.append('u1-honest: عدد أصدقاء لانا يجب أن يكون ٣')
report['checks'].append('u1-honest ص٢٤: «عدد أصدقاء لانا هو ٣» — محمد وزهراء ويوسف = ٣ (فُحص آلياً).')
LESSONS.append(lesson('u1-honest', 1, V(S['title']), [20, 25], [
    g('scene', 21, {'scene': scene('e_s_lana_sad', ('butterfly', 'cloud')), 'prompts': prompts(S, src_lines((S['quote'], 'text'), (S['bubble'], 'text'), (S['learned'], 'items')))}),
    g('order', 23, story_order(S, ['sad', 'advice', 'truth'], {'sad': 'e_s_lana_sad', 'advice': 'e_s_advice', 'truth': 'e_s_truth'})),
    g('picchoose', 24, {'rounds': [explore_round(S)] + honest_rounds}, 'اِخْتَرِ الْجَوَابَ الصَّحِيحَ'),
    g('truefalse', 25, tf_rounds(S)),
], {'name': 'مُلْصَقُ الصِّدْقِ', 'art': 'e_s_truth'}))
report['notes'].append('u1-honest: الشعار والفقاعة وما تعلمته (ص٢٠، ٢٥) صارت فقاعات تُسمع في صفحة القصة بعد أسئلة الحوار (الدرس أربع ألعاب). سؤال ص٢٤ «هل تأثرت لانا بكلام أصدقائها؟» جوابه «نعم» من القصة ص٢٢ (بعد نصيحتهم قررت قول الصدق).')
report['skipped'].append('ص٢٤ نشاط إثرائي «اللعبة التي تحبها»: لا جواب واحد فيه، فلم يُبنَ.')

S = LES['u1-trust']
E = S['enrich']['items']
LESSONS.append(lesson('u1-trust', 1, V(S['title']), [26, 30], [
    g('scene', 27, {'scene': scene('e_s_show_book', ('butterfly', 'trees')), 'prompts': prompts(S, src_lines((S['repeat'], 'items')))}),
    g('order', 29, story_order(S, ['window', 'ask', 'cry', 'names'], {'window': 'e_book_window', 'ask': 'e_s_show_book', 'cry': 'e_s_cry', 'names': 'e_s_names'}), 'رَتِّبْ رِحْلَةَ مُحَمَّدٍ'),
    g('picchoose', 29, {'rounds': [
        {'say': 'اِخْتَرِ الصُّورَةَ الْمُنَاسِبَةَ', 'options': [{'art': 'e_give_back'}, {'art': 'e_hide_book'}], 'answer': 0, 'page': 29},
        explore_round(S)] + [{'say': V(x['q']), 'show': True, 'options': opt_text(x['options']), 'answer': x['answer'], 'page': 30} for x in E if x['answer'] is not None]}, 'أُفَكِّرُ وَأَسْتَكْشِفُ'),
    g('maze', 30, {'grid': ['S.#....', '#.#.##.', '..#..#.', '.###.#.', '...#...', '##.#.#.', '.....#E'], 'pen': 'pencil', 'goal': 'e_pencil_boy', 'goalSay': V(S['share']['text'])}),
], {'name': 'مُلْصَقُ الْأَمَانَةِ', 'art': 'e_give_back'}))
report['skipped'].append('ص٣٠ «الأمانة لها علاقة بـ: الإخلاص / الصدق»: الخياران صحيحان فلم يُبنَ جولةً.')
report['notes'].append('u1-trust: «استمع وأردد» ص٢٩ صار فقاعات تُسمع في صفحة القصة، وعبارة «هيا نتشارك» ص٣٠ تُسمع عند وصول القلم في المتاهة (الدرس أربع ألعاب).')

S = LES['u1-respect']
H = S['habits']['items']
LESSONS.append(lesson('u1-respect', 1, V(S['title']), [31, 35], [
    g('scene', 32, {'scene': scene('e_s_remember', ('butterfly', 'star')), 'prompts': prompts(S, src_lines((S['quote'], 'text')))}),
    g('truefalse', 34, tf_rounds(S)),
    g('sort', 35, {'bins': [{'label': 'أَقُومُ بِهَا'}, {'label': 'لَا أَقُومُ بِهَا'}], 'items': [{'text': V(x['text']), 'bin': 0 if x['good'] else 1} for x in H if base(V(x['text'])) != 'العب في الصف']}, 'ضَعْ كُلَّ جُمْلَةٍ فِي سَلَّتِهَا'),
    g('picchoose', 34, {'rounds': [explore_round(S)] + [{'say': V(p), 'show': True, 'options': opt_text(S['repeat']['items']), 'answer': i, 'page': 34} for i, p in enumerate(S['repeat']['items'])]}, 'اِسْمَعْ وَاخْتَرِ الْعِبَارَةَ'),
], {'name': 'مُلْصَقُ الِاحْتِرَامِ', 'art': 'e_friends_hug'}))
report['notes'].append('u1-respect: عنوانا السلّتين «أَقُومُ بِهَا / لَا أَقُومُ بِهَا» من تعليمة ص٣٥؛ الجملة «ألعب في الصف» تُركت لأن اللعبة ستّ بطاقات، وصح/خطأ الجمل الست كلها؛ وشعار الدرس ص٣١ فقاعة تُسمع في صفحة القصة، وجمل «استمع وأردد» ص٣٤ خيارات مقروءة في لعبة العبارة.')

R = U1['review']
LESSONS.append(lesson('u1-review', 1, V(R['title']), [36, 38], [
    g('sort', 36, {'bins': [{'label': 'التَّصَرُّفُ الصَّحِيحُ'}, {'label': 'التَّصَرُّفُ غَيْرُ الصَّحِيحِ'}], 'items': [{'art': a, 'bin': b} for a, b in [('e_say_truth', 0), ('e_tissues', 1), ('e_raise_hand', 0), ('e_kick_cat', 1), ('e_friends_hug', 0), ('e_fight', 1)]]}),
    g('valuetree', 37, {'items': [{'text': V(x)} for x in R['tree']['items']], 'motto': {'text': V(R['motto']['text']), 'page': 37}}),
    g('match', 38, {'pairs': [V(x['name']) for x in R['characters']['items']], 'per': 3}, 'صِلْ كُلَّ اسْمٍ بِصُورَتِهِ'),
    g('picchoose', 38, {'rounds': [{'say': V(x['text']), 'options': [{'art': a} for a in opts], 'answer': 0, 'page': 38} for x, opts in zip(R['phrases']['items'], [['e_grandma_boy', 'e_make_bed', 'e_raise_hand'], ['e_make_bed', 'e_share_box', 'e_grandma_boy'], ['e_share_box', 'e_raise_hand', 'e_make_bed'], ['e_raise_hand', 'e_grandma_boy', 'e_share_box']])]}, 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ'),
], {'name': 'مُلْصَقُ الْوَحْدَةِ الْأُولَى', 'art': 'star'}, items=[{'value': V(x['name']), 'art': 'e_' + x['art'], 'page': 38} for x in R['characters']['items']]))
report['notes'].append('u1-review: لعبة التصنيف (ص٣٦) تضم صورتين من ص٣٥ (الصديقان والشجار) لتصير ستّ صور؛ عنوانا السلّتين من تعليمة ص٣٦.')
report['merges'].append('u1-review ← صور ص٣٥ (الصديقان متعانقان، الشجار) دُمجت في تصنيف ص٣٦.')
report['merges'].append('u1-review ← «الصدق طريق الجنة» (ص٣٧ نشاط ٤) يظهر فوق شجرة القيم (ص٣٧ نشاط ٥) ويُسمع.')
report['skipped'].append('ص٣٦ نشاط ٢ «رتب الصور بحسب الأرقام» (صور قصة نور بلا نص): حُذف ليبقى الدرس أربع ألعاب.')

# ======================= الوحدة الثانية: أنا وأسرتي =======================
S = LES['u2-feelings']
A5 = S['activities'][1]['content']
FACE = {'happy face': 'e_f_happy', 'angry face': 'e_f_angry', 'grimacing face': 'e_f_scared', 'shy face': 'e_f_shy', 'crying sad face': 'e_f_cry', 'scared face': 'e_f_scared', 'sad face': 'e_f_sad'}
CARD = {'أَنَا سَعِيدٌ': 'e_f_happy', 'أَنَا حَزِينٌ': 'e_f_sad', 'أَنَا غَاضِبٌ': 'e_f_angry', 'أَنَا خَجُولٌ': 'e_f_shy', 'أَنَا خَائِفٌ': 'e_f_scared'}
cards = [V(c['value']) for c in S['activities'][2]['content']]
order3 = [['e_f_sad', 'e_f_angry'], ['e_f_happy', 'e_f_shy'], ['e_f_scared', 'e_f_happy'], ['e_f_angry', 'e_f_sad'], ['e_f_shy', 'e_f_happy']]
LESSONS.append(lesson('u2-feelings', 2, V(S['title']), [41, 48], [
    g('scene', 42, {'scene': scene('e_s_cards', ('butterfly', 'trees')), 'prompts': prompts(S)}),
    g('picchoose', 47, {'rounds': [{'say': V(c['value']), 'art': a, 'options': [{'art': FACE[o]} for o in c['options']], 'answer': c['answer'], 'page': 47} for c, a in zip(A5, ['e_boy_angry', 'e_girl_sulky', 'e_girls_happy'])] + [explore_round(S)]}, 'اِخْتَرِ الْوَجْهَ الْمُنَاسِبَ'),
    g('choose', 48, {'rounds': [{'say': t, 'options': [{'art': CARD[t]}] + [{'art': x} for x in o], 'answer': 0} for t, o in zip(cards, order3)]}),
    g('read', 46, src_lines((S['repeat'], 'items'), (S['quote'], 'text'))),
], {'name': 'مُلْصَقُ الْمَشَاعِرِ', 'art': 'e_f_love'}))
report['notes'].append('u2-feelings: وجوه ص٤٧ رُسمت بطاقاتِ وجوه؛ الوجه «المكشّر» في الجولة الأولى رُسم وجهاً خائفاً.')

S = LES['u2-family']
A1 = S['activities'][0]['content']
FAM = {'mother': 'e_mother', 'sister': 'e_sister', 'father': 'e_father', 'brother': 'e_brother', 'grandfather': 'e_grandpa', 'grandmother': 'e_grandma'}
T = S['tree_counts']
if T['first'] + T['added'] != T['total']: bad.append('u2-family: ٤ + ٤ ≠ ٨')
AR = lambda n: str(n).translate(str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩'))
tree_rounds = [
    {'say': V(S['questions']['items'][3]), 'art': f"e_tree_{T['first']}", 'count': T['first'], 'options': [{'text': AR(n)} for n in (T['first'], 3, 5)], 'answer': 0, 'page': 52},
    {'say': V(S['questions']['items'][5]), 'art': f"e_tree_{T['total']}", 'count': T['total'], 'options': [{'text': AR(n)} for n in (T['total'], 4, 6)], 'answer': 0, 'page': 52},
    explore_round(S)]
report['outside'].append('u2-family: خيارات العدّ ٣ و٥ و٦ من أرقام ص١٨ (رتب الأرقام ١–١٠) في الوحدة الأولى.')
LESSONS.append(lesson('u2-family', 2, V(S['title']), [49, 54], [
    g('scene', 50, {'scene': scene('e_s_draw_tree', ('butterfly', 'trees')), 'prompts': prompts(S)}),
    g('match', 52, {'pairs': [V(c['value']) for c in A1], 'per': 3}),
    g('picchoose', 52, {'rounds': tree_rounds}, 'عُدَّ الْأَغْصَانَ وَاخْتَرْ'),
    g('read', 52, {'sentences': read_lines(S['repeat']['items'], 52)['sentences'] + [{'text': ' ، '.join(V(c['value']) for c in S['activities'][1]['content']), 'page': 53}]}),
], {'name': 'مُلْصَقُ أُسْرَتِي', 'art': 'e_s_family'}, items=[{'value': V(c['value']), 'art': FAM[c['picture']], 'page': 52} for c in A1]))

S = LES['u2-coop']
LESSONS.append(lesson('u2-coop', 2, V(S['title']), [55, 60], [
    g('scene', 56, {'scene': scene('e_s_breakfast', ('butterfly', 'flower_pot')), 'prompts': prompts(S)}),
    g('truefalse', 60, tf_rounds(S, [0, 1, 2, 3, 4, 6])),
    g('picmatch', 60, {'pairs': [{'from': a, 'to': b, 'say': s} for a, b, s in [('shoes', 'e_shoe_rack', None), ('clothes', 'e_wardrobe', None), ('e_toys', 'e_toybox', V(S['places']['label'])), ('e_rubbish', 'e_bin', None)]], 'per': 4}, 'صِلِ الشَّيْءَ بِمَكَانِهِ'),
    g('readpics', 58, {'sentences': read_lines(S['repeat']['items'], 58)['sentences']
        + [{'text': V(st['text']), 'page': st['page'], 'art': {'dishes': 'e_dishes', 'bed': 'e_bed_boy', 'garden': 'e_garden', 'window': 'e_window'}[st['key']]} for st in S['story'] if st.get('key') in ('dishes', 'bed', 'garden', 'window')]
        + [{'text': ' ، '.join(V(w['word']) for w in S['letters']['words']), 'page': S['letters']['page']}]}),
], {'name': 'مُلْصَقُ التَّعَاوُنِ', 'art': 'e_dishes'}))
report['notes'].append('u2-coop/picmatch (ص٦٠): الأشياء بلا أسماء في الكتاب فتتكلم صورة صندوق الألعاب وحدها بعبارتها «صُنْدُوقُ أَلْعَابٍ»؛ وصح/خطأ ست جمل من ثماني.')
report['notes'].append('u2-coop: نشاط ص٥٩ «رتّب أحداث القصة» صار صفحة استماع غير مُقيَّمة (صور الأعمال الأربعة مع كلام أصحابها ص٥٧)؛ لأن الكتاب لا يحسم ترتيب الأعمال (ترتيب الدوائر في ص٥٧ يخالف ترتيب الفقاعات). وكلمات «كوّن من الأحرف» ص٥٩ (أمي، أبي، أختي، أخي) سطر يُسمع في الصفحة نفسها.')
report['skipped'].append('ص٥٨ «أفكر وأستكشف» (أنجز يوسف وأسرته… لأنهم تعاونوا معاً) وص٥٨ نشاطا ١ و٢ (تعبير شفهي) وص٥٩ نشاط ٣ (مع من تتعاون؟ بلا جواب واحد): لم تُبنَ؛ الدرس أربع ألعاب.')

S = LES['u2-pride']
A = S['activities'][0]
LESSONS.append(lesson('u2-pride', 2, V(S['title']), [61, 65], [
    g('scene', 62, {'scene': scene('e_s_morning', ('butterfly', 'trees')), 'prompts': prompts(S)}),
    g('picchoose', 64, {'rounds': [
        {'say': 'سَمِّ الشُّعُورَ الَّذِي كَانَتْ تَشْعُرُ بِهِ سَارَةُ عِنْدَمَا اسْتَيْقَظَتْ وَلَمْ تَجِدْ أُمَّهَا فِي الْمَنْزِلِ', 'art': 'e_s_morning', 'options': [{'art': 'e_f_angry'}, {'art': 'e_f_sad'}, {'art': 'e_f_scared'}, {'art': 'e_f_happy'}], 'answer': 1, 'page': 64},
        explore_round(S),
        {'say': V(S['questions']['items'][4]), 'show': True, 'options': [{'art': 'e_nurse'}, {'art': 'e_teacher'}, {'art': 'e_engineer'}], 'answer': 0, 'page': 63}]}, 'اِخْتَرِ الْجَوَابَ الصَّحِيحَ'),
    g('order', 62, {'rounds': [{'items': [{'art': 'e_s_morning', 'text': V(S['story'][0]['text'])}, {'art': 'e_nurse', 'text': V(S['story'][1]['text'])}, {'art': 'e_s_hug_mom', 'text': V(S['story'][2]['text'])}]}]}),
    g('read', 63, src_lines((S['repeat'], 'items'), (S['quote'], 'text'))),
], {'name': 'مُلْصَقُ الْفَخْرِ', 'art': 'e_s_hug_mom'}))
report['notes'].append('u2-pride: سؤال الشعور بُني من نشاط ص٦٤ «سمِّ الشعور الذي كانت تشعر به سارة…» (الجواب: الحزن، من القصة ص٦٢)؛ والوجه «المتفاجئ» رُسم خائفاً. «ما مهنة أم سارة؟» (ص٦٣) خياراته صور مهن من الدرس الخامس.')
report['outside'].append('u2-pride: صورتا المعلمة والمهندسة في سؤال «ما مهنة أم سارة؟» من الدرسين الأول (المعلمة) والخامس (مهندسة، ص٦٨).')
N = U2['nashid']
LESSONS.append(lesson('u2-nashid', 2, '♪', [N['page']], [], {'name': '', 'art': 'star'}, kind='nashid',
    nashid={'title': V(N['heading']), 'poet': V(N['poet']), 'page': N['page'], 'audio': 'u2-nashid.mp3'}, scene=scene('e_s_hug_mom', ('butterfly', 'rose'))))

S = LES['u2-model']
JOB = {'soldier': 'e_soldier', 'engineer': 'e_engineer', 'farmer': 'e_farmer', 'nurse': 'e_nurse'}
jobs = [s for s in S['story'] if s.get('job')]
order4 = [['e_soldier', 'e_farmer', 'e_nurse'], ['e_engineer', 'e_soldier', 'e_nurse'], ['e_farmer', 'e_engineer', 'e_soldier'], ['e_nurse', 'e_farmer', 'e_engineer']]
WP = {'doctor': ('e_doctor', 'hospital'), 'farmer': ('e_farmer', 'field'), 'pilot': ('e_pilot', 'e_airplane'), 'worker': ('e_worker', 'e_factory'), 'teacher': ('e_teacher', 'school'), 'engineer': ('e_engineer', 'e_buildings')}
LESSONS.append(lesson('u2-model', 2, V(S['title']), [66, 71], [
    g('scene', 67, {'scene': scene('e_s_jobs', ('butterfly', 'trees')), 'prompts': prompts(S)}),
    g('picmatch', 70, {'pairs': [{'from': WP[a][0], 'to': WP[a][1], 'say': None} for a, b in S['workplaces']['pairs']], 'per': 3}, 'صِلْ كُلَّ شَخْصٍ بِمَكَانِ عَمَلِهِ'),
    g('picchoose', 68, {'rounds': [{'say': V(s['text']), 'show': True, 'options': [{'art': a} for a in o], 'answer': 0, 'page': 68} for s, o in zip(jobs, order4)] + [explore_round(S)]}, 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ'),
    g('readpics', 66, {'sentences': src_lines((S['quote'], 'text'))['sentences']
        + [dict({'text': V(v), 'page': S['vocab']['page']}, **({'art': a} if a else {})) for v, a in zip(S['vocab']['items'], [None, None, 'e_soldier', 'e_engineer', 'e_farmer', 'e_builder'])]
        + [{'text': V(x), 'page': S['learned']['page']} for x in S['learned']['items'][1:]]}),
], {'name': 'مُلْصَقُ قُدْوَتِي', 'art': 'e_s_jobs'}))
report['notes'].append('u2-model: «مهندس» في المفردات (ص٦٦) رُسم مهندسةً كما في كلام لانا (ص٦٨)، ومفردات ص٦٦ تُسمع مع صورها في صفحة «استمع وردد».')
report['skipped'].append('ص٧٠ نشاط إثرائي «محمد نبينا… قدوتنا»: لم يُعرض (عبارة دينية تخص النبي ﷺ؛ لا صور للأنبياء).')

R = U2['review']
LESSONS.append(lesson('u2-review', 2, V(R['title']), [72, 75], [
    g('sort', 72, {'bins': [{'label': V(b)} for b in R['faces']['bins']], 'items': [{'art': a, 'bin': b} for a, b in [('e_girl_cry', 1), ('e_girl_sad', 1), ('e_girl_laugh', 0), ('e_girl_smile', 0)]]}, 'ضَعْ كُلَّ وَجْهٍ فِي سَلَّتِهِ'),
    g('garden', 73, {'flower': 'rose', 'items': [{'text': V(x)} for x in R['roses']['items']]}),
    g('sort', 74, {'bins': [{'label': V(b)} for b in R['behaviour']['bins']], 'items': [{'art': a, 'bin': b} for a, b in [('e_push_water', 1), ('e_help_grandma', 0), ('e_firecracker', 1), ('e_water_plants', 0)]]}),
    g('read', 74, read_lines(R['lamp']['items'], 74)),
], {'name': 'مُلْصَقُ الْوَحْدَةِ الثَّانِيَةِ', 'art': 'rose'}))

report['second_reader'] = [
    'ص١٩ (ترتيب صور الصباح): لا جواب واحد في الكتاب (الفطور وغسل الأسنان) — حُذفت اللعبة المُقيَّمة.',
    'ص٣٥ (تصنيف العادات: أقوم بها / لا أقوم بها): الجواب واحد من معنى الجمل والدرس — بقيت مُقيَّمة.',
    'ص٣٦ (التصرف الصحيح/غير الصحيح) وص٣٨ (العبارة تحت الصورة، كل عبارة لصورة واحدة): الجواب واحد من الرسم — بقيتا مُقيَّمتين.',
    'ص٧٢ (وجوه سعيدة/حزينة) وص٧٤ (سلوك صحيح/غير صحيح): الجواب واحد من الرسم — بقيتا مُقيَّمتين.',
    'ص٥٩ (ترتيب الأعمال المنزلية): لا يحسمه الكتاب — صار صفحة استماع غير مُقيَّمة.',
    'ص٤٥ «أنه الحب» → «إِنَّهُ الْحُبُّ» (أول الكلام) صحيح؛ ص٧٣ «أصدقت» بقيت بحروف الكتاب مضبوطةً «أَصَدَقْتَ» (حديقة الأفعال غير مُقيَّمة).',
    'ص٥٨ «أخوتي» في الكتاب ضُبطت «إِخْوَتِي» (همزة القطع المكسورة)، وص٦١ «افتخر» ضُبطت «أَفْتَخِرُ».',
]
report['notes'].append('تقليص الألعاب إلى أربع في كل درس (قراءة ثانية): حُذفت أحجيتا الصورة (ص٨، ص٤٢) ولعبتا الذاكرة في «أنا ومشاعري» و«أعرف أسرتي» (مكررتان لبطاقات ص٤٨ ولعبة صل الكلمة ص٥٢)؛ وكلمات ص٥٣ (أبي، أمي، أختي، أخي، جدي، جدتي، أنا) سطر في صفحة «استمع وأردد».')

# ---------- الصوت والتعليمات ----------
for les in LESSONS:
    lid = les['id']
    reg(les['unitTitle'], f"u{les['unit']}", les['unitPage'], 'unit')
    reg(les['title'], lid, les['pages'][0], 'title')
    for i, it in enumerate(les['items']): it['audio'] = reg(it['value'], lid, it['page'], f'w{i+1:02d}')
    for gm in les['games']:
        gm['audio'] = reg(gm['say'], lid, gm['page'])
        d = gm['data']
        for i, p in enumerate(d.get('prompts', [])): p['audio'] = reg(p['text'], lid, p['page'], f'q{i+1:02d}')
        for r in d.get('rounds', []):
            for k in ('say', 'text', 'word', 'result'):
                if r.get(k): reg(r[k], lid, r.get('page', gm['page']))
            for o in r.get('options', []) + r.get('items', []):
                if o.get('text'): reg(o['text'], lid, r.get('page', gm['page']))
        for w in d.get('words', []): reg(w['word'], lid, gm['page'])
        for p in (d['pieces'] if isinstance(d.get('pieces'), list) else []): reg(p, lid, gm['page'])
        for s in d.get('sentences', []): s['audio'] = reg(s['text'], lid, s.get('page', gm['page']))
        for p in d.get('pairs', []):
            if isinstance(p, str): reg(p, lid, gm['page'])
            elif p.get('text'): reg(p['text'], lid, gm['page'])
            elif p.get('say'): reg(p['say'], lid, gm['page'])
        for it in d.get('items', []):
            if it.get('text'): reg(it['text'], lid, gm['page'])
        for b in d.get('bins', []): reg(b['label'], lid, gm['page'])
        if d.get('goalSay'): reg(d['goalSay'], lid, gm['page'])
        if d.get('motto'): d['motto']['audio'] = reg(d['motto']['text'], lid, d['motto']['page'])
    if les['sticker'].get('name'): les['sticker']['audio'] = reg(les['sticker']['name'], lid, les['pages'][0], 'sticker')
    if les.get('nashid'): reg(les['nashid']['title'], lid, les['pages'][0], 'ntitle')

BOOK = {'id': 'ethics', 'title': 'التَّرْبِيَةُ الْأَخْلَاقِيَّةُ', 'grade': 'لِلصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ', 'color': '#37b24d', 'color2': '#f06595', 'soft': '#e8f8ea', 'digits': 'arabic-indic', 'dir': 'rtl', 'lang': 'ar'}
reg(BOOK['title'], 'c', 1, 'booktitle')

# ---------- فحوص ----------
ARABIC_LETTER = re.compile('[ء-ي]')
def vowelled_enough(t):
    # كل كلمة عربية من حرفين فأكثر فيها حركة واحدة على الأقل
    return all(HAR.search(w) or len(ARABIC_LETTER.findall(w)) < 2 for w in t.split())
for les in LESSONS:
    if les['kind'] != 'nashid' and len(les['games']) < 3: bad.append(les['id'] + ': أقل من ثلاث ألعاب')
    if len(les['games']) > 4: bad.append(les['id'] + ': أكثر من أربع ألعاب')
    for gm in les['games']:
        if len(gm['say'].split()) > 6: bad.append(f"{les['id']}: تعليمة طويلة {gm['say']}")
        n = len(gm['data'].get('rounds', [])) or len(gm['data'].get('pairs', [])) or 0
        if gm['template'] in ('picchoose', 'choose', 'truefalse', 'match', 'picmatch') and not 2 <= n <= 6: bad.append(f"{les['id']}/{gm['template']}: عدد الجولات {n}")
        for r in gm['data'].get('rounds', []):
            if 'options' in r and not 2 <= len(r['options']) <= 4: bad.append(f"{les['id']}: خيارات {len(r['options'])}")
            if 'answer' in r and not 0 <= r['answer'] < len(r['options']): bad.append(f"{les['id']}: جواب خارج الخيارات")
        if gm['template'] in ('build', 'buildw'):
            for w in gm['data']['words']:
                if base(''.join(w['parts'])) != base(w['word']).replace(' ', ''): bad.append(f"{les['id']}: تقطيع خاطئ {w['word']}")
                if not all(p in gm['data']['pieces'] for p in w['parts']): bad.append(f"{les['id']}: قطعة ناقصة {w['word']}")
for t in audio:
    if t in ('♪',) or re.fullmatch('[٠-٩]+', t): continue
    if not vowelled_enough(t): bad.append('غير مشكول: ' + t)
# العدّ: عدد الأغصان المرسومة فعلاً في e_tree_N يساوي الجواب
counts = {}
for les in LESSONS:
    for gm in les['games']:
        for r in gm['data'].get('rounds', []):
            if 'count' in r:
                counts[r['art']] = r['count']
                ans = r['options'][r['answer']]['text']
                if ans != AR(r['count']): bad.append(f"{les['id']}: جواب العدّ {ans} ≠ {r['count']}")
if counts:
    js = "const m=await import('%s');const A=Object.values(m)[0];const o={};for(const k of %s)o[k]=(A[k]().match(/class=\"branch\"/g)||[]).length;console.log(JSON.stringify(o));" % (os.path.join(ROOT, 'src/art/ethics-scenes.js'), json.dumps(list(counts)))
    drawn = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True, cwd=ROOT).stdout or '{}')
    for k, n in counts.items():
        if drawn.get(k) != n: bad.append(f'العدّ: {k} يرسم {drawn.get(k)} غصناً والمطلوب {n}')
        else: report['checks'].append(f'{k}: عدد الأغصان المرسومة {n} = الجواب (فُحص بتشغيل الرسم).')
# المتاهة: يوجد طريق من البداية إلى النهاية
for les in LESSONS:
    for gm in les['games']:
        if gm['template'] != 'maze': continue
        G = gm['data']['grid']; n = len(G); st = [(r, c) for r in range(n) for c in range(n) if G[r][c] == 'S'][0]; seen = {st}; q = [st]
        while q:
            r, c = q.pop()
            for a, b in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= a < n and 0 <= b < n and G[a][b] != '#' and (a, b) not in seen: seen.add((a, b)); q.append((a, b))
        if not any(G[r][c] == 'E' for r, c in seen): bad.append(les['id'] + ': المتاهة بلا طريق')
# كل رسم مستعمل موجود
artjs = "const fs=await import('fs');const {ART}=await import('%s');for(const f of fs.readdirSync('%s').filter(f=>f.endsWith('.js')&&f!=='index.js')){const m=await import('%s/'+f);Object.values(m).forEach(o=>{for(const k in o)if(!ART[k])ART[k]=o[k]})};console.log(JSON.stringify(Object.keys(ART)));" % (os.path.join(ROOT, 'src/art.js'), os.path.join(ROOT, 'src/art'), os.path.join(ROOT, 'src/art'))
keys = set(json.loads(subprocess.run(['node', '--input-type=module', '-e', artjs], capture_output=True, text=True, cwd=ROOT).stdout or '[]'))
used = set(re.findall(r'"(?:art|sample|from|to|pen|goal|flower)": "([a-z_0-9]+)"', json.dumps(LESSONS)))
used |= {a for les in LESSONS for gm in les['games'] if gm['template'] == 'similar' for grp in gm['data']['groups'] for a in grp['items']}
for k in sorted(used - keys): bad.append('رسم مفقود: ' + k)

print('lessons', len(LESSONS), 'games', sum(len(l['games']) for l in LESSONS), 'clips', len(rows))
[print('!', b) for b in bad]
js = '// مولَّد آلياً من tools/build_ethics.py — لا تعدّله يدوياً\n'
js += 'export const BOOK = ' + json.dumps(BOOK, ensure_ascii=False) + ';\nexport const COMMON = ' + json.dumps(COMMON, ensure_ascii=False) + ';\n'
js += 'export const AUDIO = ' + json.dumps(audio, ensure_ascii=False) + ';\nexport const LESSONS = ' + json.dumps(LESSONS, ensure_ascii=False) + ';\n'
open(os.path.join(OUT, 'lessons.js'), 'w', encoding='utf-8').write(js)
json.dump({'book': BOOK, 'lessons': LESSONS}, open(os.path.join(OUT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'audio-list.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['اسم الملف', 'النص المشكول', 'الدرس', 'الصفحة']); w.writerows(rows)
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
sys.exit(1 if bad else 0)
