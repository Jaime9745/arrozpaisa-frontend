/**
 * Convert a File object to base64 string
 * @param file - The image file to convert
 * @returns Promise<string> - Base64 string representation of the image
 */
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to convert image to base64"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file type and size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum allowed size in MB (default: 5MB)
 * @returns Object with validation result and error message if any
 */
export const validateImageFile = (file: File, maxSizeInMB: number = 5) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Tipo de archivo no permitido. Solo se permiten JPG, PNG y WebP.",
    };
  }

  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Máximo ${maxSizeInMB}MB permitido.`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Resize image before converting to base64 to optimize file size
 * @param file - The image file to resize
 * @param maxWidth - Maximum width in pixels (default: 800)
 * @param maxHeight - Maximum height in pixels (default: 600)
 * @param quality - JPEG quality from 0.1 to 1.0 (default: 0.8)
 * @returns Promise<string> - Base64 string of resized image
 */
export const resizeAndConvertToBase64 = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to base64
      const base64String = canvas.toDataURL("image/jpeg", quality);
      resolve(base64String);
    };

    img.onerror = () => {
      reject(new Error("Error loading image"));
    };

    img.src = URL.createObjectURL(file);
  });
};
