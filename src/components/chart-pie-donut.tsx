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
  // Debug logging
  console.log("🥧 ChartPieDonut received:", {
    waiterPerformanceLength: waiterPerformance.length,
    waiterPerformance: waiterPerformance,
    loading,
    error,
  });

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

  console.log("📊 ChartPieDonut processed chartData:", chartData);

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
      <Card className="flex flex-col" style={{ borderRadius: "30px" }}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Productividad del Mesero</CardTitle>
          <CardDescription>Órdenes atendidas por mesero</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-muted-foreground">Cargando datos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col" style={{ borderRadius: "30px" }}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Productividad del Mesero</CardTitle>
          <CardDescription>Órdenes atendidas por mesero</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex flex-col items-center justify-center h-[250px] space-y-2">
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
    <Card className="flex flex-col" style={{ borderRadius: "30px" }}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Productividad del Mesero</CardTitle>
        <CardDescription>
          {dateRange && dateRange.from && dateRange.to
            ? `Órdenes del ${format(dateRange.from, "dd/MM", {
                locale: es,
              })} al ${format(dateRange.to, "dd/MM", { locale: es })}`
            : "Órdenes atendidas por mesero"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="orders"
              nameKey="waiterName"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {waiterPerformance.length > 0 ? (
            <>
              Total de {totalOrders} órdenes <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Rendimiento mejorado 8.5% esta semana{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          {waiterPerformance.length > 0
            ? `Distribución de órdenes entre ${chartData.length} meseros activos`
            : "Órdenes totales atendidas por el equipo"}
        </div>
        {waiterPerformance.some((p) => p.fromCache) && (
          <div className="text-xs text-blue-600">Algunos datos en caché</div>
        )}
      </CardFooter>
    </Card>
  );
}
