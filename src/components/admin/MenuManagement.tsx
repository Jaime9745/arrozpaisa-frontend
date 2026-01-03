"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Product } from "@/services/productsService";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSidebar } from "@/contexts/SidebarContext";
import ProductForm from "./menu/ProductForm";
import MenuManagementHeader from "./menu/MenuManagementHeader";
import ProductGrid from "./menu/ProductGrid";
import DeleteConfirmationDialog from "./menu/DeleteConfirmationDialog";

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
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
    const product = products.find((p) => p.id === id);
    if (product) {
      setProductToDelete({ id, name: product.name });
      setDeleteDialogOpen(true);
    }
  };

  // Confirm deletion
  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
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

  return (
    <div className="space-y-6">
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6 lg:space-y-0 lg:flex lg:gap-6">
        {(showCreateForm || showEditForm || isClosing) && (
          <div
            className={`lg:order-2 lg:w-1/3 w-full transition-all duration-300 ${
              (showCreateForm || showEditForm) && !isClosing
                ? "max-h-250 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
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

        <div
          className={`lg:order-1 transition-all duration-300 ${
            (showCreateForm || showEditForm) && !isClosing
              ? "lg:w-2/3 w-full"
              : "w-full"
          }`}
        >
          <Card
            className={`p-6 border-0 transition-all duration-300 ${
              (showCreateForm || showEditForm) && !isClosing
                ? "h-[calc(100vh-500px)] sm:h-[calc(100vh-480px)] md:h-[calc(100vh-460px)] lg:h-[calc(100vh-100px)]"
                : "h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]"
            }`}
            style={{ borderRadius: "30px" }}
          >
            <CardContent className="px-0 pb-0 h-full overflow-y-auto">
              <ProductGrid
                products={products}
                categories={categories}
                searchTerm={searchTerm}
                loading={loading}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteProduct}
        productName={productToDelete?.name}
      />
    </div>
  );
}
