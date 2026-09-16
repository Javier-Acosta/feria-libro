"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { definitions } from "@/lib/admin-fields";
import { instagramReelUrl } from "@/lib/instagram";
import { fileUrl } from "@/lib/pocketbase";
import { ContentPreview, type ContentRecord } from "./content-preview";

async function responseData(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "No se pudo completar la operación.");
  return data;
}

export function AdminCollection({ collection, title }: { collection: string; title: string }) {
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [guests, setGuests] = useState<ContentRecord[]>([]);
  const [editing, setEditing] = useState<ContentRecord | null>(null);
  const [preview, setPreview] = useState<ContentRecord | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editorVersion, setEditorVersion] = useState(0);
  const load = useCallback(async () => {
    const data = await responseData(await fetch(`/api/admin/${collection}`, { cache: "no-store" }));
    setRecords(data);
    if (collection === "schedule_entries") setGuests(await responseData(await fetch("/api/admin/guests", { cache: "no-store" })));
  }, [collection]);

  useEffect(() => {
    let active = true;
    // load actualiza el estado solo después de recibir las respuestas de la API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load().catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [load]);

  function edit(record: ContentRecord) {
    setEditing(record); setPreview(null); setError(""); setMessage(""); setEditorVersion(v => v + 1);
  }

  async function action(record: ContentRecord, duplicate: boolean) {
    if (!duplicate && !confirm(`¿Eliminar “${record.title || record.name}”? Esta acción no se puede deshacer.`)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await responseData(await fetch(`/api/admin/${collection}/${record.id}${duplicate ? "/duplicate" : ""}`, { method: duplicate ? "POST" : "DELETE" }));
      await load();
      if (duplicate) edit(result);
      else if (editing?.id === record.id) setEditing(null);
      setMessage(duplicate ? "Copia creada como borrador. Revisala antes de publicar." : "Contenido eliminado.");
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo completar la operación."); }
    finally { setBusy(false); }
  }

  return <div className="content-manager">
    <div className="manager-title"><div><p className="eyebrow blue">GESTIÓN</p><h1>{title}</h1></div><button className="secondary" disabled={busy} onClick={() => edit({ id: "", published: false, priority: 0 })}>+ Nuevo</button></div>
    <p>La prioridad más alta aparece primero. Con la misma prioridad, se mantiene el orden habitual. Las copias siempre se crean como borrador.</p>
    {collection === "schedule_entries" && <p>En la agenda se respetan primero la fecha y la hora.</p>}
    {collection === "banners" && <p>Se muestra el banner publicado de mayor prioridad; en caso de empate, el último guardado. Tamaño recomendado: 1920 × 600 px.</p>}
    {message && <p className="manager-message" role="status">{message}</p>}
    {error && <p className="form-error" role="alert">{error} <button type="button" onClick={() => { setError(""); void load().catch(e => setError(e.message)); }}>Reintentar carga</button></p>}
    {loading && <p role="status">Cargando contenido…</p>}
    {editing && <ContentEditor key={`${collection}-${editorVersion}`} collection={collection} record={editing} guests={guests} onCancel={() => setEditing(null)} onSaved={async published => {
      setEditing(null); setMessage(published ? "Guardado y publicado en el sitio." : "Borrador guardado. Todavía no es visible en el sitio.");
      try { await load(); } catch { setError("El contenido se guardó, pero no pudimos actualizar el listado. Reintentá la carga."); }
    }} />}
    {preview && <section className="preview-panel"><button className="secondary" onClick={() => setPreview(null)}>Cerrar vista previa</button><ContentPreview collection={collection} record={preview} /></section>}
    {!loading && !records.length && !editing && <p className="empty">Todavía no hay contenido. Usá “+ Nuevo” para empezar.</p>}
    <div className="record-list">{records.map(record => <article key={record.id}>
      <div><span className={record.published ? "status published" : "status"}>{record.published ? "Publicado" : "Borrador"} · Prioridad {record.priority ?? 0}</span><h3>{record.title || record.name}</h3></div>
      <div className="record-actions"><button disabled={busy} onClick={() => setPreview(record)}>Vista previa</button><button disabled={busy} onClick={() => edit(record)}>Editar</button><button disabled={busy} onClick={() => void action(record, true)}>Duplicar</button><button disabled={busy} onClick={() => void action(record, false)}>Eliminar</button></div>
    </article>)}</div>
  </div>;
}

function ContentEditor({ collection, record, guests, onCancel, onSaved }: { collection: string; record: ContentRecord; guests: ContentRecord[]; onCancel: () => void; onSaved: (published: boolean) => Promise<void> }) {
  const fields = definitions[collection];
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.filter(f => f.type !== "file").map(f => [f.name, f.type === "date" ? String(record[f.name] ?? "").slice(0, 10) : String(record[f.name] ?? "")])));
  const [published, setPublished] = useState(Boolean(record.published));
  const [priority, setPriority] = useState(Number(record.priority ?? 0));
  const [selectedGuests, setSelectedGuests] = useState<string[]>(record.guests ?? []);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const lastCover = useRef("");
  const fileInput = useRef<HTMLInputElement>(null);
  const fileField = fields.find(f => f.type === "file");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFilePreview(url); // eslint-disable-line react-hooks/set-state-in-effect
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function cover(automatic = false) {
    const url = instagramReelUrl(values.url ?? "");
    if (!url) { if (!automatic) setError("Pegá un enlace válido de un reel de Instagram."); return; }
    if (automatic && (file || record.image || lastCover.current === url)) return;
    lastCover.current = url; setCoverBusy(true); setError(""); setMessage("Buscando portada en Instagram…");
    try {
      const response = await fetch("/api/admin/reel-cover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      if (!response.ok) { const result = await response.json(); setMessage(result.message); return; }
      const blob = await response.blob();
      const extension = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
      setFile(new File([blob], `portada-instagram.${extension}`, { type: blob.type }));
      if (fileInput.current) fileInput.current.value = "";
      setMessage("Portada obtenida. Se guardará al guardar el reel.");
    } catch { setMessage("No pudimos obtener la portada. Podés subirla manualmente."); }
    finally { setCoverBusy(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const data = new FormData();
      for (const [name, value] of Object.entries(values)) data.set(name, value);
      data.set("published", String(published)); data.set("priority", String(priority));
      if (collection === "schedule_entries") {
        data.append("guests", ""); selectedGuests.forEach(id => data.append("guests", id));
      }
      if (file && fileField) data.set(fileField.name, file);
      await responseData(await fetch(`/api/admin/${collection}${record.id ? `/${record.id}` : ""}`, { method: record.id ? "PATCH" : "POST", body: data }));
      await onSaved(published);
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo guardar. Tu contenido sigue en el formulario."); }
    finally { setBusy(false); }
  }

  const existingFile = fileField && String(record[fileField.name] ?? "");
  const currentImage = filePreview || (existingFile && record.collectionId ? fileUrl(record.collectionId, record.id, existingFile) : undefined);
  return <form className="content-form" onSubmit={save}>
    <h2>{record.id ? "Editar contenido" : "Nuevo contenido"}</h2>
    <fieldset className="editor-fields" disabled={busy || coverBusy}>
      {fields.map(field => <label key={field.name}>{field.label}
        {field.type === "textarea" ? <textarea name={field.name} required={field.required} value={values[field.name] ?? ""} onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))} />
          : field.type === "file" ? <input ref={fileInput} name={field.name} type="file" accept={collection === "venue_maps" ? "image/png,image/jpeg,image/webp,application/pdf" : "image/png,image/jpeg,image/webp"} required={field.required && !existingFile && !file} onChange={e => { setFile(e.target.files?.[0] ?? null); setFilePreview(""); }} />
          : <input name={field.name} type={field.type} required={field.required} value={values[field.name] ?? ""} onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))} onBlur={collection === "reels" && field.name === "url" ? () => void cover(true) : undefined} />}
      </label>)}
      {collection === "reels" && <button type="button" className="secondary" onClick={() => void cover()}>Obtener portada de Instagram</button>}
      {currentImage && !(file?.type === "application/pdf" || existingFile?.endsWith(".pdf")) && <img className="banner-preview" src={currentImage} alt="Imagen seleccionada" />}
      {collection === "schedule_entries" && <fieldset><legend>Invitados</legend>{guests.map(guest => <label className="check" key={guest.id}><input type="checkbox" checked={selectedGuests.includes(guest.id)} onChange={e => setSelectedGuests(ids => e.target.checked ? [...ids, guest.id] : ids.filter(id => id !== guest.id))} />{guest.name}{!guest.published ? " (borrador)" : ""}</label>)}</fieldset>}
      <label>Prioridad de aparición (mayor primero)<input type="number" min="0" max="9999" step="1" required value={priority} onChange={e => setPriority(Number(e.target.value))} /></label>
      <label className="check"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />Publicar en el sitio</label>
    </fieldset>
    {message && <p role="status">{message}</p>}{error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button disabled={busy || coverBusy}>{busy ? "Guardando…" : published ? "Guardar y publicar" : "Guardar borrador"}</button><button type="button" className="secondary" onClick={() => setPreview(v => !v)}>{preview ? "Ocultar vista previa" : "Vista previa"}</button><button disabled={busy || coverBusy} type="button" className="secondary" onClick={onCancel}>Cancelar</button></div>
    {preview && <ContentPreview collection={collection} record={{ ...record, ...values, published, ...(file && fileField ? { [fileField.name]: file.name } : {}) }} image={filePreview} />}
  </form>;
}
