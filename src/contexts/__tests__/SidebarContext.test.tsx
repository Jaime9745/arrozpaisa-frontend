import { renderHook, act } from "@testing-library/react";
import { SidebarProvider, useSidebar } from "../SidebarContext";

describe("SidebarContext", () => {
  describe("useSidebar hook", () => {
    it("should throw error when used outside SidebarProvider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useSidebar());
      }).toThrow("useSidebar must be used within a SidebarProvider");

      console.error = originalError;
    });

    it("should provide sidebar context when used within SidebarProvider", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.isMobileOpen).toBeDefined();
      expect(result.current.setIsMobileOpen).toBeDefined();
      expect(result.current.toggleSidebar).toBeDefined();
    });
  });

  describe("SidebarProvider initialization", () => {
    it("should initialize with isMobileOpen as false", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(result.current.isMobileOpen).toBe(false);
    });

    it("should provide all expected context values", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(typeof result.current.isMobileOpen).toBe("boolean");
      expect(typeof result.current.setIsMobileOpen).toBe("function");
      expect(typeof result.current.toggleSidebar).toBe("function");
    });
  });

  describe("setIsMobileOpen function", () => {
    it("should set isMobileOpen to true", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(result.current.isMobileOpen).toBe(false);

      act(() => {
        result.current.setIsMobileOpen(true);
      });

      expect(result.current.isMobileOpen).toBe(true);
    });

    it("should set isMobileOpen to false", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      // First set to true
      act(() => {
        result.current.setIsMobileOpen(true);
      });

      expect(result.current.isMobileOpen).toBe(true);

      // Then set to false
      act(() => {
        result.current.setIsMobileOpen(false);
      });

      expect(result.current.isMobileOpen).toBe(false);
    });

    it("should allow multiple consecutive calls", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      act(() => {
        result.current.setIsMobileOpen(true);
      });
      expect(result.current.isMobileOpen).toBe(true);

      act(() => {
        result.current.setIsMobileOpen(false);
      });
      expect(result.current.isMobileOpen).toBe(false);

      act(() => {
        result.current.setIsMobileOpen(true);
      });
      expect(result.current.isMobileOpen).toBe(true);
    });
  });

  describe("toggleSidebar function", () => {
    it("should toggle from false to true", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(result.current.isMobileOpen).toBe(false);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isMobileOpen).toBe(true);
    });

    it("should toggle from true to false", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      // First open
      act(() => {
        result.current.setIsMobileOpen(true);
      });

      expect(result.current.isMobileOpen).toBe(true);

      // Then toggle to close
      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isMobileOpen).toBe(false);
    });

    it("should toggle multiple times correctly", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(result.current.isMobileOpen).toBe(false);

      // Toggle 1: false -> true
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(true);

      // Toggle 2: true -> false
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(false);

      // Toggle 3: false -> true
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(true);

      // Toggle 4: true -> false
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(false);
    });
  });

  describe("interaction between setIsMobileOpen and toggleSidebar", () => {
    it("should work correctly when mixing setIsMobileOpen and toggleSidebar", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      // Start closed
      expect(result.current.isMobileOpen).toBe(false);

      // Open with setter
      act(() => {
        result.current.setIsMobileOpen(true);
      });
      expect(result.current.isMobileOpen).toBe(true);

      // Close with toggle
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(false);

      // Open with toggle
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(true);

      // Close with setter
      act(() => {
        result.current.setIsMobileOpen(false);
      });
      expect(result.current.isMobileOpen).toBe(false);
    });

    it("should maintain state consistency", () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      // Set to true
      act(() => {
        result.current.setIsMobileOpen(true);
      });
      expect(result.current.isMobileOpen).toBe(true);

      // Toggle (should be false)
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(false);

      // Set to same value (false)
      act(() => {
        result.current.setIsMobileOpen(false);
      });
      expect(result.current.isMobileOpen).toBe(false);

      // Toggle (should be true)
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isMobileOpen).toBe(true);
    });
  });

  describe("context persistence", () => {
    it("should maintain state across re-renders", () => {
      const { result, rerender } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      // Start with false
      expect(result.current.isMobileOpen).toBe(false);

      // Change to true
      act(() => {
        result.current.setIsMobileOpen(true);
      });

      expect(result.current.isMobileOpen).toBe(true);

      // Re-render should maintain state
      rerender();

      expect(result.current.isMobileOpen).toBe(true);

      // Toggle should still work
      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isMobileOpen).toBe(false);
    });
  });
});
