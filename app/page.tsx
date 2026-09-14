import Link from "next/link";
import { Agenda } from "@/components/agenda";
import { fileUrl, getPublicContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { news, guests, schedule, map } = await getPublicContent();
  const days = new Set(schedule.map((entry) => entry.event_date)).size;
  return <main>
    <nav className="nav"><Link href="#inicio" className="brand">FERIA<br />DEL LIBRO</Link><div className="nav-links"><Link href="#agenda">Agenda</Link><Link href="#invitados">Invitados</Link><Link href="#noticias">Noticias</Link><Link href="#mapa">Mapa</Link></div><Link className="admin-link" href="/admin">Administración</Link></nav>
    <section id="inicio" className="hero"><div className="hero-shape shape-pink" /><div className="hero-shape shape-red" /><div className="hero-shape shape-dark" /><p className="eyebrow">UNA CELEBRACIÓN DE LAS IDEAS</p><h1>FERIA<br /><span>DEL LIBRO</span></h1><p className="hero-copy">Encuentros, autores y nuevas historias. Toda la programación de la Feria, en un solo lugar.</p><a className="hero-cta" href="#agenda">Ver agenda completa <span>→</span></a><div className="stats"><div><small>EVENTOS</small><strong>{schedule.length}</strong></div><div><small>INVITADOS</small><strong>{guests.length}</strong></div><div><small>DÍAS</small><strong>{days}</strong></div><a href="#agenda">Explorar programación →</a></div></section>
    <section id="agenda" className="section agenda-section"><p className="eyebrow blue">PROGRAMACIÓN</p><h2>Elegí un día y <em>viví la Feria.</em></h2><Agenda entries={schedule} /></section>
    <section id="invitados" className="section"><div className="section-heading"><div><p className="eyebrow orange">VOCES INVITADAS</p><h2>Autores y autoras<br /><em>destacadas.</em></h2></div><span>{guests.length} invitad{guests.length === 1 ? "o" : "os"}</span></div>{guests.length ? <div className="guest-grid">{guests.map((guest) => <article className="guest-card" key={guest.id}>{guest.photo ? <img src={fileUrl(guest.collectionId, guest.id, guest.photo)} alt={guest.name} /> : <div className="portrait-placeholder" />}<p>{guest.participation}</p><h3>{guest.name}</h3><div dangerouslySetInnerHTML={{ __html: guest.bio }} /></article>)}</div> : <Empty message="Muy pronto compartiremos los invitados especiales de esta edición." />}</section>
    <section id="noticias" className="section news-section"><p className="eyebrow pink">AL DÍA</p><h2>Noticias de la Feria</h2>{news.length ? <div className="news-grid">{news.map((item) => <article className="news-card" key={item.id}>{item.image && <img src={fileUrl(item.collectionId, item.id, item.image)} alt="" />}<time>{new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.published_on))}</time><h3>{item.title}</h3><p>{item.summary}</p></article>)}</div> : <Empty message="Las novedades diarias aparecerán aquí durante el evento." />}</section>
    <section id="mapa" className="map-section"><div><p className="eyebrow">PARA ORIENTARTE</p><h2>Mapa de la Feria</h2><p>Ubicá salas, espacios y servicios para aprovechar cada recorrido.</p>{map ? <a className="light-button" href={fileUrl(map.collectionId, map.id, map.file)} target="_blank">Abrir {map.title} ↗</a> : <p className="map-pending">El mapa estará disponible próximamente.</p>}</div><div className="map-art"><span>F</span><span>L</span><span>→</span></div></section>
    <footer><strong>FERIA DEL LIBRO</strong><span>Un espacio para encontrarnos alrededor de las palabras.</span><Link href="/admin">Acceso administración</Link></footer>
  </main>;
}
function Empty({ message }: { message: string }) { return <p className="empty">{message}</p>; }
