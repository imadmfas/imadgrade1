#!/usr/bin/env python3
"""يبني دروس «العلوم — الصف الأول الابتدائي» من books/science/source/u*.json
ويكتب books/science/lessons.js و lessons.json و audio-list.csv و report.json.
كل كلمة وجملة تعرض على الطفل مأخوذة من الكتاب (الحقل value في المصدر، والحقل book هو النص كما طُبع).
الكتاب قليل التشكيل، فالحقل value هو النص نفسه مشكولاً كاملاً؛ والفروق مسجلة في report.json (vowelled).
"""
import json, csv, os, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'books', 'science', 'source')
OUT = os.path.join(ROOT, 'books', 'science')
H = 'ً-ْٰ'
HAR = re.compile(f'[{H}]')
base = lambda s: re.sub(f'[{H}ـ\\s؟]', '', s)

units = [json.load(open(os.path.join(SRC, f'u{i}.json'), encoding='utf-8')) for i in range(7)]
# فهرس المصطلحات: value → (page, book)
TERMS = {}
for U in units:
    for L in U['lessons']:
        for t in L['terms']:
            TERMS.setdefault(t['value'], t)
        TERMS.setdefault(L['title']['value'], L['title'])
    TERMS.setdefault(U['title']['value'], U['title'])
def P(v):
    if v not in TERMS: raise SystemExit('ليس في المصدر: ' + v)
    return TERMS[v]['page']

# ---------- خريطة الرسوم ----------
ART = {
    'الْعُصْفُورُ': 'bird', 'الْحَجَرُ': 'rock', 'الْمَاءُ': 'sc_water_glass', 'الْهَوَاءُ': 'sc_wind', 'ضَوْءُ الشَّمْسِ': 'sun', 'الْغِذَاءُ': 'food_plate',
    'الْأَبْقَارُ': 'baqara', 'الْأَغْنَامُ': 'sheep', 'الصُّقُورُ': 'eagle', 'الْأُسُودُ': 'lion',
    'طِفْلٌ حَدِيثُ الْوِلَادَةِ': 'sc_newborn', 'يَنْمُو الطِّفْلُ وَيَكْبَرُ وَيَحْبُو': 'sc_crawl', 'يَنْمُو أَكْثَرَ وَيَتَعَلَّمُ الْمَشْيَ': 'sc_walk', 'يَذْهَبُ إِلَى الْمَدْرَسَةِ': 'sc_schoolkid',
    'أَرْنَبٌ حَدِيثُ الْوِلَادَةِ': 'sc_bunny0', 'أَرْنَبٌ بَعْدَ أُسْبُوعَيْنِ مِنَ الْوِلَادَةِ': 'sc_bunny1', 'أَرْنَبٌ بَعْدَ ثَمَانِيَةِ أَسَابِيعَ': 'sc_bunny2', 'أَرْنَبٌ كَبِيرٌ': 'rabbit',
    'بِذْرَةُ فَاصُولْيَا': 'sc_bean_seed', 'نَبَاتُ فَاصُولْيَا بَعْدَ الْإِنْبَاتِ': 'sc_bean_sprout', 'نَبَاتُ فَاصُولْيَا صَغِيرٌ': 'sc_bean_plant', 'ثَمَرَةُ فَاصُولْيَا بِدَاخِلِهَا بُذُورٌ': 'sc_bean_pod',
    'بِذْرَةُ زَهْرَةِ الشَّمْسِ': 'sc_sun_seed', 'تَنْبُتُ الْبِذْرَةُ فِي التُّرْبَةِ': 'sc_sun_sprout', 'نَبَاتٌ صَغِيرٌ': 'sc_sun_small', 'نَبَاتُ زَهْرَةِ الشَّمْسِ كَبِيرٌ': 'sc_sun_big',
    'جَزَرٌ': 'carrots', 'فِجْلٌ': 'sc_radish', 'شَلْغَمٌ': 'sc_turnip', 'خَسٌّ': 'lettuce', 'لَهَانَةٌ': 'sc_cabbage', 'قَرْنَبِيطٌ': 'sc_cauliflower', 'ذُرَةٌ': 'sc_corn', 'قَمْحٌ': 'wheat',
    'بَطَاطَا': 'sc_potato', 'بِطِّيخٌ': 'bittikh', 'بُرْتُقَالَةٌ': 'sc_orange', 'تُفَّاحَةٌ': 'apple',
    'أَطْرَافٌ': 'sc_cow_legs', 'زَهْرَةٌ': 'rose', 'رَأْسٌ': 'goat', 'وَرَقَةٌ': 'sc_leaf',
    'الْعَيْنَانِ': 'sc_eye', 'الْأُذُنَانِ': 'ear', 'الْأَنْفُ': 'sc_nose', 'الْفَمُ': 'sc_mouth', 'اللِّسَانُ': 'tongue', 'الْأَسْنَانُ': 'tooth',
    'اللَّمْسُ': 'hand', 'الشَّمُّ': 'sc_nose', 'الْبَصَرُ': 'sc_eye', 'التَّذَوُّقُ': 'tongue', 'السَّمْعُ': 'ear',
    'الْأُذُنُ عُضْوُ السَّمْعِ': 'ear', 'الْعَيْنُ عُضْوُ الْبَصَرِ': 'sc_eye', 'الْأَنْفُ عُضْوُ الشَّمِّ عِنْدِي': 'sc_nose', 'اللِّسَانُ عُضْوُ التَّذَوُّقِ': 'tongue', 'الْيَدُ وَالْجِلْدُ أَعْضَاءُ اللَّمْسِ': 'hand',
    'الصَّحْرَاءُ': 'sc_desert', 'الْغَابَةُ': 'forest', 'الْجِبَالُ': 'sc_mountains', 'مَزْرَعَةٌ': 'sc_farm', 'حَدِيقَةٌ': 'sc_garden',
    'الْمُدُنُ': 'sc_city', 'الْمَزَارِعُ': 'sc_farm', 'الْحَدَائِقُ': 'sc_garden',
    'الْمُحِيطَاتُ': 'sc_ocean', 'الْبِحَارُ': 'sc_sea', 'الْأَنْهَارُ': 'sc_river', 'الْأَهْوَارُ': 'sc_marsh', 'الْجَدَاوِلُ': 'sc_stream', 'السُّهُولُ': 'plain',
    'بِيئَةٌ مُشَيَّدَةٌ': 'sc_garden', 'بِيئَةٌ مَائِيَّةٌ': 'sc_sea', 'بِيئَةٌ يَابِسَةٌ طَبِيعِيَّةٌ': 'sc_desert',
    'الْجَمَلُ': 'sc_camel', 'الْغَزَالُ': 'gazelle', 'الْأَرْنَبُ': 'rabbit', 'الزَّرَافَةُ': 'sc_giraffe', 'الْقُرُودُ': 'monkey', 'النَّحْلُ': 'sc_bee',
    'الطَّحَالِبُ': 'sc_algae', 'الْقَصَبُ وَالْبَرْدِيُّ': 'sc_reeds', 'الْأَسْمَاكُ': 'fish', 'الضَّفَادِعُ': 'frog', 'الْحِيتَانُ': 'whale', 'السُّلَحْفَاةُ الْبَحْرِيَّةُ': 'turtle',
    'جَرَسٌ': 'sc_bell', 'قَدَحٌ فِيهِ مَاءٌ': 'sc_water_glass', 'لَيْمُونٌ': 'lemon', 'كِتَابٌ': 'book', 'كُرَةُ قَدَمٍ': 'ball',
    'الْعَلَمُ مَادَّةٌ': 'iraqi_flag', 'الْقَدَحُ مَادَّةٌ': 'sc_water_glass', 'الْمَاءُ مَادَّةٌ': 'sc_water_drop',
    'الْقَدَحُ': 'sc_water_glass', 'الْمِرْآةُ': 'sc_mirror', 'الْجِلَافَةُ': 'sc_sponge', 'اللُّعْبَةُ': 'sc_wool_toy', 'الصُّوصُ': 'chick',
    'فُسْتُقٌ': 'sc_pistachio', 'مُشْمُشٌ مُجَفَّفٌ': 'sc_apricot_dry', 'زَبِيبٌ': 'sc_raisins', 'إِنَاءٌ فَارِغٌ': 'sc_bowl',
    'سَلَطَةُ الْخُضَرَوَاتِ مَخْلُوطٌ': 'sc_salad', 'عَصِيرُ الْفَوَاكِهِ وَالْخُضَرَوَاتِ هُوَ مَخْلُوطٌ': 'sc_juice', 'مُحْتَوَيَاتُ مِحْفَظَتِي تُمَثِّلُ مَخْلُوطًا': 'pencil_case',
    'لُعْبَةٌ مَطَّاطِيَّةٌ': 'sc_rubber_toy', 'وَرَقُ نَبَاتٍ': 'sc_leaf', 'قِطْعَةُ خَشَبٍ': 'sc_wood', 'حَجَرٌ': 'rock', 'مِفْتَاحٌ مَعْدِنِيٌّ': 'key',
    'الْمِسْمَارُ': 'nail', 'الْمِلْعَقَةُ': 'sc_spoon', 'الْمِطْرَقَةُ': 'hammer',
    'الْغَطْسُ': 'sc_tank_sink', 'الْمَخْلُوطُ': 'sc_nuts_mix', 'الطَّفْوُ': 'sc_tank_float', 'الْخَلْطُ': 'sc_salt_fruit',
    'الْمِصْبَاحُ الْكَهْرَبَائِيُّ': 'light_bulb', 'الْمِدْفَأَةُ الْكَهْرَبَائِيَّةُ': 'sc_heater', 'التِّلْفَازُ': 'sc_tv', 'الْمِذْيَاعُ': 'radio', 'الْبَطَّارِيَّاتُ': 'sc_batteries', 'مُوَلِّدَةُ الْكَهْرَبَاءِ': 'sc_generator',
    'حَرَارَةٌ': 'sc_stove', 'ضَوْءٌ': 'sc_lamp', 'كَهْرَبَاءٌ': 'sc_batteries', 'صَوْتٌ': 'radio',
    'الْأَرْضُ': 'sc_globe', 'الْيَابِسَةُ': 'sc_land',
    'الْمِيَاهُ الْجَارِيَةُ': 'sc_waterfall', 'الرِّيَاحُ الْقَوِيَّةُ': 'sc_wind', 'الزَّلَازِلُ': 'sc_quake', 'الْبَرَاكِينُ': 'volcano', 'الزِّلْزَالُ': 'sc_quake', 'الْبُرْكَانُ': 'volcano',
    'الشِّتَاءُ': 'sc_winter', 'الرَّبِيعُ': 'sc_spring', 'الصَّيْفُ': 'sc_summer', 'الْخَرِيفُ': 'sc_autumn',
}

