export type Field = { name: string; label: string; type: "text" | "url" | "textarea" | "date" | "time" | "file" | "number"; required?: boolean };
export const definitions: Record<string, Field[]> = {
  news: [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "summary", label: "Resumen", type: "textarea", required: true },
    { name: "content", label: "Contenido", type: "textarea", required: true },
    { name: "published_on", label: "Fecha de publicación", type: "date", required: true },
    { name: "image", label: "Imagen", type: "file" },
  ],
  guests: [
    { name: "name", label: "Nombre", type: "text", required: true },
    { name: "presentation_date", label: "Fecha de presentación", type: "date" },
    { name: "participation", label: "Participación", type: "text" },
    { name: "bio", label: "Biografía", type: "textarea", required: true },
    { name: "photo", label: "Fotografía", type: "file" },
  ],
  reels: [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "url", label: "Enlace al reel de Instagram", type: "url", required: true },
    { name: "image", label: "Portada (opcional)", type: "file" },
  ],
  banners: [
    { name: "title", label: "Descripción de la imagen", type: "text", required: true },
    { name: "image", label: "Banner (PNG, JPG o WebP; máximo 10 MB)", type: "file", required: true },
  ],
  schedule_entries: [
    { name: "event_date", label: "Fecha", type: "date", required: true },
    { name: "event_time", label: "Hora", type: "time", required: true },
    { name: "title", label: "Actividad", type: "text", required: true },
    { name: "venue", label: "Ubicación", type: "text", required: true },
  ],
  venue_maps: [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "file", label: "Mapa (imagen o PDF)", type: "file", required: true },
  ],
};

export const collectionLabels: Record<string, string> = {
  news: "Noticias", guests: "Invitados", reels: "Reels de Instagram",
  banners: "Banner", schedule_entries: "Agenda", venue_maps: "Mapa",
};

export function isCollection(name: string) {
  return Object.hasOwn(definitions, name);
}

export function contentSort(collection: string) {
  if (collection === "schedule_entries") return "event_date,event_time,-priority,-created";
  if (collection === "banners" || collection === "venue_maps") return "-priority,-updated,-created";
  return "-priority,-created,-id";
}
