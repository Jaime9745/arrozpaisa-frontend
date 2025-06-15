"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

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
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Eliminar
        </Button>
      </div>
    ),
  },
];

export default function WaiterManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Search Input Where Title Was */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-2">
        <div className="flex-1 w-full sm:max-w-2xl relative">
          <Input
            type="text"
            placeholder="Buscar meseros por nombre, identificación, celular o usuario..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full bg-white border-gray-200 pl-4 pr-12 py-3 rounded-xl shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          className="px-8 py-3 w-full sm:min-w-[180px] sm:w-auto text-white font-semibold flex items-center gap-2 justify-center"
          style={{ background: "#EB3123" }}
        >
          <Plus className="h-5 w-5" />
          Agregar Mesero
        </Button>
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
        </CardHeader>{" "}
        <CardContent>
          {" "}
          <DataTable<Waiter, any>
            columns={columns}
            data={waiters}
            globalFilter={searchTerm}
            onGlobalFilterChange={setSearchTerm}
          />
        </CardContent>
      </Card>
    </div>
  );
}
