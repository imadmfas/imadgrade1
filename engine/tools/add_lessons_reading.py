#!/usr/bin/env python3
"""يكتب دروس كتاب «قراءتي الجديدة» إلى engine/books/reading/lessons.js و lessons.json و audio-list.csv.
المصدر الوحيد: الكتاب المرفق (طبعة 2026). كل عنصر يحمل رقم صفحته.
"""
import json, csv, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'books', 'reading')
os.makedirs(OUT, exist_ok=True)

BOOK = {
    'id': 'reading', 'title': 'قِرَاءَتِي الْجَدِيدَةُ', 'grade': 'لِلصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ',
    'color': '#e5484d', 'color2': '#3aa0e0', 'soft': '#ffe3e3', 'digits': 'arabic-indic', 'dir': 'rtl', 'lang': 'ar',
}

# عبارات عامة يقولها الراوي (تعليمات لا تتجاوز ست كلمات)
COMMON = {
    'praise': ['أَحْسَنْتَ!', 'رَائِعٌ!', 'مُمْتَازٌ!'],
    'encourage': ['حَاوِلْ مَرَّةً أُخْرَى', 'هَيَّا مَرَّةً أُخْرَى'],
    'star': 'نَجْمَةٌ جَدِيدَةٌ!',
    'sticker': 'مُلْصَقٌ جَدِيدٌ لِدَفْتَرِكَ!',
    'welcome': 'هَيَّا نَلْعَبُ وَنَتَعَلَّمُ!',
    'map': 'اِخْتَرْ دَرْسًا مِنَ الطَّرِيقِ',
}

def item(value, page, art):
    return {'value': value, 'page': page, 'art': art}

LESSONS = [
    {
        'id': 'u1-ba', 'book': 'reading', 'unit': 1, 'unitTitle': 'الْوَحْدَةُ الْأُولَى: أُسْرَتِي', 'unitPage': 17,
        'pages': [18, 19, 20], 'title': 'ب', 'subtitle': 'الدَّرْسُ الثَّالِثُ: الْقِرَاءَةُ',
        'narration': [{'text': 'أَتَعَرَّفُ الْحَرْفَ', 'page': 18}],
        'items': [
            # نشاط 1 ص18: أُرَدِّدُ مُنْتَبِهًا لِصَوْتِ حَرْفِ (ب)
            item('بَقَرَةُ', 18, 'baqara'), item('بُرْتُقَالُ', 18, 'burtuqal'), item('بِسَاطُ', 18, 'bisat'),
            item('حَلِيْبُ', 18, 'halib'), item('خُبْزُ', 18, 'khubz'), item('بَابُ', 18, 'bab'),
            item('بُوْقُ', 18, 'buq'), item('طَبِيْبُ', 18, 'tabib'),
            # نشاط 3 ص19
            item('بَصَلُ', 19, 'basal'), item('بِطِّيْخُ', 19, 'bittikh'),
        ],
        # مقاطع نشاط 2 ص18 ونشاط 6 ص20، وكلمات نشاط 5 و7
        'syllables': [
            {'value': 'بَـ', 'page': 18}, {'value': 'بَا', 'page': 18}, {'value': 'بُـ', 'page': 18},
            {'value': 'بُوْ', 'page': 18}, {'value': 'بِـ', 'page': 18}, {'value': 'بِيْـ', 'page': 18},
            {'value': 'بُ', 'page': 20}, {'value': 'بِي', 'page': 20},
            {'value': 'بَابُ', 'page': 19}, {'value': 'بَابَا', 'page': 19}, {'value': 'بَابِي', 'page': 19},
            {'value': 'ب', 'page': 18},
        ],
        'games': [
            {'template': 'listen', 'rounds': 1, 'page': 18, 'say': 'اِلْمَسْ كُلَّ صُورَةٍ وَاسْمَعْ',
             'data': {'letter': 'ب', 'items': ['بَقَرَةُ', 'بُرْتُقَالُ', 'بِسَاطُ', 'حَلِيْبُ', 'خُبْزُ', 'بَابُ', 'بُوْقُ', 'طَبِيْبُ']}},
            {'template': 'trace', 'rounds': 1, 'page': 20, 'say': 'تَتَبَّعِ الْحَرْفَ بِإِصْبَعِكَ',
             'data': {'glyph': 'ب', 'shape': 'ba'}},
            {'template': 'balloons', 'rounds': 4, 'page': 18, 'say': 'فَرْقِعِ الْبَالُونَ الَّذِي تَسْمَعُهُ',
             'data': {'choices': ['بَـ', 'بَا', 'بُـ', 'بُوْ', 'بِـ', 'بِيْـ'], 'targets': ['بَـ', 'بُوْ', 'بِـ', 'بَا'], 'per': 3}},
            {'template': 'match', 'rounds': 4, 'page': 19, 'say': 'اِسْحَبِ الْكَلِمَةَ إِلَى صُورَتِهَا',
             'data': {'pairs': ['بَابُ', 'بُوْقُ', 'بَصَلُ', 'طَبِيْبُ'], 'per': 3}},
            {'template': 'build', 'rounds': 3, 'page': 20, 'say': 'رَكِّبِ الْكَلِمَةَ مِنْ مَقَاطِعِهَا',
             'data': {'pieces': ['بُ', 'بَا', 'بِي'], 'words': [
                 {'word': 'بَابُ', 'parts': ['بَا', 'بُ'], 'art': 'bab'},
                 {'word': 'بَابَا', 'parts': ['بَا', 'بَا']},
                 {'word': 'بَابِي', 'parts': ['بَا', 'بِي']}]}},
        ],
        'sticker': {'name': 'مُلْصَقُ الْبَابِ', 'art': 'bab'},
    },
]

