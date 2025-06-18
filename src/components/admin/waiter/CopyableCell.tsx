"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyableCellProps {
  value: string;
  displayValue?: string;
  copyKey: string;
  isCopied: boolean;
  onCopy: (value: string, key: string) => void;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function CopyableCell({
  value,
  displayValue,
  copyKey,
  isCopied,
  onCopy,
  title = "Hacer clic para copiar",
  className = "",
  children,
}: CopyableCellProps) {
  const handleCopy = () => {
    onCopy(value, copyKey);
  };

  return (
    <div
      className={`flex items-center gap-2 group cursor-pointer ${className}`}
      onClick={handleCopy}
      title={title}
    >
      {children || <span>{displayValue || value}</span>}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
        title={`Copiar ${copyKey}`}
      >
        {isCopied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3 text-gray-500" />
        )}
      </Button>
    </div>
  );
}
