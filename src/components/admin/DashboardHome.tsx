import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, DollarSign, Table, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import { tableData } from "./TableStatus"; // Import tableData from TableStatus component

export default function DashboardHome() {
  const dashboardStats = [
    {
      title: "Ventas del Día",
      value: "$124,500",
      description: "+12% desde ayer",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Órdenes Activas",
      value: "23",
      description: "8 en preparación",
      icon: Clock,
      trend: "neutral" as const,
    },
    {
      title: "Mesas Ocupadas",
      value: `${tableData.filter((t) => t.status === "Ocupada").length}/${
        tableData.length
      }`,
      description: `${Math.round(
        (tableData.filter((t) => t.status === "Ocupada").length /
          tableData.length) *
          100
      )}% ocupación`,
      icon: Table,
      trend: "up" as const,
    },
    {
      title: "Meseros Activos",
      value: "8",
      description: "Turno actual",
      icon: Users,
      trend: "neutral" as const,
    },
  ]; // Static mock data for recent orders based on tables with "Servida" or "Ocupada" status
  const recentOrders = tableData
    .filter((table) => table.status === "Servida" || table.status === "Ocupada")
    .slice(0, 4)
    .map((table, index) => ({
      id: index + 1,
      table: table.number,
      orderNum: 1001 + index,
      price: (Math.random() * 50 + 20).toFixed(2),
      status: table.status === "Servida" ? "Entregado" : "En preparación",
    }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card style={{ borderRadius: "30px" }}>
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
            <CardDescription>Últimas órdenes del restaurante</CardDescription>
          </CardHeader>
          <CardContent>
            {" "}
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Mesa {order.table}</p>
                    <p className="text-sm text-gray-600">
                      Orden #{order.orderNum}
                    </p>
                  </div>
                  <div className="text-right">
                    {" "}
                    <p className="font-medium">${order.price}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Entregado"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: "30px" }}>
          <CardHeader>
            <CardTitle>Estado de Mesas</CardTitle>
            <CardDescription>Vista rápida del estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            {" "}
            <div className="grid grid-cols-7 gap-2">
              {tableData.map((table) => (
                <div
                  key={table.number}
                  className={`p-2 rounded-lg text-center text-sm font-medium ${
                    table.status === "Libre"
                      ? "bg-gray-100 text-gray-800"
                      : table.status === "Ocupada"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800" // For "Servida"
                  }`}
                >
                  {table.number}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                Ocupada
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                Servida
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                Libre
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
