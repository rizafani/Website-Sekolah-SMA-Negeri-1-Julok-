import React, { useState, useEffect } from 'react';
import { Award, Trophy, Sparkles, Calendar, Tag } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Achievement } from '../../types/index.ts';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAchievements().then(setAchievements).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-amber-600">Prestasi Gemilang</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Prestasi & Penghargaan Siswa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Bukti nyata dedikasi dan daya saing putra-putri SMA Negeri 1 Julok di ajang sains, keagamaan, seni budaya, dan olahraga.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat data prestasi...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={ach.image}
                    alt={ach.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow">
                    {ach.level} • {ach.year}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                    {ach.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition">
                    {ach.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    Oleh: <strong className="text-slate-900">{ach.studentName}</strong>
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> Juara Resmi BPTI/Disdik
                </span>
                <span className="font-mono font-bold text-slate-700">{ach.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
