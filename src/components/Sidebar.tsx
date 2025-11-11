import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Sparkles,
  BarChart3,
  Clock,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Início", icon: Home },
    { id: "appointments", label: "Agendamentos", icon: Calendar },
    { id: "patients", label: "Pacientes", icon: Users },
    { id: "treatments", label: "Tratamentos", icon: Sparkles },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
    { id: "schedule", label: "Horários", icon: Clock },
    { id: "billing", label: "Financeiro", icon: CreditCard },
    { id: "documents", label: "Documentos", icon: FileText },
  ];

  return (
  <div
    className={`${isCollapsed ? 'w-14' : 'w-56'} text-neutral-50 flex flex-col rounded-r-3xl transition-all duration-300 relative shadow-xl ml-4 mb-8`}
    style={{ background: `linear-gradient(to bottom, #5a1e33, #451726, #240d14)`, maxHeight: '96vh', paddingTop: '40px' }}
  >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed((v) => !v)}
        className="absolute -right-3 top-8 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors shadow-lg z-10"
        aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-neutral-50" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-neutral-50" />
        )}
      </button>

      {/* Logo/Header - Dark Background */}
      <div className={`bg-gradient-to-b from-[#1a0d15] to-[#2d1420] ${isCollapsed ? 'px-2 py-6' : 'px-4 py-8 pb-6'} transition-all duration-300 flex flex-col items-center justify-center`}>
        <img 
          src="/legacy-backend/public/assets/LOGO BRANCA.png" 
          alt="Logo" 
          className={`${isCollapsed ? 'w-10 h-10' : 'w-16 h-16'} object-contain flex-shrink-0 transition-all duration-300 mt-4 mb-4`}
        />
        {!isCollapsed && (
          <div className="text-center">
            <h3 className="text-neutral-50 text-sm font-semibold">Dr. David</h3>
          </div>
        )}
      </div>

      <Separator className="bg-primary-700" />

      {/* Menu Items */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-1 overflow-y-auto transition-all duration-300`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-primary-600 text-neutral-50 shadow-lg' 
                  : 'text-primary-100 hover:bg-primary-700 hover:text-neutral-50'
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <Separator className="bg-primary-700" />

      {/* Settings & User Profile */}
      <div className={`${isCollapsed ? 'px-2' : 'px-3'} py-3 space-y-2 transition-all duration-300`}>
        <button
          onClick={() => onTabChange("settings")}
          className={`
            w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-all duration-200
            ${activeTab === "settings"
              ? 'bg-primary-600 text-neutral-50 shadow-lg' 
              : 'text-primary-100 hover:bg-primary-700 hover:text-neutral-50'
            }
          `}
          title={isCollapsed ? "Configurações" : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Configurações</span>}
        </button>

        <Separator className="bg-primary-700 my-3" />

        {/* User Profile */}
        {isCollapsed ? (
          <div className="flex items-center justify-center py-2">
            <Avatar className="w-9 h-9 border-2 border-primary-600">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary-600 text-neutral-50 text-xs">DB</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-900/50">
            <Avatar className="w-9 h-9 border-2 border-primary-600">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary-600 text-neutral-50 text-xs">DB</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-50 truncate">Dr David Breno</p>
              <p className="text-[10px] text-primary-200 truncate">Ortodontista</p>
            </div>
            <button className="text-primary-200 hover:text-neutral-50 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}