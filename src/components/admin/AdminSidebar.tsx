import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface AdminSidebarProps {
  sidebarItems: SidebarItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  sidebarItems,
  activeSection,
  onSectionChange,
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleLinkClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsMobileOpen(false); // Close mobile menu when item is clicked
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}{" "}
      {/* Sidebar */}
      <Card
        className={`
          fixed lg:relative transition-transform duration-300 ease-in-out z-50
          w-80 bg-white border-0 flex flex-col
          h-[calc(100vh-60px)] md:h-[calc(100vh-50px)] lg:h-[calc(100vh-48px)]
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-[120%] lg:translate-x-0"
          }
        `}
        style={{ borderRadius: "30px", backgroundColor: "#ffffff" }}
      >
        {" "}
        {/* Header with close button for mobile */}
        <div className="relative p-6 pb-4">
          {/* Close button positioned at top-right */}{" "}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 h-10 w-10 z-10"
          >
            <Image
              src="/images/icons/closeCardIcon.svg"
              alt="Close"
              width={40}
              height={40}
            />
          </Button>
          {/* Logo and greeting */}
          <div className="flex items-center gap-2 pr-12">
            <Image
              src="/images/logo.webp"
              alt="Logo"
              width={120}
              height={120}
              className="rounded-lg"
            />
            <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
              ¡Hola Admin!
            </div>
          </div>
        </div>{" "}
        <nav className="flex-1 mt-2 px-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default to use our custom navigation
                  handleLinkClick(item.id);
                }}
                className={`w-[calc(85%-16px)] mx-auto flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200 my-3 ${
                  activeSection === item.id
                    ? "bg-gray-200 text-gray-800 font-medium shadow-sm"
                    : "text-gray-700"
                }`}
                style={{ borderRadius: "30px" }}
              >
                <IconComponent className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 pt-0 px-4 flex justify-center mt-auto">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-[calc(85%-16px)] mx-auto"
            style={{ borderRadius: "30px" }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </Card>
    </>
  );
}
