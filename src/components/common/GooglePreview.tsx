import React from 'react';
import { Search, Globe, CheckCircle2 } from 'lucide-react';

interface GooglePreviewProps {
  title: string;
  url: string;
  description: string;
  isArticle?: boolean;
  publishedDate?: string;
  showSitelinks?: boolean;
}

export const GooglePreview: React.FC<GooglePreviewProps> = ({
  title,
  url,
  description,
  isArticle = false,
  publishedDate,
  showSitelinks = false,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Search className="w-4 h-4 text-blue-600" />
          <span>Simulasi Hasil Pencarian Google (SERP Preview)</span>
        </div>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> SEO Optimized
        </span>
      </div>

      <div className="font-sans max-w-2xl text-left space-y-1">
        {/* URL / Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
            🌐
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-900 leading-none">SMA Negeri 1 Julok</span>
            <span className="text-[11px] text-slate-500 font-mono leading-tight">{url}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base sm:text-lg font-semibold text-blue-800 hover:underline cursor-pointer leading-snug">
          {title}
        </h4>

        {/* Snippet / Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {publishedDate && (
            <span className="text-slate-400 font-medium mr-1.5">
              {new Date(publishedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} —
            </span>
          )}
          {description}
        </p>

        {/* Google Sitelinks Simulation if applicable */}
        {showSitelinks && (
          <div className="pt-3 mt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-2 rounded bg-slate-50 hover:bg-slate-100 transition">
              <span className="text-xs font-bold text-blue-800 block">Beranda</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Portal resmi informasi sekolah SMAN 1 Julok</span>
            </div>
            <div className="p-2 rounded bg-slate-50 hover:bg-slate-100 transition">
              <span className="text-xs font-bold text-blue-800 block">Profil Sekolah</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Visi, misi, sejarah, & akreditasi A unggul</span>
            </div>
            <div className="p-2 rounded bg-slate-50 hover:bg-slate-100 transition">
              <span className="text-xs font-bold text-blue-800 block">Berita Terkini</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Publikasi prestasi siswa dan kegiatan</span>
            </div>
            <div className="p-2 rounded bg-slate-50 hover:bg-slate-100 transition">
              <span className="text-xs font-bold text-blue-800 block">Akademik</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Kurikulum Merdeka, data guru, & fasilitas</span>
            </div>
            <div className="p-2 rounded bg-slate-50 hover:bg-slate-100 transition">
              <span className="text-xs font-bold text-blue-800 block">Galeri Kegiatan</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Dokumentasi foto dan video pentas seni</span>
            </div>
            <div className="p-2 rounded bg-slate-50 hover:bg-slate-100 transition">
              <span className="text-xs font-bold text-blue-800 block">Kontak & Lokasi</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Alamat Jl. Medan-Banda Aceh Km. 368</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
