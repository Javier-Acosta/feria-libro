import Link from "next/link";
import { fileUrl, type Guest } from "@/lib/content";
import { PresentationDate } from "./presentation-date";

export function GuestCard({ guest }: { guest: Guest }) {
  return <article className="guest-card"><Link className="guest-card-link" href={`/invitados/${guest.id}`} aria-label={`Ver perfil de ${guest.name}`}>
    {guest.photo ? <img src={fileUrl(guest.collectionId, guest.id, guest.photo)} alt={guest.name} loading="lazy" /> : <div className="portrait-placeholder" aria-hidden="true" />}
    <PresentationDate value={guest.presentation_date} /><h3>{guest.name}</h3>
  </Link></article>;
}
