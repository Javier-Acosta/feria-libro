import Link from "next/link";
import { createPocketBase } from "@/lib/pocketbase";
import { fileUrl, type NewsItem } from "@/lib/content";
import { contentSort } from "@/lib/admin-fields";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const dynamic = "force-dynamic";
export const metadata = { title: "Noticias | Feria del Libro" };

export default async function NewsIndex() {
  const news = await createPocketBase().collection("news").getFullList<NewsItem>({
    filter: "published = true",
    sort: contentSort("news"),
  });
  return <main>
    <SiteHeader />
    <section className="section news-section news-index">
      <p className="eyebrow pink">AL DÍA</p>
      <h1>Noticias de la Feria</h1>
      {news.length ? <div className="news-grid">{news.map(item => <article className="news-card" key={item.id}>
        <Link className="news-card-link" href={`/noticias/${item.id}`} aria-label={`Leer noticia: ${item.title}`}>
          {item.image && <img src={fileUrl(item.collectionId, item.id, item.image)} alt="" loading="lazy" />}
          <time dateTime={new Date(item.published_on).toISOString()}>{new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.published_on))}</time>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <span className="news-read-more">Leer noticia →</span>
        </Link>
      </article>)}</div> : <p className="empty">Las novedades diarias aparecerán aquí durante el evento.</p>}
    </section>
    <SiteFooter />
  </main>;
}
