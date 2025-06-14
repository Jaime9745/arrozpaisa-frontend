import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TableStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estados de Mesa</h1>
        <p className="text-gray-600 mt-2">
          Gestiona el estado de todas las mesas del restaurante
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 20 }, (_, i) => {
          const tableNumber = i + 1;
          const isOccupied = i < 15;
          const statuses = ["Disponible", "Ocupada", "Reservada", "Limpieza"];
          const status = isOccupied 
            ? statuses[Math.floor(Math.random() * (statuses.length - 1)) + 1]
            : 'Disponible';
          
          return (
            <Card 
              key={i} 
              className="hover:shadow-lg transition-shadow duration-200"
              style={{ borderRadius: '30px' }}
            >
              <CardHeader>
                <CardTitle className="text-center">Mesa {tableNumber}</CardTitle>
                <CardDescription className="text-center">
                  Capacidad: {Math.floor(Math.random() * 4) + 2} personas
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                  status === 'Disponible' 
                    ? 'bg-green-100 text-green-800'
                    : status === 'Ocupada'
                    ? 'bg-red-100 text-red-800'
                    : status === 'Reservada'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </div>
                {status === 'Ocupada' && (
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Mesero: {['María', 'Carlos', 'Ana', 'Pedro'][Math.floor(Math.random() * 4)]}</p>
                    <p>Tiempo: {Math.floor(Math.random() * 60) + 15} min</p>
                  </div>
                )}
                <div className="mt-4 space-x-2">
                  <Button variant="outline" size="sm">Cambiar Estado</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
