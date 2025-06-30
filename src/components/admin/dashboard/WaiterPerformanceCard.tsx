"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WaiterPerformance } from "@/services/metricsService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { type DateRange } from "react-day-picker";

interface WaiterPerformanceCardProps {
  performance: WaiterPerformance | null;
  loading: boolean;
  error: string | null;
  dateRange?: DateRange;
}

export function WaiterPerformanceCard({
  performance,
  loading,
  error,
  dateRange,
}: WaiterPerformanceCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento del Mesero</CardTitle>
          <CardDescription>
            Métricas de desempeño en el período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <div className="text-muted-foreground">
              Cargando datos de rendimiento...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento del Mesero</CardTitle>
          <CardDescription>
            Métricas de desempeño en el período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px] space-y-2">
            <div className="text-red-600">Error: {error}</div>
            <div className="text-sm text-muted-foreground">
              Verifica que el mesero y las fechas sean correctos
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!performance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento del Mesero</CardTitle>
          <CardDescription>
            Métricas de desempeño en el período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <div className="text-muted-foreground">
              Selecciona un mesero para ver su rendimiento
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento: {performance.waiterName}</CardTitle>
        <CardDescription>
          {dateRange && dateRange.from && dateRange.to
            ? `${format(dateRange.from, "dd/MM/yyyy", {
                locale: es,
              })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: es })}`
            : "Período seleccionado"}
          {performance.fromCache && (
            <span className="ml-2 text-blue-600 text-xs">(datos en caché)</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total de Órdenes
            </p>
            <p className="text-2xl font-bold">{performance.totalOrders}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Ventas Totales
            </p>
            <p className="text-2xl font-bold">
              ${performance.totalSales.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Valor Promedio por Orden
          </p>
          <p className="text-xl font-semibold">
            ${performance.averageOrderValue.toLocaleString()}
          </p>
        </div>

        {performance.ordersByDay && performance.ordersByDay.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Desglose por Día
            </p>
            <div className="space-y-2 max-h-[120px] overflow-y-auto">
              {performance.ordersByDay.map((day) => (
                <div
                  key={day.date}
                  className="flex justify-between items-center py-1 px-2 bg-muted/50 rounded"
                >
                  <span className="text-sm">
                    {format(new Date(day.date), "dd/MM/yyyy", { locale: es })}
                  </span>
                  <div className="text-sm font-medium">
                    {day.orders} órdenes - ${day.sales.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Calculado:{" "}
          {format(new Date(performance.calculatedAt), "dd/MM/yyyy HH:mm", {
            locale: es,
          })}
        </div>
      </CardContent>
    </Card>
  );
}
