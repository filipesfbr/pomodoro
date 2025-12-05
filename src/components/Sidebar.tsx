import React from 'react';
import { Timer, CheckSquare, Settings, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, theme, toggleTheme }) => {
  const menuItems = [
    { id: 'focus', icon: Timer, label: 'Focus' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      {/* App Logo / Header */}
      <div className="sidebar-header">
        <div className="logo-container" style={{ background: 'transparent', boxShadow: 'none' }}>
          <span className="logo-text" style={{ fontSize: '1.5rem' }}>🍅</span>
        </div>
        <span className="app-name">Pomodoro</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon 
                size={20} 
                className="nav-icon"
              />
              <span className="nav-label">{item.label}</span>
              {isActive && (
                <div className="active-indicator" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div className="sidebar-footer">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={toggleTheme}
            className="btn-icon p-2 bg-white/5 hover:bg-white/10 rounded-md w-full flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </aside>
  );
};
