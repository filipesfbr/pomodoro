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

  // Auto-update status pushed from the main process.
  const [updateInfo, setUpdateInfo] = useState<{
    version: string;
    downloaded: boolean;
  } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hub-theme', theme);
  }, [theme]);

  // Subscribe to auto-update events sent by the main process (packaged builds).
  useEffect(() => {
    if (!window.ipcRenderer) return;

    const onAvailable = (_event: unknown, version: unknown) =>
      setUpdateInfo({ version: String(version), downloaded: false });
    const onDownloaded = (_event: unknown, version: unknown) =>
      setUpdateInfo({ version: String(version), downloaded: true });

    window.ipcRenderer.on('update-available', onAvailable);
    window.ipcRenderer.on('update-downloaded', onDownloaded);

    return () => {
      window.ipcRenderer?.off('update-available', onAvailable);
      window.ipcRenderer?.off('update-downloaded', onDownloaded);
    };
  }, []);

  const restartToInstall = () => {
    window.ipcRenderer?.send('app:restart-to-install');
  };

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
        {updateInfo && (
          <div className="update-banner" role="status">
            <span>
              {updateInfo.downloaded
                ? `Atualização v${updateInfo.version} baixada.`
                : `Nova versão v${updateInfo.version} disponível — baixando…`}
            </span>
            {updateInfo.downloaded && (
              <button className="update-banner-btn" onClick={restartToInstall}>
                Reiniciar agora
              </button>
            )}
          </div>
        )}
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
