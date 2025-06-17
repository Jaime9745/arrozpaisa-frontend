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
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Waiter } from "@/services/waitersService";
import { useWaiters } from "@/hooks/useWaiters";

export default function WaiterManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
  );
  const { waiters, loading, error, deleteWaiter } = useWaiters();

  // Handle waiter deletion with confirmation
  const handleDeleteWaiter = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este mesero?")) {
      try {
        await deleteWaiter(id);
      } catch (error) {
        console.error("Failed to delete waiter:", error);
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (waiterId: string) => {
    const newVisiblePasswords = new Set(visiblePasswords);
    if (newVisiblePasswords.has(waiterId)) {
      newVisiblePasswords.delete(waiterId);
    } else {
      newVisiblePasswords.add(waiterId);
    }
    setVisiblePasswords(newVisiblePasswords);
  };
  const columns: ColumnDef<Waiter>[] = [
    {
      accessorKey: "firstName",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-medium">
          {`${row.getValue("firstName")} ${row.original.lastName}`}
        </span>
      ),
    },
    {
      accessorKey: "identificationNumber",
      header: "Identificación",
      cell: ({ row }) => {
        const id = row.getValue("identificationNumber") as string;
        // Format identification number with dots for readability
        if (id && id.length >= 7) {
          return id.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return id;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Celular",
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as string;
        // Format phone number for display (assuming Colombian format)
        if (phone && phone.length === 10) {
          return `+57 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(
            6
          )}`;
        }
        return phone;
      },
    },
    {
      accessorKey: "userName",
      header: "Usuario",
      cell: ({ row }) => (
        <span className="text-blue-600 font-medium">
          {row.getValue("userName")}
        </span>
      ),
    },
    {
      accessorKey: "password",
      header: "Contraseña",
      cell: ({ row }) => {
        const waiterId = row.original.id;
        const password = row.getValue("password") as string;
        const isVisible = visiblePasswords.has(waiterId);

        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {isVisible ? password : "••••••••"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePasswordVisibility(waiterId)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 p-0">
                <Image
                  src="/images/dropMenuBtn.svg"
                  alt="Menu"
                  width={48}
                  height={48}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 p-2"
              style={{ borderRadius: "10px" }}
            >
              <DropdownMenuItem className="cursor-pointer p-3">
                <Edit className="h-5 w-5 mr-3" style={{ color: "#DFAA30" }} />
                <span style={{ color: "#DFAA30" }}>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer focus:bg-red-50 p-3"
                onClick={() => handleDeleteWaiter(row.original.id)}
              >
                <Trash2 className="h-5 w-5 mr-3" style={{ color: "#E71D36" }} />
                <span style={{ color: "#E71D36" }}>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      {/* Search Input Where Title Was */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="flex-1 w-full sm:auto relative">
          <Input
            type="text"
            placeholder="Buscar meseros por nombre, identificación, teléfono o usuario..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full bg-white border-gray-200 pl-4 pr-12 py-3 rounded-xl shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          className="px-8 py-3 w-full sm:min-w-[180px] sm:w-auto text-white flex items-center gap-2 justify-center"
          style={{ background: "#EB3123" }}
        >
          <Plus className="h-5 w-5" />
          Agregar Mesero
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Data Table Card Container */}
      <Card
        className="border-0"
        style={{ borderRadius: "30px", backgroundColor: "#fcfeff" }}
      >
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-gray-500">Cargando meseros...</div>
            </div>
          ) : (
            <DataTable<Waiter, any>
              columns={columns}
              data={waiters}
              globalFilter={searchTerm}
              onGlobalFilterChange={setSearchTerm}
              useCardStyle={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
