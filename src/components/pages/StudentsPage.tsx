import React from 'react';
import { Users, GraduationCap, Award, PieChart, CheckCircle2, UserCheck } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Statistik Peserta Didik</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Data & Statistik Siswa SMAN 1 Julok
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Tahun Pelajaran 2025/2026. Data persebaran rombongan belajar, rasio gender, dan kepengurusan organisasi siswa.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-blue-950">748</span>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Siswa Aktif</p>
          <span className="text-[11px] text-emerald-600 font-semibold block">100% Terdaftar Dapodik</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-blue-900">24</span>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rombongan Belajar</p>
          <span className="text-[11px] text-blue-600 font-semibold block">8 Kelas per Angkatan</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-sky-600">342</span>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa Laki-Laki</p>
          <span className="text-[11px] text-slate-400 font-semibold block">45.7% Rasio</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-pink-600">406</span>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa Perempuan</p>
          <span className="text-[11px] text-slate-400 font-semibold block">54.3% Rasio</span>
        </div>
      </div>

      {/* Class distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Kelas X (Fase E)</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">260 Siswa</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span>Jumlah Rombel:</span>
              <strong className="text-slate-900">8 Rombel (X-1 s/d X-8)</strong>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span>Kurikulum:</span>
              <strong className="text-emerald-700">Kurikulum Merdeka</strong>
            </li>
            <li className="flex justify-between py-1">
              <span>Projek P5 Berjalan:</span>
              <strong className="text-slate-900">3 Tema Utama</strong>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Kelas XI (Fase F)</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">248 Siswa</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span>Jumlah Rombel:</span>
              <strong className="text-slate-900">8 Rombel (XI-1 s/d XI-8)</strong>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span>Fokus Peminatan:</span>
              <strong className="text-slate-900">MIPA & Soshum Fleksibel</strong>
            </li>
            <li className="flex justify-between py-1">
              <span>Bimbingan Olimpiade:</span>
              <strong className="text-emerald-700">9 Cabang OSN</strong>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Kelas XII (Fase F Lanjutan)</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">240 Siswa</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span>Jumlah Rombel:</span>
              <strong className="text-slate-900">8 Rombel (XII MIPA & IPS)</strong>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span>Program Intensif:</span>
              <strong className="text-blue-700">Sukses UTBK-SNBT 2026</strong>
            </li>
            <li className="flex justify-between py-1">
              <span>Target Kelulusan:</span>
              <strong className="text-emerald-700">100% Lulus Kompeten</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