# رسم خاص بدرس واحد حين تختلف دلالة الكلمة: «الماء» في ص ٣٣ ماء الشرب (قدح)، وفي ص ١٨٠ و١٨٨ ماء البحار والمحيطات
LART = {('l21', 'الْمَاءُ'): 'sc_ocean', ('l22', 'الْمَاءُ'): 'sc_sea'}

# ---------- السجل الصوتي ----------
audio, rows = {}, []
def reg(text, lid, page, key=None):
    if not text: return None
    if text in audio: return audio[text]
    fn = f'{lid}-{key or "x" + str(len(rows))}.mp3'
    audio[text] = fn; rows.append([fn, text, lid, page]); return fn

SAY = {
    'look': 'اِلْمَسْ كُلَّ صُورَةٍ وَاسْمَعْ', 'looktext': 'اِلْمَسْ كُلَّ بِطَاقَةٍ وَاسْمَعْ', 'spot': 'اِلْمَسِ الْجُزْءَ الَّذِي تَسْمَعُهُ', 'spotscene': 'اِلْمَسِ الصُّورَةَ الَّتِي تَسْمَعُهَا',
    'choose': 'اِسْمَعْ وَاخْتَرِ الصُّورَةَ', 'choosetext': 'اِسْمَعْ وَاخْتَرِ الْجَوَابَ', 'match': 'اِسْحَبِ الْكَلِمَةَ إِلَى صُورَتِهَا', 'memory': 'اِقْلِبْ بِطَاقَتَيْنِ مُتَشَابِهَتَيْنِ',
    'sort': 'ضَعْ كُلَّ صُورَةٍ فِي سَلَّتِهَا', 'order': 'رَتِّبِ الصُّوَرَ مِنَ الْأَوَّلِ', 'puzzle': 'رَكِّبِ الصُّورَةَ',
    'mix': 'ضَعِ الْمَوَادَّ فِي الْإِنَاءِ', 'mix2': 'اِفْصِلِ الْمَوَادَّ بِيَدِكَ', 'water': 'هَلْ يَطْفُو أَمْ يَغْطِسُ؟', 'bigger': 'اِلْمَسِ الْأَكْبَرَ حَجْمًا',
}
COMMON = {'praise': ['أَحْسَنْتَ!', 'رَائِعٌ!', 'مُمْتَازٌ!'], 'encourage': ['حَاوِلْ مَرَّةً أُخْرَى', 'هَيَّا مَرَّةً أُخْرَى'], 'star': 'نَجْمَةٌ جَدِيدَةٌ!', 'sticker': 'مُلْصَقٌ جَدِيدٌ لِدَفْتَرِكَ!', 'welcome': 'هَيَّا نَلْعَبُ وَنَتَعَلَّمُ!', 'map': 'اِخْتَرْ دَرْسًا مِنَ الطَّرِيقِ'}
for k, v in COMMON.items():
    for j, t in enumerate(v if isinstance(v, list) else [v]): reg(t, 'c', '', f'{k}{j+1}')

report = {'vowelled': [], 'notes': [], 'outside': [], 'inferred': [], 'pictures_only': [], 'deviations': []}

# ---------- أدوات بناء الألعاب ----------
def opt(a): return {'art': a}
def look(vals, page, say=None):
    return {'template': 'look', 'page': page, 'say': say or (SAY['look'] if all(ART.get(v) for v in vals) else SAY['looktext']), 'data': {'items': vals}}
def choose(rounds, page, say=None):
    return {'template': 'choose', 'page': page, 'say': say or SAY['choose'], 'data': {'rounds': rounds}}
def rnd(say, arts, ans): return {'say': say, 'options': [opt(a) for a in arts], 'answer': ans}
def rndt(say, texts, ans): return {'say': say, 'options': [{'text': t} for t in texts], 'answer': ans}
def sort(bins, items, page, say=None):
    return {'template': 'sort', 'page': page, 'say': say or SAY['sort'], 'data': {'bins': [{'label': b} for b in bins], 'items': items}}
def si(art, b, text=None): return {'art': art, 'bin': b, **({'text': text} if text else {})}
def order(rounds, page, say=None):
    return {'template': 'order', 'page': page, 'say': say or SAY['order'], 'data': {'rounds': [{'items': [{'art': ART[v] if v in ART else v, 'text': v if v in ART else None} for v in r]} for r in rounds]}}
