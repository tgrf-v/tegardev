INSERT OR IGNORE INTO site_settings (
  id,
  hero_headline,
  about_title,
  about_body,
  whatsapp_number,
  contact_email,
  github_url,
  linkedin_url,
  cta_headline,
  cta_subtext,
  pricing_text,
  updated_at
) VALUES (
  1,
  'Membangun website & sistem web yang rapi, cepat, dan siap dipakai kerja nyata.',
  'Tentang Saya',
  'Saya Tegar, seorang Full-Stack Developer yang berfokus membangun produk web fungsional dari tahap perancangan antarmuka, pemodelan database, hingga rilis ke jaringan cloud. Setiap proyek dikerjakan dengan kode yang bersih, struktur yang mudah dipelihara, serta alur penggunaan yang langsung dipahami oleh tim operasional klien maupun pengguna akhir.

Bagi sekolah dan yayasan, ketiadaan sistem PPDB yang stabil sering menimbulkan kepanikan saat masa penerimaan siswa baru tiba. Saya menghadirkan solusi sistem pendaftaran yang siap menampung lonjakan berkas, verifikasi otomatis, hingga pengumuman kelulusan berbasis nomor peserta dengan antarmuka yang ramah bagi orang tua murid.

Sementara bagi pemilik usaha dan instansi, website bukan sekadar brosur digital melainkan sarana konversi langsung ke WhatsApp atau sistem internal. Setiap baris kode dioptimalkan untuk kecepatan muat instan, keamanan sertifikat cloud, dan kemudahan pengelolaan konten tanpa perlu keahlian koding.',
  '6285196802314',
  'halo@tegardev.com',
  'https://github.com/tgrf-v/',
  'https://www.linkedin.com/in/tegar-rifa-i-a68757412/',
  'Siap membangun website atau sistem untuk instansi dan bisnis Anda?',
  'Ceritakan kebutuhan fitur, target jadwal rilis, atau paket yang diminati untuk mendapatkan rincian ruang lingkup yang jelas.',
  'Setiap proyek bersifat custom, harga ditentukan berdasarkan kompleksitas fitur, jumlah modul, dan platform (web/mobile). Hubungi saya untuk konsultasi gratis dan estimasi biaya sesuai kebutuhan Anda.

Kategori layanan: Landing Page & Company Profile · Sistem Manajemen (PPDB, Akademik, POS, Order Management) · Aplikasi Mobile · Integrasi Machine Learning',
  '2026-11-06T09:00:00+07:00'
);

INSERT OR IGNORE INTO services (id, title, sort_order, is_published) VALUES
  (1, 'PPDB Online', 1, 1),
  (2, 'Website Sekolah & Yayasan', 2, 1),
  (3, 'Company Profile', 3, 1),
  (4, 'Toko Online & E-Commerce', 4, 1),
  (5, 'Aplikasi POS Apotek & Ritel', 5, 1),
  (6, 'Sistem Inventaris & Logistik', 6, 1),
  (7, 'Portal Akademik', 7, 1),
  (8, 'Sistem Absensi & HR', 8, 1),
  (9, 'Dashboard Admin Kustom', 9, 1),
  (10, 'Landing Page Konversi Tinggi', 10, 1),
  (11, 'Sistem Reservasi & Booking', 11, 1),
  (12, 'Portal Berita & Media', 12, 1),
  (13, 'Integrasi Machine Learning', 13, 1),
  (14, 'Aplikasi Mobile (Android/iOS)', 14, 1);

INSERT OR IGNORE INTO skills (id, group_name, items_json, sort_order) VALUES
  (1, 'Frontend & Antarmuka', '["React 19","React Router v8","TypeScript","Tailwind CSS v4","shadcn/ui","HTML & CSS Modern"]', 1),
  (2, 'Backend & Layanan API', '["Cloudflare Workers","Node.js","Hono","REST API","Integrasi Webhook","Autentikasi & Keamanan"]', 2),
  (3, 'Database & Penyimpanan', '["Cloudflare D1","PostgreSQL","SQLite","Drizzle ORM","Cloudflare R2","Optimasi Query"]', 3),
  (4, 'Infrastruktur & Rilis', '["Cloudflare Edge","Zero Trust Access","Git & Otomasi Rilis","Docker","Linux Server","Audit Core Web Vitals"]', 4);

