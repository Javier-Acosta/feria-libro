import { getAdminClient } from "@/lib/admin";
import { defaultSettings, SETTINGS_ID, safeWebUrl } from "@/lib/settings";

export async function GET() {
  const pb = await getAdminClient();
  if (!pb) return Response.json({ message: "No autorizado." }, { status: 401 });
  try { return Response.json(await pb.collection("site_settings").getOne(SETTINGS_ID), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ message: "No se pudo cargar la configuración." }, { status: 502 }); }
}

export async function PATCH(request: Request) {
  const pb = await getAdminClient();
  if (!pb) return Response.json({ message: "No autorizado." }, { status: 401 });
  try {
    const source = await request.formData();
    const data = new FormData();
    for (const key of Object.keys(defaultSettings)) {
      const value = source.get(key);
      if (value === null || value instanceof File && value.size === 0) continue;
      if (key.endsWith("_color") && (typeof value !== "string" || !/^#[a-f0-9]{6}$/i.test(value))) throw new Error("Ingresá colores válidos, por ejemplo #ED8023.");
      if (key.endsWith("_url") && value && !safeWebUrl(String(value))) throw new Error("Los enlaces sociales deben comenzar con https://.");
      if (key.endsWith("_date") && value) {
        const day = String(value).slice(0, 10);
        const date = new Date(`${day}T00:00:00Z`);
        if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== day) throw new Error("Revisá las fechas de la Feria.");
        data.set(key, date.toISOString());
      } else data.set(key, value);
    }
    if (source.get("remove_logo") === "true" && !(data.get("logo") instanceof File)) data.set("logo", "");
    const current = await pb.collection("site_settings").getOne(SETTINGS_ID);
    const start = data.has("start_date") ? String(data.get("start_date")) : current.start_date;
    const end = data.has("end_date") ? String(data.get("end_date")) : current.end_date;
    if (end && (!start || end < start)) throw new Error("La fecha final debe ser igual o posterior a la inicial.");
    return Response.json(await pb.collection("site_settings").update(SETTINGS_ID, data));
  } catch (error) {
    const message = error instanceof Error && !('status' in error) ? error.message : "No se pudo guardar. Revisá los datos, los dominios de las redes y el archivo del logo.";
    return Response.json({ message }, { status: 400 });
  }
}
