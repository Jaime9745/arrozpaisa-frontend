// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";

// Mock next/navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    pathname: "/admin",
    query: {},
    asPath: "/admin",
  }),
  usePathname: () => "/admin",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement("img", { src, alt, ...rest });
  },
}));

// Set environment variables for tests
process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";

// Suppress console.error during tests to reduce noise
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn(); // Completely suppress console.error during tests
});

afterAll(() => {
  console.error = originalError;
});
