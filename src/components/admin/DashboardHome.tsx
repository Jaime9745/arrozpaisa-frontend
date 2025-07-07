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
import { useSalesMetrics } from "@/hooks/useSalesMetrics";
import { useProductMetrics } from "@/hooks/useProductMetrics";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Calendar04 from "../calendar-04";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

export default function DashboardHome() {
  const { toggleSidebar } = useSidebar();
  const {
    tableMetrics,
    loading: tableLoading,
    error: tableError,
  } = useTableMetrics();

  // Date range state for metrics
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(), // today
  });

  // Calculate period based on date range
  const calculatePeriod = (
    startDate: Date,
    endDate: Date
  ): "day" | "week" | "month" => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "day";
    if (diffDays <= 7) return "week";
    return "month";
  };

  const currentPeriod = calculatePeriod(
    dateRange?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    dateRange?.to || new Date()
  );

  // Calculate period for product metrics (only week or month supported)
  const getProductPeriod = (
    period: "day" | "week" | "month"
  ): "week" | "month" => {
    return period === "month" ? "month" : "week";
  };

  // Get sales metrics
  const {
    salesMetrics,
    loading: salesLoading,
    error: salesError,
  } = useSalesMetrics({
    period: currentPeriod,
    startDate:
      dateRange?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: dateRange?.to || new Date(),
  });

  // Get product metrics
  const {
    productMetrics,
    loading: productLoading,
    error: productError,
  } = useProductMetrics({
    period: getProductPeriod(currentPeriod),
    startDate:
      dateRange?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: dateRange?.to || new Date(),
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

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get top product from product metrics
  const getTopProduct = () => {
    if (productLoading) {
      return {
        name: "Cargando...",
        orders: 0,
      };
    }

    if (productError || !productMetrics?.topProducts?.length) {
      return {
        name: "Sin datos",
        orders: 0,
      };
    }

    // Get the product with the highest quantity
    const topProduct = productMetrics.topProducts.reduce((prev, current) =>
      current.quantity > prev.quantity ? current : prev
    );

    return {
      name: topProduct.productName,
      orders: topProduct.quantity,
    };
  };

  const topProduct = getTopProduct();

  // Get period display name
  const getPeriodDisplayName = (period: "day" | "week" | "month") => {
    switch (period) {
      case "day":
        return "del Día";
      case "week":
        return "de la Semana";
      case "month":
        return "del Mes";
      default:
        return "del Período";
    }
  };

  const dashboardStats = [
    {
      title: `Ventas ${getPeriodDisplayName(currentPeriod)}`,
      value: salesLoading
        ? "Cargando..."
        : salesError
        ? "Error"
        : formatCurrency(salesMetrics?.totalSales || 0),
      description: salesLoading
        ? "Obteniendo datos..."
        : salesError
        ? "Error al cargar datos"
        : `Total de ${salesMetrics?.totalOrders || 0} órdenes`,
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Producto Más Vendido",
      value: productLoading
        ? "Cargando..."
        : productError
        ? "Error"
        : topProduct.name,
      description: productLoading
        ? "Obteniendo datos..."
        : productError
        ? "Error al cargar datos"
        : `${topProduct.orders} unidades vendidas`,
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Propinas Recaudadas",
      value: salesLoading
        ? "Cargando..."
        : salesError
        ? "Error"
        : formatCurrency(salesMetrics?.totalTips || 0),
      description: salesLoading
        ? "Obteniendo datos..."
        : salesError
        ? "Error al cargar datos"
        : `${(
            ((salesMetrics?.totalTips || 0) / (salesMetrics?.totalSales || 1)) *
            100
          ).toFixed(1)}% del total`,
      icon: Gift,
      trend: "up" as const,
    },
    {
      title: "Número de Pedidos",
      value: salesLoading
        ? "Cargando..."
        : salesError
        ? "Error"
        : (salesMetrics?.totalOrders || 0).toString(),
      description: salesLoading
        ? "Obteniendo datos..."
        : salesError
        ? "Error al cargar datos"
        : `Valor promedio: ${formatCurrency(
            salesMetrics?.averageOrderValue || 0
          )}`,
      icon: ShoppingBag,
      trend: "neutral" as const,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-auto py-3 w-12 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <Menu className="h-6 w-6 text-gray-800" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
            loading={salesLoading || productLoading}
          />
        ))}
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-6 gap-6 auto-rows-[minmax(180px,auto)]">
        {/* Calendar - Spans 2 columns, 1 row */}
        <div className="col-span-6 lg:col-span-2 row-span-1">
          <Calendar04 dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        {/* Area Chart - Spans 4 columns, 2 rows */}
        <div className="col-span-6 lg:col-span-4 row-span-2">
          <ChartAreaDefault />
        </div>

        {/* Pie Chart - Spans 2 columns, 1 row (below calendar) */}
        <div className="col-span-6 lg:col-span-2 row-span-1">
          <ChartPieDonut
            waiterPerformance={waiterPerformance}
            loading={waiterLoading}
            error={waiterError}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}
