#!/usr/bin/env python3
"""يبني دروس «English for Iraq — 1st Primary Pupil's Book» من books/english/source/u*.json
ويكتب books/english/lessons.js و lessons.json و audio-list.csv و report.json.
كل كلمة وجملة إنكليزية مأخوذة من الكتاب مع رقم صفحتها؛ والتعليمات عربية قصيرة مشكولة.
"""
import json, csv, os, re, random, sys
random.seed(11)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'books', 'english', 'source')
OUT = os.path.join(ROOT, 'books', 'english')
U = {i: json.load(open(os.path.join(SRC, f'u{i}.json'), encoding='utf-8')) for i in range(1, 9)}
AP = lambda s: s.replace("'", '’')  # الكتاب يطبع الفاصلة العليا المنحنية

# ---------- السجل الصوتي ----------
audio, rows = {}, []
def reg(text, lid, page, key=None):
    if not text: return None
    if text in audio: return audio[text]
    fn = f'{lid}-{key or "x" + str(len(rows))}.mp3'
    audio[text] = fn; rows.append([fn, text, lid, page]); return fn

SAY = {
    'abc': 'اِلْمَسِ الْحَرْفَ وَالصُّوَرَ وَاسْمَعْ', 'words': 'اِلْمَسْ كُلَّ صُورَةٍ وَاسْمَعْ', 'trace': 'تَتَبَّعِ الْحَرْفَ بِإِصْبَعِكَ',
    'talk': 'اِلْمَسْ كُلَّ فُقَّاعَةٍ وَاسْمَعْ', 'balloons': 'فَرْقِعِ الْبَالُونَ الَّذِي تَسْمَعُهُ', 'match': 'اِسْحَبِ الْكَلِمَةَ إِلَى صُورَتِهَا',
    'choose': 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ', 'sound': 'اِسْمَعِ الْحَرْفَ وَاخْتَرْ صُورَتَهُ', 'colour': 'اِسْمَعْ وَاخْتَرِ اللَّوْنَ',
    'sentence': 'اِسْمَعِ الْجُمْلَةَ وَاخْتَرْ صُورَتَهَا', 'number': 'اِسْمَعْ وَاخْتَرِ الْعَدَدَ', 'memory': 'اِقْلِبْ بِطَاقَتَيْنِ مُتَشَابِهَتَيْنِ',
    'count': 'عُدَّ وَاخْتَرِ الْعَدَدَ', 'yesno': 'اِسْمَعِ السُّؤَالَ وَأَجِبْ', 'build': 'رَكِّبِ الْكَلِمَةَ مِنْ حُرُوفِهَا',
    'read': 'اِسْمَعْ وَاقْرَأْ مَعِي', 'sort': 'ضَعْ كُلَّ صُورَةٍ فِي سَلَّتِهَا',
}
COMMON = {'praise': ['أَحْسَنْتَ!', 'رَائِعٌ!', 'مُمْتَازٌ!'], 'encourage': ['حَاوِلْ مَرَّةً أُخْرَى', 'هَيَّا مَرَّةً أُخْرَى'], 'star': 'نَجْمَةٌ جَدِيدَةٌ!', 'sticker': 'مُلْصَقٌ جَدِيدٌ لِدَفْتَرِكَ!', 'welcome': 'هَيَّا نَلْعَبُ وَنَتَعَلَّمُ!', 'map': 'اِخْتَرْ دَرْسًا مِنَ الطَّرِيقِ'}
for k, v in COMMON.items():
    for j, t in enumerate(v if isinstance(v, list) else [v]): reg(t, 'c', '', f'{k}{j+1}')
for k, t in SAY.items(): reg(t, 'c', '', k)

# ---------- قاموس الكلمات والصور (من الكتاب) ----------
ART = {}      # word -> art
WPAGE = {}    # word -> first page
LETTER_WORDS = {}
for i, u in U.items():
    for L in u['lessons']:
        for w in L.get('words', []):
            if isinstance(w, dict): ART.setdefault(w['w'], w['pic']); WPAGE.setdefault(w['w'], L['pages'][0])
        for k in ('labels', 'family'):
            for w in L.get(k, []):
                if w.get('pic'): ART.setdefault(w['w'], w['pic'])
                WPAGE.setdefault(w['w'], w.get('page', L['pages'][0]))
        if L.get('letter'): LETTER_WORDS[L['letter']] = [w['w'] for w in L['words']]
        for l, w in zip(L.get('letters', []), L.get('words', []) if L['kind'] == 'letters' else []): LETTER_WORDS[l] = [w['w']]
COLOUR_ART = {c: 'en_c_' + c for c in ['blue', 'red', 'yellow', 'orange', 'green', 'pink', 'black', 'white', 'brown', 'grey']}

report = {'inferred': [], 'notes': [], 'outside': [], 'skipped': [], 'fixes': 0}
LESSONS = []

