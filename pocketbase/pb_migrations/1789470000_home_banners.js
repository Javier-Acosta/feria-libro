migrate((app) => {
  app.save(new Collection({
    type: "base",
    name: "banners",
    listRule: "published = true || (@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin')",
    viewRule: "published = true || (@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin')",
    createRule: "@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin'",
    updateRule: "@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin'",
    deleteRule: "@request.auth.collectionName = 'administrators' && @request.auth.role = 'admin'",
    fields: [
      { type: "text", name: "title", required: true, max: 180 },
      { type: "bool", name: "published" },
      { type: "file", name: "image", required: true, maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
      { type: "autodate", name: "created", onCreate: true, onUpdate: false },
      { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
    ],
  }));
}, (app) => app.delete(app.findCollectionByNameOrId("banners")));
