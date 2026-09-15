migrate((app) => {
  app.save(new Collection({
    type: "base",
    name: "reels",
    listRule: "published = true || (@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin')",
    viewRule: "published = true || (@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin')",
    createRule: "@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin'",
    updateRule: "@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin'",
    deleteRule: "@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin'",
    fields: [
      { type: "text", name: "title", required: true, max: 180 },
      { type: "text", name: "url", required: true, max: 2048, pattern: "^https://(www\\.)?instagram\\.com/reels?/[A-Za-z0-9_-]+/?(\\?[^\\s]*)?$" },
      { type: "bool", name: "published" },
      { type: "file", name: "image", maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
      { type: "autodate", name: "created", onCreate: true, onUpdate: false },
      { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
    ],
  }));
}, (app) => app.delete(app.findCollectionByNameOrId("reels")));