def match(vals, page, per=3): return {'template': 'match', 'page': page, 'say': SAY['match'], 'data': {'pairs': vals, 'per': per}}
def memory(vals, page): return {'template': 'memory', 'page': page, 'say': SAY['memory'], 'data': {'pairs': [{'text': v, 'art': ART[v]} for v in vals]}}
def puzzle(scene, page, n=4): return {'template': 'puzzle', 'page': page, 'say': SAY['puzzle'], 'data': {'scene': scene, 'pieces': n}}
def spot(artkey, parts, rounds, page): return {'template': 'spot', 'page': page, 'say': SAY['spot'], 'data': {'art': artkey, 'parts': parts, 'rounds': rounds}}
def spotscene(items, rounds, page, bg=None):
    sc = {'items': items, **({'bg': bg} if bg else {})}
    return {'template': 'spot', 'page': page, 'say': SAY['spotscene'], 'data': {'scene': sc, 'parts': {it['k']: it['k'] for it in items}, 'rounds': rounds}}

L = {}
# ---------- التهيئة: العلم ومهاراته ----------
L['intro'] = [
    look(['أُلَاحِظُ', 'أُصَنِّفُ', 'أُرَتِّبُ وَأُسَلْسِلُ', 'أُقَارِنُ', 'أَقِيسُ', 'أَتَوَقَّعُ', 'أَتَوَاصَلُ'], 8),
    order([['sc_plant_s', 'sc_plant_m', 'sc_plant_l']], 11, say='أُرَتِّبُ النَّبَاتَاتِ مِنَ الْأَقْصَرِ إِلَى الْأَطْوَلِ'),
    choose([rnd('الْأَطْوَلُ', ['sc_plant_m', 'sc_plant_l'], 1), rnd('الْأَقْصَرُ', ['sc_plant_s', 'sc_plant_l'], 0), rnd('الْأَطْوَلُ', ['sc_plant_l', 'sc_plant_s'], 0)], 13, say='أَيُّ النَّبَاتَيْنِ هُوَ الْأَطْوَلُ، وَأَيُّهُمَا الْأَقْصَرُ؟'),
]
report['pictures_only'].append('intro: لعبة ترتيب النباتات (ص ١١) صور بلا أسماء؛ الكتاب يسميها «نبات (١) (٢) (٣)» فقط.')
# ---------- الوحدة الأولى ----------
L['l1'] = [
    sort(['كَائِنٌ حَيٌّ', 'شَيْءٌ غَيْرُ حَيٍّ'], [si('bird', 0), si('sc_bee', 0), si('gazelle', 0), si('sc_herb', 0), si('sc_donkey', 0), si('sc_tomato_plant', 0), si('ball', 1), si('sc_chair', 1), si('sc_computer', 1)], 38),
    choose([rnd('كَائِنٌ حَيٌّ', ['bird', 'rock', 'sc_chair'], 0), rnd('شَيْءٌ غَيْرُ حَيٍّ', ['sc_herb', 'rock', 'sc_bee'], 1), rnd('كَائِنٌ حَيٌّ', ['ball', 'sc_computer', 'gazelle'], 2), rnd('شَيْءٌ غَيْرُ حَيٍّ', ['sc_donkey', 'ball', 'bird'], 1)], 28),
    look(['الْعُصْفُورُ', 'الْحَجَرُ'], 28),
    puzzle({'items': [{'art': 'sheep', 'x': 30, 'y': 130, 'w': 90}, {'art': 'sheep', 'x': 150, 'y': 150, 'w': 80}, {'art': 'sheep', 'x': 270, 'y': 128, 'w': 95}, {'art': 'cloud', 'x': 60, 'y': 10, 'w': 80}, {'art': 'grass', 'x': 200, 'y': 190, 'w': 60}], 'bg': {'ground': '#c9d98b'}}, 24),
]
report['pictures_only'].append('l1: صور التصنيف والاختيار من مراجعة الفصل ص ٣٨ (كرة، نبات، نحلة، غزال، كرسي، عصفور، حمار، حاسوب، نبتة طماطم) بلا أسماء لأن الكتاب لا يسميها هناك.')
L['l2'] = [
    look(['الْمَاءُ', 'الْهَوَاءُ', 'ضَوْءُ الشَّمْسِ', 'الْغِذَاءُ'], 33),
    choose([rnd('يَحْتَاجُ الْكَثِيرَ مِنَ الْمَاءِ', ['sc_rice_plant', 'sc_cactus'], 0), rnd('يَحْتَاجُ الْقَلِيلَ مِنَ الْمَاءِ', ['sc_rice_plant', 'sc_cactus'], 1), rnd('يَحْتَاجُ الْكَثِيرَ مِنَ الْمَاءِ', ['sc_cactus', 'sc_rice_plant'], 1)], 33),
    sort(['يَأْكُلُ النَّبَاتَاتِ', 'يَأْكُلُ اللُّحُومَ'], [si('baqara', 0, 'الْأَبْقَارُ'), si('sheep', 0, 'الْأَغْنَامُ'), si('eagle', 1, 'الصُّقُورُ'), si('lion', 1, 'الْأُسُودُ')], 34, say='ضَعْ كُلَّ حَيَوَانٍ فِي سَلَّتِهِ'),
]
L['l3'] = [
    order([['طِفْلٌ حَدِيثُ الْوِلَادَةِ', 'يَنْمُو الطِّفْلُ وَيَكْبَرُ وَيَحْبُو', 'يَنْمُو أَكْثَرَ وَيَتَعَلَّمُ الْمَشْيَ', 'يَذْهَبُ إِلَى الْمَدْرَسَةِ'],
           ['أَرْنَبٌ حَدِيثُ الْوِلَادَةِ', 'أَرْنَبٌ بَعْدَ أُسْبُوعَيْنِ مِنَ الْوِلَادَةِ', 'أَرْنَبٌ بَعْدَ ثَمَانِيَةِ أَسَابِيعَ', 'أَرْنَبٌ كَبِيرٌ']], 42, say='رَتِّبْ صُوَرَ النُّمُوِّ'),
    sort(['يَتَكَاثَرُ بِالْوِلَادَةِ', 'يَتَكَاثَرُ بِالْبَيْضِ'], [si('cat', 0), si('horse', 0), si('baqara', 0), si('fish', 1), si('bird', 1), si('sc_hen', 1)], 45, say='ضَعْ كُلَّ حَيَوَانٍ فِي سَلَّتِهِ'),
]
report['notes'].append('l3: صورة «يتناول الطعام بنفسه» (ص ٤٢) لم تُدرج في الترتيب حتى تبقى أربع خانات.')
report['pictures_only'].append('l3/l4: صور التصنيف بالولادة/بالبيض من ص ٤٥ و٥٣ بلا أسماء (الكتاب لا يسميها).')
L['l4'] = [
    order([['بِذْرَةُ فَاصُولْيَا', 'نَبَاتُ فَاصُولْيَا بَعْدَ الْإِنْبَاتِ', 'نَبَاتُ فَاصُولْيَا صَغِيرٌ', 'ثَمَرَةُ فَاصُولْيَا بِدَاخِلِهَا بُذُورٌ'],
           ['بِذْرَةُ زَهْرَةِ الشَّمْسِ', 'تَنْبُتُ الْبِذْرَةُ فِي التُّرْبَةِ', 'نَبَاتٌ صَغِيرٌ', 'نَبَاتُ زَهْرَةِ الشَّمْسِ كَبِيرٌ']], 47, say='رَتِّبْ مَرَاحِلَ نُمُوِّ النَّبَاتِ'),
    sort(['يَتَكَاثَرُ بِالْوِلَادَةِ', 'يَتَكَاثَرُ بِالْبَيْضِ'], [si('horse', 0), si('goat', 0), si('duck', 1), si('sc_goldfish', 1), si('frog', 1), si('turtle', 1)], 53, say='ضَعْ كُلَّ حَيَوَانٍ فِي سَلَّتِهِ'),
]
# ---------- الوحدة الثانية ----------
PLANT = {'root': 'الْجَذْرُ', 'stem': 'السَّاقُ', 'leaf': 'الْوَرَقَةُ', 'flower': 'الزَّهْرَةُ', 'fruit': 'الثَّمَرَةُ', 'seed': 'الْبِذْرَةُ'}
L['l5'] = [
    spot('sc_plant_parts', PLANT, ['root', 'leaf', 'flower', 'stem', 'fruit', 'seed'], 58),
    match(['جَزَرٌ', 'خَسٌّ', 'قَرْنَبِيطٌ', 'ذُرَةٌ', 'فِجْلٌ'], 58),
    sort(['الْجَذْرُ', 'الْوَرَقَةُ'], [si('carrots', 0, 'جَزَرٌ'), si('sc_radish', 0, 'فِجْلٌ'), si('sc_turnip', 0, 'شَلْغَمٌ'), si('lettuce', 1, 'خَسٌّ'), si('sc_cabbage', 1, 'لَهَانَةٌ')], 58, say='مَاذَا نَأْكُلُ مِنَ النَّبَاتِ؟'),
    sort(['السَّاقُ', 'الزَّهْرَةُ', 'الثَّمَرَةُ', 'الْبِذْرَةُ'], [si('sc_potato', 0, 'بَطَاطَا'), si('sc_cauliflower', 1, 'قَرْنَبِيطٌ'), si('bittikh', 2, 'بِطِّيخٌ'), si('sc_orange', 2, 'بُرْتُقَالَةٌ'),
         si('sc_corn', 3, 'ذُرَةٌ'), si('wheat', 3, 'قَمْحٌ')], 59, say='مَاذَا نَأْكُلُ مِنَ النَّبَاتِ؟'),
]
report['notes'].append('l5: السلال الأربع (ص ٥٩–٦٠): «يأكل الإنسان سيقان بعض النباتات كالبطاطا»، «أزهار بعض النباتات كالقرنبيط»، «ثمار بعض النباتات… والبرتقال والبطيخ»، «بذور بعض النباتات كالقمح والذرة». قالب السلال يعرض ست صور، فبقيت «تفاحة» (ص ٦٠) خارج اللعبة.')
report['notes'].append('l5: سلّتا «الجذر/الورقة» تعيدان جملتي ص ٥٨–٥٩: «يأكل الإنسان جذور بعض النباتات كالجزر والفجل والشلغم» و«أوراق بعض النباتات كالخس واللهانة».')
ANIMAL = {'head': 'الرَّأْسُ', 'neck': 'الرَّقَبَةُ', 'trunk': 'الْجِذْعُ', 'limbs': 'الْأَطْرَافُ'}
L['l6'] = [
    spot('sc_animal_parts', ANIMAL, ['head', 'trunk', 'limbs', 'neck'], 64),
    match(['أَطْرَافٌ', 'زَهْرَةٌ', 'رَأْسٌ', 'وَرَقَةٌ'], 69),
    choose([rnd('أَجْنِحَةٌ', ['eagle', 'fish', 'buffalo'], 0), rnd('زَعَانِفُ', ['buffalo', 'eagle', 'fish'], 2), rnd('أَرْجُلٌ قَوِيَّةٌ', ['fish', 'buffalo', 'eagle'], 1)], 66),
]
BODY = {'head': 'الرَّأْسُ', 'neck': 'الرَّقَبَةُ', 'trunk': 'الْجِذْعُ', 'arms': 'الْأَطْرَافُ الْعُلْيَا', 'legs': 'الْأَطْرَافُ السُّفْلَى'}
L['l7'] = [
    spot('sc_body', BODY, ['head', 'trunk', 'arms', 'legs', 'neck'], 74),
    look(['الْعَيْنَانِ', 'الْأُذُنَانِ', 'الْأَنْفُ', 'الْفَمُ', 'اللِّسَانُ', 'الْأَسْنَانُ'], 75),
    memory(['الْعَيْنَانِ', 'الْأُذُنَانِ', 'الْأَنْفُ', 'الْفَمُ'], 75),
]
L['l8'] = [
    look(['الْأُذُنُ عُضْوُ السَّمْعِ', 'الْعَيْنُ عُضْوُ الْبَصَرِ', 'الْأَنْفُ عُضْوُ الشَّمِّ عِنْدِي', 'اللِّسَانُ عُضْوُ التَّذَوُّقِ', 'الْيَدُ وَالْجِلْدُ أَعْضَاءُ اللَّمْسِ'], 80),
    match(['اللَّمْسُ', 'الشَّمُّ', 'الْبَصَرُ', 'التَّذَوُّقُ', 'السَّمْعُ'], 85),
    choose([rnd('السُّلُوكُ الصَّحِيحُ', ['sc_wash_hands', 'sc_tv_close', 'sc_sun_stare'], 0), rnd('السُّلُوكُ الْخَاطِئُ', ['sc_desk_write', 'sc_tv_close', 'sc_wash_hands'], 1),
            rnd('السُّلُوكُ الصَّحِيحُ', ['sc_sun_stare', 'sc_tv_close', 'sc_desk_write'], 2), rnd('السُّلُوكُ الْخَاطِئُ', ['sc_wash_hands', 'sc_desk_write', 'sc_sun_stare'], 2)], 85),
]
report['inferred'].append('l8: الكتاب (ص ٨٥) يطلب ✓/✗ تحت أربع صور دون إجابات؛ الإجابة المعتمدة: غسل اليدين والجلوس للكتابة صحيحان، والجلوس قرب التلفاز والنظر إلى السماء/الشمس خاطئان.')
# ---------- الوحدة الثالثة ----------
L['l9'] = [
    look(['الصَّحْرَاءُ', 'الْغَابَةُ', 'الْجِبَالُ', 'مَزْرَعَةٌ', 'حَدِيقَةٌ'], 90),
    sort(['الْبِيئَةُ الطَّبِيعِيَّةُ', 'الْبِيئَةُ الْمُشَيَّدَةُ'], [si('sc_desert', 0, 'الصَّحْرَاءُ'), si('forest', 0, 'الْغَابَةُ'), si('sc_mountains', 0, 'الْجِبَالُ'), si('sc_city', 1, 'الْمُدُنُ'), si('sc_farm', 1, 'الْمَزَارِعُ'), si('sc_garden', 1, 'الْحَدَائِقُ')], 90),
    puzzle({'items': [{'art': 'palm_tree', 'x': 20, 'y': 60, 'w': 120}, {'art': 'sc_camel', 'x': 150, 'y': 110, 'w': 120}, {'art': 'palm_tree', 'x': 290, 'y': 80, 'w': 90}], 'bg': {'ground': '#f2d49b'}}, 90),
]
L['l10'] = [
    sort(['بِيئَةٌ مَائِيَّةٌ مَالِحَةٌ', 'بِيئَةٌ مَائِيَّةٌ عَذْبَةٌ'], [si('sc_ocean', 0, 'الْمُحِيطَاتُ'), si('sc_sea', 0, 'الْبِحَارُ'), si('sc_river', 1, 'الْأَنْهَارُ'), si('sc_marsh', 1, 'الْأَهْوَارُ')], 95),
    match(['بِيئَةٌ مُشَيَّدَةٌ', 'بِيئَةٌ مَائِيَّةٌ', 'بِيئَةٌ يَابِسَةٌ طَبِيعِيَّةٌ'], 98),
    puzzle({'items': [{'art': 'sc_reeds', 'x': 10, 'y': 70, 'w': 110}, {'art': 'boat', 'x': 140, 'y': 140, 'w': 110}, {'art': 'sc_reeds', 'x': 280, 'y': 70, 'w': 110}, {'art': 'birds', 'x': 160, 'y': 20, 'w': 70}], 'bg': {'ground': '#74c0fc'}}, 94),
]
LAND = [{'k': 'الْجَمَلُ', 'art': 'sc_camel', 'x': 10, 'y': 120, 'w': 110}, {'k': 'الزَّرَافَةُ', 'art': 'sc_giraffe', 'x': 130, 'y': 50, 'w': 130}, {'k': 'الْغَزَالُ', 'art': 'gazelle', 'x': 270, 'y': 140, 'w': 100},
        {'k': 'الْأَرْنَبُ', 'art': 'rabbit', 'x': 300, 'y': 40, 'w': 80}, {'k': 'الْعُصْفُورُ', 'art': 'bird', 'x': 20, 'y': 10, 'w': 70}, {'k': 'النَّحْلُ', 'art': 'sc_bee', 'x': 210, 'y': 10, 'w': 60}, {'k': 'الْقُرُودُ', 'art': 'monkey', 'x': 110, 'y': 170, 'w': 85}]
