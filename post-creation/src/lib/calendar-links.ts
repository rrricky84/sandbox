function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toUtcCompact(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export interface CalendarEvent {
  title: string;
  description?: string;
  start: Date;
  durationMinutes?: number;
  url?: string;
}

export function googleCalendarUrl(ev: CalendarEvent): string {
  const end = new Date(ev.start.getTime() + (ev.durationMinutes ?? 60) * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${toUtcCompact(ev.start)}/${toUtcCompact(end)}`,
  });
  if (ev.description) params.set("details", ev.description);
  if (ev.url) params.set("location", ev.url);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookWebUrl(ev: CalendarEvent): string {
  const end = new Date(ev.start.getTime() + (ev.durationMinutes ?? 60) * 60_000);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    body: ev.description ?? "",
    startdt: ev.start.toISOString(),
    enddt: end.toISOString(),
  });
  if (ev.url) params.set("location", ev.url);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function icsContent(ev: CalendarEvent): string {
  const end = new Date(ev.start.getTime() + (ev.durationMinutes ?? 60) * 60_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mixcloud//Post Prototype//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@mixcloud-prototype`,
    `DTSTAMP:${toUtcCompact(new Date())}`,
    `DTSTART:${toUtcCompact(ev.start)}`,
    `DTEND:${toUtcCompact(end)}`,
    `SUMMARY:${escapeIcs(ev.title)}`,
    ev.description ? `DESCRIPTION:${escapeIcs(ev.description)}` : "",
    ev.url ? `URL:${ev.url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

function escapeIcs(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function downloadIcs(ev: CalendarEvent, filename = "event.ics") {
  const blob = new Blob([icsContent(ev)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
