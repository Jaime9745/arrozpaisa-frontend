"use client";

import useSWR from "swr";
import { useSWRConfig } from "swr";
import { useCallback } from "react";
import { fetcher, defaultConfig } from "@/lib/swr";
import { productsService, Product } from "@/services/productsService";

const PRODUCTS_KEY = "/productes";

interface ProductsResponse {
  products?: Product[];
  data?: Product[];
}

/**
 * SWR-based hook for products with automatic deduplication and caching
 * Multiple components using this hook will share the same request
 */
export const useProducts = () => {
  const { mutate } = useSWRConfig();

  // Custom fetcher that handles the response format
  const productsFetcher = async (): Promise<Product[]> => {
    const data = await fetcher<ProductsResponse | Product[]>(PRODUCTS_KEY);
    if (Array.isArray(data)) {
      return data;
    } else if ("products" in data && data.products) {
      return data.products;
    } else if ("data" in data && data.data) {
      return data.data;
    }
    return [];
  };

  const { data, error, isLoading, isValidating } = useSWR<Product[]>(
    PRODUCTS_KEY,
    productsFetcher,
    defaultConfig,
  );

  // Mutation functions with optimistic updates
  const createProduct = useCallback(
    async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      const newProduct = await productsService.createProduct(product);
      // Optimistically update the cache
      mutate(
        PRODUCTS_KEY,
        (current: Product[] | undefined) =>
          current ? [...current, newProduct] : [newProduct],
        { revalidate: false },
      );
      return newProduct;
    },
    [mutate],
  );

  const updateProduct = useCallback(
    async (id: string, product: Partial<Product>) => {
      const updatedProduct = await productsService.updateProduct(id, product);
      // Handle image URL edge case
      const finalProduct = {
        ...updatedProduct,
        imageUrl:
          product.imageUrl && product.imageUrl.startsWith("data:image/")
            ? product.imageUrl
            : updatedProduct.imageUrl,
      };
      // Optimistically update the cache
      mutate(
        PRODUCTS_KEY,
        (current: Product[] | undefined) =>
          current?.map((p) => (p.id === id ? finalProduct : p)) ?? [],
        { revalidate: false },
      );
      return finalProduct;
    },
    [mutate],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await productsService.deleteProduct(id);
      // Optimistically update the cache
      mutate(
        PRODUCTS_KEY,
        (current: Product[] | undefined) =>
          current?.filter((p) => p.id !== id) ?? [],
        { revalidate: false },
      );
    },
    [mutate],
  );

  const refetch = useCallback(() => {
    mutate(PRODUCTS_KEY);
  }, [mutate]);

  return {
    products: data ?? [],
    loading: isLoading,
    isValidating,
    error: error?.message ?? null,
    fetchProducts: refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    setError: () => {}, // Kept for backward compatibility
  };
};
