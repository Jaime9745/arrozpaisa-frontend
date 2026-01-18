"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="sm:max-w-106.25 max-w-[90vw] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        style={{ borderRadius: "20px" }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-800 text-center">
            Confirmar Eliminación
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-center py-7">
            ¿Estás seguro de que quieres eliminar este mesero? Esta acción no se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-[background-color,transform] duration-200 hover:scale-105 active:scale-95"
            style={{ borderRadius: "15px" }}
            disabled={isDeleting}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 text-white transition-[background-color,transform] duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#E71D36", borderRadius: "15px" }}
          >
            {isDeleting ? "Eliminando…" : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
