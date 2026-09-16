"use client";
import { fileUrl } from "@/lib/pocketbase";

export type ContentRecord = Record<string, unknown> & { id: string; collectionId?: string; title?: string; name?: string; published?: boolean; priority?: number; guests?: string[] };

function escape(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function ContentPreview({ record, image, collection }: { record: ContentRecord; image?: string; collection: string }) {
  const file = String(record.image || record.photo || record.file || "");
  const source = image || (file && record.collectionId && fileUrl(record.collectionId, record.id, file));
  const isPdf = file.toLowerCase().endsWith(".pdf");
  const title = record.title || record.name || "Sin título";
  const text = record.content || record.bio || "";
  const date = String(record.presentation_date || record.published_on || record.event_date || "").slice(0, 10);
  const srcDoc = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: http://127.0.0.1:8090 blob: data:; style-src 'unsafe-inline';"><style>body{font-family:Arial;color:#101128;background:#f7f4ee;margin:0;padding:28px;line-height:1.6}article{max-width:760px;margin:auto}h1{font-size:32px;line-height:1.15}img{display:block;max-width:100%;max-height:450px;height:auto;margin:24px auto}p{white-space:pre-wrap}.body{text-align:justify;overflow-wrap:anywhere}small{color:#865000}.summary{font-size:20px}a{color:#a84c00}pre{white-space:pre-wrap}table{max-width:100%}</style></head><body><article><small>VISTA PREVIA · ${record.published ? "PUBLICADO" : "BORRADOR"}</small>${date ? `<p>${escape(date)}</p>` : ""}<h1>${escape(title)}</h1>${record.summary || record.participation ? `<p class="summary">${escape(record.summary || record.participation)}</p>` : ""}${source && !isPdf ? `<img src="${escape(source)}" alt="${escape(title)}">` : ""}${isPdf ? "<p>El mapa es un archivo PDF. Se abrirá desde el sitio.</p>" : ""}<div class="body">${text}</div>${collection === "schedule_entries" ? `<p>${escape(record.event_time)} · ${escape(record.venue)}</p>` : ""}${collection === "reels" ? `<p>Ver reel en Instagram ↗</p><p>${escape(record.url)}</p>` : ""}</article></body></html>`;
  return <iframe className="content-preview" title={`Vista previa: ${title}`} sandbox="" srcDoc={srcDoc} />;
}
