import type { PersonSet } from '../lib/debate';

// Frasa bersama antar peserta (biar terasa mirip):
// kepentingan, tanda bukti, berkas resmi, sistem hukum, majelis,
// sudah terbentuk, akibat hukum, birokrasi, alat bukti, keabsahan

const rawPendalamanSets: PersonSet[] = [
  {
    person: 'Jumiati',
    sets: [
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Klaim adat yang tidak tercatat otomatis bertentangan dengan hukum positif yang berlaku, sehingga tidak dapat dijadikan dasar kepemilikan.' },
        { id: 8, role: 'Kamulyan jagad', text: 'Pencatatan adalah syarat mutlak pengakuan hak, sehingga klaim tanpa pencatatan tidak sah dan tidak memiliki legitimasi hukum.' },
        { id: 7, role: 'Kamulyan jagad', text: 'Klaim kepemilikan yang tidak tercatat dalam register resmi hanyalah asumsi belaka, yang tidak memiliki kekuatan mengikat dan tidak dapat dipertahankan di muka majelis.' },
        { id: 6, role: 'urip kepenak', text: 'Penguasaan fisik atas tanah tanpa pengakuan negara tidak lebih dari tindakan menguasai tanpa legitimasi, yang tidak memiliki nilai hukum dan tidak dapat dipertahankan.' },
        { id: 5, role: 'urip kepenak', text: 'Klaim adat yang berdiri tanpa dukungan pencatatan negara kehilangan kekuatan hukum, karena pengakuan adat hanya berlaku bila tidak bertentangan dengan kepentingan publik.' },
        { id: 4, role: 'urip kepenak', text: 'Seseorang yang tidak pernah tercatat dalam register resmi tidak dapat menyebut diri sebagai pemilik sah, karena pencatatan adalah syarat pengakuan yang diatur oleh sistem hukum.' },
        { id: 3, role: 'duit semilyar', text: 'Tanah yang tidak tercatat dalam daftar resmi otomatis kembali ke penguasaan negara, sehingga klaim individu yang diajukan tanpa pencatatan kehilangan legitimasi administratif.' },
        { id: 2, role: 'duit semilyar', text: 'Arsip tanah kosong dari nama pemilik menjadikan klaim kepemilikan tidak lebih dari dugaan subjektif, yang tidak memiliki kekuatan pembuktian dan tidak dapat diandalkan di muka majelis.' },
        { id: 1, role: 'duit semilyar', text: 'Catatan resmi negara tidak pernah mencantumkan bidang tanah ini, sehingga klaim pribadi yang diajukan berdiri di atas penguasaan fisik semata, tanpa legitimasi formal.' },
      ],
      [
        // ... (other sets) ...
      ],
    ],
  },
  // ... (other person sets unchanged) ...
];

export const pendalamanSets: PersonSet[] = rawPendalamanSets.map((ps) => ({
  person: ps.person,
  sets: ps.sets.map((set, setIndex) => set.map((q: any) => ({ ...q, correctAnswer: setIndex + 1 })))
}));
