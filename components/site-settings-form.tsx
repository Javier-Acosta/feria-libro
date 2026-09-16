"use client";
import { useEffect, useState, type FormEvent } from "react";
import { fileUrl } from "@/lib/pocketbase";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

const colors = [["accent_color", "Color destacado (botones y títulos)"], ["background_color", "Fondo general"], ["surface_color", "Fondo de navegación, agenda y tarjetas"], ["news_color", "Fondo de Noticias"], ["text_color", "Color del texto"]] as const;

export function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [removeLogo, setRemoveLogo] = useState(false);
  useEffect(() => {
    void fetch("/api/admin/settings", { cache: "no-store" }).then(async response => {
      const data = await response.json(); if (!response.ok) throw new Error(data.message); setSettings({ ...defaultSettings, ...data });
    }).catch(e => setError(e.message));
  }, []);
  useEffect(() => {
    if (!logo) return;
    const url = URL.createObjectURL(logo); setLogoPreview(url); // eslint-disable-line react-hooks/set-state-in-effect
    return () => URL.revokeObjectURL(url);
  }, [logo]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!settings) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const data = new FormData();
      for (const key of Object.keys(defaultSettings) as (keyof typeof defaultSettings)[]) if (key !== "logo") data.set(key, settings[key]);
      if (logo) data.set("logo", logo);
      data.set("remove_logo", String(removeLogo));
      const response = await fetch("/api/admin/settings", { method: "PATCH", body: data });
      const result = await response.json(); if (!response.ok) throw new Error(result.message);
      setSettings({ ...defaultSettings, ...result }); setLogo(null); setLogoPreview(""); setRemoveLogo(false);
      setMessage("Configuración guardada. Los cambios aparecen al recargar el sitio.");
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo guardar. Volvé a intentar."); }
    finally { setBusy(false); }
  }
  const update = (key: keyof typeof defaultSettings, value: string) => setSettings(s => s ? { ...s, [key]: value } : s);
  const currentLogo = logoPreview || (settings?.logo && settings.id && settings.collectionId ? fileUrl(settings.collectionId, settings.id, settings.logo) : undefined);
  return <><p className="eyebrow blue">IDENTIDAD Y DATOS DE LA FERIA</p><h1>Configuración</h1>
    {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="manager-message" role="status">{message}</p>}
    {!settings ? <p>{error ? "Recargá esta página para volver a intentar." : "Cargando configuración…"}</p> : <form className="content-form" onSubmit={save}><fieldset className="editor-fields" disabled={busy}>
      <h2>Identidad</h2>
      <label>Nombre del sitio<input required maxLength={120} value={settings.site_name} onChange={e => update("site_name", e.target.value)} /></label>
      <label>Descripción para buscadores<textarea maxLength={350} value={settings.description} onChange={e => update("description", e.target.value)} /></label>
      <label>Logo (PNG, JPG o WebP; máximo 5 MB)<input key={settings.logo} type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { setLogo(e.target.files?.[0] ?? null); setLogoPreview(""); setRemoveLogo(false); }} /></label>
      {currentLogo && !removeLogo && <img className="settings-logo-preview" src={currentLogo} alt="Vista previa del logo" />}
      {settings.logo && <label className="check"><input type="checkbox" checked={removeLogo} onChange={e => { setRemoveLogo(e.target.checked); setLogo(null); setLogoPreview(""); }} />Quitar logo y mostrar el nombre</label>}
      <h2>Colores</h2><div className="settings-colors">{colors.map(([key, label]) => <label key={key}>{label}<input type="color" value={settings[key]} onChange={e => update(key, e.target.value)} /><span>{settings[key]}</span></label>)}</div>
      <div className="theme-preview" style={{ background: settings.background_color, color: settings.text_color }}><strong style={{ color: settings.accent_color }}>{settings.site_name}</strong><p>Vista previa de colores</p><span style={{ background: settings.accent_color, color: settings.text_color }}>Ver todo →</span><div style={{ background: settings.news_color }}>Noticias de la Feria</div></div>
      <h2>Fechas y sedes</h2>
      <label>Fecha inicial<input type="date" value={settings.start_date.slice(0, 10)} onChange={e => update("start_date", e.target.value)} /></label>
      <label>Fecha final<input type="date" min={settings.start_date.slice(0, 10)} value={settings.end_date.slice(0, 10)} onChange={e => update("end_date", e.target.value)} /></label>
      <label>Sedes (una por línea)<textarea maxLength={2000} value={settings.venues} onChange={e => update("venues", e.target.value)} /></label>
      <h2>Redes sociales y pie de página</h2>
      {([["instagram_url", "Instagram"], ["facebook_url", "Facebook"], ["youtube_url", "YouTube"]] as const).map(([key, label]) => <label key={key}>{label}<input type="url" placeholder="https://…" value={settings[key]} onChange={e => update(key, e.target.value)} /></label>)}
      <label>Texto del pie de página<textarea maxLength={350} value={settings.footer_text} onChange={e => update("footer_text", e.target.value)} /></label>
      <button>{busy ? "Guardando…" : "Guardar configuración"}</button>
    </fieldset></form>}
  </>;
}
