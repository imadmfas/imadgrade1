#!/usr/bin/env python3
"""يبني دروس «القرآن الكريم والتربية الإسلامية — الصف الأول» من books/islamic/source/*.json
ويكتب books/islamic/lessons.js و lessons.json و audio-list.csv و report.json.
قواعد خاصة:
- نصوص القرآن تُعرض بالرسم العثماني كما في الكتاب، وتُقارن بنص مصحف المجمع (حفص) وتُسجَّل الفروق في report.json (quran_diffs).
- مقاطع التلاوة كلها بالبادئة quran- وتأتي من تسجيلات بشرية فقط؛ لا تُعطى أبداً لصوت آلي.
- الأحاديث والأدعية والأذكار بنصّها كما في الكتاب.
- الألعاب للآداب فقط (صحيح/خطأ، اختيار صورة السلوك، ترتيب خطوات الطعام).
"""
import json, os, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'books', 'islamic', 'source')
OUT = os.path.join(ROOT, 'books', 'islamic')
Q = json.load(open(os.path.join(SRC, 'quran.json'), encoding='utf-8'))
S = json.load(open(os.path.join(SRC, 'lessons.json'), encoding='utf-8'))
fail = []
# ---------- تطبيق تصحيحات القارئ الثاني (مطابقة تامة، مع رقم الصفحة) ----------
V = json.load(open(os.path.join(SRC, 'verify.json'), encoding='utf-8'))
applied = []
def fix(val, page):
    for f in V['fixes']:
        if f['old'] == val and int(f['page']) == int(page) and f['old'] != f['new']: applied.append({'page': page, 'old': f['old'], 'new': f['new']}); return f['new']
    return val
for SL in S['lessons']:
    for b in SL.get('blocks', []):
        for k in ('intro', 'outro'):
            if b.get(k): b[k] = fix(b[k], b['page'])
        if b.get('lines'): b['lines'] = [fix(x, b['page']) for x in b['lines']]
        for r in b.get('rounds', []):
            if r.get('say'): r['say'] = fix(r['say'], b['page'])

# ---------- مفاتيح الرسوم الموجودة ----------
ART_KEYS = set()
for f in [os.path.join(ROOT, 'src', 'art.js')] + glob.glob(os.path.join(ROOT, 'src', 'art', '*.js')):
    ART_KEYS |= set(re.findall(r'^\s{2}([a-z_0-9]+): \(\) =>', open(f, encoding='utf-8').read(), re.M))
def need_art(k, where):
    if k and k not in ART_KEYS: fail.append(f'{where}: رسم غير موجود «{k}»')
    return k

BOOK = {'id': 'islamic', 'title': 'التَّرْبِيَةُ الْإِسْلَامِيَّةُ', 'grade': 'لِلصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ', 'color': '#c2255c', 'color2': '#2f9e44', 'soft': '#fde7ef', 'digits': 'arabic-indic', 'dir': 'rtl', 'lang': 'ar'}
UNIT = 'الْقُرْآنُ الْكَرِيمُ وَالتَّرْبِيَةُ الْإِسْلَامِيَّةُ'

# ---------- السجل الصوتي ----------
audio, rows = {}, []
def reg(text, lid, page, key):
    if not text: return None
    if text in audio: return audio[text]
    fn = f'{lid}-{key}.mp3'
    assert fn not in [r[0] for r in rows], fn
    audio[text] = fn; rows.append([fn, text, lid, page]); return fn
quran_rows = []
def reg_quran(fn, text, lid, page):
    assert fn.startswith('quran-')
    if fn not in [r[0] for r in quran_rows]: quran_rows.append([fn, text, lid, page])
    return fn