L['l11'] = [
    spotscene(LAND, ['الْجَمَلُ', 'الزَّرَافَةُ', 'الْأَرْنَبُ', 'النَّحْلُ', 'الْغَزَالُ'], 102),
    memory(['الْجَمَلُ', 'الزَّرَافَةُ', 'الْغَزَالُ', 'الْأَرْنَبُ'], 103),
]
L['l12'] = [
    look(['الْأَسْمَاكُ', 'الضَّفَادِعُ', 'الْحِيتَانُ', 'السُّلَحْفَاةُ الْبَحْرِيَّةُ', 'الطَّحَالِبُ', 'الْقَصَبُ وَالْبَرْدِيُّ'], 108),
    sort(['الْبِيئَةُ الْيَابِسَةُ', 'الْبِيئَةُ الْمَائِيَّةُ'], [si('pigeon', 0), si('sc_camel', 0), si('sheep', 0), si('palm_tree', 0), si('whale', 1), si('fish', 1), si('sc_dolphin', 1), si('sc_tuna', 1)], 111),
    puzzle({'items': [{'art': 'whale', 'x': 20, 'y': 120, 'w': 130}, {'art': 'sc_dolphin', 'x': 170, 'y': 140, 'w': 100}, {'art': 'turtle', 'x': 290, 'y': 160, 'w': 90}, {'art': 'fish', 'x': 240, 'y': 70, 'w': 70}], 'bg': {'ground': '#4dabf7'}}, 108),
]
report['pictures_only'].append('l12: صور التصنيف يابسة/مائية من ص ١١١ بلا أسماء.')
# ---------- الوحدة الرابعة ----------
L['l13'] = [
    look(['جَرَسٌ', 'قَدَحٌ فِيهِ مَاءٌ', 'لَيْمُونٌ', 'كِتَابٌ', 'كُرَةُ قَدَمٍ'], 115),
    look(['الْعَلَمُ مَادَّةٌ', 'الْقَدَحُ مَادَّةٌ', 'الْمَاءُ مَادَّةٌ'], 116),
    memory(['جَرَسٌ', 'لَيْمُونٌ', 'كِتَابٌ', 'كُرَةُ قَدَمٍ'], 115),
]
L['l14'] = [
    choose([rnd('أَيُّهُمَا أَكْبَرُ حَجْمًا؟', ['sc_tennis', 'ball'], 1), rnd('أَيُّهُمَا أَكْبَرُ حَجْمًا؟', ['sc_bottle_big', 'sc_bottle_small'], 0),
            rnd('أَيُّهُمَا أَكْبَرُ حَجْمًا؟', ['sc_rock_small', 'sc_rock_big'], 1), rnd('أَيُّهُمَا أَكْبَرُ حَجْمًا؟', ['car', 'sc_bike'], 0)], 127, say=SAY['bigger']),
    sort(['أَمْلَسُ', 'خَشِنٌ', 'نَاعِمٌ'], [si('sc_water_glass', 0, 'الْقَدَحُ'), si('sc_mirror', 0, 'الْمِرْآةُ'), si('sc_sponge', 1, 'الْجِلَافَةُ'), si('rock', 1, 'الْحَجَرُ'), si('sc_wool_toy', 2, 'اللُّعْبَةُ'), si('chick', 2, 'الصُّوصُ')], 124, say='ضَعْ كُلَّ شَيْءٍ فِي سَلَّتِهِ'),
]
report['notes'].append('l14: «اِلْمَسِ الْأَكْبَرَ حَجْمًا» تعليمة مختصرة من «أرسم دائرة حول المادة التي لها حجم أكبر» (ص ١٢٧)؛ الجولات أزواج الصفحتين ١٢٥ و١٢٧.')
L['l15'] = [
    {'template': 'mix', 'page': 131, 'say': SAY['mix'], 'data': {'bowl': 'إِنَاءٌ فَارِغٌ', 'items': ['زَبِيبٌ', 'فُسْتُقٌ', 'مُشْمُشٌ مُجَفَّفٌ'], 'result': 'مَخْلُوطٌ', 'say2': SAY['mix2']}},
    look(['سَلَطَةُ الْخُضَرَوَاتِ مَخْلُوطٌ', 'عَصِيرُ الْفَوَاكِهِ وَالْخُضَرَوَاتِ هُوَ مَخْلُوطٌ', 'مُحْتَوَيَاتُ مِحْفَظَتِي تُمَثِّلُ مَخْلُوطًا'], 132),
]
FLOAT = [('لُعْبَةٌ مَطَّاطِيَّةٌ', 1), ('وَرَقُ نَبَاتٍ', 1), ('قِطْعَةُ خَشَبٍ', 1), ('حَجَرٌ', 0), ('مِفْتَاحٌ مَعْدِنِيٌّ', 0), ('الْمِسْمَارُ', 0), ('الْمِلْعَقَةُ', 0), ('الْمِطْرَقَةُ', 0)]
L['l16'] = [
    {'template': 'water', 'page': 137, 'say': SAY['water'], 'data': {'float': 'الطَّفْوُ', 'sink': 'الْغَطْسُ', 'items': [{'value': v, 'floats': bool(f)} for v, f in FLOAT]}},
    match(['الْغَطْسُ', 'الْمَخْلُوطُ', 'الطَّفْوُ', 'الْخَلْطُ'], 143),
]
report['notes'].append('l16: الطافيات من ص ١٣٧–١٣٨ (لعبة مطاطية، ورق نبات، قطعة خشب) والغاطسات من ص ١٣٧ و١٣٩ (حجر، مفتاح، مسمار، ملعقة، مطرقة)؛ الكتاب لا يحسم نتيجة التجربة في ص ١٣٧ لكن ص ١٣٨–١٣٩ تذكرها.')
# ---------- الوحدة الخامسة ----------
L['l17'] = [
    look(['الْمِصْبَاحُ الْكَهْرَبَائِيُّ', 'الْمِدْفَأَةُ الْكَهْرَبَائِيَّةُ', 'التِّلْفَازُ', 'الْمِذْيَاعُ', 'الْبَطَّارِيَّاتُ', 'مُوَلِّدَةُ الْكَهْرَبَاءِ'], 150),
    choose([rnd('الضَّوْءُ', ['light_bulb', 'sc_heater', 'radio'], 0), rnd('الْحَرَارَةُ', ['radio', 'light_bulb', 'sc_heater'], 2), rnd('الصَّوْتُ', ['sc_heater', 'radio', 'light_bulb'], 1)], 150),
]
L['l18'] = [
    choose([rnd('الشَّيْءُ الَّذِي يُعْطِي ضَوْءًا', ['sc_bell', 'light_bulb', 'sc_chair'], 1), rnd('الشَّيْءُ الَّذِي يُعْطِي ضَوْءًا', ['sc_chair', 'sc_bell', 'sc_flashlight'], 2),
            rnd('الْأَشْيَاءُ الَّتِي تُصْدِرُ صَوْتًا', ['oud', 'light_bulb', 'sc_chair'], 0), rnd('الْأَشْيَاءُ الَّتِي تُصْدِرُ صَوْتًا', ['sc_flashlight', 'sc_darbuka', 'light_bulb'], 1)], 157),
    match(['حَرَارَةٌ', 'ضَوْءٌ', 'كَهْرَبَاءٌ', 'صَوْتٌ'], 159),
]
L['l19'] = [
    choose([rnd('فَوْقَ', ['pos_above', 'pos_below', 'pos_front', 'pos_behind'], 0), rnd('تَحْتَ', ['pos_front', 'pos_below', 'pos_above', 'pos_behind'], 1),
            rnd('أَمَامَ', ['pos_behind', 'pos_above', 'pos_front', 'pos_below'], 2), rnd('خَلْفَ', ['pos_below', 'pos_front', 'pos_above', 'pos_behind'], 3)], 164),
    choose([rnd('بِخَطٍّ مُسْتَقِيمٍ', ['sc_road_zigzag', 'sc_road_straight', 'sc_carousel'], 1), rnd('بِشَكْلٍ مُتَعَرِّجٍ', ['sc_road_zigzag', 'sc_swing', 'sc_road_straight'], 0),
            rnd('بِشَكْلٍ دَائِرِيٍّ', ['sc_swing', 'sc_road_straight', 'sc_carousel'], 2), rnd('لِلْأَمَامِ وَالْخَلْفِ', ['sc_carousel', 'sc_swing', 'sc_road_zigzag'], 1)], 166),
]
report['notes'].append('l19: صور الأماكن (فوق/تحت/أمام/خلف) هي رسوم الكرة والصندوق المشتركة مع كتاب القراءة؛ الكلمات من ص ١٦٤.')
L['l20'] = [
    sort(['قُوَّةُ دَفْعٍ', 'قُوَّةُ سَحْبٍ'], [si('sc_push_toy', 0), si('sc_cart_push', 0), si('sc_car_push', 0), si('sc_pull_bag', 1), si('sc_horse_cart', 1), si('sc_net_pull', 1)], 170),
    choose([rnd('تَحْتَاجُ إِلَى قُوَّةِ دَفْعٍ صَغِيرَةٍ', ['sc_car_push', 'sc_cart_push'], 1), rnd('تَحْتَاجُ إِلَى قُوَّةِ دَفْعٍ كَبِيرَةٍ', ['sc_cart_push', 'sc_car_push'], 1), rnd('تَحْتَاجُ إِلَى قُوَّةِ دَفْعٍ صَغِيرَةٍ', ['sc_push_toy', 'sc_car_push'], 0)], 172),
]
report['pictures_only'].append('l20: صور الدفع والسحب من ص ١٧٠ و١٧٢ و١٧٤ بلا أسماء؛ صورتا العربة والشبكة في ص ١٧٤ صُنّفتا «سحب» (الحصان يسحب العربة، والصياد يسحب الشبكة) استنتاجاً من «قراءة علمية: الدفع والسحب».')
# ---------- الوحدة السادسة ----------
L['l21'] = [
    look(['الْأَرْضُ', 'الْمَاءُ', 'الْيَابِسَةُ'], 180),
    sort(['الْمَاءُ', 'الْيَابِسَةُ'], [si('sc_ocean', 0, 'الْمُحِيطَاتُ'), si('sc_river', 0, 'الْأَنْهَارُ'), si('sc_stream', 0, 'الْجَدَاوِلُ'), si('sc_mountains', 1, 'الْجِبَالُ'), si('plain', 1, 'السُّهُولُ'), si('sc_desert', 1, 'الصَّحْرَاءُ')], 180),
    choose([{'say': 'أَيُّهُمَا أَكْبَرُ الْيَابِسَةُ أَمِ الْمَاءُ؟', 'options': [{'text': 'الْيَابِسَةُ', 'art': 'sc_land'}, {'text': 'الْمَاءُ', 'art': 'sc_ocean'}], 'answer': 1},
            rnd('الْيَابِسَةُ', ['sc_ocean', 'sc_land'], 1), rnd('الْمَاءُ', ['sc_ocean', 'sc_land'], 0)], 179),
]
report['inferred'].append('l21: جواب «أيهما أكبر اليابسة أم الماء؟» (ص ١٧٩) = الماء، من تجربة مجسم الكرة الأرضية (اللون الأزرق أكبر).')
L['l22'] = [
    look(['الْمِيَاهُ الْجَارِيَةُ', 'الرِّيَاحُ الْقَوِيَّةُ', 'الزَّلَازِلُ', 'الْبَرَاكِينُ'], 184),
    match(['الزِّلْزَالُ', 'الْبُرْكَانُ', 'الْمَاءُ', 'الْأَرْضُ'], 188),
]
L['l23'] = [
    look(['الشِّتَاءُ', 'الرَّبِيعُ', 'الصَّيْفُ', 'الْخَرِيفُ'], 192),
    choose([rnd('فَصْلُ الشِّتَاءِ', ['sc_winter', 'sc_spring'], 0), rnd('فَصْلُ الرَّبِيعِ', ['sc_winter', 'sc_spring'], 1), rnd('فَصْلُ الرَّبِيعِ', ['sc_spring', 'sc_winter'], 0), rnd('فَصْلُ الشِّتَاءِ', ['sc_spring', 'sc_winter'], 1)], 193),
]
L['l24'] = [
    order([['الشِّتَاءُ', 'الرَّبِيعُ', 'الصَّيْفُ', 'الْخَرِيفُ']], 196, say='رَتِّبْ فُصُولَ السَّنَةِ'),
    match(['الرَّبِيعُ', 'الْخَرِيفُ', 'الصَّيْفُ', 'الشِّتَاءُ'], 199),
    choose([rndt('فِي أَيِّ فَصْلٍ تَزْدَادُ دَرَجَةُ الْحَرَارَةِ؟', ['فَصْلُ الْخَرِيفِ', 'فَصْلُ الصَّيْفِ'], 1), rndt('مَتَى يَتَغَيَّرُ لَوْنُ أَوْرَاقِ الْأَشْجَارِ وَتَتَسَاقَطُ؟', ['فَصْلُ الصَّيْفِ', 'فَصْلُ الْخَرِيفِ'], 1),
            rnd('فَصْلُ الصَّيْفِ', ['sc_autumn', 'sc_summer'], 1), rnd('فَصْلُ الْخَرِيفِ', ['sc_autumn', 'sc_summer'], 0)], 197),
]
report['notes'].append('l24: ترتيب الفصول من ص ١٩٢ («السنة فيها أربعة فصول هي: الشتاء والربيع والصيف والخريف») وص ١٩٦ («الصيف يأتي بعد فصل الربيع» و«الخريف يأتي بعد فصل الصيف»).')
report['outside'].append('l24: جولتا «فصل الصيف/فصل الخريف» مع لعبة المطابقة تستعمل كلمات الفصول من الدرس السابق (ص ١٩٢).')
report['outside'].append('l21: «الصحراء» و«الجبال» وردت أيضاً في درس البيئة اليابسة (ص ٩٠)، والكلمات هنا من ص ١٨٠–١٨١.')

