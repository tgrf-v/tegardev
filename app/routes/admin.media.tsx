import * as React from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Copy, Trash2 } from "lucide-react";
import type { Route } from "./+types/admin.media";
import { AdminFeedbackBanner } from "~/components/admin/admin-feedback-banner";
import { ConfirmDeleteDialog } from "~/components/admin/confirm-delete-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  deleteMediaAssetWithGuard,
  getAdminMediaData,
  insertMediaAssetRecord,
} from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { uploadMediaToR2 } from "~/lib/r2.server";
import type { MediaAsset } from "~/types/content";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  return getAdminMediaData(env.DB);
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = await requireAdminAccess(request, context);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "upload-media") {
    const fileEntry = formData.get("file");
    if (!(fileEntry instanceof File) || fileEntry.size === 0) {
      return {
        ok: false,
        error: "Pilih berkas gambar terlebih dahulu sebelum mengunggah.",
      };
    }

    const uploadResult = await uploadMediaToR2(env.MEDIA_BUCKET, fileEntry);
    if (!uploadResult.ok) {
      return { ok: false, error: uploadResult.error };
    }

    await insertMediaAssetRecord(env.DB, uploadResult.asset);
    return {
      ok: true,
      savedMessage: `Berkas ${uploadResult.asset.filename} berhasil diunggah ke Cloudflare R2.`,
    };
  }

  if (intent === "delete-media") {
    const key = String(formData.get("key") ?? "").trim();
    if (!key) return null;

    const deleteResult = await deleteMediaAssetWithGuard(
      env.DB,
      env.MEDIA_BUCKET,
      key,
    );
    if (!deleteResult.ok) {
      return { ok: false, error: deleteResult.error };
    }

    return { ok: true, savedMessage: "Berkas media berhasil dihapus." };
  }

  return null;
}

export default function AdminMediaRoute({ loaderData }: Route.ComponentProps) {
  const { media, usedUrls } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<MediaAsset | null>(null);
  const uploadFormRef = React.useRef<HTMLFormElement | null>(null);
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  const isUploading =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "upload-media";

  React.useEffect(() => {
    if (actionData?.ok) {
      uploadFormRef.current?.reset();
    }
  }, [actionData]);

  const usedUrlSet = React.useMemo(() => new Set(usedUrls), [usedUrls]);

  const handleCopy = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedKey(asset.key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Abaikan bila clipboard tidak diizinkan oleh browser
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
          Media R2
        </h1>
        <p className="mt-2 text-[14.5px] text-cream-dim">
          Unggah gambar tangkapan layar proyek langsung ke bucket Cloudflare R2 untuk digunakan pada portofolio.
        </p>
      </div>

      <AdminFeedbackBanner
        message={actionData?.savedMessage}
        error={actionData?.error}
      />

      <Form
        ref={uploadFormRef}
        method="post"
        encType="multipart/form-data"
        className="grid grid-cols-1 gap-4 rounded-[5px] border border-line bg-bg2 p-6 md:grid-cols-12 md:items-end"
      >
        <input type="hidden" name="intent" value="upload-media" />
        <div className="flex flex-col gap-1.5 md:col-span-9">
          <Label htmlFor="media-file-input">Pilih Berkas Gambar</Label>
          <span id="media-file-hint" className="text-[12.5px] text-cream-dim">
            Mendukung format WebP, AVIF, PNG, JPG, atau SVG dengan ukuran maksimal 5 MB.
          </span>
          <Input
            id="media-file-input"
            type="file"
            name="file"
            aria-describedby="media-file-hint"
            required
            accept="image/webp,image/avif,image/png,image/jpeg,image/svg+xml"
            className="py-2 file:mr-3 file:rounded-[4px] file:border-0 file:bg-rust file:px-3 file:py-1 file:text-[12.5px] file:font-medium file:text-white"
          />
        </div>
        <div className="md:col-span-3">
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? "Mengunggah..." : "Unggah Gambar"}
          </Button>
        </div>
      </Form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((asset) => {
          const isInUse = usedUrlSet.has(asset.url);
          return (
            <article
              key={asset.key}
              className="flex flex-col justify-between overflow-hidden rounded-[5px] border border-line bg-bg2"
            >
              <div className="border-b border-line bg-bg p-3">
                <img
                  src={asset.url}
                  alt={asset.filename}
                  width={asset.width ?? 960}
                  height={asset.height ?? 600}
                  loading="lazy"
                  className="aspect-[16/10] w-full rounded-[3px] border border-line object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-cream">
                    {asset.filename}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-cream-dim">
                    <span className="tabular-price">
                      {(asset.sizeBytes / 1024).toFixed(1)} KB
                    </span>
                    {isInUse ? (
                      <span className="rounded-[3px] border border-rust px-1.5 py-0.5 text-[11px] text-cream">
                        Dipakai Proyek
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Salin URL ${asset.filename}`}
                    onClick={() => handleCopy(asset)}
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isInUse}
                    aria-label={`Hapus berkas ${asset.filename}`}
                    onClick={() => setDeleting(asset)}
                  >
                    <Trash2
                      className="h-3.5 w-3.5 text-rust"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>

              {copiedKey === asset.key ? (
                <p className="border-t border-line bg-bg px-4 py-1.5 text-[12px] text-rust">
                  URL disalin ke papan klip
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <Form method="post" ref={deleteFormRef} className="hidden">
        <input type="hidden" name="intent" value="delete-media" />
        <input type="hidden" name="key" value={deleting?.key ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus Berkas Media"
        description={`Apakah Anda yakin ingin menghapus berkas "${deleting?.filename ?? ""}" dari penyimpanan R2?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeleting(null);
        }}
      />
    </div>
  );
}
