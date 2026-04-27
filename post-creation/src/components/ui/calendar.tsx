"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-2",
        month: "flex flex-col gap-2",
        month_caption: "flex justify-center pt-1 items-center text-sm font-medium",
        caption_label: "text-sm font-medium",
        nav: "flex items-center justify-between absolute inset-x-2 top-2",
        button_previous:
          "size-7 inline-flex items-center justify-center rounded-md hover:bg-[var(--accent)] opacity-60 hover:opacity-100",
        button_next:
          "size-7 inline-flex items-center justify-center rounded-md hover:bg-[var(--accent)] opacity-60 hover:opacity-100",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-[var(--muted-foreground)] rounded-md w-8 h-8 inline-flex items-center justify-center font-normal text-[0.75rem]",
        week: "flex w-full mt-1",
        day: "p-0 text-center text-sm",
        day_button:
          "size-8 inline-flex items-center justify-center rounded-md hover:bg-[var(--accent)] focus:outline-none aria-selected:bg-[var(--primary)] aria-selected:text-[var(--primary-foreground)]",
        selected:
          "[&>button]:bg-[var(--primary)] [&>button]:text-[var(--primary-foreground)] [&>button:hover]:bg-[var(--primary)]",
        today: "[&>button]:font-semibold [&>button]:underline underline-offset-2",
        outside: "text-[var(--muted-foreground)] opacity-50",
        disabled: "opacity-30 pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: cls, ...rest }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", cls)} {...rest} />
          ) : (
            <ChevronRight className={cn("size-4", cls)} {...rest} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
