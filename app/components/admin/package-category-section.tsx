import * as React from "react";
import { Form } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "~/components/admin/confirm-delete-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { PackageCategory } from "~/types/content";

interface PackageCategorySectionProps {
  categories: PackageCategory[];
  packageCountsByCategory: Record<number, number>;
}

export function PackageCategorySection({
  categories,
  packageCountsByCategory,
}: PackageCategorySectionProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PackageCategory | null>(null);
  const [deleting, setDeleting] = React.useState<PackageCategory | null>(null);
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (category: PackageCategory) => {
    setEditing(category);
    setDialogOpen(true);
  };

  return (
    <section className="rounded-[5px] border border-line bg-bg2 p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[18px] font-semibold text-cream">
            Kategori Daftar Harga
          </h2>
          <p className="mt-1 text-[13.5px] text-cream-dim">
            Tab pengelompokan paket yang tampil pada seksi Daftar Harga.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={openCreate}>
          Tambah Kategori
        </Button>
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-labelledby="categories-table-caption"
        className="admin-table-region rounded-[4px] border border-line"
      >
        <table className="admin-responsive-table w-full text-left text-[13.5px]">
          <caption id="categories-table-caption" className="sr-only">
            Daftar kategori paket layanan
          </caption>
          <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Nama Kategori
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Jumlah Paket
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Urutan Tab
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-bg">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <th scope="row" className="px-4 py-3 font-semibold text-cream">
                  {cat.name}
                </th>
                <td
                  data-label="Jumlah Paket"
                  className="tabular-price px-4 py-3 text-cream-dim"
                >
                  {packageCountsByCategory[cat.id] ?? 0} paket
                </td>
                <td
                  data-label="Urutan Tab"
                  className="tabular-price px-4 py-3 text-cream-dim"
                >
                  {cat.sortOrder}
                </td>
                <td data-label="Aksi" className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Ubah kategori ${cat.name}`}
                      onClick={() => openEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Hapus kategori ${cat.name}`}
                      onClick={() => setDeleting(cat)}
                    >
                      <Trash2
                        className="h-3.5 w-3.5 text-rust"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Ubah Kategori Paket" : "Tambah Kategori Paket"}
            </DialogTitle>
            <DialogDescription>
              Atur label tab kategori dan urutan kemunculannya di Daftar Harga.
            </DialogDescription>
          </DialogHeader>

          <Form
            method="post"
            onSubmit={() => setDialogOpen(false)}
            className="mt-5 flex flex-col gap-4"
          >
            <input type="hidden" name="intent" value="save-category" />
            {editing ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}
            <input type="hidden" name="slug" value={editing?.slug ?? ""} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-name">Nama Kategori</Label>
              <Input
                id="cat-name"
                name="name"
                autoFocus
                required
                placeholder="Contoh: Pendidikan & Instansi"
                defaultValue={editing?.name ?? ""}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-sort">Urutan Tab</Label>
              <Input
                id="cat-sort"
                type="number"
                name="sortOrder"
                min={1}
                required
                defaultValue={editing?.sortOrder ?? categories.length + 1}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <Form method="post" ref={deleteFormRef} className="hidden">
        <input type="hidden" name="intent" value="delete-category" />
        <input type="hidden" name="id" value={deleting?.id ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleting?.name ?? ""}"?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeleting(null);
        }}
      />
    </section>
  );
}
