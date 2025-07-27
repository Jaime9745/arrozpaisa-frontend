import { apiClient } from "../api";

interface LoginRequest {
  userName: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    role: string;
  };
}

class LoginService {
  private api = apiClient.getInstance();

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const loginService = new LoginService();
