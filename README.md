# 🍅 Pomodoro

Um app desktop de Pomodoro feito com **Electron**, **React** e **TypeScript** (Vite). Tem timer de foco/pausa, lista de tarefas integrada, ajuste rápido de tempo e temas claro/escuro.

## ✨ Funcionalidades

- ⏱️ **Timer Pomodoro** — sessões de foco e pausa com contar-regressiva, notificação do sistema ao terminar
- 🎯 **Lista de tarefas** (To-Do) — adicione, conclua e remova tasks; tudo salvo localmente
- ⚙️ **Settings** — personaliza a duração de foco (1–60 min) e pausa (1–30 min) e escolhe o tema
- 🌗 **Tema claro/escuro** — preferência persistida
- 🍅 Visual leve com ícones de tomate animados em cada sessão

## 🚀 Rodando localmente

```bash
# Instala as dependências
npm install

# Modo desenvolvimento (Vite + Electron com hot reload)
npm run dev

# Build de produção
npm run build
```

## 🛠️ Stack

- [Electron](https://www.electronjs.org/) — desktop
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tooling
- [lucide-react](https://lucide.dev/icons/) — ícones
- [electron-builder](https://www.electron.build/) — empacotamento

## 📁 Estrutura

```
src/                        # renderer (React)
  ├── components/
  │   ├── Pomodoro/         # timer de foco/pausa
  │   ├── ToDo/             # lista de tarefas
  │   └── Settings/         # config (temas e durações)
  └── App.tsx
electron/                   # processo principal / preload
public/                     # assets (ícone do tomate)
```

Dados (tarefas, tema e durações) ficam salvos em `localStorage`.

## 📄 Licença

MIT — veja o arquivo [LICENSE](LICENSE).