def lesson(lid, ui, title, pages, kind='lesson'):
    u = U[ui]
    les = {'id': lid, 'book': 'english', 'unit': ui, 'unitTitle': u['title'], 'unitPage': u['pages'][0], 'pages': pages, 'title': title, 'kind': kind, 'items': [], 'syllables': [], 'games': []}
    LESSONS.append(les); return les
def item(les, w, page=None):
    if w not in [x['value'] for x in les['items']]:
        les['items'].append({'value': w, 'page': page or WPAGE.get(w, les['pages'][0]), 'art': ART.get(w)})
def G(les, t, page, data, say=None):
    g = {'template': t, 'page': page, 'data': data}
    if say: g['say'] = say
    les['games'].append(g); return g
def outside(lid, what): report['outside'].append(f'{lid}: {what}')

letters_so_far = []
def pick_others(pool, k, avoid):
    p = [x for x in pool if x not in avoid]; random.shuffle(p); return p[:k]
def choose_rounds(targets, pool, k=3, kind='art'):
    rr = []
    for t in targets:
        opts = [t] + pick_others(pool, k - 1, [t]); random.shuffle(opts)
        rr.append({'say': t, 'options': [{'art': ART[o]} if kind == 'art' else {'text': o} for o in opts], 'answer': opts.index(t)})
    return rr
def talk(les, lines, page, who=None):
    ls = [{'text': AP(l['t']), 'page': l['page'], **({'who': who(l['t'])} if who and who(l['t']) else {})} for l in lines]
    les.setdefault('lines', []).extend(ls)
    G(les, 'talk', page, {'lines': ls}, SAY['talk'])
robot_who = lambda t: 'en_robot' if 'Robbie' in t else None

