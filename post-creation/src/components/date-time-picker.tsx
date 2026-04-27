"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string | null;
  onChange: (iso: string) => void;
}

function buildTimes(stepMinutes: number): string[] {
  const out: string[] = [];
  for (let m = 0; m < 24 * 60; m += stepMinutes) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    out.push(`${hh}:${mm}`);
  }
  return out;
}

const TIMES = buildTimes(15);

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

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  const [open, setOpen] = useState(false);
  const tz = getTzAbbr();

  const update = (d: Date | undefined, t: string | null) => {
    if (!d || !t) return;
    const [hh, mm] = t.split(":").map(Number);
    const next = new Date(d);
    next.setHours(hh, mm, 0, 0);
    onChange(next.toISOString());
  };

  return (
    <div className="rounded-lg border border-[var(--border)] p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">Live stream date / time</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          An &lsquo;add to calendar&rsquo; option will be included in your post
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start font-normal",
                !date && "text-[var(--muted-foreground)]"
              )}
            >
              <CalendarIcon className="size-4" />
              {date ? formatDateLabel(date) : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                update(d, time);
                if (d) setOpen(false);
              }}
              disabled={{ before: new Date() }}
              autoFocus
            />
          </PopoverContent>
        </Popover>

        <Select
          value={time ?? undefined}
          onValueChange={(t) => {
            setTime(t);
            update(date, t);
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={`Pick a time${tz ? ` (${tz})` : ""}`}
            />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {TIMES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
                {tz && (
                  <span className="text-[var(--muted-foreground)] ml-1">
                    ({tz})
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
