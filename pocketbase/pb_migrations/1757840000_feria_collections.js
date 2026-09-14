migrate((app) => {
  const admin = new Collection({
    type: "auth",
    name: "administrators",
    listRule: null,
    viewRule: "id = @request.auth.id",
    createRule: null,
    updateRule: "id = @request.auth.id",
    deleteRule: null,
    fields: [
      { type: "text", name: "name", required: true, max: 120 },
      { type: "select", name: "role", required: true, maxSelect: 1, values: ["admin"] },
    ],
    passwordAuth: { enabled: true, identityFields: ["email"] },
  });
  app.save(admin);

  const authorOnly = "@request.auth.role = 'admin'";
  const publicOnly = "published = true";

  const news = new Collection({
    type: "base",
    name: "news",
    listRule: publicOnly,
    viewRule: publicOnly,
    createRule: authorOnly,
    updateRule: authorOnly,
    deleteRule: authorOnly,
    fields: [
      { type: "text", name: "title", required: true, max: 180 },
      { type: "text", name: "summary", required: true, max: 360 },
      { type: "editor", name: "content", required: true, maxSize: 100000 },
      { type: "date", name: "published_on", required: true },
      { type: "bool", name: "published" },
      { type: "file", name: "image", maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
    ],
  });
  app.save(news);

  const guests = new Collection({
    type: "base",
    name: "guests",
    listRule: publicOnly,
    viewRule: publicOnly,
    createRule: authorOnly,
    updateRule: authorOnly,
    deleteRule: authorOnly,
    fields: [
      { type: "text", name: "name", required: true, max: 140 },
      { type: "editor", name: "bio", required: true, maxSize: 100000 },
      { type: "text", name: "participation", max: 180 },
      { type: "bool", name: "published" },
      { type: "file", name: "photo", maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
    ],
  });
  app.save(guests);

  const schedule = new Collection({
    type: "base",
    name: "schedule_entries",
    listRule: publicOnly,
    viewRule: publicOnly,
    createRule: authorOnly,
    updateRule: authorOnly,
    deleteRule: authorOnly,
    fields: [
      { type: "date", name: "event_date", required: true },
      { type: "text", name: "event_time", required: true, pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" },
      { type: "text", name: "title", required: true, max: 180 },
      { type: "text", name: "venue", required: true, max: 140 },
      { type: "relation", name: "guests", collectionId: guests.id, maxSelect: 10, cascadeDelete: false },
      { type: "bool", name: "published" },
    ],
  });
  app.save(schedule);

  const maps = new Collection({
    type: "base",
    name: "venue_maps",
    listRule: publicOnly,
    viewRule: publicOnly,
    createRule: authorOnly,
    updateRule: authorOnly,
    deleteRule: authorOnly,
    fields: [
      { type: "text", name: "title", required: true, max: 140 },
      { type: "bool", name: "published" },
      { type: "file", name: "file", required: true, maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"] },
    ],
  });
  app.save(maps);
}, (app) => {
  ["venue_maps", "schedule_entries", "guests", "news", "administrators"].forEach((name) => {
    app.delete(app.findCollectionByNameOrId(name));
  });
});