# ---------- الوحدات ----------
seen_words = []
for ui in range(1, 9):
    u = U[ui]
    for L in u['lessons']:
        kind, pg = L['kind'], L['pages'][0]
        if kind == 'project':
            report['skipped'].append(f'الوحدة {ui} ص {L["pages"][0]}–{L["pages"][-1]}: مشروع يدوي ({L["text"]}) — لا لعبة.'); continue
        if kind == 'picture':
            report['skipped'].append(f'الوحدة {ui} ص {pg}: نشاط صور بلا نص كافٍ ({L.get("notes", "")}).'); continue
        if kind in ('letter', 'letters'):
            lts = [L['letter']] if kind == 'letter' else L['letters']
            words = [w['w'] for w in L['words']]
            les = lesson(f'u{ui}-' + ''.join(lts), ui, ' '.join(lts), L['pages'], 'letter')
            for w in words: item(les, w, pg)
            G(les, 'abc', pg, {'letters': lts, 'items': words}, SAY['abc'])
            for lt in lts: G(les, 'trace', L['trace'][0], {'shape': 'lat_' + lt}, SAY['trace'])
            letters_so_far += lts
            seen_words += [w for w in words if w not in seen_words]
            n = len([x for x in LESSONS if x['kind'] == 'letter'])
            if L.get('lines'): talk(les, L['lines'], pg, robot_who)
            # ألعاب إضافية حسب ما في الصفحة
            lid = les['id']
            if lid == 'u2-h':
                labs = [w['w'] for w in L['labels']]
                for w in labs: item(les, w, 19)
                G(les, 'match', 19, {'pairs': ['book', 'ruler', 'pencil case', 'bag', 'pencil'], 'per': 3}, SAY['match'])
            elif lid == 'u2-k':
                rounds = [{'say': 'Is it a pen?', 'art': 'pencil', 'answer': False}, {'say': 'Is it a pencil?', 'art': 'pencil', 'answer': True}, {'say': 'Is it a pen?', 'art': 'en_pen', 'answer': True}]
                G(les, 'yesno', 22, {'yes': 'Yes.', 'no': 'No.', 'rounds': rounds}, SAY['yesno'])
                report['inferred'].append('u2-k: صور «نعم/لا» (قلم رصاص/قلم حبر) مرسومة لأسئلة الكتاب ص ٢٢؛ الجواب في الكتاب No. ثم Yes.')
            elif lid == 'u4-u':
                rounds = [{'say': 'Is it a bus?', 'art': 'en_bus', 'answer': True}, {'say': 'Is it a bus?', 'art': 'car', 'answer': False}, {'say': 'Is it a bus?', 'art': 'en_van', 'answer': False}]
                G(les, 'yesno', 38, {'yes': 'Yes.', 'no': 'No.', 'rounds': rounds}, SAY['yesno'])
                outside(lid, 'صورتا السيارة والشاحنة (car ص ١٠، van ص ٣٩) خيارات للسؤال «Is it a bus?».')
            elif lid == 'u3-o':
                rr = [{'items': ['balloon'] * n, 'options': sorted(set([n] + random.sample([x for x in range(1, 6) if x != n], 2))), 'after': str(n)} for n in (2, 4, 1, 5, 3)]
                G(les, 'count', 30, {'rounds': rr}, SAY['count'])
            elif lid == 'u3-p':
                toys = ['en_kite', 'car', 'en_plane', 'doll', 'ball']
                rr = [{'say': 'How many toys?', 'items': [toys[j]] * n, 'options': sorted(set([n] + random.sample([x for x in range(6, 11) if x != n], 2))), 'after': str(n)} for j, n in enumerate((7, 9, 6, 10))]
                G(les, 'count', 31, {'rounds': rr}, SAY['count'])
                report['notes'].append('u3-p: لعبة العدّ تستعمل الأعداد ٦–١٠ وسؤال «How many toys?» ص ٣١؛ أعداد الألعاب المرسومة من اختيار اللعبة.')
            elif lid == 'u4-v':
                rr = [{'say': 'How many vans can you see?', 'items': ['en_van'] * n, 'options': sorted(set([n] + random.sample([x for x in range(1, 11) if x != n], 2))), 'after': str(n)} for n in (3, 5, 8)]
                G(les, 'count', 39, {'rounds': rr}, SAY['count'])
                report['notes'].append('u4-v: أعداد الشاحنات المرسومة من اختيار اللعبة (الأعداد ١–١٠ من الوحدة ٣).')
            elif lid == 'u3-s':
                ages = L['ages']['pics']
                rr = []
                for key in ['b', 'd', 'f', 'c']:
                    n = ages[key]; opts = [n] + random.sample([x for x in ages.values() if x != n], 2); random.shuffle(opts)
                    rr.append({'say': AP(f"I'm {n}."), 'options': [{'text': str(o)} for o in opts], 'answer': opts.index(n)})
                G(les, 'choose', 34, {'rounds': rr}, SAY['number'])
                report['notes'].append('u3-s: جمل «I’m 5.» وأخواتها من تفريغ الاستماع ص ٨٦ (المسار ٤٨) والأعداد المرسومة في صور ص ٣٤.')
            elif lid == 'u3-t':
                grid = ['orange', 'apple', 'desk', 'sun', 'fish', 'monkey', 'taxi', 'kite', 'elephant', 'pizza', 'flower', 'snake', 'cake', 'duck', 'bag', 'tomato', 'moon', 'house', 'ant', 'horse']
                pool = [w for w in grid if w in ART]
                G(les, 'choose', 35, {'rounds': choose_rounds(['tomato', 'kite', 'duck', 'sun'], pool)}, SAY['choose'])
                report['inferred'].append('u3-t: صور شبكة ص ٣٥ بلا كتابة؛ أسماؤها من كلمات الكتاب نفسه.')
            elif lid == 'u4-xyz':
                pool = [l for l in letters_so_far if l >= 'p']
                G(les, 'balloons', 41, {'choices': pool[-8:], 'targets': ['x', 'y', 'z', 'w'], 'per': 4}, SAY['balloons'])
                outside(lid, 'بالونات الحروف تضم حروفاً من دروس سابقة (p–w).')
            elif lid == 'u3-r':
                item(les, 'cake', 33)
            # لعبة ثالثة بالتناوب إن لم تكن للدرس لعبة خاصة كافية
            if len(les['games']) < 4 + (len(lts) - 1):
                prevw = [w for w in seen_words if w in ART]
                mode = ['sound', 'balloons', 'memory', 'choose'][n % 4]
                if mode == 'sound' and len(letters_so_far) >= 3:
                    others = [x for x in letters_so_far[:-1]]
                    pool = [w for x in others for w in LETTER_WORDS.get(x, []) if w in ART]
                    rr = []
                    for w in words[:2] + words[:1]:
                        opts = [w] + pick_others(pool, 2, [w]); random.shuffle(opts)
                        rr.append({'say': lts[0], 'options': [{'art': ART[o], 'text': o} for o in opts], 'answer': opts.index(w)})
                    G(les, 'choose', pg, {'rounds': rr}, SAY['sound']); outside(lid, 'صور الخيارات في «اسمع الحرف» من دروس سابقة.')
                elif mode in ('balloons', 'sound') and len(letters_so_far) >= 3:
                    ch = letters_so_far[-6:]
                    tg = [lts[0], ch[-2], lts[0], ch[-3]]
                    G(les, 'balloons', pg, {'choices': ch, 'targets': tg, 'per': 3}, SAY['balloons']); outside(lid, 'بالونات الحروف تضم حروفاً من دروس سابقة.')
                elif mode == 'memory' and len(prevw) >= 4:
                    pw = words + [w for w in reversed(prevw) if w not in words][:4 - len(words)]
                    G(les, 'memory', pg, {'pairs': [{'text': w, 'art': ART[w]} for w in pw]}, SAY['memory']); outside(lid, 'بطاقات الذاكرة تضم كلمات من دروس سابقة.')
                    for w in pw: item(les, w)
                elif len(prevw) >= 3:
                    pool = prevw[-8:]
                    tg = words + [w for w in reversed(prevw) if w not in words][:3 - len(words)]
                    G(les, 'choose', pg, {'rounds': choose_rounds(tg, pool)}, SAY['choose']); outside(lid, 'خيارات «اسمع واختر» تضم كلمات من دروس سابقة.')
                    for w in tg: item(les, w)
            les['sticker'] = {'name': words[0], 'art': ART[words[0]]}
            continue
        if kind == 'colours':
            les = lesson(f'u{ui}-col{pg}', ui, '★', L['pages'])
            cols = L['colours']
            for c in cols: les['items'].append({'value': c, 'page': pg, 'art': COLOUR_ART[c]}); WPAGE.setdefault(c, pg)
            G(les, 'abc', pg, {'letters': [], 'items': cols}, SAY['words'])
            allc = [c for c in COLOUR_ART if c in WPAGE]
            tg = (cols * 2)[:4] if len(cols) < 4 else cols
            rr = []
            for c in tg[:4]:
                opts = [c] + pick_others(allc, 2, [c]); random.shuffle(opts)
                rr.append({'say': c, 'options': [{'art': COLOUR_ART[o]} for o in opts], 'answer': opts.index(c)})
            G(les, 'choose', pg, {'rounds': rr}, SAY['colour'])
            if len(allc) > len(cols): outside(les['id'], 'خيارات الألوان تضم ألواناً من دروس سابقة.')
            if L.get('letterGrid'):
                G(les, 'balloons', 14, {'choices': ['a', 'b', 'c'], 'targets': ['a', 'c', 'b', 'a'], 'per': 3}, SAY['balloons'])
                report['notes'].append('u1-col14: بالونات الحروف a b c من شبكة الحروف الملوّنة ص ١٤.')
            if L.get('lines'): talk(les, L['lines'], pg)
            les['sticker'] = {'name': cols[0], 'art': COLOUR_ART[cols[0]]}
            continue
        if kind == 'story' and len(L['lines']) < 3:
            les = lesson(f'u{ui}-story', ui, '📖', L['pages'], 'nashid')
            les['nashid'] = {'title': L['title'], 'poet': '', 'page': pg, 'audio': f'u{ui}-story.mp3'}
            les['scene'] = {'items': [{'art': 'school', 'x': 20, 'y': 60, 'w': 140}, {'art': 'en_robot', 'x': 190, 'y': 90, 'w': 90}, {'art': 'blackboard', 'x': 290, 'y': 80, 'w': 90}], 'bg': {}}
            report['notes'].append(f'u{ui}-story: قصة «{L["title"]}» ص {pg} فيها جملة واحدة ({L["lines"][0]["t"]})، فعُرضت صفحةَ عنوان.')
            continue
        if kind == 'song':
            les = lesson(f'u{ui}-song', ui, '♪', L['pages'], 'nashid')
            les['nashid'] = {'title': L['title'], 'poet': '', 'page': pg, 'audio': f'u{ui}-song.mp3'}
            les['scene'] = {'items': [{'art': 'elephant', 'x': 20, 'y': 110, 'w': 100}, {'art': 'elephant', 'x': 140, 'y': 120, 'w': 90}, {'art': 'elephant', 'x': 250, 'y': 110, 'w': 100}], 'bg': {}}
            continue
        # دروس المفردات والجمل والقصص
        lid = f'u{ui}-' + ('story' if kind == 'story' else f'p{pg}')
        les = lesson(lid, ui, '📖' if kind == 'story' else '★', L['pages'])
        labs = [w['w'] for w in L.get('labels', [])] + [w['w'] for w in L.get('family', [])]
        for w in labs: item(les, w)
        seen_words += [w for w in labs if w not in seen_words and w in ART]
        lines = L.get('lines', [])
        if lid == 'u5-p44':
            G(les, 'abc', pg, {'letters': [], 'items': labs}, SAY['words'])
            G(les, 'match', pg, {'pairs': labs, 'per': 3}, SAY['match'])
        elif lid == 'u5-p46':
            G(les, 'abc', pg, {'letters': [], 'items': labs}, SAY['words'])
            G(les, 'choose', pg, {'rounds': choose_rounds(labs, labs)}, SAY['choose'])
            tl = L['transcript']; talk(les, tl, 89)
            report['inferred'].append('u5-p46: ربط funny/little/big/long بصور القرود والنمل والجمل والأفعى من صور ص ٤٦ وتفريغ المسار ٦٣ ص ٨٩.')
        elif lid == 'u5-p47':
            T = L['transcript']
            spec = [('How many red fish?', 'en_fish_red', 2, None), (None, 'en_fish_blue', 4, AP(T[1]['t'])), (None, 'penguin', 2, AP(T[2]['t'])), (None, 'monkey', 3, AP(T[3]['t'])), (None, 'lion', 3, AP(T[4]['t']))]
            rr = []
            for q, a, n, after in spec:
                opts = sorted(set([n] + random.sample([x for x in range(1, 7) if x != n], 2)))
                r = {'items': [a] * n, 'options': opts, 'after': after or str(n)}
                if q: r['say'] = q
                rr.append(r)
            G(les, 'count', 47, {'rounds': rr}, SAY['count'])
            talk(les, lines + T[:3], 47); item(les, 'fish', 47)
            report['notes'].append('u5-p47: السؤال «How many red fish?» وجوابه 2 من ص ٤٧، وبقية الجولات من تفريغ المسار ٦٤ ص ٨٩.')
        elif lid in ('u5-p48', 'u5-p49', 'u6-p57', 'u6-p59', 'u7-p65', 'u7-p66', 'u7-p67'):
            G(les, 'match', pg, {'pairs': labs if len(labs) <= 5 else labs[:5], 'per': 3}, SAY['match'])
            if len(labs) >= 4: G(les, 'memory', pg, {'pairs': [{'text': w, 'art': ART[w]} for w in labs[:4]]}, SAY['memory'])
            else: G(les, 'abc', pg, {'letters': [], 'items': labs}, SAY['words'])
            if lines and lid == 'u7-p67':
                pics = {'I have a green taxi.': 'en_taxi_green', 'I have a yellow car.': 'en_car_yellow', 'I have a green car.': 'en_car_green'}
                rr = []
                for l in lines:
                    opts = list(pics.values()); random.shuffle(opts)
                    rr.append({'say': AP(l['t']), 'options': [{'art': o} for o in opts], 'answer': opts.index(pics[l['t']])})
                G(les, 'choose', 67, {'rounds': rr}, SAY['sentence']); les.setdefault('lines', []).extend([{'text': AP(l['t']), 'page': 67} for l in lines])
            elif lines and lid == 'u6-p59':
                G(les, 'read', 59, {'sentences': [{'text': AP(l['t'])} for l in lines]}, SAY['read'])
            elif lines: talk(les, lines, pg)
        elif lid == 'u5-p50':
            def bw(ws):
                return {'pieces': list(dict.fromkeys(c for w in ws for c in w)), 'words': [{'word': w, 'parts': list(w), 'art': ART[w]} for w in ws]}
            G(les, 'build', 50, bw(['ant', 'bus', 'cat']), SAY['build'])
            G(les, 'build', 50, bw(['dog', 'egg', 'goat']), SAY['build'])
            for w in ['ant', 'bus', 'cat', 'dog', 'egg', 'goat']: item(les, w, 50)
        elif lid == 'u5-p51':
            pics = {"There is a dog in a bus.": 'en_s_dogbus', 'There is a green fish.': 'en_fish_green', 'There are 3 cats.': 'en_s_3cats', 'There is a goat in a bus.': 'en_s_goatbus', 'There is an ant on a bag.': 'en_s_antbag', 'There is a dog and a cat on a horse.': 'en_s_dogcathorse'}
            talk(les, lines[:4], 51)
            rr = []
            for l in lines[:5]:
                opts = [pics[l['t']]] + random.sample([v for k, v in pics.items() if k != l['t']], 2); random.shuffle(opts)
                rr.append({'say': AP(l['t']), 'options': [{'art': o} for o in opts], 'answer': opts.index(pics[l['t']])})
            G(les, 'choose', 51, {'rounds': rr}, SAY['sentence'])
            G(les, 'read', 51, {'sentences': [{'text': AP(l['t'])} for l in lines]}, SAY['read'])
        elif lid == 'u6-p54':
            # ص ٥٤–٥٥ معاً
            l55 = next(x for x in U[6]['lessons'] if x['pages'] == [55])['lines']
            talk(les, lines + l55, 54); les['pages'] = [54, 55]
            for w, a in (('ears', 'ear'), ('nose', 'en_nose'), ('eyes', 'en_eyes')): ART.setdefault(w, a); item(les, w, 55)
            G(les, 'choose', 55, {'rounds': [{'say': AP(x['t']), 'options': [{'art': 'ear'}, {'art': 'en_nose'}, {'art': 'en_eyes'}], 'answer': ['My ears!', 'My nose.', 'My eyes.'].index(x['t'])} for x in lines + l55]}, SAY['sentence'])
            report['inferred'].append('u6-p54: صور الأذن والأنف والعينين مرسومة لجمل ص ٥٤–٥٥.')
        elif lid == 'u6-p55':
            LESSONS.pop(); continue
        elif lid == 'u6-p56':
            G(les, 'abc', 56, {'letters': [], 'items': labs}, SAY['words'])
            G(les, 'match', 56, {'pairs': labs[:5], 'per': 3}, SAY['match'])
            G(les, 'choose', 56, {'rounds': choose_rounds(['head', 'hands', 'toes', 'eyes'], labs)}, SAY['choose'])
        elif lid == 'u6-p58':
            l60 = next(x for x in U[6]['lessons'] if x['pages'] == [60])['lines']
            LESSONS.pop(); continue
        elif lid == 'u6-p60':
            pics = {'I wash my face.': 'face', 'I wash my hands.': 'hand', 'I wash my feet.': 'foot', 'I wash my hair.': 'en_hair'}
            talk(les, lines, 60)
            rr = []
            for l in lines:
                opts = list(pics.values()); random.shuffle(opts); opts = [pics[l['t']]] + [o for o in opts if o != pics[l['t']]][:2]; random.shuffle(opts)
                rr.append({'say': AP(l['t']), 'options': [{'art': o} for o in opts], 'answer': opts.index(pics[l['t']])})
            G(les, 'choose', 60, {'rounds': rr}, SAY['sentence'])
            report['inferred'].append('u6-p60: صور الوجه واليد والقدم والشعر مرسومة لجمل ص ٦٠.')
        elif lid == 'u6-p61':
            talk(les, lines, 61)
            l58 = next(x for x in U[6]['lessons'] if x['pages'] == [58])['lines']
            G(les, 'read', 58, {'sentences': [{'text': AP(l['t'])} for l in l58 + lines]}, SAY['read'])
            les['pages'] = [58, 61]
            report['notes'].append('u6-p61: جملة ص ٥٨ «I have three red ears.» (مطبوعة «Ihave» بلا مسافة) ضُمّت إلى درس ص ٦١.')
        elif lid == 'u7-p64':
            fam = [w['w'] for w in L['family']]
            G(les, 'match', 64, {'pairs': [w['w'] for w in L['labels']], 'per': 3}, SAY['match'])
            G(les, 'abc', 64, {'letters': [], 'items': fam}, SAY['words'])
            G(les, 'memory', 64, {'pairs': [{'text': w, 'art': ART[w]} for w in fam[:4]]}, SAY['memory'])
        elif lid == 'u7-p68':
            G(les, 'abc', 68, {'letters': [], 'items': labs}, SAY['words'])
            G(les, 'choose', 68, {'rounds': choose_rounds(labs[:4], labs)}, SAY['choose'])
            talk(les, lines, 68)
        elif lid == 'u7-p69':
            G(les, 'abc', 69, {'letters': [], 'items': labs}, SAY['words'])
            G(les, 'match', 69, {'pairs': labs, 'per': 3}, SAY['match'])
            cols = L['colours']; rr = []
            for c in cols:
                opts = [c] + pick_others(cols, 2, [c]); random.shuffle(opts)
                rr.append({'say': c, 'options': [{'art': COLOUR_ART[o]} for o in opts], 'answer': opts.index(c)})
            G(les, 'choose', 69, {'rounds': rr}, SAY['colour'])
            for c in cols: les['items'].append({'value': c, 'page': 69, 'art': COLOUR_ART[c]})
        elif lid == 'u7-p70':
            pics = {'I have a green key.': 'en_key_green', 'I have a red key.': 'en_key_red', 'I have a blue jumper.': 'en_jumper_blue', 'I have a yellow jumper.': 'en_jumper_yellow'}
            talk(les, lines, 70)
            rr = []
            for l in lines:
                opts = [pics[l['t']]] + random.sample([v for k, v in pics.items() if k != l['t']], 2); random.shuffle(opts)
                rr.append({'say': AP(l['t']), 'options': [{'art': o} for o in opts], 'answer': opts.index(pics[l['t']])})
            G(les, 'choose', 70, {'rounds': rr}, SAY['sentence'])
        elif lid == 'u8-p74':
            talk(les, lines[:5], 74); G(les, 'read', 74, {'sentences': [{'text': AP(l['t'])} for l in lines]}, SAY['read'])
            les['title'] = '★'
        elif lid == 'u8-p76':
            pics = {'I have a pen.': 'en_s_pen', 'I have a pen and a pencil.': 'en_s_penpencil'}
            l77 = next(x for x in U[8]['lessons'] if x['pages'] == [77])['lines']
            talk(les, lines + l77, 76); les['pages'] = [76, 77]
            rr = []
            for t in ['I have a pen.', 'I have a pen and a pencil.', 'I have a pen.']:
                opts = list(pics.values()); random.shuffle(opts); rr.append({'say': AP(t), 'options': [{'art': o} for o in opts], 'answer': opts.index(pics[t])})
            G(les, 'choose', 76, {'rounds': rr}, SAY['sentence'])
            sp = L['sortPics']; items = [{'text': w, 'art': ART[w], 'bin': 0} for w in ['tiger', 'penguin', 'elephant', 'zebra'] if w in ART] + [{'text': w, 'art': ART[w], 'bin': 1} for w in ['apple', 'orange', 'pizza', 'lemon'] if w in ART]
            G(les, 'sort', 76, {'bins': [{'label': 'حَيَوَانَاتٌ'}, {'label': 'طَعَامٌ'}], 'items': items}, SAY['sort'])
            report['inferred'].append('u8-p76: عنوانا السلّتين «حَيَوَانَاتٌ / طَعَامٌ» صاغهما البناء لإطاري الصور في ص ٧٦ (بلا عنوان في الكتاب)؛ أسماء الصور من كلمات الكتاب.')
        elif lid == 'u8-p77':
            LESSONS.pop(); continue
        elif kind == 'story':
            talk(les, lines[:6], pg)
            G(les, 'read', pg, {'sentences': [{'text': AP(l['t'])} for l in lines]}, SAY['read'])
            les['title'] = '📖'
        else:
            if labs: G(les, 'abc', pg, {'letters': [], 'items': labs}, SAY['words'])
            if lines: talk(les, lines, pg)
        if kind == 'story': les['storyTitle'] = L['title']
        first = next((x for x in les['items'] if x.get('art')), None)
        les['sticker'] = {'name': first['value'], 'art': first['art']} if first else {'name': L.get('title', 'star'), 'art': 'star'}
        STK = {'u5-p51': ('bus', 'en_bus'), 'u6-p60': ('hands', 'hand'), 'u6-p61': ('monkey', 'monkey'), 'u7-p70': ('key', 'en_key_green'), 'u8-p76': ('pen', 'en_pen')}
        if lid in STK: les['sticker'] = {'name': STK[lid][0], 'art': STK[lid][1]}
        if kind == 'story': les['sticker'] = {'name': L['title'], 'art': {6: 'lion', 4: 'en_cake', 8: 'rocket'}.get(ui, 'star')}

