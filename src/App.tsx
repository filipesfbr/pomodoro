import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { ToDoList } from './components/ToDo/ToDoList';
import { PomodoroTimer } from './components/Pomodoro/PomodoroTimer';
import { Settings } from './components/Settings/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('focus');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('hub-theme') as 'dark' | 'light') || 'dark';
  });

  // Timer Durations State (in minutes)
  const [timerDurations, setTimerDurations] = useState({
    focus: 25,
    break: 5
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hub-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Layout 
      sidebar={
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      }
    >
      <div className="h-full fade-in relative">
        <div style={{ display: activeTab === 'focus' ? 'block' : 'none', height: '100%' }}>
          <PomodoroTimer durations={timerDurations} />
        </div>
        
        <div style={{ display: activeTab === 'tasks' ? 'block' : 'none', height: '100%' }}>
          <ToDoList />
        </div>
        
        <div style={{ display: activeTab === 'settings' ? 'block' : 'none', height: '100%' }}>
          <Settings 
            theme={theme} 
            toggleTheme={toggleTheme}
            durations={timerDurations}
            setDurations={setTimerDurations}
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