STICK = {'intro': 'sc_plant_m', 'l1': 'bird', 'l2': 'sun', 'l3': 'rabbit', 'l4': 'sc_sun_big', 'l5': 'sc_leaf', 'l6': 'sc_giraffe', 'l7': 'hand', 'l8': 'sc_eye', 'l9': 'sc_camel', 'l10': 'fish',
         'l11': 'sc_bee', 'l12': 'sc_dolphin', 'l13': 'sc_bell', 'l14': 'ball', 'l15': 'sc_bowl_mix', 'l16': 'sc_rubber_toy', 'l17': 'light_bulb', 'l18': 'sc_darbuka', 'l19': 'sc_carousel',
         'l20': 'sc_cart_push', 'l21': 'sc_globe', 'l22': 'volcano', 'l23': 'sc_spring', 'l24': 'sc_autumn'}

# ---------- تجميع الدروس ----------
LESSONS = []
for U in units:
    for LL in U['lessons']:
        key = LL['key']; lid = key
        les = {'id': lid, 'book': 'science', 'unit': U['unit'], 'unitTitle': U['title']['value'], 'unitPage': U['title']['page'], 'pages': list(range(LL['pages'][0], LL['pages'][1] + 1)),
               'title': LL['title']['value'], 'kind': 'lesson', 'items': [], 'syllables': [], 'games': L[key]}
        seen = set()
        own = {t['value']: t['page'] for t in LL['terms']}
        def add(v):
            if v in seen or not v: return
            seen.add(v); les['items'].append({'value': v, 'page': own.get(v, P(v)), 'art': LART.get((key, v), ART.get(v))})
        for g in les['games']:
            d = g['data']
            for v in d.get('items', []):
                if isinstance(v, str): add(v)
                elif isinstance(v, dict) and v.get('value'): add(v['value'])
            for v in d.get('pairs', []):
                if isinstance(v, str): add(v)
            if g['template'] == 'mix': add(d['bowl'])
        les['sticker'] = {'name': LL['title']['value'], 'art': STICK[key]}
        LESSONS.append(les)

