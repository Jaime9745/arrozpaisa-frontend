import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { loginService } from "@/services/loginService";
import { useRouter } from "next/navigation";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock loginService
jest.mock("@/services/loginService", () => ({
  loginService: {
    login: jest.fn(),
    logout: jest.fn(),
    getToken: jest.fn(),
  },
}));

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe("useAuth hook", () => {
    it("should throw error when used outside AuthProvider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      console.error = originalError;
    });

    it("should provide auth context when used within AuthProvider", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.isAuthenticated).toBeDefined();
      expect(result.current.login).toBeDefined();
      expect(result.current.logout).toBeDefined();
      expect(result.current.loading).toBeDefined();
    });
  });

  describe("AuthProvider initialization", () => {
    it("should start with loading true and then set to false", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should restore authentication if valid token and admin role exist", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue("valid-token");
      localStorage.setItem("role", "admin");

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should not authenticate if token exists but role is not admin", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue("valid-token");
      localStorage.setItem("role", "waiter");

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(loginService.logout).toHaveBeenCalled();
      expect(localStorage.getItem("role")).toBeNull();
    });

    it("should not authenticate if no token exists", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("login function", () => {
    it("should login successfully with admin credentials", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);
      (loginService.login as jest.Mock).mockResolvedValue({
        token: "new-token",
        user: { role: "admin" },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login("admin", "password123");
      });

      expect(loginService.login).toHaveBeenCalledWith({
        userName: "admin",
        password: "password123",
      });
      expect(localStorage.getItem("token")).toBe("new-token");
      expect(localStorage.getItem("role")).toBe("admin");
      expect(result.current.isAuthenticated).toBe(true);
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });

    it("should reject login if user is not admin", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);
      (loginService.login as jest.Mock).mockResolvedValue({
        token: "waiter-token",
        user: { role: "waiter" },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login("waiter1", "password123");
        })
      ).rejects.toThrow(
        "Acceso denegado. Solo los administradores pueden acceder."
      );

      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should handle login error when no user info returned", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);
      (loginService.login as jest.Mock).mockResolvedValue({
        token: "token",
        // No user property
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login("admin", "password123");
        })
      ).rejects.toThrow("No se pudo obtener la información del usuario.");

      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should handle login service errors", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);
      (loginService.login as jest.Mock).mockRejectedValue(
        new Error("Invalid credentials")
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login("wrong", "wrong");
        })
      ).rejects.toThrow("Invalid credentials");

      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should handle network errors during login", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);
      (loginService.login as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login("admin", "password123");
        })
      ).rejects.toThrow("Network error");
    });
  });

  describe("logout function", () => {
    it("should logout successfully and clear authentication", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue("valid-token");
      localStorage.setItem("token", "valid-token");
      localStorage.setItem("role", "admin");

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAuthenticated).toBe(true);
      });

      act(() => {
        result.current.logout();
      });

      expect(loginService.logout).toHaveBeenCalled();
      expect(localStorage.getItem("role")).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("should logout even when not authenticated", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(loginService.logout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  describe("authentication flow", () => {
    it("should handle complete login and logout flow", async () => {
      (loginService.getToken as jest.Mock).mockReturnValue(null);
      (loginService.login as jest.Mock).mockResolvedValue({
        token: "new-token",
        user: { role: "admin" },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Initial state - not authenticated
      expect(result.current.isAuthenticated).toBe(false);

      // Login
      await act(async () => {
        await result.current.login("admin", "password123");
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
