import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';

type TimerMode = 'focus' | 'break';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string }> = {
  focus: { label: 'Focus', minutes: 25, color: '#ee5253' },
  break: { label: 'Break', minutes: 5, color: '#2ecc71' },
};

interface PomodoroTimerProps {
  durations: {
    focus: number;
    break: number;
  };
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ durations }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(durations.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  // We use local state for the countdown, but initialize/reset from props
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset time when mode or its duration changes, but not on pause.
  // Adjusted during render (React's recommended pattern) instead of an effect,
  // so pausing (isActive changing) never re-triggers this.
  const syncedDuration = durations[mode];
  const [prevSynced, setPrevSynced] = useState({ mode, syncedDuration });
  if (!isActive && (prevSynced.mode !== mode || prevSynced.syncedDuration !== syncedDuration)) {
    setPrevSynced({ mode, syncedDuration });
    setTimeLeft(syncedDuration * 60);
  }

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Phase finished -> switch to the next one and auto-start it.
        if (timerRef.current) clearInterval(timerRef.current);
        const next = mode === 'focus' ? 'break' : 'focus';
        new Notification(`Pomodoro — ${MODES[mode].label} finished`, {
          body: mode === 'break'
            ? 'Break is over. Ready for another focus session?'
            : 'Nice work! Time for a break.',
          icon: './tomato.png',
        });
        setMode(next);
        setTimeLeft(durations[next] * 60);
        setIsActive(true);
        return 0;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, durations]);

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

  const startEditing = () => {
    setEditValue(String(Math.ceil(timeLeft / 60)));
    setIsEditing(true);
  };

  const commitEdit = () => {
    const val = parseInt(editValue);
    if (!isNaN(val) && val > 0 && val <= 120) {
      setTimeLeft(val * 60);
    }
    setIsEditing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeDisplay = isEditing ? (
    <input
      type="number"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      onBlur={commitEdit}
      autoFocus
      className="timer-settings-input"
    />
  ) : (
    <div
      className="tomato-timer-display"
      onClick={() => !isActive && startEditing()}
      title="Click to edit time"
    >
      {formatTime(timeLeft)}
    </div>
  );

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
        {mode === 'break' ? (
          <div className={`rest-orb ${isActive ? 'breathing' : ''}`}>
            <Coffee className="rest-icon" size={36} />
            {timeDisplay}
          </div>
        ) : (
          <div className={`tomato ${isActive ? 'breathing' : ''}`}>
            <div className="tomato-leaves" />
            <div className="tomato-stem" />
            {timeDisplay}
          </div>
        )}
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
        <span>
          {mode === 'break'
            ? (isActive ? 'Resting...' : 'Time for a break')
            : (isActive ? 'Focusing...' : 'Ready to focus?')}
        </span>
      </div>
    </div>
  );
};
