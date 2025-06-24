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
import { Search, Plus, Edit, Trash2, Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/services/productsService";
import { useProducts } from "@/hooks/useProducts";
import { useSidebar } from "@/contexts/SidebarContext";

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, loading, error, deleteProduct } = useProducts();
  const { toggleSidebar } = useSidebar();

  // Handle product deletion with confirmation
  const handleDeleteProduct = async (id: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await deleteProduct(id);
      } catch (error) {
        // Error is already handled in the hook
        console.error("Failed to delete product:", error);
      }
    }
  };
  // Filter products based on search term (only show active products)
  const filteredProducts = products.filter(
    (product) =>
      product.isActive &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };
  return (
    <div className="space-y-6">
      {" "}
      {/* Search Input Where Title Was */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-4">
        <div className="flex items-center gap-4 flex-1">
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
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-gray-200 pl-4 pr-12 py-4 shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Button
          className="px-8 py-3 w-full sm:min-w-[180px] sm:w-auto text-white flex items-center gap-2 justify-center"
          style={{ background: "#EB3123" }}
        >
          <Plus className="h-5 w-5" />
          Agregar Plato
        </Button>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {/* Big General Card Container */}{" "}
      <Card
        className="p-6 border-0 h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]"
        style={{ borderRadius: "30px" }}
      >
        {/* Scrollable Content Area */}
        <CardContent className="px-0 pb-0 h-full overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-gray-500">Cargando productos...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pr-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => (
                  <Card
                    key={product.id}
                    className="transition-colors duration-200 relative min-h-[120px]"
                    style={{ borderRadius: "30px", backgroundColor: "#F1EFEF" }}
                  >
                    <div className="flex">
                      {" "}
                      {/* Image Section */}
                      <div className="w-28 h-28 flex-shrink-0 pl-3 pr-1 py-2">
                        {" "}
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-2xl"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder-dish.svg"; // Fallback image
                          }}
                        />
                      </div>
                      {/* Content Section */}
                      <div className="flex-1 flex flex-col justify-between pr-16 pl-2">
                        {" "}
                        <CardHeader className="pb-1">
                          <CardTitle className="text-lg">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 max-h-10 overflow-hidden">
                            {product.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-1">
                          <div className="flex flex-col gap-1">
                            <span
                              className="text-base font-normal"
                              style={{ color: "#C83636" }}
                            >
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </div>

                    {/* Dropdown button positioned absolutely in the middle right */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-16 w-16 p-0"
                          >
                            <Image
                              src="/images/dropMenuBtn.svg"
                              alt="Menu"
                              width={48}
                              height={48}
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 p-2">
                          <DropdownMenuItem className="cursor-pointer p-3">
                            <Edit
                              className="h-5 w-5 mr-3"
                              style={{ color: "#DFAA30" }}
                            />
                            <span style={{ color: "#DFAA30" }}>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer focus:bg-red-50 p-3"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            {" "}
                            <Trash2
                              className="h-5 w-5 mr-3"
                              style={{ color: "#E71D36" }}
                            />
                            <span style={{ color: "#E71D36" }}>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No se encontraron productos que coincidan con tu búsqueda."
                      : "No hay productos disponibles en este momento."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
