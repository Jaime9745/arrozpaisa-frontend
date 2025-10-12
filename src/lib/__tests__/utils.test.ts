import { cn } from "../utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("text-red-500", "bg-blue-200");
    expect(result).toBe("text-red-500 bg-blue-200");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("should override conflicting Tailwind classes", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle empty strings and falsy values", () => {
    const result = cn("text-lg", "", false, null, undefined, "font-bold");
    expect(result).toBe("text-lg font-bold");
  });

  it("should handle arrays of classes", () => {
    const result = cn(["text-sm", "text-red-500"], "bg-white");
    expect(result).toBe("text-sm text-red-500 bg-white");
  });
});
