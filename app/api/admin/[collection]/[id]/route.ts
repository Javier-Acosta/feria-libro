import { getAdminClient } from "@/lib/admin";
import { isCollection } from "@/lib/admin-fields";
import { editableForm, validateGuestRelations } from "@/lib/admin-content";

export async function PATCH(request: Request, context: RouteContext<"/api/admin/[collection]/[id]">) {
  const { collection, id } = await context.params;
  const pb = await getAdminClient();
  if (!pb || !isCollection(collection)) return Response.json({ message: "No autorizado." }, { status: 401 });
  try {
    const data = editableForm(collection, await request.formData());
    await validateGuestRelations(pb, collection, data);
    return Response.json(await pb.collection(collection).update(id, data));
  } catch { return Response.json({ message: "No se pudo guardar. Revisá los campos, el enlace y el archivo seleccionado." }, { status: 400 }); }
}

export async function DELETE(_: Request, context: RouteContext<"/api/admin/[collection]/[id]">) {
  const { collection, id } = await context.params;
  const pb = await getAdminClient();
  if (!pb || !isCollection(collection)) return Response.json({ message: "No autorizado." }, { status: 401 });
  try { await pb.collection(collection).delete(id); return Response.json({ ok: true }); }
  catch { return Response.json({ message: "No se pudo eliminar el contenido." }, { status: 400 }); }
}
