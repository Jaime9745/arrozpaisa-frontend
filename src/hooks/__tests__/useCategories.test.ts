import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { useCategories } from "../useCategories";
import { Category } from "@/services/categoriesService";

describe("useCategories Hook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("fetchCategories", () => {
    it("should fetch categories successfully on mount", async () => {
      const mockCategories: Category[] = [
        {
          id: "1",
          name: "Platos Fuertes",
          description: "Comidas principales",
        },
        {
          id: "2",
          name: "Bebidas",
          description: "Bebidas frías y calientes",
        },
      ];

      mock.onGet("/categories").reply(200, mockCategories);

      const { result } = renderHook(() => useCategories());

      expect(result.current.loading).toBe(true);
      expect(result.current.categories).toEqual([]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.categories).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });

    it("should handle fetch error", async () => {
      mock.onGet("/categories").reply(500, { message: "Server error" });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.categories).toEqual([]);
    });

    it("should refetch categories when calling fetchCategories", async () => {
      const initialCategories: Category[] = [
        {
          id: "1",
          name: "Platos Fuertes",
        },
      ];

      const updatedCategories: Category[] = [
        ...initialCategories,
        {
          id: "2",
          name: "Bebidas",
        },
      ];

      mock.onGet("/categories").replyOnce(200, initialCategories);

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.categories).toHaveLength(1);
      });

      mock.onGet("/categories").replyOnce(200, updatedCategories);

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.categories).toHaveLength(2);
    });
  });

  describe("createCategory", () => {
    it("should create a new category successfully", async () => {
      mock.onGet("/categories").reply(200, []);

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newCategory = {
        name: "Ensaladas",
        description: "Ensaladas frescas",
      };

      const createdCategory: Category = {
        id: "123",
        ...newCategory,
      };

      mock.onPost("/categories").reply(200, createdCategory);

      let createdResult: Category | undefined;

      await act(async () => {
        createdResult = await result.current.createCategory(newCategory);
      });

      expect(createdResult).toEqual(createdCategory);
      expect(result.current.categories).toHaveLength(1);
      expect(result.current.categories[0].name).toBe("Ensaladas");
    });

    it("should handle create category error", async () => {
      mock.onGet("/categories").reply(200, []);

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newCategory = {
        name: "",
      };

      mock.onPost("/categories").reply(400, { message: "Validation error" });

      await act(async () => {
        try {
          await result.current.createCategory(newCategory);
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.categories).toHaveLength(0);
    });
  });

  describe("updateCategory", () => {
    it("should update a category successfully", async () => {
      const initialCategories: Category[] = [
        {
          id: "1",
          name: "Original Name",
          description: "Original Description",
        },
      ];

      mock.onGet("/categories").reply(200, initialCategories);

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.categories).toHaveLength(1);
      });

      const updates = {
        name: "Updated Name",
        description: "Updated Description",
      };

      const updatedCategory: Category = {
        id: "1",
        name: "Updated Name",
        description: "Updated Description",
      };

      mock.onPut("/categories/1").reply(200, updatedCategory);

      await act(async () => {
        await result.current.updateCategory("1", updates);
      });

      expect(result.current.categories[0].name).toBe("Updated Name");
      expect(result.current.categories[0].description).toBe(
        "Updated Description"
      );
    });

    it("should handle update category error", async () => {
      const initialCategories: Category[] = [
        {
          id: "1",
          name: "Category",
        },
      ];

      mock.onGet("/categories").reply(200, initialCategories);

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.categories).toHaveLength(1);
      });

      mock.onPut("/categories/1").reply(404, { message: "Category not found" });

      await act(async () => {
        try {
          await result.current.updateCategory("1", { name: "New Name" });
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).not.toBeNull();
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category successfully", async () => {
      const initialCategories: Category[] = [
        {
          id: "1",
          name: "Category 1",
        },
        {
          id: "2",
          name: "Category 2",
        },
      ];

      mock.onGet("/categories").reply(200, initialCategories);

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.categories).toHaveLength(2);
      });

      mock.onDelete("/categories/1").reply(204);

      await act(async () => {
        await result.current.deleteCategory("1");
      });

      expect(result.current.categories).toHaveLength(1);
      expect(result.current.categories[0].id).toBe("2");
    });

    it("should handle delete category error", async () => {
      const initialCategories: Category[] = [
        {
          id: "1",
          name: "Category",
        },
      ];

      mock.onGet("/categories").reply(200, initialCategories);

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.categories).toHaveLength(1);
      });

      mock
        .onDelete("/categories/1")
        .reply(409, {
          message: "Cannot delete category with existing products",
        });

      await act(async () => {
        try {
          await result.current.deleteCategory("1");
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.categories).toHaveLength(1);
    });
  });
});
