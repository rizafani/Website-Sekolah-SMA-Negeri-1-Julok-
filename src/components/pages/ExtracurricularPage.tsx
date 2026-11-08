import React, { useState, useEffect } from 'react';
import { Compass, Users, Clock, Award } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Extracurricular } from '../../types/index.ts';

export const ExtracurricularPage: React.FC = () => {
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExtracurriculars().then(setExtracurriculars).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Pengembangan Minat & Bakat</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Ekstrakurikuler & Organisasi Siswa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Wadah ekspresi, kepemimpinan, dan kreativitas siswa di bidang kepramukaan, keagamaan, sains, seni budaya, dan olahraga.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat data ekstrakurikuler...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extracurriculars.map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={ex.image}
                    alt={ex.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ex.description}
                  </p>

                  <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Pembina: <strong className="text-slate-800">{ex.coach}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{ex.schedule}</span>
                    </p>
                  </div>
                </div>
              </div>

              {ex.achievements && (
                <div className="px-6 pb-6 pt-2">
                  <span className="block p-2.5 rounded-xl bg-amber-50 text-amber-900 text-[11px] font-semibold border border-amber-200">
                    🏆 {ex.achievements}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
