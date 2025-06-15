import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
}

export default function AdminSidebar({
  sidebarItems,
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  return (
    <Card
      className="w-80 bg-white shadow-xl border-0 flex flex-col"
      style={{ borderRadius: "30px" }}
    >
      <div className="p-6 flex items-center gap-2">
        <Image
          src="/images/logo.webp"
          alt="Logo"
          width={120}
          height={120}
          className="rounded-lg"
        />
        <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
          ¡Hola Jhon!
        </div>
      </div>
      <nav className="flex-1 mt-2">
        {" "}
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={(e) => {
                e.preventDefault(); // Prevent default to use our custom navigation
                onSectionChange(item.id);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors duration-200 rounded-lg mx-3 my-1 ${
                activeSection === item.id
                  ? "bg-yellow-100 text-yellow-800 font-medium shadow-sm"
                  : "text-gray-700"
              }`}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>{" "}
      <div className="p-6 pt-0">
        <Link href="/">
          <Button variant="outline" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </Link>
      </div>
    </Card>
  );
}
