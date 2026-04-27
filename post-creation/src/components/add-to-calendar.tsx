"use client";
import { CalendarPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  downloadIcs,
  googleCalendarUrl,
  outlookWebUrl,
  type CalendarEvent,
} from "@/lib/calendar-links";

interface Props {
  event: CalendarEvent;
}

export function AddToCalendar({ event }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90">
        <CalendarPlus className="size-4" />
        Add to calendar
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onSelect={() => downloadIcs(event, "mixcloud-stream.ics")}
        >
          <span className="mr-2"></span> Apple Calendar
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2">G</span> Google{" "}
            <span className="text-[var(--muted-foreground)] text-xs ml-1">
              (online)
            </span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={outlookWebUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2">O</span> Office 365{" "}
            <span className="text-[var(--muted-foreground)] text-xs ml-1">
              (online)
            </span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => downloadIcs(event, "mixcloud-stream.ics")}
        >
          <span className="mr-2">O</span> Outlook
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={outlookWebUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2">O</span> Outlook.com{" "}
            <span className="text-[var(--muted-foreground)] text-xs ml-1">
              (online)
            </span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
