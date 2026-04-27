"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string | null;
  onChange: (iso: string) => void;
}

const HOURS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

function getTzAbbr(): string {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const initial = value ? new Date(value) : null;
  const [date, setDate] = useState<Date | undefined>(initial ?? undefined);
  const [time, setTime] = useState<string | null>(
    initial
      ? `${String(initial.getHours()).padStart(2, "0")}:${String(
          initial.getMinutes()
        ).padStart(2, "0")}`
      : null
  );
  const tz = getTzAbbr();

  const update = (d: Date | undefined, t: string | null) => {
    if (!d || !t) return;
    const [hh, mm] = t.split(":").map(Number);
    const next = new Date(d);
    next.setHours(hh, mm, 0, 0);
    onChange(next.toISOString());
  };

  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <div className="mb-3">
        <p className="text-sm font-medium">Live stream date / time</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          An &lsquo;add to calendar&rsquo; option will be included in your post
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d);
            update(d, time);
          }}
          disabled={{ before: new Date() }}
        />
        <div className="grid grid-cols-2 gap-2 content-start">
          {HOURS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setTime(h);
                update(date, h);
              }}
              className={cn(
                "rounded-md border border-[var(--border)] px-3 py-2 text-sm transition-colors",
                time === h
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] hover:bg-[oklch(0.28_0_0)]"
                  : "hover:bg-[var(--accent)]"
              )}
            >
              {h} {tz && <span className="opacity-70">({tz})</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
