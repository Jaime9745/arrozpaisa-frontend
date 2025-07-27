import { useState, useEffect } from "react";
import { Category, categoriesService } from "@/services/categoriesService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await categoriesService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las categorías"
      );
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newCategory = await categoriesService.createCategory(category);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear la categoría";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const updatedCategory = await categoriesService.updateCategory(
        id,
        category
      );
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updatedCategory : c))
      );
      return updatedCategory;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar la categoría";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoriesService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar la categoría";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