# ---------- الصوت ----------
for les in LESSONS:
    lid = les['id']
    reg(les['unitTitle'], f'u{les["unit"]}', les['unitPage'], 'unit')
    for i, it in enumerate(les['items']): it['audio'] = reg(it['value'], lid, it['page'], f'w{i+1:02d}')
    for i, s in enumerate(les.get('lines', [])): s['audio'] = reg(s['text'], lid, s['page'], f'l{i+1:02d}')
    for g in les['games']:
        g['audio'] = reg(g['say'], lid, g['page'])
        d = g['data']
        for l in d.get('letters', []): reg(l, lid, g['page'], 'letter-' + l)
        for x in d.get('items', []):
            if isinstance(x, str): reg(x, lid, g['page'])
            elif isinstance(x, dict) and x.get('text'): reg(x['text'], lid, g['page'])
        for l in d.get('lines', []): l['audio'] = reg(l['text'], lid, l.get('page', g['page']))
        for r in d.get('rounds', []):
            for k in ('say', 'after'):
                if r.get(k): reg(r[k], lid, g['page'])
            for o in r.get('options', []):
                t = o.get('text') if isinstance(o, dict) else o
                if t is not None and not isinstance(t, int): reg(str(t), lid, g['page'])
                elif t is not None: reg(str(t), lid, g['page'])
            if g['template'] == 'count':
                for o in r['options']: reg(str(o), lid, g['page'])
        if g['template'] == 'yesno': reg(d['yes'], lid, g['page']); reg(d['no'], lid, g['page'])
        for w in d.get('words', []): reg(w['word'], lid, g['page'])
        for p in d.get('pieces', []): reg(p, lid, g['page'])
        for c in d.get('choices', []): reg(c, lid, g['page'])
        for s in d.get('sentences', []): s['audio'] = reg(s['text'], lid, g['page'])
        for p in d.get('pairs', []): reg(p['text'] if isinstance(p, dict) else p, lid, g['page'])
        for b in d.get('bins', []): reg(b['label'], lid, g['page'])
    if les.get('sticker'): les['sticker']['audio'] = reg(les['sticker']['name'], lid, les['pages'][0], 'sticker')
    if les.get('nashid'): reg(les['nashid']['title'], lid, les['pages'][0], 'title')

