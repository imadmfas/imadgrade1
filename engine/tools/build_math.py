#!/usr/bin/env python3
"""يبني دروس «الرياضيات — الصف الأول الابتدائي» من books/math/source/u*.json
ويكتب books/math/lessons.js و lessons.json و audio-list.csv و report.json.
كل عدد وكل حقيقة جمع أو طرح أو مقارنة أو ترتيب يُتحقق منها هنا، ويتوقف البناء عند أي خطأ.
عدد الأشياء المرسومة في كل لعبة عدّ يساوي الهدف تماماً (تُرسم قائمة objs صريحة ويُفحص طولها).
"""
import json, csv, os, re, random, sys, glob
random.seed(11)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'books', 'math', 'source')
OUT = os.path.join(ROOT, 'books', 'math')

AI = '٠١٢٣٤٥٦٧٨٩'
def D(n): return ''.join(AI[int(c)] if c.isdigit() else c for c in str(n))
MINUS = '−'
NUMW = ['صِفْرٌ', 'وَاحِدٌ', 'اِثْنَانِ', 'ثَلَاثَةٌ', 'أَرْبَعَةٌ', 'خَمْسَةٌ', 'سِتَّةٌ', 'سَبْعَةٌ', 'ثَمَانِيَةٌ', 'تِسْعَةٌ', 'عَشَرَةٌ',
        'أَحَدَ عَشَرَ', 'اِثْنَا عَشَرَ', 'ثَلَاثَةَ عَشَرَ', 'أَرْبَعَةَ عَشَرَ', 'خَمْسَةَ عَشَرَ', 'سِتَّةَ عَشَرَ', 'سَبْعَةَ عَشَرَ', 'ثَمَانِيَةَ عَشَرَ', 'تِسْعَةَ عَشَرَ', 'عِشْرُونَ']
