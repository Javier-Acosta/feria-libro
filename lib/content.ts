import { createPocketBase, fileUrl } from "./pocketbase";
import { contentSort } from "./admin-fields";

export type NewsItem = { id: string; title: string; summary: string; content: string; published_on: string; image?: string; collectionId: string };
export type Guest = { id: string; name: string; presentation_date?: string; bio: string; participation?: string; photo?: string; collectionId: string };
export type ScheduleEntry = { id: string; event_date: string; event_time: string; title: string; venue: string; expand?: { guests?: Guest[] } };
export type Reel = { id: string; title: string; url: string; image?: string; collectionId: string };
export type Banner = { id: string; title: string; image: string; collectionId: string };
export type VenueMap = { id: string; title: string; file: string; collectionId: string };

async function safely<T>(request: () => Promise<T>, fallback: T): Promise<T> {
  try { return await request(); } catch { return fallback; }
}

export async function getPublicContent() {
  const pb = createPocketBase();
  const [news, guests, schedule, maps, banners, reels] = await Promise.all([
    safely(() => pb.collection("news").getList<NewsItem>(1, 6, { filter: "published = true", sort: contentSort("news") }).then(result => result.items), []),
    safely(() => pb.collection("guests").getFullList<Guest>({ filter: "published = true", sort: contentSort("guests") }), []),
    safely(() => pb.collection("schedule_entries").getFullList<ScheduleEntry>({ filter: "published = true", sort: contentSort("schedule_entries"), expand: "guests" }), []),
    safely(() => pb.collection("venue_maps").getFullList<VenueMap>({ filter: "published = true", sort: contentSort("venue_maps") }), []),
    safely(() => pb.collection("banners").getList<Banner>(1, 1, { filter: "published = true", sort: contentSort("banners") }).then(result => result.items), []),
    safely(() => pb.collection("reels").getFullList<Reel>({ filter: "published = true", sort: contentSort("reels") }), []),
  ]);
  return { news, guests, schedule, reels, banner: banners[0] ?? null, map: maps[0] ?? null };
}

export { fileUrl };