SAY = {
    'quran': 'اِسْتَمِعْ وَرَدِّدِ الْآيَاتِ', 'lines': 'اِلْمَسِ الْجُمْلَةَ وَاسْمَعْ', 'hadith': 'اِلْمَسِ الْحَدِيثَ وَاسْمَعْ',
    'tick': 'هَلِ التَّصَرُّفُ صَحِيحٌ؟', 'choose': 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ', 'order': 'رَتِّبِ الصُّوَرَ بِالدَّوْرِ',
}
UI = {'noAudio': 'رَدِّدْ مَعَ مُعَلِّمِكَ', 'yes': 'تَصَرُّفٌ صَحِيحٌ', 'no': 'تَصَرُّفٌ خَطَأٌ'}
COMMON = {'praise': ['أَحْسَنْتَ!', 'رَائِعٌ!', 'مُمْتَازٌ!'], 'encourage': ['حَاوِلْ مَرَّةً أُخْرَى', 'هَيَّا مَرَّةً أُخْرَى'], 'star': 'نَجْمَةٌ جَدِيدَةٌ!', 'sticker': 'مُلْصَقٌ جَدِيدٌ لِدَفْتَرِكَ!', 'welcome': 'هَيَّا نَلْعَبُ وَنَتَعَلَّمُ!', 'map': 'اِخْتَرْ دَرْسًا مِنَ الطَّرِيقِ'}
for k, v in COMMON.items():
    for j, t in enumerate(v if isinstance(v, list) else [v]): reg(t, 'c', '', f'{k}{j+1}')
for k, t in SAY.items(): reg(t, 'c', '', k)
for k, t in UI.items(): reg(t, 'c', '', k)
reg(BOOK['title'], 'c', '', 'title'); reg(UNIT, 'c', '', 'unit')

# ---------- التحقق من القرآن ومقارنته بالمصحف ----------
TASH = re.compile('[ً-ٰٟۖ-ۭـ]')
quran_diffs = []
for pid, P in Q['passages'].items():
    for n, text in P['ayat']:
        ref = Q['mushaf_majma'][f"{P['surah']}:{n}"]
        if text == ref: continue
        if P.get('partial') and ref.endswith(text):
            quran_diffs.append({'passage': pid, 'surah': P['surah'], 'aya': n, 'page': P['page'], 'type': 'جزء من آية',
                                'detail': 'الكتاب يطبع آخر الآية فقط، من «' + text.split()[0] + '» إلى آخرها؛ أولها «' + ref[:len(ref) - len(text)].strip() + '» غير مطبوع.'})
            continue
        bw, rw = text.split(), ref.split()
        d = [(i, a, b) for i, (a, b) in enumerate(zip(bw, rw)) if a != b]
        quran_diffs.append({'passage': pid, 'surah': P['surah'], 'aya': n, 'page': P['page'], 'type': 'اختلاف حرفي',
                            'book': text, 'mushaf': ref, 'words': [{'n': i + 1, 'book': a, 'mushaf': b} for i, a, b in d] + ([{'note': 'عدد الكلمات مختلف'}] if len(bw) != len(rw) else [])})
        fail.append(f'quran {pid}:{n}: يخالف المصحف')
    if P.get('basmala_is_aya') is not True and not P.get('partial'):
        pass
quran_diffs.append({'passage': 'intro', 'surah': 21, 'aya': 107, 'page': 3, 'type': 'غير منقول', 'detail': 'آية الأنبياء ١٠٧ في مقدمة الكتاب (للكبار) لم تُعرض في التطبيق.'})
quran_diffs.append({'passage': 'nashid', 'page': 15, 'type': 'غير منقول', 'detail': 'نشيد «أنا مُسلِمُ» يضمّ عبارة «وقُلْ هُوَ اللّهُ أحَد» بالخط العادي ضمن بيت؛ نصوص الأناشيد لا تُعرض، فلم تُنقل.'})

# ---------- بناء الدروس ----------
def chunks(lst, n):
    out = []
    while lst:
        k = n if len(lst) > n + 1 else len(lst)  # لا يبقى سطر وحيد في آخر مجموعة
        out.append(lst[:k]); lst = lst[k:]
    return out
