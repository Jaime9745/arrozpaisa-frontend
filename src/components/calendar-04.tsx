"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

interface Calendar04Props {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export default function Calendar04({
  dateRange,
  onDateRangeChange,
}: Calendar04Props) {
  return (
    <Card
      className="w-full h-[408px] flex flex-col"
      style={{ borderRadius: "30px" }}
    >
      <CardContent className="flex-1 flex items-center justify-center overflow-hidden p-6">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
          locale={es}
          fixedWeeks
          formatters={{
            formatMonthCaption: (date) => {
              const monthYear = format(date, "MMMM yyyy", { locale: es });
              return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
            },
            formatWeekdayName: (date) => {
              const dayName = format(date, "EEEEE", { locale: es });
              return dayName === "x" ? "X" : dayName.toUpperCase();
            },
          }}
          classNames={{
            month_caption:
              "text-xl font-bold flex items-center justify-center text-center",
            caption_label:
              "text-xl font-bold text-center w-full flex items-center justify-center",
          }}
          className="w-full max-w-full scale-70 [&_button]:rounded-full [&_button]:h-9 [&_button]:w-9 [&_button]:min-w-9 [&_button]:font-bold [&_button]:text-lg [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button[data-selected-single='true']]:bg-[#EB3123] [&_button[data-selected-single='true']]:text-white [&_button[data-selected-single='true']]:h-9 [&_button[data-selected-single='true']]:w-9 [&_button[data-selected-single='true']]:rounded-full [&_button[data-range-start='true']]:bg-[#EB3123] [&_button[data-range-end='true']]:bg-[#EB3123] [&_button[data-range-start='true']]:text-white [&_button[data-range-end='true']]:text-white [&_button[data-range-start='true']]:h-9 [&_button[data-range-start='true']]:w-9 [&_button[data-range-start='true']]:rounded-full [&_button[data-range-end='true']]:h-9 [&_button[data-range-end='true']]:w-9 [&_button[data-range-end='true']]:rounded-full [&_.rdp-weekday]:text-base [&_.rdp-weekday]:font-semibold"
        />
      </CardContent>
    </Card>
  );
}
