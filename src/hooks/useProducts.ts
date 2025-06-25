"use client";

import { useState, useEffect } from "react";
import { productsService, Product } from "@/services/productsService";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await productsService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setError(null);
      const newProduct = await productsService.createProduct(product);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Error al crear el producto");
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      setError(null);
      const updatedProduct = await productsService.updateProduct(id, product);

      // If the image was updated but backend returned old URL, use the new image
      const finalProduct = {
        ...updatedProduct,
        imageUrl:
          product.imageUrl && product.imageUrl.startsWith("data:image/")
            ? product.imageUrl
            : updatedProduct.imageUrl,
      };

      setProducts((prev) => prev.map((p) => (p.id === id ? finalProduct : p)));
      return finalProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Error al actualizar el producto");
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await productsService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Error al eliminar el producto");
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setError,
  };
};
