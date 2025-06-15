import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, DollarSign, Table, Users } from "lucide-react";
import StatsCard from "./StatsCard";

// Import the same table data that's used in TableStatus component
const tableData = [
  { number: 1, capacity: 4, status: "Ocupada", waiter: "María", time: 25 },
  { number: 2, capacity: 2, status: "Servida", waiter: "Carlos", time: 45 },
  { number: 3, capacity: 6, status: "Libre", waiter: null, time: null },
  { number: 4, capacity: 4, status: "Ocupada", waiter: "Ana", time: 30 },
  { number: 5, capacity: 2, status: "Libre", waiter: null, time: null },
  { number: 6, capacity: 4, status: "Servida", waiter: "Pedro", time: 15 },
  { number: 7, capacity: 2, status: "Ocupada", waiter: "María", time: 40 },
  { number: 8, capacity: 6, status: "Ocupada", waiter: "Carlos", time: 20 },
  { number: 9, capacity: 4, status: "Libre", waiter: null, time: null },
  { number: 10, capacity: 2, status: "Servida", waiter: "Ana", time: 35 },
  { number: 11, capacity: 4, status: "Libre", waiter: null, time: null },
  { number: 12, capacity: 2, status: "Libre", waiter: null, time: null },
  { number: 13, capacity: 6, status: "Servida", waiter: "Pedro", time: 50 },
  { number: 14, capacity: 4, status: "Libre", waiter: null, time: null },
];

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
  ];
  // Static mock data for recent orders based on tables with "Servida" or "Ocupada" status
  const recentOrders = [
    {
      id: 1,
      table: 1,
      orderNum: 1001,
      price: "34.50",
      status: "En preparación",
    },
    { id: 2, table: 2, orderNum: 1002, price: "42.20", status: "Entregado" },
    {
      id: 3,
      table: 4,
      orderNum: 1003,
      price: "28.90",
      status: "En preparación",
    },
    { id: 4, table: 6, orderNum: 1004, price: "56.75", status: "Entregado" },
  ];

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
