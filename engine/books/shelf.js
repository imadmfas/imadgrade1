// الكتب الستة على الرف. ready: يصبح true حين يكتمل الكتاب ويُبنى مجلده.
export const LIBRARY = { title: 'مَكْتَبَتِي الْمُلَوَّنَةُ', grade: 'الصَّفُّ الْأَوَّلُ الِابْتِدَائِيُّ', edition: 'الْمَنْهَجُ الْعِرَاقِيُّ — طَبْعَةُ 2026' };
export const BOOKS = [
  { id: 'reading', title: 'قِرَاءَتِي الْجَدِيدَةُ', color: '#e5484d', color2: '#3aa0e0', icon: 'ب', audio: 'shelf-reading.mp3', ready: true },
  { id: 'math', title: 'الرِّيَاضِيَّاتُ', color: '#f59f00', color2: '#d6336c', icon: '١٢٣', audio: 'shelf-math.mp3', ready: true },
  { id: 'science', title: 'الْعُلُومُ', color: '#2f9e44', color2: '#f5c518', icon: 'leaf', audio: 'shelf-science.mp3', ready: true },
  { id: 'islamic', title: 'التَّرْبِيَةُ الْإِسْلَامِيَّةُ', color: '#c2255c', color2: '#2f9e44', icon: 'dome', audio: 'shelf-islamic.mp3', ready: true },
  { id: 'english', title: 'اللُّغَةُ الْإِنْكِلِيزِيَّةُ', color: '#1c7ed6', color2: '#fab005', icon: 'ABC', audio: 'shelf-english.mp3', ready: true },
  { id: 'ethics', title: 'التَّرْبِيَةُ الْأَخْلَاقِيَّةُ', color: '#37b24d', color2: '#f06595', icon: 'heart', audio: 'shelf-ethics.mp3', ready: true },
];
export const SHELF_SAY = { soon: 'قَرِيبًا', hello: 'اِخْتَرْ كِتَابًا وَالْمِسْهُ' };