BOOK = {'id': 'english', 'title': 'اللُّغَةُ الْإِنْكِلِيزِيَّةُ', 'grade': 'لِلصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ', 'color': '#1c7ed6', 'color2': '#fab005', 'soft': '#e7f1fb', 'digits': 'western', 'dir': 'rtl', 'contentDir': 'ltr', 'lang': 'en'}
reg(BOOK['title'], 'c', 1, 'booktitle')

# ---------- فحوص ----------
bad = []
AR = re.compile('[؀-ۿ]'); HAR = re.compile('[ً-ْ]')
for les in LESSONS:
    if les['kind'] != 'nashid' and len(les['games']) < 2: bad.append(les['id'] + ': أقل من لعبتين')
    for g in les['games']:
        s = g['say']; ws = s.split()
        if len(ws) > 6: bad.append(les['id'] + ': تعليمة طويلة ' + s)
        if not AR.search(s) or any(not HAR.search(w) for w in ws): bad.append(les['id'] + ': تعليمة غير مشكولة ' + s)
        d, t = g['data'], g['template']
        n_rounds = {'choose': lambda: len(d['rounds']), 'count': lambda: len(d['rounds']), 'yesno': lambda: len(d['rounds']), 'balloons': lambda: len(d['targets']), 'match': lambda: len(d['pairs']), 'build': lambda: len(d['words'])}.get(t)
        if n_rounds and not (3 <= n_rounds() <= 5): bad.append(f'{les["id"]}/{t}: عدد الجولات {n_rounds()}')
        if t == 'count':
            for r in d['rounds']:
                n = len(r['items'])
                if n not in r['options']: bad.append(f'{les["id"]}: العدد {n} ليس بين الخيارات')
                r['answer'] = r['options'].index(n)
                if r['options'][r['answer']] != n or n < 1 or n > 10: bad.append(f'{les["id"]}: عدد الرسوم لا يساوي الجواب')
                if r.get('after') and r['after'][0].isdigit() and int(re.match(r'\d+', r['after']).group()) != n: bad.append(f'{les["id"]}: الجملة {r["after"]} لا تطابق {n}')
                if r.get('say') == 'How many red fish?' and n != 2: bad.append('الكتاب: جواب السمك الأحمر 2')
        if t in ('choose',):
            for r in d['rounds']:
                if not (2 <= len(r['options']) <= 4) or r['answer'] >= len(r['options']): bad.append(f'{les["id"]}: خيارات خاطئة')
                if len({json.dumps(o, sort_keys=True) for o in r['options']}) != len(r['options']): bad.append(f'{les["id"]}: خيار مكرر')
        if t == 'build':
            for w in d['words']:
                if ''.join(w['parts']) != w['word'] or any(p not in d['pieces'] for p in w['parts']): bad.append(les['id'] + ': تهجئة ' + w['word'])
        for p in d.get('pairs', []):
            v = p['text'] if isinstance(p, dict) else p
            if not ART.get(v) and not (isinstance(p, dict) and p.get('art')): bad.append(f'{les["id"]}: لا صورة لـ {v}')
        if t == 'trace' and not re.match(r'lat_[a-z]$', d['shape']): bad.append('شكل تتبّع ' + d['shape'])
    for it in les['items']:
        if AR.search(it['value']): bad.append('كلمة عربية في عناصر الإنكليزية ' + it['value'])
