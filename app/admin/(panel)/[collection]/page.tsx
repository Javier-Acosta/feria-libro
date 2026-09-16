import { notFound } from "next/navigation";
import { AdminCollection } from "@/components/admin-collection";
import { collectionLabels, isCollection } from "@/lib/admin-fields";
export default async function AdminCollectionPage({ params }: PageProps<"/admin/[collection]">) { const { collection } = await params; if (!isCollection(collection)) notFound(); return <AdminCollection key={collection} collection={collection} title={collectionLabels[collection]} />; }
