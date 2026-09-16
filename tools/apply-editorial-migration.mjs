// Ejecutar con --apply para aplicar solo esta migración al servidor configurado.
// Nunca imprime claves ni tokens. Conserva una copia local del esquema anterior.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import PocketBase from "pocketbase";

const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => { const i = line.indexOf("="); return [line.slice(0, i), line.slice(i + 1).replace(/^['"]|['"]$/g, "")]; }));
const configured = process.env.POCKETBASE_MIGRATION_URL || env.NEXT_PUBLIC_POCKETBASE_URL || env.POCKETBASE_URL;
const url = new URL(configured);
if (url.protocol !== "https:") throw new Error("La migración remota requiere HTTPS.");
const pb = new PocketBase(url.href);
await pb.collection("_superusers").authWithPassword(env.POCKETBASE_ADMIN_EMAIL, env.POCKETBASE_ADMIN_PASSWORD);
const originals = await pb.collections.getFullList();
const byName = new Map(originals.map(c => [c.name, structuredClone(c)]));
const operations = [];
function wrapFields(collection) {
  collection.fields.getByName = name => collection.fields.find(f => f.name === name);
  collection.fields.add = field => collection.fields.push(field);
  return collection;
}
for (const c of byName.values()) wrapFields(c);
class Collection { constructor(data) { Object.assign(this, data); wrapFields(this); } }
class Record { constructor(collection) { this.collection = collection.name; this.values = {}; } set(key, value) { this.values[key] = value; } }
function field(type) { return function(data) { Object.assign(this, { type }, data); }; }
vm.runInNewContext(fs.readFileSync("pocketbase/pb_migrations/1789570000_editorial_settings.js", "utf8"), {
  Collection, Record, NumberField: field("number"), AutodateField: field("autodate"),
  migrate: up => up({
    findCollectionByNameOrId: name => byName.get(name),
    save: item => {
      if (item instanceof Record) operations.push({ kind: "record", collection: item.collection, data: item.values });
      else { const data = JSON.parse(JSON.stringify(item)); operations.push({ kind: "collection", data }); byName.set(data.name, wrapFields(structuredClone(data))); }
    },
  }),
});
console.log(operations.map(o => ({ kind: o.kind, name: o.collection || o.data.name })));
if (!process.argv.includes("--apply")) { console.log("Simulación. Usá --apply para aplicar."); }
else {
const backup = path.join(os.tmpdir(), `feria-schema-${Date.now()}.json`);
fs.writeFileSync(backup, JSON.stringify(originals, null, 2), { mode: 0o600 });
console.log("Copia del esquema:", backup);
for (const operation of operations) {
  if (operation.kind === "collection") {
    const existing = originals.find(c => c.name === operation.data.name);
    if (existing && existing.name === "site_settings") { console.log("Configuración existente conservada."); continue; }
    if (existing) await pb.collections.update(existing.id, operation.data);
    else await pb.collections.create(operation.data);
    console.log("Esquema listo:", operation.data.name);
  } else {
    try { await pb.collection(operation.collection).getOne(operation.data.id); }
    catch (error) { if (error.status !== 404) throw error; await pb.collection(operation.collection).create(operation.data); }
    console.log("Configuración inicial lista.");
  }
}
}
