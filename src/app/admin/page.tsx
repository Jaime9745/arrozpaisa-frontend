"use client";

import { useState } from "react";
import { Home, ChefHat, Users, Table } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHome from "@/components/admin/DashboardHome";
import MenuManagement from "@/components/admin/MenuManagement";
import WaiterManagement from "@/components/admin/WaiterManagement";
import TableStatus from "@/components/admin/TableStatus";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("inicio");

  const sidebarItems = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "menu", label: "Menú", icon: ChefHat },
    { id: "meseros", label: "Meseros", icon: Users },
    { id: "estados-mesa", label: "Estados de Mesa", icon: Table },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return <DashboardHome />;
      case "menu":
        return <MenuManagement />;
      case "meseros":
        return <WaiterManagement />;
      case "estados-mesa":
        return <TableStatus />;
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <div 
      className="min-h-screen flex p-6" 
      style={{
        background: 'linear-gradient(126.22deg, #F3FF18 4.79%, #DFAA30 54.4%)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <AdminSidebar 
        sidebarItems={sidebarItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 ml-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}
