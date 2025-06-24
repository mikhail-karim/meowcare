# 🐾 MeowCare – Aplikasi Adopsi & Pelaporan Kucing

**MeowCare** adalah aplikasi mobile berbasis **React Native** yang dikembangkan sebagai proyek akhir untuk mendukung proses **pelaporan kucing terlantar**, **pengajuan adopsi**, serta **penyebaran artikel edukatif** mengenai hewan peliharaan, khususnya kucing. Aplikasi ini juga menerapkan **role-based access**, di mana beberapa fitur hanya dapat diakses oleh **admin**, sementara pengguna biasa memiliki akses terbatas.

---

## 🎯 Rumusan Masalah

Beberapa permasalahan yang mendasari pengembangan aplikasi ini antara lain:

- Tidak adanya sistem terintegrasi untuk **melaporkan kucing terlantar** kepada pihak yang berwenang.
- Proses **adopsi kucing** yang masih dilakukan secara manual dan kurang efisien.
- Keterbatasan informasi dan edukasi terkait perawatan hewan peliharaan, khususnya kucing.
- Minimnya fitur pembeda antara **akses pengguna biasa** dan **akses admin**, yang menyulitkan pengelolaan data dan informasi.

---

## 🎯 Tujuan Pengembangan

Tujuan utama dari aplikasi **MeowCare** adalah:

- Membangun platform digital yang memungkinkan masyarakat untuk **melaporkan kucing terlantar** dengan mudah dan cepat.
- Menyediakan sistem **pengajuan adopsi kucing** secara online dengan proses yang terdokumentasi.
- Menyediakan **konten edukatif** dan informasi kegiatan seputar kucing untuk meningkatkan kepedulian dan pemahaman pengguna.
- Mengimplementasikan **role-based access** untuk memisahkan fitur dan kontrol antara admin dan pengguna biasa.

---

## 🧠 Teknologi yang Digunakan

| Komponen               | Deskripsi                                                       |
|------------------------|-----------------------------------------------------------------|
| `React Native`         | Framework utama untuk membangun aplikasi mobile.                |
| `Laravel`              | Backend RESTful API dan sistem otentikasi menggunakan Sanctum.  |
| `MySQL`                | Database relasional untuk menyimpan data pengguna, artikel, dll.|
| `Express / API`        | Berfungsi sebagai jembatan antara frontend dan database.        |
| `Expo Router`          | Routing dan navigasi dalam aplikasi mobile.                     |
| `Axios`                | Untuk pengambilan data dari backend API.                        |

---

## 👨‍💻 Tim Pengembang

Aplikasi ini dikembangkan oleh:

- Septianto Bagus Hidayatullah
- Mikhail Shams Afzal Karim
- Bahiskara Ananda Arryanto
- Dian Maharani
- Salsa Pramudhita Agustiardani

---

## 📌 Fitur Utama

- 🐱 **Lapor Kucing Terlantar** – Pengguna dapat melaporkan keberadaan kucing yang membutuhkan pertolongan.
- 🏡 **Ajukan Adopsi** – Fitur untuk mengajukan adopsi kucing yang tersedia dalam sistem.
- 📖 **Baca Artikel** – Menyediakan artikel dengan kategori edukasi dan kegiatan.
- 🔐 **Login & Registrasi** – Otentikasi pengguna berbasis Laravel Sanctum.
- 🛠️ **Role Admin** – Admin dapat mengelola data kucing, verifikasi pengajuan adopsi, serta mengelola konten artikel.
- 🧑‍💼 **Profil Pengguna** – Menampilkan informasi akun dan status pengajuan adopsi.

## Cara Menjalankan Melalui Local Server

- Buka 2 terminal bersamaan, untuk server backend dan untuk server front end
- Untuk backend, buka folder backend-lumen dengan prompt : cd backend-lumen
- Jalankan perintah                                      : php -S 0.0.0.0:8000 -t public
- Buka terminal manapun dan jalankan                     : ipconfig
- Salin ip dari IPv4 Address milikmu
- Buka folder meowcare/components, lalu buka file types.ts
- Salin ip sebelumnya ke dalam API_BASE_URL

- Untuk frontend, buka folder root atau meowcare
- Install Expo Go di ponsel jika ingin menguji lewat ponsel
- Jalankan perintah berikut di terminal meowcare        : npx expo start
- Jika tidak berjalan, install librarynya               : npm install
- Salin url exp/ scan barcode/ buka local servernya melalui website kamu