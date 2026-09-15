export function PresentationDate({ value }: { value?: string }) {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return <time className="presentation-date" dateTime={value.slice(0, 10)}>
    {new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date)}
  </time>;
}
