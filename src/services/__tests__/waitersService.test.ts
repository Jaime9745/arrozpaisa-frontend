import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { waitersService, Waiter } from "../waitersService";

describe("WaitersService - Integration Tests", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getAllWaiters", () => {
    it("should fetch all waiters successfully", async () => {
      const mockWaiters: Waiter[] = [
        {
          id: "1",
          firstName: "Juan",
          lastName: "Pérez",
          identificationNumber: "123456789",
          phoneNumber: "3001234567",
          userName: "juanperez",
          isActive: true,
        },
        {
          id: "2",
          firstName: "María",
          lastName: "González",
          identificationNumber: "987654321",
          phoneNumber: "3009876543",
          userName: "mariagonzalez",
          isActive: true,
        },
      ];

      mock.onGet("/waiters").reply(200, { data: mockWaiters });

      const result = await waitersService.getAllWaiters();

      expect(result).toEqual(mockWaiters);
      expect(result).toHaveLength(2);
      expect(result[0].firstName).toBe("Juan");
      expect(result[1].firstName).toBe("María");
    });

    it("should return empty array when no waiters exist", async () => {
      mock.onGet("/waiters").reply(200, { data: [] });

      const result = await waitersService.getAllWaiters();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle network errors", async () => {
      mock.onGet("/waiters").networkError();

      await expect(waitersService.getAllWaiters()).rejects.toThrow();
    });

    it("should handle 500 server errors", async () => {
      mock.onGet("/waiters").reply(500, {
        message: "Internal server error",
      });

      await expect(waitersService.getAllWaiters()).rejects.toThrow(
        "Internal server error"
      );
    });
  });

  describe("createWaiter", () => {
    it("should create a new waiter successfully", async () => {
      const newWaiter = {
        firstName: "Carlos",
        lastName: "Rodríguez",
        identificationNumber: "111222333",
        phoneNumber: "3001112233",
        userName: "carlosrodriguez",
      };

      const mockResponse: Waiter = {
        id: "123",
        ...newWaiter,
        isActive: true,
        createdAt: "2025-10-12T00:00:00Z",
        updatedAt: "2025-10-12T00:00:00Z",
      };

      mock.onPost("/waiters").reply(200, { data: mockResponse });

      const result = await waitersService.createWaiter(newWaiter);

      expect(result).toEqual(mockResponse);
      expect(result.id).toBe("123");
      expect(result.firstName).toBe("Carlos");
      expect(result.lastName).toBe("Rodríguez");
    });

    it("should handle validation errors when creating waiter", async () => {
      const invalidWaiter = {
        firstName: "",
        lastName: "",
        identificationNumber: "123",
        phoneNumber: "invalid",
        userName: "test",
      };

      mock.onPost("/waiters").reply(400, {
        message: "Validation error: First name and last name are required",
      });

      await expect(waitersService.createWaiter(invalidWaiter)).rejects.toThrow(
        "Validation error"
      );
    });

    it("should handle duplicate username error", async () => {
      const newWaiter = {
        firstName: "Pedro",
        lastName: "Martínez",
        identificationNumber: "444555666",
        phoneNumber: "3004445556",
        userName: "existinguser",
      };

      mock.onPost("/waiters").reply(409, {
        message: "Username already exists",
      });

      await expect(waitersService.createWaiter(newWaiter)).rejects.toThrow(
        "Username already exists"
      );
    });

    it("should handle unauthorized errors", async () => {
      const newWaiter = {
        firstName: "Ana",
        lastName: "López",
        identificationNumber: "777888999",
        phoneNumber: "3007778889",
        userName: "analopez",
      };

      mock.onPost("/waiters").reply(401, {
        message: "Unauthorized",
      });

      await expect(waitersService.createWaiter(newWaiter)).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("updateWaiter", () => {
    it("should update a waiter successfully", async () => {
      const waiterId = "123";
      const updates = {
        firstName: "Juan Carlos",
        phoneNumber: "3009998887",
      };

      const mockResponse: Waiter = {
        id: waiterId,
        firstName: "Juan Carlos",
        lastName: "Pérez",
        identificationNumber: "123456789",
        phoneNumber: "3009998887",
        userName: "juanperez",
        isActive: true,
        updatedAt: "2025-10-12T12:00:00Z",
      };

      mock.onPut(`/waiters/${waiterId}`).reply(200, { data: mockResponse });

      const result = await waitersService.updateWaiter(waiterId, updates);

      expect(result).toEqual(mockResponse);
      expect(result.firstName).toBe("Juan Carlos");
      expect(result.phoneNumber).toBe("3009998887");
    });

    it("should handle waiter not found error", async () => {
      const waiterId = "non-existent-id";
      const updates = { firstName: "Test" };

      mock.onPut(`/waiters/${waiterId}`).reply(404, {
        message: "Waiter not found",
      });

      await expect(
        waitersService.updateWaiter(waiterId, updates)
      ).rejects.toThrow("Waiter not found");
    });

    it("should update waiter status (activate/deactivate)", async () => {
      const waiterId = "123";
      const updates = { isActive: false };

      const mockResponse: Waiter = {
        id: waiterId,
        firstName: "Juan",
        lastName: "Pérez",
        identificationNumber: "123456789",
        phoneNumber: "3001234567",
        userName: "juanperez",
        isActive: false,
        updatedAt: "2025-10-12T12:00:00Z",
      };

      mock.onPut(`/waiters/${waiterId}`).reply(200, { data: mockResponse });

      const result = await waitersService.updateWaiter(waiterId, updates);

      expect(result.isActive).toBe(false);
    });
  });

  describe("deleteWaiter", () => {
    it("should delete a waiter successfully", async () => {
      const waiterId = "123";

      mock.onDelete(`/waiters/${waiterId}`).reply(204);

      await expect(
        waitersService.deleteWaiter(waiterId)
      ).resolves.not.toThrow();
    });

    it("should handle waiter not found error when deleting", async () => {
      const waiterId = "non-existent-id";

      mock.onDelete(`/waiters/${waiterId}`).reply(404, {
        message: "Waiter not found",
      });

      await expect(waitersService.deleteWaiter(waiterId)).rejects.toThrow(
        "Waiter not found"
      );
    });

    it("should handle unauthorized delete attempts", async () => {
      const waiterId = "123";

      mock.onDelete(`/waiters/${waiterId}`).reply(401, {
        message: "Unauthorized",
      });

      await expect(waitersService.deleteWaiter(waiterId)).rejects.toThrow(
        "Unauthorized"
      );
    });

    it("should handle foreign key constraint errors", async () => {
      const waiterId = "123";

      mock.onDelete(`/waiters/${waiterId}`).reply(409, {
        message: "Cannot delete waiter with active orders",
      });

      await expect(waitersService.deleteWaiter(waiterId)).rejects.toThrow(
        "Cannot delete waiter with active orders"
      );
    });
  });
});
