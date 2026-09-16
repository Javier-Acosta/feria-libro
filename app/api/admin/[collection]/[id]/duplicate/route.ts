import { getAdminClient } from "@/lib/admin";
import { definitions, isCollection } from "@/lib/admin-fields";
import { limitedBody } from "@/lib/instagram";

export async function POST(_: Request, context: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await context.params;
  const pb = await getAdminClient();
  if (!pb || !isCollection(collection)) return Response.json({ message: "No autorizado." }, { status: 401 });
  try {
    const original = await pb.collection(collection).getOne(id);
    const data = new FormData();
    for (const field of definitions[collection]) {
      const value = original[field.name];
      if (field.type === "file") {
        if (!value) continue;
        const response = await fetch(pb.files.getURL(original, value), { redirect: "error", signal: AbortSignal.timeout(10000), cache: "no-store" });
        if (!response.ok) throw new Error("No se pudo copiar el archivo.");
        const bytes = await limitedBody(response, 10 * 1024 * 1024);
        data.set(field.name, new Blob([new Uint8Array(bytes)], { type: response.headers.get("content-type") ?? "application/octet-stream" }), value);
      } else if (field.name === "title" || field.name === "name") data.set(field.name, `${String(value).slice(0, 110)} (copia)`);
      else data.set(field.name, String(value ?? ""));
    }
    if (collection === "schedule_entries") data.set("guests", JSON.stringify(original.guests ?? []));
    data.set("published", "false"); data.set("priority", "0");
    return Response.json(await pb.collection(collection).create(data));
  } catch { return Response.json({ message: "No se pudo duplicar. Verificá que el contenido y sus archivos estén disponibles." }, { status: 400 }); }
}
