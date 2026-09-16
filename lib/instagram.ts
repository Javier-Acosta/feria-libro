export function instagramReelUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port || !["instagram.com", "www.instagram.com"].includes(url.hostname)) return null;
    const match = url.pathname.match(/^\/reels?\/([A-Za-z0-9_-]+)\/?$/);
    return match ? `https://www.instagram.com/reel/${match[1]}/` : null;
  } catch { return null; }
}

export async function limitedBody(response: Response, maxBytes: number) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Respuesta vacía.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > maxBytes) throw new Error("Archivo demasiado grande.");
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks);
}

function decodeEntities(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

export function instagramImageUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.port || url.username || url.password) return null;
    return url.hostname.endsWith(".cdninstagram.com") || url.hostname.endsWith(".fbcdn.net") ? url.href : null;
  } catch { return null; }
}

export async function fetchInstagramCover(value: string): Promise<{ bytes: Buffer; type: string } | null> {
  const url = instagramReelUrl(value);
  if (!url) return null;
  try {
    const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(8000), cache: "no-store", headers: { Accept: "text/html" } });
    if (!response.ok) return null;
    const html = (await limitedBody(response, 3 * 1024 * 1024)).toString("utf8");
    const meta = html.match(/<meta\b[^>]*\bproperty=["']og:image["'][^>]*>/i)?.[0];
    const raw = meta?.match(/\bcontent=["']([^"']+)["']/i)?.[1];
    const imageUrl = raw && instagramImageUrl(decodeEntities(raw));
    if (!imageUrl) return null;
    const image = await fetch(imageUrl, { redirect: "error", signal: AbortSignal.timeout(8000), cache: "no-store" });
    const type = image.headers.get("content-type")?.split(";")[0] ?? "";
    if (!image.ok || !["image/jpeg", "image/png", "image/webp"].includes(type)) return null;
    return { bytes: await limitedBody(image, 5 * 1024 * 1024), type };
  } catch { return null; }
}
