import * as React from "react";
import { Form, useActionData } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { Route } from "./+types/admin.tanya-jawab";
import { AdminFeedbackBanner } from "~/components/admin/admin-feedback-banner";
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
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  deleteFaqRecord,
  getAdminFaqsData,
  upsertFaqRecord,
} from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { parseOptionalId, parsePositiveInt } from "~/lib/validations";
import type { FaqItem } from "~/types/content";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  return getAdminFaqsData(env.DB);
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = await requireAdminAccess(request, context);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "save-faq") {
    const question = String(formData.get("question") ?? "").trim();
    const answer = String(formData.get("answer") ?? "").trim();

    if (!question || !answer) {
      return {
        ok: false,
        error: "Pertanyaan dan jawaban wajib diisi.",
      };
    }

    await upsertFaqRecord(env.DB, {
      id: parseOptionalId(formData.get("id")),
      question,
      answer,
      isPublished: formData.get("isPublished") === "on",
      sortOrder: parsePositiveInt(formData.get("sortOrder"), 1),
    });

    return { ok: true, savedMessage: "Tanya jawab berhasil disimpan." };
  }

  if (intent === "delete-faq") {
    const id = parseOptionalId(formData.get("id"));
    if (id) {
      await deleteFaqRecord(env.DB, id);
    }
    return { ok: true, savedMessage: "Pertanyaan berhasil dihapus." };
  }

  return null;
}

export default function AdminTanyaJawabRoute({
  loaderData,
}: Route.ComponentProps) {
  const { faqs } = loaderData;
  const actionData = useActionData<typeof action>();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FaqItem | null>(null);
  const [isPublished, setIsPublished] = React.useState(true);
  const [deleting, setDeleting] = React.useState<FaqItem | null>(null);
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (actionData?.ok) {
      setDialogOpen(false);
    }
  }, [actionData]);

  const openCreate = () => {
    setEditing(null);
    setIsPublished(true);
    setDialogOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditing(item);
    setIsPublished(item.isPublished);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
            Tanya Jawab
          </h1>
          <p className="mt-2 text-[14.5px] text-cream-dim">
            Kelola pertanyaan umum seputar termin pembayaran, revisi, kepemilikan domain, dan masa garansi.
          </p>
        </div>
        <Button onClick={openCreate}>Tambah Pertanyaan</Button>
      </div>

      <AdminFeedbackBanner
        message={actionData?.savedMessage}
        error={actionData?.error}
      />

      <div
        tabIndex={0}
        role="region"
        aria-labelledby="faqs-table-caption"
        className="admin-table-region rounded-[5px] border border-line bg-bg2"
      >
        <table className="admin-responsive-table w-full text-left text-[13.5px]">
          <caption id="faqs-table-caption" className="sr-only">
            Daftar tanya jawab layanan
          </caption>
          <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Pertanyaan
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Urutan
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-bg">
            {faqs.map((item) => (
              <tr key={item.id}>
                <th scope="row" className="px-4 py-3.5 font-semibold text-cream">
                  {item.question}
                </th>
                <td
                  data-label="Urutan"
                  className="tabular-price px-4 py-3.5 text-cream-dim"
                >
                  {item.sortOrder}
                </td>
                <td data-label="Status" className="px-4 py-3.5">
                  <span
                    className={
                      item.isPublished
                        ? "rounded-[3px] border border-rust bg-bg2 px-2 py-0.5 text-[12px] text-cream"
                        : "rounded-[3px] border border-line bg-bg2 px-2 py-0.5 text-[12px] text-cream-dim"
                    }
                  >
                    {item.isPublished ? "Publik" : "Draf"}
                  </span>
                </td>
                <td data-label="Aksi" className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Ubah pertanyaan ${item.question}`}
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Hapus pertanyaan ${item.question}`}
                      onClick={() => setDeleting(item)}
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
              {editing ? "Ubah Tanya Jawab" : "Tambah Tanya Jawab"}
            </DialogTitle>
            <DialogDescription>
              Tulis jawaban yang lugas dan menjawab kebutuhan informasi calon klien sebelum memulai proyek.
            </DialogDescription>
          </DialogHeader>

          <Form method="post" className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="intent" value="save-faq" />
            {editing ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}
            {isPublished ? (
              <input type="hidden" name="isPublished" value="on" />
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="faq-q">Pertanyaan</Label>
              <Input
                id="faq-q"
                name="question"
                autoFocus
                required
                defaultValue={editing?.question ?? ""}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="faq-a">Jawaban</Label>
              <Textarea
                id="faq-a"
                name="answer"
                rows={4}
                required
                defaultValue={editing?.answer ?? ""}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="faq-sort">Urutan Tampil</Label>
                <Input
                  id="faq-sort"
                  type="number"
                  name="sortOrder"
                  min={1}
                  required
                  defaultValue={editing?.sortOrder ?? faqs.length + 1}
                />
              </div>

              <div className="flex items-center justify-between rounded-[4px] border border-line bg-bg px-4 py-3 sm:mt-5">
                <Label htmlFor="faq-pub-switch">Tampilkan di Publik</Label>
                <Switch
                  id="faq-pub-switch"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
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
        <input type="hidden" name="intent" value="delete-faq" />
        <input type="hidden" name="id" value={deleting?.id ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus Tanya Jawab"
        description={`Apakah Anda yakin ingin menghapus pertanyaan "${deleting?.question ?? ""}"?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeleting(null);
        }}
      />
    </div>
  );
}
