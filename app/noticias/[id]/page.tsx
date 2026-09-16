import Link from "next/link";
import { notFound } from "next/navigation";
import { createPocketBase } from "@/lib/pocketbase";
import { fileUrl, type NewsItem } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const dynamic = "force-dynamic";

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9]{15}$/.test(id)) notFound();
  const pb = createPocketBase();
  const item = await pb.collection("news").getOne<NewsItem>(id).catch((error: unknown) => {
    if (error && typeof error === "object" && "status" in error && error.status === 404) return null;
    throw error;
  });
  if (!item) notFound();

  return <main>
    <SiteHeader />
    <article className="news-detail">
      <Link className="news-back" href="/noticias/">← Volver a noticias</Link>
      <p className="eyebrow pink">NOTICIAS DE LA FERIA</p>
      <h1>{item.title}</h1>
      <time dateTime={new Date(item.published_on).toISOString()}>{new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(item.published_on))}</time>
      <p className="news-detail-summary">{item.summary}</p>
      {item.image && <img className="news-detail-image" src={fileUrl(item.collectionId, item.id, item.image)} alt={item.title} />}
      <div className="news-body" dangerouslySetInnerHTML={{ __html: item.content }} />
    </article>
    <SiteFooter />
  </main>;
}
