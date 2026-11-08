import React, { useState, useEffect } from 'react';
import { Building, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Facility } from '../../types/index.ts';

export const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFacilities().then(setFacilities).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Sarana & Prasarana</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Fasilitas Unggulan SMA Negeri 1 Julok
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Sarana pembelajaran modern dan representatif untuk mendukung kenyamanan belajar, riset ilmiah, dan kegiatan keagamaan siswa.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat data fasilitas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-sm shadow">
                    {fac.category}
                  </span>
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-800 transition">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Standar Nasional Pendidikan (SNP)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
