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

export default function DashboardHome() {
  const { toggleSidebar } = useSidebar();

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 md:hidden col-span-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden h-auto py-3 w-12 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </Button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart - Flujo de Atención por Franja Horaria */}
        <div>
          <ChartAreaDefault />
        </div>

        {/* Pie Chart - Productividad del Mesero */}
        <div>
          <ChartPieDonut />
        </div>
      </div>
    </div>
  );
}
