// Kriteriyalar ta'rifi va vaznlari (100 ball)
// Uchta katta kategoriyaga bo'lingan

export const GROUPS = [
  {
    id: 'data',
    title: "Ma'lumotlar to'ldirilishi",
    short: "Ma'lumotlar",
    icon: '🗂️',
    hint: 'Maqolalar, nashrlar va jurnal meta ma\'lumotlari to\'liqligi',
  },
  {
    id: 'tools',
    title: 'Vositalardan foydalanish',
    short: 'Vositalar',
    icon: '🛡️',
    hint: 'Plagiat, AI-detektor, Savodxon, taqriz, DOI va sayt xizmatlari',
  },
  {
    id: 'activity',
    title: 'Faollik va hajm',
    short: 'Faollik',
    icon: '📈',
    hint: 'Maqolalar/nashrlar soni, arizalar oqimi va adminlar faolligi',
  },
];

// Har bir kriteriya: guruh, nom, izoh, maksimal ball
export const CRITERIA = [
  // --- Ma'lumotlar to'ldirilishi ---
  {
    id: 'oldArchive',
    group: 'data',
    name: 'Eski nashrlar arxivi kiritilgan',
    desc: "Jurnalning eski sonlari va oxirgi sonlari bazaga kiritilganmi",
    max: 12,
  },
  {
    id: 'meta',
    group: 'data',
    name: "Jurnal meta ma'lumotlari",
    desc: 'ISSN, tavsif, yo\'nalishlar, muqova va boshqa maydonlar to\'ldirilgan foizi',
    max: 10,
  },
  {
    id: 'staff',
    group: 'data',
    name: "Mas'ullar to'liq to'ldirilgan",
    desc: 'Bosh muharrir, tahririyat a\'zolari, mas\'ul kotib ma\'lumotlari',
    max: 8,
  },
  // --- Vositalardan foydalanish ---
  {
    id: 'antiplag',
    group: 'tools',
    name: 'Antiplagiat & AI-detektor',
    desc: 'Maqolalar plagiat va sun\'iy intellekt detektoridan o\'tkazilyaptimi',
    max: 12,
  },
  {
    id: 'review',
    group: 'tools',
    name: 'Taqriz (e-Taqriz) jarayoni',
    desc: 'Maqolalar taqrizdan o\'tkaziladimi va muddatida bajariladimi',
    max: 12,
  },
  {
    id: 'doi',
    group: 'tools',
    name: 'DOI/ROI paketi',
    desc: 'DOI paketi sotib olingan va faol ishlatilyaptimi',
    max: 8,
  },
  {
    id: 'website',
    group: 'tools',
    name: 'Jurnal web-sayti (slib)',
    desc: 'Sayt paketi olingan va faol foydalanilyaptimi',
    max: 6,
  },
  // --- Faollik va hajm ---
  {
    id: 'applications',
    group: 'activity',
    name: 'Arizalar oqimi',
    desc: 'Jurnalga yangi maqola arizalari kelib tushyaptimi',
    max: 10,
  },
  {
    id: 'timeliness',
    group: 'activity',
    name: "Ko'rib chiqish muddati",
    desc: 'Arizalarni tekshirish o\'z muddatida bajarilyaptimi',
    max: 8,
  },
  {
    id: 'volume',
    group: 'activity',
    name: 'Maqola/nashr hajmi',
    desc: 'So\'nggi davrda chop etilgan maqolalar va sonlar hajmi',
    max: 8,
  },
  {
    id: 'adminActivity',
    group: 'activity',
    name: 'Adminlar faolligi',
    desc: 'Jurnal adminlarining tizimga kirishi va amallar bajarishi',
    max: 6,
  },
];

export const MAX_TOTAL = CRITERIA.reduce((s, c) => s + c.max, 0); // = 100

// Status chegaralari
export const STATUS = {
  green: { id: 'green', label: 'Yaxshi', sub: 'Faol jurnallar', min: 75, color: '#16a34a', soft: '#dcfce7', ring: '#22c55e' },
  yellow: { id: 'yellow', label: "O'rtacha", sub: "O'rtacha faol", min: 45, color: '#d97706', soft: '#fef3c7', ring: '#f59e0b' },
  red: { id: 'red', label: 'Faol emas', sub: 'Faol emas jurnallar', min: 0, color: '#dc2626', soft: '#fee2e2', ring: '#ef4444' },
};

export function statusFromScore(score) {
  if (score >= STATUS.green.min) return STATUS.green;
  if (score >= STATUS.yellow.min) return STATUS.yellow;
  return STATUS.red;
}

// Bitta kriteriya ballidan yashil/sariq/qizil holat
export function cellStatus(value, max) {
  const p = value / max;
  if (p >= 0.7) return 'green';
  if (p >= 0.4) return 'yellow';
  return 'red';
}
