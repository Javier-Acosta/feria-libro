import { createPocketBase, fileUrl } from "./pocketbase";

export type NewsItem = { id: string; title: string; summary: string; content: string; published_on: string; image?: string; collectionId: string };
export type Guest = { id: string; name: string; bio: string; participation?: string; photo?: string; collectionId: string };
export type ScheduleEntry = { id: string; event_date: string; event_time: string; title: string; venue: string; expand?: { guests?: Guest[] } };
export type VenueMap = { id: string; title: string; file: string; collectionId: string };

async function safely<T>(request: () => Promise<T>, fallback: T): Promise<T> {
  try { return await request(); } catch { return fallback; }
}

export async function getPublicContent() {
  const pb = createPocketBase();
  const [news, guests, schedule, maps] = await Promise.all([
    safely(() => pb.collection("news").getFullList<NewsItem>({ sort: "-published_on" }), []),
    safely(() => pb.collection("guests").getFullList<Guest>({ sort: "name" }), []),
    safely(() => pb.collection("schedule_entries").getFullList<ScheduleEntry>({ sort: "event_date,event_time", expand: "guests" }), []),
    safely(() => pb.collection("venue_maps").getFullList<VenueMap>({ sort: "-updated" }), []),
  ]);
  return { news, guests, schedule, map: maps[0] ?? null };
}

export { fileUrl };
