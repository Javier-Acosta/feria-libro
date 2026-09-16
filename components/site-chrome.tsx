import Link from "next/link";
import { getSiteSettings, safeWebUrl } from "@/lib/settings";
import { fileUrl } from "@/lib/pocketbase";

export async function SiteHeader({ home = false }: { home?: boolean }) {
  const settings = await getSiteSettings();
  return <nav className="nav" aria-label="Navegación principal">
    <Link href={home ? "#inicio" : "/"} className="brand">
      {settings.logo && settings.id && settings.collectionId
        ? <img className="site-logo" src={fileUrl(settings.collectionId, settings.id, settings.logo)} alt={settings.site_name} />
        : settings.site_name}
    </Link>
    <div className="nav-links"><Link href="/#agenda">Agenda</Link><Link href="/invitados/">Invitados</Link><Link href="/noticias/">Noticias</Link><Link href="/#mapa">Mapa</Link></div>
    <Link className="admin-link" href="/admin">Administración</Link>
  </nav>;
}

export async function SiteFooter() {
  const settings = await getSiteSettings();
  return <footer><strong>{settings.site_name}</strong><span>{settings.footer_text}</span>
    <div className="social-links">{[["Instagram", settings.instagram_url], ["Facebook", settings.facebook_url], ["YouTube", settings.youtube_url]].map(([label, value]) => {
      const url = safeWebUrl(value);
      return url ? <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a> : null;
    })}</div><Link href="/admin">Acceso administración</Link>
  </footer>;
}

export async function EventInfo() {
  const settings = await getSiteSettings();
  const format = (value: string) => {
    const date = new Date(`${value.slice(0, 10)}T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  };
  if (!settings.start_date && !settings.venues) return null;
  return <div className="event-info">
    {settings.start_date && <p><strong>Fechas</strong><span>{format(settings.start_date)}{settings.end_date && settings.end_date !== settings.start_date ? ` al ${format(settings.end_date)}` : ""}</span></p>}
    {settings.venues && <p><strong>Sedes</strong><span>{settings.venues}</span></p>}
  </div>;
}
