#!/usr/bin/env python3
"""يبني دروس «قراءتي الجديدة» كلها من books/reading/source/u*.json (بعد تطبيق تصحيحات القارئ الثاني)
ويكتب books/reading/lessons.js و lessons.json و audio-list.csv و report.json.
المحتوى كله من الكتاب؛ الألعاب تعيد ترتيب ما في الدرس وحده أو ما سبقه من دروس.
"""
import json, csv, os, re, random, sys
random.seed(7)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'books', 'reading', 'source')
VER = '/home/claude/books/read/verify'
OUT = os.path.join(ROOT, 'books', 'reading')

H = 'ً-ْٰ'          # الحركات
HAR = re.compile(f'[{H}]')
SHORT = set('َُِ')  # فتحة ضمة كسرة
TAN = set('ًٌٍ')
SUK, SHAD = 'ْ', 'ّ'
NONJOIN = set('اأإآدذرزوؤةىء')
base = lambda s: re.sub(f'[{H}ـ\\s]', '', s)
def norm(v):
    v = re.sub(r'\s*\((باهت، استنتاج)\)', '', v)
    v = re.sub(r'\s*\([ء-يـ]{1,2}\)\s*$', '', v)
    return re.sub(r'\s+', ' ', v).strip(' .،,:؛')

# ---------- تطبيق تصحيحات القارئ الثاني ----------
units = []
applied = []
for i in range(7):
    U = json.load(open(os.path.join(SRC, f'u{i}.json'), encoding='utf-8'))
    vf = os.path.join(VER, f'u{i}.json')
    if os.path.exists(vf):
        V = json.load(open(vf, encoding='utf-8'))
        fixes = [f for f in V.get('fixes', []) if f.get('old') and f.get('new') and f['old'] != f['new']]
        def pick(val, page):
            for f in fixes:
                if f['old'] == val and (not f.get('page') or not page or int(f['page']) == int(page)): return f['new']
            return None
        for L in U['lessons']:
            for a in L.get('activities', []):
                nv = pick(a.get('instruction'), a.get('page'))
                if nv: applied.append((i, a['instruction'], nv)); a['instruction'] = nv
                for c in a.get('content', []):
                    nv = pick(c.get('value'), c.get('page', a.get('page')))
                    if nv: applied.append((i, c['value'], nv)); c['value'] = nv
    units.append(U)

# ---------- خريطة الرسوم ----------
ARTMAP = {'بَقَرَةُ': 'baqara', 'بُرْتُقَالُ': 'burtuqal', 'بِسَاطُ': 'bisat', 'حَلِيْبُ': 'halib', 'خُبْزُ': 'khubz', 'بَابُ': 'bab', 'بُوْقُ': 'buq', 'طَبِيْبُ': 'tabib', 'بَصَلُ': 'basal', 'بِطِّيْخُ': 'bittikh'}
for it in json.load(open('/home/claude/artjobs/all.json', encoding='utf-8')):
    for w in re.split(r'[،,]\s*', it['ar']):
        w = norm(w.split('—')[0])
        if w and w not in ARTMAP: ARTMAP[w] = it['key']
ARTBASE = {}
for w, k in ARTMAP.items(): ARTBASE.setdefault(base(w), k)
def art_of(v): return ARTMAP.get(v) or ARTBASE.get(base(v))

# ---------- التقطيع إلى مقاطع ----------
def letters(w):
    out = []
    for ch in w:
        if ch == 'ـ': continue
        if HAR.match(ch) and out: out[-1][1] += ch
        elif not HAR.match(ch): out.append([ch, ''])
    return out
def syllables(w):
    """CV / CVV / CVC من كلمة مشكولة. الشدة = ساكن + متحرك."""
    L = []
    for ch, m in letters(w):
        if SHAD in m: L.append([ch, SUK]); L.append([ch, m.replace(SHAD, '')])
        else: L.append([ch, m])
    syl, cur = [], ''
    i = 0
    while i < len(L):
        ch, m = L[i]
        vowel = any(c in SHORT or c in TAN for c in m)
        if vowel or (not cur):
            if cur: syl.append(cur)
            cur = ch + m
        else:
            cur += ch + m  # حرف مدّ أو ساكن يغلق المقطع
        i += 1
    if cur: syl.append(cur)
    return syl
