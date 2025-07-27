"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        await login(userName, password);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [login, userName, password]
  );
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)} {...props}>
      {" "}
      <Card
        className="min-h-[500px] sm:min-h-[600px] w-full shadow-lg border-0"
        style={{ borderRadius: "20px" }}
      >
        <CardHeader className="text-center px-4 sm:px-6 py-6 sm:py-8">
          {" "}
          <div className="flex justify-center mb-4 lg:hidden">
            <Image
              src="/images/loginLogo.svg"
              alt="Arroz Paisa Logo"
              width={100}
              height={100}
              className="w-20 h-20 sm:w-24 sm:h-24"
              priority
              loading="eager"
            />
          </div>
          <CardDescription
            className="text-base sm:text-lg mb-8 sm:mb-12 px-2"
            style={{ color: "#7c838a" }}
          >
            ¡Nos alegra tenerte de vuelta!
          </CardDescription>
          <CardTitle className="text-2xl sm:text-3xl mb-0">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>{" "}
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:gap-8">
              <div className="grid gap-4 sm:gap-6 mx-auto w-full max-w-[380px] sm:max-w-[420px]">
                {error && (
                  <div className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="grid gap-1">
                  <Label
                    htmlFor="userName"
                    className="text-base sm:text-lg mb-0"
                    style={{ color: "#7c838a" }}
                  >
                    Usuario
                  </Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    className="text-base sm:text-lg px-3 sm:px-4"
                    style={{
                      background: "#B0BAC366",
                      borderRadius: "15px",
                      width: "100%",
                      height: "40px",
                      maxWidth: "419px",
                      color: "#000",
                    }}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className="text-base sm:text-lg mb-0"
                      style={{ color: "#7c838a" }}
                    >
                      Contraseña
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    className="text-base sm:text-lg px-3 sm:px-4"
                    style={{
                      background: "#B0BAC366",
                      borderRadius: "15px",
                      width: "100%",
                      height: "40px",
                      maxWidth: "419px",
                      color: "#000",
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div></div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 sm:h-12 text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mx-auto w-full sm:w-[280px] md:w-[300px]"
                  style={{
                    backgroundColor: "#F3FF18",
                    color: "#000",
                  }}
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
