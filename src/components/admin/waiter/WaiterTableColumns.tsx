"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { Waiter } from "@/services/waitersService";
import CopyableCell from "./CopyableCell";
import WaiterTableActions from "./WaiterTableActions";

interface WaiterTableColumnsProps {
  visiblePasswords: Set<string>;
  copiedValues: Set<string>;
  onTogglePasswordVisibility: (waiterId: string) => void;
  onCopyToClipboard: (value: string, key: string) => void;
  onEditWaiter: (waiter: Waiter) => void;
  onDeleteWaiter: (id: string) => void;
}

export function useWaiterTableColumns({
  visiblePasswords,
  copiedValues,
  onTogglePasswordVisibility,
  onCopyToClipboard,
  onEditWaiter,
  onDeleteWaiter,
}: WaiterTableColumnsProps): ColumnDef<Waiter>[] {
  return [
    {
      accessorKey: "firstName",
      header: "Nombre",
      cell: ({ row }) => {
        const fullName = `${row.getValue("firstName")} ${
          row.original.lastName
        }`;
        const copyKey = `name-${fullName}`;
        const isCopied = copiedValues.has(copyKey);

        return (
          <CopyableCell
            value={fullName}
            copyKey="name"
            isCopied={isCopied}
            onCopy={onCopyToClipboard}
            title="Hacer clic para copiar nombre"
          >
            <span className="font-medium">{fullName}</span>
          </CopyableCell>
        );
      },
    },
    {
      accessorKey: "identificationNumber",
      header: "Identificación",
      cell: ({ row }) => {
        const id = row.getValue("identificationNumber") as string;
        const copyKey = `id-${id}`;
        const isCopied = copiedValues.has(copyKey);
        // Format identification number with dots for readability
        const formattedId =
          id && id.length >= 7 ? id.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : id;

        return (
          <CopyableCell
            value={id}
            displayValue={formattedId}
            copyKey="id"
            isCopied={isCopied}
            onCopy={onCopyToClipboard}
            title="Hacer clic para copiar identificación"
          />
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Celular",
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as string;
        const copyKey = `phone-${phone}`;
        const isCopied = copiedValues.has(copyKey);
        // Format phone number for display (assuming Colombian format)
        const formattedPhone =
          phone && phone.length === 10
            ? `+57 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`
            : phone;

        return (
          <CopyableCell
            value={phone}
            displayValue={formattedPhone}
            copyKey="phone"
            isCopied={isCopied}
            onCopy={onCopyToClipboard}
            title="Hacer clic para copiar teléfono"
          />
        );
      },
    },
    {
      accessorKey: "userName",
      header: "Usuario",
      cell: ({ row }) => {
        const username = row.getValue("userName") as string;
        const copyKey = `username-${username}`;
        const isCopied = copiedValues.has(copyKey);

        return (
          <CopyableCell
            value={username}
            copyKey="username"
            isCopied={isCopied}
            onCopy={onCopyToClipboard}
            title="Hacer clic para copiar usuario"
          >
            <span className="text-blue-600 font-medium">{username}</span>
          </CopyableCell>
        );
      },
    },
    {
      accessorKey: "password",
      header: "Contraseña",
      cell: ({ row }) => {
        const waiterId = row.original.id;
        const password = row.getValue("password") as string;
        const isVisible = visiblePasswords.has(waiterId);
        const copyKey = `password-${password}`;
        const isCopied = copiedValues.has(copyKey);

        return (
          <div className="flex items-center gap-2 group">
            <span
              className="font-mono text-sm bg-gray-100 px-2 py-1 rounded cursor-pointer"
              onClick={() => onCopyToClipboard(password, "password")}
              title="Hacer clic para copiar contraseña"
            >
              {isVisible ? password : "••••••••"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePasswordVisibility(waiterId)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>{" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyToClipboard(password, "password")}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              title="Copiar contraseña"
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-gray-500" />
              )}
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <WaiterTableActions
          waiter={row.original}
          onEdit={onEditWaiter}
          onDelete={onDeleteWaiter}
        />
      ),
    },
  ];
}
