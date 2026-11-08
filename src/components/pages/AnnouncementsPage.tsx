import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Calendar, FileText, Download, User } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Announcement } from '../../types/index.ts';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnouncements().then(setAnnouncements).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Warta Resmi</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Pengumuman Resmi Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Pemberitahuan resmi kedinasan, jadwal ujian, edaran libur, dan informasi akademik SMA Negeri 1 Julok.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat pengumuman...</div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm space-y-3 transition ${
                ann.isUrgent ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {ann.isUrgent && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" /> Pengumuman Penting
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(ann.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Oleh: <strong className="text-slate-800">{ann.authorName}</strong>
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ann.content}</p>

              {ann.fileName && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> {ann.fileName}
                  </span>
                  <a
                    href={ann.fileUrl || '#'}
                    download
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
