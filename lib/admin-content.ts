import type PocketBase from "pocketbase";
import { definitions } from "./admin-fields";
import { instagramReelUrl } from "./instagram";

export function editableForm(collection: string, source: FormData) {
  const result = new FormData();
  for (const field of definitions[collection]) {
    const value = source.get(field.name);
    if (value === null || value instanceof File && value.size === 0) continue;
    if (field.type === "date" && typeof value === "string") {
      if (!value) { result.set(field.name, ""); continue; }
      const day = value.slice(0, 10);
      const date = new Date(`${day}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== day) throw new Error(`Revisá ${field.label.toLowerCase()}.`);
      result.set(field.name, date.toISOString());
    } else result.set(field.name, value);
  }
  if (source.has("published")) result.set("published", source.get("published") === "true" ? "true" : "false");
  if (source.has("priority")) {
    const priority = Number(source.get("priority"));
    if (!Number.isInteger(priority) || priority < 0 || priority > 9999) throw new Error("La prioridad debe ser un número entre 0 y 9999.");
    result.set("priority", String(priority));
  }
  if (collection === "schedule_entries" && source.has("guests")) result.set("guests", JSON.stringify(source.getAll("guests").filter(value => typeof value === "string" && value)));
  if (collection === "reels" && source.has("url")) {
    const url = instagramReelUrl(String(source.get("url")));
    if (!url) throw new Error("Ingresá un enlace válido de un reel de Instagram.");
    result.set("url", url);
  }
  return result;
}

export async function validateGuestRelations(pb: PocketBase, collection: string, data: FormData) {
  if (collection !== "schedule_entries" || !data.has("guests")) return;
  const ids = JSON.parse(String(data.get("guests"))) as string[];
  if (ids.length > 10 || ids.some(id => !/^[a-z0-9]{15}$/.test(id))) throw new Error("Revisá los invitados seleccionados.");
  await Promise.all(ids.map(id => pb.collection("guests").getOne(id)));
}
