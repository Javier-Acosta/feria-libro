import { createPocketBase } from "@/lib/pocketbase";
import type { Guest } from "@/lib/content";
import { contentSort } from "@/lib/admin-fields";
import { GuestCard } from "@/components/guest-card";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invitados | Feria del Libro" };

export default async function GuestsIndex() {
  const guests = await createPocketBase().collection("guests").getFullList<Guest>({ filter: "published = true", sort: contentSort("guests") });
  return <main><SiteHeader /><section className="section guests-section news-index">
    <p className="eyebrow orange">VOCES INVITADAS</p><h1>Todos los invitados</h1>
    {guests.length ? <div className="guest-grid">{guests.map(guest => <GuestCard key={guest.id} guest={guest} />)}</div> : <p className="empty">Muy pronto compartiremos los invitados de esta edición.</p>}
  </section><SiteFooter /></main>;
}
