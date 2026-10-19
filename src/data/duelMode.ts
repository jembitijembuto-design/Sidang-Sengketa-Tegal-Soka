import type { PersonSet, Question } from '../lib/debate';

/**
 * Fokus substansi hukum tetap untuk setiap peserta.
 * Pertanyaan dibuat dengan kerangka/konteks mirip (sebagai pengecoh),
 * tetapi poros isu hukum digeser sesuai fokus peserta.
 */
const PERSONS = ['Edi', 'Ridwan', 'Susanto', 'Suprapti', 'Eka', 'Jumiati'] as const;

type Person = (typeof PERSONS)[number];
type Role = 'duit semilyar' | 'urip kepenak' | 'Kamulyan jagad';

/** Fokus hukum unik tiap peserta – dipakai sebagai acuan penulisan */
const PERSON_FOCUS: Record<Person, string> = {
  Edi: 'iktikad baik & perlindungan penguasa beritikad baik',
  Ridwan: 'beban pembuktian & kekuatan alat bukti',
  Susanto: 'penguasaan nyata / okupasi fisik sebagai fakta hukum',
  Suprapti: 'cacat formil vs cacat materiil & hierarki norma',
  Eka: 'perlindungan pihak ketiga yang beritikad baik',
  Jumiati: 'sistem pendaftaran tanah & kekuatan register negara',
};

interface ClusterDef {
  id: number;
  role: Role;
  /** Dua varian pertanyaan per peserta – kerangka mirip, fokus substansi berbeda */
  questions: Record<Person, [string, string]>;
}

const clusters: ClusterDef[] = [
  // ── DUIT SEMILYAR (1–10) ──────────────────────────────────
  {
    id: 1,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai iktikad baik pihak yang telah menguasai objek tersebut tanpa menunggu naskah resmi?[...]',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang perlindungan terhadap pihak yang menguasai dengan iktikad baik meski naskah baru [...]',
      ],
      Ridwan: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim membebankan pembuktian atas validitas instrumen tersebut kepada pihak yang mengajukannya?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai kekuatan pembuktian instrumen yang lahir belakangan dibanding fakta penguasaan lama[...]',
      ],
      Susanto: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai fakta penguasaan fisik yang telah berlangsung lama sebagai fakta hukum yang mandiri[...]',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang okupasi nyata yang telah lama terjadi di hadapan naskah yang baru terbit?',
      ],
      Suprapti: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim membedakan cacat formil penerbitan instrumen dengan cacat materiil yang menyentuh substansi[...]',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai apakah keterlambatan penerbitan merupakan cacat formil semata atau cacat yang memen[...]',
      ],
      Eka: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim melindungi pihak ketiga yang telah bertransaksi dengan mengandalkan penguasaan nyata yang t[...]',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang kepentingan pihak ketiga yang beritikad baik terhadap objek yang sudah lama dikua[...]',
      ],
      Jumiati: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai kekuatan sistem pendaftaran tanah negara terhadap naskah yang lahir belakangan?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang data register negara yang sudah ada dibanding instrumen yang baru muncul di luar [...]',
      ],
    },
  },
  // ... (clusters continued unchanged) ...
];

function generateDuelSets(): PersonSet[] {
  const personQs: Record<string, [Question[], Question[]]> = {};
  for (const p of PERSONS) personQs[p] = [[], []];

  // --- iterate clusters in REVERSE so questions from the last clusters become first ---
  for (let i = clusters.length - 1; i >= 0; i--) {
    const c = clusters[i];
    for (const person of PERSONS) {
      const [t0, t1] = c.questions[person];
      // setIndex will later be 0 for first array and 1 for second array — make correctAnswer explicit
      personQs[person][0].push({ id: c.id, role: c.role, text: t0, correctAnswer: 1 } as Question & { correctAnswer?: number });
      personQs[person][1].push({ id: c.id, role: c.role, text: t1, correctAnswer: 2 } as Question & { correctAnswer?: number });
    }
  }

  return PERSONS.map((p) => ({
    person: p,
    sets: personQs[p],
  }));
}

export const duelSets: PersonSet[] = generateDuelSets();

export function getClusterQuestions(
  clusterId: number,
  persons?: string[]
): (Question & { person: string; setIndex: number })[] {
  const out: (Question & { person: string; setIndex: number })[] = [];
  const c = clusters.find((x) => x.id === clusterId);
  if (!c) return out;
  for (const person of PERSONS) {
    if (persons && !persons.includes(person)) continue;
    const [t0, t1] = c.questions[person];
    out.push({ id: c.id, role: c.role, text: t0, person, setIndex: 0 });
    out.push({ id: c.id, role: c.role, text: t1, person, setIndex: 1 });
  }
  return out;
}

/**
 * Mengambil seluruh pertanyaan milik satu peserta (semua cluster).
 * Urutan pertanyaan mengikuti urutan cluster yang dibalik (cluster terakhir → cluster pertama),
 * sehingga pertanyaan akhir di bank menjadi pertanyaan awal di hasil ini — tanpa mengubah teks pertanyaan.
 */
export function getQuestionsForPerson(person: string): (Question & { person: string; setIndex: number })[] {
  if (!PERSONS.includes(person as Person)) return [];
  const out: (Question & { person: string; setIndex: number })[] = [];
  for (let i = clusters.length - 1; i >= 0; i--) {
    const c = clusters[i];
    const [t0, t1] = c.questions[person as Person];
    out.push({ id: c.id, role: c.role, text: t0, person, setIndex: 0 });
    out.push({ id: c.id, role: c.role, text: t1, person, setIndex: 1 });
  }
  return out;
}

export { clusters, PERSONS, PERSON_FOCUS };
