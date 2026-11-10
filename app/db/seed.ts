import { count } from "drizzle-orm";
import type { AppDatabase } from "~/db";
import {
  faqs,
  mediaAssets,
  packageAddons,
  packageCategories,
  packageFeatures,
  packages,
  projects,
  siteSettings,
  skills,
  testimonials,
} from "~/db/schema";

const SEED_TIMESTAMP = "2026-11-06T09:00:00+07:00";

export const INITIAL_ABOUT_PARAGRAPHS = [
  "Saya Tegar, seorang Full-Stack Developer yang berfokus membangun produk web fungsional dari tahap perancangan antarmuka, pemodelan database, hingga rilis ke jaringan cloud. Setiap proyek dikerjakan dengan kode yang bersih, struktur yang mudah dipelihara, serta alur penggunaan yang langsung dipahami oleh tim operasional klien maupun pengguna akhir.",
  "Bagi sekolah dan yayasan, ketiadaan sistem PPDB yang stabil sering menimbulkan kepanikan saat masa penerimaan siswa baru tiba. Saya menghadirkan solusi sistem pendaftaran yang siap menampung lonjakan berkas, verifikasi otomatis, hingga pengumuman kelulusan berbasis nomor peserta dengan antarmuka yang ramah bagi orang tua murid.",
  "Sementara bagi pemilik usaha dan instansi, website bukan sekadar brosur digital melainkan sarana konversi langsung ke WhatsApp atau sistem internal. Setiap baris kode dioptimalkan untuk kecepatan muat instan, keamanan sertifikat cloud, dan kemudahan pengelolaan konten tanpa perlu keahlian koding.",
].join("\n\n");

