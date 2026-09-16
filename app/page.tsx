import Link from "next/link";
import { GuestCard } from "@/components/guest-card";
import { SiteHeader, SiteFooter, EventInfo } from "@/components/site-chrome";
import { Agenda } from "@/components/agenda";
import { fileUrl, getPublicContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { news, guests, schedule, map, banner, reels } = await getPublicContent();
  const days = new Set(schedule.map((entry) => entry.event_date)).size;
  return <main>
    <SiteHeader home />
    {banner ? <section id="inicio" className="home-banner"><h1 className="sr-only">{banner.title}</h1><img src={fileUrl(banner.collectionId, banner.id, banner.image)} alt={banner.title} fetchPriority="high" /><div className="banner-actions"><a className="hero-cta" href="#agenda">Ver agenda completa →</a></div></section> : <section id="inicio" className="hero"><div className="hero-shape shape-pink" /><div className="hero-shape shape-red" /><div className="hero-shape shape-dark" /><p className="eyebrow">UNA CELEBRACIÓN DE LAS IDEAS</p><h1>FERIA<br /><span>DEL LIBRO</span></h1><p className="hero-copy">Encuentros, autores y nuevas historias. Toda la programación de la Feria, en un solo lugar.</p><a className="hero-cta" href="#agenda">Ver agenda completa <span>→</span></a><div className="stats"><div><small>EVENTOS</small><strong>{schedule.length}</strong></div><div><small>INVITADOS</small><strong>{guests.length}</strong></div><div><small>DÍAS</small><strong>{days}</strong></div><a href="#agenda">Explorar programación →</a></div></section>}
    <EventInfo />
    <section id="agenda" className="section agenda-section"><p className="eyebrow blue">PROGRAMACIÓN</p><h2>Elegí un día y <em>viví la Feria.</em></h2><Agenda entries={schedule} /></section>
    <section id="invitados" className="section guests-section"><div className="section-heading"><div><p className="eyebrow orange">VOCES INVITADAS</p><h2>Autores y autoras<br /><em>destacadas.</em></h2></div><span>{guests.length} invitad{guests.length === 1 ? "o" : "os"}</span></div><div className="guest-all-link"><Link className="news-view-all" href="/invitados/">Ver todos →</Link></div>{guests.length ? <div className="guest-grid">{guests.slice(0, 6).map(guest => <GuestCard key={guest.id} guest={guest} />)}</div> : <Empty message="Muy pronto compartiremos los invitados especiales de esta edición." />}</section>
    <section id="noticias" className="section news-section"><div className="news-section-heading"><div><p className="eyebrow pink">AL DÍA</p><h2>Noticias de la Feria</h2></div><Link className="news-view-all" href="/noticias/">Ver todo →</Link></div>{news.length ? <div className="news-grid">{news.map((item) => <article className="news-card" key={item.id}><Link className="news-card-link" href={`/noticias/${item.id}`} aria-label={`Leer noticia: ${item.title}`}>{item.image && <img src={fileUrl(item.collectionId, item.id, item.image)} alt="" />}<time>{new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.published_on))}</time><h3>{item.title}</h3><p>{item.summary}</p><span className="news-read-more">Leer noticia →</span></Link></article>)}</div> : <Empty message="Las novedades diarias aparecerán aquí durante el evento." />}</section>
    <section id="instagram" className="section instagram-section"><div className="section-heading"><div><p className="eyebrow pink">MOMENTOS DE LA FERIA</p><h2>En Instagram</h2></div></div>{reels.length ? <div className="reel-strip">{reels.map(reel => <a className="reel-card" key={reel.id} href={reel.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${reel.title} en Instagram (abre una nueva pestaña)`}>{reel.image ? <img src={fileUrl(reel.collectionId, reel.id, reel.image)} alt="" loading="lazy" /> : <div className="reel-placeholder" aria-hidden="true">▶</div>}<span className="reel-caption"><strong>{reel.title}</strong><span>Ver reel en Instagram ↗</span></span><span className="reel-play" aria-hidden="true">▶</span></a>)}</div> : <Empty message="Muy pronto compartiremos los reels de la Feria." />}</section>
    <section id="mapa" className="map-section"><div><p className="eyebrow">PARA ORIENTARTE</p><h2>Mapa de la Feria</h2><p>Ubicá salas, espacios y servicios para aprovechar cada recorrido.</p>{map ? <a className="light-button" href={fileUrl(map.collectionId, map.id, map.file)} target="_blank">Abrir {map.title} ↗</a> : <p className="map-pending">El mapa estará disponible próximamente.</p>}</div><div className="map-art"><span>F</span><span>L</span><span>→</span></div></section>
    <SiteFooter />
  </main>;
}
function Empty({ message }: { message: string }) { return <p className="empty">{message}</p>; }
