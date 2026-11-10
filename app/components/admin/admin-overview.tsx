import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { formatPackagePrice } from "~/lib/whatsapp";
import type { PortfolioContentBundle } from "~/types/content";

interface AdminOverviewProps {
  bundle: PortfolioContentBundle;
  basePath: string;
}

export function AdminOverview({ bundle, basePath }: AdminOverviewProps) {
  const publishedProjects = bundle.projects.filter((p) => p.isPublished).length;
  const publishedPackages = bundle.packages.filter((p) => p.isPublished).length;
  const publishedTestimonials = bundle.testimonials.filter(
    (t) => t.isPublished,
  ).length;
  const publishedFaqs = bundle.faqs.filter((f) => f.isPublished).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
          Ringkasan
        </h1>
        <p className="mt-2 text-[14.5px] text-cream-dim">
          Pantau kelengkapan konten portofolio dan katalog paket layanan yang tersimpan di Cloudflare D1.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[4px] border border-line bg-bg2 p-5">
          <p className="text-[12.5px] font-medium uppercase tracking-wide text-cream-dim">
            Proyek Tampil
          </p>
          <p className="tabular-price mt-2 text-[28px] font-bold text-cream">
            {publishedProjects}
            <span className="text-[15px] font-normal text-cream-dim">
              {" "}
              / {bundle.projects.length}
            </span>
          </p>
          <Link
            to={`${basePath}/proyek`}
            className="mt-4 inline-block text-[13px] font-medium text-rust hover:underline"
          >
            Kelola Proyek
          </Link>
        </div>

        <div className="rounded-[4px] border border-line bg-bg2 p-5">
          <p className="text-[12.5px] font-medium uppercase tracking-wide text-cream-dim">
            Paket Layanan Aktif
          </p>
          <p className="tabular-price mt-2 text-[28px] font-bold text-cream">
            {publishedPackages}
            <span className="text-[15px] font-normal text-cream-dim">
              {" "}
              / {bundle.packages.length}
            </span>
          </p>
          <Link
            to={`${basePath}/paket`}
            className="mt-4 inline-block text-[13px] font-medium text-rust hover:underline"
          >
            Atur Harga Paket
          </Link>
        </div>

        <div className="rounded-[4px] border border-line bg-bg2 p-5">
          <p className="text-[12.5px] font-medium uppercase tracking-wide text-cream-dim">
            Testimoni Klien
          </p>
          <p className="tabular-price mt-2 text-[28px] font-bold text-cream">
            {publishedTestimonials}
          </p>
          <Link
            to={`${basePath}/testimoni`}
            className="mt-4 inline-block text-[13px] font-medium text-rust hover:underline"
          >
            Kelola Testimoni
          </Link>
        </div>

        <div className="rounded-[4px] border border-line bg-bg2 p-5">
          <p className="text-[12.5px] font-medium uppercase tracking-wide text-cream-dim">
            Tanya Jawab
          </p>
          <p className="tabular-price mt-2 text-[28px] font-bold text-cream">
            {publishedFaqs}
          </p>
          <Link
            to={`${basePath}/tanya-jawab`}
            className="mt-4 inline-block text-[13px] font-medium text-rust hover:underline"
          >
            Kelola Tanya Jawab
          </Link>
        </div>
      </div>

      <section className="rounded-[5px] border border-line bg-bg2 p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[17px] font-semibold text-cream">
              Kontak &amp; Penyimpanan Media
            </h2>
            <p className="mt-1 text-[13.5px] text-cream-dim">
              Nomor tujuan pengiriman Brief Proyek WhatsApp dan status pustaka media R2.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`${basePath}/profil`} className="no-underline">
              Ubah Profil
            </Link>
          </Button>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-4 text-[14px] sm:grid-cols-3">
          <div className="rounded-[4px] border border-line bg-bg p-4">
            <dt className="text-[12px] font-medium uppercase tracking-wide text-cream-dim">
              WhatsApp Penerima Brief
            </dt>
            <dd className="tabular-price mt-1 font-semibold text-cream">
              +{bundle.settings.whatsappNumber}
            </dd>
          </div>
          <div className="rounded-[4px] border border-line bg-bg p-4">
            <dt className="text-[12px] font-medium uppercase tracking-wide text-cream-dim">
              Email Resmi
            </dt>
            <dd className="mt-1 font-medium text-cream">
              {bundle.settings.contactEmail}
            </dd>
          </div>
          <div className="rounded-[4px] border border-line bg-bg p-4">
            <dt className="text-[12px] font-medium uppercase tracking-wide text-cream-dim">
              Pustaka Media R2
            </dt>
            <dd className="tabular-price mt-1 font-medium text-cream">
              {bundle.media.length} berkas terdaftar
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[5px] border border-line bg-bg2 p-6">
        <div className="flex flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[17px] font-semibold text-cream">
              Daftar Paket Layanan Saat Ini
            </h2>
            <p className="mt-1 text-[13.5px] text-cream-dim">
              Ringkasan cepat harga dasar tiap paket pada katalog halaman publik.
            </p>
          </div>
          <Button size="sm" asChild>
            <Link to={`${basePath}/paket`} className="no-underline">
              Kelola Paket
            </Link>
          </Button>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-labelledby="overview-packages-caption"
          className="admin-table-region rounded-[4px] border border-line"
        >
          <table className="admin-responsive-table w-full text-left text-[13.5px]">
            <caption id="overview-packages-caption" className="sr-only">
              Ringkasan paket layanan aktif
            </caption>
            <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Nama Paket
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Kategori
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Harga Tampil
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Estimasi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-bg">
              {bundle.packages.map((pkg) => {
                const catName =
                  bundle.categories.find((c) => c.id === pkg.categoryId)?.name ??
                  "-";
                return (
                  <tr key={pkg.id}>
                    <th scope="row" className="px-4 py-3 font-semibold text-cream">
                      {pkg.name}
                    </th>
                    <td data-label="Kategori" className="px-4 py-3 text-cream-dim">
                      {catName}
                    </td>
                    <td
                      data-label="Harga Tampil"
                      className="tabular-price px-4 py-3 font-medium text-cream"
                    >
                      {formatPackagePrice(pkg)}
                    </td>
                    <td data-label="Estimasi" className="px-4 py-3 text-cream-dim">
                      {pkg.estimatedDuration}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
