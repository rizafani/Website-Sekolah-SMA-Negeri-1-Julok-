import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { AgendaItem } from '../../types/index.ts';

export const AgendaPage: React.FC = () => {
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAgenda().then(setAgendas).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Kalender Akademik</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Agenda & Kalender Kegiatan Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Jadwal pelaksanaan ujian, perlombaan porseni, kegiatan pesantren kilat, dan rapat pleno komite SMA Negeri 1 Julok.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat agenda kegiatan...</div>
      ) : (
        <div className="space-y-4">
          {agendas.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-blue-300 transition"
            >
              {/* Date Box */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                <span className="text-2xl font-black leading-none">
                  {new Date(item.date).getDate()}
                </span>
                <span className="text-xs font-bold uppercase text-amber-300 mt-1">
                  {new Date(item.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-2 flex-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold">
                  {item.organizer}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> {item.time}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
