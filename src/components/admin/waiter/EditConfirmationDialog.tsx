"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface EditConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditConfirmationDialog({
  isOpen,
  onClose,
}: EditConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="sm:max-w-[425px] max-w-[90vw] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        style={{ borderRadius: "20px" }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-800 text-center">
            Edición Completada
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-center py-7 flex justify-center">
            <Image
              src="/images/icons/checkComplete.svg"
              alt="Edición completada"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogAction
            onClick={onClose}
            className="flex-1 text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#DFAA30", borderRadius: "15px" }}
          >
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