def shaped(parts):
    """يضيف التطويل حيث يتصل المقطع بما بعده أو بما قبله ليظهر بشكله في الكلمة."""
    out = []
    for i, p in enumerate(parts):
        b = base(p); s = p
        if i > 0 and base(parts[i - 1])[-1:] not in NONJOIN: s = 'ـ' + s
        if i < len(parts) - 1 and b[-1:] not in NONJOIN: s = s + 'ـ'
        out.append(s)
    return out

# ---------- السجل الصوتي ----------
audio, rows = {}, []
def reg(text, lid, page, key=None):
    text = norm(text) if text else text
    if not text: return None
    if text in audio: return audio[text]
    fn = f'{lid}-{key or "x" + str(len(rows))}.mp3'.replace('/', '-')
    audio[text] = fn; rows.append([fn, text, lid, page]); return fn

SAY = {
    'listen': 'اِلْمَسْ كُلَّ صُورَةٍ وَاسْمَعْ', 'trace': 'تَتَبَّعِ الْحَرْفَ بِإِصْبَعِكَ', 'balloons': 'فَرْقِعِ الْبَالُونَ الَّذِي تَسْمَعُهُ',
    'match': 'اِسْحَبِ الْكَلِمَةَ إِلَى صُورَتِهَا', 'build': 'رَكِّبِ الْكَلِمَةَ مِنْ مَقَاطِعِهَا', 'choose': 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ',
    'train': 'اِسْمَعْ وَاخْتَرِ الْكَلِمَةَ', 'memory': 'اِقْلِبْ بِطَاقَتَيْنِ مُتَشَابِهَتَيْنِ', 'sort': 'ضَعْ كُلَّ كَلِمَةٍ فِي سَلَّتِهَا',
    'order': 'رَتِّبِ الْكَلِمَاتِ لِتَصْنَعَ جُمْلَةً', 'complete': 'ضَعِ الْحَرْفَ النَّاقِصَ', 'scene': 'اِلْمَسِ الصُّورَةَ وَتَحَدَّثْ',
    'puzzle': 'رَكِّبِ الصُّورَةَ', 'read': 'اِسْمَعْ وَاقْرَأْ مَعِي',
}
COMMON = {'praise': ['أَحْسَنْتَ!', 'رَائِعٌ!', 'مُمْتَازٌ!'], 'encourage': ['حَاوِلْ مَرَّةً أُخْرَى', 'هَيَّا مَرَّةً أُخْرَى'], 'star': 'نَجْمَةٌ جَدِيدَةٌ!', 'sticker': 'مُلْصَقٌ جَدِيدٌ لِدَفْتَرِكَ!', 'welcome': 'هَيَّا نَلْعَبُ وَنَتَعَلَّمُ!', 'map': 'اِخْتَرْ دَرْسًا مِنَ الطَّرِيقِ'}
for k, v in COMMON.items():
    for j, t in enumerate(v if isinstance(v, list) else [v]): reg(t, 'c', '', f'{k}{j+1}')
for k, t in SAY.items(): reg(t, 'c', '', k)

