import React from 'react';
import { Car, Users, UserCog, Calendar, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onLogout }: NavbarProps) {
  const navItems = [
    { id: 'schedule', icon: Calendar, label: 'Horarios' },
    { id: 'instructors', icon: UserCog, label: 'Instructores' },
    { id: 'students', icon: Users, label: 'Alumnos' },
    { id: 'vehicles', icon: Car, label: 'Vehículos' },
  ];

  return (
    <nav className="bg-red-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Car size={24} />
          <span className="text-xl font-bold">Escuela de Manejo</span>
        </div>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                  ${activeTab === item.id ? 'bg-red-700' : 'hover:bg-red-500'}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-500"
          >
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}