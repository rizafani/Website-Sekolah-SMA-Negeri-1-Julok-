import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Send,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Article } from '../../types/index.ts';

interface SocialShareModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ article, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'facebook' | 'twitter'>('whatsapp');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://sman1julok.sch.id';
  const articleUrl = `${currentOrigin}/berita/${article.slug}`;
  const shareTitle = article.seoTitle || article.title;
  const shareDesc = article.metaDescription || article.excerpt;
  const shareImg = article.ogImage || article.featuredImage;

  const handleCopy = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openWhatsApp = () => {
    const text = `*${shareTitle}*\n\n${shareDesc}\n\nBaca selengkapnya di portal resmi SMA Negeri 1 Julok:\n${articleUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const openTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const openTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-bold text-slate-800">Bagikan Berita & Preview Open Graph</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Share Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Pilih Media Sosial
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              <button
                onClick={openFacebook}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </button>
              <button
                onClick={openTelegram}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-sm transition"
              >
                <Send className="w-4 h-4" /> Telegram
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-xs transition border ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Tersalin!' : 'Salin Tautan'}
              </button>
            </div>
          </div>

          {/* Tab preview selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Simulasi Tampilan Media Sosial (OG Meta)
              </label>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className={`px-2.5 py-1 rounded-md transition ${activeTab === 'whatsapp' ? 'bg-white shadow text-emerald-700 font-bold' : 'hover:text-slate-900'}`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setActiveTab('facebook')}
                  className={`px-2.5 py-1 rounded-md transition ${activeTab === 'facebook' ? 'bg-white shadow text-blue-700 font-bold' : 'hover:text-slate-900'}`}
                >
                  Facebook
                </button>
                <button
                  onClick={() => setActiveTab('twitter')}
                  className={`px-2.5 py-1 rounded-md transition ${activeTab === 'twitter' ? 'bg-white shadow text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                >
                  X / Twitter
                </button>
              </div>
            </div>

            {/* PREVIEW: WhatsApp */}
            {activeTab === 'whatsapp' && (
              <div className="bg-[#e5ddd5] p-4 rounded-xl border border-slate-200">
                <div className="bg-white rounded-lg shadow-md max-w-sm ml-auto overflow-hidden text-xs border-r-4 border-emerald-500">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200">
                    <img src={shareImg} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <p className="font-bold text-slate-900 text-sm line-clamp-2">{shareTitle}</p>
                    <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">{shareDesc}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">sman1julok.sch.id</span>
                  </div>
                  <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between">
                    <span className="text-emerald-700 font-medium text-[11px] truncate">{articleUrl}</span>
                    <span className="text-[10px] text-slate-400">12:30 ✓✓</span>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: Facebook */}
            {activeTab === 'facebook' && (
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-md mx-auto border border-slate-200">
                  <div className="p-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold">
                      SMAN
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">SMA Negeri 1 Julok</span>
                      <span className="text-[10px] text-slate-400">Baru saja • 🌐 Publik</span>
                    </div>
                  </div>
                  <p className="px-3 pb-2 text-xs text-slate-700">{shareDesc}</p>
                  <div className="aspect-[1.91/1] w-full bg-slate-200">
                    <img src={shareImg} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">SMAN1JULOK.SCH.ID</span>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-2 mt-0.5">{shareTitle}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{shareDesc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: Twitter / X */}
            {activeTab === 'twitter' && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-white">
                <div className="rounded-2xl border border-slate-800 overflow-hidden max-w-md mx-auto bg-slate-900">
                  <div className="aspect-[16/9] w-full bg-slate-800">
                    <img src={shareImg} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] text-slate-400">sman1julok.sch.id</span>
                    <p className="font-bold text-xs text-white line-clamp-2 mt-0.5">{shareTitle}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{shareDesc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Canonical link input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              URL Permanen (Canonical Link):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={articleUrl}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 select-all"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition shrink-0"
              >
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