INSERT OR IGNORE INTO media_assets (key, filename, url, mime_type, size_bytes, width, height, created_at) VALUES
  ('preview-ppdb.svg', 'preview-ppdb.svg', '/media/preview-ppdb.svg', 'image/svg+xml', 4120, 960, 600, '2026-11-06T09:00:00+07:00'),
  ('preview-sekolah.svg', 'preview-sekolah.svg', '/media/preview-sekolah.svg', 'image/svg+xml', 3890, 960, 600, '2026-11-06T09:00:00+07:00'),
  ('preview-niaga.svg', 'preview-niaga.svg', '/media/preview-niaga.svg', 'image/svg+xml', 3940, 960, 600, '2026-11-06T09:00:00+07:00');

INSERT OR IGNORE INTO projects (id, title, slug, summary, image_url, image_alt, is_published, sort_order, created_at, updated_at) VALUES
  (1, 'Portal Sistem PPDB Terpadu', 'portal-sistem-ppdb-terpadu', 'Platform penerimaan peserta didik baru daring dengan pendaftaran multi-jalur, unggah berkas persyaratan ke cloud storage, panel verifikasi panitia secara langsung, pengaturan kuota otomatis, cetak bukti pendaftaran, serta halaman pengumuman seleksi.', '/media/preview-ppdb.svg', 'Pratinjau antarmuka dashboard dan alur seleksi Portal Sistem PPDB Terpadu', 1, 1, '2026-11-06T09:00:00+07:00', '2026-11-06T09:00:00+07:00'),
  (2, 'Portal Resmi & Direktori Sekolah', 'portal-resmi-direktori-sekolah', 'Website profil institusi pendidikan yang memuat informasi akademik, visi & misi, direktori guru & tenaga kependidikan, publikasi berita kegiatan, serta halaman pengelolaan konten mandiri bagi staf tata usaha.', '/media/preview-sekolah.svg', 'Pratinjau tata letak halaman Portal Resmi dan Direktori Sekolah', 1, 2, '2026-11-06T09:00:00+07:00', '2026-11-06T09:00:00+07:00'),
  (3, 'Sistem Katalog & Operasional Niaga', 'sistem-katalog-operasional-niaga', 'Aplikasi web pengelolaan katalog produk, pemantauan stok varian lintas gudang, rekap pesanan pelanggan terstruktur, dan integrasi pembayaran daring untuk mempercepat pencatatan transaksi harian pelaku usaha.', '/media/preview-niaga.svg', 'Pratinjau antarmuka katalog produk dan ringkasan stok operasional niaga', 1, 3, '2026-11-06T09:00:00+07:00', '2026-11-06T09:00:00+07:00');

INSERT OR IGNORE INTO package_categories (id, name, slug, sort_order) VALUES
  (1, 'Pendidikan & Instansi', 'pendidikan-instansi', 1),
  (2, 'Bisnis & UMKM', 'bisnis-umkm', 2),
  (3, 'Sistem Custom', 'sistem-custom', 3);

