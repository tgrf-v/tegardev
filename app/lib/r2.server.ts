import type { MediaAsset } from "~/types/content";

export const MAX_MEDIA_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MEDIA_MIME_TYPES = new Set([
  "image/webp",
  "image/avif",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
]);

function sanitizeFilename(name: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "gambar.webp";
}

export async function uploadMediaToR2(
  bucket: R2Bucket,
  file: File,
): Promise<{ ok: true; asset: MediaAsset } | { ok: false; error: string }> {
  if (!file || file.size === 0) {
    return { ok: false, error: "Pilih berkas gambar terlebih dahulu." };
  }

  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    return {
      ok: false,
      error: "Ukuran berkas melebihi batas maksimal 5 MB.",
    };
  }

  if (!ALLOWED_MEDIA_MIME_TYPES.has(file.type)) {
    return {
      ok: false,
      error:
        "Format berkas tidak didukung. Gunakan WebP, AVIF, PNG, JPG, atau SVG.",
    };
  }

  const safeFilename = sanitizeFilename(file.name);
  const objectKey = `proyek/${Date.now()}-${safeFilename}`;
  const buffer = await file.arrayBuffer();

  await bucket.put(objectKey, buffer, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const now = new Date().toISOString();

  return {
    ok: true,
    asset: {
      key: objectKey,
      filename: safeFilename,
      url: `/r2/${objectKey}`,
      mimeType: file.type,
      sizeBytes: file.size,
      width: null,
      height: null,
      createdAt: now,
    },
  };
}

export async function deleteObjectFromR2IfManaged(
  bucket: R2Bucket,
  asset: Pick<MediaAsset, "key" | "url">,
): Promise<void> {
  if (asset.url.startsWith("/r2/")) {
    await bucket.delete(asset.key);
  }
}

export async function serveR2ObjectResponse(
  request: Request,
  bucket: R2Bucket,
  objectKey: string,
): Promise<Response> {
  const normalizedKey = objectKey.replace(/^\/+/, "");
  if (!normalizedKey || normalizedKey.includes("..")) {
    return new Response("Berkas tidak ditemukan.", { status: 404 });
  }

  const object = await bucket.get(normalizedKey);
  if (!object) {
    return new Response("Berkas tidak ditemukan.", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/octet-stream");
  }
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");

  const contentType = headers.get("Content-Type") ?? "";
  if (contentType.includes("svg")) {
    headers.set(
      "Content-Security-Policy",
      "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    );
  }

  const ifNoneMatch = request.headers.get("If-None-Match");
  if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }

  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }

  return new Response(object.body, {
    status: 200,
    headers,
  });
}
