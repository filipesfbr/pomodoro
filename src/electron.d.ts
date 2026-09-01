interface Window {
  ipcRenderer?: {
    on(channel: string, listener: (event: unknown, ...args: unknown[]) => void): unknown;
    off(channel: string, listener: (event: unknown, ...args: unknown[]) => void): unknown;
    send(channel: string, ...args: unknown[]): void;
  };
}
