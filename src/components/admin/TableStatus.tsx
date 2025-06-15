import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Define the tableData array that will be used by both TableStatus and DashboardHome
export const tableData = [
  { number: 1, status: "Ocupada" },
  { number: 2, status: "Servida" },
  { number: 3, status: "Libre" },
  { number: 4, status: "Ocupada" },
  { number: 5, status: "Libre" },
  { number: 6, status: "Servida" },
  { number: 7, status: "Ocupada" },
  { number: 8, status: "Ocupada" },
  { number: 9, status: "Libre" },
  { number: 10, status: "Servida" },
  { number: 11, status: "Libre" },
  { number: 12, status: "Libre" },
  { number: 13, status: "Servida" },
  { number: 14, status: "Libre" },
];

export default function TableStatus() {
  // Static mock data with only 14 tables and 3 statuses: Libre (Free/Gray), Ocupada (Occupied/Red), Servida (Served/Green)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-2">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Estados de Mesa</h2>
          <p className="text-gray-600 mt-1">
            Gestiona el estado de todas las mesas del restaurante
          </p>
        </div>
        <Button
          className="px-8 py-3 w-full sm:min-w-[180px] sm:w-auto text-white font-semibold flex items-center gap-2 justify-center"
          style={{ background: "#EB3123" }}
        >
          <Plus className="h-5 w-5" />
          Agregar Mesa
        </Button>
      </div>

      {/* Big General Card Container */}
      <Card
        className="p-6 border-0"
        style={{ borderRadius: "30px", height: "calc(100vh - 200px)" }}
      >
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl text-gray-800">
            Lista de Mesas
          </CardTitle>
          <CardDescription>
            Gestiona el estado de todas las mesas del restaurante
          </CardDescription>
        </CardHeader>

        {/* Scrollable Content Area */}
        <CardContent className="px-0 pb-0 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pr-2">
            {tableData.map((table) => (
              <Card
                key={table.number}
                className="hover:shadow-lg transition-shadow duration-200"
                style={{ borderRadius: "30px" }}
              >
                {" "}
                <CardHeader>
                  <CardTitle className="text-center">
                    Mesa {table.number}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                      table.status === "Libre"
                        ? "bg-gray-100 text-gray-800"
                        : table.status === "Ocupada"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800" // For "Servida"
                    }`}
                  >
                    {table.status}
                  </div>
                  <div className="mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      Cambiar Estado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
