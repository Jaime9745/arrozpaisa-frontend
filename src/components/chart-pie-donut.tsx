"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { WaiterPerformance } from "@/services/metricsService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { type DateRange } from "react-day-picker";

export const description = "A donut chart";

// Default static data for fallback
const defaultChartData = [
  { waiterName: "Carlos", orders: 45, fill: "var(--color-carlos)" },
  { waiterName: "María", orders: 38, fill: "var(--color-maria)" },
  { waiterName: "José", orders: 32, fill: "var(--color-jose)" },
  { waiterName: "Ana", orders: 28, fill: "var(--color-ana)" },
  { waiterName: "Luis", orders: 25, fill: "var(--color-luis)" },
];

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

interface ChartPieDonutProps {
  waiterPerformance?: WaiterPerformance[];
  loading?: boolean;
  error?: string | null;
  dateRange?: DateRange;
}

export function ChartPieDonut({
  waiterPerformance = [],
  loading = false,
  error = null,
  dateRange,
}: ChartPieDonutProps) {
  // Prepare chart data from waiter performance
  const chartData =
    waiterPerformance.length > 0
      ? waiterPerformance
          .filter((waiter) => waiter.totalOrders > 0) // Only show waiters with orders
          .sort((a, b) => b.totalOrders - a.totalOrders) // Sort by orders descending
          .map((waiter, index) => ({
            waiterName: waiter.waiterName,
            orders: waiter.totalOrders,
            fill: chartColors[index % chartColors.length],
          }))
      : defaultChartData;

  // Calculate total orders
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);

  // Generate dynamic chart config
  const chartConfig = chartData.reduce(
    (config, item, index) => {
      const key = item.waiterName.toLowerCase().replace(/\s+/g, "");
      config[key] = {
        label: item.waiterName,
        color: chartColors[index % chartColors.length],
      };
      return config;
    },
    {
      orders: { label: "Órdenes" },
    } as ChartConfig
  );

  if (loading) {
    return (
      <Card className="w-full h-[320px]" style={{ borderRadius: "30px" }}>
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-sm">Productividad del Mesero</CardTitle>
          <CardDescription className="text-xs">
            Órdenes atendidas por mesero
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[220px]">
            <div className="text-muted-foreground text-sm">
              Cargando datos...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[320px]" style={{ borderRadius: "30px" }}>
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-sm">Productividad del Mesero</CardTitle>
          <CardDescription className="text-xs">
            Órdenes atendidas por mesero
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex flex-col items-center justify-center h-[220px] space-y-2">
            <div className="text-red-600 text-sm">Error: {error}</div>
            <div className="text-xs text-muted-foreground">
              Mostrando datos de ejemplo
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full h-[320px]" style={{ borderRadius: "30px" }}>
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-sm">Productividad del Mesero</CardTitle>
        <CardDescription className="text-xs">
          {dateRange && dateRange.from && dateRange.to
            ? `Órdenes del ${format(dateRange.from, "dd/MM", {
                locale: es,
              })} al ${format(dateRange.to, "dd/MM", { locale: es })}`
            : "Órdenes atendidas por mesero"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 px-6">
        <div className="flex flex-col xl:flex-row items-center gap-4 h-full">
          {/* Legend - Shows on top for small/medium, on left for xl */}
          <div className="flex flex-col gap-2 justify-center w-full xl:w-auto order-1 xl:order-1">
            {chartData.slice(0, 5).map((item, index) => (
              <div
                key={item.waiterName}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                <span className="truncate max-w-[90px]" title={item.waiterName}>
                  {item.waiterName}
                </span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {item.orders}
                </span>
              </div>
            ))}
          </div>

          {/* Chart - Shows on bottom for small/medium, on right for xl */}
          <div className="flex items-center justify-center w-full xl:flex-1 order-2 xl:order-2">
            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[200px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="orders"
                    nameKey="waiterName"
                    innerRadius="35%"
                    outerRadius="70%"
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