LETTER_ID = {'ب': 'ba', 'م': 'mim', 'د': 'dal', 'ف': 'fa', 'ر': 'ra', 'س': 'sin', 'ن': 'nun', 'ت': 'ta', 'ة': 'tam', 'و': 'waw', 'ي': 'ya', 'ق': 'qaf', 'ل': 'lam', 'ط': 'tta', 'ع': 'ayn', 'ح': 'hha', 'ش': 'shin', 'ز': 'zay', 'ج': 'jim', 'ص': 'sad', 'أ': 'alif', 'ض': 'dad', 'خ': 'kha', 'ث': 'tha', 'ك': 'kaf', 'غ': 'ghayn', 'ه': 'he', 'ذ': 'dhal', 'ظ': 'zza'}
SHAPE = {'ب': 'ba', 'ت': 'ta', 'ث': 'tha', 'ن': 'nun', 'ي': 'ya', 'ج': 'jim', 'ح': 'hha', 'خ': 'kha', 'د': 'dal', 'ذ': 'dhal', 'ر': 'ra', 'ز': 'zay', 'س': 'sin', 'ش': 'shin', 'ص': 'sad', 'ض': 'dad', 'ط': 'tta', 'ظ': 'zza', 'ع': 'ayn', 'غ': 'ghayn', 'ف': 'fa', 'ق': 'qaf', 'ك': 'kaf', 'ل': 'lam', 'م': 'mim', 'ه': 'he', 'و': 'waw', 'ة': 'tam', 'أ': 'alif_hamza', 'ا': 'alif', 'ى': 'alif_maqsura'}
STICKER_ART = {}
SCENES = {
    1: {'items': [{'art': 'house', 'x': 20, 'y': 70, 'w': 110}, {'art': 'palm_tree', 'x': 140, 'y': 40, 'w': 120}, {'art': 'bisat', 'x': 230, 'y': 160, 'w': 90}, {'art': 'khubz', 'x': 300, 'y': 170, 'w': 60}, {'art': 'grandfather', 'x': 250, 'y': 80, 'w': 90}, {'art': 'girl', 'x': 320, 'y': 90, 'w': 75}], 'bg': {}},
    2: {'items': [{'art': 'school', 'x': 10, 'y': 50, 'w': 150}, {'art': 'blackboard', 'x': 170, 'y': 70, 'w': 100}, {'art': 'schoolgirl', 'x': 270, 'y': 90, 'w': 90}, {'art': 'schoolbag', 'x': 320, 'y': 170, 'w': 60}, {'art': 'pencil', 'x': 180, 'y': 180, 'w': 60}, {'art': 'clock', 'x': 300, 'y': 10, 'w': 50}], 'bg': {}},
    3: {'items': [{'art': 'iraqi_flag', 'x': 20, 'y': 40, 'w': 110}, {'art': 'palm_trees', 'x': 120, 'y': 60, 'w': 120}, {'art': 'mosque', 'x': 230, 'y': 60, 'w': 110}, {'art': 'bridge', 'x': 40, 'y': 160, 'w': 120}, {'art': 'boat', 'x': 260, 'y': 175, 'w': 80}, {'art': 'birds', 'x': 160, 'y': 5, 'w': 70}], 'bg': {}},
    4: {'items': [{'art': 'boy_washing_at_sink', 'x': 20, 'y': 70, 'w': 110}, {'art': 'apple', 'x': 150, 'y': 160, 'w': 60}, {'art': 'toothpaste', 'x': 220, 'y': 170, 'w': 60}, {'art': 'trees', 'x': 260, 'y': 50, 'w': 120}, {'art': 'flowers', 'x': 140, 'y': 90, 'w': 80}, {'art': 'pigeon', 'x': 300, 'y': 10, 'w': 50}], 'bg': {}},
    5: {'items': [{'art': 'football_goal', 'x': 20, 'y': 60, 'w': 130}, {'art': 'boy_kicking_ball', 'x': 150, 'y': 80, 'w': 100}, {'art': 'paintbrush', 'x': 250, 'y': 170, 'w': 60}, {'art': 'book', 'x': 310, 'y': 165, 'w': 65}, {'art': 'drum', 'x': 270, 'y': 70, 'w': 80}, {'art': 'balloon', 'x': 340, 'y': 20, 'w': 50}], 'bg': {}},
    6: {'items': [{'art': 'stars', 'x': 20, 'y': 10, 'w': 80}, {'art': 'crescent_moon', 'x': 120, 'y': 10, 'w': 60}, {'art': 'microscope', 'x': 30, 'y': 120, 'w': 100}, {'art': 'spyglass', 'x': 150, 'y': 110, 'w': 100}, {'art': 'rocket', 'x': 270, 'y': 40, 'w': 100}, {'art': 'hoopoe', 'x': 280, 'y': 160, 'w': 80}], 'bg': {'sky': '#c5d8ff'}, 'sun': False},
}

def words_of(L, acts=None, need_art=False, letter=None):
    out = []
    for a in L.get('activities', []):
        if acts and str(a.get('n', '')).strip() not in acts: continue
        for c in a.get('content', []):
            v = norm(c.get('value', ''))
            if not v or re.search(r'[()+…—–_]', v) or v.startswith('صورة') or not HAR.search(v): continue
            if len(v.split()) > 1 or len(base(v)) < 2: continue
            if not c.get('picture') and len(base(v)) <= 2: continue
            if need_art and not art_of(v): continue
            if letter and letter not in base(v): continue
            if v not in [o['value'] for o in out]: out.append({'value': v, 'page': c.get('page', a.get('page')), 'art': art_of(v)})
    return out