INSERT OR IGNORE INTO packages (id, category_id, name, slug, tagline, starting_price, price_label_override, estimated_duration, renewal_note, is_highlighted, is_published, sort_order, updated_at) VALUES
  (1, 1, 'Website Profil Sekolah', 'website-profil-sekolah', 'Portal informasi resmi sekolah yang rapi, cepat diakses wali murid, dan mudah diperbarui staf tata usaha.', NULL, 'Mulai Rp X.XXX.XXX', '7–10 hari kerja', 'Perpanjangan domain .sch.id & layanan server tahun ke-2 mulai Rp X.XXX.XXX/tahun.', 0, 1, 1, '2026-11-06T09:00:00+07:00'),
  (2, 1, 'Sistem PPDB Online', 'sistem-ppdb-online', 'Sistem pendaftaran siswa baru daring dari pengisian formulir, verifikasi berkas panitia, hingga pengumuman kelulusan.', NULL, 'Mulai Rp X.XXX.XXX', '14–21 hari kerja', 'Perpanjangan server & pemeliharaan periode PPDB tahun berikutnya mulai Rp X.XXX.XXX/tahun.', 1, 1, 2, '2026-11-06T09:00:00+07:00'),
  (3, 2, 'Landing Page', 'landing-page', 'Satu halaman promosi terfokus untuk mengarahkan pengunjung menjadi prospek yang langsung menghubungi tim Anda.', NULL, 'Mulai Rp X.XXX.XXX', '3–5 hari kerja', 'Perpanjangan domain & layanan server tahun ke-2 mulai Rp X.XXX.XXX/tahun.', 0, 1, 1, '2026-11-06T09:00:00+07:00'),
  (4, 2, 'Website Company Profile', 'website-company-profile', 'Profil resmi perusahaan multi-bagian untuk membangun kepercayaan mitra bisnis, tender, dan calon pelanggan.', NULL, 'Mulai Rp X.XXX.XXX', '7–12 hari kerja', 'Perpanjangan domain resmi & server tahun ke-2 mulai Rp X.XXX.XXX/tahun.', 1, 1, 2, '2026-11-06T09:00:00+07:00'),
  (5, 2, 'Katalog & Toko Online', 'katalog-toko-online', 'Etalase produk digital lengkap dengan pengelolaan stok varian dan alur pemesanan yang praktis bagi pembeli.', NULL, 'Mulai Rp X.XXX.XXX', '12–18 hari kerja', 'Perpanjangan domain & layanan server tahun ke-2 mulai Rp X.XXX.XXX/tahun.', 0, 1, 3, '2026-11-06T09:00:00+07:00'),
  (6, 3, 'Aplikasi Web Custom', 'aplikasi-web-custom', 'Pengembangan sistem informasi internal, portal operasional, atau produk SaaS sesuai alur bisnis spesifik Anda.', NULL, 'Mulai Rp X.XXX.XXX', 'Sesuai cakupan modul', 'Dapat dipasang langsung pada akun infrastruktur cloud milik klien atau dikelola bersama.', 1, 1, 1, '2026-11-06T09:00:00+07:00');

