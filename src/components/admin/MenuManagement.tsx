"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  id: number;
  name: string;
  price: string;
  category: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Arroz Paisa",
    price: "$18.000",
    category: "Platos Principales",
  },
  { id: 2, name: "Chow Mein", price: "$15.000", category: "Platos Chinos" },
  {
    id: 3,
    name: "Bandeja Paisa",
    price: "$22.000",
    category: "Platos Principales",
  },
  { id: 4, name: "Wonton", price: "$12.000", category: "Entradas" },
  { id: 5, name: "Sancocho", price: "$16.000", category: "Sopas" },
  { id: 6, name: "Arroz Chino", price: "$14.000", category: "Platos Chinos" },
  {
    id: 7,
    name: "Pollo Teriyaki",
    price: "$19.000",
    category: "Platos Chinos",
  },
  { id: 8, name: "Ajiaco", price: "$17.000", category: "Sopas" },
  { id: 9, name: "Spring Rolls", price: "$13.000", category: "Entradas" },
  {
    id: 10,
    name: "Lomo Saltado",
    price: "$25.000",
    category: "Platos Principales",
  },
  { id: 11, name: "Sopa Wonton", price: "$14.500", category: "Sopas" },
  {
    id: 12,
    name: "Cerdo Agridulce",
    price: "$21.000",
    category: "Platos Chinos",
  },
  {
    id: 13,
    name: "Arepa de Huevo",
    price: "$8.000",
    category: "Entradas",
  },
  {
    id: 14,
    name: "Dim Sum Variado",
    price: "$24.000",
    category: "Platos Chinos",
  },
  {
    id: 15,
    name: "Cazuela de Mariscos",
    price: "$32.000",
    category: "Platos Principales",
  },
  {
    id: 16,
    name: "Dumplings de Cerdo",
    price: "$16.500",
    category: "Entradas",
  },
  {
    id: 17,
    name: "Mondongo",
    price: "$19.500",
    category: "Sopas",
  },
  {
    id: 18,
    name: "Pato Pekín",
    price: "$36.000",
    category: "Platos Chinos",
  },
  {
    id: 19,
    name: "Chuleta Valluna",
    price: "$23.000",
    category: "Platos Principales",
  },
  {
    id: 20,
    name: "Rollos de Primavera",
    price: "$12.500",
    category: "Entradas",
  },
  {
    id: 21,
    name: "Caldo de Costilla",
    price: "$15.000",
    category: "Sopas",
  },
  {
    id: 22,
    name: "Chop Suey",
    price: "$20.000",
    category: "Platos Chinos",
  },
  {
    id: 23,
    name: "Lechona Tolimense",
    price: "$28.000",
    category: "Platos Principales",
  },
  {
    id: 24,
    name: "Sushi Rolls",
    price: "$26.000",
    category: "Platos Chinos",
  },
];

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Input Where Title Was */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-2">
        <div className="flex-1 w-full sm:max-w-2xl relative">
          <Input
            type="text"
            placeholder="Buscar platos o categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-gray-200 pl-4 pr-12 py-3 rounded-xl shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          className="px-8 py-3 w-full sm:min-w-[180px] sm:w-auto text-white font-semibold flex items-center gap-2 justify-center"
          style={{ background: "#EB3123" }}
        >
          <Plus className="h-5 w-5" />
          Agregar Plato
        </Button>
      </div>
      {/* Big General Card Container */}{" "}
      <Card
        className="p-6 border-0"
        style={{ borderRadius: "30px", height: "calc(100vh - 110px)" }}
      >
        {/* Scrollable Content Area */}{" "}
        <CardContent
          className="px-0 pb-0 h-full overflow-y-auto custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#C83636 transparent",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pr-2">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((dish) => (
                <Card
                  key={dish.id}
                  className="transition-colors duration-200"
                  style={{ borderRadius: "30px", backgroundColor: "#F1EFEF" }}
                >
                  <CardHeader>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardDescription>{dish.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {" "}
                    <div className="flex justify-between items-center">
                      {" "}
                      <span
                        className="text-base font-normal"
                        style={{ color: "#C83636" }}
                      >
                        {dish.price}
                      </span>{" "}
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                            >
                              <Image
                                src="/images/dropMenuBtn.svg"
                                alt="Menu"
                                width={24}
                                height={24}
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem className="cursor-pointer">
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  No se encontraron platos que coincidan con tu búsqueda.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
