import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { tablesService, Table } from "../tablesService";

describe("TablesService - Integration Tests", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getAllTables", () => {
    it("should fetch all tables successfully", async () => {
      const mockTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
          location: "Interior",
        },
        {
          id: "2",
          number: 2,
          status: "atendida",
          capacity: 2,
          location: "Terraza",
        },
      ];

      mock.onGet("/tables").reply(200, { data: mockTables });

      const result = await tablesService.getAllTables();

      expect(result).toEqual(mockTables);
      expect(result).toHaveLength(2);
      expect(result[0].number).toBe(1);
    });

    it("should return empty array when no tables exist", async () => {
      mock.onGet("/tables").reply(200, { data: [] });

      const result = await tablesService.getAllTables();

      expect(result).toEqual([]);
    });

    it("should handle network errors", async () => {
      mock.onGet("/tables").networkError();

      await expect(tablesService.getAllTables()).rejects.toThrow();
    });
  });

  describe("getTableById", () => {
    it("should fetch a table by ID successfully", async () => {
      const mockTable: Table = {
        id: "123",
        number: 5,
        status: "libre",
        capacity: 6,
        location: "VIP",
      };

      mock.onGet("/tables/123").reply(200, { data: mockTable });

      const result = await tablesService.getTableById("123");

      expect(result).toEqual(mockTable);
      expect(result.id).toBe("123");
      expect(result.number).toBe(5);
    });

    it("should handle table not found error", async () => {
      mock.onGet("/tables/999").reply(404, {
        message: "Table not found",
      });

      await expect(tablesService.getTableById("999")).rejects.toThrow(
        "Table not found"
      );
    });
  });

  describe("getTableByNumber", () => {
    it("should fetch a table by number successfully", async () => {
      const mockTable: Table = {
        id: "123",
        number: 10,
        status: "libre",
        capacity: 4,
      };

      mock.onGet("/tables/number/10").reply(200, { data: mockTable });

      const result = await tablesService.getTableByNumber(10);

      expect(result).toEqual(mockTable);
      expect(result.number).toBe(10);
    });

    it("should handle table number not found error", async () => {
      mock.onGet("/tables/number/999").reply(404, {
        message: "Table with number 999 not found",
      });

      await expect(tablesService.getTableByNumber(999)).rejects.toThrow(
        "Table with number 999 not found"
      );
    });
  });

  describe("getTablesByStatus", () => {
    it("should fetch free tables successfully", async () => {
      const mockTables: Table[] = [
        { id: "1", number: 1, status: "libre", capacity: 4 },
        { id: "2", number: 2, status: "libre", capacity: 2 },
      ];

      mock.onGet("/tables/status/libre").reply(200, { data: mockTables });

      const result = await tablesService.getTablesByStatus("libre");

      expect(result).toEqual(mockTables);
      expect(result).toHaveLength(2);
      expect(result.every((t) => t.status === "libre")).toBe(true);
    });

    it("should fetch occupied tables successfully", async () => {
      const mockTables: Table[] = [
        { id: "3", number: 3, status: "atendida", capacity: 4 },
      ];

      mock.onGet("/tables/status/atendida").reply(200, { data: mockTables });

      const result = await tablesService.getTablesByStatus("atendida");

      expect(result).toEqual(mockTables);
      expect(result[0].status).toBe("atendida");
    });
  });

  describe("getAvailableTables", () => {
    it("should fetch available tables successfully", async () => {
      const mockTables: Table[] = [
        { id: "1", number: 1, status: "libre", capacity: 4 },
        { id: "2", number: 2, status: "libre", capacity: 2 },
      ];

      mock.onGet("/tables/available/tables").reply(200, { data: mockTables });

      const result = await tablesService.getAvailableTables();

      expect(result).toEqual(mockTables);
    });
  });

  describe("getOccupiedTables", () => {
    it("should fetch occupied tables successfully", async () => {
      const mockTables: Table[] = [
        { id: "3", number: 3, status: "atendida", capacity: 4 },
      ];

      mock.onGet("/tables/occupied/tables").reply(200, { data: mockTables });

      const result = await tablesService.getOccupiedTables();

      expect(result).toEqual(mockTables);
    });
  });

  describe("createTable", () => {
    it("should create a new table successfully", async () => {
      const newTable = {
        number: 15,
        capacity: 4,
        location: "Interior",
      };

      const mockResponse: Table = {
        id: "123",
        ...newTable,
        status: "libre",
        createdAt: "2025-10-12T00:00:00Z",
      };

      mock.onPost("/tables").reply(200, { data: mockResponse });

      const result = await tablesService.createTable(newTable);

      expect(result).toEqual(mockResponse);
      expect(result.number).toBe(15);
      expect(result.status).toBe("libre");
    });

    it("should create a table with minimal data", async () => {
      const newTable = {
        number: 20,
      };

      const mockResponse: Table = {
        id: "456",
        number: 20,
        status: "libre",
      };

      mock.onPost("/tables").reply(200, { data: mockResponse });

      const result = await tablesService.createTable(newTable);

      expect(result.number).toBe(20);
    });

    it("should handle duplicate table number error", async () => {
      const newTable = {
        number: 1,
        capacity: 4,
      };

      mock.onPost("/tables").reply(409, {
        message: "Table number already exists",
      });

      await expect(tablesService.createTable(newTable)).rejects.toThrow(
        "Table number already exists"
      );
    });

    it("should handle validation errors", async () => {
      const newTable = {
        number: -1,
      };

      mock.onPost("/tables").reply(400, {
        message: "Validation error: Table number must be positive",
      });

      await expect(tablesService.createTable(newTable)).rejects.toThrow(
        "Validation error"
      );
    });
  });

  describe("updateTable", () => {
    it("should update a table successfully", async () => {
      const tableId = "123";
      const updates = {
        capacity: 6,
        location: "Terraza VIP",
      };

      const mockResponse: Table = {
        id: tableId,
        number: 5,
        status: "libre",
        capacity: 6,
        location: "Terraza VIP",
        updatedAt: "2025-10-12T12:00:00Z",
      };

      mock.onPut(`/tables/${tableId}`).reply(200, { data: mockResponse });

      const result = await tablesService.updateTable(tableId, updates);

      expect(result).toEqual(mockResponse);
      expect(result.capacity).toBe(6);
      expect(result.location).toBe("Terraza VIP");
    });

    it("should update table number", async () => {
      const tableId = "123";
      const updates = {
        number: 25,
      };

      const mockResponse: Table = {
        id: tableId,
        number: 25,
        status: "libre",
        capacity: 4,
      };

      mock.onPut(`/tables/${tableId}`).reply(200, { data: mockResponse });

      const result = await tablesService.updateTable(tableId, updates);

      expect(result.number).toBe(25);
    });

    it("should handle table not found error", async () => {
      mock.onPut("/tables/999").reply(404, {
        message: "Table not found",
      });

      await expect(
        tablesService.updateTable("999", { capacity: 4 })
      ).rejects.toThrow("Table not found");
    });
  });

  describe("updateTableStatus", () => {
    it("should update table status to libre", async () => {
      const tableId = "123";

      const mockResponse: Table = {
        id: tableId,
        number: 5,
        status: "libre",
        capacity: 4,
      };

      mock
        .onPut(`/tables/${tableId}/status`)
        .reply(200, { data: mockResponse });

      const result = await tablesService.updateTableStatus(tableId, "libre");

      expect(result.status).toBe("libre");
    });

    it("should update table status to atendida", async () => {
      const tableId = "123";

      const mockResponse: Table = {
        id: tableId,
        number: 5,
        status: "atendida",
        capacity: 4,
      };

      mock
        .onPut(`/tables/${tableId}/status`)
        .reply(200, { data: mockResponse });

      const result = await tablesService.updateTableStatus(tableId, "atendida");

      expect(result.status).toBe("atendida");
    });
  });

  describe("deleteTable", () => {
    it("should delete a table successfully", async () => {
      const tableId = "123";

      mock.onDelete(`/tables/${tableId}`).reply(204);

      await expect(tablesService.deleteTable(tableId)).resolves.not.toThrow();
    });

    it("should handle table not found error when deleting", async () => {
      mock.onDelete("/tables/999").reply(404, {
        message: "Table not found",
      });

      await expect(tablesService.deleteTable("999")).rejects.toThrow(
        "Table not found"
      );
    });
  });

  describe("helper methods", () => {
    it("should get free tables using getFreeTables", async () => {
      const mockTables: Table[] = [
        { id: "1", number: 1, status: "libre", capacity: 4 },
      ];

      mock.onGet("/tables/available/tables").reply(200, { data: mockTables });

      const result = await tablesService.getFreeTables();

      expect(result).toEqual(mockTables);
    });

    it("should get served tables using getServedTables", async () => {
      const mockTables: Table[] = [
        { id: "2", number: 2, status: "atendida", capacity: 4 },
      ];

      mock.onGet("/tables/occupied/tables").reply(200, { data: mockTables });

      const result = await tablesService.getServedTables();

      expect(result).toEqual(mockTables);
    });

    it("should mark table as free", async () => {
      const tableId = "123";
      const mockResponse: Table = {
        id: tableId,
        number: 5,
        status: "libre",
        capacity: 4,
      };

      mock
        .onPut(`/tables/${tableId}/status`)
        .reply(200, { data: mockResponse });

      const result = await tablesService.markTableAsFree(tableId);

      expect(result.status).toBe("libre");
    });

    it("should mark table as served", async () => {
      const tableId = "123";
      const mockResponse: Table = {
        id: tableId,
        number: 5,
        status: "atendida",
        capacity: 4,
      };

      mock
        .onPut(`/tables/${tableId}/status`)
        .reply(200, { data: mockResponse });

      const result = await tablesService.markTableAsServed(tableId);

      expect(result.status).toBe("atendida");
    });
  });
});
