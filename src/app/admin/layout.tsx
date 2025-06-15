"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, ChefHat, Users, Table } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Define sidebar items with paths
  const sidebarItems: SidebarItem[] = [
    { id: "inicio", label: "Inicio", icon: Home, path: "/admin" },
    { id: "menu", label: "Menú", icon: ChefHat, path: "/admin/menu" },
    { id: "meseros", label: "Meseros", icon: Users, path: "/admin/waiter" },
    {
      id: "estados-mesa",
      label: "Estados de Mesa",
      icon: Table,
      path: "/admin/table",
    },
  ];

  // Determine active section based on pathname
  const getActiveSectionFromPath = (path: string) => {
    if (path === "/admin") return "inicio";
    if (path.includes("/admin/menu")) return "menu";
    if (path.includes("/admin/waiter")) return "meseros";
    if (path.includes("/admin/table")) return "estados-mesa";
    return "inicio";
  };

  const [activeSection, setActiveSection] = useState(
    getActiveSectionFromPath(pathname)
  );

  // Update active section when path changes
  useEffect(() => {
    setActiveSection(getActiveSectionFromPath(pathname));
  }, [pathname]);
  
  // Handle section change by navigating using router.push for client-side navigation
  const handleSectionChange = (section: string) => {
    const item = sidebarItems.find((item) => item.id === section);
    if (item) {
      router.push(item.path);
    }
  };

  return (
    <div
      className="min-h-screen flex p-6"
      style={{
        background: "linear-gradient(126.22deg, #F3FF18 4.79%, #DFAA30 54.4%)",
        backdropFilter: "blur(4px)",
      }}
    >
      <AdminSidebar
        sidebarItems={sidebarItems}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <div className="flex-1 ml-6 overflow-auto">{children}</div>
    </div>
  );
}
