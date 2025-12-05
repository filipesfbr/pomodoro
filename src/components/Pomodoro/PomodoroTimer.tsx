import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string }> = {
  focus: { label: 'Focus', minutes: 25, color: '#ee5253' },
  shortBreak: { label: 'Short Break', minutes: 5, color: '#2ecc71' },
  longBreak: { label: 'Long Break', minutes: 15, color: '#3498db' },
};

interface PomodoroTimerProps {
  durations: {
    focus: number;
    shortBreak: number;
    longBreak: number;
  };
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ durations }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(durations.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // We use local state for the countdown, but initialize/reset from props
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update time when durations change if not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(durations[mode] * 60);
    }
  }, [durations, mode, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      new Notification("Timer Finished", { body: `${MODES[mode].label} session complete!` });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode] * 60);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(durations[newMode] * 60);
  };

  const handleTimeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This local edit is temporary for the current session
    // Ideally, we might want to update the global settings, but for now let's keep it local override
    // Or we can disable local edit since we have global settings now.
    // Let's keep local edit as an override.
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 120) {
      setTimeLeft(val * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-6 flex flex-col items-center justify-center h-full relative overflow-hidden fade-in">
      
      <div className="pomodoro-mode-selector">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`mode-btn ${mode === m ? 'active' : ''}`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="tomato-container">
        <div className={`tomato ${isActive ? 'breathing' : ''}`}>
          <div className="tomato-leaves" />
          <div className="tomato-stem" />
          {isEditing ? (
            <input
              type="number"
              value={Math.ceil(timeLeft / 60)}
              onChange={handleTimeEdit}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="timer-settings-input"
            />
          ) : (
            <div 
              className="tomato-timer-display"
              onClick={() => !isActive && setIsEditing(true)}
              title="Click to edit time"
            >
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Quick Time Adjustment Slider */}
      {!isActive && (
        <div className="w-48 mb-8 fade-in px-4">
          <input
            type="range"
            min="1"
            max="120"
            value={Math.ceil(timeLeft / 60)}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setTimeLeft(val * 60);
            }}
            className="w-full"
            title="Adjust time"
          />
          <div className="text-center text-sm text-muted mt-2 font-medium">
            {Math.ceil(timeLeft / 60)} minutes
          </div>
        </div>
      )}

      <div className="pomodoro-controls">
        <button 
          onClick={toggleTimer}
          className="btn-primary px-8 py-3 text-lg"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        
        <button 
          onClick={resetTimer}
          className="btn-icon p-3 hover:bg-white/10"
          title="Reset Timer"
        >
          <RotateCcw size={24} />
        </button>
      </div>
      
      <div className="mt-8 text-sm text-muted flex items-center gap-2">
        <Timer size={14} />
        <span>{isActive ? 'Focusing...' : 'Ready to focus?'}</span>
      </div>
    </div>
  );
};
