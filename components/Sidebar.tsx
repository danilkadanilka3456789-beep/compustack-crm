
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  onOpenLogin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, onModeChange, onLogout, isAuthenticated, onOpenLogin }) => {
  const crmItems = [
    { mode: AppMode.DASHBOARD, label: 'Дашборд', icon: '📊' },
    { mode: AppMode.CLIENTS, label: 'Клиенты', icon: '👥' },
    { mode: AppMode.PRODUCTS, label: 'Каталог', icon: '💻' },
    { mode: AppMode.ORDERS, label: 'Заказы', icon: '📝' },
  ];

  return (
    <div className="w-64 glass border-r border-white/5 flex flex-col h-full z-10 bg-slate-900/50">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Compustack Pro
        </h1>
        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-semibold">CRM Workspace</p>
      </div>

      <nav className="flex-1 px-4 space-y-6 py-4 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Управление</div>
          <div className="space-y-1">
            {crmItems.map((item) => (
              <button
                key={item.mode}
                onClick={() => onModeChange(item.mode)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  activeMode === item.mode
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-3">
        {isAuthenticated ? (
          <>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                АД
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-medium truncate">Администратор</div>
                <div className="text-[10px] text-green-500 truncate font-semibold">● Online</div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent"
            >
              <span className="text-lg">🚪</span>
              <span className="text-sm font-medium">Выйти</span>
            </button>
          </>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full flex items-center space-x-3 p-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-all"
          >
            <span className="text-lg">🔒</span>
            <span className="text-sm font-bold uppercase tracking-wider">Авторизация</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;