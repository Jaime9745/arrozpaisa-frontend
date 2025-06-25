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
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hover:bg-gray-100 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="h-auto lg:h-[calc(100%-140px)] lg:overflow-y-auto p-6">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre del plato *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Arroz con pollo"
                required
                className="w-full"
              />
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe los ingredientes y características del plato..."
                required
                className="w-full min-h-[80px] resize-none"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Precio *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={priceInput}
                onChange={handleInputChange}
                placeholder="0"
                required
                min="0"
                step="100"
                className="w-full"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categoría *
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="" disabled>
                      Cargando categorías...
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Imagen del plato *</Label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={imagePreview}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImageLoading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isImageLoading
                    ? "Procesando..."
                    : imagePreview
                    ? "Cambiar imagen"
                    : "Subir imagen"}
                </Button>
              </div>

              {/* Image Error */}
              {imageError && (
                <p className="text-sm text-red-600 mt-1">{imageError}</p>
              )}

              {/* Image Guidelines */}
              <p className="text-xs text-gray-500 mt-1">
                Formatos: JPG, PNG, WebP. Tamaño máximo: 5MB. Se redimensionará
                automáticamente.
              </p>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="w-full text-white font-medium"
            style={{ background: "#EB3123" }}
          >
            {isSubmitting ? submittingText : buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
