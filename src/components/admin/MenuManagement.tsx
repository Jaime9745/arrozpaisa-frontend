"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Product } from "@/services/productsService";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSidebar } from "@/contexts/SidebarContext";
import ProductForm from "./product/ProductForm";
import MenuManagementHeader from "./menu/MenuManagementHeader";

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const {
    products,
    loading,
    error,
    deleteProduct,
    createProduct,
    updateProduct,
  } = useProducts();
  const { categories } = useCategories();
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

  // Handle product editing
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditForm(true);
    setIsClosing(false);
    // Close add form if open
    if (showCreateForm) {
      handleCloseAddForm();
    }
  };

  // Handle form submission for adding products
  const handleCreateProduct = async (formData: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
  }) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createProduct({
        ...formData,
        isActive: true, // New products are active by default
      });
      // Close form with animation
      handleCloseAddForm();
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission for editing products
  const handleUpdateProduct = async (formData: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
  }) => {
    if (isSubmitting || !editingProduct) return;

    try {
      setIsSubmitting(true);
      await updateProduct(editingProduct.id, formData);
      // Close form with animation
      handleCloseEditForm();
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close add form with animation
  const handleCloseAddForm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowCreateForm(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Close edit form with animation
  const handleCloseEditForm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEditForm(false);
      setEditingProduct(null);
      setIsClosing(false);
    }, 300); // Match animation duration
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

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Sin categoría";
  };
  return (
    <div className="space-y-6">
      {/* Search Input and Add Button */}
      <MenuManagementHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddProduct={() => {
          setShowCreateForm(true);
          setIsClosing(false);
          // Close edit form if open
          if (showEditForm) {
            handleCloseEditForm();
          }
        }}
        onToggleSidebar={toggleSidebar}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content Area with Responsive Layout */}
      <div className="space-y-6 lg:space-y-0 lg:flex lg:gap-6">
        {/* Forms Container - Shows on top for mobile/tablet, side for desktop */}
        {(showCreateForm || showEditForm || isClosing) && (
          <div
            className={`lg:order-2 lg:w-1/3 w-full transition-all duration-300 ${
              (showCreateForm || showEditForm) && !isClosing
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {/* Create Product Form */}
            {showCreateForm && (
              <div
                className={`transform transition-all duration-300 ease-in-out ${
                  isClosing
                    ? "scale-95 opacity-0 -translate-y-4 lg:translate-y-0 lg:translate-x-4"
                    : "scale-100 opacity-100 translate-y-0 lg:translate-x-0"
                }`}
              >
                <ProductForm
                  mode="add"
                  onSubmit={handleCreateProduct}
                  onClose={handleCloseAddForm}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}

            {/* Edit Product Form */}
            {showEditForm && editingProduct && (
              <div
                className={`transform transition-all duration-300 ease-in-out ${
                  isClosing
                    ? "scale-95 opacity-0 -translate-y-4 lg:translate-y-0 lg:translate-x-4"
                    : "scale-100 opacity-100 translate-y-0 lg:translate-x-0"
                }`}
              >
                <ProductForm
                  mode="edit"
                  initialData={{
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    categoryId: editingProduct.categoryId,
                    imageUrl: editingProduct.imageUrl,
                  }}
                  onSubmit={handleUpdateProduct}
                  onClose={handleCloseEditForm}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        )}

        {/* Menu Cards Container */}
        <div
          className={`lg:order-1 transition-all duration-300 ${
            (showCreateForm || showEditForm) && !isClosing
              ? "lg:w-2/3 w-full"
              : "w-full"
          }`}
        >
          {/* Big General Card Container */}
          <Card
            className={`p-6 border-0 transition-all duration-300 ${
              (showCreateForm || showEditForm) && !isClosing
                ? "h-[calc(100vh-500px)] sm:h-[calc(100vh-480px)] md:h-[calc(100vh-460px)] lg:h-[calc(100vh-100px)]"
                : "h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]"
            }`}
            style={{ borderRadius: "30px" }}
          >
            {/* Scrollable Content Area */}
            <CardContent className="px-0 pb-0 h-full overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-lg text-gray-500">
                    Cargando productos...
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pr-2">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: Product) => (
                      <Card
                        key={product.id}
                        className="transition-colors duration-200 relative min-h-[120px]"
                        style={{
                          borderRadius: "30px",
                          backgroundColor: "#F1EFEF",
                        }}
                      >
                        <div className="flex">
                          {/* Image Section */}
                          <div className="w-28 h-28 flex-shrink-0 pl-3 pr-1 py-2">
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
                            <CardHeader className="pb-1">
                              <CardTitle className="text-lg">
                                {product.name}
                              </CardTitle>
                              <div className="mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {getCategoryName(product.categoryId)}
                                </Badge>
                              </div>
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
                            <DropdownMenuContent
                              align="end"
                              className="w-36 p-2"
                            >
                              <DropdownMenuItem
                                className="cursor-pointer p-3"
                                onClick={() => handleEditProduct(product)}
                              >
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
                                <Trash2
                                  className="h-5 w-5 mr-3"
                                  style={{ color: "#E71D36" }}
                                />
                                <span style={{ color: "#E71D36" }}>
                                  Eliminar
                                </span>
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
      </div>
    </div>
  );
}
