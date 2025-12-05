import React from 'react';

interface LayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="app-layout">
      {sidebar}

      {/* Title Bar Region (Draggable) */}
      <div 
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} 
        className="title-bar"
      >
        <span className="title-bar-text">POMODORO</span>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};