# ---------- التعليمات والصوت ----------
for les in LESSONS:
    lid = les['id']
    reg(les['unitTitle'], f'u{les["unit"]}', les['unitPage'], 'unit')
    for i, it in enumerate(les['items']): it['audio'] = reg(it['value'], lid, it['page'], f'w{i+1:02d}')
    for g in les['games']:
        g['audio'] = reg(g['say'], lid, g['page'])
        d = g['data']
        for r in d.get('rounds', []):
            if isinstance(r, dict):
                if r.get('say'): reg(r['say'], lid, g['page'])
                for o in r.get('options', []):
                    if o.get('text'): reg(o['text'], lid, g['page'])
                for o in r.get('items', []):
                    if o.get('text'): reg(o['text'], lid, g['page'])
        for b in d.get('bins', []): reg(b['label'], lid, g['page'])
        for it in d.get('items', []):
            if isinstance(it, dict) and it.get('text'): reg(it['text'], lid, g['page'])
        for p in d.get('pairs', []): reg(p['text'] if isinstance(p, dict) else p, lid, g['page'])
        for k in ('result', 'say2', 'float', 'sink', 'bowl'):
            if d.get(k): reg(d[k], lid, g['page'])
        for v in (d.get('parts') or {}).values(): reg(v, lid, g['page'])
    les['sticker']['audio'] = reg(les['sticker']['name'], lid, les['pages'][0], 'sticker')