INSERT OR IGNORE INTO package_features (id, package_id, feature_text, tooltip, sort_order) VALUES
  (101, 1, 'Profil & Visi Misi', 'Halaman profil sekolah, sejarah institusi, serta visi & misi resmi', 1),
  (102, 1, 'Direktori Guru & Staf', 'Daftar guru dan tenaga kependidikan lengkap dengan jabatan', 2),
  (103, 1, 'Publikasi Berita & Agenda', 'Portal berita kegiatan, kalender agenda, dan pengumuman resmi', 3),
  (104, 1, 'Galeri Foto & Fasilitas', 'Dokumentasi kegiatan dan fasilitas sarana prasarana sekolah', 4),
  (105, 1, 'Dashboard Admin Mandiri', 'Panel pengelolaan konten berbahasa Indonesia yang mudah digunakan tata usaha', 5),
  (106, 1, 'Domain & Server 1 Tahun', 'Termasuk domain resmi .sch.id dan cloud hosting tahun pertama', 6),
  (107, 2, 'Formulir Pendaftaran Responsif', 'Formulir pendaftaran bertahap yang nyaman diisi lewat ponsel para pendaftar', 1),
  (108, 2, 'Unggah Berkas Persyaratan', 'Pengunggahan digital untuk KK, akta lahir, rapor, dan piagam prestasi', 2),
  (109, 2, 'Manajemen Jalur & Kuota', 'Pengaturan gelombang pendaftaran, jalur zonasi/prestasi, dan kuota penerimaan', 3),
  (110, 2, 'Cetak Bukti Pendaftaran', 'Cetak kartu tanda bukti pendaftaran otomatis dalam format PDF', 4),
  (111, 2, 'Dashboard Verifikasi Panitia', 'Panel pemeriksaan berkas dan validasi kelengkapan berkas calon siswa', 5),
  (112, 2, 'Pengumuman Kelulusan Mandiri', 'Pengecekan status seleksi mandiri berbasis nomor pendaftaran peserta', 6),
  (113, 2, 'Ekspor Rekap Excel', 'Ekspor rekapitulasi data pendaftar lengkap ke format spreadsheet', 7),
  (114, 3, 'Desain Fokus Konversi', 'Struktur satu halaman penuh yang dirancang khusus untuk memicu respon pengunjung', 1),
  (115, 3, 'Tombol Chat WhatsApp', 'Tautan konversi langsung ke WhatsApp dengan draf pesan otomatis', 2),
  (116, 3, 'Tampilan Responsif Prima', 'Optimal diakses melalui layar ponsel, tablet, maupun komputer', 3),
  (117, 3, 'Optimasi Muat Cepat', 'Kode ringan dengan performa Core Web Vitals tinggi dan struktur SEO dasar', 4),
  (118, 3, 'Domain Resmi 1 Tahun', 'Termasuk domain resmi .com atau .id aktif untuk tahun pertama', 5),
  (119, 4, 'Struktur Halaman Lengkap', 'Profil bisnis, portofolio proyek, katalog layanan, dan formulir kontak', 1),
  (120, 4, 'Publikasi Artikel & Berita', 'Kanal publikasi artikel dan update berkala aktivitas perusahaan', 2),
  (121, 4, 'Formulir Penawaran Terpadu', 'Formulir permintaan proposal langsung diteruskan ke WhatsApp dan email', 3),
  (122, 4, 'Dashboard Kelola Konten', 'Kemudahan memperbarui portofolio dan berita kapan saja tanpa koding', 4),
  (123, 4, 'Optimasi SEO & Metadata', 'Metadata Google dan pratinjau tautan rapi di media sosial', 5),
  (124, 4, 'Domain & Hosting 1 Tahun', 'Termasuk domain perusahaan dan infrastruktur server cloud tahun pertama', 6),
  (125, 5, 'Katalog Kategori Produk', 'Etalase produk dengan pencarian cepat dan filter kategori terstruktur', 1),
  (126, 5, 'Manajemen Varian & Stok', 'Pengaturan opsi ukuran, warna, diskon harga khusus, dan sisa stok barang', 2),
  (127, 5, 'Keranjang Belanja Praktis', 'Ringkasan pesanan rapi yang terhubung langsung ke WhatsApp kasir', 3),
  (128, 5, 'Panel Catatan Pesanan', 'Dashboard pencatatan order masuk dan pembaruan status transaksi', 4),
  (129, 5, 'Domain & Hosting 1 Tahun', 'Termasuk domain dan hosting cloud berkecepatan tinggi tahun pertama', 5),
  (130, 6, 'Perancangan Database Relasional', 'Skema arsitektur data terstruktur dan optimal untuk skalabilitas', 1),
  (131, 6, 'Pengembangan Full-Stack API', 'Antarmuka frontend interaktif dan REST API backend siap pakai', 2),
  (132, 6, 'Hak Akses Bertingkat', 'Manajemen peran pengguna dan batasan hak otorisasi tiap divisi', 3),
  (133, 6, 'Integrasi Layanan Eksternal', 'Penghubung sistem dengan gerbang pembayaran, webhook, atau API lain', 4),
  (134, 6, 'Sesi Serah Terima Teknis', 'Panduan dokumentasi teknis dan pendampingan penggunaan sistem', 5),
  (135, 6, 'Garansi Perbaikan 60 Hari', 'Garansi penanganan bug teknis dan asistensi pasca peluncuran sistem', 6);

