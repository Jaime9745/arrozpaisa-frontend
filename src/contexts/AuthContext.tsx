"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginService } from "@/services/loginService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if we're on the client side (SSR safety)
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // Check if user is already authenticated on app load
    const token = loginService.getToken();
    // Cache localStorage read for role
    const savedRole = window.localStorage.getItem("role");

    if (token && savedRole) {
      // Only set as authenticated if user is admin
      if (savedRole === "admin") {
        setIsAuthenticated(true);
      } else {
        // Clear invalid data
        loginService.logout();
        window.localStorage.removeItem("role");
      }
    }

    setLoading(false);
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      const response = await loginService.login({ userName, password });

      // Check if backend returned user info
      if (!response.user) {
        throw new Error("No se pudo obtener la información del usuario.");
      }

      // Check if user is admin
      if (response.user.role !== "admin") {
        throw new Error(
          "Acceso denegado. Solo los administradores pueden acceder.",
        );
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);
      setIsAuthenticated(true);
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    loginService.logout();
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
