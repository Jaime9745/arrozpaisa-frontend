import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WaiterManagement() {
  const waiters = [
    { name: "María González", status: "Activo", tables: "3, 7, 12" },
    { name: "Carlos Ruiz", status: "Activo", tables: "1, 8, 15" },
    { name: "Ana López", status: "Descanso", tables: "4, 9, 16" },
    { name: "Pedro Martínez", status: "Activo", tables: "2, 6, 11" },
    { name: "Laura Díaz", status: "Activo", tables: "5, 10, 14" },
    { name: "José García", status: "Inactivo", tables: "13, 17, 20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Meseros</h1>
        <Button>Agregar Mesero</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {waiters.map((waiter, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow duration-200"
            style={{ borderRadius: '30px' }}
          >
            <CardHeader>
              <CardTitle>{waiter.name}</CardTitle>
              <CardDescription>Mesas asignadas: {waiter.tables}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  waiter.status === 'Activo' 
                    ? 'bg-green-100 text-green-800'
                    : waiter.status === 'Descanso'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {waiter.status}
                </span>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Ver Detalles</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
