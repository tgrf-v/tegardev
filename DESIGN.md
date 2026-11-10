# Design System — tegardev

Gaya visual diadaptasi dari referensi brand "Watts" (dark + rust/terracotta, tipografi besar sebagai elemen visual). Dokumen ini jadi acuan kalau mau membangun halaman lain dengan konsistensi yang sama.

## 1. Warna

| Token | Hex | Pemakaian |
|---|---|---|
| `--bg` | `#121010` | Background utama, hampir hitam tapi hangat |
| `--bg2` | `#1A1512` | Background panel sekunder / section alternatif |
| `--rust` | `#A8391C` | Warna aksen utama — CTA, highlight teks, band besar |
| `--rust-dark` | `#7E2912` | Varian gelap aksen — topbar, hover state |
| `--cream` | `#F3EEE6` | Warna teks utama di atas background gelap |
| `--cream-dim` | `#C9C0B3` | Teks sekunder / body text, kontras lebih rendah |
| `--line` | `#2E2622` | Border, divider, garis pemisah section |

**Prinsip:** satu warna aksen (rust) dipakai konsisten di semua tempat — tombol, satu kata di wordmark, border pill. Jangan tambah warna aksen kedua. Warna "hitam" selalu diberi sedikit kehangatan (bukan `#000` murni), supaya terasa seperti bahan natural/organik, bukan UI generik.

## 2. Tipografi

| Role | Font | Catatan |
|---|---|---|
| Display / Wordmark / Judul besar | **Anton** | Huruf besar, tebal, condensed. Dipakai sebagai elemen visual utuh (bukan sekadar heading) — contoh: nama brand selebar layar di hero & footer |
| Body / UI / Navigasi | **Work Sans** | 400–700, untuk paragraf, label, tombol |

**Skala tipografi (indikatif, pakai `clamp()` biar responsif):**

- Wordmark hero/footer: `70px–190px`
- Headline section: `26px–44px`
- Sub-heading / card title: `16px–20px`
- Body text: `13px–15px`
- Label kecil / badge: `11px–12.5px`

**Aturan:**
- Display font dipakai secara utuh untuk kata, bukan per-huruf diwarnai acak.
- Satu suku kata/kata di dalam wordmark boleh diberi warna aksen (mis. "dev" dalam "tegardev") untuk menandai identitas — tapi jangan diulang di setiap heading, cukup di wordmark.
- Hindari huruf besar semua (ALL CAPS) untuk body; dipakai seperlunya untuk badge kecil saja.

## 3. Layout & Spacing

- **Lebar konten maksimum:** `1160px`, center-aligned, padding horizontal `28px`.
- **Grid section:** umumnya full-bleed (section menempel tepi layar), dengan konten di dalam di-wrap.
- **Spacing vertikal antar section:** besar dan lega — `64px–80px` padding atas-bawah per section, supaya tiap section terasa seperti "halaman" tersendiri.
- **Border-radius:** kecil dan konsisten, `3px–6px` saja. Tidak dibuat sangat rounded (hindari pill-card SaaS generik).
- **Divider:** garis tipis 1px warna `--line`, dipakai untuk strip badge dan pemisah antar section, bukan shadow.

### Pola layout yang dipakai
1. **Topbar tipis** (announcement bar) — satu baris, background aksen gelap.
2. **Nav sticky** di bawah topbar, brand kiri + link kanan + 1 tombol CTA.
3. **Hero**: judul + deskripsi singkat berdampingan (2 kolom), lalu wordmark raksasa full-width di bawahnya, ditutup strip badge horizontal (scroll di mobile).
4. **Feature split 2 kolom**: panel gelap (visual/mockup) berdampingan dengan panel teks (deskripsi + tag + CTA).
5. **Band CTA warna aksen penuh**: 4 pill kecil di atas, headline besar di tengah, 2 tombol (primary solid + secondary outline).
6. **Grid kartu** (3–5 kolom desktop, menyusut ke 2 lalu 1 di mobile) untuk showcase stack/skill.
7. **Grid testimoni/review**: satu kartu "feature" besar berwarna aksen + beberapa kartu kecil netral di sekitarnya.
8. **Footer**: kolom link kecil di atas, lalu wordmark raksasa lagi (mengunci identitas brand), ditutup baris copyright tipis.

## 4. Komponen

- **Tombol primary:** background `--rust`, teks `--cream`, radius `3px`, padding `11–16px` vertikal.
- **Tombol secondary (di atas band aksen):** outline 1px `--cream`, transparan.
- **Badge/pill:** border 1px `--line` (atau cream transparan di atas band aksen), radius `5px`, teks kecil.
- **Tag:** border tipis, radius kecil, dipakai untuk daftar teknologi/skill di panel fitur.
- **Card:** background `--bg2` atau `--bg`, border 1px `--line`, tanpa shadow — kontras dibentuk dari warna, bukan bayangan.

## 5. Prinsip Desain

1. **Satu elemen jadi "bintang"** — wordmark besar. Semua elemen lain dibuat tenang di sekitarnya.
2. **Kontras tekstur, bukan gradient dekoratif** — gunakan blok warna solid dan garis tipis, hindari gradient sebagai hiasan.
3. **Hierarki lewat ukuran & warna, bukan banyak warna** — hanya rust sebagai aksen, selebihnya skala cream→dim→line.
4. **Konsisten mengunci identitas** — wordmark besar muncul dua kali (hero & footer) supaya brand "menempel".
5. **Copy singkat dan langsung** — judul pendek, deskripsi 1–2 kalimat, tombol pakai kata kerja aktif ("Mulai Proyek", bukan "Submit").
