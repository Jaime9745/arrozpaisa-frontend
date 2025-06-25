"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/services/productsService";

interface ProductCardProps {
  product: Product;
  categoryName: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  formatPrice: (price: number) => string;
}

export default function ProductCard({
  product,
  categoryName,
  onEdit,
  onDelete,
  formatPrice,
}: ProductCardProps) {
  return (
    <Card
      key={product.id}
      className="transition-colors duration-200 relative min-h-[120px]"
      style={{
        borderRadius: "30px",
        backgroundColor: "#F1EFEF",
      }}
    >
      <div className="flex">
        {/* Image Section */}
        <div className="w-28 h-28 flex-shrink-0 pl-3 pr-1 py-2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholder-dish.svg"; // Fallback image
            }}
          />
        </div>
        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between pr-16 pl-2">
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                {categoryName}
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-600 max-h-10 overflow-hidden">
              {product.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex flex-col gap-1">
              <span
                className="text-base font-normal"
                style={{ color: "#C83636" }}
              >
                {formatPrice(product.price)}
              </span>
            </div>
          </CardContent>
        </div>
      </div>

      {/* Dropdown button positioned absolutely in the middle right */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-16 w-16 p-0">
              <Image
                src="/images/dropMenuBtn.svg"
                alt="Menu"
                width={48}
                height={48}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 p-2">
            <DropdownMenuItem
              className="cursor-pointer p-3"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-5 w-5 mr-3" style={{ color: "#DFAA30" }} />
              <span style={{ color: "#DFAA30" }}>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-red-50 p-3"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-5 w-5 mr-3" style={{ color: "#E71D36" }} />
              <span style={{ color: "#E71D36" }}>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