# ---------- أسماء ملفات الصوت ----------
audio = {}  # text -> filename
rows = []
def reg(text, lesson, page, key):
    if text in audio: return audio[text]
    fn = f'{key}.mp3'; audio[text] = fn; rows.append([fn, text, lesson, page]); return fn

for k, v in COMMON.items():
    for i, t in enumerate(v if isinstance(v, list) else [v]):
        reg(t, 'عام', '', f'c-{k}{i+1}')
reg(BOOK['title'], 'عام', 1, 'c-booktitle')
for L in LESSONS:
    p = L['id']
    reg(L['unitTitle'], L['id'], L['unitPage'], f'{p}-unit')
    for i, n in enumerate(L['narration']): n['audio'] = reg(n['text'], p, n['page'], f'{p}-n{i+1}')
    for i, it in enumerate(L['items']): it['audio'] = reg(it['value'], p, it['page'], f'{p}-w{i+1:02d}')
    for i, s in enumerate(L['syllables']): s['audio'] = reg(s['value'], p, s['page'], f'{p}-s{i+1:02d}')
    for i, g in enumerate(L['games']): g['audio'] = reg(g['say'], p, g['page'], f'{p}-g{i+1}')
    L['sticker']['audio'] = reg(L['sticker']['name'], p, L['pages'][0], f'{p}-sticker')
    L['speak'] = {t: audio[t] for t in audio}

# ---------- فحص: كل ما يقرؤه الطفل مشكول ----------
HAR = re.compile('[ً-ْ]')
bad = []
for L in LESSONS:
    for it in L['items'] + L['syllables']:
        if len(it['value']) > 1 and not HAR.search(it['value']): bad.append(it['value'])
    for g in L['games']:
        if len(g['say'].split()) > 6: bad.append('تعليمة طويلة: ' + g['say'])
if bad:
    print('مشكلات:', bad); sys.exit(1)

js = '// مولَّد آلياً من tools/add_lessons_reading.py — لا تعدّله يدوياً\n'
js += 'export const BOOK = ' + json.dumps(BOOK, ensure_ascii=False, indent=1) + ';\n'
js += 'export const COMMON = ' + json.dumps(COMMON, ensure_ascii=False, indent=1) + ';\n'
js += 'export const AUDIO = ' + json.dumps(audio, ensure_ascii=False) + ';\n'
js += 'export const LESSONS = ' + json.dumps(LESSONS, ensure_ascii=False, indent=1) + ';\n'
open(os.path.join(OUT, 'lessons.js'), 'w', encoding='utf-8').write(js)
json.dump({'book': BOOK, 'lessons': LESSONS}, open(os.path.join(OUT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'audio-list.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['اسم الملف', 'النص المشكول', 'الدرس', 'الصفحة']); w.writerows(rows)
print('lessons', len(LESSONS), 'audio clips', len(rows))
