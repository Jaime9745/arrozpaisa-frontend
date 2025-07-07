"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

interface Calendar04Props {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export default function Calendar04({
  dateRange,
  onDateRangeChange,
}: Calendar04Props) {
  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={onDateRangeChange}
      className="rounded-lg border shadow-sm w-full max-w-full mx-auto p-2 sm:p-3 md:p-4 overflow-hidden [&_.rdp-day]:text-xs [&_.rdp-day]:sm:text-sm [&_.rdp-day]:md:text-base [&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:sm:text-sm [&_.rdp-head_cell]:md:text-base [&_.rdp-caption]:text-sm [&_.rdp-caption]:sm:text-base [&_.rdp-caption]:md:text-lg [&_.rdp-table]:w-full [&_.rdp-table]:max-w-full"
      style={{ borderRadius: "30px" }}
    />
  );
}
