import { getAdminClient } from "@/lib/admin";
import { contentSort, isCollection } from "@/lib/admin-fields";
import { editableForm, validateGuestRelations } from "@/lib/admin-content";

export async function GET(_: Request, context: RouteContext<"/api/admin/[collection]">) {
  const { collection } = await context.params;
  const pb = await getAdminClient();
  if (!pb || !isCollection(collection)) return Response.json({ message: "No autorizado." }, { status: 401 });
  try {
    const records = await pb.collection(collection).getFullList({ sort: contentSort(collection), ...(collection === "schedule_entries" ? { expand: "guests" } : {}) });
    return Response.json(records, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ message: "No se pudo cargar el contenido. Volvé a intentar." }, { status: 502 }); }
}

export async function POST(request: Request, context: RouteContext<"/api/admin/[collection]">) {
  const { collection } = await context.params;
  const pb = await getAdminClient();
  if (!pb || !isCollection(collection)) return Response.json({ message: "No autorizado." }, { status: 401 });
  try {
    const data = editableForm(collection, await request.formData());
    await validateGuestRelations(pb, collection, data);
    return Response.json(await pb.collection(collection).create(data));
  } catch { return Response.json({ message: "No se pudo guardar. Revisá los campos obligatorios, el enlace y el tamaño o formato de la imagen." }, { status: 400 }); }
}
