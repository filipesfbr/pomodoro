import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface SettingsProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  durations: {
    focus: number;
    shortBreak: number;
    longBreak: number;
  };
  setDurations: React.Dispatch<React.SetStateAction<{
    focus: number;
    shortBreak: number;
    longBreak: number;
  }>>;
}

export const Settings: React.FC<SettingsProps> = ({ theme, toggleTheme, durations, setDurations }) => {
  const handleDurationChange = (key: keyof typeof durations, value: number) => {
    setDurations(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">Settings</h2>
      
      <div className="glass-panel p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">Appearance</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-primary">App Theme</div>
            <div className="text-sm text-muted">Select your preferred appearance</div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-primary"
          >
            {theme === 'dark' ? (
              <>
                <Moon size={18} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={18} />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-6 text-primary">Timer Durations (minutes)</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-primary">Focus</span>
              <span className="text-muted">{durations.focus} min</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={durations.focus}
              onChange={(e) => handleDurationChange('focus', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-primary">Short Break</span>
              <span className="text-muted">{durations.shortBreak} min</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={durations.shortBreak}
              onChange={(e) => handleDurationChange('shortBreak', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-primary">Long Break</span>
              <span className="text-muted">{durations.longBreak} min</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={durations.longBreak}
              onChange={(e) => handleDurationChange('longBreak', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted">
        <p>Pomodoro v1.0.0</p>
        <p>Built with Electron & React</p>
      </div>
    </div>
  );
};
