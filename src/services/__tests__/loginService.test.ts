import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { loginService } from "../loginService";

describe("LoginService - Integration Tests", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Create a new mock adapter before each test
    mock = new MockAdapter(apiClient.getInstance());
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Restore the mock adapter after each test
    mock.restore();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const credentials = {
        userName: "admin",
        password: "password123",
      };

      const mockResponse = {
        token: "mock-jwt-token-12345",
        user: {
          role: "admin",
        },
      };

      // Mock the POST request to /auth/login
      mock.onPost("/auth/login", credentials).reply(200, mockResponse);

      const result = await loginService.login(credentials);

      expect(result).toEqual(mockResponse);
      expect(result.token).toBe("mock-jwt-token-12345");
      expect(result.user.role).toBe("admin");
    });

    it("should handle login failure with invalid credentials", async () => {
      const credentials = {
        userName: "admin",
        password: "wrongpassword",
      };

      // Mock the POST request to return 401
      mock.onPost("/auth/login").reply(401, {
        message: "Invalid credentials",
      });

      await expect(loginService.login(credentials)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should handle network errors", async () => {
      const credentials = {
        userName: "admin",
        password: "password123",
      };

      // Mock network error
      mock.onPost("/auth/login").networkError();

      await expect(loginService.login(credentials)).rejects.toThrow();
    });

    it("should handle server errors", async () => {
      const credentials = {
        userName: "admin",
        password: "password123",
      };

      // Mock 500 server error
      mock.onPost("/auth/login").reply(500, {
        message: "Internal server error",
      });

      await expect(loginService.login(credentials)).rejects.toThrow(
        "Internal server error"
      );
    });
  });

  describe("logout", () => {
    it("should remove token from localStorage", () => {
      // Set a token first
      localStorage.setItem("token", "test-token");
      expect(localStorage.getItem("token")).toBe("test-token");

      // Call logout
      loginService.logout();

      // Token should be removed
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  describe("getToken", () => {
    it("should return token if it exists", () => {
      localStorage.setItem("token", "test-token-123");
      const token = loginService.getToken();
      expect(token).toBe("test-token-123");
    });

    it("should return null if token does not exist", () => {
      const token = loginService.getToken();
      expect(token).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true if token exists", () => {
      localStorage.setItem("token", "test-token-123");
      expect(loginService.isAuthenticated()).toBe(true);
    });

    it("should return false if token does not exist", () => {
      expect(loginService.isAuthenticated()).toBe(false);
    });
  });
});
