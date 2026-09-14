import { NextRequest, NextResponse } from "next/server";
import { createPocketBase } from "@/lib/pocketbase";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const pb = createPocketBase();
  try {
    const auth = await pb.collection("administrators").authWithPassword(email, password);
    if (auth.record.role !== "admin") return NextResponse.json({ message: "Sin permisos de administración." }, { status: 403 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set("feria_admin", auth.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
    return response;
  } catch { return NextResponse.json({ message: "Credenciales inválidas." }, { status: 401 }); }
}