# كل نص إنكليزي يجب أن يكون من الكتاب
book_text = set()
for u in U.values():
    for L in u['lessons']:
        for k in ('lines', 'transcript'):
            for l in L.get(k, []): book_text.add(AP(l['t']))
        for k in ('words', 'labels', 'family'):
            for w in L.get(k, []): book_text.add(w['w'] if isinstance(w, dict) else w)
        book_text.update(L.get('colours', [])); book_text.update(L.get('letters', [])); book_text.update(L.get('words', []) if isinstance(L.get('words'), list) and L.get('words') and isinstance(L['words'][0], str) else [])
        if L.get('letter'): book_text.add(L['letter'])
        if L.get('title'): book_text.add(L['title'])
        if L.get('kind') == 'write': book_text.update(L['words'])
book_text.update(['Yes.', 'No.'] + [str(n) for n in range(1, 11)] + [u['title'] for u in U.values()] + [AP(f"I'm {n}.") for n in (3, 4, 5, 6, 7, 8)])
for t in audio:
    if not AR.search(t) and t not in book_text and not re.fullmatch(r'[a-z]', t): bad.append('نص إنكليزي ليس في الكتاب: ' + t)

print('lessons', len(LESSONS), 'games', sum(len(l['games']) for l in LESSONS), 'clips', len(rows))
for b in bad: print('!', b)
js = '// مولَّد آلياً من tools/build_english.py — لا تعدّله يدوياً\n'
js += 'export const BOOK = ' + json.dumps(BOOK, ensure_ascii=False) + ';\nexport const COMMON = ' + json.dumps(COMMON, ensure_ascii=False) + ';\n'
js += 'export const AUDIO = ' + json.dumps(audio, ensure_ascii=False) + ';\nexport const LESSONS = ' + json.dumps(LESSONS, ensure_ascii=False) + ';\n'
open(os.path.join(OUT, 'lessons.js'), 'w', encoding='utf-8').write(js)
json.dump({'book': BOOK, 'lessons': LESSONS}, open(os.path.join(OUT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'audio-list.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['اسم الملف', 'النص المشكول', 'الدرس', 'الصفحة']); w.writerows(rows)
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
sys.exit(1 if bad else 0)
