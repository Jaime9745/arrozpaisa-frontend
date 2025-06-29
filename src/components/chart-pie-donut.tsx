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

export const description = "A donut chart";

const chartData = [
  { browser: "Carlos", visitors: 45, fill: "var(--color-carlos)" },
  { browser: "María", visitors: 38, fill: "var(--color-maria)" },
  { browser: "José", visitors: 32, fill: "var(--color-jose)" },
  { browser: "Ana", visitors: 28, fill: "var(--color-ana)" },
  { browser: "Luis", visitors: 25, fill: "var(--color-luis)" },
];

const chartConfig = {
  visitors: {
    label: "Órdenes",
  },
  carlos: {
    label: "Carlos",
    color: "var(--chart-1)",
  },
  maria: {
    label: "María",
    color: "var(--chart-2)",
  },
  jose: {
    label: "José",
    color: "var(--chart-3)",
  },
  ana: {
    label: "Ana",
    color: "var(--chart-4)",
  },
  luis: {
    label: "Luis",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPieDonut() {
  return (
    <Card className="flex flex-col" style={{ borderRadius: "30px" }}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Productividad del Mesero</CardTitle>
        <CardDescription>Órdenes atendidas por mesero hoy</CardDescription>
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
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Rendimiento mejorado 8.5% esta semana{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Órdenes totales atendidas por el equipo
        </div>
      </CardFooter>
    </Card>
  );
}
