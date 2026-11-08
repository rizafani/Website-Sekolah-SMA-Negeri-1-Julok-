import React, { useState, useEffect } from 'react';
import { Users, Search, GraduationCap, Award, BookOpen, Mail } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Teacher } from '../../types/index.ts';

export const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeachers().then(setTeachers).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.nip.includes(q);
    if (!matchSearch) return false;
    if (filterSubject === 'Pimpinan' && !t.role.toLowerCase().includes('kepala')) return false;
    if (filterSubject === 'MIPA' && !['fisika', 'kimia', 'matematika', 'biologi', 'ipa'].some((s) => t.subject.toLowerCase().includes(s))) return false;
    if (filterSubject === 'Bahasa' && !['bahasa', 'indonesia', 'inggris'].some((s) => t.subject.toLowerCase().includes(s))) return false;
    if (filterSubject === 'TIK' && !['informatika', 'tik', 'komputer'].some((s) => t.subject.toLowerCase().includes(s))) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Civitas Akademika</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Data Guru & Tenaga Kependidikan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Tenaga pendidik profesional dan berdedikasi tinggi di SMA Negeri 1 Julok yang mengantarkan generasi muda meraih prestasi.
        </p>
      </div>

      {/* Filter and search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari guru berdasarkan nama, NIP, atau mata pelajaran..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-2">
          {['Semua', 'Pimpinan', 'MIPA', 'Bahasa', 'TIK'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterSubject(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterSubject === f ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of teachers */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat data guru...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-sm">
                    {t.role}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{t.name}</h3>
                  <p className="text-[11px] font-mono text-slate-400">NIP: {t.nip}</p>
                  <p className="text-xs font-semibold text-blue-800">{t.subject}</p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{t.education}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
