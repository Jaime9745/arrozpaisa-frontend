import { convertImageToBase64, validateImageFile } from "../imageUtils";

describe("imageUtils", () => {
  describe("validateImageFile", () => {
    it("should validate a valid JPEG file", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      Object.defineProperty(file, "size", { value: 1024 * 1024 }); // 1MB

      const result = validateImageFile(file);
      expect(result.isValid).toBe(true);
    });

    it("should validate a valid PNG file", () => {
      const file = new File([""], "test.png", { type: "image/png" });
      Object.defineProperty(file, "size", { value: 2 * 1024 * 1024 }); // 2MB

      const result = validateImageFile(file);
      expect(result.isValid).toBe(true);
    });

    it("should reject file with invalid type", () => {
      const file = new File([""], "test.pdf", { type: "application/pdf" });
      Object.defineProperty(file, "size", { value: 1024 * 1024 });

      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Tipo de archivo no permitido");
    });

    it("should reject file that is too large", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      Object.defineProperty(file, "size", { value: 6 * 1024 * 1024 }); // 6MB

      const result = validateImageFile(file, 5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("demasiado grande");
    });

    it("should accept custom max size", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      Object.defineProperty(file, "size", { value: 8 * 1024 * 1024 }); // 8MB

      const result = validateImageFile(file, 10);
      expect(result.isValid).toBe(true);
    });
  });

  describe("convertImageToBase64", () => {
    it("should convert a file to base64 string", async () => {
      const fileContent = "test content";
      const file = new File([fileContent], "test.jpg", { type: "image/jpeg" });

      const result = await convertImageToBase64(file);
      expect(result).toContain("data:image/jpeg;base64,");
      expect(typeof result).toBe("string");
    });

    it("should handle conversion errors", async () => {
      // Create a mock file that will fail
      const file = new File([""], "test.jpg", { type: "image/jpeg" });

      // Mock FileReader to simulate an error
      const originalFileReader = global.FileReader;
      global.FileReader = jest.fn().mockImplementation(() => ({
        readAsDataURL: jest.fn(function (this: any) {
          this.onerror?.();
        }),
        onerror: null,
        onload: null,
        result: null,
      })) as any;

      await expect(convertImageToBase64(file)).rejects.toThrow(
        "Error reading file"
      );

      // Restore original FileReader
      global.FileReader = originalFileReader;
    });
  });
});
