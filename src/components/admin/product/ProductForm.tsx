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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";
import {
  convertImageToBase64,
  validateImageFile,
  resizeAndConvertToBase64,
} from "@/utils/imageUtils";
import { useCategories } from "@/hooks/useCategories";

interface FormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: FormData;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function ProductForm({
  mode,
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    imageUrl: "",
  });

  const [priceInput, setPriceInput] = useState<string>("");

  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { categories, loading: categoriesLoading } = useCategories();

  // Initialize form data when component mounts or initialData changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
      setImagePreview(initialData.imageUrl);
      setPriceInput(initialData.price.toString());
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        imageUrl: "",
      });
      setImagePreview("");
      setPriceInput("");
    }
  }, [mode, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      // Handle price input separately
      setPriceInput(value);
      // Update formData with numeric value, default to 0 if empty
      setFormData((prev) => ({
        ...prev,
        price: value === "" ? 0 : parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");
    setIsImageLoading(true);

    try {
      // Validate file
      const validation = validateImageFile(file, 5); // 5MB max
      if (!validation.isValid) {
        setImageError(validation.error || "Error de validación");
        setIsImageLoading(false);
        return;
      }

      // Resize and convert to base64
      const base64String = await resizeAndConvertToBase64(file, 800, 600, 0.8);

      setFormData((prev) => ({
        ...prev,
        imageUrl: base64String,
      }));
      setImagePreview(base64String);
    } catch (error) {
      setImageError("Error al procesar la imagen");
      console.error("Error processing image:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      setImageError("La imagen es requerida");
      return;
    }

    await onSubmit(formData);

    // Reset form after successful submission only in add mode
    if (mode === "add") {
      setFormData({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        imageUrl: "",
      });
      setImagePreview("");
      setPriceInput("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      imageUrl: "",
    });
    setImagePreview("");
    setImageError("");
    setPriceInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  // Dynamic text based on mode
  const title = mode === "add" ? "Agregar Plato" : "Editar Plato";
  const buttonText = mode === "add" ? "Agregar Plato" : "Guardar Cambios";
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
        </CardHeader>

        <CardContent className="h-auto lg:h-[calc(100%-140px)] lg:overflow-y-auto p-6">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="text-sm font-normal text-gray-700">
                Imagen del Plato *
              </Label>

              {imagePreview ? (
                <div className="relative">
                  <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    {isImageLoading
                      ? "Procesando imagen..."
                      : "Haz clic para seleccionar una imagen"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG o WebP (máx. 5MB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isImageLoading}
              />

              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-normal text-gray-700"
              >
                Nombre del Plato *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ej: Arroz con Pollo"
                style={{
                  background: "#f7f7f8",
                  borderRadius: "20px",
                  width: "100%",
                  height: "50px",
                  color: "#000",
                }}
              />
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <Label className="text-sm font-normal text-gray-700">
                Categoría *
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={handleSelectChange}
                disabled={categoriesLoading}
              >
                <SelectTrigger
                  style={{
                    background: "#f7f7f8",
                    borderRadius: "20px",
                    width: "100%",
                    height: "50px",
                    color: "#000",
                  }}
                >
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoriesLoading && (
                <p className="text-sm text-gray-500">Cargando categorías...</p>
              )}
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-normal text-gray-700"
              >
                Precio (COP) *
              </Label>
              <Input
                id="price"
                name="price"
                type="text"
                value={priceInput}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  // Only allow numbers
                  if (
                    !/[0-9]/.test(e.key) &&
                    ![
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Escape",
                      "Enter",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                required
                placeholder="Ej: 15000"
                style={{
                  background: "#f7f7f8",
                  borderRadius: "20px",
                  width: "100%",
                  height: "50px",
                  color: "#000",
                }}
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-normal text-gray-700"
              >
                Descripción *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe el plato..."
                className="min-h-[100px] resize-none"
                style={{
                  background: "#f7f7f8",
                  borderRadius: "20px",
                  color: "#000",
                }}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting || isImageLoading}
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