TENW = ['', 'عَشَرَةٌ', 'عِشْرُونَ', 'ثَلَاثُونَ', 'أَرْبَعُونَ', 'خَمْسُونَ', 'سِتُّونَ', 'سَبْعُونَ', 'ثَمَانُونَ', 'تِسْعُونَ']
ORDW = ['الْأَوَّلُ', 'الثَّانِي', 'الثَّالِثُ', 'الرَّابِعُ', 'الْخَامِسُ', 'السَّادِسُ', 'السَّابِعُ', 'الثَّامِنُ', 'التَّاسِعُ', 'الْعَاشِرُ']
SIGNW = {'>': 'أَكْبَرُ مِنْ', '<': 'أَصْغَرُ مِنْ', '=': 'يُسَاوِي'}
def word(n): return NUMW[n] if 0 <= n <= 20 else TENW[n // 10] if n % 10 == 0 and n < 100 else D(n)

# أسماء الرسوم المتاحة (للتحقق من وجود كل رسم مستعمل)
ARTKEYS = set()
for f in glob.glob(os.path.join(ROOT, 'src', 'art.js')) + glob.glob(os.path.join(ROOT, 'src', 'art', '*.js')):
    t = open(f, encoding='utf-8').read()
    ARTKEYS |= set(re.findall(r'^\s+([a-z_0-9]+):\s*\(', t, re.M))
for h in range(1, 13): ARTKEYS |= {f'm_clk_{h}', f'm_clkh_{h}'}
ARTKEYS |= {'m_tower_5', 'm_tower_8'}

bad = []
def fail(msg): bad.append(msg)

# ---------- السجل الصوتي ----------
audio, rows = {}, []
def reg(text, lid, page, key=None):
    if not text: return None
    if text in audio: return audio[text]
    fn = f'{lid}-{key or "x" + str(len(rows))}.mp3'
    audio[text] = fn; rows.append([fn, text, lid, page]); return fn

SAY = {
    'count': 'عُدَّ ثُمَّ اخْتَرِ الْعَدَدَ', 'trace': 'تَتَبَّعِ الْعَدَدَ بِإِصْبَعِكَ', 'pattern': 'أَكْمِلِ النَّمَطَ',
    'arith+': 'اِخْتَرْ نَاتِجَ الْجَمْعِ', 'arith-': 'اِخْتَرْ نَاتِجَ الطَّرْحِ', 'arith±': 'اِخْتَرِ النَّاتِجَ',
    'hop+': 'عُدَّ إِلَى الْأَمَامِ وَالْمِسْ', 'hop-': 'عُدَّ إِلَى الْوَرَاءِ وَالْمِسْ',
    'more': 'اِلْمَسِ الْأَكْثَرَ', 'less': 'اِلْمَسِ الْأَقَلَّ', 'sign': 'اِخْتَرِ الرَّمْزَ الْمُنَاسِبَ',
    'asc': 'رَتِّبْ مِنَ الْأَصْغَرِ إِلَى الْأَكْبَرِ', 'desc': 'رَتِّبْ مِنَ الْأَكْبَرِ إِلَى الْأَصْغَرِ',
    'rowpick': 'اِلْمَسِ الَّذِي تَسْمَعُ تَرْتِيبَهُ', 'place': 'عُدَّ الْعَشَرَاتِ وَالْآحَادَ', 'sort': 'ضَعْ كُلَّ شَيْءٍ فِي سَلَّتِهِ',
    'match': 'اِسْحَبِ الِاسْمَ إِلَى شَكْلِهِ', 'memory': 'اِقْلِبْ بِطَاقَتَيْنِ مُتَشَابِهَتَيْنِ', 'clock': 'اِسْمَعْ وَاخْتَرِ السَّاعَةَ',
    'train': 'اِسْمَعْ وَاخْتَرِ النَّاتِجَ',
}
COMMON = {'praise': ['أَحْسَنْتَ!', 'رَائِعٌ!', 'مُمْتَازٌ!'], 'encourage': ['حَاوِلْ مَرَّةً أُخْرَى', 'هَيَّا مَرَّةً أُخْرَى'], 'star': 'نَجْمَةٌ جَدِيدَةٌ!', 'sticker': 'مُلْصَقٌ جَدِيدٌ لِدَفْتَرِكَ!', 'welcome': 'هَيَّا نَلْعَبُ وَنَتَعَلَّمُ!', 'map': 'اِخْتَرْ دَرْسًا مِنَ الطَّرِيقِ'}
for k, v in COMMON.items():
    for j, t in enumerate(v if isinstance(v, list) else [v]): reg(t, 'c', '', f'{k}{j+1}')
for k, t in SAY.items(): reg(t, 'c', '', re.sub(r'[+\-±]', lambda m: {'+': 'add', '-': 'sub', '±': 'mix'}[m.group()], k))
for n, w in enumerate(NUMW): reg(w, 'n', '', f'{n:02d}')
for n, w in enumerate(TENW[1:], 1): reg(w, 'n', '', f't{n}0')
for i, w in enumerate(ORDW): reg(w, 'n', 40, f'o{i+1:02d}')
for s, w in SIGNW.items(): reg(w, 'n', 34, {'>': 'gt', '<': 'lt', '=': 'eq'}[s])
reg('آحَادٌ', 'n', 158, 'ones'); reg('عَشَرَاتٌ', 'n', 158, 'tens')

def num_opts(ans, k=3, spread=(1, 2), lo=0):
    """خيارات عددية: الجواب ومعه أعداد مجاورة (فرق ١ أو ٢، أو ١٠ للعشرات)."""
    c = []
    for s in spread: c += [ans - s, ans + s]
    c = [x for x in dict.fromkeys(c) if x >= lo and x != ans]
    random.shuffle(c)
    return sorted([ans] + c[:k - 1])

def parse_eq(s):
    m = re.fullmatch(r'(\d+)([+\-])(\d+)=(\d+)', s)
    if not m: fail('صيغة معادلة غير مفهومة: ' + s); return None
    a, op, b, r = int(m[1]), m[2], int(m[3]), int(m[4])
    if (a + b if op == '+' else a - b) != r: fail(f'حقيقة خاطئة: {s}')
    if r < 0: fail('ناتج سالب: ' + s)
    return a, op, b, r

def periodic(seq):
    for p in range(1, len(seq) // 2 + 1):
        if all(seq[i] == seq[i % p] for i in range(len(seq))): return p
    return None

units = [json.load(open(f, encoding='utf-8')) for f in sorted(glob.glob(os.path.join(SRC, 'u*.json')), key=lambda f: int(re.search(r'u(\d+)', f)[1]))]
LESSONS, report = [], {'lessons': 0, 'games': 0, 'clips': 0, 'templates': {}, 'checks': {'counts': 0, 'facts': 0, 'compares': 0, 'orders': 0, 'patterns': 0}, 'inferred': [], 'outside': [], 'notes': [], 'skipped_pages': []}

def check_art(a, where):
    if a and a not in ARTKEYS: fail(f'{where}: رسم غير موجود {a}')

for U in units:
    ui, utitle = U['unit'], U['title']
    for li, L in enumerate(U['lessons']):
        lid = L['id']; items = []
        for v, a in L.get('items', []): check_art(a, lid); items.append({'value': v, 'art': a, 'page': L['pages'][0]})
        les = {'id': lid, 'book': 'math', 'unit': ui, 'unitTitle': utitle, 'unitPage': U['page'], 'pages': L['pages'], 'title': L['title'], 'bookTitle': L['book'], 'kind': 'lesson', 'items': items, 'syllables': [], 'games': []}
        toks = {**U.get('tokens', {}), **L.get('tokens', {})}
        first_art = None
        for G in L['games']:
            t, pg, where = G['t'], G['page'], f"{lid}/{G['t']}"
            g = None
            if t == 'count':
                rr = []
                for r in G['rounds']:
                    objs = [a for a, n in r['g'] for _ in range(n)]
                    target = sum(n for _, n in r['g'])
                    for a, _ in r['g']: check_art(a, where); first_art = first_art or a
                    # فحص صريح: عدد الأشياء المرسومة يساوي الهدف
                    if len(objs) != target: fail(f'{where}: المرسوم {len(objs)} ≠ الهدف {target}')
                    if target not in r['opts']: fail(f'{where}: الجواب {target} ليس بين الخيارات {r["opts"]}')
                    if len(set(r['opts'])) != len(r['opts']) or not 2 <= len(r['opts']) <= 4: fail(f'{where}: خيارات غير صالحة {r["opts"]}')
                    rr.append({'groups': [{'art': a, 'n': n} for a, n in r['g']], 'objs': objs, 'answer': target, 'options': r['opts']})
                    report['checks']['counts'] += 1
                g = {'template': 'count', 'data': {'rounds': rr}}
            elif t == 'trace':
                g = {'template': 'trace', 'data': {'shape': 'd%d' % G['digit']}, 'say': SAY['trace']}
            elif t == 'pattern':
                rr = []
                if 'nums' in G:
                    for seq in G['nums']:
                        known = [(i, v) for i, v in enumerate(seq) if v is not None]
                        if len(known) >= 2: step = (known[1][1] - known[0][1]) // (known[1][0] - known[0][0])
                        else: step = 1  # السابق والتالي: الفرق ١
                        full = [known[0][1] + (i - known[0][0]) * step for i in range(len(seq))]
                        if any(v is not None and v != full[i] for i, v in enumerate(seq)): fail(f'{where}: نمط عددي غير منتظم {seq}')
                        gi = seq.index(None); ans = full[gi]
                        if ans < 0 or ans > 99: fail(f'{where}: عدد خارج المدى {ans}')
                        sp = (abs(step),) if abs(step) > 1 else (1, 2)
                        opts = num_opts(ans, 3, sp)
                        tokseq = [None if v is None else {'n': v} for v in seq]
                        rr.append({'seq': tokseq, 'options': [{'n': o} for o in opts], 'answer': opts.index(ans)})
                        report['checks']['patterns'] += 1
                else:
                    for r in G['rounds']:
                        seq = r['seq']; gi = seq.index(None); full = seq[:gi] + [r['ans']] + seq[gi + 1:]
                        if not periodic(full): fail(f'{where}: النمط غير دوري {full}')
                        if r['ans'] not in r['opts']: fail(f'{where}: الجواب ليس بين الخيارات')
                        tok = lambda k: {kk: vv for kk, vv in toks[k].items()}
                        rr.append({'seq': [None if k is None else tok(k) for k in seq], 'options': [tok(k) for k in r['opts']], 'answer': r['opts'].index(r['ans'])})
                        report['checks']['patterns'] += 1
                g = {'template': 'pattern', 'data': {'rounds': rr}}
                if G.get('say'): g['say'] = G['say']
            elif t == 'arith':
                rr, ops = [], set()
                for a_, eqs in G['rounds']:
                    p = parse_eq(eqs)
                    if not p: continue
                    a, op, b, r = p; ops.add(op); report['checks']['facts'] += 1
                    arts = a_ if isinstance(a_, list) else [a_, a_]
                    for x in arts: check_art(x, where)
                    first_art = first_art or arts[0]
                    big = max(a, b, r) > 10
                    opts = num_opts(r, 3, (10,) if r % 10 == 0 and r >= 20 and a % 10 == 0 else (1, 2))
                    rd = {'op': op, 'a': a, 'b': b, 'answer': r, 'options': opts}
                    if arts[0]:
                        rd['art'] = arts[0]; rd['art2'] = arts[1]
                        # عدد الأشياء المرسومة: a + b للجمع، و a (يُشطب منها b) للطرح
                        drawn = a + b if op == '+' else a
                        if drawn > 20: fail(f'{where}: أشياء كثيرة {drawn}')
                        if op == '-' and drawn - b != r: fail(f'{where}: الباقي بعد الشطب ≠ الناتج')
                        if op == '+' and drawn != r: fail(f'{where}: المرسوم ≠ المجموع')
                    rr.append(rd)
                g = {'template': 'arith', 'data': {'rounds': rr}, 'say': SAY['arith' + ('±' if len(ops) > 1 else ops.pop())]}
            elif t == 'hop':
                rr, ops = [], set()
                for eqs in G['rounds']:
                    p = parse_eq(eqs)
                    if not p: continue
                    a, op, b, r = p; ops.add(op); report['checks']['facts'] += 1
                    lo, hi = min(a, r), max(a, r)
                    frm = max(0, lo - 2); to = frm + max(8, hi - frm + 2) - 1
                    rr.append({'start': a, 'step': b if op == '+' else -b, 'from': frm, 'to': to})
                    if not (frm <= a <= to and frm <= r <= to): fail(f'{where}: القفز خارج الخط')
                g = {'template': 'hop', 'data': {'rounds': rr}, 'say': SAY['hop' + ops.pop()]}
            elif t == 'compare':
                rr = []
                for r in G['rounds']:
                    a, b = r[0], r[1]
                    artA = r[2] if len(r) > 2 else None
                    artB = r[3] if len(r) > 3 and r[3] not in ('more', 'less', 'sign') else artA
                    mode = r[-1] if isinstance(r[-1], str) and r[-1] in ('more', 'less', 'sign') else G.get('mode', 'sign')
                    for x in (artA, artB): check_art(x, where)
                    if artA and max(a, b) > 20: fail(f'{where}: أشياء كثيرة للرسم')
                    if mode != 'sign' and a == b: fail(f'{where}: لا أكثر ولا أقل في {a},{b}')
                    rd = {'a': a, 'b': b, 'mode': mode}
                    if artA: rd['artA'] = artA; rd['artB'] = artB
                    if len({x[-1] if isinstance(x[-1], str) and x[-1] in ('more', 'less') else G.get('mode') for x in G['rounds']}) > 1: rd['say'] = SAY[mode]
                    rr.append(rd); report['checks']['compares'] += 1
                    first_art = first_art or artA
                modes = {x['mode'] for x in rr}
                g = {'template': 'compare', 'data': {'rounds': rr}, 'say': SAY[modes.pop()] if len(modes) == 1 else SAY[rr[0]['mode']]}
            elif t == 'order':
                rr = []
                if 'days' in G:
                    days = L['days']
                    for idx in G['days']:
                        if idx != sorted(idx) or any(idx[i + 1] - idx[i] != 1 for i in range(len(idx) - 1)): fail(f'{where}: أيام غير متتالية')
                        rr.append({'items': [{'text': days[i]} for i in idx], 'result': '، '.join(days[i] for i in idx)})
                    report['checks']['orders'] += len(rr)
                    g = {'template': 'order', 'data': {'rounds': rr}, 'say': G['say']}
                else:
                    for nums in G['rounds']:
                        s = sorted(nums, reverse=G['dir'] == 'desc')
                        if len(set(nums)) != len(nums): fail(f'{where}: أعداد مكررة')
                        if any((s[i] > s[i + 1]) != (G['dir'] == 'desc') for i in range(len(s) - 1)): fail(f'{where}: ترتيب خاطئ')
                        rr.append({'items': [{'text': D(x)} for x in s], 'result': '، '.join(D(x) for x in s)})
                        report['checks']['orders'] += 1
                    g = {'template': 'order', 'data': {'rounds': rr}, 'say': SAY[G['dir']]}
            elif t == 'rowpick':
                rr = []
                for a, n, k in G['rounds']:
                    check_art(a, where); first_art = first_art or a
                    if not 1 <= k <= n <= 10: fail(f'{where}: ترتيب خارج الصف')
                    rr.append({'art': a, 'n': n, 'target': k, 'say': ORDW[k - 1]})
                g = {'template': 'rowpick', 'data': {'rounds': rr}}
            elif t == 'place':
                rr = []
                for tn, on, ans in G['rounds']:
                    if tn * 10 + on != ans or not (0 <= on <= 9): fail(f'{where}: {tn} عشرات و{on} آحاد ≠ {ans}')
                    rr.append({'tens': tn, 'ones': on, 'answer': ans, 'options': num_opts(ans, 3, (10, 1) if on else (10,), 1)})
                    report['checks']['facts'] += 1
                g = {'template': 'place', 'data': {'rounds': rr}}
                first_art = first_art or 'm_rod'
            elif t == 'sort':
                its = [{'art': a, 'bin': b} for a, b in G['items']]
                for it in its: check_art(it['art'], where)
                g = {'template': 'sort', 'data': {'bins': [{'label': b} for b in G['bins']], 'items': its}}
                for b in G['bins']: reg(b, lid, pg)
                first_art = first_art or its[0]['art']
            elif t == 'match':
                g = {'template': 'match', 'data': {'pairs': [x['value'] for x in items], 'per': 3}}
            elif t == 'memory':
                g = {'template': 'memory', 'data': {'pairs': [{'text': x['value'], 'art': x['art']} for x in items[:4]]}}
            elif t == 'clock':
                rr = []
                for hr, opts in G['rounds']:
                    if hr not in opts or len(set(opts)) != len(opts): fail(f'{where}: خيارات الساعة')
                    k = 'm_clkh_' if G.get('half') else 'm_clk_'
                    say = f'السَّاعَةُ {D(hr)}' + (' وَالنِّصْفُ' if G.get('half') else '')
                    rr.append({'say': say, 'options': [{'art': k + str(o)} for o in opts], 'answer': opts.index(hr)})
                g = {'template': 'choose', 'data': {'rounds': rr}, 'say': SAY['clock']}
                first_art = first_art or 'm_clk_3'
                # بطاقات الذاكرة: الساعة وعددها
                les.setdefault('_extra', []).append({'template': 'memory', 'page': pg, 'say': SAY['memory'], 'data': {'pairs': [{'text': rr[i]['say'], 'art': rr[i]['options'][rr[i]['answer']]['art']} for i in range(min(4, len(rr)))]}})
            elif t == 'choose':
                rr = []
                if 'days' in L and G['rounds'] and 'dayopts' in G['rounds'][0]:
                    for r in G['rounds']: rr.append({'say': r['say'], 'options': [{'text': L['days'][i]} for i in r['dayopts']], 'answer': r['dayopts'].index(r['answer'])})
                elif 'lt' in G:
                    for nums in G['rounds']:
                        small = [x for x in nums if x < G['lt']]
                        if len(small) != 1: fail(f'{where}: يجب عدد واحد أصغر من {G["lt"]} في {nums}')
                        rr.append({'say': G['say'], 'options': [{'text': D(x)} for x in nums], 'answer': nums.index(small[0])})
                elif 'names' in G:
                    for i in G['names']: rr.append({'say': items[i]['value'], 'options': [{'art': items[j]['art']} for j in sorted({i, (i + 1) % len(items), (i + 3) % len(items)})], 'answer': sorted({i, (i + 1) % len(items), (i + 3) % len(items)}).index(i)})
                else:
                    for r in G['rounds']:
                        rd = {'say': r.get('say', G['say']), 'options': r['options'], 'answer': r['answer']}
                        if 'counts' in r:
                            c = r['counts']; want = max(c) if 'أَكْثَرُ' in rd['say'] else min(c)
                            if c.count(want) != 1 or c.index(want) != r['answer']: fail(f'{where}: جواب «الأكثر/الأقل» لا يطابق الأعداد {c}')
                            report['checks']['compares'] += 1
                        if 'calc' in r:  # جواب عددي يُحسب ويُتحقق منه
                            q = parse_eq(r['calc'])
                            if q and r['options'][r['answer']].get('text') != D(q[3]): fail(f'{where}: الجواب لا يطابق {r["calc"]}')
                            report['checks']['facts'] += 1
                        if 'count' in r:  # عدد الأشياء المرسومة في الكتاب
                            if r['options'][r['answer']].get('text') != D(r['count']): fail(f'{where}: الجواب لا يطابق العدد {r["count"]}')
                            report['checks']['counts'] += 1
                        for o in r['options']: check_art(o.get('art'), where)
                        rr.append(rd)
                for r in rr:
                    if not 2 <= len(r['options']) <= 4 or not 0 <= r['answer'] < len(r['options']): fail(f'{where}: خيارات غير صالحة')
                g = {'template': 'choose', 'data': {'rounds': rr}, 'say': G['say']}
                first_art = first_art or next((o['art'] for r in rr for o in r['options'] if o.get('art')), None)
            else:
                fail(f'{where}: قالب غير معروف')
                continue
            g['page'] = pg
            g.setdefault('say', SAY.get(t, ''))
            if not (3 <= len(g['data'].get('rounds', [0, 0, 0])) <= 5): fail(f'{where}: عدد الجولات {len(g["data"]["rounds"])}')
            les['games'].append(g)
        les['games'] += les.pop('_extra', [])
        # لعبة ثانية للدروس ذات اللعبة الواحدة من الحقائق نفسها: القطار (اسمع المعادلة واختر الناتج)
        if len(les['games']) == 1 and les['games'][0]['template'] in ('arith', 'hop'):
            g0 = les['games'][0]; rr = []
            for r in g0['data']['rounds'][:5]:
                if 'a' in r: a, op, b, res, opts = r['a'], r['op'], r['b'], r['answer'], r['options']
                else: a, b = r['start'], abs(r['step']); op = '+' if r['step'] > 0 else '-'; res = r['start'] + r['step']; opts = num_opts(res)
                rr.append({'say': f"{D(a)} {'+' if op == '+' else MINUS} {D(b)}", 'options': [{'text': D(o)} for o in opts], 'answer': opts.index(res)})
            les['games'].append({'template': 'train', 'page': g0['page'], 'say': SAY['train'], 'data': {'rounds': rr}})
            report['notes'].append(f'{lid}: لعبة القطار الثانية تعيد حقائق اللعبة الأولى نفسها مسموعةً.')
        les['sticker'] = {'name': f'مُلْصَقُ الدَّرْسِ {D(li + 1)}', 'art': first_art or 'star'}
        if L.get('notes'): les['notes'] = L['notes']
        LESSONS.append(les)

# ---------- التعليمات والصوت ----------
for les in LESSONS:
    lid = les['id']
    reg(les['unitTitle'], f"u{les['unit']}", les['unitPage'], 'unit')
    for i, it in enumerate(les['items']): it['audio'] = reg(it['value'], lid, it['page'], f'w{i+1:02d}')
    for gi, g in enumerate(les['games']):
        g['audio'] = reg(g['say'], lid, g['page'], f'g{gi+1}')
        d, pg = g['data'], g['page']
        for r in d.get('rounds', []):
            for k in ('say', 'result'):
                if r.get(k): reg(r[k], lid, pg)
            for o in r.get('options', []) + r.get('items', []):
                if isinstance(o, dict) and o.get('text'): reg(o['text'], lid, pg)
                if isinstance(o, dict) and o.get('say'): reg(o['say'], lid, pg)
            for o in r.get('seq', []):
                if o and o.get('say'): reg(o['say'], lid, pg)
                if o and 'n' in o and o['n'] > 20: reg(word(o['n']), lid, pg)
            for o in r.get('options', []):
                if isinstance(o, dict) and 'n' in o and o['n'] > 20: reg(word(o['n']), lid, pg)
            # ما يقوله الراوي عند النجاح
            if g['template'] == 'count': reg(word(r['answer']), lid, pg)
            if g['template'] == 'arith':
                reg(f"{D(r['a'])} {'+' if r['op'] == '+' else MINUS} {D(r['b'])} = {D(r['answer'])}", lid, pg)
                for o in r['options'] + [r['a'], r['b']]:
                    if o > 20: reg(word(o), lid, pg)
            if g['template'] == 'hop':
                e = r['start'] + r['step']; reg(f"{D(r['start'])} {'+' if r['step'] > 0 else MINUS} {D(abs(r['step']))} = {D(e)}", lid, pg)
            if g['template'] == 'compare':
                s = '>' if r['a'] > r['b'] else '<' if r['a'] < r['b'] else '='
                reg(f"{D(r['a'])} {SIGNW[s]} {D(r['b'])}", lid, pg)
                for o in (r['a'], r['b']):
                    if o > 20: reg(word(o), lid, pg)
            if g['template'] == 'place':
                for o in r['options']:
                    if o > 20 and o % 10: reg(word(o), lid, pg)
        for p in d.get('pairs', []): reg(p['text'] if isinstance(p, dict) else p, lid, pg)
    les['sticker']['audio'] = reg(les['sticker']['name'], lid, les['pages'][0], 'sticker')
    report['templates'] = {**report['templates'], **{g['template']: report['templates'].get(g['template'], 0) + 1 for g in les['games']}}

BOOK = {'id': 'math', 'title': 'الرِّيَاضِيَّاتُ', 'grade': 'لِلصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ', 'color': '#f59f00', 'color2': '#d6336c', 'soft': '#fff3d6', 'digits': 'arabic-indic', 'dir': 'rtl', 'lang': 'ar'}
reg(BOOK['title'], 'c', 1, 'booktitle')

# ---------- فحوص عامة ----------
LATIN = re.compile(r'[0-9]')
for les in LESSONS:
    if not les['games']: bad.append(les['id'] + ': بلا ألعاب')
    for g in les['games']:
        if len(g['say'].split()) > 6: bad.append(les['id'] + ': تعليمة طويلة ' + g['say'])
for t in audio:
    if LATIN.search(t): bad.append('أرقام لاتينية في نص منطوق/معروض: ' + t)
    if '٢' in t and False: pass
for les in LESSONS:
    for s in [les['title'], les['unitTitle'], les['sticker']['name']]:
        if LATIN.search(s): bad.append('أرقام لاتينية: ' + s)

report['lessons'] = len(LESSONS); report['games'] = sum(len(l['games']) for l in LESSONS); report['clips'] = len(rows)
report['skipped_pages'] = ['١–٥ (الغلاف والمقدمة والمحتوى)', 'الاختبارات القبلية ومراجعات الفصول واختباراتها (٧، ٢٨–٣١، ٣٣، ٥٠–٥٣، ٥٥، ٧٦–٧٩، ٨١، ٩٢–٩٥، ٩٧، ١٠٨–١١١، ١١٣، ١٢٢–١٢٧، ١٢٩، ١٥٠–١٥٣، ١٥٥، ١٧٠–١٧٥، ١٧٧، ١٨٤–١٨٨)',
                          'درس البعد المكاني (١٤٨–١٤٩): خريطة العراق ومشاهد القرب والبعد تحتاج مشهداً مرسوماً بالمسافات؛ لم يُبنَ له لعب']
report['inferred'] = ['تشكيل العناوين والكلمات المعروضة مكمَّل: الكتاب يشكّل بعض الحروف فقط؛ حُفظ تشكيل الكتاب وأُضيف الناقص، والنص كما طُبع محفوظ في الحقل bookTitle.',
                      'أسماء الأعداد المنطوقة (وَاحِدٌ … عِشْرُونَ) من مفردات الكتاب ص١٠–٢٤ بتشكيل كامل بصيغة الرفع؛ والعشرات (ثَلَاثُونَ …) من مفردات ص١٥٦.',
                      'أيام الأسبوع ص١٣٠ بتشكيل كامل؛ الكتاب يكتب «الاثنَين» فكُتب «الِاثْنَيْنِ».']
report['outside'] = ['الخيارات الخاطئة في ألعاب الأعداد أعداد مجاورة للجواب (فرق ١ أو ٢ أو ١٠) يولّدها البناء، وكلها ضمن مدى أعداد الدرس.',
                     'الأشياء التي لا رسم لها في المكتبة (جزر، هدايا، ملاعق…) رُسمت مكعباتِ عدّ بالعدد نفسه؛ الدلافين أسماكاً؛ وانظر notes في كل درس.',
                     'u4-sortshape: أسماء الأشكال (دَائِرَةٌ، مُرَبَّعٌ، مُثَلَّثٌ) من درس الأشكال المستوية ص١٤٦.']
print('lessons', report['lessons'], 'games', report['games'], 'clips', report['clips'], 'checks', report['checks'])
for b in bad: print('!', b)
if bad: sys.exit(1)
js = '// مولَّد آلياً من tools/build_math.py — لا تعدّله يدوياً\n'
js += 'export const BOOK = ' + json.dumps(BOOK, ensure_ascii=False) + ';\nexport const COMMON = ' + json.dumps(COMMON, ensure_ascii=False) + ';\n'
js += 'export const AUDIO = ' + json.dumps(audio, ensure_ascii=False) + ';\nexport const LESSONS = ' + json.dumps(LESSONS, ensure_ascii=False) + ';\n'
open(os.path.join(OUT, 'lessons.js'), 'w', encoding='utf-8').write(js)
json.dump({'book': BOOK, 'lessons': LESSONS}, open(os.path.join(OUT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'audio-list.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['اسم الملف', 'النص المشكول', 'الدرس', 'الصفحة']); w.writerows(rows)
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