INSERT OR IGNORE INTO package_addons (id, package_id, name, addon_price, price_display, sort_order) VALUES
  (201, 1, 'Modul Katalog Perpustakaan Sekolah', NULL, '+ Rp X.XXX.XXX', 1),
  (202, 1, 'Formulir Buku Tamu & Layanan Aspirasi Wali Murid', NULL, '+ Rp X.XXX.XXX', 2),
  (203, 2, 'Integrasi Payment Gateway Biaya Pendaftaran / Daftar Ulang', NULL, '+ Rp X.XXX.XXX', 1),
  (204, 2, 'Notifikasi Status Pendaftaran Otomatis ke WhatsApp', NULL, '+ Rp X.XXX.XXX', 2),
  (205, 2, 'Modul Tes Seleksi Pilihan Ganda Daring', NULL, '+ Rp X.XXX.XXX', 3),
  (206, 3, 'Penyusunan Naskah Promosi & Struktur Penawaran', NULL, '+ Rp X.XXX.XXX', 1),
  (207, 3, 'Pemasangan Pelacakan Konversi Iklan Digital', NULL, '+ Rp X.XXX.XXX', 2),
  (208, 4, 'Pembuatan Dokumen Company Profile Unduhan PDF Selaras Web', NULL, '+ Rp X.XXX.XXX', 1),
  (209, 4, 'Audit Kecepatan & Optimasi SEO Teknis Lanjutan', NULL, '+ Rp X.XXX.XXX', 2),
  (210, 5, 'Integrasi Pembayaran Otomatis QRIS & Virtual Account', NULL, '+ Rp X.XXX.XXX', 1),
  (211, 5, 'Perhitungan Ongkos Kirim Ekspedisi Otomatis', NULL, '+ Rp X.XXX.XXX', 2),
  (212, 6, 'Kontrak Pemeliharaan & Pengembangan Fitur Bulanan', NULL, '+ Rp X.XXX.XXX', 1),
  (213, 6, 'Penyiapan Arsitektur Server Khusus & Backup Terjadwal', NULL, '+ Rp X.XXX.XXX', 2);

INSERT OR IGNORE INTO testimonials (id, client_name, client_role_org, quote, is_featured, is_published, sort_order) VALUES
  (1, 'Apoteker', 'Apotek Asa***i', 'Awalnya saya terbebani dengan biaya hosting bulanan untuk sistem POS apotek saya. TegarDev membangun ulang sistem menggunakan Cloudflare dan Supabase, sehingga biaya langganan hosting bisa dihilangkan sepenuhnya. Pengeluaran bulanan jadi jauh lebih hemat.', 1, 1, 1),
  (2, 'Panitia Penerimaan Siswa Baru', 'Contoh Ulasan Instansi Pendidikan — Dapat Diubah di Dashboard Admin', 'Alur pendaftaran calon siswa jauh lebih tertib dibanding rekap manual. Orang tua murid bisa mendaftar dan mengunggah berkas langsung dari ponsel, sementara panitia tinggal memverifikasi dan mengunduh rekap Excel.', 0, 1, 2),
  (3, 'Pengelola Operasional Usaha', 'Contoh Ulasan Bisnis Ritel — Dapat Diubah di Dashboard Admin', 'Komunikasi pengerjaan jelas sejak diskusi awal. Tampilan katalog bersih, waktu muat halaman cepat, dan tim kami langsung terbiasa memperbarui stok produk lewat halaman admin.', 0, 1, 3),
  (4, 'Koordinator Humas Sekolah', 'Contoh Ulasan Profil Sekolah — Dapat Diubah di Dashboard Admin', 'Website profil sekolah tampil rapi dan mudah dinavigasi wali murid. Saat ada pengumuman agenda mendadak, staf tata usaha bisa mempublikasikannya sendiri dalam hitungan menit.', 0, 1, 4),
  (5, 'Kepala Bagian Akademik', 'Contoh Ulasan Portal Akademik — Dapat Diubah di Dashboard Admin', 'Portal akademik dan sistem penjadwalan berjalan sangat lancar. Guru dan siswa dapat memantau agenda dan materi pembelajaran secara tertib langsung dari web.', 0, 1, 5),
  (6, 'Manajemen Yayasan Pendidikan', 'Contoh Ulasan Yayasan — Dapat Diubah di Dashboard Admin', 'Kecepatan akses di jaringan edge Cloudflare luar biasa. Seluruh unit sekolah di bawah yayasan kami kini memiliki standar tampilan digital yang seragam dan profesional.', 0, 1, 6),
  (7, 'Direktur Operasional Bisnis', 'Contoh Ulasan Perusahaan Layanan — Dapat Diubah di Dashboard Admin', 'Alur kerja dan dokumentasi serah terimanya sangat rapi. Dashboard admin memudahkan staf kami mengelola pesanan dan pertanyaan calon klien setiap hari tanpa kendala.', 0, 1, 7);

