"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useEffect } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  phoneNumber: string;
}

interface WaiterFormProps {
  mode: "add" | "edit";
  initialData?: FormData;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function WaiterForm({
  mode,
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: WaiterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    identificationNumber: "",
    phoneNumber: "",
  });

  // Initialize form data when component mounts or initialData changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        identificationNumber: "",
        phoneNumber: "",
      });
    }
  }, [mode, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);

    // Reset form after successful submission only in add mode
    if (mode === "add") {
      setFormData({
        firstName: "",
        lastName: "",
        identificationNumber: "",
        phoneNumber: "",
      });
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      firstName: "",
      lastName: "",
      identificationNumber: "",
      phoneNumber: "",
    });
    onClose();
  };

  // Dynamic text based on mode
  const title = mode === "add" ? "Añadir Mesero" : "Editar Mesero";
  const buttonText = mode === "add" ? "Añadir Mesero" : "Guardar Cambios";
  const submittingText = mode === "add" ? "Creando..." : "Guardando...";
  return (
    <div className="w-full">
      <Card
        className="border-0 lg:sticky lg:top-6 h-auto lg:h-[calc(100vh-160px)] sm:lg:h-[calc(100vh-140px)] md:lg:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)] transform transition-all duration-300 ease-in-out animate-in slide-in-from-top-4 lg:slide-in-from-right-4 fade-in"
        style={{ borderRadius: "30px", backgroundColor: "#fcfeff" }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <Image
                src="/images/icons/closeCardIcon.svg"
                alt="Close"
                width={40}
                height={40}
                className="transition-transform duration-200"
              />
            </Button>
          </div>
        </CardHeader>{" "}
        <CardContent className="h-auto lg:h-[calc(100%-140px)] lg:overflow-y-auto p-6">
          <form id="waiter-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-normal text-gray-700"
                >
                  Nombre *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-white border-gray-200 rounded-lg"
                  placeholder="Ej: Juan"
                  style={{
                    background: "#f7f7f8",
                    borderRadius: "20px",
                    width: "100%",
                    height: "50px",
                    color: "#000",
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-normal text-gray-700"
                >
                  Apellido *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="bg-white border-gray-200 rounded-lg"
                  placeholder="Ej: Pérez"
                  style={{
                    background: "#f7f7f8",
                    borderRadius: "20px",
                    width: "100%",
                    height: "50px",
                    color: "#000",
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="identificationNumber"
                  className="text-sm font-normal text-gray-700"
                >
                  Número de Identificación *
                </Label>
                <Input
                  id="identificationNumber"
                  name="identificationNumber"
                  type="text"
                  value={formData.identificationNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: 12345678"
                  style={{
                    background: "#f7f7f8",
                    borderRadius: "20px",
                    width: "100%",
                    height: "50px",
                    color: "#000",
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-normal text-gray-700"
                >
                  Número de Celular *
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="bg-white border-gray-200 rounded-lg"
                  placeholder="Ej: 3001234567"
                  style={{
                    background: "#f7f7f8",
                    borderRadius: "20px",
                    width: "100%",
                    height: "50px",
                    color: "#000",
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="waiter-form"
            disabled={isSubmitting}
            className="flex-1 text-white font-normal transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg disabled:hover:scale-100"
            style={{
              background: "#EB3123",
              borderRadius: "30px",
              height: "50px",
            }}
          >
            {isSubmitting ? submittingText : buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
