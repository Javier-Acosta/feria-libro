import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/admin";
const allowed = ["news", "guests", "schedule_entries", "venue_maps"];
async function authorize(collection: string) { const pb = await getAdminClient(); return pb && allowed.includes(collection) ? pb : null; }
export async function GET(_: NextRequest, context: RouteContext<"/api/admin/[collection]">) { const { collection } = await context.params; const pb = await authorize(collection); if (!pb) return NextResponse.json({ message:"No autorizado" }, { status:401 }); return NextResponse.json(await pb.collection(collection).getFullList({ sort:"-created", expand:"guests" })); }
export async function POST(request: NextRequest, context: RouteContext<"/api/admin/[collection]">) { const { collection } = await context.params; const pb = await authorize(collection); if (!pb) return NextResponse.json({ message:"No autorizado" }, { status:401 }); try { return NextResponse.json(await pb.collection(collection).create(await request.formData())); } catch (error) { return NextResponse.json({ message:"Revisá los campos requeridos.", error }, { status:400 }); } }
