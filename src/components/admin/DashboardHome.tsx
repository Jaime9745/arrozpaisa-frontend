import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, Table, Users } from "lucide-react";
import StatsCard from "./StatsCard";

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
      value: "15/20",
      description: "75% ocupación",
      icon: Table,
      trend: "up" as const,
    },
    {
      title: "Meseros Activos",
      value: "8",
      description: "Turno actual",
      icon: Users,
      trend: "neutral" as const,
    }
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
        <Card style={{ borderRadius: '30px' }}>
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
            <CardDescription>Últimas órdenes del restaurante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((order) => (
                <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Mesa {order + 4}</p>
                    <p className="text-sm text-gray-600">Orden #{1000 + order}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 50 + 20).toFixed(2)}</p>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      En preparación
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '30px' }}>
          <CardHeader>
            <CardTitle>Estado de Mesas</CardTitle>
            <CardDescription>Vista rápida del estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-center text-sm font-medium ${
                    i < 15
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {i + 1}
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
                Disponible
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
