
import React from 'react';
import { MediaItem, MediaStatus } from '../types';

interface MovieCardProps {
  item: MediaItem;
  rank?: number;
  onClick: (item: MediaItem) => void;
  onPlay?: (url: string, title: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, rank, onClick, onPlay }) => {
  const getStatusColor = (status: MediaStatus) => {
    switch (status) {
      case MediaStatus.COMPLETED: return 'bg-emerald-500';
      case MediaStatus.WATCHING: return 'bg-sky-500';
      case MediaStatus.PLAN_TO_WATCH: return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện onClick của card cha
    if (onPlay && item.movieUrl) {
      onPlay(item.movieUrl, item.title);
    } else if (item.movieUrl) {
      window.open(item.movieUrl, '_blank');
    }
  };

  const getRankBadgeClass = (r: number) => {
    if (r === 1) return 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-950 scale-110 shadow-yellow-500/40';
    if (r === 2) return 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 scale-105';
    if (r === 3) return 'bg-gradient-to-br from-orange-400 to-orange-700 text-white scale-105';
    return 'bg-slate-800/90 text-white backdrop-blur-md border border-white/10';
  };

  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative bg-slate-900 border border-white/5 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-[0.98] flex flex-col h-full"
    >
      <div className="aspect-[2/3] overflow-hidden relative shrink-0">
        <img 
          src={item.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${item.title}`} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
        
        {rank !== undefined && (
          <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-2xl z-20 ${getRankBadgeClass(rank)}`}>
            {rank === 1 ? <i className="fa-solid fa-crown text-[10px]"></i> : rank}
          </div>
        )}

        {item.topOrder && rank === undefined && (
          <div className="absolute top-0 left-0 bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-br-xl shadow-xl z-10 text-[10px] sm:text-xs flex items-center gap-0.5 border-b border-r border-amber-300/30">
            <span className="text-[8px] sm:text-[10px] opacity-70">TOP</span>{item.topOrder}
          </div>
        )}

        <div className="absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1 border border-white/10 z-10">
          <i className="fa-solid fa-star text-yellow-400 text-[9px] sm:text-[10px]"></i>
          <span className="text-[10px] sm:text-[11px] font-bold text-white">{item.rating}</span>
        </div>

        <div className={`absolute bottom-2 left-2 px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white shadow-lg z-10 ${getStatusColor(item.status)}`}>
          {item.status}
        </div>
      </div>
      
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 className="text-[11px] sm:text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-[8px] sm:text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
            {item.category}
          </p>
        </div>

        {item.movieUrl && (
          <button 
            onClick={handleLinkClick}
            className="w-full bg-sky-600/10 hover:bg-sky-600 text-sky-500 hover:text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 border border-sky-500/40 group/btn active:scale-95 shadow-sm uppercase tracking-wider"
          >
            <i className="fa-brands fa-youtube text-[12px] sm:text-[14px]"></i>
            Trailer
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
