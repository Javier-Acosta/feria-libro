import { getAdminClient } from "@/lib/admin";
import { fetchInstagramCover, instagramReelUrl } from "@/lib/instagram";

export async function POST(request: Request) {
  if (!await getAdminClient()) return Response.json({ message: "No autorizado." }, { status: 401 });
  let value: unknown;
  try { value = (await request.json()).url; } catch { return Response.json({ message: "Enlace inválido." }, { status: 400 }); }
  if (typeof value !== "string" || !instagramReelUrl(value)) return Response.json({ message: "Pegá un enlace https://www.instagram.com/reel/…" }, { status: 400 });
  const cover = await fetchInstagramCover(value);
  if (!cover) return Response.json({ message: "Instagram no permitió obtener la portada de este reel. Podés subir una imagen o guardar el enlace sin portada." }, { status: 422 });
  return new Response(new Uint8Array(cover.bytes), { headers: { "Content-Type": cover.type, "Cache-Control": "no-store" } });
}
