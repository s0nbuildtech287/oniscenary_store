
import React, { useState, useEffect } from 'react';
import Button from './Button';

interface UserProfile {
  username: string;
  password?: string;
  avatar: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user, password: '' });

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...user, password: '' });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      username: formData.username,
      avatar: formData.avatar,
      password: formData.password || user.password // Giữ pass cũ nếu không nhập mới
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/30">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-user-gear text-indigo-400"></i> Hồ sơ cá nhân
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-indigo-500/50 overflow-hidden mb-4 shadow-xl">
              <img 
                src={formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.username}`} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Xem trước ảnh đại diện</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tên đăng nhập</label>
            <input 
              required
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Mật khẩu mới (Để trống nếu không đổi)</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Link ảnh đại diện (URL)</label>
            <input 
              type="text" 
              value={formData.avatar}
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1 py-3 rounded-2xl">Hủy</Button>
            <Button variant="primary" type="submit" className="flex-1 py-3 rounded-2xl">Lưu thay đổi</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
