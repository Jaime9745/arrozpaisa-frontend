"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useHourlyFlowMetrics } from "@/hooks/useHourlyFlowMetrics";
import { type DateRange } from "react-day-picker";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Flujo de atención por franja horaria";

const chartConfig = {
  ordersCount: {
    label: "Órdenes",
    color: "#86efac", // Verde clarito (green-300)
  },
} satisfies ChartConfig;

interface ChartAreaDefaultProps {
  dateRange?: DateRange;
}

export function ChartAreaDefault({ dateRange }: ChartAreaDefaultProps) {
  const { hourlyFlowMetrics, loading, error } = useHourlyFlowMetrics({
    startDate: dateRange?.from,
    endDate: dateRange?.to,
  });

  // Transformar datos para el gráfico
  const chartData =
    hourlyFlowMetrics?.hourlyFlow.map((item) => ({
      hour: item.hourLabel,
      ordersCount: item.ordersCount,
    })) ?? [];

  if (loading) {
    return (
      <Card className="w-full" style={{ borderRadius: "30px" }}>
        <CardHeader>
          <CardTitle>Flujo de Atención por Franja Horaria</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground">Cargando datos…</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full" style={{ borderRadius: "30px" }}>
        <CardHeader>
          <CardTitle>Flujo de Atención por Franja Horaria</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-102" style={{ borderRadius: "30px" }}>
      <CardHeader className="pb-2">
        <CardTitle>Flujo de Atención por Franja Horaria</CardTitle>
        <p className="text-sm text-muted-foreground">
          {hourlyFlowMetrics?.date} • Hora pico:{" "}
          {hourlyFlowMetrics?.peakHourLabel}
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Número de Pedidos",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: 12 },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="ordersCount"
              type="monotone"
              fill="#86efac"
              fillOpacity={0.4}
              stroke="#22c55e"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
