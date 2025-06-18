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
    // Check if user is already authenticated on app load
    const token = loginService.getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      const response = await loginService.login({ userName, password });
      localStorage.setItem("token", response.token);
      setIsAuthenticated(true);
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    loginService.logout();
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
