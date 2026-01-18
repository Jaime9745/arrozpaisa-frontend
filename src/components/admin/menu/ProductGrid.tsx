"use client";

import { Product } from "@/services/productsService";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  categories: { id: string; name: string }[];
  searchTerm: string;
  loading: boolean;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductGrid({
  products,
  categories,
  searchTerm,
  loading,
  onEditProduct,
  onDeleteProduct,
}: ProductGridProps) {
  // Filter products based on search term (only show active products)
  const filteredProducts = products.filter(
    (product) =>
      product.isActive &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Build category index map for O(1) lookups (Rule 7.2)
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  // Get category name by ID - O(1) lookup
  const getCategoryName = (categoryId: string) => {
    return categoryMap.get(categoryId) ?? "Sin categoría";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-500">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pr-2">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryName={getCategoryName(product.categoryId)}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
            formatPrice={formatPrice}
          />
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
  );
}
