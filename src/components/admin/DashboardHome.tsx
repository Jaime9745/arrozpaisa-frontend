import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  Table,
  Users,
  Menu,
  TrendingUp,
  Gift,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import StatsCard from "./StatsCard";
import { ChartAreaDefault } from "../chart-area-default";
import { ChartPieDonut } from "../chart-pie-donut";
import { useTableMetrics } from "@/hooks/useTableMetrics";
import { useWaiterPerformance } from "@/hooks/useWaiterPerformance";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

export default function DashboardHome() {
  const { toggleSidebar } = useSidebar();
  const {
    tableMetrics,
    loading: tableLoading,
    error: tableError,
  } = useTableMetrics();

  // Date range state for waiter performance
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(), // today
  });

  // Get all waiters performance
  const {
    waiterPerformance,
    loading: waiterLoading,
    error: waiterError,
  } = useWaiterPerformance({
    startDate:
      dateRange?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: dateRange?.to || new Date(),
    enabled: true,
  });

  const dashboardStats = [
    {
      title: "Ventas del Día",
      value: "$124,500",
      description: "+12% desde ayer",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Producto Más Vendido",
      value: "Arroz con Pollo",
      description: "28 órdenes hoy",
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Propinas Recaudadas",
      value: "$8,750",
      description: "+5% desde ayer",
      icon: Gift,
      trend: "up" as const,
    },
    {
      title: "Número de Pedidos",
      value: "89",
      description: "23 activos",
      icon: ShoppingBag,
      trend: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header with Date Range Picker */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden h-auto py-3 w-12 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </Button>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="Seleccionar período"
            className="w-auto"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Area Chart - Flujo de Atención por Franja Horaria */}
        <div className="w-full">
          <ChartAreaDefault />
        </div>

        {/* Pie Chart - Productividad del Mesero (Número de Órdenes) */}
        <div>
          <ChartPieDonut
            waiterPerformance={waiterPerformance}
            loading={waiterLoading}
            error={waiterError}
            dateRange={dateRange}
          />
        </div>
      </div>

      <Card style={{ borderRadius: "30px" }} className="h-full">
        <CardHeader>
          <CardTitle>Estado de Mesas</CardTitle>
          <CardDescription>Vista rápida del estado actual</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] overflow-auto">
          {tableLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-muted-foreground">
                Cargando estado de mesas...
              </div>
            </div>
          ) : tableError ? (
            <div className="flex flex-col items-center justify-center h-[200px] space-y-2">
              <div className="text-red-600">
                Error al cargar mesas: {tableError}
              </div>
              <div className="text-sm text-muted-foreground">
                Mostrando datos de ejemplo
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-2">
                {tableMetrics?.tables?.map((table) => (
                  <div
                    key={table.id}
                    className={`p-2 rounded-lg text-center text-sm font-medium ${
                      table.status === "free"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800" // For "attended"
                    }`}
                  >
                    {table.number}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  Atendida ({tableMetrics?.occupiedTables || 0})
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                  Libre ({tableMetrics?.freeTables || 0})
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Total: {tableMetrics?.totalTables || 0} mesas
                {tableMetrics?.fromCache && (
                  <span className="ml-2 text-blue-600">(datos en caché)</span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
