import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminSidebarProps {
  sidebarItems: SidebarItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function AdminSidebar({ 
  sidebarItems, 
  activeSection, 
  onSectionChange 
}: AdminSidebarProps) {
  return (
    <Card 
      className="w-64 bg-white shadow-xl border-0 flex flex-col" 
      style={{ borderRadius: '30px' }}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Arroz Paisa Admin</h2>
        <p className="text-sm text-gray-600">Panel de Control</p>
      </div>
      
      <nav className="flex-1 mt-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors duration-200 rounded-lg mx-3 my-1 ${
                activeSection === item.id 
                  ? 'bg-yellow-100 text-yellow-800 font-medium shadow-sm' 
                  : 'text-gray-700'
              }`}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 pt-0">
        <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
          <Settings className="h-4 w-4 mr-2" />
          Configuración
        </Button>
      </div>
    </Card>
  );
}
