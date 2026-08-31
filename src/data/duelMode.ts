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
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai iktikad baik pihak yang telah menguasai objek tersebut tanpa menunggu naskah resmi?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang perlindungan terhadap pihak yang menguasai dengan iktikad baik meski naskah baru muncul belakangan?',
      ],
      Ridwan: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim membebankan pembuktian atas validitas instrumen tersebut kepada pihak yang mengajukannya?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai kekuatan pembuktian instrumen yang lahir belakangan dibanding fakta penguasaan lama?',
      ],
      Susanto: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai fakta penguasaan fisik yang telah berlangsung lama sebagai fakta hukum yang mandiri?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang okupasi nyata yang telah lama terjadi di hadapan naskah yang baru terbit?',
      ],
      Suprapti: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim membedakan cacat formil penerbitan instrumen dengan cacat materiil yang menyentuh substansi kepemilikan?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai apakah keterlambatan penerbitan merupakan cacat formil semata atau cacat yang memengaruhi keabsahan materiil?',
      ],
      Eka: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim melindungi pihak ketiga yang telah bertransaksi dengan mengandalkan penguasaan nyata yang terlihat?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang kepentingan pihak ketiga yang beritikad baik terhadap objek yang sudah lama dikuasai secara terbuka?',
      ],
      Jumiati: [
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menilai kekuatan sistem pendaftaran tanah negara terhadap naskah yang lahir belakangan?',
        'Apabila instrumen tertulis terbit jauh setelah objek dikuasai pihak lain, bagaimana panel hakim menimbang data register negara yang sudah ada dibanding instrumen yang baru muncul di luar sistem pendaftaran?',
      ],
    },
  },
  {
    id: 2,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Apakah penguasaan lahan selama beberapa dekade dengan iktikad baik tanpa naskah resmi dapat menjadi dasar perlindungan hukum bagi pihak yang menguasainya?',
        'Apakah penguasaan lahan selama beberapa dekade dengan iktikad baik tanpa naskah resmi dapat dijadikan landasan bagi panel hakim untuk melindungi kedudukan pihak penguasa?',
      ],
      Ridwan: [
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat menjadi alat bukti yang memadai untuk menggeser beban pembuktian kepada pihak yang menyangkal?',
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat dijadikan bukti prima facie yang memindahkan beban pembuktian kepada pihak yang mengklaim sebaliknya?',
      ],
      Susanto: [
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat diakui sebagai fakta hukum penguasaan nyata yang berdiri sendiri di hadapan hukum?',
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat dijadikan fakta okupasi yang memiliki nilai hukum mandiri tanpa bergantung pada naskah?',
      ],
      Suprapti: [
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat menutup celah cacat formil administrasi yang tidak menyentuh substansi kepemilikan?',
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat menutupi cacat formil pencatatan selama tidak ada cacat materiil pada peralihan hak?',
      ],
      Eka: [
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat melindungi pihak ketiga yang telah mengandalkan keadaan penguasaan yang terlihat di lapangan?',
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat menjadi dasar perlindungan bagi pihak ketiga yang bertransaksi berdasarkan fakta penguasaan terbuka?',
      ],
      Jumiati: [
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat mengalahkan data yang tercatat dalam sistem pendaftaran tanah negara?',
        'Apakah penguasaan lahan selama beberapa dekade tanpa naskah resmi dapat menggeser kekuatan hukum register negara yang belum mencatat peralihan tersebut?',
      ],
    },
  },
  {
    id: 3,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis menghapus perlindungan hukum bagi pihak yang telah menguasai objek dengan iktikad baik?',
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis meniadakan kedudukan pihak yang menguasai dengan iktikad baik sebelum kelalaian itu terjadi?',
      ],
      Ridwan: [
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis memindahkan beban pembuktian kepada pihak yang mengklaim hak berdasarkan naskah yang terlambat?',
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis mewajibkan pihak yang mengandalkan naskah belakangan untuk membuktikan lebih berat?',
      ],
      Susanto: [
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis menghapus nilai hukum dari fakta penguasaan nyata yang telah terbentuk sebelumnya?',
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis meniadakan fakta okupasi yang sudah berlangsung lama sebelum kelalaian itu?',
      ],
      Suprapti: [
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis digolongkan sebagai cacat formil yang tidak membatalkan substansi keperdataan yang telah ada?',
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis dipandang sebagai cacat formil semata sehingga tidak menghapus hak materiil yang sudah terbentuk?',
      ],
      Eka: [
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis merugikan pihak ketiga yang telah mengandalkan keadaan penguasaan yang terlihat di lapangan?',
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis mengorbankan kepentingan pihak ketiga yang beritikad baik terhadap objek yang sudah dikuasai terbuka?',
      ],
      Jumiati: [
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis menghapus kekuatan hukum data yang telah tercatat dalam sistem pendaftaran tanah negara?',
        'Dapatkah kelalaian menyelesaikan pengurusan tata usaha secara otomatis meniadakan keabsahan register negara yang sudah merekam kedudukan sebelumnya?',
      ],
    },
  },
  {
    id: 4,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menilai iktikad baik sebagai penentu bukti mana yang lebih patut dilindungi?',
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menimbang itikad baik pihak penguasa lama sebagai parameter utama keyakinan?',
      ],
      Ridwan: [
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menentukan siapa yang memikul beban pembuktian yang lebih berat?',
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menilai kekuatan relatif alat bukti masing-masing pihak untuk memutus beban pembuktian?',
      ],
      Susanto: [
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menilai fakta penguasaan fisik sebagai bukti yang paling konkret dan langsung?',
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menimbang okupasi nyata di lapangan dibanding bukti dokumen yang saling bertentangan?',
      ],
      Suprapti: [
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim membedakan bukti yang cacat formil dengan bukti yang cacat materiil?',
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menilai hierarki antara bukti yang hanya cacat formil dan bukti yang menyentuh substansi?',
      ],
      Eka: [
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim melindungi kepentingan pihak ketiga yang tidak terlibat dalam sengketa tersebut?',
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menimbang dampak putusan terhadap pihak ketiga yang telah bertransaksi berdasarkan keadaan yang terlihat?',
      ],
      Jumiati: [
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menilai data yang tercatat dalam sistem pendaftaran tanah negara sebagai acuan utama?',
        'Ketika kedua kubu mengajukan bukti yang saling berlawanan atas objek identik, bagaimana panel hakim menimbang kekuatan register negara dibanding bukti di luar sistem pendaftaran?',
      ],
    },
  },
  {
    id: 5,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu dilindungi karena dilakukan dengan iktikad baik di hadapan hukum?',
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu diakui sebagai peralihan yang sah karena dilandasi iktikad baik pihak-pihak?',
      ],
      Ridwan: [
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu memenuhi standar pembuktian yang cukup untuk dibebankan kepada pihak lawan?',
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu menjadi bukti yang memadai untuk menggeser beban pembuktian?',
      ],
      Susanto: [
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu diakui melalui fakta penguasaan nyata yang mengikutinya?',
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu dibuktikan melalui okupasi fisik yang berlangsung setelahnya?',
      ],
      Suprapti: [
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah ketiadaan bentuk tertulis dipandang sebagai cacat formil yang tidak membatalkan substansi peralihan?',
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu tetap sah secara materiil meskipun cacat formil karena tidak dituangkan dalam naskah?',
      ],
      Eka: [
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah pihak ketiga yang mengandalkan akibat perbuatan itu dilindungi oleh hukum?',
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah kepentingan pihak ketiga yang beritikad baik terhadap akibat perbuatan itu dijaga?',
      ],
      Jumiati: [
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu mengalahkan data yang sudah tercatat dalam sistem pendaftaran tanah negara?',
        'Apabila dalil kepemilikan didasarkan pada perbuatan yang tidak tertulis, dapatkah perbuatan itu diakui meski belum tercatat dalam register negara?',
      ],
    },
  },
  {
    id: 6,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Apakah panel hakim wajib menelusuri iktikad baik para pihak dalam peralihan historis sebelum menilai naskah yang diterbitkan pada kurun kemudian?',
        'Apakah panel hakim wajib menelaah apakah peralihan historis dilakukan dengan iktikad baik sebelum memberi bobot pada naskah yang lahir belakangan?',
      ],
      Ridwan: [
        'Apakah panel hakim wajib menelusuri rangkaian pembuktian historis suatu peralihan sebelum menilai naskah yang diterbitkan pada kurun kemudian?',
        'Apakah panel hakim wajib menelaah kekuatan alat bukti historis sebelum memutus beban pembuktian atas naskah yang baru terbit?',
      ],
      Susanto: [
        'Apakah panel hakim wajib menelusuri fakta penguasaan fisik historis suatu peralihan sebelum menilai naskah yang diterbitkan pada kurun kemudian?',
        'Apakah panel hakim wajib menelaah okupasi nyata yang menyertai peralihan historis sebelum memberi bobot pada naskah belakangan?',
      ],
      Suprapti: [
        'Apakah panel hakim wajib menelusuri apakah cacat formil atau materiil yang menyertai peralihan historis sebelum menilai naskah yang diterbitkan kemudian?',
        'Apakah panel hakim wajib menelaah hierarki cacat formil versus materiil dalam peralihan historis sebelum menilai naskah yang baru muncul?',
      ],
      Eka: [
        'Apakah panel hakim wajib menelusuri dampak peralihan historis terhadap pihak ketiga sebelum menilai naskah yang diterbitkan pada kurun kemudian?',
        'Apakah panel hakim wajib menelaah perlindungan pihak ketiga yang mungkin terpengaruh oleh peralihan historis sebelum menilai naskah belakangan?',
      ],
      Jumiati: [
        'Apakah panel hakim wajib menelusuri catatan dalam sistem pendaftaran tanah negara terkait peralihan historis sebelum menilai naskah yang diterbitkan kemudian?',
        'Apakah panel hakim wajib menelaah data register negara atas peralihan historis sebelum memberi bobot pada naskah yang lahir di luar sistem pendaftaran?',
      ],
    },
  },
  {
    id: 7,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Bagaimana kedudukan kesaksian masyarakat setempat dalam membuktikan bahwa peralihan lisan di masa lampau dilakukan dengan iktikad baik?',
        'Bagaimana posisi keterangan masyarakat setempat dalam membuktikan iktikad baik para pihak pada peralihan yang terjadi secara lisan di masa lampau?',
      ],
      Ridwan: [
        'Bagaimana kedudukan kesaksian masyarakat setempat sebagai alat bukti dalam membuktikan peralihan yang terjadi secara lisan di masa lampau?',
        'Bagaimana posisi keterangan masyarakat setempat dalam memenuhi standar pembuktian peralihan lisan di masa lampau?',
      ],
      Susanto: [
        'Bagaimana kedudukan kesaksian masyarakat setempat dalam membuktikan fakta penguasaan nyata yang menyertai peralihan lisan di masa lampau?',
        'Bagaimana posisi keterangan masyarakat setempat dalam menguatkan okupasi fisik yang terjadi setelah peralihan lisan di masa lampau?',
      ],
      Suprapti: [
        'Bagaimana kedudukan kesaksian masyarakat setempat dalam menutup cacat formil ketiadaan naskah pada peralihan lisan di masa lampau?',
        'Bagaimana posisi keterangan masyarakat setempat dalam membedakan cacat formil dengan substansi peralihan lisan yang tetap sah?',
      ],
      Eka: [
        'Bagaimana kedudukan kesaksian masyarakat setempat dalam melindungi pihak ketiga yang mengandalkan peralihan lisan yang sudah dikenal di lingkungan setempat?',
        'Bagaimana posisi keterangan masyarakat setempat dalam menjaga kepentingan pihak ketiga yang beritikad baik terhadap peralihan lisan di masa lampau?',
      ],
      Jumiati: [
        'Bagaimana kedudukan kesaksian masyarakat setempat dibanding data yang tercatat dalam sistem pendaftaran tanah negara terkait peralihan lisan di masa lampau?',
        'Bagaimana posisi keterangan masyarakat setempat dalam mengisi kekosongan register negara atas peralihan yang terjadi secara lisan di masa lampau?',
      ],
    },
  },
  {
    id: 8,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun dengan iktikad baik menghilangkan perlindungan hukum bagi pihak yang menguasainya?',
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun dengan iktikad baik meniadakan kedudukan pihak penguasa yang beritikad baik?',
      ],
      Ridwan: [
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun menggeser beban pembuktian kepada pihak yang menyangkal penguasaan tersebut?',
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun mewajibkan pihak yang mengklaim hak formal untuk membuktikan lebih berat?',
      ],
      Susanto: [
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun menghilangkan nilai hukum dari fakta penguasaan nyata itu sendiri?',
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun meniadakan fakta okupasi sebagai fakta hukum yang mandiri?',
      ],
      Suprapti: [
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun merupakan cacat formil yang tidak menghapus substansi kepemilikan yang sudah terbentuk?',
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun hanya cacat formil sehingga tidak membatalkan hak materiil pihak penguasa?',
      ],
      Eka: [
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun merugikan pihak ketiga yang telah mengandalkan penguasaan terbuka di lapangan?',
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun mengorbankan perlindungan pihak ketiga yang beritikad baik terhadap keadaan yang terlihat?',
      ],
      Jumiati: [
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun mengalahkan kekuatan sistem pendaftaran tanah negara yang mensyaratkan pencatatan?',
        'Apakah ketiadaan sertifikasi atas lahan yang dikuasai selama puluhan tahun meniadakan kewajiban untuk tunduk pada sistem register negara?',
      ],
    },
  },
  {
    id: 9,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Bagaimana panel hakim menilai ketegangan antara penguasaan fisik lama yang dilandasi iktikad baik dan naskah resmi yang baru terbit belakangan?',
        'Bagaimana panel hakim menimbang konflik antara iktikad baik pihak penguasa lama dan naskah resmi yang muncul jauh kemudian?',
      ],
      Ridwan: [
        'Bagaimana panel hakim menilai ketegangan antara penguasaan fisik lama dan naskah resmi yang baru terbit dari segi beban dan kekuatan pembuktian?',
        'Bagaimana panel hakim menimbang konflik antara fakta penguasaan lama dan naskah belakangan dalam menentukan siapa yang harus membuktikan lebih dulu?',
      ],
      Susanto: [
        'Bagaimana panel hakim menilai ketegangan antara fakta penguasaan fisik lama sebagai fakta hukum dan naskah resmi yang baru terbit belakangan?',
        'Bagaimana panel hakim menimbang konflik antara okupasi nyata yang telah lama berlangsung dan naskah yang lahir kemudian?',
      ],
      Suprapti: [
        'Bagaimana panel hakim menilai ketegangan antara penguasaan fisik lama dan naskah resmi belakangan dari sudut cacat formil versus materiil?',
        'Bagaimana panel hakim menimbang konflik tersebut dengan membedakan apakah masalahnya hanya formil atau menyentuh substansi hak?',
      ],
      Eka: [
        'Bagaimana panel hakim menilai ketegangan antara penguasaan fisik lama dan naskah resmi belakangan dengan mempertimbangkan perlindungan pihak ketiga?',
        'Bagaimana panel hakim menimbang konflik tersebut agar tidak merugikan pihak ketiga yang telah mengandalkan keadaan penguasaan yang terbuka?',
      ],
      Jumiati: [
        'Bagaimana panel hakim menilai ketegangan antara penguasaan fisik lama dan naskah resmi belakangan dalam kerangka sistem pendaftaran tanah negara?',
        'Bagaimana panel hakim menimbang konflik tersebut dengan mengacu pada data dan kekuatan register negara?',
      ],
    },
  },
  {
    id: 10,
    role: 'duit semilyar',
    questions: {
      Edi: [
        'Dapatkah rangkaian pembayaran kewajiban atas lahan selama bertahun-tahun memperkuat dalil iktikad baik pihak penguasa?',
        'Dapatkah jejak pembayaran kewajiban atas lahan selama bertahun-tahun menopang perlindungan hukum bagi pihak yang menguasai dengan iktikad baik?',
      ],
      Ridwan: [
        'Dapatkah rangkaian pembayaran kewajiban atas lahan selama bertahun-tahun menjadi bukti yang menggeser beban pembuktian kepada pihak lawan?',
        'Dapatkah jejak pembayaran kewajiban atas lahan selama bertahun-tahun memperkuat kekuatan pembuktian pihak penguasa di hadapan panel hakim?',
      ],
      Susanto: [
        'Dapatkah rangkaian pembayaran kewajiban atas lahan selama bertahun-tahun memperkuat fakta penguasaan nyata sebagai fakta hukum?',
        'Dapatkah jejak pembayaran kewajiban atas lahan selama bertahun-tahun menopang dalil okupasi fisik yang telah berlangsung lama?',
      ],
      Suprapti: [
        'Dapatkah rangkaian pembayaran kewajiban atas lahan selama bertahun-tahun menutup cacat formil ketiadaan naskah resmi?',
        'Dapatkah jejak pembayaran kewajiban atas lahan selama bertahun-tahun menunjukkan bahwa cacat yang ada hanya bersifat formil, bukan materiil?',
      ],
      Eka: [
        'Dapatkah rangkaian pembayaran kewajiban atas lahan selama bertahun-tahun melindungi pihak ketiga yang mengandalkan keadaan penguasaan tersebut?',
        'Dapatkah jejak pembayaran kewajiban atas lahan selama bertahun-tahun menjadi dasar perlindungan bagi pihak ketiga yang beritikad baik?',
      ],
      Jumiati: [
        'Dapatkah rangkaian pembayaran kewajiban atas lahan selama bertahun-tahun menguatkan kedudukan di luar data sistem pendaftaran tanah negara?',
        'Dapatkah jejak pembayaran kewajiban atas lahan selama bertahun-tahun menopang dalil meski belum tercatat lengkap dalam register negara?',
      ],
    },
  },

  // ── URIP KEPENAK (11–20) ──────────────────────────────────
  {
    id: 11,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Apakah pencatatan oleh aparatur negara berfungsi melahirkan kedudukan hukum baru, atau sekadar mengafirmasi kedudukan pihak yang sudah menguasai dengan iktikad baik?',
        'Apakah pencatatan oleh aparatur negara berfungsi menciptakan hak baru, atau sekadar menegaskan perlindungan bagi pihak yang telah beritikad baik sebelumnya?',
      ],
      Ridwan: [
        'Apakah pencatatan oleh aparatur negara berfungsi melahirkan kedudukan hukum baru, atau sekadar memperkuat alat bukti yang sudah ada sebelumnya?',
        'Apakah pencatatan oleh aparatur negara berfungsi menciptakan hak baru, atau sekadar menambah kekuatan pembuktian bagi pihak yang sudah menguasai?',
      ],
      Susanto: [
        'Apakah pencatatan oleh aparatur negara berfungsi melahirkan kedudukan hukum baru, atau sekadar mencatat fakta penguasaan nyata yang sudah berlangsung?',
        'Apakah pencatatan oleh aparatur negara berfungsi menciptakan hak baru, atau sekadar merekam okupasi fisik yang telah ada sebelumnya?',
      ],
      Suprapti: [
        'Apakah pencatatan oleh aparatur negara berfungsi melahirkan kedudukan hukum baru, atau sekadar menutup cacat formil tanpa mengubah substansi hak yang sudah ada?',
        'Apakah pencatatan oleh aparatur negara berfungsi menciptakan hak baru, atau sekadar memperbaiki cacat formil administrasi atas hak materiil yang telah terbentuk?',
      ],
      Eka: [
        'Apakah pencatatan oleh aparatur negara berfungsi melahirkan kedudukan hukum baru, atau sekadar melindungi pihak ketiga yang mengandalkan data resmi tersebut?',
        'Apakah pencatatan oleh aparatur negara berfungsi menciptakan hak baru, atau sekadar memberi kepastian bagi pihak ketiga yang beritikad baik?',
      ],
      Jumiati: [
        'Apakah pencatatan oleh aparatur negara berfungsi melahirkan kedudukan hukum baru dalam sistem pendaftaran tanah, atau sekadar merekam data yang sudah ada?',
        'Apakah pencatatan oleh aparatur negara berfungsi menciptakan hak baru melalui register negara, atau sekadar mengukuhkan data yang telah diakui sistem pendaftaran?',
      ],
    },
  },
  {
    id: 12,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Bagaimana panel hakim membedakan cacat yang menyentuh iktikad baik pihak penguasa dengan cacat yang hanya bersifat prosedural belaka?',
        'Bagaimana panel hakim memisahkan cacat yang merusak iktikad baik dengan cacat administratif yang tidak menghapus perlindungan bagi penguasa beritikad baik?',
      ],
      Ridwan: [
        'Bagaimana panel hakim membedakan cacat yang melemahkan kekuatan pembuktian dengan cacat yang hanya bersifat prosedural belaka?',
        'Bagaimana panel hakim memisahkan cacat yang memengaruhi beban pembuktian dengan cacat administratif yang tidak mengubah kekuatan alat bukti?',
      ],
      Susanto: [
        'Bagaimana panel hakim membedakan cacat yang menyentuh fakta penguasaan nyata dengan cacat yang hanya bersifat prosedural belaka?',
        'Bagaimana panel hakim memisahkan cacat yang mengganggu okupasi fisik dengan cacat administratif yang tidak meniadakan fakta penguasaan?',
      ],
      Suprapti: [
        'Bagaimana panel hakim membedakan cacat yang menyentuh isi kedudukan hukum (materiil) dengan cacat yang hanya bersifat formil belaka?',
        'Bagaimana panel hakim memisahkan cacat materiil yang membatalkan substansi hak dengan cacat formil yang hanya menyangkut prosedur?',
      ],
      Eka: [
        'Bagaimana panel hakim membedakan cacat yang merugikan pihak ketiga dengan cacat yang hanya bersifat prosedural belaka?',
        'Bagaimana panel hakim memisahkan cacat yang mengancam perlindungan pihak ketiga dengan cacat administratif yang tidak berdampak pada pihak ketiga?',
      ],
      Jumiati: [
        'Bagaimana panel hakim membedakan cacat yang menyentuh data sistem pendaftaran tanah negara dengan cacat yang hanya bersifat prosedural belaka?',
        'Bagaimana panel hakim memisahkan cacat yang merusak keabsahan register negara dengan cacat administratif yang tidak menghapus kekuatan pencatatan?',
      ],
    },
  },
  {
    id: 13,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Apabila regulasi pelaksana bertentangan dengan norma pokok yang melindungi iktikad baik, mana yang wajib diprioritaskan oleh panel hakim dalam pertimbangannya?',
        'Apabila regulasi pelaksana bertentangan dengan norma pokok tentang perlindungan penguasa beritikad baik, mana yang harus diutamakan oleh panel hakim?',
      ],
      Ridwan: [
        'Apabila regulasi pelaksana bertentangan dengan norma pokok tentang beban dan kekuatan pembuktian, mana yang wajib diprioritaskan oleh panel hakim?',
        'Apabila regulasi pelaksana bertentangan dengan norma pokok pembuktian, mana yang harus diutamakan oleh panel hakim dalam menentukan beban pembuktian?',
      ],
      Susanto: [
        'Apabila regulasi pelaksana bertentangan dengan norma pokok yang mengakui penguasaan nyata, mana yang wajib diprioritaskan oleh panel hakim?',
        'Apabila regulasi pelaksana bertentangan dengan norma pokok tentang fakta okupasi, mana yang harus diutamakan oleh panel hakim?',
      ],
      Suprapti: [
        'Apabila regulasi pelaksana bertentangan dengan norma pokok yang mengatur hierarki cacat formil dan materiil, mana yang wajib diprioritaskan oleh panel hakim?',
        'Apabila regulasi pelaksana bertentangan dengan norma pokok tentang cacat formil versus materiil, mana yang harus diutamakan oleh panel hakim?',
      ],
      Eka: [
        'Apabila regulasi pelaksana bertentangan dengan norma pokok yang melindungi pihak ketiga, mana yang wajib diprioritaskan oleh panel hakim?',
        'Apabila regulasi pelaksana bertentangan dengan norma pokok perlindungan pihak ketiga beritikad baik, mana yang harus diutamakan oleh panel hakim?',
      ],
      Jumiati: [
        'Apabila regulasi pelaksana bertentangan dengan norma pokok sistem pendaftaran tanah negara, mana yang wajib diprioritaskan oleh panel hakim?',
        'Apabila regulasi pelaksana bertentangan dengan norma pokok kekuatan register negara, mana yang harus diutamakan oleh panel hakim?',
      ],
    },
  },
  {
    id: 14,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Dalam sengketa lahan, apakah iktikad baik penguasa atas objek sengketa lebih menentukan ketimbang naskah resmi yang dimiliki salah satu kubu?',
        'Dalam sengketa lahan, apakah perlindungan terhadap pihak yang menguasai dengan iktikad baik lebih berbobot ketimbang naskah resmi belakangan?',
      ],
      Ridwan: [
        'Dalam sengketa lahan, apakah kekuatan pembuktian atas objek sengketa lebih menentukan ketimbang naskah resmi yang dimiliki salah satu kubu?',
        'Dalam sengketa lahan, apakah beban dan bobot pembuktian lebih berbobot ketimbang sekadar kepemilikan naskah resmi?',
      ],
      Susanto: [
        'Dalam sengketa lahan, apakah penguasaan aktual atas objek sengketa lebih menentukan ketimbang naskah resmi yang dimiliki salah satu kubu?',
        'Dalam sengketa lahan, apakah fakta okupasi nyata lebih berbobot ketimbang naskah resmi yang tidak disertai penguasaan?',
      ],
      Suprapti: [
        'Dalam sengketa lahan, apakah keabsahan materiil atas objek sengketa lebih menentukan ketimbang naskah resmi yang mungkin cacat formil?',
        'Dalam sengketa lahan, apakah substansi hak lebih berbobot ketimbang naskah resmi yang hanya memenuhi syarat formil?',
      ],
      Eka: [
        'Dalam sengketa lahan, apakah perlindungan pihak ketiga atas objek sengketa lebih menentukan ketimbang naskah resmi yang dimiliki salah satu kubu?',
        'Dalam sengketa lahan, apakah kepentingan pihak ketiga beritikad baik lebih berbobot ketimbang naskah resmi internal para pihak?',
      ],
      Jumiati: [
        'Dalam sengketa lahan, apakah data sistem pendaftaran tanah negara atas objek sengketa lebih menentukan ketimbang naskah resmi di luar register?',
        'Dalam sengketa lahan, apakah kekuatan register negara lebih berbobot ketimbang naskah resmi yang tidak tercatat dalam sistem pendaftaran?',
      ],
    },
  },
  {
    id: 15,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Bagaimana sistem hukum menilai perlindungan seseorang yang menguasai lahan dengan iktikad baik meskipun tanpa naskah resmi?',
        'Bagaimana sistem hukum menimbang hak seseorang yang menguasai lahan dengan iktikad baik meski naskah resmi belum lengkap?',
      ],
      Ridwan: [
        'Bagaimana sistem hukum menilai kekuatan pembuktian seseorang yang menguasai lahan meskipun tanpa naskah resmi?',
        'Bagaimana sistem hukum menimbang beban pembuktian bagi seseorang yang menguasai lahan tanpa naskah resmi di hadapan pihak yang membawa naskah?',
      ],
      Susanto: [
        'Bagaimana sistem hukum menilai fakta penguasaan nyata seseorang yang menguasai lahan meskipun tanpa naskah resmi?',
        'Bagaimana sistem hukum menimbang okupasi fisik seseorang yang menguasai lahan meski naskah resmi belum ada?',
      ],
      Suprapti: [
        'Bagaimana sistem hukum menilai apakah ketiadaan naskah resmi merupakan cacat formil atau materiil bagi seseorang yang menguasai lahan?',
        'Bagaimana sistem hukum menimbang cacat formil ketiadaan naskah terhadap substansi penguasaan yang sudah berlangsung?',
      ],
      Eka: [
        'Bagaimana sistem hukum menilai perlindungan pihak ketiga yang mengandalkan penguasaan seseorang atas lahan meskipun tanpa naskah resmi?',
        'Bagaimana sistem hukum menimbang kepentingan pihak ketiga beritikad baik terhadap penguasaan lahan tanpa naskah resmi?',
      ],
      Jumiati: [
        'Bagaimana sistem hukum menilai kedudukan seseorang yang menguasai lahan tanpa naskah resmi di hadapan sistem pendaftaran tanah negara?',
        'Bagaimana sistem hukum menimbang penguasaan tanpa naskah resmi dibanding data yang tercatat dalam register negara?',
      ],
    },
  },
  {
    id: 16,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah kekuatan naskah itu digugurkan oleh dalil iktikad baik pihak yang telah lama menguasai?',
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah perlindungan iktikad baik pihak penguasa lama mengalahkan kekuatan naskah tersebut?',
      ],
      Ridwan: [
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah kekuatan pembuktian naskah itu digugurkan oleh dalil lisan pihak lawan?',
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah beban pembuktian atas naskah itu digeser oleh bukti penguasaan pihak lawan?',
      ],
      Susanto: [
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah kekuatan naskah itu digugurkan oleh fakta penguasaan nyata pihak lawan?',
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah okupasi fisik yang telah lama berlangsung mengalahkan naskah tersebut?',
      ],
      Suprapti: [
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah kekuatan naskah itu digugurkan jika ternyata mengandung cacat materiil?',
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah cacat materiil mengalahkan keabsahan formil naskah tersebut?',
      ],
      Eka: [
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah kekuatan naskah itu digugurkan demi melindungi pihak ketiga yang beritikad baik?',
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah kepentingan pihak ketiga mengalahkan kekuatan naskah yang merugikan mereka?',
      ],
      Jumiati: [
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah kekuatan naskah itu digugurkan jika bertentangan dengan data sistem pendaftaran tanah negara?',
        'Apabila naskah resmi terbit di hadapan pengemban jabatan yang berwenang, dapatkah register negara mengalahkan naskah yang tidak sesuai dengan sistem pendaftaran?',
      ],
    },
  },
  {
    id: 17,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Seberapa jauh kekuatan formal atas naskah resmi dapat menutup celah dalil iktikad baik yang bersandar pada penguasaan nyata bertahun-tahun?',
        'Seberapa jauh daya ikat formal naskah resmi dapat menutup ruang perlindungan bagi pihak yang menguasai dengan iktikad baik lintas dekade?',
      ],
      Ridwan: [
        'Seberapa jauh kekuatan formal atas naskah resmi dapat menutup celah dalil yang bersandar pada beban dan kekuatan pembuktian penguasaan nyata?',
        'Seberapa jauh daya ikat formal naskah resmi dapat menggeser beban pembuktian dari pihak yang menguasai nyata bertahun-tahun?',
      ],
      Susanto: [
        'Seberapa jauh kekuatan formal atas naskah resmi dapat menutup celah dalil yang bersandar pada fakta penguasaan nyata bertahun-tahun?',
        'Seberapa jauh daya ikat formal naskah resmi dapat meniadakan nilai hukum okupasi fisik yang telah berlangsung lama?',
      ],
      Suprapti: [
        'Seberapa jauh kekuatan formal atas naskah resmi dapat menutup celah dalil yang membedakan cacat formil dengan cacat materiil?',
        'Seberapa jauh daya ikat formal naskah resmi dapat mengabaikan pembedaan antara cacat formil dan substansi hak yang sudah terbentuk?',
      ],
      Eka: [
        'Seberapa jauh kekuatan formal atas naskah resmi dapat menutup celah dalil perlindungan pihak ketiga yang mengandalkan penguasaan nyata?',
        'Seberapa jauh daya ikat formal naskah resmi dapat mengesampingkan kepentingan pihak ketiga beritikad baik atas keadaan yang terlihat?',
      ],
      Jumiati: [
        'Seberapa jauh kekuatan formal atas naskah resmi dapat menutup celah dalil yang bersandar pada data sistem pendaftaran tanah negara?',
        'Seberapa jauh daya ikat formal naskah resmi dapat mengalahkan kekuatan register negara yang mencatat keadaan berbeda?',
      ],
    },
  },
  {
    id: 18,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Bagaimana panel hakim menilai klaim pihak yang baru muncul belakangan dengan membawa naskah, terhadap pihak yang sudah lama menguasai dengan iktikad baik?',
        'Bagaimana panel hakim menimbang tuntutan pihak yang baru membawa naskah terhadap perlindungan iktikad baik pihak penguasa lama?',
      ],
      Ridwan: [
        'Bagaimana panel hakim menilai klaim pihak yang baru muncul belakangan dengan membawa naskah, dari segi beban dan kekuatan pembuktian?',
        'Bagaimana panel hakim menimbang tuntutan pihak yang baru membawa naskah terhadap beban pembuktian pihak yang sudah lama menguasai?',
      ],
      Susanto: [
        'Bagaimana panel hakim menilai klaim pihak yang baru muncul belakangan dengan membawa naskah, terhadap fakta penguasaan nyata pihak lama?',
        'Bagaimana panel hakim menimbang tuntutan pihak yang baru membawa naskah terhadap okupasi fisik yang telah berlangsung lama?',
      ],
      Suprapti: [
        'Bagaimana panel hakim menilai klaim pihak yang baru muncul belakangan dengan membawa naskah, dari sudut cacat formil versus materiil?',
        'Bagaimana panel hakim menimbang tuntutan pihak yang baru membawa naskah dengan membedakan cacat formil dan substansi hak pihak lama?',
      ],
      Eka: [
        'Bagaimana panel hakim menilai klaim pihak yang baru muncul belakangan dengan membawa naskah, terhadap perlindungan pihak ketiga yang terlibat?',
        'Bagaimana panel hakim menimbang tuntutan pihak yang baru membawa naskah agar tidak merugikan pihak ketiga beritikad baik?',
      ],
      Jumiati: [
        'Bagaimana panel hakim menilai klaim pihak yang baru muncul belakangan dengan membawa naskah, dalam kerangka sistem pendaftaran tanah negara?',
        'Bagaimana panel hakim menimbang tuntutan pihak yang baru membawa naskah dibanding data yang sudah tercatat dalam register negara?',
      ],
    },
  },
  {
    id: 19,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Apakah kehadiran naskah yang terbit kemudian mampu menggeser kedudukan pihak yang telah menguasai lahan dengan iktikad baik lintas dekade?',
        'Apakah terbitnya naskah kemudian mampu mengalahkan perlindungan hukum bagi pihak yang menguasai dengan iktikad baik selama puluhan tahun?',
      ],
      Ridwan: [
        'Apakah kehadiran naskah yang terbit kemudian mampu menggeser beban pembuktian dari pihak yang telah menguasai lahan lintas dekade?',
        'Apakah terbitnya naskah kemudian mampu mengubah kekuatan pembuktian pihak yang sudah lama menguasai objek?',
      ],
      Susanto: [
        'Apakah kehadiran naskah yang terbit kemudian mampu menggeser fakta penguasaan nyata pihak yang telah menguasai lahan lintas dekade?',
        'Apakah terbitnya naskah kemudian mampu meniadakan nilai hukum okupasi fisik yang telah berlangsung puluhan tahun?',
      ],
      Suprapti: [
        'Apakah kehadiran naskah yang terbit kemudian mampu menggeser kedudukan materiil pihak yang telah menguasai lahan, atau hanya menutup cacat formil?',
        'Apakah terbitnya naskah kemudian mampu mengalahkan substansi hak, atau sekadar memperbaiki cacat formil semata?',
      ],
      Eka: [
        'Apakah kehadiran naskah yang terbit kemudian mampu menggeser perlindungan pihak ketiga yang telah mengandalkan penguasaan lintas dekade?',
        'Apakah terbitnya naskah kemudian mampu mengalahkan kepentingan pihak ketiga beritikad baik atas keadaan yang sudah lama terbuka?',
      ],
      Jumiati: [
        'Apakah kehadiran naskah yang terbit kemudian mampu menggeser data yang sudah tercatat dalam sistem pendaftaran tanah negara?',
        'Apakah terbitnya naskah kemudian mampu mengalahkan kekuatan register negara yang telah merekam kedudukan sebelumnya?',
      ],
    },
  },
  {
    id: 20,
    role: 'urip kepenak',
    questions: {
      Edi: [
        'Dalam menilai sengketa, apakah panel hakim boleh mengabaikan iktikad baik penguasaan nyata hanya karena naskah resmi belum lengkap?',
        'Dalam menilai sengketa, apakah panel hakim boleh menyingkirkan perlindungan iktikad baik hanya karena naskah resmi belum lengkap?',
      ],
      Ridwan: [
        'Dalam menilai sengketa, apakah panel hakim boleh mengabaikan kekuatan pembuktian penguasaan nyata hanya karena naskah resmi belum lengkap?',
        'Dalam menilai sengketa, apakah panel hakim boleh menyingkirkan beban pembuktian yang sudah bergeser hanya karena naskah resmi belum lengkap?',
      ],
      Susanto: [
        'Dalam menilai sengketa, apakah panel hakim boleh mengabaikan fakta penguasaan nyata hanya karena naskah resmi belum lengkap?',
        'Dalam menilai sengketa, apakah panel hakim boleh menyingkirkan okupasi fisik yang telah berlangsung hanya karena naskah resmi belum lengkap?',
      ],
      Suprapti: [
        'Dalam menilai sengketa, apakah panel hakim boleh mengabaikan substansi hak hanya karena naskah resmi belum lengkap (cacat formil)?',
        'Dalam menilai sengketa, apakah panel hakim boleh menyingkirkan kedudukan materiil hanya karena adanya cacat formil ketiadaan naskah?',
      ],
      Eka: [
        'Dalam menilai sengketa, apakah panel hakim boleh mengabaikan perlindungan pihak ketiga hanya karena naskah resmi belum lengkap?',
        'Dalam menilai sengketa, apakah panel hakim boleh menyingkirkan kepentingan pihak ketiga beritikad baik hanya karena naskah resmi belum lengkap?',
      ],
      Jumiati: [
        'Dalam menilai sengketa, apakah panel hakim boleh mengabaikan data sistem pendaftaran tanah negara hanya karena naskah resmi pihak lain belum lengkap?',
        'Dalam menilai sengketa, apakah panel hakim boleh menyingkirkan kekuatan register negara hanya karena naskah di luar sistem belum lengkap?',
      ],
    },
  },

  // ── KAMULYAN JAGAD (21–30) ────────────────────────────────
  {
    id: 21,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Sejauh mana rentang waktu antara lahirnya peristiwa hukum dan penerbitan naskah resmi memengaruhi perlindungan iktikad baik pihak yang menguasai?',
        'Sejauh mana jarak waktu antara peristiwa hukum dan penerbitan naskah memengaruhi bobot perlindungan bagi penguasa beritikad baik?',
      ],
      Ridwan: [
        'Sejauh mana rentang waktu antara lahirnya peristiwa hukum dan penerbitan naskah resmi memengaruhi beban dan kekuatan pembuktian naskah tersebut?',
        'Sejauh mana jarak waktu antara peristiwa hukum dan penerbitan naskah memengaruhi bobot pembuktian yang harus dipikul pihak yang mengajukannya?',
      ],
      Susanto: [
        'Sejauh mana rentang waktu antara lahirnya peristiwa hukum dan penerbitan naskah resmi memengaruhi nilai hukum fakta penguasaan nyata di antaranya?',
        'Sejauh mana jarak waktu antara peristiwa hukum dan penerbitan naskah memengaruhi bobot okupasi fisik yang terjadi selama tenggang tersebut?',
      ],
      Suprapti: [
        'Sejauh mana rentang waktu antara lahirnya peristiwa hukum dan penerbitan naskah resmi memengaruhi penilaian cacat formil versus materiil?',
        'Sejauh mana jarak waktu antara peristiwa hukum dan penerbitan naskah memengaruhi apakah keterlambatan itu cacat formil atau menyentuh substansi?',
      ],
      Eka: [
        'Sejauh mana rentang waktu antara lahirnya peristiwa hukum dan penerbitan naskah resmi memengaruhi perlindungan pihak ketiga yang muncul di tenggang itu?',
        'Sejauh mana jarak waktu antara peristiwa hukum dan penerbitan naskah memengaruhi kepentingan pihak ketiga beritikad baik yang terlibat selama tenggang?',
      ],
      Jumiati: [
        'Sejauh mana rentang waktu antara lahirnya peristiwa hukum dan penerbitan naskah resmi memengaruhi kekuatan data sistem pendaftaran tanah negara?',
        'Sejauh mana jarak waktu antara peristiwa hukum dan penerbitan naskah memengaruhi bobot register negara yang belum atau sudah mencatat peristiwa itu?',
      ],
    },
  },
  {
    id: 22,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade menjadi landasan bagi panel hakim untuk melindungi kedudukan hukumnya?',
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade dijadikan pijakan utama bagi panel hakim untuk melindungi kedudukannya?',
      ],
      Ridwan: [
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade menjadi landasan untuk menggeser beban pembuktian kepada pihak lawan?',
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade dijadikan pijakan untuk memperkuat kekuatan pembuktiannya?',
      ],
      Susanto: [
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade menjadi landasan untuk mengakui fakta penguasaan nyata sebagai fakta hukum?',
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade dijadikan pijakan untuk menguatkan nilai okupasi fisiknya?',
      ],
      Suprapti: [
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade menjadi landasan untuk menutup cacat formil yang tidak menyentuh substansi?',
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade dijadikan pijakan untuk membedakan cacat formil dengan cacat materiil?',
      ],
      Eka: [
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade menjadi landasan untuk melindungi pihak ketiga yang mengandalkannya?',
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade dijadikan pijakan perlindungan bagi pihak ketiga beritikad baik?',
      ],
      Jumiati: [
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade menjadi landasan untuk mengisi kekosongan data sistem pendaftaran tanah negara?',
        'Dapatkah itikad baik pihak yang menguasai lahan selama beberapa dekade dijadikan pijakan meski belum tercatat lengkap dalam register negara?',
      ],
    },
  },
  {
    id: 23,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Pihak mana yang seharusnya memikul beban untuk membuktikan ketiadaan iktikad baik apabila satu kubu menguasai naskah resmi dan kubu lain mengandalkan penguasaan lama?',
        'Pihak mana yang seharusnya menanggung kewajiban membuktikan itikad buruk apabila satu kubu menguasai naskah dan kubu lain mengandalkan penguasaan dengan iktikad baik?',
      ],
      Ridwan: [
        'Pihak mana yang seharusnya memikul beban pembuktian apabila satu kubu menguasai naskah resmi dan kubu lain mengandalkan dalil lisan semata?',
        'Pihak mana yang seharusnya menanggung beban pembuktian apabila satu kubu menguasai naskah resmi dan kubu lain mengandalkan penguasaan tanpa naskah?',
      ],
      Susanto: [
        'Pihak mana yang seharusnya memikul beban untuk menyangkal fakta penguasaan nyata apabila satu kubu menguasai naskah resmi dan kubu lain mengandalkan okupasi?',
        'Pihak mana yang seharusnya menanggung kewajiban membantah okupasi fisik apabila satu kubu menguasai naskah dan kubu lain mengandalkan penguasaan nyata?',
      ],
      Suprapti: [
        'Pihak mana yang seharusnya memikul beban untuk membuktikan cacat materiil apabila satu kubu menguasai naskah resmi dan kubu lain mengandalkan penguasaan lama?',
        'Pihak mana yang seharusnya menanggung kewajiban membuktikan bahwa naskah mengandung cacat materiil, bukan sekadar formil?',
      ],
      Eka: [
        'Pihak mana yang seharusnya memikul beban untuk melindungi kepentingan pihak ketiga apabila satu kubu menguasai naskah resmi dan kubu lain mengandalkan penguasaan?',
        'Pihak mana yang seharusnya menanggung kewajiban menjaga pihak ketiga beritikad baik dalam sengketa antara pemegang naskah dan penguasa nyata?',
      ],
      Jumiati: [
        'Pihak mana yang seharusnya memikul beban untuk membuktikan ketidaksesuaian dengan sistem pendaftaran tanah negara apabila satu kubu menguasai naskah dan kubu lain mengandalkan penguasaan?',
        'Pihak mana yang seharusnya menanggung kewajiban membuktikan data register negara apabila satu kubu menguasai naskah di luar sistem dan kubu lain mengandalkan penguasaan?',
      ],
    },
  },
  {
    id: 24,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Apakah diskrepansi antara peristiwa hukum yang telah terjadi dan naskah yang melengkapinya menciptakan celah bagi perlindungan iktikad baik pihak penguasa?',
        'Apakah kesenjangan antara peristiwa hukum dan naskah yang menyusul membuka ruang perlindungan bagi pihak yang menguasai dengan iktikad baik?',
      ],
      Ridwan: [
        'Apakah diskrepansi antara peristiwa hukum yang telah terjadi dan naskah yang melengkapinya menciptakan celah dalam beban dan kekuatan pembuktian?',
        'Apakah kesenjangan antara peristiwa hukum dan naskah yang menyusul membuka ruang untuk menggeser beban pembuktian kepada pihak pemegang naskah?',
      ],
      Susanto: [
        'Apakah diskrepansi antara peristiwa hukum yang telah terjadi dan naskah yang melengkapinya menciptakan celah bagi pengakuan fakta penguasaan nyata?',
        'Apakah kesenjangan antara peristiwa hukum dan naskah yang menyusul membuka ruang untuk menguatkan nilai okupasi fisik di tenggang waktu itu?',
      ],
      Suprapti: [
        'Apakah diskrepansi antara peristiwa hukum yang telah terjadi dan naskah yang melengkapinya menciptakan celah cacat formil yang tidak membatalkan substansi?',
        'Apakah kesenjangan antara peristiwa hukum dan naskah yang menyusul membuka ruang pembedaan antara cacat formil dan cacat materiil?',
      ],
      Eka: [
        'Apakah diskrepansi antara peristiwa hukum yang telah terjadi dan naskah yang melengkapinya menciptakan celah perlindungan bagi pihak ketiga?',
        'Apakah kesenjangan antara peristiwa hukum dan naskah yang menyusul membuka ruang bagi kepentingan pihak ketiga beritikad baik?',
      ],
      Jumiati: [
        'Apakah diskrepansi antara peristiwa hukum yang telah terjadi dan naskah yang melengkapinya menciptakan celah dalam sistem pendaftaran tanah negara?',
        'Apakah kesenjangan antara peristiwa hukum dan naskah yang menyusul membuka ruang untuk menguji kekuatan register negara?',
      ],
    },
  },
  {
    id: 25,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Apakah kontribusi yang dilakukan keluarga penguasa lahan selama puluhan tahun membuktikan adanya iktikad baik yang layak dilindungi atas lahan tersebut?',
        'Apakah sumbangsih yang dilakukan keluarga penguasa lahan selama puluhan tahun menunjukkan iktikad baik yang memperkuat kedudukan hukumnya?',
      ],
      Ridwan: [
        'Apakah kontribusi yang dilakukan keluarga penguasa lahan selama puluhan tahun menjadi bukti yang menggeser beban pembuktian kepada pihak lawan?',
        'Apakah sumbangsih yang dilakukan keluarga penguasa lahan selama puluhan tahun memperkuat kekuatan pembuktian kedudukan mereka?',
      ],
      Susanto: [
        'Apakah kontribusi yang dilakukan keluarga penguasa lahan selama puluhan tahun membuktikan fakta penguasaan nyata yang sah atas lahan tersebut?',
        'Apakah sumbangsih yang dilakukan keluarga penguasa lahan selama puluhan tahun menunjukkan okupasi fisik yang memiliki nilai hukum?',
      ],
      Suprapti: [
        'Apakah kontribusi yang dilakukan keluarga penguasa lahan selama puluhan tahun menutup cacat formil ketiadaan naskah resmi?',
        'Apakah sumbangsih yang dilakukan keluarga penguasa lahan selama puluhan tahun menunjukkan substansi hak meski ada cacat formil?',
      ],
      Eka: [
        'Apakah kontribusi yang dilakukan keluarga penguasa lahan selama puluhan tahun melindungi pihak ketiga yang mengandalkan keadaan tersebut?',
        'Apakah sumbangsih yang dilakukan keluarga penguasa lahan selama puluhan tahun menjadi dasar perlindungan bagi pihak ketiga beritikad baik?',
      ],
      Jumiati: [
        'Apakah kontribusi yang dilakukan keluarga penguasa lahan selama puluhan tahun menguatkan kedudukan di luar data sistem pendaftaran tanah negara?',
        'Apakah sumbangsih yang dilakukan keluarga penguasa lahan selama puluhan tahun menopang dalil meski belum tercatat lengkap dalam register negara?',
      ],
    },
  },
  {
    id: 26,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Bagaimana panel hakim seharusnya menyikapi kontradiksi antara dalil penggugat yang tidak disertai bukti fisik dan penguasaan nyata beritikad baik oleh tergugat selama puluhan tahun?',
        'Bagaimana panel hakim seharusnya menanggapi pertentangan antara dalil tanpa bukti fisik dan penguasaan dengan iktikad baik yang telah berlangsung lama?',
      ],
      Ridwan: [
        'Bagaimana panel hakim seharusnya menyikapi kontradiksi antara dalil penggugat yang tidak disertai bukti fisik dan penguasaan nyata tergugat dari segi beban pembuktian?',
        'Bagaimana panel hakim seharusnya menanggapi pertentangan tersebut dengan menentukan siapa yang memikul beban pembuktian lebih berat?',
      ],
      Susanto: [
        'Bagaimana panel hakim seharusnya menyikapi kontradiksi antara dalil penggugat yang tidak disertai bukti fisik dan fakta penguasaan nyata tergugat selama puluhan tahun?',
        'Bagaimana panel hakim seharusnya menanggapi pertentangan antara dalil tanpa bukti fisik dan okupasi fisik yang telah lama berlangsung?',
      ],
      Suprapti: [
        'Bagaimana panel hakim seharusnya menyikapi kontradiksi antara dalil penggugat yang tidak disertai bukti fisik dan penguasaan tergugat dari sudut cacat formil versus materiil?',
        'Bagaimana panel hakim seharusnya menanggapi pertentangan tersebut dengan membedakan cacat formil dalil dan substansi penguasaan?',
      ],
      Eka: [
        'Bagaimana panel hakim seharusnya menyikapi kontradiksi antara dalil penggugat yang tidak disertai bukti fisik dan penguasaan tergugat dengan mempertimbangkan pihak ketiga?',
        'Bagaimana panel hakim seharusnya menanggapi pertentangan tersebut agar tidak merugikan pihak ketiga beritikad baik?',
      ],
      Jumiati: [
        'Bagaimana panel hakim seharusnya menyikapi kontradiksi antara dalil penggugat yang tidak disertai bukti fisik dan penguasaan tergugat dalam kerangka sistem pendaftaran tanah negara?',
        'Bagaimana panel hakim seharusnya menanggapi pertentangan tersebut dengan mengacu pada data register negara?',
      ],
    },
  },
  {
    id: 27,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Apakah keberlanjutan lintas generasi atas lahan dapat menguatkan dalil iktikad baik meski naskah resmi belum lengkap?',
        'Apakah kesinambungan lintas generasi atas lahan dapat memperkuat perlindungan iktikad baik meski naskah resmi belum lengkap?',
      ],
      Ridwan: [
        'Apakah keberlanjutan lintas generasi atas lahan dapat menguatkan kekuatan pembuktian meski naskah resmi belum lengkap?',
        'Apakah kesinambungan lintas generasi atas lahan dapat menggeser beban pembuktian meski naskah resmi belum lengkap?',
      ],
      Susanto: [
        'Apakah keberlanjutan lintas generasi atas lahan dapat menguatkan fakta penguasaan nyata meski naskah resmi belum lengkap?',
        'Apakah kesinambungan lintas generasi atas lahan dapat memperkuat nilai okupasi fisik meski naskah resmi belum lengkap?',
      ],
      Suprapti: [
        'Apakah keberlanjutan lintas generasi atas lahan dapat menutup cacat formil ketiadaan naskah resmi?',
        'Apakah kesinambungan lintas generasi atas lahan dapat menunjukkan substansi hak meski ada cacat formil?',
      ],
      Eka: [
        'Apakah keberlanjutan lintas generasi atas lahan dapat menguatkan perlindungan pihak ketiga meski naskah resmi belum lengkap?',
        'Apakah kesinambungan lintas generasi atas lahan dapat memperkuat kepentingan pihak ketiga beritikad baik meski naskah belum lengkap?',
      ],
      Jumiati: [
        'Apakah keberlanjutan lintas generasi atas lahan dapat menguatkan kedudukan di hadapan sistem pendaftaran tanah negara meski naskah belum lengkap?',
        'Apakah kesinambungan lintas generasi atas lahan dapat menopang dalil meski data register negara belum lengkap?',
      ],
    },
  },
  {
    id: 28,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Bagaimana panel hakim menilai keterlambatan pihak yang baru mengajukan gugatan setelah objek dikuasai pihak lain dengan iktikad baik selama puluhan tahun?',
        'Bagaimana panel hakim menimbang kelambanan penggugat terhadap perlindungan iktikad baik pihak yang sudah lama menguasai objek?',
      ],
      Ridwan: [
        'Bagaimana panel hakim menilai keterlambatan pihak yang baru mengajukan gugatan dari segi beban dan kekuatan pembuktian setelah penguasaan berlangsung puluhan tahun?',
        'Bagaimana panel hakim menimbang kelambanan penggugat dalam menentukan siapa yang harus membuktikan lebih berat setelah tenggang waktu lama?',
      ],
      Susanto: [
        'Bagaimana panel hakim menilai keterlambatan pihak yang baru mengajukan gugatan terhadap fakta penguasaan nyata yang telah berlangsung puluhan tahun?',
        'Bagaimana panel hakim menimbang kelambanan penggugat dibanding okupasi fisik yang sudah lama terjadi?',
      ],
      Suprapti: [
        'Bagaimana panel hakim menilai keterlambatan pihak yang baru mengajukan gugatan dari sudut apakah keterlambatan itu menimbulkan cacat formil atau materiil?',
        'Bagaimana panel hakim menimbang kelambanan penggugat dengan membedakan dampak formil dan substansi terhadap kedudukan pihak lama?',
      ],
      Eka: [
        'Bagaimana panel hakim menilai keterlambatan pihak yang baru mengajukan gugatan terhadap perlindungan pihak ketiga yang telah terbentuk selama puluhan tahun?',
        'Bagaimana panel hakim menimbang kelambanan penggugat agar tidak merugikan pihak ketiga beritikad baik yang muncul di tenggang waktu itu?',
      ],
      Jumiati: [
        'Bagaimana panel hakim menilai keterlambatan pihak yang baru mengajukan gugatan dalam kerangka sistem pendaftaran tanah negara setelah puluhan tahun?',
        'Bagaimana panel hakim menimbang kelambanan penggugat dibanding data yang sudah atau belum tercatat dalam register negara selama tenggang itu?',
      ],
    },
  },
  {
    id: 29,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Dapatkah penerimaan sosial di lingkungan setempat dijadikan penopang pembuktian iktikad baik penguasaan lahan tanpa naskah lengkap?',
        'Dapatkah pengakuan sosial di lingkungan setempat dijadikan sandaran perlindungan iktikad baik penguasaan lahan tanpa naskah lengkap?',
      ],
      Ridwan: [
        'Dapatkah penerimaan sosial di lingkungan setempat dijadikan penopang kekuatan pembuktian penguasaan lahan tanpa naskah lengkap?',
        'Dapatkah pengakuan sosial di lingkungan setempat dijadikan sandaran untuk menggeser beban pembuktian penguasaan lahan tanpa naskah lengkap?',
      ],
      Susanto: [
        'Dapatkah penerimaan sosial di lingkungan setempat dijadikan penopang fakta penguasaan nyata atas lahan tanpa naskah lengkap?',
        'Dapatkah pengakuan sosial di lingkungan setempat dijadikan sandaran okupasi fisik atas lahan tanpa naskah lengkap?',
      ],
      Suprapti: [
        'Dapatkah penerimaan sosial di lingkungan setempat dijadikan penopang untuk menutup cacat formil ketiadaan naskah lengkap?',
        'Dapatkah pengakuan sosial di lingkungan setempat dijadikan sandaran substansi hak meski ada cacat formil naskah?',
      ],
      Eka: [
        'Dapatkah penerimaan sosial di lingkungan setempat dijadikan penopang perlindungan pihak ketiga atas penguasaan lahan tanpa naskah lengkap?',
        'Dapatkah pengakuan sosial di lingkungan setempat dijadikan sandaran kepentingan pihak ketiga beritikad baik tanpa naskah lengkap?',
      ],
      Jumiati: [
        'Dapatkah penerimaan sosial di lingkungan setempat dijadikan penopang kedudukan di hadapan sistem pendaftaran tanah negara tanpa naskah lengkap?',
        'Dapatkah pengakuan sosial di lingkungan setempat dijadikan sandaran meski data register negara belum lengkap?',
      ],
    },
  },
  {
    id: 30,
    role: 'Kamulyan jagad',
    questions: {
      Edi: [
        'Bagaimana panel hakim menimbang rasa keadilan bila satu pihak menguasai nyata dengan iktikad baik dan pihak lain hanya mengandalkan naskah tanpa penguasaan?',
        'Bagaimana panel hakim mempertimbangkan nilai keadilan bila satu pihak menguasai dengan iktikad baik dan pihak lain hanya mengandalkan naskah tanpa penguasaan?',
      ],
      Ridwan: [
        'Bagaimana panel hakim menimbang rasa keadilan dari segi beban dan kekuatan pembuktian bila satu pihak menguasai nyata dan pihak lain hanya mengandalkan naskah?',
        'Bagaimana panel hakim mempertimbangkan nilai keadilan dalam menentukan siapa yang harus membuktikan lebih berat dalam situasi tersebut?',
      ],
      Susanto: [
        'Bagaimana panel hakim menimbang rasa keadilan bila satu pihak menguasai nyata dan pihak lain hanya mengandalkan naskah tanpa fakta okupasi?',
        'Bagaimana panel hakim mempertimbangkan nilai keadilan dengan memberi bobot pada fakta penguasaan fisik dibanding naskah semata?',
      ],
      Suprapti: [
        'Bagaimana panel hakim menimbang rasa keadilan dengan membedakan cacat formil dan materiil bila satu pihak menguasai nyata dan pihak lain hanya mengandalkan naskah?',
        'Bagaimana panel hakim mempertimbangkan nilai keadilan agar substansi hak tidak dikalahkan oleh sekadar kelengkapan formil naskah?',
      ],
      Eka: [
        'Bagaimana panel hakim menimbang rasa keadilan dengan melindungi pihak ketiga bila satu pihak menguasai nyata dan pihak lain hanya mengandalkan naskah?',
        'Bagaimana panel hakim mempertimbangkan nilai keadilan agar kepentingan pihak ketiga beritikad baik tidak dikorbankan dalam sengketa tersebut?',
      ],
      Jumiati: [
        'Bagaimana panel hakim menimbang rasa keadilan dalam kerangka sistem pendaftaran tanah negara bila satu pihak menguasai nyata dan pihak lain hanya mengandalkan naskah?',
        'Bagaimana panel hakim mempertimbangkan nilai keadilan dengan mengacu pada kekuatan register negara dalam situasi penguasaan versus naskah?',
      ],
    },
  },
];

function generateDuelSets(): PersonSet[] {
  const personQs: Record<string, [Question[], Question[]]> = {};
  for (const p of PERSONS) personQs[p] = [[], []];

  for (const c of clusters) {
    for (const person of PERSONS) {
      const [t0, t1] = c.questions[person];
      personQs[person][0].push({ id: c.id, role: c.role, text: t0 });
      personQs[person][1].push({ id: c.id, role: c.role, text: t1 });
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

export { clusters, PERSONS, PERSON_FOCUS };