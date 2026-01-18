"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        // Double-check role from localStorage
        const role = localStorage.getItem("role");
        if (role !== "admin") {
          router.push("/login");
        }
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Double-check role (with SSR safety)
  if (typeof window === "undefined") {
    return null;
  }
  const role = window.localStorage.getItem("role");
  if (role !== "admin") {
    return null;
  }

  return <>{children}</>;
};