def syl_of(L):
    out = []
    for a in L.get('activities', []):
        if str(a.get('n', '')).strip() not in ('٢', '2'): continue
        for c in a.get('content', []):
            for v in re.split(r'\s+[—–-]\s+', norm(c.get('value', ''))):
                if v and len(base(v)) <= 3 and HAR.search(v) and v not in [o['value'] for o in out]: out.append({'value': v, 'page': c.get('page', a.get('page'))})
    return out
def sentences_of(L):
    out = []
    for a in L.get('activities', []):
        ins = a.get('instruction', '')
        for c in a.get('content', []):
            v = norm(c.get('value', ''))
            if len(v.split()) >= 3 and HAR.search(v) and not re.search(r'[_…()+—–]|\.\.', v) and not v.startswith('صورة') and len(HAR.findall(v)) >= 4:
                if '،' in v and len(v.split()) <= 5 and all(len(x.split()) <= 2 for x in v.split('،')) and 'أُرَتِّبُ' in ins: continue
                out.append({'text': v, 'page': c.get('page', a.get('page'))})
    return out

def fit_words(cands, maxw=3, maxp=7):
    words, pieces = [], []
    for w in cands:
        parts = shaped(syllables(w['value'])); new = [p for p in dict.fromkeys(parts) if p not in pieces]
        if len(pieces) + len(new) > maxp: continue
        words.append({'word': w['value'], 'parts': parts, 'art': w['art']}); pieces += new
        if len(words) >= maxw: break
    return words

letters_so_far = []
LESSONS, report = [], {'inferred': [], 'notes': [], 'outside': [], 'fixes': len(applied)}
rot = 0
tanween_seen = []
ROT = ['balloons', 'build', 'match', 'memory', 'train', 'complete']

def make_lesson(lid, ui, title, U, srcs, kind, letter=None):
    pages = sorted({p for L in srcs for p in L['pages']})
    les = {'id': lid, 'book': 'reading', 'unit': ui, 'unitTitle': norm(U['section']), 'unitPage': U['pages'][0], 'pages': pages, 'title': title, 'kind': kind, 'items': [], 'syllables': [], 'games': []}
    return les

def add_items(les, items):
    for it in items:
        if it['value'] not in [x['value'] for x in les['items']]: les['items'].append(it)