INSERT OR IGNORE INTO faqs (id, question, answer, is_published, sort_order) VALUES
  (1, 'Bagaimana tahapan pembayaran untuk setiap proyek pembuatan website?', 'Pembayaran dilakukan secara bertahap dalam dua termin: uang muka sebesar 50% setelah ruang lingkup fitur disepakati untuk memulai pengerjaan, dan pelunasan 50% setelah website selesai diuji coba serta siap dirilis ke domain resmi.', 1, 1),
  (2, 'Apakah harga paket sudah termasuk domain dan server, serta bagaimana biaya tahun berikutnya?', 'Paket yang mencantumkan fasilitas domain dan server sudah mencakup biaya aktif untuk tahun pertama. Memasuki tahun kedua, Anda hanya perlu membayar biaya perpanjangan tahunan sesuai rincian pada tiap paket tanpa dikenakan biaya pembuatan ulang.', 1, 2),
  (3, 'Berapa kali batas revisi yang didapat selama proses pengerjaan?', 'Setiap paket mencakup 2 hingga 3 sesi revisi terstruktur yang mengacu pada daftar fitur yang telah disepakati di awal. Penambahan modul baru di luar ruang lingkup awal tetap dapat dikerjakan dengan penyesuaian biaya dan jadwal yang disepakati bersama.', 1, 3),
  (4, 'Apakah pihak sekolah atau perusahaan mendapatkan akses penuh ke halaman admin dan domain?', 'Ya. Anda mendapatkan akses penuh ke Dashboard Admin pengelolaan konten beserta panduan penggunaannya. Domain resmi juga didaftarkan atas nama instansi atau bisnis Anda.', 1, 4),
  (5, 'Bagaimana jika ditemukan kendala teknis setelah website resmi diluncurkan?', 'Seluruh paket dilengkapi masa garansi perbaikan kendala teknis gratis selama 30 hingga 60 hari setelah serah terima agar operasional awal berjalan lancar, termasuk pendampingan penggunaan bagi tim Anda.', 1, 5),
  (6, 'Apakah bisa request fitur di luar paket standar?', 'Bisa. Jika ada permintaan fitur atau modul tambahan di luar cakupan awal, akan ada penyesuaian biaya sesuai kompleksitas fitur tersebut.', 1, 6),
  (7, 'Apakah TegarDev juga melayani pembuatan aplikasi mobile?', 'Ya, selain website dan sistem web, saya juga melayani pengembangan aplikasi mobile (Android/iOS).', 1, 7),
  (8, 'Apakah ada pengalaman membangun sistem dengan machine learning?', 'Ada. Salah satu contohnya adalah sistem skrining komplikasi kehamilan yang mengklasifikasi risiko berdasarkan variabel seperti usia kehamilan, riwayat kehamilan, dan riwayat penyakit pasien.', 1, 8),
  (9, 'Bagaimana proses konsultasi awal sebelum proyek dimulai?', 'Konsultasi bisa dilakukan secara online (Google Meet atau sejenisnya) maupun offline. Saya akan meminta Anda menjelaskan masalah yang dihadapi, kemudian memberikan solusi, estimasi biaya, dan batasan fitur secara langsung dan transparan. Setelah disepakati, proyek langsung dieksekusi.', 1, 9),
  (10, 'Apakah TegarDev melayani klien di luar Indonesia?', 'Ya. Saya melayani klien di Indonesia maupun luar negeri, dengan komunikasi dalam Bahasa Indonesia maupun Bahasa Inggris.', 1, 10);
