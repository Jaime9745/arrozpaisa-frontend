"use client";

import useSWR from "swr";
import { useSWRConfig } from "swr";
import { useCallback } from "react";
import { fetcher, immutableConfig } from "@/lib/swr";
import { categoriesService, Category } from "@/services/categoriesService";

const CATEGORIES_KEY = "/categories";

interface CategoriesResponse {
  categories?: Category[];
  data?: Category[];
}

/**
 * SWR-based hook for categories with automatic deduplication and caching
 * Uses immutable config since categories rarely change
 */
export const useCategories = () => {
  const { mutate } = useSWRConfig();

  // Custom fetcher that handles the response format
  const categoriesFetcher = async (): Promise<Category[]> => {
    const data = await fetcher<CategoriesResponse | Category[]>(CATEGORIES_KEY);
    if (Array.isArray(data)) {
      return data;
    } else if ("categories" in data && data.categories) {
      return data.categories;
    } else if ("data" in data && data.data) {
      return data.data;
    }
    return [];
  };

  const { data, error, isLoading, isValidating } = useSWR<Category[]>(
    CATEGORIES_KEY,
    categoriesFetcher,
    immutableConfig,
  );

  // Mutation functions with optimistic updates
  const createCategory = useCallback(
    async (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
      const newCategory = await categoriesService.createCategory(category);
      // Optimistically update the cache
      mutate(
        CATEGORIES_KEY,
        (current: Category[] | undefined) =>
          current ? [...current, newCategory] : [newCategory],
        { revalidate: false },
      );
      return newCategory;
    },
    [mutate],
  );

  const updateCategory = useCallback(
    async (id: string, category: Partial<Category>) => {
      const updatedCategory = await categoriesService.updateCategory(
        id,
        category,
      );
      // Optimistically update the cache
      mutate(
        CATEGORIES_KEY,
        (current: Category[] | undefined) =>
          current?.map((c) => (c.id === id ? updatedCategory : c)) ?? [],
        { revalidate: false },
      );
      return updatedCategory;
    },
    [mutate],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      await categoriesService.deleteCategory(id);
      // Optimistically update the cache
      mutate(
        CATEGORIES_KEY,
        (current: Category[] | undefined) =>
          current?.filter((c) => c.id !== id) ?? [],
        { revalidate: false },
      );
    },
    [mutate],
  );

  const refetch = useCallback(() => {
    mutate(CATEGORIES_KEY);
  }, [mutate]);

  return {
    categories: data ?? [],
    loading: isLoading,
    isValidating,
    error: error?.message ?? null,
    fetchCategories: refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