for ui, U in enumerate(units):
    Ls = U['lessons']
    if ui == 0:
        prep = [L for L in Ls if L['pages'][0] == 7][0]
        les = make_lesson('u0-prep', 0, 'التَّهْيِئَةُ', U, [prep], 'prep')
        P = {'فَوْقَ': 'pos_above', 'تَحْتَ': 'pos_below', 'أَمَامَ': 'pos_front', 'خَلْفَ': 'pos_behind'}
        les['games'] += [
            {'template': 'choose', 'page': 9, 'say': 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ', 'data': {'rounds': [{'say': w, 'options': [{'art': a} for a in P.values()], 'answer': list(P).index(w)} for w in P]}},
            {'template': 'choose', 'page': 8, 'say': 'اِلْمَسِ الصُّورَةَ الْمُخْتَلِفَةَ', 'data': {'rounds': [
                {'say': 'اِلْمَسِ الصُّورَةَ الْمُخْتَلِفَةَ', 'options': [{'art': 'ostrich'}, {'art': 'ostrich'}, {'art': 'rooster'}, {'art': 'ostrich'}], 'answer': 2},
                {'say': 'اِلْمَسِ الصُّورَةَ الْمُخْتَلِفَةَ', 'options': [{'art': 'ball'}, {'art': 'ball'}, {'art': 'ball'}, {'art': 'lemon'}], 'answer': 3},
                {'say': 'اِلْمَسِ الصُّورَةَ الْمُخْتَلِفَةَ', 'options': [{'art': 'book'}, {'art': 'pencil'}, {'art': 'book'}], 'answer': 1}]}},
            {'template': 'choose', 'page': 9, 'say': 'اِلْمَسِ الْأَطْوَلَ', 'data': {'rounds': [
                {'say': 'اِلْمَسِ الْأَطْوَلَ', 'options': [{'art': 'pencil', 'scale': 0.6}, {'art': 'pencil', 'scale': 1}, {'art': 'pencil', 'scale': 0.8}], 'answer': 1},
                {'say': 'اِلْمَسِ الْأَقْصَرَ', 'options': [{'art': 'pencil', 'scale': 0.9}, {'art': 'pencil', 'scale': 0.5}, {'art': 'pencil', 'scale': 1}], 'answer': 1}]}},
        ]
        les['sticker'] = {'name': 'مُلْصَقُ النَّجْمَةِ', 'art': 'star'}
        report['notes'].append('التهيئة: ألعاب الأماكن والمختلف والأطول تعيد أنشطة الصفحات ٨–٩ بصور مرسومة؛ تعليمتا «اِلْمَسِ الْأَطْوَلَ/الْأَقْصَرَ» و«الْمُخْتَلِفَةَ» صاغها البناء من تعليمات الكتاب.')
        LESSONS.append(les)
        for L, (lid, t, lt) in zip([L for L in Ls if L['pages'][0] != 7], [('u0-madd-alif', 'ا ى', 'ا'), ('u0-madd-waw', 'و', 'و'), ('u0-madd-ya', 'ي', 'ي')]):
            les = make_lesson(lid, 0, t, U, [L], 'madd', lt)
            ws = words_of(L); add_items(les, ws)
            les['games'] = [
                {'template': 'listen', 'page': L['pages'][0], 'data': {'letter': t, 'items': [w['value'] for w in ws[:8]]}},
                {'template': 'trace', 'page': L['pages'][1], 'data': {'shape': SHAPE[lt]}},
                {'template': 'balloons', 'page': L['pages'][0], 'data': {'choices': [w['value'] for w in ws[:8]], 'targets': [w['value'] for w in ws[:8:2]][:4], 'per': 3}},
            ]
            les['sticker'] = {'name': 'مُلْصَقُ ' + ws[0]['value'], 'art': ws[0]['art'] or 'star'}
            LESSONS.append(les)
        continue
    opening = [L for L in Ls if L['kind'] in ('listening', 'conversation') or L['kind'] == 'intro']
    if opening:
        les = make_lesson(f'u{ui}-open', ui, '★', U, opening, 'open')
        prompts = []
        for L in opening:
            if L['kind'] != 'conversation': continue
            for a in L.get('activities', []):
                for c in a.get('content', []):
                    if len(HAR.findall(c.get('value', ''))) >= 4: prompts.append({'text': norm(c['value']), 'page': L['pages'][0]})
        les['prompts'] = prompts
        sc = SCENES[ui]
        les['games'] = [{'template': 'scene', 'page': les['pages'][0], 'data': {'scene': sc, 'prompts': prompts}}, {'template': 'puzzle', 'page': les['pages'][0], 'data': {'scene': sc, 'pieces': 4 if ui < 4 else 6}}]
        les['sticker'] = {'name': 'مُلْصَقُ ' + norm(U['section']).split(':')[-1].strip(), 'art': sc['items'][0]['art']}
        LESSONS.append(les)
    for L in [L for L in Ls if L not in opening]:
        k = L['kind']
        if k == 'nashid':
            les = make_lesson(f'u{ui}-nashid', ui, '♪', U, [L], 'nashid')
            les['nashid'] = {'title': norm(L['title']), 'poet': ('شعر: ' + L['poet']) if L.get('poet') else '', 'page': L['pages'][0], 'audio': f'u{ui}-nashid.mp3'}
            les['scene'] = SCENES[ui]
            LESSONS.append(les); continue
        if k == 'letter':
            lt = L.get('letter') or re.search(r'\(([^)]+)\)', L['title']).group(1).split()[0]
            lt = 'ه' if lt.startswith('ه') else lt.replace('ـ', '')[:1]
            lid = f'u{ui}-' + LETTER_ID[lt]
            les = make_lesson(lid, ui, 'هـ' if lt == 'ه' else lt, U, [L], 'letter', lt)
            w1 = words_of(L, acts=('١', '1')); allw = words_of(L)
            add_items(les, allw)
            sy = syl_of(L); les['syllables'] = sy
            sents = sentences_of(L)
            g = [{'template': 'listen', 'page': L['pages'][0], 'data': {'letter': les['title'], 'items': [w['value'] for w in w1[:8]] or [w['value'] for w in allw[:8]]}},
                 {'template': 'trace', 'page': L['pages'][-1], 'data': {'shape': SHAPE[lt]}}]
            third = 'order' if ui == 6 else ROT[rot % len(ROT)]
            if ui != 6: rot += 1
            arted = [w for w in allw if w['art']]
            withl = [w for w in allw if lt in base(w['value']) and 2 <= len(syllables(w['value'])) <= 3]
            if lid == 'u1-ba':
                third = None
                g += [{'template': 'balloons', 'page': 18, 'data': {'choices': ['بَـ', 'بَا', 'بُـ', 'بُوْ', 'بِـ', 'بِيْـ'], 'targets': ['بَـ', 'بُوْ', 'بِـ', 'بَا'], 'per': 3}},
                      {'template': 'match', 'page': 19, 'data': {'pairs': ['بَابُ', 'بُوْقُ', 'بَصَلُ', 'طَبِيْبُ'], 'per': 3}},
                      {'template': 'build', 'page': 20, 'data': {'pieces': ['بُ', 'بَا', 'بِي'], 'words': [{'word': 'بَابُ', 'parts': ['بَا', 'بُ'], 'art': 'bab'}, {'word': 'بَابَا', 'parts': ['بَا', 'بَا']}, {'word': 'بَابِي', 'parts': ['بَا', 'بِي']}]}}]
            if third == 'balloons' and len(sy) < 4: third = 'train'
            if third in ('match', 'memory') and len(arted) < 3: third = 'train'
            if third == 'build' and len(withl) < 2: third = 'train'
            if third == 'balloons':
                ch = [s['value'] for s in sy[:6]]; g.append({'template': 'balloons', 'page': sy[0]['page'], 'data': {'choices': ch, 'targets': [ch[0], ch[3 % len(ch)], ch[4 % len(ch)], ch[1]], 'per': 3}})
            elif third == 'build':
                words = fit_words(withl)
                pieces = list(dict.fromkeys(p for x in words for p in x['parts']))
                extra = [s['value'] for s in sy if s['value'] not in pieces][:1] if len(pieces) < 7 else []
                g.append({'template': 'build', 'page': withl[0]['page'], 'data': {'pieces': pieces + extra, 'words': words}})
            elif third == 'match':
                g.append({'template': 'match', 'page': arted[0]['page'], 'data': {'pairs': [w['value'] for w in arted[:4]], 'per': 3}})
            elif third == 'memory':
                g.append({'template': 'memory', 'page': arted[0]['page'], 'data': {'pairs': [{'text': w['value'], 'art': w['art']} for w in arted[:4]]}})
            elif third == 'train':
                pool = [w['value'] for w in allw if len(base(w['value'])) >= 3]
                rr = []
                for t in pool[:4]:
                    others = [x for x in pool if x != t]; random.shuffle(others)
                    opts = [t] + others[:2]; random.shuffle(opts); rr.append({'say': t, 'options': [{'text': o} for o in opts], 'answer': opts.index(t)})
                g.append({'template': 'train', 'page': L['pages'][0], 'data': {'rounds': rr}})
            elif third == 'complete':
                prev = [x for x in letters_so_far if x != lt][-6:]
                rr = []
                for w in [w for w in allw if lt in w['value']][:4]:
                    v = w['value']; a = v.index(lt); b = a + 1
                    while b < len(v) and HAR.match(v[b]): b += 1
                    seg = v[a:b]; marks = seg[1:]; others = random.sample(prev, 2) if len(prev) >= 2 else ['ب', 'م']
                    opts = [seg] + [o + marks for o in others]; random.shuffle(opts)
                    rr.append({'word': v, 'start': a, 'end': b, 'options': opts, 'answer': opts.index(seg), 'art': w['art']})
                    report['outside'].append(f'{lid}: خيارات «أكمل الكلمة» تضم الحرفين ({"، ".join(others)}) من دروس سابقة.') if rr and len(rr) == 1 else None
                g.append({'template': 'complete', 'page': L['pages'][1], 'data': {'rounds': rr}})
            elif third == 'order':
                cand = [s for s in sents if 3 <= len(s['text'].split()) <= 6]
                rr = [{'items': [{'text': x} for x in s['text'].split()], 'result': s['text']} for s in cand[:2]]
                if rr: g.append({'template': 'order', 'page': cand[0]['page'], 'data': {'rounds': rr}})
            if sents: g.append({'template': 'read', 'page': sents[0]['page'], 'data': {'sentences': [{'text': s['text']} for s in sents[:5]]}})
            les['games'] = g
            les['sentences'] = sents
            sa = (arted[0]['art'] if arted else 'star')
            les['sticker'] = {'name': 'مُلْصَقُ حَرْفِ ' + les['title'], 'art': sa}
            letters_so_far.append(lt)
            LESSONS.append(les); continue
        if k in ('tanween', 'shadda', 'lam'):
            lid = f'u{ui}-{k}'
            les = make_lesson(lid, ui, {'tanween': ['', '', 'ـٌ', 'ـً', 'ـٍ'][min(ui, 4)], 'shadda': 'ـّ', 'lam': 'الـ'}[k], U, [L], k)
            allw = words_of(L); add_items(les, allw); sents = sentences_of(L); les['sentences'] = sents
            arted = [w for w in allw if w['art']]
            g = []
            if k == 'lam':
                sh = [w['value'] for w in allw if len(base(w['value'])) > 2 and base(w['value']).startswith('ال') and SHAD in letters(w['value'])[2][1]]
                qa = [w['value'] for w in allw if len(base(w['value'])) > 2 and base(w['value']).startswith('ال') and SUK in (letters(w['value'])[1][1] or '')]
                g.append({'template': 'sort', 'page': L['pages'][0], 'say': 'ضَعْ كُلَّ كَلِمَةٍ فِي سَلَّتِهَا', 'data': {'bins': [{'label': 'اللَّامُ الشَّمْسِيَّةُ'}, {'label': 'اللَّامُ الْقَمَرِيَّةُ'}], 'items': [{'text': x, 'bin': 0} for x in sh[:4]] + [{'text': x, 'bin': 1} for x in qa[:4]]}})
                for b in ('اللَّامُ الشَّمْسِيَّةُ', 'اللَّامُ الْقَمَرِيَّةُ'): reg(b, lid, L['pages'][0])
                report['notes'].append('اللام: عنوانا السلّتين «اللَّامُ الشَّمْسِيَّةُ / الْقَمَرِيَّةُ» مأخوذان من عنوان الدرس.')
            g.append({'template': 'listen', 'page': L['pages'][0], 'data': {'letter': les['title'], 'items': [w['value'] for w in (arted or allw)[:8]]}})
            if k == 'shadda':
                words = fit_words([w for w in allw if SHAD in w['value'] and 2 <= len(syllables(w['value'])) <= 4])
                g.append({'template': 'build', 'page': 106, 'data': {'pieces': list(dict.fromkeys(p for x in words for p in x['parts'])), 'words': words}})
            if k != 'lam':
                ch = [w['value'] for w in allw if len(base(w['value'])) <= 6][:6]
                g.append({'template': 'balloons', 'page': L['pages'][0], 'data': {'choices': ch, 'targets': ch[:4], 'per': 3}})
            if k == 'tanween' and len(arted) >= 3: g.append({'template': 'match', 'page': L['pages'][0], 'data': {'pairs': [w['value'] for w in arted[:4]], 'per': 3}})
            if k == 'lam' and len(arted) >= 3: g.append({'template': 'match', 'page': L['pages'][0], 'data': {'pairs': [w['value'] for w in arted[:4]], 'per': 3}})
            if k == 'tanween':
                mark = {'ٌ': 0, 'ً': 1, 'ٍ': 2}
                tanween_seen = tanween_seen + [(w['value'], next((mark[c] for c in w['value'] if c in mark), None)) for w in allw]
                kinds = sorted({m for _, m in tanween_seen if m is not None})
                if len(kinds) >= 2:
                    a, b = kinds[-2], kinds[-1]; labels = ['تَنْوِيْنُ الضَّمِّ', 'تَنْوِيْنُ الْفَتْحِ', 'تَنْوِيْنُ الْكَسْرِ']
                    items = [{'text': v, 'bin': 0} for v, m in tanween_seen if m == a][:3] + [{'text': v, 'bin': 1} for v, m in tanween_seen if m == b][:3]
                    g.append({'template': 'sort', 'page': L['pages'][0], 'data': {'bins': [{'label': labels[a]}, {'label': labels[b]}], 'items': items}})
                    for x in (labels[a], labels[b]): reg(x, lid, L['pages'][0])
                    report['outside'].append(f'{lid}: لعبة التصنيف تضم كلمات من درس التنوين السابق.')
            if sents: g.append({'template': 'read', 'page': sents[0]['page'], 'data': {'sentences': [{'text': s['text']} for s in sents[:5]]}})
            les['games'] = g
            les['sticker'] = {'name': 'مُلْصَقُ ' + norm(L['title']).split()[-1], 'art': (arted[0]['art'] if arted else 'star')}
            LESSONS.append(les)

# ---------- التعليمات والصوت ----------
for les in LESSONS:
    lid = les['id']
    reg(les['unitTitle'], lid.split('-')[0], les['unitPage'], 'unit')
    for i, it in enumerate(les['items']): it['audio'] = reg(it['value'], lid, it['page'], f'w{i+1:02d}')
    for i, s in enumerate(les['syllables']): s['audio'] = reg(s['value'], lid, s['page'], f's{i+1:02d}')
    for i, p in enumerate(les.get('prompts', [])): p['audio'] = reg(p['text'], lid, p['page'], f'q{i+1:02d}')
    for i, s in enumerate(les.get('sentences', [])): s['audio'] = reg(s['text'], lid, s['page'], f'r{i+1:02d}')
    for g in les['games']:
        g.setdefault('say', SAY[g['template']]); g['audio'] = reg(g['say'], lid, g['page'])
        d = g['data']
        for r in d.get('rounds', []):
            if r.get('say'): reg(r['say'], lid, g['page'])
            if r.get('word'): reg(r['word'], lid, g['page'])
            if r.get('result'): reg(r['result'], lid, g['page'])
            for o in r.get('options', []):
                t = o.get('text') if isinstance(o, dict) else o
                if t: reg(t, lid, g['page'])
            for o in r.get('items', []):
                if o.get('text'): reg(o['text'], lid, g['page'])
        for w in d.get('words', []): reg(w['word'], lid, g['page'])
        for p in (d.get('pieces') if isinstance(d.get('pieces'), list) else []): reg(p, lid, g['page'])
        for c in d.get('choices', []): reg(c, lid, g['page'])
        for s in d.get('sentences', []): s['audio'] = reg(s['text'], lid, g['page'])
        for p in d.get('pairs', []): reg(p['text'] if isinstance(p, dict) else p, lid, g['page'])
        for it in d.get('items', []):
            if isinstance(it, dict) and it.get('text'): reg(it['text'], lid, g['page'])
    if les.get('sticker'): les['sticker']['audio'] = reg(les['sticker']['name'], lid, les['pages'][0], 'sticker')
    if les.get('nashid'): reg(les['nashid']['title'], lid, les['pages'][0], 'title')

BOOK = {'id': 'reading', 'title': 'قِرَاءَتِي الْجَدِيدَةُ', 'grade': 'لِلصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ', 'color': '#e5484d', 'color2': '#3aa0e0', 'soft': '#ffe3e3', 'digits': 'arabic-indic', 'dir': 'rtl', 'lang': 'ar'}
reg(BOOK['title'], 'c', 1, 'booktitle')
# ---------- فحوص ----------
bad = []
for les in LESSONS:
    if les['kind'] != 'nashid' and len(les['games']) < 2: bad.append(les['id'] + ': أقل من لعبتين')
    for g in les['games']:
        if len(g['say'].split()) > 6: bad.append(les['id'] + ': تعليمة طويلة ' + g['say'])
        if g['template'] == 'build':
            for w in g['data']['words']:
                exp = base(re.sub('(.)([\u064B-\u0650]?)\u0651', lambda m: m.group(1) + m.group(1), w['word']))
                if base(''.join(w['parts'])) != exp: bad.append(les['id'] + ': تقطيع خاطئ ' + w['word'] + ' ' + '+'.join(w['parts']))
print('applied fixes', len(applied)); [print('!', b) for b in bad]
js = '// مولَّد آلياً من tools/build_reading.py — لا تعدّله يدوياً\n'
js += 'export const BOOK = ' + json.dumps(BOOK, ensure_ascii=False) + ';\nexport const COMMON = ' + json.dumps(COMMON, ensure_ascii=False) + ';\n'
js += 'export const AUDIO = ' + json.dumps(audio, ensure_ascii=False) + ';\nexport const LESSONS = ' + json.dumps(LESSONS, ensure_ascii=False) + ';\n'
open(os.path.join(OUT, 'lessons.js'), 'w', encoding='utf-8').write(js)
json.dump({'book': BOOK, 'lessons': LESSONS}, open(os.path.join(OUT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'audio-list.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['اسم الملف', 'النص المشكول', 'الدرس', 'الصفحة']); w.writerows(rows)
report['applied'] = [{'unit': u, 'old': o, 'new': n} for u, o, n in applied]
report['outside'] = [x for x in report['outside'] if x]
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('lessons', len(LESSONS), 'games', sum(len(l['games']) for l in LESSONS), 'clips', len(rows))
sys.exit(1 if bad else 0)
