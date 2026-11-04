#!/usr/bin/env python3
"""يبني فهرس «قراءتي الجديدة» من ملفات القراءة في books/reading/source/u*.json:
- مقاطع Markdown لمستند الفهرس (/tmp/idx/secN.md)
- ملف audio-list.csv للكتاب كله (books/reading/audio-list-full.csv)
- plan.json: خطة الدروس والألعاب المقترحة
"""
import json, csv, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'books', 'reading', 'source')
OUT = '/tmp/idx'; os.makedirs(OUT, exist_ok=True)
AR = str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩')
ar = lambda n: str(n).translate(AR)
def pages(p): p = sorted(set(p)); return ar(p[0]) if len(p) == 1 else f'{ar(p[0])}–{ar(p[-1])}'

LETTER_ID = {'ب': 'ba', 'م': 'mim', 'د': 'dal', 'ف': 'fa', 'ر': 'ra', 'س': 'sin', 'ن': 'nun', 'ت': 'ta', 'ة': 'tam', 'و': 'waw', 'ي': 'ya', 'ق': 'qaf', 'ل': 'lam', 'ط': 'tta', 'ع': 'ayn', 'ح': 'ha', 'ش': 'shin', 'ز': 'zay', 'ج': 'jim', 'ص': 'sad', 'أ': 'alif', 'ض': 'dad', 'خ': 'kha', 'ث': 'tha', 'ك': 'kaf', 'غ': 'ghayn', 'ه': 'he', 'ذ': 'dhal', 'ظ': 'zza'}
SAY = {
    'listen': ('اسمع والمس', 'اِلْمَسْ كُلَّ صُورَةٍ وَاسْمَعْ'),
    'trace': ('تتبّع الحرف', 'تَتَبَّعِ الْحَرْفَ بِإِصْبَعِكَ'),
    'balloons': ('فرقعة البالونات', 'فَرْقِعِ الْبَالُونَ الَّذِي تَسْمَعُهُ'),
    'match': ('اسحب وطابق', 'اِسْحَبِ الْكَلِمَةَ إِلَى صُورَتِهَا'),
    'build': ('ركّب الكلمة', 'رَكِّبِ الْكَلِمَةَ مِنْ مَقَاطِعِهَا'),
    'choose': ('اسمع واختر', 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ'),
    'sort': ('التصنيف في سلّتين', 'ضَعْ كُلَّ صُورَةٍ فِي سَلَّتِهَا'),
    'memory': ('بطاقات الذاكرة', 'اِقْلِبْ بِطَاقَتَيْنِ مُتَشَابِهَتَيْنِ'),
    'order': ('الترتيب', 'رَتِّبِ الصُّوَرَ'),
    'train': ('القطار', 'أَجِبْ لِيَتَحَرَّكَ الْقِطَارُ'),
    'puzzle': ('أحجية الصورة', 'رَكِّبِ الصُّورَةَ'),
    'scene': ('مشهد تفاعلي', 'اِلْمَسِ الصُّورَةَ وَتَحَدَّثْ'),
    'complete': ('أكمل الكلمة', 'ضَعِ الْحَرْفَ النَّاقِصَ'),
    'read': ('اقرأ معي', 'اِسْمَعْ وَاقْرَأْ مَعِي'),
}
ROTATE = ['balloons', 'build', 'match', 'memory', 'train', 'complete']

HARAKA = re.compile('[ً-ْ]')
def norm(s):
    s = re.sub(r'\s*\((باهت، استنتاج)\)', '', s)
    s = re.sub(r'\s*\([ء-يـ]{1,2}\)\s*$', '', s)  # وسم حرف بين قوسين بعد الكلمة
    return s.strip()
BASE = lambda v: re.sub('[ً-ٰٟـ\\s]', '', v)
def is_text(c):
    v = c.get('value', '')
    return bool(v) and not v.startswith(('صورة', 'نشيد')) and re.search('[ء-ي]', v) and len(v) < 140 and not re.search(r'[()+…]|\.\.', v)
def parts(v):
    return [x.strip() for x in re.split(r'\s+[—–-]\s+', v) if x.strip()] if re.search(r'\s[—–-]\s', v) and len(v.split()) <= 6 else [v]

units = [json.load(open(os.path.join(SRC, f'u{i}.json'), encoding='utf-8')) for i in range(7)]
plan, rows, audio_seen = [], [], {}
def reg(text, lid, page, key):
    text = norm(text)
    if text in audio_seen: return audio_seen[text]
    fn = f'{lid}-{key}.mp3'; audio_seen[text] = fn; rows.append([fn, text, lid, page]); return fn

sections = []
rot = 0
for ui, U in enumerate(units):
    md = []
    head = U['section'] + f' — الصفحات {pages(U["pages"])}'
    md.append('## ' + head)
    Ls = U['lessons']
    # دمج الاستماع والمحادثة (ومقدمة الوحدة) في صفحة افتتاح واحدة
    opening = [L for L in Ls if L['kind'] in ('listening', 'conversation') or (L['kind'] == 'intro' and ui > 0)]
    rest = [L for L in Ls if L not in opening]
    lessons = []
    if ui == 0:
        prep = [L for L in Ls if L['pages'][0] == 7]
        longv = [L for L in Ls if L['pages'][0] != 7]
        lessons.append(('u0-prep', 'التَّهْيِئَةُ (أنشطة الاستعداد)', prep, ['sort', 'order', 'choose'], 'دُمجت الصفحات ٧–١٠ في درس واحد: اثنا عشر نشاطاً قصيراً للاستعداد، كل منها دقيقة واحدة تقريباً.'))
        for L, (lid, nm) in zip(longv, [('u0-madd-alif', 'صوت المد الطويل (ا، ى)'), ('u0-madd-waw', 'صوت المد الطويل (و)'), ('u0-madd-ya', 'صوت المد الطويل (يـ، ي)')]):
            lessons.append((lid, nm, [L], ['listen', 'trace', 'balloons'], ''))
    else:
        if opening:
            lessons.append((f'u{ui}-open', 'افتتاح الوحدة: الاستماع والمحادثة', opening, ['scene', 'puzzle'], 'دُمج درسا الاستماع والمحادثة في صفحة واحدة لأنهما في الصفحة نفسها من الكتاب ويقومان على صورة واحدة بلا كلمات للقراءة.'))
        for L in rest:
            k = L['kind']
            if k == 'letter':
                letter = L.get('letter') or re.search(r'\(([^)]+)\)', L['title']).group(1).split()[0]
                letter = letter.replace('ـ', '').replace('هـ', 'ه')[:1] if letter != 'هـ' else 'ه'
                lid = f'u{ui}-' + LETTER_ID.get(letter, 'x' + str(len(lessons)))
                if lid == 'u1-ba':
                    games = ['listen', 'trace', 'balloons', 'match', 'build']
                else:
                    g3 = 'order' if ui == 6 else ROTATE[rot % len(ROTATE)]; rot += (ui != 6)
                    games = ['listen', 'trace', g3]
                lessons.append((lid, f'حرف ({letter if letter != "ه" else "هـ"})' + (' — ة ـة' if letter == 'ة' else ''), [L], games, ''))
            elif k == 'tanween':
                nm = norm(L['title']); lid = f'u{ui}-tanween'
                games = ['balloons', 'match'] + (['sort'] if ui >= 3 else [])
                lessons.append((lid, nm, [L], games, ''))
            elif k == 'shadda':
                lessons.append((f'u{ui}-shadda', norm(L['title']), [L], ['listen', 'build', 'balloons'], ''))
            elif k == 'lam':
                lessons.append((f'u{ui}-lam', norm(L['title']), [L], ['sort', 'listen', 'match'], ''))
            elif k == 'nashid':
                lessons.append((f'u{ui}-nashid', 'نَشِيْدُ «' + norm(L['title']) + '»', [L], [], 'صفحة استماع بلا لعب ولا نجمة. لا يُعرض نص الأبيات؛ تظهر صورة مرسومة وعنوان النشيد وزر لتسجيل يرفعه المستخدم.'))
    if ui == 1:
        pass
    for lid, nm, srcs, games, why in lessons:
        pg = sorted({p for L in srcs for p in L['pages']})
        words, sylls, sents, prompts = [], [], [], []
        for L in srcs:
            for a in L.get('activities', []):
                for c in a.get('content', []):
                    if not is_text(c): continue
                    pgc = c.get('page', a.get('page'))
                    if L['kind'] == 'conversation':
                        if len(HARAKA.findall(c['value'])) >= 4: prompts.append(norm(c['value']))
                        continue
                    for v in parts(norm(c['value'])):
                        if not HARAKA.search(v) and len(BASE(v)) > 1: continue
                        if len(v.split()) >= 3: sents.append((v, pgc))
                        elif len(BASE(v)) <= 2 and not c.get('picture'): sylls.append((v, pgc))
                        else: words.append((v, pgc, c.get('picture')))
        dedup = lambda xs: list(dict.fromkeys(xs))
        wv = dedup([w[0] for w in words]); sv = dedup([s[0] for s in sylls]); tv = dedup([s[0] for s in sents])
        # الصوت
        n0 = len(rows)
        reg(nm, lid, pg[0], 't')
        for i, (v, p, _) in enumerate(words): reg(v, lid, p, f'w{i+1:02d}')
        for i, (v, p) in enumerate(sylls): reg(v, lid, p, f's{i+1:02d}')
        for i, (v, p) in enumerate(sents): reg(v, lid, p, f'r{i+1:02d}')
        for i, v in enumerate(dedup(prompts)): reg(v, lid, pg[0], f'q{i+1:02d}')
        for g in games: reg(SAY[g][1], 'عام', '', 'c-' + g)
        nclips = len(rows) - n0
        plan.append({'id': lid, 'unit': ui, 'title': nm, 'pages': pg, 'games': games, 'words': wv, 'syllables': sv, 'sentences': tv})
        md.append(f'### {nm} — ص {pages(pg)}')
        if why: md.append('- **الدمج أو المعالجة:** ' + why)
        if wv: md.append('- **الكلمات (' + ar(len(wv)) + '):** ' + '، '.join(wv[:40]) + ('…' if len(wv) > 40 else ''))
        if sv: md.append('- **المقاطع:** ' + ' '.join(sv[:30]))
        if tv: md.append('- **جمل القراءة:** ' + ' / '.join(tv[:6]))
        if prompts: md.append('- **أنا أتحدّث (يقولها الراوي):** ' + ' / '.join(dedup(prompts)[:5]))
        if games:
            md.append('- **الألعاب المقترحة:** ' + '، '.join(SAY[g][0] for g in games) + '.')
        md.append(f'- **عدد المقاطع الصوتية الجديدة:** {ar(nclips)}')
    sections.append('\n'.join(md))

for i, s in enumerate(sections): open(f'{OUT}/sec{i}.md', 'w', encoding='utf-8').write(s)
json.dump(plan, open(os.path.join(ROOT, 'books', 'reading', 'plan.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(ROOT, 'books', 'reading', 'audio-list-full.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['اسم الملف', 'النص المشكول', 'الدرس', 'الصفحة']); w.writerows(rows)
print('lessons', len(plan), 'games', sum(len(p['games']) for p in plan), 'clips', len(rows))
for p in plan: print(p['id'], p['title'], p['pages'][0], p['games'], len(p['words']), len(p['syllables']), len(p['sentences']))
