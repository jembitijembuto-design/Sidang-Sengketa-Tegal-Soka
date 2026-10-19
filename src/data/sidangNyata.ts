import type { PersonSet } from '../lib/debate';

// Sidang Nyata: pertanyaan lebih formal dan sulit, bernuansa persidangan sesungguhnya
const rawAllPersonSets: PersonSet[] = [
  {
    person: 'Edi',
    sets: [
      [
        { id: 1, role: 'duit semilyar', text: 'Dalam perkara sengketa kepemilikan tanah, apa yang menjadi tolok ukur utama Majelis Hakim dalam menentukan siapa yang memiliki hak terkuat?' },
        { id: 2, role: 'duit semilyar', text: 'Apakah kelalaian mendaftarkan tanah selama puluhan tahun secara hukum menghapuskan hak kepemilikan yang telah terbentuk berdasarkan perbuatan hukum?' },
        { id: 3, role: 'duit semilyar', text: 'Bagaimana Majelis membedakan cacat formil administrasi pertanahan dengan cacat materiil yang menyentuh substansi hak?' },
        { id: 4, role: 'urip kepenak', text: 'Sebutkan dasar hukum yang secara eksplisit menyatakan kelalaian administrasi menghapuskan hak kepemilikan tanah!' },
        { id: 5, role: 'urip kepenak', text: 'Jika kedua pihak mengajukan bukti kepemilikan yang saling bertentangan, kriteria apa yang digunakan Majelis untuk menilai mana yang lebih kuat?' },
        { id: 6, role: 'urip kepenak', text: 'Apakah pendaftaran tanah bersifat konstitutif yang menciptakan hak, atau deklaratif yang hanya menyatakan hak yang sudah ada?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Apakah penerbitan sertifikat oleh BPN menciptakan hak baru, atau sekadar mengukuhkan hak yang telah lahir sebelumnya?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Landasan hukum apa yang menjadi acuan Majelis saat menilai klaim kepemilikan yang muncul pada momen berbeda?' },
        { id: 9, role: 'Kamulyan jagad', text: 'Sejauh mana urutan waktu terbentuknya hak memengaruhi kedudukannya dalam pembuktian di persidangan?' },
      ],
      [
        { id: 1, role: 'duit semilyar', text: 'Apabila penggugat dan tergugat sama-sama mengajukan klaim atas tanah yang sama, aspek hukum mana yang wajib diperiksa terlebih dahulu oleh Majelis?' },
        { id: 2, role: 'duit semilyar', text: 'Faktor substansial apa yang membedakan kekuatan alat bukti antara klaim yang terbentuk pada masa berbeda?' },
        { id: 3, role: 'duit semilyar', text: 'Dapatkah tertundanya pendaftaran tanah dijadikan alasan untuk menyatakan hak kepemilikan tidak pernah lahir?' },
      ],
    ],
  },
  // ... (other person sets unchanged) ...
];

export const allPersonSets: PersonSet[] = rawAllPersonSets.map((ps) => ({
  person: ps.person,
  sets: ps.sets.map((set, setIndex) => set.map((q: any) => ({ ...q, correctAnswer: setIndex + 1 })))
}));
