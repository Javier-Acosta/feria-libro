import { cache } from "react";
import { createPocketBase } from "./pocketbase";

export const SETTINGS_ID = "feriaconfig0001";
export const defaultSettings = {
  site_name: "Feria del Libro",
  description: "Programación, invitados y novedades de la Feria del Libro.",
  footer_text: "Un espacio para encontrarnos alrededor de las palabras.",
  accent_color: "#ED8023", background_color: "#f7f4ee", surface_color: "#ffffff",
  news_color: "#f0d9e9", text_color: "#101128",
  start_date: "", end_date: "", venues: "",
  instagram_url: "", facebook_url: "", youtube_url: "", logo: "",
};
export type SiteSettings = typeof defaultSettings & { id?: string; collectionId?: string };
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const record = await createPocketBase().collection("site_settings").getOne<SiteSettings>(SETTINGS_ID);
    return { ...defaultSettings, ...record };
  } catch { return defaultSettings; }
});

export function safeColor(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

export function safeWebUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : undefined; }
  catch { return undefined; }
}
