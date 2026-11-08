import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ArrowUp } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleSend = () => {
    const text = message.trim() || 'Halo Admin SMAN 1 Julok, saya ingin bertanya seputar informasi sekolah / PPDB.';
    window.open(`https://api.whatsapp.com/send?phone=6282277889900&text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to Top floating button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Kembali ke Atas"
          className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating WhatsApp Container */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {isOpen && (
          <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  WA
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-none">Hotline SMAN 1 Julok</h4>
                  <span className="text-[10px] text-emerald-100 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                    Online • Respon Cepat
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Bubble Simulation */}
            <div className="p-4 bg-[#e5ddd5] space-y-3 text-xs">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] text-slate-800 space-y-1">
                <p className="font-semibold text-emerald-800 text-[11px]">Humas SMA Negeri 1 Julok</p>
                <p className="leading-relaxed">
                  Assalamu'alaikum! Ada yang bisa kami bantu terkait pendaftaran PPDB 2026/2027 atau informasi sekolah?
                </p>
                <span className="text-[9px] text-slate-400 block text-right">08:00</span>
              </div>
            </div>

            {/* Input & Send */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tulis pesan pertanyaan..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Bubble Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition transform hover:scale-110 flex items-center gap-2 group"
          title="Chat WhatsApp Resmi"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs">
            Hubungi Sekolah
          </span>
        </button>
      </div>
    </>
  );
};
