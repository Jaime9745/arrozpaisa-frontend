"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Waiter } from "@/services/waitersService";

interface WaiterTableActionsProps {
  waiter: Waiter;
  onEdit: (waiter: Waiter) => void;
  onDelete: (id: string) => void;
}

export default function WaiterTableActions({
  waiter,
  onEdit,
  onDelete,
}: WaiterTableActionsProps) {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-12 w-12 p-0">
            <Image
              src="/images/dropMenuBtn.svg"
              alt="Menu"
              width={48}
              height={48}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-36 p-2"
          style={{ borderRadius: "10px" }}
        >
          <DropdownMenuItem
            className="cursor-pointer p-3"
            onClick={() => onEdit(waiter)}
          >
            <Edit className="h-5 w-5 mr-3" style={{ color: "#DFAA30" }} />
            <span style={{ color: "#DFAA30" }}>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-red-50 p-3"
            onClick={() => onDelete(waiter.id)}
          >
            <Trash2 className="h-5 w-5 mr-3" style={{ color: "#E71D36" }} />
            <span style={{ color: "#E71D36" }}>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
