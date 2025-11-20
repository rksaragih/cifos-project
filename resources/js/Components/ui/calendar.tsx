import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={0}
      className={cn("px-3 mb-3", className)}
      classNames={{
        months: "space-y-4",
        month_caption: "relative flex items-center justify-center py-2 px-10",
        caption_label: "text-sm font-medium text-center",
        nav: "absolute top-0 left-0 right-0 flex justify-between items-center px-2 z-10",
        chevron: "h-7 w-7 flex items-center justify-center rounded-md transition-colors stroke-green-600",
        weekdays: "flex justify-between px-2",
        weekday: "w-9 h-9 text-center text-muted-foreground font-medium text-[0.8rem] flex items-center justify-center",
        weeks: "space-y-1",
        week: "flex justify-between",
        day: "h-9 w-9 flex items-center justify-center rounded-md transition-colors cursor-pointer hover:bg-green-600 hover:opacity-75 hover:text-white",
        day_button: "h-full w-full flex items-center justify-center",
        today: "text-green-600 font-semibold hover:text-white hover:bg-green-600 hover:opacity-75",
        selected: "font-semibold",
        day_outside: "opacity-40",
        day_disabled: "opacity-40 cursor-not-allowed",
        ...classNames,
      }}
      modifiersStyles={{
        today: {
          fontWeight: "600",
        },
        selected: {
          backgroundColor: "#16a34a", // green-600
          color: "#ffffff",
          fontWeight: "600",
          borderRadius: "0.375rem"
        }
      }}
      components={{
          Chevron: ({ orientation }) => {
            const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
            return <Icon className="h-7 w-7 text-green-600 hover:text-green-800" />;
          }
        }
      }
      {...props}
    />
  );
}

export { Calendar };