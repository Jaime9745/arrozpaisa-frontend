import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { categoriesService, Category } from "../categoriesService";

describe("CategoriesService - Integration Tests", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getAllCategories", () => {
    it("should fetch all categories successfully (array response)", async () => {
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
        {
          id: "3",
          name: "Postres",
          description: "Postres y dulces",
        },
      ];

      mock.onGet("/categories").reply(200, mockCategories);

      const result = await categoriesService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Platos Fuertes");
    });

    it("should fetch all categories successfully (object with categories property)", async () => {
      const mockCategories: Category[] = [
        {
          id: "1",
          name: "Entradas",
          description: "Aperitivos",
        },
      ];

      mock.onGet("/categories").reply(200, { categories: mockCategories });

      const result = await categoriesService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(1);
    });

    it("should fetch all categories successfully (object with data property)", async () => {
      const mockCategories: Category[] = [
        {
          id: "1",
          name: "Sopas",
        },
      ];

      mock.onGet("/categories").reply(200, { data: mockCategories });

      const result = await categoriesService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(1);
    });

    it("should return empty array when no categories exist", async () => {
      mock.onGet("/categories").reply(200, []);

      const result = await categoriesService.getAllCategories();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle network errors", async () => {
      mock.onGet("/categories").networkError();

      await expect(categoriesService.getAllCategories()).rejects.toThrow();
    });

    it("should handle 500 server errors", async () => {
      mock.onGet("/categories").reply(500, {
        message: "Internal server error",
      });

      await expect(categoriesService.getAllCategories()).rejects.toThrow(
        "Internal server error"
      );
    });
  });

  describe("createCategory", () => {
    it("should create a new category successfully", async () => {
      const newCategory = {
        name: "Ensaladas",
        description: "Ensaladas frescas",
      };

      const mockResponse: Category = {
        id: "123",
        ...newCategory,
      };

      mock.onPost("/categories").reply(200, mockResponse);

      const result = await categoriesService.createCategory(newCategory);

      expect(result.id).toBe("123");
      expect(result.name).toBe("Ensaladas");
      expect(result.description).toBe("Ensaladas frescas");
    });

    it("should create a category without description", async () => {
      const newCategory = {
        name: "Acompañamientos",
      };

      const mockResponse: Category = {
        id: "456",
        name: "Acompañamientos",
      };

      mock.onPost("/categories").reply(200, mockResponse);

      const result = await categoriesService.createCategory(newCategory);

      expect(result.id).toBe("456");
      expect(result.name).toBe("Acompañamientos");
      expect(result.description).toBeUndefined();
    });

    it("should handle validation errors when creating category", async () => {
      const invalidCategory = {
        name: "",
      };

      mock.onPost("/categories").reply(400, {
        message: "Validation error: Name is required",
      });

      await expect(
        categoriesService.createCategory(invalidCategory)
      ).rejects.toThrow("Validation error");
    });

    it("should handle duplicate category name error", async () => {
      const newCategory = {
        name: "Platos Fuertes",
        description: "Ya existe",
      };

      mock.onPost("/categories").reply(409, {
        message: "Category name already exists",
      });

      await expect(
        categoriesService.createCategory(newCategory)
      ).rejects.toThrow("Category name already exists");
    });

    it("should handle unauthorized errors", async () => {
      const newCategory = {
        name: "Nueva Categoría",
      };

      mock.onPost("/categories").reply(401, {
        message: "Unauthorized",
      });

      await expect(
        categoriesService.createCategory(newCategory)
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("updateCategory", () => {
    it("should update a category successfully", async () => {
      const categoryId = "123";
      const updates = {
        name: "Platos Principales",
        description: "Actualizado",
      };

      const mockResponse: Category = {
        id: categoryId,
        name: "Platos Principales",
        description: "Actualizado",
      };

      mock.onPut(`/categories/${categoryId}`).reply(200, mockResponse);

      const result = await categoriesService.updateCategory(
        categoryId,
        updates
      );

      expect(result.name).toBe("Platos Principales");
      expect(result.description).toBe("Actualizado");
    });

    it("should update only category name", async () => {
      const categoryId = "123";
      const updates = {
        name: "Nuevo Nombre",
      };

      const mockResponse: Category = {
        id: categoryId,
        name: "Nuevo Nombre",
        description: "Descripción original",
      };

      mock.onPut(`/categories/${categoryId}`).reply(200, mockResponse);

      const result = await categoriesService.updateCategory(
        categoryId,
        updates
      );

      expect(result.name).toBe("Nuevo Nombre");
    });

    it("should handle category not found error", async () => {
      const categoryId = "non-existent-id";
      const updates = { name: "Test" };

      mock.onPut(`/categories/${categoryId}`).reply(404, {
        message: "Category not found",
      });

      await expect(
        categoriesService.updateCategory(categoryId, updates)
      ).rejects.toThrow("Category not found");
    });

    it("should handle duplicate name error on update", async () => {
      const categoryId = "123";
      const updates = { name: "Nombre Existente" };

      mock.onPut(`/categories/${categoryId}`).reply(409, {
        message: "Category name already exists",
      });

      await expect(
        categoriesService.updateCategory(categoryId, updates)
      ).rejects.toThrow("Category name already exists");
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category successfully", async () => {
      const categoryId = "123";

      mock.onDelete(`/categories/${categoryId}`).reply(204);

      await expect(
        categoriesService.deleteCategory(categoryId)
      ).resolves.not.toThrow();
    });

    it("should handle category not found error when deleting", async () => {
      const categoryId = "non-existent-id";

      mock.onDelete(`/categories/${categoryId}`).reply(404, {
        message: "Category not found",
      });

      await expect(
        categoriesService.deleteCategory(categoryId)
      ).rejects.toThrow("Category not found");
    });

    it("should handle foreign key constraint errors", async () => {
      const categoryId = "123";

      mock.onDelete(`/categories/${categoryId}`).reply(409, {
        message: "Cannot delete category with existing products",
      });

      await expect(
        categoriesService.deleteCategory(categoryId)
      ).rejects.toThrow("Cannot delete category with existing products");
    });

    it("should handle unauthorized delete attempts", async () => {
      const categoryId = "123";

      mock.onDelete(`/categories/${categoryId}`).reply(401, {
        message: "Unauthorized",
      });

      await expect(
        categoriesService.deleteCategory(categoryId)
      ).rejects.toThrow("Unauthorized");
    });
  });
});
