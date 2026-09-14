import { cookies } from "next/headers";
import { createPocketBase } from "./pocketbase";

export async function getAdminClient() {
  const token = (await cookies()).get("feria_admin")?.value;
  if (!token) return null;
  const pb = createPocketBase();
  pb.authStore.save(token);
  try { const auth = await pb.collection("administrators").authRefresh(); return auth.record.role === "admin" ? pb : null; } catch { return null; }
}