def sticker_name(t): return 'مُلْصَقُ ' + t
NASHID_SCENE = {'items': [{'art': 'mosque', 'x': 30, 'y': 40, 'w': 130}, {'art': 'isl_girl_reading', 'x': 170, 'y': 90, 'w': 100}, {'art': 'palm_trees', 'x': 270, 'y': 40, 'w': 120}, {'art': 'crescent_moon', 'x': 300, 'y': 2, 'w': 50}, {'art': 'flowers', 'x': 20, 'y': 170, 'w': 70}], 'bg': {}}
lessons, notes, outside, inferred, merges, skipped = [], [], [], [], [], []
counts = {}
for SL in S['lessons']:
    lid = SL['id']
    if 'nashid' in SL:
        n = SL['nashid']
        lessons.append({'id': lid, 'book': 'islamic', 'unit': 1, 'unitTitle': UNIT, 'unitPage': 5, 'pages': SL['pages'], 'title': '♪', 'kind': 'nashid', 'items': [], 'syllables': [], 'games': [],
                        'nashid': {'title': n['title'], 'poet': '', 'page': n['page'], 'audio': reg(n['title'], lid, n['page'], 'nashid')}, 'scene': NASHID_SCENE})
        continue
    L = {'id': lid, 'book': 'islamic', 'unit': 1, 'unitTitle': UNIT, 'unitPage': 5, 'pages': SL['pages'], 'title': SL['title'], 'bookTitle': SL['book_title'],
         'kind': 'quran' if any(b['type'] == 'quran' for b in SL['blocks']) else 'lesson', 'items': [], 'syllables': [], 'games': []}
    reg(SL['title'], lid, SL['pages'][0], 'title')
    li = 0
    def ln(text, page, art=None):
        global li
        li += 1
        return {'text': text, 'audio': reg(text, lid, page, f'l{li:02d}'), **({'art': need_art(art, lid)} if art else {})}
    for b in SL['blocks']:
        t, pg = b['type'], b['page']
        if t == 'quran':
            P = Q['passages'][b['passage']]
            ayat = [{'n': n, 'text': text, 'audio': reg_quran(f"quran-{b['passage']}-{n:03d}.mp3", text, lid, pg)} for n, text in P['ayat']]
            data = {'passage': b['passage'], 'surah': P['surah'], 'name': P['name'], 'ayat': ayat, 'noAudio': UI['noAudio']}
            if not P.get('basmala_is_aya'):
                data['basmala'] = {'text': Q['basmala']['book'], 'audio': reg_quran(Q['basmala']['audio'], Q['basmala']['book'], lid, pg)}
            if b.get('note'): data['note'] = b['note']; reg(b['note'], lid, pg, 'note')
            reg(P['name'], lid, pg, 'surah')
            L['games'].append({'template': 'quran', 'page': pg, 'data': data, 'say': SAY['quran'], 'audio': audio[SAY['quran']]})
        elif t in ('read', 'hadith'):
            src_lines = b['lines']
            if b.get('brackets'):
                o, c = b['brackets'].split()
                src_lines = [o + x + c for x in src_lines]
            if b.get('pairs'):
                pass
            arts = b.get('art', [])
            items = [ln(x, pg, arts[i] if i < len(arts) else None) for i, x in enumerate(src_lines)]
            groups = chunks(items, 4) if t == 'read' else [items]
            if len(groups) > 1: merges.append(f'{lid} ص{pg}: {len(items)} سطراً قُسِّمت إلى {len(groups)} صفحات «اسمع والمس».')
            for gi, gr in enumerate(groups):
                data = {'lines': gr}
                if b.get('numbered'): data['numbered'] = True
                if b.get('intro') and gi == 0: data['intro'] = b['intro']
                if b.get('outro') and gi == len(groups) - 1: data['outro'] = b['outro']
                if t == 'hadith': data['style'] = 'hadith'
                key = 'hadith' if t == 'hadith' else 'lines'
                L['games'].append({'template': 'lines', 'page': pg, 'data': data, 'say': SAY[key], 'audio': audio[SAY[key]]})
        elif t == 'choose':
            rounds = []
            for r in b['rounds']:
                if not 2 <= len(r['options']) <= 4: fail.append(f'{lid}: خيارات خارج 2–4')
                reg(r['say'], lid, pg, f'x{len(rows)+1:03d}')
                rounds.append({'say': r['say'], 'options': [{'art': need_art(a, lid)} for a in r['options']], 'answer': r['answer']})
            if not 3 <= len(rounds) <= 5: fail.append(f'{lid}: جولات الاختيار {len(rounds)}')
            L['games'].append({'template': 'choose', 'page': pg, 'data': {'rounds': rounds}, 'say': SAY['choose'], 'audio': audio[SAY['choose']]})
            if b.get('outside'): outside.append(f'{lid}: {b["outside"]}')
        elif t == 'tick':
            rounds = []
            for r in b['rounds']:
                rr = {'art': need_art(r['art'], lid), 'good': r['good']}
                if r.get('text'): rr['text'] = r['text']; rr['audio'] = reg(r['text'], lid, pg, f'x{len(rows)+1:03d}')
                if r.get('fix'): notes.append(f'{lid} ص{pg}: {r["fix"]}')
                rounds.append(rr)
            if not 3 <= len(rounds) <= 5: fail.append(f'{lid}: جولات صحيح/خطأ {len(rounds)}')
            if all(r['good'] for r in rounds) or not any(r['good'] for r in rounds): fail.append(f'{lid}: صحيح/خطأ بلا تنوع')
            L['games'].append({'template': 'tick', 'page': pg, 'data': {'rounds': rounds, **UI}, 'say': SAY['tick'], 'audio': audio[SAY['tick']]})
            if b.get('outside'): outside.append(f'{lid}: {b["outside"]}')
        elif t == 'order':
            prev = [g for g in L['games'] if g['template'] == 'lines' and g['page'] == pg and g['data'].get('style') != 'hadith']
            pool = [x for g in prev for x in g['data']['lines']]
            its = [{'art': pool[i]['art'], 'text': pool[i]['text']} for i in b['steps']]
            L['games'].append({'template': 'order', 'page': pg, 'data': {'rounds': [{'items': its}]}, 'say': SAY['order'], 'audio': audio[SAY['order']]})
    for s in SL.get('skipped', []): skipped.append(f'{lid}: {s}')
    if SL.get('merge'): merges.append(f'{lid}: {SL["merge"]}')
    st = SL['sticker']; L['sticker'] = {'name': sticker_name(SL['title']), 'art': need_art(st, lid), 'audio': reg(sticker_name(SL['title']), lid, '', 'sticker')}
    lessons.append(L)

