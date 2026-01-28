
import React, { useState } from 'react';
import Button from './Button';

interface LoginFormProps {
  onLogin: (status: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const savedUserStr = localStorage.getItem('oniscenary_user');
    let validUser = { username: 'xu4ns0n', password: '123456' };
    
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        validUser = { username: savedUser.username, password: savedUser.password };
      } catch (e) {}
    }

    setTimeout(() => {
      if (username === validUser.username && password === validUser.password) {
        onLogin(true);
      } else {
        setError('Thông tin đăng nhập không đúng!');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] sm:w-[40%] h-[50%] sm:h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] sm:w-[40%] h-[50%] sm:h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-5 sm:mb-6 transform -rotate-6">
            <i className="fa-solid fa-clapperboard text-white text-2xl sm:text-3xl"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter">ONI<span className="text-indigo-400">SCENARY</span></h1>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tài khoản</label>
            <div className="relative group">
              <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 sm:py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-sm"
                placeholder="Tên đăng nhập..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Mật khẩu</label>
            <div className="relative group">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 sm:py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[11px] sm:text-xs text-center animate-in fade-in zoom-in">
              <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg font-bold shadow-2xl shadow-indigo-500/20 active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin"></i>
            ) : (
              'Đăng nhập ngay'
            )}
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-slate-800"></span>
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">Oniscenary v2.0</span>
            <span className="w-8 h-px bg-slate-800"></span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
