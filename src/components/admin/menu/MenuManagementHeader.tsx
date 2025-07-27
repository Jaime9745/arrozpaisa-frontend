"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Menu } from "lucide-react";

interface MenuManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
  onToggleSidebar: () => void;
}

export default function MenuManagementHeader({
  searchTerm,
  onSearchChange,
  onAddProduct,
  onToggleSidebar,
}: MenuManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden h-auto py-3 w-12 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <Menu className="h-6 w-6 text-gray-800" />
        </Button>
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            className="w-full bg-white border-gray-200 pl-4 pr-12 py-4 shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <Button
        className="px-8 py-3 w-full sm:min-w-[180px] sm:w-auto text-white flex items-center gap-2 justify-center font-normal transition-all duration-200 hover:shadow-lg hover:brightness-110"
        style={{ background: "#EB3123" }}
        onClick={onAddProduct}
      >
        <Plus className="h-5 w-5" />
        Agregar Plato
      </Button>
    </div>
  );
}
