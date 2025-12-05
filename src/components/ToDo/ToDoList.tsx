import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export const ToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('hub-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('hub-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now()
    };
    
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="todo-container fade-in">
      <div className="todo-header">
        <h2 className="todo-title">Tasks</h2>
        <span className="todo-count">
          {todos.filter(t => !t.completed).length} remaining
        </span>
      </div>

      <form onSubmit={addTodo} className="todo-input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="todo-add-btn" disabled={!input.trim()}>
          <Plus size={20} />
        </button>
      </form>

      <div className="todo-list custom-scrollbar">
        {todos.length === 0 ? (
          <div className="todo-empty">
            <div className="todo-empty-icon">
              <CheckCircle2 size={48} />
            </div>
            <p>All caught up! Time to focus.</p>
          </div>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <button 
                onClick={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              >
                {todo.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>
              
              <span className="todo-text">
                {todo.text}
              </span>
              
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="todo-delete-btn"
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
