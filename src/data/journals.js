import seed from './journals.seed.json';
import { CRITERIA, statusFromScore, cellStatus } from './criteria';

// Deterministik pseudo-random (seed asosida), demo har safar bir xil bo'lishi uchun
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Jurnal "profili" - qanaqa jurnal ekanini belgilaydigan bias
function profileBias(rand) {
  const r = rand();
  if (r < 0.42) return { base: 0.82, spread: 0.18 }; // yaxshi jurnal
  if (r < 0.75) return { base: 0.55, spread: 0.22 }; // o'rtacha
  return { base: 0.28, spread: 0.24 }; // faol emas
}

const STUDY_FIELDS = [
  "Filologiya", "Ijtimoiy fanlar", "Kompyuter fanlari", "Muhandislik",
  "Iqtisodiyot", "Pedagogika", "Tibbiyot", "Qishloq xo'jaligi",
  "San'at va gumanitar", "Fizika va astronomiya", "Kimyo", "Biologiya",
];

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function buildTrend(rand, level) {
  // 12 nuqtali sparkline - faollik trendi
  const pts = [];
  let v = 30 + level * 50;
  for (let i = 0; i < 12; i++) {
    v += (rand() - 0.45) * 22 * (0.5 + level);
    v = Math.max(4, Math.min(100, v));
    pts.push(Math.round(v));
  }
  return pts;
}

function daysAgoLabel(d) {
  if (d === 0) return 'Bugun';
  if (d === 1) return 'Kecha';
  if (d < 30) return `${d} kun oldin`;
  const m = Math.floor(d / 30);
  return `${m} oy oldin`;
}

export function buildJournals() {
  return seed.map((j, idx) => {
    const rand = mulberry32(j.id * 7919 + 13);
    const { base, spread } = profileBias(rand);

    const scores = {};
    CRITERIA.forEach((c) => {
      // profil asosida + kriteriyaga xos tebranish
      let ratio = base + (rand() - 0.5) * spread * 2;
      ratio = Math.max(0, Math.min(1, ratio));
      // ba'zi kriteriyalar keskinroq (0 yoki to'liq): DOI, sayt
      if ((c.id === 'doi' || c.id === 'website') && rand() < 0.35) {
        ratio = rand() < 0.5 ? 0 : 1;
      }
      scores[c.id] = Math.round(ratio * c.max);
    });

    const total = CRITERIA.reduce((s, c) => s + scores[c.id], 0);
    const status = statusFromScore(total);

    // Guruh bo'yicha jamlangan ball
    const groupScore = { data: 0, tools: 0, activity: 0 };
    const groupMax = { data: 0, tools: 0, activity: 0 };
    CRITERIA.forEach((c) => {
      groupScore[c.group] += scores[c.id];
      groupMax[c.group] += c.max;
    });
    const groupStatus = {};
    Object.keys(groupScore).forEach((g) => {
      groupStatus[g] = cellStatus(groupScore[g], groupMax[g]);
    });

    const level = total / 100;
    const lastUpdateDays = Math.floor((1 - level) * 90 * rand());

    return {
      id: j.id,
      name: j.name,
      issn: j.issn,
      studyField: pick(rand, STUDY_FIELDS),
      scores,
      total,
      status: status.id,
      groupScore,
      groupMax,
      groupStatus,
      metrics: {
        articles: Math.round(20 + level * 480 + rand() * 60),
        editions: Math.round(2 + level * 40 + rand() * 6),
        pendingApplications: Math.round((1 - level) * 3 + rand() * 8),
        avgReviewDays: Math.round(6 + (1 - level) * 30 + rand() * 6),
        hasDoi: scores.doi > 0,
        hasWebsite: scores.website > 0,
        metaPercent: Math.round((scores.meta / 10) * 100),
      },
      trend: buildTrend(rand, level),
      lastUpdateDays,
      lastUpdateLabel: daysAgoLabel(lastUpdateDays),
    };
  });
}

export const JOURNALS = buildJournals();

export function summarize(list) {
  const out = { green: 0, yellow: 0, red: 0, total: list.length };
  list.forEach((j) => { out[j.status] += 1; });
  return out;
}
