migrate((app) => {
  const collection = app.findCollectionByNameOrId("schedule_entries");
  const title = collection.fields.getByName("title");
  if (title) {
    title.max = 100;
    app.save(collection);
  }
}, (app) => {
  const collection = app.findCollectionByNameOrId("schedule_entries");
  const title = collection.fields.getByName("title");
  if (title) {
    title.max = 180;
    app.save(collection);
  }
});
