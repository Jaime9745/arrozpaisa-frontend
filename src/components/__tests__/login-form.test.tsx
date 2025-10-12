import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../login-form";

// Mock the useAuth hook
const mockLogin = jest.fn();
const mockLogout = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: mockLogin,
    logout: mockLogout,
    loading: false,
  }),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("LoginForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginForm = () => {
    return render(<LoginForm />);
  };

  describe("Rendering", () => {
    it("should render login form correctly", () => {
      renderLoginForm();

      expect(
        screen.getByText("¡Nos alegra tenerte de vuelta!")
      ).toBeInTheDocument();
      expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
      expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Ingresar/i })
      ).toBeInTheDocument();
    });

    it("should render input fields with correct placeholders", () => {
      renderLoginForm();

      const userNameInput = screen.getByPlaceholderText(/Ingresa tu usuario/i);
      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );

      expect(userNameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("should render logo image", () => {
      renderLoginForm();

      const logo = screen.getByAltText("Arroz Paisa Logo");
      expect(logo).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("should update username input value", () => {
      renderLoginForm();

      const userNameInput = screen.getByPlaceholderText(
        /Ingresa tu usuario/i
      ) as HTMLInputElement;

      fireEvent.change(userNameInput, { target: { value: "testuser" } });

      expect(userNameInput.value).toBe("testuser");
    });

    it("should update password input value", () => {
      renderLoginForm();

      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      ) as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(passwordInput.value).toBe("password123");
    });

    it("should handle form submission with valid credentials", async () => {
      mockLogin.mockResolvedValue(undefined);
      renderLoginForm();

      const userNameInput = screen.getByPlaceholderText(/Ingresa tu usuario/i);
      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );
      const submitButton = screen.getByRole("button", { name: /Ingresar/i });

      fireEvent.change(userNameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("admin", "password123");
      });
    });

    it("should prevent default form submission", async () => {
      mockLogin.mockResolvedValue(undefined);
      renderLoginForm();

      const form = screen
        .getByRole("button", { name: /Ingresar/i })
        .closest("form");
      const mockPreventDefault = jest.fn();

      if (form) {
        fireEvent.submit(form, { preventDefault: mockPreventDefault });
      }

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  describe("Error Handling", () => {
    it("should display error message when login fails", async () => {
      const errorMessage = "Credenciales inválidas";
      mockLogin.mockRejectedValue(new Error(errorMessage));

      renderLoginForm();

      const userNameInput = screen.getByPlaceholderText(/Ingresa tu usuario/i);
      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );
      const submitButton = screen.getByRole("button", { name: /Ingresar/i });

      fireEvent.change(userNameInput, { target: { value: "wronguser" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("should clear error message on new submission", async () => {
      const errorMessage = "Credenciales inválidas";
      mockLogin.mockRejectedValueOnce(new Error(errorMessage));

      renderLoginForm();

      const userNameInput = screen.getByPlaceholderText(/Ingresa tu usuario/i);
      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );
      const submitButton = screen.getByRole("button", { name: /Ingresar/i });

      // First failed attempt
      fireEvent.change(userNameInput, { target: { value: "wronguser" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      // Second successful attempt
      mockLogin.mockResolvedValue(undefined);
      fireEvent.change(userNameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "correctpass" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("should disable submit button while loading", async () => {
      let resolveLogin: any;
      mockLogin.mockReturnValue(
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
      );

      renderLoginForm();

      const userNameInput = screen.getByPlaceholderText(/Ingresa tu usuario/i);
      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );
      const submitButton = screen.getByRole("button", {
        name: /Ingresar/i,
      }) as HTMLButtonElement;

      fireEvent.change(userNameInput, { target: { value: "admin" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton.disabled).toBe(true);
      });

      resolveLogin();

      await waitFor(() => {
        expect(submitButton.disabled).toBe(false);
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for inputs", () => {
      renderLoginForm();

      const userNameLabel = screen.getByLabelText(/Usuario/i);
      const passwordLabel = screen.getByLabelText(/Contraseña/i);

      expect(userNameLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
    });

    it("should have submit button with proper role", () => {
      renderLoginForm();

      const submitButton = screen.getByRole("button", { name: /Ingresar/i });
      expect(submitButton).toBeInTheDocument();
    });
  });
});
