# Narator Sidang Tanah — Offline PWA

Aplikasi Progressive Web App (PWA) yang bisa dijalankan **100% offline** di Android setelah di-install.

---

## Fitur

- ✅ Fully offline setelah instalasi pertama
- ✅ Web Speech API (narasi suara Bahasa Indonesia)
- ✅ LocalStorage untuk skor & saldo (persisten)
- ✅ Login gate (kode default: `sidang2026`)
- ✅ Mode Prolog & Mode Formal/Sidang
- ✅ Timer menjawab 30 detik + hukuman/hadiah
- ✅ Installable ke Home Screen Android (seperti aplikasi native)

---

## 1. Persiapan (satu kali)

Pastikan sudah terinstall:

- **Node.js** versi 18 atau lebih baru → https://nodejs.org
- **npm** (sudah termasuk Node.js)

Cek versi:
```bash
node -v
npm -v
```

---

## 2. Install Dependensi

```bash
cd narator-pwa
npm install
```

---

## 3. Jalankan Mode Development

```bash
npm run dev
```

Buka di browser: http://localhost:5173

> Untuk test di HP yang sama jaringan WiFi:
> 1. Jalankan `npm run dev -- --host`
> 2. Buka `http://IP-KOMPUTER:5173` di Chrome Android

---

## 4. Build Production (Offline Ready)

```bash
npm run build
```

Hasil build ada di folder **`dist/`**.

Folder ini sudah berisi:
- `index.html`
- aset JS/CSS
- `manifest.json`
- `sw.js` (Service Worker)
- icons

---

## 5. Cara Install PWA Offline di Android

### Cara A — Paling Mudah (via local server)

1. Setelah `npm run build`, jalankan:
   ```bash
   npx serve dist
   ```
2. Pastikan HP dan komputer terhubung WiFi yang sama.
3. Buka Chrome di Android → ketik alamat yang muncul (contoh: `http://192.168.1.5:3000`)
4. Tunggu sampai halaman terbuka.
5. Di Chrome Android tekan menu **⋮** → **Install app** / **Add to Home screen** / **Installasi aplikasi**.
6. Konfirmasi instalasi.
7. Aplikasi muncul di Home Screen seperti app biasa.
8. Setelah ter-install, **bisa dibuka tanpa internet**.

### Cara B — Copy folder dist ke HP (tanpa server)

1. Copy seluruh isi folder `dist/` ke penyimpanan internal HP (misalnya folder `Download/narator`).
2. Install aplikasi file manager yang mendukung buka HTML lokal, atau gunakan:
   - **Termux** + `python -m http.server` di folder dist
   - Atau aplikasi **HTTP Server** dari Play Store
3. Buka alamat `http://localhost:PORT` di Chrome Android.
4. Install ke Home Screen seperti Cara A.

### Cara C — Host di GitHub Pages / Netlify / Vercel (sekali online)

1. Upload isi folder `dist/` ke hosting statis.
2. Buka URL-nya di Chrome Android.
3. Install PWA.
4. Setelah ter-install, Service Worker menyimpan semua file → **bisa offline selamanya**.

---

## 6. Verifikasi Offline

Setelah ter-install:

1. Matikan WiFi & Data seluler.
2. Buka aplikasi dari Home Screen.
3. Aplikasi harus tetap terbuka dan berfungsi (narasi suara, skor, dll).

---

## 7. Kode Akses

Default: **`sidang2026`**

Ubah di file:
```
src/components/LoginGate.tsx
```
Cari konstanta `ACCESS_CODE`.

---

## 8. Ganti Data Pertanyaan

Saat ini data masih sample. Ganti isi file:

```
src/data/questions.ts
```

dengan data asli dari proyekmu (`getAllQuestions`, `pendalamanSets`, `sidangNyataSets`, dll).

Setelah diganti, jalankan lagi:
```bash
npm run build
```

---

## Struktur Folder Penting

```
narator-pwa/
├── public/
│   ├── manifest.json      ← konfigurasi PWA
│   ├── sw.js              ← Service Worker (cache offline)
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── data/questions.ts
│   └── hooks/useSpeech.ts
├── dist/                  ← hasil build (yang di-install)
├── package.json
└── vite.config.ts
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Tombol Install tidak muncul | Pastikan pakai **Chrome Android**, bukan browser lain. Harus HTTPS atau localhost. |
| Suara tidak keluar | Pastikan volume media HP tidak mute. Chrome butuh interaksi user dulu (klik tombol Mulai). |
| Offline tidak jalan | Pastikan sudah **Install app**, bukan cuma "Add to Home screen" biasa. Cek di `chrome://serviceworker-internals` |
| Build error | Hapus `node_modules` + `package-lock.json`, lalu `npm install` ulang. |
| Skor hilang | Jangan clear data aplikasi / clear storage di Chrome. |

---

## Perintah Cepat

```bash
# Development
npm run dev

# Build offline
npm run build

# Preview hasil build
npm run preview

# Serve dist agar bisa di-install dari HP
npx serve dist
```

---

**Siap digunakan offline di Android setelah di-install.**
