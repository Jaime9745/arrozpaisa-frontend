"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  phoneNumber: string;
}

interface AddWaiterFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function AddWaiterForm({
  onSubmit,
  onClose,
  isSubmitting,
}: AddWaiterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    identificationNumber: "",
    phoneNumber: "",
  });

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
    // Reset form after successful submission
    setFormData({
      firstName: "",
      lastName: "",
      identificationNumber: "",
      phoneNumber: "",
    });
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
  return (
    <div className="w-1/3">
      <Card
        className="border-0 sticky top-6 h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]"
        style={{ borderRadius: "30px", backgroundColor: "#fcfeff" }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Añadir Mesero
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
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
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
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
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
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="identificationNumber"
                  className="text-sm font-medium text-gray-700"
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
                  className="bg-white border-gray-200 rounded-lg"
                  placeholder="Ej: 12345678"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700"
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
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 text-white font-normal transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg disabled:hover:scale-100"
                style={{ background: "#EB3123", borderRadius: "30px" }}
              >
                {isSubmitting ? "Creando..." : "Añadir Mesero"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
