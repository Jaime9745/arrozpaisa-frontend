"use client";

import { useState, useEffect } from "react";
import { waitersService, Waiter } from "@/services/waitersService";

export const useWaiters = () => {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaiters = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedWaiters = await waitersService.getAllWaiters();
      setWaiters(fetchedWaiters);
    } catch (error) {
      setError("Error al cargar los meseros");
    } finally {
      setLoading(false);
    }
  };

  const createWaiter = async (
    waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt" | "password">
  ) => {
    try {
      setError(null);
      const newWaiter = await waitersService.createWaiter(waiter);
      setWaiters((prev) => [...prev, newWaiter]);
      return newWaiter;
    } catch (error) {
      setError("Error al crear el mesero");
      throw error;
    }
  };

  const updateWaiter = async (id: string, waiter: Partial<Waiter>) => {
    try {
      setError(null);
      const updatedWaiter = await waitersService.updateWaiter(id, waiter);
      setWaiters((prev) => prev.map((w) => (w.id === id ? updatedWaiter : w)));
      return updatedWaiter;
    } catch (error) {
      setError("Error al actualizar el mesero");
      throw error;
    }
  };

  const deleteWaiter = async (id: string) => {
    try {
      setError(null);
      await waitersService.deleteWaiter(id);
      setWaiters((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      setError("Error al eliminar el mesero");
      throw error;
    }
  };

  useEffect(() => {
    fetchWaiters();
  }, []);

  return {
    waiters,
    loading,
    error,
    fetchWaiters,
    createWaiter,
    updateWaiter,
    deleteWaiter,
    setError,
  };
};
