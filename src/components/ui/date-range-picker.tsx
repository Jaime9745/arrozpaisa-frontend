"use client";

import * as React from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Seleccionar rango de fechas",
  className,
}: DateRangePickerProps) {
  const today = new Date();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);

  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  const presets = [
    {
      label: "Hoy",
      range: { from: today, to: tomorrow },
    },
    {
      label: "Ayer",
      range: { from: yesterday, to: today },
    },
    {
      label: "Últimos 7 días",
      range: { from: last7Days, to: today },
    },
    {
      label: "Últimos 30 días",
      range: { from: last30Days, to: today },
    },
  ];

  // Function to get display text for the button
  const getDisplayText = () => {
    if (!dateRange?.from) return placeholder;

    const isToday =
      dateRange.from.toDateString() === today.toDateString() &&
      (!dateRange.to || dateRange.to.toDateString() === today.toDateString());

    const isYesterday =
      dateRange.from.toDateString() === yesterday.toDateString() &&
      (!dateRange.to ||
        dateRange.to.toDateString() === yesterday.toDateString());

    if (isToday) return "Hoy";
    if (isYesterday) return "Ayer";

    // For ranges, show trimmed format
    if (
      dateRange.to &&
      dateRange.from.toDateString() !== dateRange.to.toDateString()
    ) {
      return `${format(dateRange.from, "dd/MM", { locale: es })} - ${format(
        dateRange.to,
        "dd/MM",
        { locale: es }
      )}`;
    }

    // Single date (not today/yesterday)
    return format(dateRange.from, "dd/MM/yyyy", { locale: es });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-50 justify-center text-center font-normal rounded-[30px] h-10 px-4 flex items-center",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="flex-1 text-center">{getDisplayText()}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="flex flex-col gap-2 p-3 border-r">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Rangos rápidos
              </div>
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="justify-start text-sm h-8"
                  onClick={() => onDateRangeChange(preset.range)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <Calendar
              autoFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              locale={es}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
