import type { PersonSet } from '../lib/debate';

// Frasa bersama antar peserta (biar terasa mirip):
// kepentingan, tanda bukti, berkas resmi, sistem hukum, majelis,
// sudah terbentuk, akibat hukum, birokrasi, alat bukti, keabsahan

export const pendalamanSets: PersonSet[] = [
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
        { id: 9, role: 'Kamulyan jagad', text: 'Klaim adat yang diposisikan lebih kuat daripada kewajiban pencatatan negara bertentangan dengan prinsip hukum agraria, sehingga tidak dapat diakui.' },
        { id: 8, role: 'Kamulyan jagad', text: 'Klaim adat tanpa pencatatan resmi tidak memiliki kekuatan hukum, sehingga tidak dapat dijadikan dasar kepemilikan dan tidak dapat dipertahankan di pengadilan.' },
        { id: 7, role: 'Kamulyan jagad', text: 'Klaim adat yang tidak memenuhi kewajiban pencatatan negara tidak memiliki kekuatan hukum, sehingga tidak dapat dipertahankan.' },
        { id: 6, role: 'urip kepenak', text: 'Kewajiban pencatatan tanah menjadikan klaim adat tanpa pencatatan kehilangan legitimasi, sehingga tidak dapat dijadikan dasar kepemilikan.' },
        { id: 5, role: 'urip kepenak', text: 'Klaim adat yang bertentangan dengan kepentingan negara dalam pencatatan tanah otomatis gugur, sehingga tidak dapat dipertahankan.' },
        { id: 4, role: 'urip kepenak', text: 'Klaim adat tanpa dukungan register resmi tidak memiliki dasar hukum yang sah, sehingga tidak dapat diakui oleh otoritas.' },
        { id: 3, role: 'duit semilyar', text: 'Klaim pribadi atas tanah yang belum ditetapkan negara batal demi hukum sejak awal, sehingga tidak dapat dipertahankan di pengadilan.' },
        { id: 2, role: 'duit semilyar', text: 'Klaim adat tanpa pencatatan sama dengan penguasaan liar, yang tidak memiliki legitimasi hukum dan tidak dapat dijadikan dasar kepemilikan.' },
        { id: 1, role: 'duit semilyar', text: 'Klaim kepemilikan tanpa dokumen resmi tidak memiliki bukti otentik, sehingga tidak dapat diakui oleh hukum dan tidak memiliki legitimasi.' },
      ],
      // Duel sengit: tujuan agar Jumiati paham pertanyaannya dan dapat menyerang balik lawan
      [
        { id: 1, role: 'instruksi', text: 'Tujuan: sebelum menjawab, ringkas pertanyaan ini dengan kata-kata Anda sendiri supaya majelis yakin Anda paham inti persoalan.' },
        { id: 2, role: 'duit semilyar', text: 'Duel sengit — kepada Ridwan: tunjukkan bukti konkrit mengapa pencatatan negara tidak selalu mengalahkan klaim adat; jelaskan dua situasi di mana adat layak diberi bobot pembuktian lebih kuat.' },
        { id: 3, role: 'urip kepenak', text: 'Duel sengit — kepada Susanto: bantah klaim bahwa penguasaan fisik tanpa pencatatan tidak pernah memiliki legitimasi; sebutkan argumen yuridis yang mendukung pengakuan material.' },
        { id: 4, role: 'Kamulyan jagad', text: 'Duel sengit — kepada Suprapti: jika berkas resmi kosong, bagaimana Anda menyusun rangka pembuktian alternatif yang kuat di muka majelis (alat bukti dan saksi)?' },
        { id: 5, role: 'duit semilyar', text: 'Duel sengit — kepada Eka: jelaskan mekanisme perbaikan administratif yang Anda anggap cukup agar klaim adat tetap dipertimbangkan tanpa membatalkan hak pihak ketiga.' },
        { id: 6, role: 'Kamulyan jagad', text: 'Duel sengit — cross-check: jelaskan secara singkat tiga pertanyaan kritis yang harus Anda tanyakan kepada saksi saat membuktikan klaim adat.' },
      ],
    ],
  },
  {
    person: 'Eka',
    sets: [
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Apakah sistem hukum memberi perlindungan kepada pihak yang sudah melaksanakan kewajibannya meski tanda bukti resmi belum lengkap di hadapan majelis?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Apa fungsi tanda bukti resmi terhadap kepentingan yang secara isi sudah terbentuk sebelum tanda bukti itu dibuat di muka majelis?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Bagaimana sistem hukum menilai pelengkapan berkas resmi yang dilakukan dengan itikad baik pada waktu berikutnya di hadapan majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Sejauh mana jarak waktu antara peristiwa dan pemberian tanda bukti resmi memengaruhi kekuatan alat bukti menurut sistem hukum?' },
        { id: 5, role: 'urip kepenak', text: 'Apakah keterlambatan pemberian tanda bukti resmi menghapus seluruh akibat hukum yang sudah timbul, atau hanya menangguhkan di muka majelis?' },
        { id: 4, role: 'urip kepenak', text: 'Dapatkah pelengkapan berkas resmi kemudian dijadikan alat bukti bahwa hubungan hukum sebelumnya mengandung kekurangan menurut sistem hukum?' },
        { id: 3, role: 'duit semilyar', text: 'Apakah pemberian tanda bukti resmi yang terlambat mengubah sifat hukum dari peristiwa yang sudah terjadi sebelumnya di hadapan majelis?' },
        { id: 2, role: 'duit semilyar', text: 'Apa akibat hukum apabila pemberian tanda bukti resmi baru dilakukan setelah lewat jangka waktu menurut sistem hukum?' },
        { id: 1, role: 'duit semilyar', text: 'Apa konsekuensi hukum kelengkapan berkas resmi yang baru dipenuhi setelah seluruh kewajiban dilaksanakan di muka majelis?' },
      ],
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Apakah pelengkapan berkas resmi kemudian justru memperkuat keabsahan peristiwa yang mendasarinya menurut sistem hukum?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Apa fungsi tanda bukti resmi terhadap kepentingan yang secara materiil sudah terbentuk lebih awal sebelum tanda bukti itu ada?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Bagaimana sistem hukum menilai pelengkapan berkas resmi yang dilakukan pada momen berbeda dari peristiwa pokoknya di hadapan majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Bagaimana sistem hukum memandang alasan di balik pelengkapan berkas resmi yang dilakukan jauh setelah peristiwa di muka majelis?' },
        { id: 5, role: 'urip kepenak', text: 'Apakah keterlambatan pemberian tanda bukti resmi menghilangkan atau mengurangi akibat hukum dari peristiwa sebelumnya?' },
        { id: 4, role: 'urip kepenak', text: 'Dapatkah pelengkapan berkas resmi setelah peristiwa dijadikan alat bukti bahwa peristiwa sebelumnya mengandung kekurangan di hadapan majelis?' },
        { id: 3, role: 'duit semilyar', text: 'Apakah pelengkapan berkas resmi kemudian mengubah isi peristiwa hukum yang sudah terjadi sebelumnya menurut sistem hukum?' },
        { id: 2, role: 'duit semilyar', text: 'Apa akibat hukum dari pemberian tanda bukti resmi yang baru dilakukan setelah melewati batas waktu di muka majelis?' },
        { id: 1, role: 'duit semilyar', text: 'Apa arti yuridis dari pelengkapan berkas resmi yang dilakukan setelah kepentingan para pihak sudah terbentuk menurut sistem hukum?' },
      ],
      // Duel sengit: Eka harus paham lalu menyerang balik
      [
        { id: 1, role: 'instruksi', text: 'Tujuan: ulangi gagasan inti dengan singkat dan sebut dua elemen bukti yang akan Anda utarakan sebelum memasuki duel.' },
        { id: 2, role: 'duit semilyar', text: 'Duel sengit — kepada Ridwan: bagaimanakah Anda menawar bobot pembuktian antara pencatatan formal dan bukti pelaksanaan nyata? Jelaskan satu contoh yuridis dengan argumen kontra.' },
        { id: 3, role: 'urip kepenak', text: 'Duel sengit — kepada Susanto: bantah klaim bahwa tanda bukti resmi selalu sekunder terhadap fakta materiil; tunjukkan batasan situasi di mana berkas resmi mendominasi.' },
        { id: 4, role: 'Kamulyan jagad', text: 'Duel sengit — kepada Jumiati: uraikan strategi membangun bukti alternatif (saksi, korespondensi, saksi ahli) yang sanggup menandingi dokumen formal.' },
        { id: 5, role: 'duit semilyar', text: 'Duel sengit — cross-examination: sebut tiga pertanyaan yang akan Anda ajukan untuk mendestabilisasi klaim lawan tentang kepemilikan tanpa pencatatan.' },
      ],
    ],
  },
  {
    person: 'Suprapti',
    sets: [
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Dapatkah kesalahan data teknis diperbaiki tanpa mengurangi kekuatan hukum berkas resmi yang sudah terbit di hadapan majelis?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Apakah semua kesalahan data membawa akibat hukum yang sama terhadap keabsahan berkas resmi menurut sistem hukum?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Apa landasan aturan penyelesaian proses birokrasi saat kondisi salah satu pihak berubah di muka majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Bagaimana sistem hukum membedakan kesalahan data yang menyentuh isi kepentingan dengan kesalahan birokrasi belaka?' },
        { id: 5, role: 'urip kepenak', text: 'Apakah setiap kesalahan data menghilangkan seluruh kekuatan hukum berkas resmi, atau hanya bagian yang salah di hadapan majelis?' },
        { id: 4, role: 'urip kepenak', text: 'Adakah aturan yang secara eksplisit mewajibkan proses birokrasi dihentikan bila kondisi salah satu pihak berubah menurut sistem hukum?' },
        { id: 3, role: 'duit semilyar', text: 'Apakah berubahnya status hukum salah satu pihak menjadikan seluruh proses birokrasi yang berjalan batal demi hukum?' },
        { id: 2, role: 'duit semilyar', text: 'Apa akibat hukum dari ketidakcocokan data subjek atau objek terhadap keabsahan berkas resmi yang sudah terbit di muka majelis?' },
        { id: 1, role: 'duit semilyar', text: 'Apakah berubahnya kondisi salah satu pihak dengan sendirinya menghentikan proses birokrasi pengalihan kepentingan menurut sistem hukum?' },
      ],
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Mekanisme hukum apa yang tersedia untuk memperbaiki kesalahan data tanpa membatalkan berkas resmi secara keseluruhan di muka majelis?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Apakah kesalahan uraian objek yang tidak mengubah isi kepentingan tetap membatalkan kekuatan hukum berkas resmi menurut sistem hukum?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Bagaimana aturan mengatur penyelesaian proses birokrasi apabila terjadi perubahan tak terduga pada salah satu pihak di hadapan majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Bagaimana sistem hukum memperlakukan kesalahan data yang baru diketahui setelah berkas resmi dipakai pihak ketiga?' },
        { id: 5, role: 'urip kepenak', text: 'Apakah kesalahan data yang tidak menyentuh isi kepentingan cukup menjadi alasan membatalkan berkas resmi di muka majelis?' },
        { id: 4, role: 'urip kepenak', text: 'Dapatkah proses birokrasi dilanjutkan oleh pihak pengganti apabila pihak semula berhalangan menurut sistem hukum?' },
        { id: 3, role: 'duit semilyar', text: 'Apakah berubahnya kondisi salah satu pihak menghalangi pihak lain melanjutkan penyelesaian proses birokrasi di hadapan majelis?' },
        { id: 2, role: 'duit semilyar', text: 'Apa akibat hukum apabila terdapat kesalahan identitas pihak atau uraian objek dalam berkas resmi menurut sistem hukum?' },
        { id: 1, role: 'duit semilyar', text: 'Bagaimana sistem hukum memandang kelanjutan proses birokrasi apabila salah satu pihak mengalami perubahan status di muka majelis?' },
      ],
      // Duel sengit: Suprapti harus paham dan memimpin kontra-argumen administratif
      [
        { id: 1, role: 'instruksi', text: 'Tujuan: jelaskan secara singkat langkah administratif yang akan Anda tuntut agar majelis memahami solusi korektif tanpa merusak kepastian hukum.' },
        { id: 2, role: 'duit semilyar', text: 'Duel sengit — kepada Eka: jika data administratif saling bertentangan, bagaimana Anda menimbang prioritas antar dokumen dan bukti material?' },
        { id: 3, role: 'urip kepenak', text: 'Duel sengit — kepada Ridwan: jelaskan prosedur perbaikan yang perlu dilakukan agar klaim tidak hilang tetapi juga tidak merugikan pihak yang sudah memiliki berkas.' },
        { id: 4, role: 'Kamulyan jagad', text: 'Duel sengit — kepada Jumiati: apakah ada kondisi di mana koreksi administratif harus diutamakan demi kepastian hukum; jelaskan dengan contoh.' },
        { id: 5, role: 'duit semilyar', text: 'Duel sengit — cross-examination: sebut tiga bukti yang menurut Anda paling menentukan saat memperbaiki kesalahan uraian objek.' },
      ],
    ],
  },
  {
    person: 'Susanto',
    sets: [
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Apakah pelaksanaan nyata kesepakatan dapat menggantikan kedudukan berkas resmi sebagai alat bukti di muka majelis?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Sejauh mana akibat hukum kekurangan awal memengaruhi keabsahan perbuatan yang mengikutinya menurut sistem hukum?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Dengan jenis alat bukti apa keberadaan kesepakatan lisan dapat ditunjukkan di muka majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Bagaimana sistem hukum memandang ketiadaan formalitas tertentu terhadap keabsahan kesepakatan yang sudah dilaksanakan?' },
        { id: 5, role: 'urip kepenak', text: 'Apakah setiap kekurangan pada perbuatan awal selalu menjalar dan membatalkan perbuatan yang mengikutinya menurut sistem hukum?' },
        { id: 4, role: 'urip kepenak', text: 'Apakah ketiadaan satu jenis berkas resmi cukup menjadi alasan tunggal untuk menyatakan kesepakatan tidak pernah ada di hadapan majelis?' },
        { id: 3, role: 'duit semilyar', text: 'Dapatkah suatu kejadian dianggap tidak pernah berlangsung semata-mata karena tidak dituangkan dalam berkas resmi?' },
        { id: 2, role: 'duit semilyar', text: 'Bagaimana akibat hukum dari kekurangan yang melekat pada perbuatan pertama terhadap rangkaian perbuatan sesudahnya di muka majelis?' },
        { id: 1, role: 'duit semilyar', text: 'Apakah keberadaan suatu kesepakatan mutlak bergantung pada tersedianya berkas resmi tertentu menurut sistem hukum?' },
      ],
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Apakah itikad baik para pihak dalam melaksanakan kesepakatan dapat menyembuhkan kekurangan formalitas menurut sistem hukum?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Sejauh mana akibat hukum suatu kekurangan awal menjangkau perbuatan sesudahnya di hadapan majelis?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Dengan alat bukti apa keberadaan kesepakatan yang tidak dituangkan dalam berkas resmi dapat ditunjukkan secara sah di muka majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Apakah sistem hukum membenarkan pembatalan kesepakatan yang sudah dilaksanakan sepenuhnya semata-mata karena formalitas kurang?' },
        { id: 5, role: 'urip kepenak', text: 'Apakah kekurangan perbuatan awal selalu berpengaruh langsung terhadap keabsahan perbuatan berikutnya menurut sistem hukum?' },
        { id: 4, role: 'urip kepenak', text: 'Dapatkah ketiadaan satu bentuk berkas resmi dijadikan landasan membatalkan seluruh rangkaian kesepakatan di hadapan majelis?' },
        { id: 3, role: 'duit semilyar', text: 'Dalam situasi apa ketiadaan formalitas tertentu tidak menghilangkan keabsahan kesepakatan yang sudah dilaksanakan?' },
        { id: 2, role: 'duit semilyar', text: 'Bagaimana sistem hukum menilai akibat hukum kekurangan perbuatan pertama terhadap perbuatan lanjutan di muka majelis?' },
        { id: 1, role: 'duit semilyar', text: 'Apakah ketiadaan berkas resmi selalu meniadakan perbuatan hukum yang sudah dilaksanakan menurut sistem hukum?' },
      ],
      // Duel sengit: Susanto harus paham esensi bukti non-formal
      [
        { id: 1, role: 'instruksi', text: 'Tujuan: jelaskan dua garis bukti non-formal (pelaksanaan nyata, saksi) yang Anda akan pakai dan mengapa itu meyakinkan.' },
        { id: 2, role: 'duit semilyar', text: 'Duel sengit — kepada Eka: jika klaim Anda bertentangan dengan catatan resmi, bagaimana Anda rangkai narasi faktual yang tahan uji di majelis?' },
        { id: 3, role: 'urip kepenak', text: 'Duel sengit — kepada Ridwan: sebutkan kelemahan paling lemah dari bukti administratif yang dapat Anda ekspos untuk menempatkan bukti non-formal di depan.' },
        { id: 4, role: 'Kamulyan jagad', text: 'Duel sengit — kepada Jumiati: bagaimana Anda menilai kredibilitas saksi dan mengaitkannya dengan bukti-bukti lain secara sistematis?' },
        { id: 5, role: 'duit semilyar', text: 'Duel sengit — cross-challenge: sebut dua celah hukum yang sering dieksploitasi untuk menolak klaim tanpa pencatatan, lalu bagaimana Anda menutupnya.' },
      ],
    ],
  },
  {
    person: 'Ridwan',
    sets: [
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Apabila fakta materiil bertolak belakang dengan catatan birokrasi, mana yang seharusnya dimenangkan majelis menurut sistem hukum?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Apa fungsi hukum bukti birokrasi dalam rangkaian pembuktian kepentingan di muka majelis?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Apakah bukti birokrasi menciptakan kepentingan baru, atau hanya meneguhkan kepentingan yang sudah terbentuk di muka majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Apakah bukti birokrasi yang terbit kemudian mampu membatalkan kepentingan yang lahir lewat perbuatan menurut sistem hukum?' },
        { id: 5, role: 'urip kepenak', text: 'Dapatkah seseorang menunjukkan kepentingan yang sudah terbentuk tanpa bergantung pada berkas resmi yang terbit kemudian?' },
        { id: 4, role: 'urip kepenak', text: 'Bagaimana posisi bukti birokrasi terhadap kepentingan yang secara isi sudah terbentuk lebih awal di hadapan majelis?' },
        { id: 3, role: 'duit semilyar', text: 'Bagaimana seharusnya majelis memperlakukan kepentingan yang secara isi sudah nyata namun belum memiliki tanda bukti resmi?' },
        { id: 2, role: 'duit semilyar', text: 'Apakah keberadaan kepentingan selalu bergantung pada diterbitkannya berkas resmi oleh pejabat menurut sistem hukum?' },
        { id: 1, role: 'duit semilyar', text: 'Pada tahap mana kepentingan memperoleh pengakuan di muka majelis — sejak perbuatannya atau sejak diberi tanda bukti resmi?' },
      ],
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Apakah bukti birokrasi menciptakan kepentingan baru, atau hanya meneguhkan kepentingan yang sudah terbentuk di muka majelis?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Apa fungsi hukum bukti birokrasi dalam rangkaian pembuktian kepentingan di muka majelis?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Apakah bukti birokrasi menciptakan kepentingan baru, atau hanya meneguhkan kepentingan yang sudah terbentuk di muka majelis?' },
        { id: 6, role: 'urip kepenak', text: 'Apakah bukti birokrasi yang terbit kemudian mampu membatalkan kepentingan yang lahir lewat perbuatan menurut sistem hukum?' },
        { id: 5, role: 'urip kepenak', text: 'Dapatkah seseorang menunjukkan kepentingan yang sudah terbentuk tanpa bergantung pada berkas resmi yang terbit kemudian?' },
        { id: 4, role: 'urip kepenak', text: 'Bagaimana posisi bukti birokrasi terhadap kepentingan yang secara isi sudah terbentuk lebih awal di hadapan majelis?' },
        { id: 3, role: 'duit semilyar', text: 'Bagaimana seharusnya majelis memperlakukan kepentingan yang secara isi sudah nyata namun belum memiliki tanda bukti resmi?' },
        { id: 2, role: 'duit semilyar', text: 'Apakah keberadaan kepentingan selalu bergantung pada diterbitkannya berkas resmi oleh pejabat menurut sistem hukum?' },
        { id: 1, role: 'duit semilyar', text: 'Pada tahap mana kepentingan memperoleh pengakuan di muka majelis — sejak perbuatannya atau sejak diberi tanda bukti resmi?' },
      ],
      // Duel sengit: Ridwan harus paham garis batas birokrasi vs materiil
      [
        { id: 1, role: 'instruksi', text: 'Tujuan: rumuskan dua kriteria yang akan Anda pakai untuk memutuskan prioritas antara dokumen birokrasi dan bukti materiil.' },
        { id: 2, role: 'duit semilyar', text: 'Duel sengit — kepada Susanto: bagaimana Anda menimbang koreksi administratif terhadap dokumen lama yang berkontradiksi dengan fakta lapangan?' },
        { id: 3, role: 'urip kepenak', text: 'Duel sengit — kepada Eka: jelaskan metode pembobotan bukti materiil agar majelis dapat mengikuti logika yuridis Anda.' },
        { id: 4, role: 'Kamulyan jagad', text: 'Duel sengit — kepada Jumiati: jika bukti administratif terlambat muncul, bagaimana Anda menilai itikad baik dan efeknya terhadap posisi kepentingan?' },
        { id: 5, role: 'duit semilyar', text: 'Duel sengit — cross-probe: sebut dua preseden hukum (atau analogi) yang akan Anda pakai untuk membela posisi bahwa fakta materiil dapat mengalahkan catatan birokrasi.' },
      ],
    ],
  },
  {
    person: 'Edi',
    sets: [
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Sejauh mana urutan waktu lahirnya tuntutan memengaruhi posisi kepentingan itu di hadapan majelis?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Landasan aturan apa yang dipakai majelis saat menimbang tuntutan yang muncul pada momen yang tidak sama?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Apakah tindakan pejabat memberi tanda bukti menciptakan kepentingan baru, atau sekadar meneguhkan kepentingan yang sudah terbentuk?' },
        { id: 6, role: 'urip kepenak', text: 'Apakah kelengkapan birokrasi menjadi syarat mutlak sahnya pengalihan kepentingan, atau hanya bersifat menegaskan menurut sistem hukum?' },
        { id: 5, role: 'urip kepenak', text: 'Bagaimana cara majelis menimbang daya alat bukti bila kedua pihak mengajukan bukti yang saling bertolak belakang?' },
        { id: 4, role: 'urip kepenak', text: 'Sebutkan aturan yang menyatakan keteledoran birokrasi menghapus kepentingan yang sudah terbentuk!' },
        { id: 3, role: 'duit semilyar', text: 'Dengan cara apa saudara memisahkan kekurangan birokrasi dari kekurangan yang menyentuh isi kepentingan di hadapan majelis?' },
        { id: 2, role: 'duit semilyar', text: 'Apakah keteledoran mengurus birokrasi dengan sendirinya menghilangkan kepentingan yang sudah terbentuk?' },
        { id: 1, role: 'duit semilyar', text: 'Bila beberapa pihak mengajukan tuntutan atas tanah yang identik, ukuran apa yang dipakai majelis untuk memilih kepentingan yang paling meyakinkan?' },
      ],
      [
        { id: 9, role: 'Kamulyan jagad', text: 'Bagaimana sistem hukum membedakan kepentingan yang lahir lewat perbuatan nyata dengan yang lahir lewat tanda bukti resmi semata?' },
        { id: 8, role: 'Kamulyan jagad', text: 'Apakah urutan waktu lahirnya tuntutan punya arti yuridis bagi kekuatan alat bukti di muka majelis?' },
        { id: 7, role: 'Kamulyan jagad', text: 'Segi hukum mana yang menjadi fokus utama saat majelis menimbang tuntutan yang lahir pada kurun yang tidak sama?' },
        { id: 6, role: 'urip kepenak', text: 'Apakah ketiadaan kelengkapan birokrasi cukup untuk membatalkan pengalihan kepentingan yang sudah berlangsung?' },
        { id: 5, role: 'urip kepenak', text: 'Mengacu pada aturan mana suatu alat bukti dinilai lebih meyakinkan dibanding alat bukti lain atas benda yang identik?' },
        { id: 4, role: 'urip kepenak', text: 'Faktor apa yang membuat satu tuntutan memiliki daya alat bukti lebih tinggi dibanding tuntutan milik lawan di muka majelis?' },
        { id: 3, role: 'duit semilyar', text: 'Dapatkah tertundanya urusan birokrasi dijadikan alasan bahwa kepentingan tidak pernah terbentuk menurut sistem hukum?' },
        { id: 2, role: 'duit semilyar', text: 'Faktor isi kepentingan apa yang membedakan kekuatan alat bukti antar tuntutan yang lahir pada masa yang tidak sama?' },
        { id: 1, role: 'duit semilyar', text: 'Bila tiap pihak mengajukan tuntutan atas benda yang identik, segi hukum mana yang wajib diperiksa lebih dulu oleh majelis?' },
      ],
    ],
  },
];

// Helper utilities for testing / UI integration
export type QuestionItem = {
  setIndex: number;
  id: number;
  role: string;
  text: string;
};

// Kembalikan semua pertanyaan (diratakan) milik seorang peserta
export function getQuestionsForPerson(person: string): QuestionItem[] {
  const p = pendalamanSets.find((ps) => ps.person.toLowerCase() === person.toLowerCase());
  if (!p) return [];
  return p.sets.flatMap((set, setIndex) =>
    set.map((q) => ({ setIndex, id: q.id, role: q.role, text: q.text }))
  );
}

// Simulasi jawaban otomatis untuk pengujian: setiap pertanyaan akan mendapat jawaban placeholder
export function simulateAnswersForPerson(person: string) {
  const qs = getQuestionsForPerson(person);
  return qs.map((q) => ({
    ...q,
    answer: `(${person}) Ringkasan pemahaman: "${q.text.length > 120 ? q.text.slice(0, 120) + '...' : q.text}". Jawaban (contoh): Saya akan menekankan titik bukti materiil dan kronologi untuk mendukung klaim.`,
  }));
}
