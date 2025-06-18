import { useState, useCallback } from "react";

interface UseCopyToClipboardReturn {
  copiedValues: Set<string>;
  handleCopyToClipboard: (value: string, key: string) => Promise<void>;
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copiedValues, setCopiedValues] = useState<Set<string>>(new Set());

  const handleCopyToClipboard = useCallback(
    async (value: string, key: string) => {
      try {
        // Check if clipboard API is available
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement("textarea");
          textArea.value = value;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        const copyKey = `${key}-${value}`;
        setCopiedValues((prev) => new Set(prev).add(copyKey));

        // Remove the copied indicator after 2 seconds
        setTimeout(() => {
          setCopiedValues((prev) => {
            const newSet = new Set(prev);
            newSet.delete(copyKey);
            return newSet;
          });
        }, 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        // You could add a toast notification here to inform the user of the error
      }
    },
    []
  );

  return {
    copiedValues,
    handleCopyToClipboard,
  };
}