BOOK = {'id': 'science', 'title': 'الْعُلُومُ', 'grade': 'لِلصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ', 'color': '#2f9e44', 'color2': '#f5c518', 'soft': '#e6f7e9', 'digits': 'arabic-indic', 'dir': 'rtl', 'lang': 'ar'}
reg(BOOK['title'], 'c', 1, 'booktitle')

# ---------- فحوص ----------
bad = []
artkeys = set()
for f in [os.path.join(ROOT, 'src', 'art.js')] + glob.glob(os.path.join(ROOT, 'src', 'art', '*.js')):
    artkeys |= set(re.findall(r'^\s*([a-z][a-z0-9_]*)\s*:\s*\(', open(f, encoding='utf-8').read(), re.M))
def chk_art(a, where):
    if a and a not in artkeys: bad.append(f'{where}: رسم غير موجود {a}')
LETTERS = re.compile('[ء-ي]')
def vowelled(t):
    """كل حرف يحمل حركة، إلا حروف المد والألف واللام الشمسية/القمرية والتاء المربوطة الموقوفة."""
    miss = []
    for w in re.split(r'\s+', re.sub(r'[؟!،.()]', '', t)):
        for i, ch in enumerate(w):
            if not LETTERS.match(ch): continue
            nxt = w[i + 1] if i + 1 < len(w) else ''
            if HAR.match(nxt): continue
            prev = w[i - 1] if i else ''
            if ch in 'اآى': continue
            if ch == 'ل' and i >= 1 and w[i - 1] == 'ا' and (i == 1 or w[:i - 1] in ('و', 'ب', 'ف', 'ك', 'لِ', 'بِ', 'وَ', 'فَ', 'كَ')): continue  # لام التعريف الشمسية
            j = i - 1
            while j >= 0 and HAR.match(w[j]) and w[j] not in 'ُِ': j -= 1
            if ch in 'وي' and j >= 0 and w[j] in 'ُِ': continue  # مد
            if ch == 'و' and i == len(w) - 1 and prev == 'ُ': continue
            miss.append(w); break
    return miss
texts = set(audio.keys())
for les in LESSONS:
    if len(les['games']) < 2: bad.append(les['id'] + ': أقل من لعبتين')
    chk_art(les['sticker']['art'], les['id'] + ' ملصق')
    for it in les['items']: chk_art(it['art'], les['id'])
    for g in les['games']:
        if len(g['say'].split()) > 6: bad.append(les['id'] + ': تعليمة طويلة ' + g['say'])
        d = g['data']; t = g['template']
        if t in ('choose',):
            if not 3 <= len(d['rounds']) <= 5: bad.append(f'{les["id"]}: {t} جولات {len(d["rounds"])}')
            for r in d['rounds']:
                if not 2 <= len(r['options']) <= 4: bad.append(les['id'] + ': خيارات')
                for o in r['options']: chk_art(o.get('art'), les['id'])
                if not 0 <= r['answer'] < len(r['options']): bad.append(les['id'] + ': جواب خارج الخيارات')
        if t == 'match':
            if not 3 <= len(d['pairs']) <= 5: bad.append(f'{les["id"]}: match أزواج {len(d["pairs"])}')
            for v in d['pairs']:
                if not ART.get(v): bad.append(les['id'] + ': مطابقة بلا رسم ' + v)
        if t == 'memory':
            for p in d['pairs']: chk_art(p['art'], les['id'])
        if t == 'sort':
            for it in d['items']: chk_art(it['art'], les['id'])
            n = len(d['bins'])
            if sorted({it['bin'] for it in d['items']}) != list(range(n)): bad.append(les['id'] + ': سلة فارغة')
        if t == 'order':
            for r in d['rounds']:
                for it in r['items']: chk_art(it['art'], les['id'])
        if t == 'spot':
            if d.get('art'): chk_art(d['art'], les['id'])
            for it in (d.get('scene') or {}).get('items', []): chk_art(it['art'], les['id'])
            if not 3 <= len(d['rounds']) <= 6: bad.append(les['id'] + ': spot جولات')
        if t == 'puzzle':
            for it in d['scene']['items']: chk_art(it['art'], les['id'])
        if t == 'water':
            for it in d['items']: chk_art(ART.get(it['value']), les['id'])
        if t == 'mix':
            for v in d['items'] + [d['bowl']]: chk_art(ART.get(v), les['id'])
# لا ألعاب عدّ في هذا الكتاب؛ أي لعبة عدّ تُضاف لاحقاً يجب أن تطابق صورها الهدف
for les in LESSONS:
    for g in les['games']:
        if 'count' in g['data'] and len(g['data'].get('objects', [])) != g['data']['count']: bad.append(les['id'] + ': عدد الصور لا يطابق الهدف')
for t in sorted(texts):
    m = vowelled(t)
    if m: bad.append('غير مشكول كاملاً: ' + t + ' ← ' + ' '.join(m))
# مصدر كل نص يعرض للطفل: من الكتاب، أو تعليمة واجهة قصيرة
UI = set(SAY.values()) | {g['say'] for les in LESSONS for g in les['games']} | {x for v in COMMON.values() for x in (v if isinstance(v, list) else [v])} | {BOOK['title']}
for t in texts:
    if t not in TERMS and t not in UI: bad.append('نص لا مصدر له: ' + t)
