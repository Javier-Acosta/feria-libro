import { notFound } from "next/navigation";
import { AdminCollection } from "@/components/admin-collection";
const labels: Record<string, string> = { news:"Noticias", guests:"Invitados", schedule_entries:"Agenda", venue_maps:"Mapa" };
export default async function AdminCollectionPage({ params }: PageProps<"/admin/[collection]">) { const { collection } = await params; if (!labels[collection]) notFound(); return <AdminCollection collection={collection} title={labels[collection]} />; }
