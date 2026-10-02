"use client";
import { useMemo, useState } from "react";
import type { ScheduleEntry } from "@/lib/content";
import { sanitizeRichText } from "@/lib/rich-text";
export function Agenda({ entries }: { entries: ScheduleEntry[] }) { const dates = useMemo(() => [...new Set(entries.map((item) => item.event_date))], [entries]); const [selected, setSelected] = useState(dates[0]); if (!dates.length) return <p className="empty">La agenda se publicará en breve.</p>; const events = entries.filter((entry) => entry.event_date === selected); return <div className="agenda"><div className="day-tabs">{dates.map((date) => <button className={date === selected ? "active" : ""} key={date} onClick={() => setSelected(date)}>{new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date.slice(0, 10)}T12:00:00Z`))}</button>)}</div><div className="event-list">{events.map((event) => { const guestNames = event.expand?.guests?.map((guest) => guest.name).join(" · "); return <article key={event.id}><time>{event.event_time}</time><div><ActivityTitle title={event.title} />{guestNames && <p>{guestNames}</p>}</div><span>{event.venue}</span></article>; })}</div></div>; }

function ActivityTitle({ title }: { title: string }) {
  if (/<\/?[a-z][^>]*>/i.test(title)) return <div className="activity-title" dangerouslySetInnerHTML={{ __html: sanitizeRichText(title) }} />;
  const lines = title.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const bullets = lines.filter(line => /^[-•*]\s+/.test(line)).map(line => line.replace(/^[-•*]\s+/, ""));
  if (!bullets.length) return <h3>{title}</h3>;
  const intro = lines.filter(line => !/^[-•*]\s+/.test(line));
  return <div className="activity-title">{intro.map((line, index) => index === 0 ? <h3 key={line}>{line}</h3> : <p key={line}>{line}</p>)}<ul>{bullets.map(item => <li key={item}>{item}</li>)}</ul></div>;
}
