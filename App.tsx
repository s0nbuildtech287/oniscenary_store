import React, { useState, useEffect, useMemo, useRef } from "react";
import { MediaItem, MediaCategory, MediaStatus } from "./types";
import MovieCard from "./components/MovieCard";
import Button from "./components/Button";
import AddMediaModal from "./components/AddMediaModal";
import LoginForm from "./components/LoginForm";
import ProfileModal from "./components/ProfileModal";
import VideoPlayerModal from "./components/VideoPlayerModal";
import ChatBot from "./components/ChatBot";

type ViewMode = "all" | "ranking" | "history" | "settings";

interface UserProfile {
  username: string;
  password?: string;
  avatar: string;
}

const ITEMS_PER_PAGE = 12;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>({
    username: "xu4ns0n",
    password: "123456",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=xu4ns0n",
  });

  const [items, setItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<MediaCategory | "All">("All");
  const [filterGenre, setFilterGenre] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Video Player State
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const session = sessionStorage.getItem("oniscenary_session");
    if (session === "true") setIsLoggedIn(true);

    const savedUser = localStorage.getItem("oniscenary_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const saved = localStorage.getItem("oniscenary_db");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    localStorage.setItem("oniscenary_db", JSON.stringify(items));
  }, [items, isLoggedIn]);

  // Reset page and genre when filters change
  useEffect(() => {
    setCurrentPage(1);
    // Nếu chuyển category khác Movie thì reset bộ lọc thể loại
    if (filterCategory !== MediaCategory.LIVE_ACTION) {
      setFilterGenre("All");
    }
  }, [searchQuery, filterCategory, viewMode]);

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === "All" || item.category === filterCategory;

      // Lọc theo thể loại (Genre)
      const matchGenre = filterGenre === "All" || item.genres.some((g) => g.toLowerCase().trim() === filterGenre.toLowerCase().trim());

      return matchSearch && matchCategory && matchGenre;
    });

    if (viewMode === "ranking") {
      return [...result].sort((a, b) => b.rating - a.rating);
    }

    if (viewMode === "history") {
      return [...result].sort((a, b) => b.createdAt - a.createdAt);
    }

    return [...result].sort((a, b) => {
      const topA = a.topOrder ?? 999999;
      const topB = b.topOrder ?? 999999;
      if (topA !== topB) return topA - topB;
      return b.createdAt - a.createdAt;
    });
  }, [items, searchQuery, filterCategory, filterGenre, viewMode]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const categoryCounts = useMemo(() => {
    return {
      All: items.length,
      [MediaCategory.ANIME]: items.filter((i) => i.category === MediaCategory.ANIME).length,
      [MediaCategory.LIVE_ACTION]: items.filter((i) => i.category === MediaCategory.LIVE_ACTION).length,
      [MediaCategory.MANGA]: items.filter((i) => i.category === MediaCategory.MANGA).length,
    };
  }, [items]);

  const handleLogin = (status: boolean) => {
    setIsLoggedIn(status);
    if (status) sessionStorage.setItem("oniscenary_session", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("oniscenary_session");
    setIsUserDropdownOpen(false);
  };

  const handleSaveProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("oniscenary_user", JSON.stringify(updatedUser));
  };

  const handleSave = (item: MediaItem) => {
    const exists = items.find((i) => i.id === item.id);
    if (exists) {
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      setItems([item, ...items]);
    }
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Xóa mục này khỏi kho lưu trữ?")) {
      setItems(items.filter((i) => i.id !== id));
      setSelectedItem(null);
    }
  };

  const exportDatabase = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "metadata.json");
    linkElement.click();
  };

  const importDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          if (window.confirm("Gộp dữ liệu mới vào kho hiện tại? (Chọn Cancel để Thay thế hoàn toàn)")) {
            const combined = [...items];
            importedData.forEach((newItem: MediaItem) => {
              if (!combined.find((i) => i.id === newItem.id)) combined.push(newItem);
            });
            setItems(combined);
            alert("Đã gộp dữ liệu thành công!");
          } else {
            setItems(importedData);
            alert("Đã thay thế dữ liệu thành công!");
          }
        }
      } catch (err) {
        alert("Lỗi file JSON! Vui lòng kiểm tra lại file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePlayVideo = (url: string, title: string) => {
    setActiveVideo({ url, title });
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const linkClass = mobile
      ? "flex items-center gap-4 px-6 py-4 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-lg font-medium border-l-4 border-transparent hover:border-indigo-500"
      : "text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all hover:after:w-full";
    const activeClass = mobile ? "bg-indigo-500/10 text-white border-indigo-500" : "text-white after:w-full";
    const separator = !mobile && <div className="h-4 w-px bg-white/10 shrink-0"></div>;

    return (
      <>
        <div
          onClick={() => {
            setViewMode("all");
            mobile && setIsMobileMenuOpen(false);
          }}
          className={`${linkClass} ${viewMode === "all" ? activeClass : ""}`}
        >
          {mobile && <i className="fa-solid fa-house w-6"></i>} Trang chủ
        </div>
        {separator}
        <div
          onClick={() => {
            setViewMode("ranking");
            mobile && setIsMobileMenuOpen(false);
          }}
          className={`${linkClass} ${viewMode === "ranking" ? activeClass : ""}`}
        >
          {mobile && <i className="fa-solid fa-trophy w-6"></i>} Xếp hạng
        </div>
        {separator}
        <div
          onClick={() => {
            setViewMode("history");
            mobile && setIsMobileMenuOpen(false);
          }}
          className={`${linkClass} ${viewMode === "history" ? activeClass : ""}`}
        >
          {mobile && <i className="fa-solid fa-clock-rotate-left w-6"></i>} Lịch sử
        </div>
        {separator}
        <div
          onClick={() => {
            setViewMode("settings");
            mobile && setIsMobileMenuOpen(false);
          }}
          className={`${linkClass} ${viewMode === "settings" ? activeClass : ""}`}
        >
          {mobile && <i className="fa-solid fa-database w-6"></i>} Dữ liệu (JSON)
        </div>
      </>
    );
  };

  const FilterChip = ({ category, label, icon }: { category: MediaCategory | "All"; label: string; icon: string }) => {
    const active = filterCategory === category;
    return (
      <button
        onClick={() => setFilterCategory(category)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all border shrink-0 snap-center ${
          active ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"
        }`}
      >
        <i className={`${icon} ${active ? "text-white" : "text-slate-600"}`}></i>
        {label}
        <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-600"}`}>{categoryCounts[category]}</span>
      </button>
    );
  };

  const GenreChip = ({ genre, label }: { genre: string; label: string }) => {
    const active = filterGenre === genre;
    return (
      <button
        onClick={() => setFilterGenre(genre)}
        className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border shrink-0 snap-center ${
          active ? "bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20" : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300"
        }`}
      >
        {label}
      </button>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          aria-label="xs"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500/50 hover:text-white transition-all"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (totalPages > 5) {
            if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
              if (page === currentPage - 2 || page === currentPage + 2)
                return (
                  <span key={page} className="text-slate-600">
                    ...
                  </span>
                );
              return null;
            }
          }

          return (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`w-10 h-10 rounded-xl font-bold text-xs transition-all border ${
                currentPage === page
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-110"
                  : "bg-slate-900 border-white/5 text-slate-500 hover:border-indigo-500/30 hover:text-slate-300"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          aria-label="xs"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500/50 hover:text-white transition-all"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  if (!isLoggedIn) return <LoginForm onLogin={handleLogin} />;

  const showHero = viewMode === "all" && searchQuery === "" && currentPage === 1;

  return (
    <div className="min-h-screen pb-24 bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      <input aria-label="xs" type="file" ref={fileInputRef} onChange={importDatabase} accept=".json" className="hidden" />

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 z-[60] h-full w-72 bg-slate-900 border-r border-white/5 transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <span className="text-lg font-bold text-white tracking-tighter">
            ONI<span className="text-indigo-400">SCENARY</span>
          </span>
          <button aria-label="xs" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-2">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <nav className="mt-4 flex flex-col">
          <NavLinks mobile />
          <div className="h-px bg-white/5 my-4 mx-6"></div>
          <div
            onClick={() => {
              setIsProfileModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-lg font-medium border-l-4 border-transparent"
          >
            <i className="fa-solid fa-user-circle w-6"></i> Tài khoản
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all text-lg font-medium border-l-4 border-transparent"
          >
            <i className="fa-solid fa-right-from-bracket w-6"></i> Đăng xuất
          </div>
        </nav>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-40 glass-morphism h-16 border-b border-white/5 px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button aria-label="xs" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-300 hover:text-white p-2 -ml-2">
            <i className="fa-solid fa-bars-staggered text-lg"></i>
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setViewMode("all");
              setFilterCategory("All");
              setFilterGenre("All");
              setSearchQuery("");
              setCurrentPage(1);
            }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <i className="fa-solid fa-clapperboard text-white text-sm sm:text-base"></i>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tighter text-white block">
              ONI<span className="text-indigo-400">SCENARY</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 mr-auto ml-8">
          <NavLinks />
        </nav>

        <div className={`flex-1 max-w-md ${showMobileSearch ? "absolute inset-x-0 top-0 h-16 px-4 bg-slate-900 z-50 flex items-center gap-2" : "hidden lg:block"}`}>
          <div className="relative group w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-xs"></i>
            <input
              type="text"
              placeholder="Tìm kiếm phim, anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/40 border border-slate-700/50 rounded-full py-2 pl-9 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              autoFocus={showMobileSearch}
            />
            {searchQuery && (
              <button aria-label="xs" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <i className="fa-solid fa-circle-xmark text-xs"></i>
              </button>
            )}
          </div>
          {showMobileSearch && (
            <button onClick={() => setShowMobileSearch(false)} className="text-slate-400 text-sm font-medium whitespace-nowrap">
              Hủy
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button aria-label="xs" onClick={() => setShowMobileSearch(true)} className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <Button
            onClick={() => {
              setSelectedItem(null);
              setIsModalOpen(true);
            }}
            className="rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-sm"
          >
            <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">Thêm</span>
          </Button>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-800 border-2 transition-all overflow-hidden ${isUserDropdownOpen ? "border-indigo-500 scale-105 sm:scale-110" : "border-white/10 hover:border-white/30"}`}
            >
              <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} alt="Avatar" className="w-full h-full object-cover" />
            </button>
            <div
              className={`absolute right-0 mt-3 w-48 sm:w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-200 z-50 overflow-hidden ${isUserDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
            >
              <div className="p-4 border-b border-white/5 bg-white/5">
                <p className="text-xs sm:text-sm font-bold text-white truncate">{user.username}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm text-slate-300 hover:bg-white/10 transition-colors text-left"
                >
                  <i className="fa-solid fa-user-gear"></i> Hồ sơ
                </button>
                <button
                  onClick={() => {
                    setViewMode("settings");
                    setIsUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm text-slate-300 hover:bg-white/10 transition-colors text-left"
                >
                  <i className="fa-solid fa-database"></i> Dữ liệu
                </button>
                <div className="h-px bg-white/5 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {viewMode === "settings" ? (
        <main className="px-4 max-w-4xl mx-auto py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 mb-4 shadow-xl">
              <i className="fa-solid fa-database text-2xl sm:text-3xl text-indigo-400"></i>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Dữ liệu JSON</h1>
            <p className="text-slate-500 mt-2 text-sm text-center">Quản lý kho lưu trữ thủ công của bạn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-slate-900/50 border border-white/5 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 hover:border-indigo-500/30 transition-all shadow-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <i className="fa-solid fa-download text-indigo-400 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Sao lưu</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8">Tải {items.length} mục về dưới dạng file .json</p>
              <Button variant="primary" onClick={exportDatabase} className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg">
                <i className="fa-solid fa-file-export"></i> Tải về ngay
              </Button>
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 hover:border-emerald-500/30 transition-all shadow-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <i className="fa-solid fa-upload text-emerald-400 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Khôi phục</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8">Cập nhật kho phim từ file .json có sẵn</p>
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
              >
                <i className="fa-solid fa-file-import"></i> Chọn file
              </Button>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Button variant="ghost" onClick={() => setViewMode("all")} className="rounded-xl px-6 sm:px-8 py-3">
              <i className="fa-solid fa-arrow-left"></i> Quay lại Home
            </Button>
          </div>
        </main>
      ) : (
        <div className="animate-in fade-in duration-700">
          {showHero && (
            <section className="px-4 sm:px-6 mt-4 sm:mt-8">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 p-5 sm:p-8 shadow-2xl min-h-[120px] sm:min-h-[140px] flex items-center">
                <div className="relative z-10">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tighter">
                    Welcome, <span className="text-indigo-400">Onis</span>
                  </h1>
                  <p className="text-slate-400 text-[10px] sm:text-xs mt-1 sm:mt-2 uppercase tracking-[0.2em] font-bold">{items.length} tác phẩm đã lưu</p>
                </div>
                <div className="absolute right-0 top-0 w-1/2 h-full hidden sm:block pointer-events-none">
                  <div className="absolute -right-10 -top-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-indigo-600/5 blur-[80px] rounded-full"></div>
                  <i className="fa-solid fa-clapperboard text-[100px] sm:text-[140px] text-white/[0.03] -rotate-12 absolute top-1/2 -translate-y-1/2 right-6 sm:right-10"></i>
                </div>
              </div>
            </section>
          )}

          <div className="px-4 sm:px-6 mt-6 sm:mt-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="w-1.5 h-5 sm:h-6 bg-indigo-500 rounded-full"></div>
                  {viewMode === "ranking" ? "Xếp hạng Rating" : viewMode === "history" ? "Mới thêm gần đây" : "Bộ sưu tập cá nhân"}
                </h2>
                {viewMode !== "all" && (
                  <button onClick={() => setViewMode("all")} className="text-[11px] sm:text-xs text-indigo-400 font-bold hover:underline">
                    Quay lại Home
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1 scroll-smooth snap-x">
                  <FilterChip category="All" label="Tất cả" icon="fa-solid fa-layer-group" />
                  <FilterChip category={MediaCategory.ANIME} label="Anime" icon="fa-solid fa-wand-sparkles" />
                  <FilterChip category={MediaCategory.LIVE_ACTION} label="Movie" icon="fa-solid fa-film" />
                  <FilterChip category={MediaCategory.MANGA} label="Manga" icon="fa-solid fa-book-open" />
                </div>

                {/* Phụ đề/Thể loại Movie (Horror, Sci-fi, Hero) */}
                {filterCategory === MediaCategory.LIVE_ACTION && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 animate-in slide-in-from-left-4 duration-300">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mr-2 shrink-0">Thể loại:</span>
                    <GenreChip genre="All" label="Tất cả" />
                    <GenreChip genre="Kinh dị" label="Kinh dị" />
                    <GenreChip genre="Viễn tưởng" label="Viễn tưởng" />
                    <GenreChip genre="Anh hùng" label="Anh hùng" />
                    <GenreChip genre="Hành động" label="Hành động" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <main className="px-4 sm:px-6 mt-4 sm:mt-6 min-h-[400px]">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 sm:py-32 bg-slate-900/30 rounded-[24px] sm:rounded-[32px] border border-dashed border-white/5 text-slate-500 text-center px-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-[20px] sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <i className="fa-solid fa-folder-open text-2xl sm:text-3xl opacity-20"></i>
                </div>
                <p className="text-base sm:text-lg font-medium text-slate-300">Không tìm thấy phim phù hợp...</p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6">
                  <Button
                    variant="primary"
                    className="rounded-xl px-5 sm:px-6 py-2 text-sm"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedItem(null);
                    }}
                  >
                    Thêm phim mới
                  </Button>
                  {(filterCategory !== "All" || filterGenre !== "All") && (
                    <Button
                      variant="ghost"
                      className="rounded-xl px-5 sm:px-6 py-2 text-sm"
                      onClick={() => {
                        setFilterCategory("All");
                        setFilterGenre("All");
                      }}
                    >
                      Hiện tất cả
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  {pagedItems.map((item, index) => (
                    <MovieCard
                      key={item.id}
                      item={item}
                      rank={viewMode === "ranking" ? (currentPage - 1) * ITEMS_PER_PAGE + index + 1 : undefined}
                      onClick={(item) => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      onPlay={handlePlayVideo}
                    />
                  ))}
                </div>
                <Pagination />
              </>
            )}
          </main>
        </div>
      )}

      {/* Fab Button for Mobile */}
      <button
        aria-label="xs"
        onClick={() => {
          setSelectedItem(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center text-white text-2xl z-40 sm:hidden border border-white/20 active:scale-90 transition-transform"
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      <AddMediaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        editingItem={selectedItem}
        allItems={items}
      />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} onSave={handleSaveProfile} />

      {/* Video Player Modal */}
      <VideoPlayerModal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} videoUrl={activeVideo?.url || ""} title={activeVideo?.title || ""} />

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default App;
