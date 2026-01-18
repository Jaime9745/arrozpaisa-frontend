import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Reduced font weights for better performance
  display: "swap", // Improve font loading performance
});

export const metadata: Metadata = {
  title: "Arroz Paisa, Arriero Chino",
  description:
    "Auténtica comida colombiana y fusión china-colombiana en un solo lugar. Disfruta de nuestros platos típicos con un toque único.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_API_URL}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${poppins.variable} antialiased font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