for v, t in TERMS.items():
    if base(v) != base(t['book']) and v in texts:
        report['vowelled'].append({'page': t['page'], 'book': t['book'], 'shown': v})
    elif v in texts and v != t['book']:
        report['vowelled'].append({'page': t['page'], 'book': t['book'], 'shown': v})
# ---------- مقارنة الحركات المطبوعة بالمعروض ----------
# كل حركة في المطبوع يجب أن تبقى في التطبيق. الاستثناء الوحيد المسموح:
# (1) حركة الحرف الأخير لكلمة اقتُطعت من جملتها فعُرضت وحدها بصيغة الرفع (citation_forms، تُسجَّل آلياً)؛
# (2) خطأ طباعي صحّحه التطبيق (PRINT_TYPOS، يُسجَّل يدوياً هنا بعد النظر في الصفحة).
PRINT_TYPOS = [
    {'page': 13, 'printed': 'أَيَ النَباتينِ … وأَيها الأَقصرُ؟', 'shown': 'أَيُّ النَّبَاتَيْنِ … وَأَيُّهُمَا الْأَقْصَرُ؟', 'why': 'فتحة على «أيّ» مكان الضمة، وسقطت الميم من «أيّهما» (السؤال عن نباتين)'},
    {'page': 47, 'printed': 'الأنباتِ', 'shown': 'الْإِنْبَاتِ', 'why': 'همزة القطع تحت الألف في المصدر «إنبات»'},
    {'page': 43, 'printed': 'أَرنبُ حديثُ الولادةِ / أَرنبُ بَعد…', 'shown': 'أَرْنَبٌ', 'why': 'نكرة غير مضافة فحقها التنوين'},
    {'page': 137, 'printed': 'مِفتاحٌ معدَني', 'shown': 'مِفْتَاحٌ مَعْدِنِيٌّ', 'why': 'النسبة إلى «مَعْدِن» بكسر الدال، والصفة تتبع الموصوف في التنوين'},
    {'page': 157, 'printed': 'يُعطي ضَوءً', 'shown': 'يُعْطِي ضَوْءًا', 'why': 'تنوين النصب في «ضوء» تُزاد بعده ألف'},
    {'page': 45, 'printed': 'يتكاثُر', 'shown': 'يَتَكَاثَرُ', 'why': 'الضمة وُضعت على الثاء، وموضعها الراء (يَتَكَاثَرُ)'},
    {'page': 95, 'printed': 'المحُيطاتُ', 'shown': 'الْمُحِيطَاتُ', 'why': 'الضمة وُضعت على الحاء، وموضعها الميم'},
    {'page': 98, 'printed': 'بيئةٌ مشّيدةٌ', 'shown': 'بِيئَةٌ مُشَيَّدَةٌ', 'why': 'الشدة وُضعت على الشين، وموضعها الياء'},
    {'page': 108, 'printed': 'السُلحفاةُ البحرّيةُ', 'shown': 'السُّلَحْفَاةُ الْبَحْرِيَّةُ', 'why': 'الشدة وُضعت على الراء، وموضعها ياء النسبة'},
    {'page': 166, 'printed': 'تتحركُ السيارَةُ بشكلِ مُتعرج', 'shown': 'بِشَكْلٍ مُتَعَرِّجٍ', 'why': 'نكرة موصوفة فحقها التنوين (بِشَكْلٍ)، كما في «بشكلٍ دائري» في الصفحة نفسها'},
    {'page': 42, 'printed': 'يذهبُ الى المدرسةِ', 'shown': 'يَذْهَبُ إِلَى الْمَدْرَسَةِ', 'why': 'همزة القطع في «إلى»'},
]
TYPO_WORDS = {(13, 'أي'), (13, 'وأيها'), (43, 'أرنب'), (137, 'معدني'), (45, 'يتكاثر'), (95, 'المحيطات'), (98, 'مشيدة'), (108, 'البحرية'), (166, 'بشكل')}
def _norm(ch): return {'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ى': 'ي', 'ة': 'ه', 'ئ': 'ء', 'ؤ': 'ء'}.get(ch, ch)
def _parse(w):
    w = w.replace('ـ', '')
    out = []
    for ch in w:
        if HAR.match(ch):
            if out: out[-1][1].add(ch)
        elif LETTERS.match(ch): out.append([ch, set()])
    if len(out) >= 2 and out[-1][0] == 'ا' and ('ً' in out[-1][1] or 'ً' in out[-2][1]):
        out[-2][1].add('ً'); out.pop()
    return out
def _letters(P_): return ''.join(_norm(c) for c, _ in P_)
TYPOS = {(p_, ''.join(_norm(c) for c in w_)) for p_, w_ in TYPO_WORDS}
PREF = ['', 'ب', 'ل', 'ك', 'و', 'ف', 'ال', 'وال', 'بال', 'كال', 'لل', 'فال']
cites, conflicts = [], []
for v, t in TERMS.items():
    if v not in texts or 'book' not in t: continue
    raws = [w for w in re.split(r'[\s،,؟?!.:()]+', t['book']) if w.strip()]; bws = [_parse(w) for w in raws]
    start = 0
    for vw in re.split(r'\s+', v):
        V = _parse(vw); lv = _letters(V)
        if not V: continue
        hit = None
        for j in range(start, len(bws)):
            B = bws[j]; lb = _letters(B)
            for pre in PREF:
                if lb == _letters(_parse(pre)) + lv if pre else lb == lv:
                    hit = B[len(B) - len(V):]; raw = raws[j]; start = j + 1; break
            if hit: break
        if not hit: continue
        typo = (t['page'], _letters(hit)) in TYPOS
        bword = raw
        for i, ((cb, mb), (cv, mv)) in enumerate(zip(hit, V)):
            miss = mb - mv
            if not miss: continue
            if typo: break
            if i == len(V) - 1:
                cites.append({'page': t['page'], 'printed': t['book'], 'shown': v, 'word_printed': bword, 'word_shown': vw}); break
            conflicts.append(f'ص {t["page"]}: «{bword}» مطبوع، و«{vw}» معروض ({v})'); break
seen_c = set()
report['citation_forms'] = [c for c in cites if not ((c['page'], c['word_shown']) in seen_c or seen_c.add((c['page'], c['word_shown'])))]
report['print_typos'] = PRINT_TYPOS
for c in conflicts: bad.append('حركة مطبوعة تغيّرت: ' + c)
report['deviations'].append('لا تتوفر في جلسة المنفّذ أداة لتشغيل وكلاء فرعيين متوازيين؛ فقام المنفّذ نفسه بالنقل ثم بمراجعة ثانية مستقلة على صور مكبرة بدقة ٣٠٠ نقطة.')
print('lessons', len(LESSONS), 'games', sum(len(l['games']) for l in LESSONS), 'clips', len(rows))
[print('!', b) for b in bad]
js = '// مولَّد آلياً من tools/build_science.py — لا تعدّله يدوياً\n'
js += 'export const BOOK = ' + json.dumps(BOOK, ensure_ascii=False) + ';\nexport const COMMON = ' + json.dumps(COMMON, ensure_ascii=False) + ';\n'
js += 'export const AUDIO = ' + json.dumps(audio, ensure_ascii=False) + ';\nexport const LESSONS = ' + json.dumps(LESSONS, ensure_ascii=False) + ';\n'
open(os.path.join(OUT, 'lessons.js'), 'w', encoding='utf-8').write(js)
json.dump({'book': BOOK, 'lessons': LESSONS}, open(os.path.join(OUT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'audio-list.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['اسم الملف', 'النص المشكول', 'الدرس', 'الصفحة']); w.writerows(rows)
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
sys.exit(1 if bad else 0)
