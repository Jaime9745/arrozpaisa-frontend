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
import { Plus, Search, Edit, Trash2, Eye, EyeOff, X, Menu } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Waiter } from "@/services/waitersService";
import { useWaiters } from "@/hooks/useWaiters";
import { useSidebar } from "@/contexts/SidebarContext";

export default function WaiterManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identificationNumber: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [waiterToDelete, setWaiterToDelete] = useState<string | null>(null);
  const { waiters, loading, error, deleteWaiter, createWaiter } = useWaiters();
  const { toggleSidebar } = useSidebar();
  // Handle waiter deletion with confirmation
  const handleDeleteWaiter = async (id: string) => {
    setWaiterToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDeleteWaiter = async () => {
    if (waiterToDelete) {
      try {
        await deleteWaiter(waiterToDelete);
      } catch (error) {
        console.error("Failed to delete waiter:", error);
      } finally {
        setDeleteDialogOpen(false);
        setWaiterToDelete(null);
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle form submission
  const handleCreateWaiter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      // Generate username from firstName and lastName
      const userName = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
      const waiterData = {
        ...formData,
        userName,
      };
      await createWaiter(waiterData);
      // Reset form and close it
      setFormData({
        firstName: "",
        lastName: "",
        identificationNumber: "",
        phoneNumber: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create waiter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Close form
  const handleCloseForm = () => {
    setShowCreateForm(false);
    setFormData({
      firstName: "",
      lastName: "",
      identificationNumber: "",
      phoneNumber: "",
    });
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
              {" "}
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
      {" "}
      {/* Search Input and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-4 flex-1">
          {" "}
          {/* Mobile Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden h-auto py-3 w-12 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </Button>
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Buscar meseros por nombre, identificación, teléfono o usuario..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-white border-gray-200 pl-4 pr-12 py-4 shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Button
          className="px-8 py-3 w-full sm:min-w-[180px] sm:w-auto text-white flex items-center gap-2 justify-center font-normal transition-all duration-200 hover:shadow-lg hover:brightness-110"
          style={{ background: "#EB3123" }}
          onClick={() => setShowCreateForm(true)}
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
      {/* Main Content Area with Side-by-Side Layout */}
      <div className="flex gap-6">
        {/* Data Table Card Container */}
        <div
          className={`transition-all duration-300 ${
            showCreateForm ? "w-2/3" : "w-full"
          }`}
        >
          {" "}
          <Card
            className="border-0 h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]"
            style={{ borderRadius: "30px", backgroundColor: "#fcfeff" }}
          >
            <CardContent className="h-full overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-lg text-gray-500">
                    Cargando meseros...
                  </div>
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

        {/* Create Waiter Form Card */}
        {showCreateForm && (
          <div className="w-1/3">
            <Card
              className="border-0 sticky top-6"
              style={{ borderRadius: "30px", backgroundColor: "#fcfeff" }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Añadir Mesero
                  </CardTitle>{" "}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseForm}
                    className="h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    {" "}
                    <Image
                      src="/images/icons/closeCardIcon.svg"
                      alt="Close"
                      width={40}
                      height={40}
                      className="transition-transform duration-200"
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateWaiter} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nombre *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-gray-200 rounded-lg"
                        placeholder="Ej: Juan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Apellido *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-gray-200 rounded-lg"
                        placeholder="Ej: Pérez"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="identificationNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        Número de Identificación *
                      </Label>
                      <Input
                        id="identificationNumber"
                        name="identificationNumber"
                        type="text"
                        value={formData.identificationNumber}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-gray-200 rounded-lg"
                        placeholder="Ej: 12345678"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        Número de Celular *
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-gray-200 rounded-lg"
                        placeholder="Ej: 3001234567"
                      />
                    </div>
                  </div>{" "}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 text-white font-normal transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg disabled:hover:scale-100"
                      style={{ background: "#EB3123", borderRadius: "30px" }}
                    >
                      {isSubmitting ? "Creando..." : "Añadir Mesero"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>{" "}
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          className="sm:max-w-[425px]"
          style={{ borderRadius: "20px" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-800">
              Confirmar Eliminación
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              ¿Estás seguro de que quieres eliminar este mesero? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ borderRadius: "15px" }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWaiter}
              className="flex-1 text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "#E71D36", borderRadius: "15px" }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
