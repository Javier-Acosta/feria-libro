import { Agenda } from "@/components/agenda";
import { SiteFooter, SiteHeader, EventInfo } from "@/components/site-chrome";
import { getPublicContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function CronogramaPage() {
  const { schedule } = await getPublicContent();
  return <main>
    <SiteHeader />
    <EventInfo />
    <section className="section agenda-section schedule-page">
      <p className="eyebrow blue">CRONOGRAMA</p>
      <h1>Conocé la programación de la feria</h1>
      <Agenda entries={schedule} />
    </section>
    <SiteFooter />
  </main>;
}
