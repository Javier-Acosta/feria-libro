migrate((app) => {
  const collection = app.findCollectionByNameOrId("guests");
  collection.fields.add(new DateField({ name: "presentation_date" }));
  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("guests");
  collection.fields.removeByName("presentation_date");
  app.save(collection);
});
