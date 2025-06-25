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
  private baseUrl: string;
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el inicio de sesión");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en loginService:", error);
      throw error;
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
