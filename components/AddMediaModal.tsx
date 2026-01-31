import React, { useState, useEffect, useMemo } from "react";
import { MediaItem, MediaCategory, MediaStatus } from "../types";
import Button from "./Button";

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MediaItem) => void;
  editingItem?: MediaItem | null;
  allItems: MediaItem[];
}

const AddMediaModal: React.FC<AddMediaModalProps> = ({ isOpen, onClose, onSave, editingItem, allItems }) => {
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: "",
    category: MediaCategory.ANIME,
    status: MediaStatus.PLAN_TO_WATCH,
    rating: 8,
    description: "",
    imageUrl: "",
    movieUrl: "",
    topOrder: undefined,
    genres: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      setImageFile(null);
    } else {
      setFormData({
        title: "",
        category: MediaCategory.ANIME,
        status: MediaStatus.PLAN_TO_WATCH,
        rating: 8,
        description: "",
        imageUrl: "",
        movieUrl: "",
        topOrder: undefined,
        genres: [],
      });
      setImageFile(null);
    }
  }, [editingItem, isOpen]);

  const categoryCount = useMemo(() => {
    return allItems.filter((item) => item.category === formData.category).length;
  }, [allItems, formData.category]);

  const toggleGenre = (genre: string) => {
    const currentGenres = formData.genres || [];
    if (currentGenres.includes(genre)) {
      setFormData({ ...formData, genres: currentGenres.filter((g) => g !== genre) });
    } else {
      setFormData({ ...formData, genres: [...currentGenres, genre] });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, imageUrl: base64String });
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newItem: MediaItem = {
      id: editingItem?.id || Date.now().toString(),
      title: formData.title || "Không rõ",
      category: formData.category as MediaCategory,
      status: formData.status as MediaStatus,
      rating: formData.rating || 0,
      description: formData.description || "",
      imageUrl: formData.imageUrl || "",
      movieUrl: formData.movieUrl || "",
      topOrder: formData.topOrder,
      genres: formData.genres || [],
      createdAt: editingItem?.createdAt || Date.now(),
    };
    onSave(newItem);
    onClose();
  };

  const quickGenres = ["Kinh dị", "Viễn tưởng", "Anh hùng", "Hành động", "Tình cảm", "Hài hước"];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden">
      <div className="bg-slate-900 w-full max-w-2xl rounded-t-[32px] sm:rounded-2xl border-t sm:border border-slate-800 shadow-2xl flex flex-col h-[92vh] sm:h-auto max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in duration-300">
        {/* Mobile Handle Bar */}
        <div className="sm:hidden flex justify-center py-2 shrink-0">
          <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
        </div>

        <div className="px-6 py-4 sm:p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-white">{editingItem ? "Chỉnh sửa" : "Thêm mới"}</h2>
          <button aria-label="xs" onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar pb-10 sm:pb-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
            <p className="text-[11px] sm:text-xs text-indigo-300 font-medium leading-relaxed">
              <i className="fa-solid fa-circle-info mr-2"></i>
              Bạn đang có <span className="font-bold text-white">{categoryCount}</span> bộ <span className="font-bold text-white">{formData.category}</span> trong kho.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Tiêu đề</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                placeholder="Vd: Naruto..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Vị trí (Top)</label>
              <input
                type="number"
                min="1"
                value={formData.topOrder || ""}
                onChange={(e) => setFormData({ ...formData, topOrder: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full bg-slate-800 border border-amber-500/30 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold text-center text-sm"
                placeholder="Trống"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Loại</label>
              <select
                aria-label="xs"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MediaCategory })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
              >
                {Object.values(MediaCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Trạng thái</label>
              <select
                aria-label="xs"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MediaStatus })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
              >
                {Object.values(MediaStatus).map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Link xem phim / truyện</label>
            <div className="relative group">
              <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                type="text"
                value={formData.movieUrl || ""}
                onChange={(e) => setFormData({ ...formData, movieUrl: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-2.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Đánh giá (0-10)</label>
            <input
              aria-label="xs"
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Ảnh Bìa</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="w-full bg-slate-800 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl px-4 py-3 sm:py-2.5 text-slate-400 hover:text-indigo-400 focus:outline-none transition-all text-sm cursor-pointer flex items-center justify-center gap-2 group">
                  <i className="fa-solid fa-upload group-hover:scale-110 transition-transform"></i>
                  <span>{imageFile ? imageFile.name : "Chọn ảnh từ máy"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <input
                  type="text"
                  value={formData.imageUrl && !formData.imageUrl.startsWith("data:") ? formData.imageUrl : ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="Hoặc dán link ảnh..."
                />
              </div>
              {formData.imageUrl && (
                <div className="relative group">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-[120px] object-cover rounded-xl border-2 border-slate-700" />
                  <button
                    aria-label="xs"
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, imageUrl: "" });
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Mô tả ngắn</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none"
              placeholder="Cảm nghĩ của bạn về bộ này..."
            ></textarea>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Thể loại</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                    formData.genres?.includes(genre) ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.genres?.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  genres: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== ""),
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              placeholder="Hoặc tự nhập: Action, Romance..."
            />
          </div>
        </form>

        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row gap-3 shrink-0">
          <Button variant="primary" type="button" onClick={handleSubmit} className="w-full sm:flex-1 py-3 sm:py-2.5 rounded-xl sm:rounded-xl text-sm sm:text-base order-1 sm:order-2">
            <i className="fa-solid fa-save"></i> {editingItem ? "Cập nhật" : "Thêm vào kho"}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-xl sm:rounded-xl text-sm sm:text-base order-2 sm:order-1 text-slate-400">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddMediaModal;