# ---------- فحوص ----------
for L in lessons:
    for g in L['games']:
        counts[g['template']] = counts.get(g['template'], 0) + 1
        if g['template'] in ('choose',) and any(r['answer'] >= len(r['options']) for r in g['data']['rounds']): fail.append(L['id'] + ': جواب خارج الخيارات')
        # القرآن لا يدخل أي لعبة غير قالب الاستماع
        if g['template'] != 'quran':
            blob = json.dumps(g, ensure_ascii=False)
            if re.search('[ٱۖ-ۭ]', blob): fail.append(f'{L["id"]}: نص قرآني داخل لعبة {g["template"]}')
qtexts = {r[1] for r in quran_rows}
for t in audio:
    if t in qtexts: fail.append('نص قرآني في سجل الأصوات العام: ' + t)
if fail:
    print('\n'.join('✗ ' + f for f in fail)); sys.exit(1)

AUDIO = dict(audio)
js = '// مولَّد آلياً من tools/build_islamic.py — لا تعدّله يدوياً\n'
js += f'export const BOOK = {json.dumps(BOOK, ensure_ascii=False)};\n'
js += f'export const COMMON = {json.dumps(COMMON, ensure_ascii=False)};\n'
js += f'export const AUDIO = {json.dumps(AUDIO, ensure_ascii=False)};\n'
js += f'export const LESSONS = {json.dumps(lessons, ensure_ascii=False)};\n'
open(os.path.join(OUT, 'lessons.js'), 'w', encoding='utf-8').write(js)
json.dump({'book': BOOK, 'lessons': lessons}, open(os.path.join(OUT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'audio-list.csv'), 'w', encoding='utf-8') as f:
    f.write('﻿اسم الملف,النص المشكول,الدرس,الصفحة\n')
    for r in quran_rows + rows: f.write(','.join(str(x).replace(',', '،') for x in r) + '\n')
games = sum(len(L['games']) for L in lessons)
report = {
    'lessons': len([L for L in lessons if L['games']]), 'nashid_pages': len([L for L in lessons if not L['games']]), 'games': games, 'templates': counts,
    'audio_clips': len(rows), 'quran_clips': len(quran_rows),
    'quran_source': 'نص المقارنة: «majma» (مصحف مجمع الملك فهد، حفص عن عاصم) من أداة المكتبة الشاملة shamela_get_aya.',
    'quran_diffs': quran_diffs, 'merges': merges, 'skipped': skipped, 'outside': outside, 'inferred': inferred, 'notes': notes + Q.get('notes', []), 'second_reader': {'fixes_applied': applied, 'fixes_listed': len(V['fixes'])},
}
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'islamic: {report["lessons"]} lessons + {report["nashid_pages"]} nashid pages, {games} games {counts}, {len(rows)} clips + {len(quran_rows)} quran clips, quran diffs {len(quran_diffs)}')
