import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TableStatus() {
  // Static mock data to avoid hydration issues
  const tableData = [
    { number: 1, capacity: 4, status: "Ocupada", waiter: "María", time: 25 },
    { number: 2, capacity: 2, status: "Ocupada", waiter: "Carlos", time: 45 },
    { number: 3, capacity: 6, status: "Reservada", waiter: null, time: null },
    { number: 4, capacity: 4, status: "Ocupada", waiter: "Ana", time: 30 },
    { number: 5, capacity: 2, status: "Limpieza", waiter: null, time: null },
    { number: 6, capacity: 4, status: "Ocupada", waiter: "Pedro", time: 15 },
    { number: 7, capacity: 2, status: "Ocupada", waiter: "María", time: 40 },
    { number: 8, capacity: 6, status: "Ocupada", waiter: "Carlos", time: 20 },
    { number: 9, capacity: 4, status: "Reservada", waiter: null, time: null },
    { number: 10, capacity: 2, status: "Ocupada", waiter: "Ana", time: 35 },
    { number: 11, capacity: 4, status: "Ocupada", waiter: "Pedro", time: 50 },
    { number: 12, capacity: 2, status: "Ocupada", waiter: "María", time: 25 },
    { number: 13, capacity: 6, status: "Limpieza", waiter: null, time: null },
    { number: 14, capacity: 4, status: "Ocupada", waiter: "Carlos", time: 60 },
    { number: 15, capacity: 2, status: "Ocupada", waiter: "Ana", time: 18 },
    { number: 16, capacity: 4, status: "Disponible", waiter: null, time: null },
    { number: 17, capacity: 2, status: "Disponible", waiter: null, time: null },
    { number: 18, capacity: 6, status: "Disponible", waiter: null, time: null },
    { number: 19, capacity: 4, status: "Disponible", waiter: null, time: null },
    { number: 20, capacity: 2, status: "Disponible", waiter: null, time: null },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estados de Mesa</h1>
        <p className="text-gray-600 mt-2">
          Gestiona el estado de todas las mesas del restaurante
        </p>
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tableData.map((table) => (
          <Card
            key={table.number}
            className="hover:shadow-lg transition-shadow duration-200"
            style={{ borderRadius: "30px" }}
          >
            <CardHeader>
              <CardTitle className="text-center">Mesa {table.number}</CardTitle>
              <CardDescription className="text-center">
                Capacidad: {table.capacity} personas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                  table.status === "Disponible"
                    ? "bg-green-100 text-green-800"
                    : table.status === "Ocupada"
                    ? "bg-red-100 text-red-800"
                    : table.status === "Reservada"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {table.status}
              </div>
              {table.status === "Ocupada" && table.waiter && table.time && (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Mesero: {table.waiter}</p>
                  <p>Tiempo: {table.time} min</p>
                </div>
              )}
              <div className="mt-4 space-x-2">
                <Button variant="outline" size="sm">
                  Cambiar Estado
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
