import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MenuManagement() {
  const menuItems = [
    { name: "Arroz Paisa", price: "$18.000", category: "Platos Principales" },
    { name: "Chow Mein", price: "$15.000", category: "Platos Chinos" },
    { name: "Bandeja Paisa", price: "$22.000", category: "Platos Principales" },
    { name: "Wonton", price: "$12.000", category: "Entradas" },
    { name: "Sancocho", price: "$16.000", category: "Sopas" },
    { name: "Arroz Chino", price: "$14.000", category: "Platos Chinos" },
    // Add more items to demonstrate scrolling
    { name: "Pollo Teriyaki", price: "$19.000", category: "Platos Chinos" },
    { name: "Ajiaco", price: "$17.000", category: "Sopas" },
    { name: "Spring Rolls", price: "$13.000", category: "Entradas" },
    { name: "Lomo Saltado", price: "$25.000", category: "Platos Principales" },
    { name: "Sopa Wonton", price: "$14.500", category: "Sopas" },
    { name: "Cerdo Agridulce", price: "$21.000", category: "Platos Chinos" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Menú</h1>
        <Button>Agregar Plato</Button>
      </div>

      {/* Big General Card Container */}
      <Card
        className="p-6 shadow-xl border-0"
        style={{ borderRadius: "30px", height: "calc(100vh - 200px)" }}
      >
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl text-gray-800">
            Lista de Platos
          </CardTitle>
          <CardDescription>Gestiona todos los platos del menú</CardDescription>
        </CardHeader>

        {/* Scrollable Content Area */}
        <CardContent className="px-0 pb-0 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
            {menuItems.map((dish, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200"
                style={{ borderRadius: "30px" }}
              >
                <CardHeader>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardDescription>{dish.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {dish.price}
                    </span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm">
                        Eliminar
                      </Button>
                    </div>
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
