import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/admin";
const allowed = ["news", "guests", "schedule_entries", "venue_maps", "banners", "reels"];
async function authorize(collection: string) { const pb = await getAdminClient(); return pb && allowed.includes(collection) ? pb : null; }
export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/[collection]/[id]">) { const { collection, id } = await context.params; const pb = await authorize(collection); if (!pb) return NextResponse.json({ message:"No autorizado" }, { status:401 }); try { return NextResponse.json(await pb.collection(collection).update(id, await request.formData())); } catch { return NextResponse.json({ message:"No se pudo guardar." }, { status:400 }); } }
export async function DELETE(_: NextRequest, context: RouteContext<"/api/admin/[collection]/[id]">) { const { collection, id } = await context.params; const pb = await authorize(collection); if (!pb) return NextResponse.json({ message:"No autorizado" }, { status:401 }); await pb.collection(collection).delete(id); return NextResponse.json({ ok:true }); }
