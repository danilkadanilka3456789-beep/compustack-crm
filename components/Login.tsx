
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="glass-dark w-full max-w-md p-10 rounded-[32px] border border-white/10 shadow-2xl relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Compustack Pro
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold">Вход в панель управления</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-2 ml-1">Логин</label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-600"
              placeholder="Введите логин"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-2 ml-1">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-600"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl transition-all"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 transform active:scale-[0.98]"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;