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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
          <form>
            <div className="grid gap-8">
              <div className="grid gap-6 mx-auto w-full max-w-[420px]">
                <div className="grid gap-1">
                  <Label
                    htmlFor="email"
                    className="text-lg mb-0"
                    style={{ color: "#7c838a" }}
                  >
                    Usuario
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="text-lg px-4"
                    style={{
                      background: "#B0BAC366",
                      borderRadius: "20px",
                      width: "100%",
                      height: "45px",
                      maxWidth: "419px",
                      color: "#000",
                    }}
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
                    className="text-lg px-4"
                    style={{
                      background: "#B0BAC366",
                      borderRadius: "20px",
                      width: "100%",
                      height: "45px",
                      maxWidth: "419px",
                      color: "#000",
                    }}
                    required
                  />
                </div>
                <div></div>
                <Button
                  type="submit"
                  className="h-12 text-xl font-semibold mt-6 mx-auto"
                  style={{
                    backgroundColor: "#F3FF18",
                    color: "#000",
                    width: "300px",
                  }}
                >
                  Ingresar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
