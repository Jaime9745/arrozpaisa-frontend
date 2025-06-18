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
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="min-h-[600px] w-full" style={{ borderRadius: "30px" }}>
        <CardHeader className="text-center px-6 py-8">
          <CardDescription
            className="text-lg mb-12"
            style={{ color: "#7c838a" }}
          >
            ¡Nos alegra tenerte de vuelta!
          </CardDescription>
          <CardTitle className="text-3xl mb-0">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <div className="grid gap-6 mx-auto w-full max-w-[420px]">
                {error && (
                  <div className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="grid gap-1">
                  <Label
                    htmlFor="userName"
                    className="text-lg mb-0"
                    style={{ color: "#7c838a" }}
                  >
                    Usuario
                  </Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    className="text-lg px-4"
                    style={{
                      background: "#B0BAC366",
                      borderRadius: "20px",
                      width: "100%",
                      height: "45px",
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
                      className="text-lg mb-0"
                      style={{ color: "#7c838a" }}
                    >
                      Contraseña
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    className="text-lg px-4"
                    style={{
                      background: "#B0BAC366",
                      borderRadius: "20px",
                      width: "100%",
                      height: "45px",
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
                  className="h-12 text-xl font-semibold mt-6 mx-auto"
                  style={{
                    backgroundColor: "#F3FF18",
                    color: "#000",
                    width: "300px",
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
