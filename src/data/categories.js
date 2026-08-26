import { JOURNALS } from './journals';

// SLIB TZ (§10) asosidagi statistika kategoriyalari.
// Har biri jurnallarni yashil/sariq/qizil ga ajratadi.

// Har bir jurnal uchun kategoriya ballarini deterministik hisoblaymiz
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tri(pct) {
  // foizdan holat
  if (pct >= 70) return 'green';
  if (pct >= 40) return 'yellow';
  return 'red';
}

// Har bir jurnal uchun 4 kategoriya bo'yicha ko'rsatkichlarni tayyorlaymiz
export const JOURNAL_CATEGORY = JOURNALS.map((j) => {
  const rand = mulberry32(j.id * 104729 + 7);
  const level = j.total / 100;

  // 1) Profil to'ldirilganligi (§6, 21 belgi)
  const profilePct = Math.max(5, Math.min(100, Math.round(j.metrics.metaPercent * 0.5 + level * 55 + (rand() - 0.5) * 20)));

  // 2) Ish jarayoni / arizalar (§10.5): qabul foizi
  const totalApps = Math.round(20 + level * 120 + rand() * 40);
  const accepted = Math.round(totalApps * (0.35 + level * 0.5 + (rand() - 0.5) * 0.15));
  const pending = Math.round(totalApps * (0.1 + (1 - level) * 0.25 + rand() * 0.1));
  const overdue = Math.round(totalApps * ((1 - level) * 0.25 + rand() * 0.1));
  const rejected = Math.max(0, totalApps - accepted - pending - overdue);
  const workflowPct = Math.round(((accepted) / totalApps) * 100 - (overdue / totalApps) * 40);

  // 3) Xizmatlardan foydalanish (§10.7): antiplag/AI/savodxon/DOI/sayt
  const services = {
    antiplag: rand() < 0.25 + level * 0.6,
    ai: rand() < 0.2 + level * 0.6,
    savodxon: rand() < 0.3 + level * 0.5,
    doi: j.metrics.hasDoi,
    website: j.metrics.hasWebsite,
    review: rand() < 0.4 + level * 0.5,
  };
  const svcOn = Object.values(services).filter(Boolean).length;
  const servicePct = Math.round((svcOn / 6) * 100);

  // 4) Faollik va hajm (§10.2): so'nggi faollik + hajm
  const activityPct = Math.max(5, Math.min(100, Math.round(
    (j.lastUpdateDays < 30 ? 55 : j.lastUpdateDays < 60 ? 35 : 15) +
    Math.min(35, j.metrics.articles / 15) + (rand() - 0.5) * 10
  )));

  return {
    id: j.id,
    name: j.name,
    issn: j.issn,
    studyField: j.studyField,
    total: j.total,
    trend: j.trend,
    lastUpdateLabel: j.lastUpdateLabel,
    lastUpdateDays: j.lastUpdateDays,
    cats: {
      profile: {
        pct: profilePct, status: tri(profilePct),
        detail: { filled: Math.round((profilePct / 100) * 21), of: 21 },
      },
      workflow: {
        pct: Math.max(5, Math.min(100, workflowPct)), status: tri(Math.max(5, Math.min(100, workflowPct))),
        detail: { accepted, pending, rejected, overdue, total: totalApps },
      },
      services: {
        pct: servicePct, status: tri(servicePct),
        detail: services, on: svcOn, of: 6,
      },
      activity: {
        pct: activityPct, status: tri(activityPct),
        detail: { articles: j.metrics.articles, editions: j.metrics.editions, last: j.lastUpdateLabel },
      },
    },
  };
});

// Kategoriyalar ta'rifi
export const CATEGORIES = [
  {
    id: 'profile',
    title: "Profil to'ldirilganligi",
    short: 'Profil',
    icon: 'clipboard',
    grad: 'linear-gradient(135deg,#0ea5e9,#2563eb)',
    hint: '21 ta belgi bo\'yicha jurnal profilining to\'liqligi (§6)',
    metric: (c) => `${c.detail.filled}/${c.detail.of} belgi`,
  },
  {
    id: 'workflow',
    title: 'Ish jarayoni (arizalar)',
    short: 'Jarayon',
    icon: 'inbox',
    grad: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    hint: 'Arizalar qabul qilinishi, kutilayotgan va muddati o\'tganlar (§10.5)',
    metric: (c) => `${c.detail.accepted}/${c.detail.total} qabul`,
  },
  {
    id: 'services',
    title: 'Xizmatlardan foydalanish',
    short: 'Xizmatlar',
    icon: 'shield',
    grad: 'linear-gradient(135deg,#f59e0b,#ea580c)',
    hint: 'Antiplagiat, AI, Savodxon, DOI, sayt, taqriz (§10.7)',
    metric: (c) => `${c.on}/${c.of} xizmat`,
  },
  {
    id: 'activity',
    title: 'Faollik va hajm',
    short: 'Faollik',
    icon: 'activity',
    grad: 'linear-gradient(135deg,#16a34a,#15803d)',
    hint: 'So\'nggi faollik, maqola va nashrlar hajmi (§10.2)',
    metric: (c) => `${c.detail.articles} maqola`,
  },
];

// Kategoriya bo'yicha yashil/sariq/qizil taqsimot
export function categoryBreakdown(catId) {
  const out = { green: 0, yellow: 0, red: 0, total: JOURNAL_CATEGORY.length };
  JOURNAL_CATEGORY.forEach((j) => { out[j.cats[catId].status] += 1; });
  return out;
}

export function journalsByCategoryStatus(catId, status) {
  let list = JOURNAL_CATEGORY.filter((j) => status === 'all' || j.cats[catId].status === status);
  return [...list].sort((a, b) => b.cats[catId].pct - a.cats[catId].pct);
}
