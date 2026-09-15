import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/admin";
export default async function AdminLayout({ children }: { children: React.ReactNode }) { if (!await getAdminClient()) redirect("/admin/login"); return <main className="admin-shell"><aside><Link href="/" className="brand">FERIA<br />DEL LIBRO</Link><p>Administración</p><Link href="/admin/banners">Banner</Link><Link href="/admin/news">Noticias</Link><Link href="/admin/guests">Invitados</Link><Link href="/admin/schedule_entries">Agenda</Link><Link href="/admin/reels">Reels</Link><Link href="/admin/venue_maps">Mapa</Link><form action="/api/auth/logout" method="post"><button>Cerrar sesión</button></form></aside><section>{children}</section></main>; }
