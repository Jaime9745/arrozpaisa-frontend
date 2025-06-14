"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Waiter {
  id: number;
  nombre: string;
  identificacion: string;
  celular: string;
  usuario: string;
}

const waiters: Waiter[] = [
  {
    id: 1,
    nombre: "María González",
    identificacion: "1.234.567.890",
    celular: "+57 300 123 4567",
    usuario: "maria.gonzalez",
  },
  {
    id: 2,
    nombre: "Carlos Ruiz",
    identificacion: "1.345.678.901",
    celular: "+57 301 234 5678",
    usuario: "carlos.ruiz",
  },
  {
    id: 3,
    nombre: "Ana López",
    identificacion: "1.456.789.012",
    celular: "+57 302 345 6789",
    usuario: "ana.lopez",
  },
  {
    id: 4,
    nombre: "Pedro Martínez",
    identificacion: "1.567.890.123",
    celular: "+57 303 456 7890",
    usuario: "pedro.martinez",
  },
  {
    id: 5,
    nombre: "Laura Díaz",
    identificacion: "1.678.901.234",
    celular: "+57 304 567 8901",
    usuario: "laura.diaz",
  },
  {
    id: 6,
    nombre: "José García",
    identificacion: "1.789.012.345",
    celular: "+57 305 678 9012",
    usuario: "jose.garcia",
  },
];

const columns: ColumnDef<Waiter>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "identificacion",
    header: "Identificación",
  },
  {
    accessorKey: "celular",
    header: "Celular",
  },
  {
    accessorKey: "usuario",
    header: "Usuario",
    cell: ({ row }) => (
      <span className="text-blue-600 font-medium">
        {row.getValue("usuario")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: () => (
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          Editar
        </Button>
        <Button variant="outline" size="sm">
          Ver Detalles
        </Button>
      </div>
    ),
  },
];

export default function WaiterManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Meseros</h1>
        <Button>Agregar Mesero</Button>
      </div>

      {/* Data Table Card Container */}
      <Card className="shadow-xl border-0" style={{ borderRadius: "30px" }}>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Lista de Meseros
          </CardTitle>
          <CardDescription>
            Gestiona todos los meseros del restaurante
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable columns={columns} data={waiters} />
        </CardContent>
      </Card>
    </div>
  );
}
