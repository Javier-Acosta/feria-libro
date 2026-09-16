migrate((app) => {
  const admin = "@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin'";
  for (const name of ["news", "guests", "schedule_entries", "venue_maps", "banners", "reels"]) {
    const collection = app.findCollectionByNameOrId(name);
    if (!collection.fields.getByName("priority")) collection.fields.add(new NumberField({ name: "priority", min: 0, max: 9999, onlyInt: true }));
    for (const field of ["created", "updated"]) {
      if (!collection.fields.getByName(field)) collection.fields.add(new AutodateField({ name: field, onCreate: true, onUpdate: field === "updated" }));
    }
    collection.listRule = collection.viewRule = `published = true || (${admin})`;
    collection.createRule = collection.updateRule = collection.deleteRule = admin;
    app.save(collection);
  }
  app.save(new Collection({
    id: "feriasettings01", name: "site_settings", type: "base",
    listRule: "", viewRule: "", createRule: null, updateRule: admin, deleteRule: null,
    fields: [
      { type: "text", name: "site_name", required: true, max: 120 },
      { type: "text", name: "description", max: 350 },
      { type: "text", name: "footer_text", max: 350 },
      ...["accent_color", "background_color", "surface_color", "news_color", "text_color"].map(name => ({ type: "text", name, required: true, pattern: "^#[0-9A-Fa-f]{6}$" })),
      { type: "date", name: "start_date" }, { type: "date", name: "end_date" },
      { type: "text", name: "venues", max: 2000 },
      ...["instagram_url", "facebook_url", "youtube_url"].map(name => ({ type: "url", name, onlyDomains: name === "instagram_url" ? ["instagram.com", "www.instagram.com"] : name === "facebook_url" ? ["facebook.com", "www.facebook.com"] : ["youtube.com", "www.youtube.com", "youtu.be"] })),
      { type: "file", name: "logo", maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/png", "image/jpeg", "image/webp"] },
      { type: "autodate", name: "created", onCreate: true, onUpdate: false },
      { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
    ],
  }));
  const settings = new Record(app.findCollectionByNameOrId("site_settings"));
  settings.set("id", "feriaconfig0001");
  const values = {
    site_name: "Feria del Libro", description: "Programación, invitados y novedades de la Feria del Libro.",
    footer_text: "Un espacio para encontrarnos alrededor de las palabras.",
    accent_color: "#ED8023", background_color: "#f7f4ee", surface_color: "#ffffff", news_color: "#f0d9e9", text_color: "#101128",
  };
  for (const key in values) settings.set(key, values[key]);
  app.save(settings);
}, (app) => {
  app.delete(app.findCollectionByNameOrId("site_settings"));
  for (const name of ["news", "guests", "schedule_entries", "venue_maps", "banners", "reels"]) {
    const collection = app.findCollectionByNameOrId(name);
    collection.fields.removeByName("priority");
    app.save(collection);
  }
});
