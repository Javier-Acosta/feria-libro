// Prueba de integración contra un Next.js LOCAL conectado a PocketBase.
// Crea únicamente borradores temporales y los elimina en finally.
import assert from "node:assert/strict";
import fs from "node:fs";
import PocketBase from "pocketbase";

const base = process.env.EDITORIAL_TEST_URL || "http://127.0.0.1:3217";
if (new URL(base).hostname !== "127.0.0.1") throw new Error("El servidor de prueba debe ser local.");
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => { const i = line.indexOf("="); return [line.slice(0, i), line.slice(i + 1).replace(/^['"]|['"]$/g, "")]; }));
const pb = new PocketBase(process.env.POCKETBASE_MIGRATION_URL);
if (!pb.baseURL.startsWith("https://")) throw new Error("PocketBase debe usar HTTPS.");
await pb.collection("_superusers").authWithPassword(env.POCKETBASE_ADMIN_EMAIL, env.POCKETBASE_ADMIN_PASSWORD);
const administrators = await pb.collection("administrators").getFullList();
const admin = await pb.collection("administrators").impersonate(administrators[0].id, 600);
const cleanup = [];
const request = (path, init = {}, auth = true) => fetch(base + path, { ...init, headers: { ...(auth ? { Cookie: `feria_admin=${admin.authStore.token}` } : {}), ...init.headers }, redirect: "manual" });
const form = values => { const result = new FormData(); for (const [key, value] of Object.entries(values)) result.set(key, value); return result; };
async function json(response, status = 200) { const data = await response.json(); assert.equal(response.status, status, JSON.stringify(data)); return data; }
try {
  await json(await request("/api/admin/news", {}, false), 401);
  await json(await request("/api/admin/settings", {}, false), 401);
  const data = form({ title: "Prueba temporal del editor", summary: "Borrador de verificación", content: "<p>Texto de prueba.</p>", published_on: "2026-09-16", priority: "9999", published: "false" });
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64");
  data.set("image", new Blob([png], { type: "image/png" }), "test.png");
  const draft = await json(await request("/api/admin/news", { method: "POST", body: data })); cleanup.push(["news", draft.id]);
  assert.equal(draft.published, false); assert(draft.image); assert.equal(draft.priority, 9999);
  const pub = new PocketBase(pb.baseURL);
  await assert.rejects(() => pub.collection("news").getOne(draft.id), error => error.status === 404);
  const list = await json(await request("/api/admin/news")); assert(list.some(item => item.id === draft.id)); assert.equal(list[0].id, draft.id);
  const copied = await json(await request(`/api/admin/news/${draft.id}/duplicate`, { method: "POST" })); cleanup.push(["news", copied.id]);
  assert.equal(copied.published, false); assert(copied.image); assert(copied.title.endsWith("(copia)"));
  const copiedFile = await fetch(pb.files.getURL(copied, copied.image)); assert.deepEqual(Buffer.from(await copiedFile.arrayBuffer()), png);
  const changed = await json(await request(`/api/admin/news/${draft.id}`, { method: "PATCH", body: form({ title: "Prueba temporal editada", priority: "12", published: "false" }) }));
  assert.equal(changed.priority, 12); assert.equal(changed.image, draft.image);
  await json(await request(`/api/admin/news/${draft.id}`, { method: "PATCH", body: form({ published_on: "2026-02-31" }) }), 400);
  const guests = await pb.collection("guests").getFullList({ filter: "published = true" });
  if (guests.length) {
    const activity = await json(await request("/api/admin/schedule_entries", { method: "POST", body: form({ title: "Actividad temporal", event_date: "2026-10-09", event_time: "12:30", venue: "Prueba", published: "false", guests: guests[0].id }) })); cleanup.push(["schedule_entries", activity.id]);
    assert(activity.guests.includes(guests[0].id));
    const cleared = await json(await request(`/api/admin/schedule_entries/${activity.id}`, { method: "PATCH", body: form({ guests: "" }) })); assert.equal(cleared.guests.length, 0);
  }
  const settings = await json(await request("/api/admin/settings"));
  await json(await request("/api/admin/settings", { method: "PATCH", body: form({ accent_color: "invalid" }) }), 400);
  await json(await request("/api/admin/settings", { method: "PATCH", body: form({ start_date: "2026-10-10", end_date: "2026-10-01" }) }), 400);
  const saved = await json(await request("/api/admin/settings", { method: "PATCH", body: form({ site_name: settings.site_name }) })); assert.equal(saved.site_name, settings.site_name); assert.equal(saved.accent_color, settings.accent_color);
  const page = await request("/admin/settings"); assert.equal(page.status, 200);
  const guestPage = await request("/invitados", {}, false); assert.equal(guestPage.status, 200);
  const home = await request("/", {}, false); const html = await home.text(); assert.equal(home.status, 200); assert(/href="\/invitados\/?"/.test(html)); assert(!html.includes(draft.title));
  const reel = (await pub.collection("reels").getList(1, 1)).items[0];
  if (reel) { const cover = await request("/api/admin/reel-cover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: reel.url }) }); assert.equal(cover.status, 200); assert(cover.headers.get("content-type").startsWith("image/")); }
  await json(await request("/api/admin/reel-cover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: "http://127.0.0.1/" }) }), 400);
  console.log("PASS: autorización, borradores privados, creación/edición, duplicación con imagen, prioridad, fechas, relaciones, configuración, listado de invitados y portada Instagram.");
} finally {
  for (const [collection, id] of cleanup.reverse()) await pb.collection(collection).delete(id);
  console.log("Borradores temporales eliminados.");
}
