import { useState, useEffect } from "react";
import { tablesService, Table } from "@/services/tablesService";

export interface UseTablesReturn {
  tables: Table[];
  loading: boolean;
  error: string | null;
  refreshTables: () => Promise<void>;
  updateTableStatus: (
    id: string,
    status: "libre" | "atendida"
  ) => Promise<void>;
}

export const useTables = (): UseTablesReturn => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const tablesData = await tablesService.getAllTables();
      setTables(tablesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las mesas"
      );
      console.error("Error fetching tables:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTables = async () => {
    await fetchTables();
  };

  const updateTableStatus = async (
    id: string,
    status: "libre" | "atendida"
  ) => {
    try {
      const updatedTable = await tablesService.updateTableStatus(id, status);

      // Update the table in the local state
      setTables((prevTables) =>
        prevTables.map((table) => (table.id === id ? updatedTable : table))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el estado de la mesa"
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    loading,
    error,
    refreshTables,
    updateTableStatus,
  };
};
