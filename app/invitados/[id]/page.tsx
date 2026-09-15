import Link from "next/link";
import { PresentationDate } from "@/components/presentation-date";
import { notFound } from "next/navigation";
import { createPocketBase } from "@/lib/pocketbase";
import { fileUrl, type Guest } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function GuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9]{15}$/.test(id)) notFound();
  const pb = createPocketBase();
  const guest = await pb.collection("guests").getOne<Guest>(id).catch((error: unknown) => {
    if (error && typeof error === "object" && "status" in error && error.status === 404) return null;
    throw error;
  });
  if (!guest) notFound();

  return <main>
    <nav className="nav" aria-label="Navegación principal">
      <Link href="/" className="brand">FERIA<br />DEL LIBRO</Link>
      <Link href="/#invitados">Todos los invitados</Link>
    </nav>
    <article className="news-detail">
      <Link className="news-back" href="/#invitados">← Volver a invitados</Link>
      <p className="eyebrow orange">VOCES INVITADAS</p>
      <PresentationDate value={guest.presentation_date} /><h1>{guest.name}</h1>
      {guest.participation && <p className="news-detail-summary">{guest.participation}</p>}
      {guest.photo && <img className="guest-detail-photo" src={fileUrl(guest.collectionId, guest.id, guest.photo)} alt={guest.name} />}
      <div className="news-body" dangerouslySetInnerHTML={{ __html: guest.bio }} />
    </article>
  </main>;
}
