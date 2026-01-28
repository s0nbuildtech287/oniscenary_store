
import React, { useEffect, useState } from 'react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ isOpen, onClose, videoUrl, title }) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');

  useEffect(() => {
    if (isOpen && videoUrl) {
      const id = extractVideoId(videoUrl);
      setVideoId(id);
      if (id) {
        // Sử dụng youtube-nocookie.com và thêm mute=1 để autoplay hoạt động ổn định, tránh lỗi 153
        setEmbedUrl(`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0`);
      } else {
        setEmbedUrl(videoUrl);
      }
    } else {
      setEmbedUrl('');
      setVideoId('');
    }
  }, [isOpen, videoUrl]);

  function extractVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl sm:rounded-3xl overflow-hidden border border-white/10 group">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/60 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-all flex items-center justify-center border border-white/10 opacity-100"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Tiêu đề & Nút mở ngoài */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <h2 className="text-white font-bold text-lg sm:text-xl truncate pr-16">{title}</h2>
           <div className="flex items-center gap-3 mt-2 pointer-events-auto">
              <span className="px-2 py-0.5 bg-sky-500 text-[10px] font-black rounded text-white uppercase">Official Trailer</span>
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"
              >
                <i className="fa-brands fa-youtube text-rose-500"></i>
                Mở trực tiếp YouTube
              </a>
           </div>
        </div>

        {videoId ? (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full border-none shadow-inner"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-6 px-10 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-white/5">
                <i className="fa-solid fa-link-slash text-3xl text-slate-600"></i>
            </div>
            <div>
                <p className="text-lg font-bold text-white">Không thể nhúng video này</p>
                <p className="text-sm mt-1">Định dạng URL không được hỗ trợ hoặc link bị lỗi.</p>
            </div>
            <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
            >
                <i className="fa-brands fa-youtube"></i> Xem trực tiếp trên YouTube
            </a>
          </div>
        )}

        {/* Mẹo nhỏ phía dưới khi mới mở */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-[10px] sm:text-xs pointer-events-none animate-pulse">
           Bấm để bật tiếng nếu video bị tắt âm tự động
        </div>
      </div>
      
      {/* Click ra ngoài để đóng */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default VideoPlayerModal;
