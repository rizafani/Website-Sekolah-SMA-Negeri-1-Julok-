import React, { useState, useEffect } from 'react';
import { Image, Video, Play, X, ExternalLink, Calendar } from 'lucide-react';
import { api } from '../../services/api.ts';
import { GalleryItem } from '../../types/index.ts';

export const GalleryPage: React.FC<{ initialType?: 'photo' | 'video' }> = ({ initialType = 'photo' }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>(initialType);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGallery().then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Dokumentasi Sekolah</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Galeri Foto & Video Kegiatan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Dokumentasi visual rangkaian kegiatan upacara, praktikum laboratorium, pentas seni P5, dan perlombaan SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterType === 'all' ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Dokumentasi
        </button>
        <button
          onClick={() => setFilterType('photo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterType === 'photo' ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" /> Galeri Foto
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterType === 'video' ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Video Dokumentasi
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat galeri kegiatan...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-sm">
                    {item.category}
                  </span>

                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="uppercase font-bold text-blue-800">
                  {item.type === 'video' ? 'Tonton Video' : 'Perbesar Foto'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl text-white">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-white hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-2 sm:p-4">
              {selectedItem.type === 'video' ? (
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black">
                  <iframe
                    src={selectedItem.url}
                    title={selectedItem.title}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
                  <img src={selectedItem.url} alt={selectedItem.title} className="max-h-[75vh] w-auto object-contain" />
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-1">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                {selectedItem.category} • {new Date(selectedItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-xs text-slate-400 leading-relaxed">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