export async function ensureDatabaseSeeded(db: AppDatabase): Promise<void> {
  const existing = await db
    .select({ total: count() })
    .from(siteSettings);

  if ((existing[0]?.total ?? 0) > 0) {
    return;
  }

  await db.batch([
    db.insert(siteSettings).values({
      id: 1,
      heroHeadline:
        "Membangun website & sistem web yang rapi, cepat, dan siap dipakai kerja nyata.",
      aboutTitle: "Tentang Saya",
      aboutBody: INITIAL_ABOUT_PARAGRAPHS,
      whatsappNumber: "6285196802314",
      contactEmail: "halo@tegardev.com",
      githubUrl: "https://github.com/tgrf-v/",
      linkedinUrl: "https://www.linkedin.com/in/tegar-rifa-i-a68757412/",
      ctaHeadline:
        "Siap membangun website atau sistem untuk instansi dan bisnis Anda?",
      ctaSubtext:
        "Ceritakan kebutuhan fitur, target jadwal rilis, atau paket yang diminati untuk mendapatkan rincian ruang lingkup yang jelas.",
      updatedAt: SEED_TIMESTAMP,
    }),

    db.insert(skills).values([
      {
        id: 1,
        groupName: "Frontend & Antarmuka",
        itemsJson: JSON.stringify([
          "React 19",
          "React Router v8",
          "TypeScript",
          "Tailwind CSS v4",
          "shadcn/ui",
          "HTML & CSS Modern",
        ]),
        sortOrder: 1,
      },
      {
        id: 2,
        groupName: "Backend & Layanan API",
        itemsJson: JSON.stringify([
          "Cloudflare Workers",
          "Node.js",
          "Hono",
          "REST API",
          "Integrasi Webhook",
          "Autentikasi & Keamanan",
        ]),
        sortOrder: 2,
      },
      {
        id: 3,
        groupName: "Database & Penyimpanan",
        itemsJson: JSON.stringify([
          "Cloudflare D1",
          "PostgreSQL",
          "SQLite",
          "Drizzle ORM",
          "Cloudflare R2",
          "Optimasi Query",
        ]),
        sortOrder: 3,
      },
      {
        id: 4,
        groupName: "Infrastruktur & Rilis",
        itemsJson: JSON.stringify([
          "Cloudflare Edge",
          "Zero Trust Access",
          "Git & Otomasi Rilis",
          "Docker",
          "Linux Server",
          "Audit Core Web Vitals",
        ]),
        sortOrder: 4,
      },
    ]),

    db.insert(mediaAssets).values([
      {
        key: "preview-ppdb.svg",
        filename: "preview-ppdb.svg",
        url: "/media/preview-ppdb.svg",
        mimeType: "image/svg+xml",
        sizeBytes: 4120,
        width: 960,
        height: 600,
        createdAt: SEED_TIMESTAMP,
      },
      {
        key: "preview-sekolah.svg",
        filename: "preview-sekolah.svg",
        url: "/media/preview-sekolah.svg",
        mimeType: "image/svg+xml",
        sizeBytes: 3890,
        width: 960,
        height: 600,
        createdAt: SEED_TIMESTAMP,
      },
      {
        key: "preview-niaga.svg",
        filename: "preview-niaga.svg",
        url: "/media/preview-niaga.svg",
        mimeType: "image/svg+xml",
        sizeBytes: 3940,
        width: 960,
        height: 600,
        createdAt: SEED_TIMESTAMP,
      },
    ]),

    db.insert(projects).values([
      {
        id: 1,
        title: "Portal Sistem PPDB Terpadu",
        slug: "portal-sistem-ppdb-terpadu",
        summary:
          "Platform penerimaan peserta didik baru daring dengan pendaftaran multi-jalur, unggah berkas persyaratan ke cloud storage, panel verifikasi panitia secara langsung, pengaturan kuota otomatis, cetak bukti pendaftaran, serta halaman pengumuman seleksi.",
        imageUrl: "/media/preview-ppdb.svg",
        imageAlt:
          "Pratinjau antarmuka dashboard dan alur seleksi Portal Sistem PPDB Terpadu",
        isPublished: true,
        sortOrder: 1,
        createdAt: SEED_TIMESTAMP,
        updatedAt: SEED_TIMESTAMP,
      },
      {
        id: 2,
        title: "Portal Resmi & Direktori Sekolah",
        slug: "portal-resmi-direktori-sekolah",
        summary:
          "Website profil institusi pendidikan yang memuat informasi akademik, visi & misi, direktori guru & tenaga kependidikan, publikasi berita kegiatan, serta halaman pengelolaan konten mandiri bagi staf tata usaha.",
        imageUrl: "/media/preview-sekolah.svg",
        imageAlt:
          "Pratinjau tata letak halaman Portal Resmi dan Direktori Sekolah",
        isPublished: true,
        sortOrder: 2,
        createdAt: SEED_TIMESTAMP,
        updatedAt: SEED_TIMESTAMP,
      },
      {
        id: 3,
        title: "Sistem Katalog & Operasional Niaga",
        slug: "sistem-katalog-operasional-niaga",
        summary:
          "Aplikasi web pengelolaan katalog produk, pemantauan stok varian lintas gudang, rekap pesanan pelanggan terstruktur, dan integrasi pembayaran daring untuk mempercepat pencatatan transaksi harian pelaku usaha.",
        imageUrl: "/media/preview-niaga.svg",
        imageAlt:
          "Pratinjau antarmuka katalog produk dan ringkasan stok operasional niaga",
        isPublished: true,
        sortOrder: 3,
        createdAt: SEED_TIMESTAMP,
        updatedAt: SEED_TIMESTAMP,
      },
    ]),

    db.insert(packageCategories).values([
      {
        id: 1,
        name: "Pendidikan & Instansi",
        slug: "pendidikan-instansi",
        sortOrder: 1,
      },
      {
        id: 2,
        name: "Bisnis & UMKM",
        slug: "bisnis-umkm",
        sortOrder: 2,
      },
      {
        id: 3,
        name: "Sistem Custom",
        slug: "sistem-custom",
        sortOrder: 3,
      },
    ]),

    db.insert(packages).values([
      {
        id: 1,
        categoryId: 1,
        name: "Website Profil Sekolah",
        slug: "website-profil-sekolah",
        tagline:
          "Portal informasi resmi sekolah yang rapi, cepat diakses wali murid, dan mudah diperbarui staf tata usaha.",
        startingPrice: null,
        priceLabelOverride: "Mulai Rp X.XXX.XXX",
        estimatedDuration: "7–10 hari kerja",
        renewalNote:
          "Perpanjangan domain .sch.id & layanan server tahun ke-2 mulai Rp X.XXX.XXX/tahun.",
        isHighlighted: false,
        isPublished: true,
        sortOrder: 1,
        updatedAt: SEED_TIMESTAMP,
      },
      {
        id: 2,
        categoryId: 1,
        name: "Sistem PPDB Online",
        slug: "sistem-ppdb-online",
        tagline:
          "Sistem pendaftaran siswa baru daring dari pengisian formulir, verifikasi berkas panitia, hingga pengumuman kelulusan.",
        startingPrice: null,
        priceLabelOverride: "Mulai Rp X.XXX.XXX",
        estimatedDuration: "14–21 hari kerja",
        renewalNote:
          "Perpanjangan server & pemeliharaan periode PPDB tahun berikutnya mulai Rp X.XXX.XXX/tahun.",
        isHighlighted: true,
        isPublished: true,
        sortOrder: 2,
        updatedAt: SEED_TIMESTAMP,
      },
      {
        id: 3,
        categoryId: 2,
        name: "Landing Page",
        slug: "landing-page",
        tagline:
          "Satu halaman promosi terfokus untuk mengarahkan pengunjung menjadi prospek yang langsung menghubungi tim Anda.",
        startingPrice: null,
        priceLabelOverride: "Mulai Rp X.XXX.XXX",
        estimatedDuration: "3–5 hari kerja",
        renewalNote:
          "Perpanjangan domain & layanan server tahun ke-2 mulai Rp X.XXX.XXX/tahun.",
        isHighlighted: false,
        isPublished: true,
        sortOrder: 1,
        updatedAt: SEED_TIMESTAMP,
      },
      {
        id: 4,
        categoryId: 2,
        name: "Website Company Profile",
        slug: "website-company-profile",
        tagline:
          "Profil resmi perusahaan multi-bagian untuk membangun kepercayaan mitra bisnis, tender, dan calon pelanggan.",
        startingPrice: null,
        priceLabelOverride: "Mulai Rp X.XXX.XXX",
        estimatedDuration: "7–12 hari kerja",
        renewalNote:
          "Perpanjangan domain resmi & server tahun ke-2 mulai Rp X.XXX.XXX/tahun.",
        isHighlighted: true,
        isPublished: true,
        sortOrder: 2,
        updatedAt: SEED_TIMESTAMP,
      },
      {
        id: 5,
        categoryId: 2,
        name: "Katalog & Toko Online",
        slug: "katalog-toko-online",
        tagline:
          "Etalase produk digital lengkap dengan pengelolaan stok varian dan alur pemesanan yang praktis bagi pembeli.",
        startingPrice: null,
        priceLabelOverride: "Mulai Rp X.XXX.XXX",
        estimatedDuration: "12–18 hari kerja",
        renewalNote:
          "Perpanjangan domain & layanan server tahun ke-2 mulai Rp X.XXX.XXX/tahun.",
        isHighlighted: false,
        isPublished: true,
        sortOrder: 3,
        updatedAt: SEED_TIMESTAMP,
      },
      {
        id: 6,
        categoryId: 3,
        name: "Aplikasi Web Custom",
        slug: "aplikasi-web-custom",
        tagline:
          "Pengembangan sistem informasi internal, portal operasional, atau produk SaaS sesuai alur bisnis spesifik Anda.",
        startingPrice: null,
        priceLabelOverride: "Mulai Rp X.XXX.XXX",
        estimatedDuration: "Sesuai cakupan modul",
        renewalNote:
          "Dapat dipasang langsung pada akun infrastruktur cloud milik klien atau dikelola bersama.",
        isHighlighted: true,
        isPublished: true,
        sortOrder: 1,
        updatedAt: SEED_TIMESTAMP,
      },
    ]),

    db.insert(packageFeatures).values([
      { id: 101, packageId: 1, featureText: "Profil & Visi Misi", tooltip: "Halaman profil sekolah, sejarah institusi, serta visi & misi resmi", sortOrder: 1 },
      { id: 102, packageId: 1, featureText: "Direktori Guru & Staf", tooltip: "Daftar guru dan tenaga kependidikan lengkap dengan jabatan", sortOrder: 2 },
      { id: 103, packageId: 1, featureText: "Publikasi Berita & Agenda", tooltip: "Portal berita kegiatan, kalender agenda, dan pengumuman resmi", sortOrder: 3 },
      { id: 104, packageId: 1, featureText: "Galeri Foto & Fasilitas", tooltip: "Dokumentasi kegiatan dan fasilitas sarana prasarana sekolah", sortOrder: 4 },
      { id: 105, packageId: 1, featureText: "Dashboard Admin Mandiri", tooltip: "Panel pengelolaan konten berbahasa Indonesia yang mudah digunakan tata usaha", sortOrder: 5 },
      { id: 106, packageId: 1, featureText: "Domain & Server 1 Tahun", tooltip: "Termasuk domain resmi .sch.id dan cloud hosting tahun pertama", sortOrder: 6 },

      { id: 107, packageId: 2, featureText: "Formulir Pendaftaran Responsif", tooltip: "Formulir pendaftaran bertahap yang nyaman diisi lewat ponsel para pendaftar", sortOrder: 1 },
      { id: 108, packageId: 2, featureText: "Unggah Berkas Persyaratan", tooltip: "Pengunggahan digital untuk KK, akta lahir, rapor, dan piagam prestasi", sortOrder: 2 },
      { id: 109, packageId: 2, featureText: "Manajemen Jalur & Kuota", tooltip: "Pengaturan gelombang pendaftaran, jalur zonasi/prestasi, dan kuota penerimaan", sortOrder: 3 },
      { id: 110, packageId: 2, featureText: "Cetak Bukti Pendaftaran", tooltip: "Cetak kartu tanda bukti pendaftaran otomatis dalam format PDF", sortOrder: 4 },
      { id: 111, packageId: 2, featureText: "Dashboard Verifikasi Panitia", tooltip: "Panel pemeriksaan berkas dan validasi kelengkapan berkas calon siswa", sortOrder: 5 },
      { id: 112, packageId: 2, featureText: "Pengumuman Kelulusan Mandiri", tooltip: "Pengecekan status seleksi mandiri berbasis nomor pendaftaran peserta", sortOrder: 6 },
      { id: 113, packageId: 2, featureText: "Ekspor Rekap Excel", tooltip: "Ekspor rekapitulasi data pendaftar lengkap ke format spreadsheet", sortOrder: 7 },

      { id: 114, packageId: 3, featureText: "Desain Fokus Konversi", tooltip: "Struktur satu halaman penuh yang dirancang khusus untuk memicu respon pengunjung", sortOrder: 1 },
      { id: 115, packageId: 3, featureText: "Tombol Chat WhatsApp", tooltip: "Tautan konversi langsung ke WhatsApp dengan draf pesan otomatis", sortOrder: 2 },
      { id: 116, packageId: 3, featureText: "Tampilan Responsif Prima", tooltip: "Optimal diakses melalui layar ponsel, tablet, maupun komputer", sortOrder: 3 },
      { id: 117, packageId: 3, featureText: "Optimasi Muat Cepat", tooltip: "Kode ringan dengan performa Core Web Vitals tinggi dan struktur SEO dasar", sortOrder: 4 },
      { id: 118, packageId: 3, featureText: "Domain Resmi 1 Tahun", tooltip: "Termasuk domain resmi .com atau .id aktif untuk tahun pertama", sortOrder: 5 },

      { id: 119, packageId: 4, featureText: "Struktur Halaman Lengkap", tooltip: "Profil bisnis, portofolio proyek, katalog layanan, dan formulir kontak", sortOrder: 1 },
      { id: 120, packageId: 4, featureText: "Publikasi Artikel & Berita", tooltip: "Kanal publikasi artikel dan update berkala aktivitas perusahaan", sortOrder: 2 },
      { id: 121, packageId: 4, featureText: "Formulir Penawaran Terpadu", tooltip: "Formulir permintaan proposal langsung diteruskan ke WhatsApp dan email", sortOrder: 3 },
      { id: 122, packageId: 4, featureText: "Dashboard Kelola Konten", tooltip: "Kemudahan memperbarui portofolio dan berita kapan saja tanpa koding", sortOrder: 4 },
      { id: 123, packageId: 4, featureText: "Optimasi SEO & Metadata", tooltip: "Metadata Google dan pratinjau tautan rapi di media sosial", sortOrder: 5 },
      { id: 124, packageId: 4, featureText: "Domain & Hosting 1 Tahun", tooltip: "Termasuk domain perusahaan dan infrastruktur server cloud tahun pertama", sortOrder: 6 },

      { id: 125, packageId: 5, featureText: "Katalog Kategori Produk", tooltip: "Etalase produk dengan pencarian cepat dan filter kategori terstruktur", sortOrder: 1 },
      { id: 126, packageId: 5, featureText: "Manajemen Varian & Stok", tooltip: "Pengaturan opsi ukuran, warna, diskon harga khusus, dan sisa stok barang", sortOrder: 2 },
      { id: 127, packageId: 5, featureText: "Keranjang Belanja Praktis", tooltip: "Ringkasan pesanan rapi yang terhubung langsung ke WhatsApp kasir", sortOrder: 3 },
      { id: 128, packageId: 5, featureText: "Panel Catatan Pesanan", tooltip: "Dashboard pencatatan order masuk dan pembaruan status transaksi", sortOrder: 4 },
      { id: 129, packageId: 5, featureText: "Domain & Hosting 1 Tahun", tooltip: "Termasuk domain dan hosting cloud berkecepatan tinggi tahun pertama", sortOrder: 5 },

      { id: 130, packageId: 6, featureText: "Perancangan Database Relasional", tooltip: "Skema arsitektur data terstruktur dan optimal untuk skalabilitas", sortOrder: 1 },
      { id: 131, packageId: 6, featureText: "Pengembangan Full-Stack API", tooltip: "Antarmuka frontend interaktif dan REST API backend siap pakai", sortOrder: 2 },
      { id: 132, packageId: 6, featureText: "Hak Akses Bertingkat", tooltip: "Manajemen peran pengguna dan batasan hak otorisasi tiap divisi", sortOrder: 3 },
      { id: 133, packageId: 6, featureText: "Integrasi Layanan Eksternal", tooltip: "Penghubung sistem dengan gerbang pembayaran, webhook, atau API lain", sortOrder: 4 },
      { id: 134, packageId: 6, featureText: "Sesi Serah Terima Teknis", tooltip: "Panduan dokumentasi teknis dan pendampingan penggunaan sistem", sortOrder: 5 },
      { id: 135, packageId: 6, featureText: "Garansi Perbaikan 60 Hari", tooltip: "Garansi penanganan bug teknis dan asistensi pasca peluncuran sistem", sortOrder: 6 },
    ]),

    db.insert(packageAddons).values([
      { id: 201, packageId: 1, name: "Modul Katalog Perpustakaan Sekolah", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 1 },
      { id: 202, packageId: 1, name: "Formulir Buku Tamu & Layanan Aspirasi Wali Murid", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 2 },

      { id: 203, packageId: 2, name: "Integrasi Payment Gateway Biaya Pendaftaran / Daftar Ulang", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 1 },
      { id: 204, packageId: 2, name: "Notifikasi Status Pendaftaran Otomatis ke WhatsApp", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 2 },
      { id: 205, packageId: 2, name: "Modul Tes Seleksi Pilihan Ganda Daring", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 3 },

      { id: 206, packageId: 3, name: "Penyusunan Naskah Promosi & Struktur Penawaran", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 1 },
      { id: 207, packageId: 3, name: "Pemasangan Pelacakan Konversi Iklan Digital", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 2 },

      { id: 208, packageId: 4, name: "Pembuatan Dokumen Company Profile Unduhan PDF Selaras Web", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 1 },
      { id: 209, packageId: 4, name: "Audit Kecepatan & Optimasi SEO Teknis Lanjutan", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 2 },

      { id: 210, packageId: 5, name: "Integrasi Pembayaran Otomatis QRIS & Virtual Account", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 1 },
      { id: 211, packageId: 5, name: "Perhitungan Ongkos Kirim Ekspedisi Otomatis", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 2 },

      { id: 212, packageId: 6, name: "Kontrak Pemeliharaan & Pengembangan Fitur Bulanan", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 1 },
      { id: 213, packageId: 6, name: "Penyiapan Arsitektur Server Khusus & Backup Terjadwal", addonPrice: null, priceDisplay: "+ Rp X.XXX.XXX", sortOrder: 2 },
    ]),

    db.insert(testimonials).values([
      {
        id: 1,
        clientName: "Panitia Penerimaan Siswa Baru",
        clientRoleOrg:
          "Contoh Ulasan Instansi Pendidikan — Dapat Diubah di Dashboard Admin",
        quote:
          "Alur pendaftaran calon siswa jauh lebih tertib dibanding rekap manual. Orang tua murid bisa mendaftar dan mengunggah berkas langsung dari ponsel, sementara panitia tinggal memverifikasi dan mengunduh rekap Excel.",
        isFeatured: true,
        isPublished: true,
        sortOrder: 1,
      },
      {
        id: 2,
        clientName: "Pengelola Operasional Usaha",
        clientRoleOrg:
          "Contoh Ulasan Bisnis Ritel — Dapat Diubah di Dashboard Admin",
        quote:
          "Komunikasi pengerjaan jelas sejak diskusi awal. Tampilan katalog bersih, waktu muat halaman cepat, dan tim kami langsung terbiasa memperbarui stok produk lewat halaman admin.",
        isFeatured: false,
        isPublished: true,
        sortOrder: 2,
      },
      {
        id: 3,
        clientName: "Koordinator Humas Sekolah",
        clientRoleOrg:
          "Contoh Ulasan Profil Sekolah — Dapat Diubah di Dashboard Admin",
        quote:
          "Website profil sekolah tampil rapi dan mudah dinavigasi wali murid. Saat ada pengumuman agenda mendadak, staf tata usaha bisa mempublikasikannya sendiri dalam hitungan menit.",
        isFeatured: false,
        isPublished: true,
        sortOrder: 3,
      },
      {
        id: 4,
        clientName: "Kepala Bagian Akademik",
        clientRoleOrg:
          "Contoh Ulasan Portal Akademik — Dapat Diubah di Dashboard Admin",
        quote:
          "Portal akademik dan sistem penjadwalan berjalan sangat lancar. Guru dan siswa dapat memantau agenda dan materi pembelajaran secara tertib langsung dari web.",
        isFeatured: false,
        isPublished: true,
        sortOrder: 4,
      },
      {
        id: 5,
        clientName: "Manajemen Yayasan Pendidikan",
        clientRoleOrg:
          "Contoh Ulasan Yayasan — Dapat Diubah di Dashboard Admin",
        quote:
          "Kecepatan akses di jaringan edge Cloudflare luar biasa. Seluruh unit sekolah di bawah yayasan kami kini memiliki standar tampilan digital yang seragam dan profesional.",
        isFeatured: false,
        isPublished: true,
        sortOrder: 5,
      },
      {
        id: 6,
        clientName: "Direktur Operasional Bisnis",
        clientRoleOrg:
          "Contoh Ulasan Perusahaan Layanan — Dapat Diubah di Dashboard Admin",
        quote:
          "Alur kerja dan dokumentasi serah terimanya sangat rapi. Dashboard admin memudahkan staf kami mengelola pesanan dan pertanyaan calon klien setiap hari tanpa kendala.",
        isFeatured: false,
        isPublished: true,
        sortOrder: 6,
      },
    ]),

    db.insert(faqs).values([
      {
        id: 1,
        question:
          "Bagaimana tahapan pembayaran untuk setiap proyek pembuatan website?",
        answer:
          "Pembayaran dilakukan secara bertahap dalam dua termin: uang muka sebesar 50% setelah ruang lingkup fitur disepakati untuk memulai pengerjaan, dan pelunasan 50% setelah website selesai diuji coba serta siap dirilis ke domain resmi.",
        isPublished: true,
        sortOrder: 1,
      },
      {
        id: 2,
        question:
          "Apakah harga paket sudah termasuk domain dan server, serta bagaimana biaya tahun berikutnya?",
        answer:
          "Paket yang mencantumkan fasilitas domain dan server sudah mencakup biaya aktif untuk tahun pertama. Memasuki tahun kedua, Anda hanya perlu membayar biaya perpanjangan tahunan sesuai rincian pada tiap paket tanpa dikenakan biaya pembuatan ulang.",
        isPublished: true,
        sortOrder: 2,
      },
      {
        id: 3,
        question:
          "Berapa kali batas revisi yang didapat selama proses pengerjaan?",
        answer:
          "Setiap paket mencakup 2 hingga 3 sesi revisi terstruktur yang mengacu pada daftar fitur yang telah disepakati di awal. Penambahan modul baru di luar ruang lingkup awal tetap dapat dikerjakan dengan penyesuaian biaya dan jadwal yang disepakati bersama.",
        isPublished: true,
        sortOrder: 3,
      },
      {
        id: 4,
        question:
          "Apakah pihak sekolah atau perusahaan mendapatkan akses penuh ke halaman admin dan domain?",
        answer:
          "Ya. Anda mendapatkan akses penuh ke Dashboard Admin pengelolaan konten beserta panduan penggunaannya. Domain resmi juga didaftarkan atas nama instansi atau bisnis Anda.",
        isPublished: true,
        sortOrder: 4,
      },
      {
        id: 5,
        question:
          "Bagaimana jika ditemukan kendala teknis setelah website resmi diluncurkan?",
        answer:
          "Seluruh paket dilengkapi masa garansi perbaikan kendala teknis gratis selama 30 hingga 60 hari setelah serah terima agar operasional awal berjalan lancar, termasuk pendampingan penggunaan bagi tim Anda.",
        isPublished: true,
        sortOrder: 5,
      },
    ]),
  ]);
}
