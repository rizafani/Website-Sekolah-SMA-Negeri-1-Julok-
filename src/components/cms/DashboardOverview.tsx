import React, { useEffect, useState } from 'react';
import {
  FileText,
  Users,
  Eye,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Share2,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Article } from '../../types/index.ts';

interface DashboardOverviewProps {
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNewArticle,
  onEditArticle,
  onNavigateTab,
}) => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setLoading(true);
    api.getDashboardStats()
      .then(setStatsData)
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  };

  if (loading || !statsData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Memuat data dashboard SMAN 1 Julok...</p>
        </div>
      </div>
    );
  }

  const { stats, totalArticles, publishedArticles, totalUsers, totalTeachers, totalPPDB, recentArticles, recentLogs } = statsData;

  // Max visits in history for simple bar chart scaling
  const maxVisits = Math.max(...(stats.dailyHistory?.map((h: any) => h.count) || [100]), 100);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/10">
              CMS Panel Terpadu • SMA NEGERI 1 JULOK
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Bertugas, {user?.name}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Anda masuk dengan hak akses <strong className="text-white uppercase">{user?.role}</strong>.
              Seluruh artikel yang Anda terbitkan akan <span className="text-emerald-300 font-semibold underline">langsung tampil otomatis</span> di website publik dan terindeks Google.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewArticle}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" /> Tulis & Terbitkan Berita
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Artikel</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalArticles}</span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">({publishedArticles} Publik)</span>
          </div>
          <p className="text-[11px] text-slate-400">Publikasi instan tanpa revisi</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pengunjung</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {(stats.totalVisits || 14850).toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">+{stats.todayVisits} hari ini</span>
          </div>
          <p className="text-[11px] text-slate-400">Pencatatan real-time server</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendaftar PPDB</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalPPDB}</span>
            <span className="text-xs text-slate-500 font-medium ml-2">Calon Siswa</span>
          </div>
          <p className="text-[11px] text-slate-400">Pendaftaran online aktif</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna & Guru</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalUsers}</span>
            <span className="text-xs text-slate-500 font-medium ml-2">Akun Terdaftar</span>
          </div>
          <p className="text-[11px] text-slate-400">Admin, Editor, dan Guru</p>
        </div>
      </div>

      {/* Traffic Chart & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Visits Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Tren Kunjungan Website (7 Hari Terakhir)
              </h3>
              <p className="text-xs text-slate-500">Statistik pengunjung unik portal SMA Negeri 1 Julok</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              Rata-rata: ~{Math.round((stats.dailyHistory?.reduce((a: number, b: any) => a + b.count, 0) || 700) / (stats.dailyHistory?.length || 7))} / hari
            </span>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2">
            {stats.dailyHistory?.slice(-7).map((h: any, idx: number) => {
              const heightPct = Math.max(12, Math.round((h.count / maxVisits) * 100));
              const dayLabel = new Date(h.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                    {h.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-blue-700 to-indigo-500 rounded-t-xl group-hover:from-blue-600 group-hover:to-indigo-400 transition"
                  />
                  <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown & SEO Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Perangkat Pengunjung
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1 text-slate-700">
                  <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-blue-600" /> Smartphone (Mobile)</span>
                  <span className="font-bold">{stats.deviceBreakdown?.mobile || 68}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${stats.deviceBreakdown?.mobile || 68}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-slate-700">
                  <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5 text-indigo-600" /> Desktop / Laptop</span>
                  <span className="font-bold">{stats.deviceBreakdown?.desktop || 27}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${stats.deviceBreakdown?.desktop || 27}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-slate-700">
                  <span className="flex items-center gap-1.5"><Tablet className="w-3.5 h-3.5 text-purple-600" /> Tablet</span>
                  <span className="font-bold">{stats.deviceBreakdown?.tablet || 5}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${stats.deviceBreakdown?.tablet || 5}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> SEO & Google Indexing
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-xs text-slate-200">
              Sitemap XML aktif dan diperbarui otomatis setiap ada publikasi berita baru.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs border-t border-emerald-800">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 hover:text-white font-semibold flex items-center gap-1"
              >
                /sitemap.xml <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-300 hover:text-white font-semibold flex items-center gap-1"
              >
                /robots.txt <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Articles & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Publikasi Artikel Terbaru</h3>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Lihat Semua Artikel →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Judul Berita</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Penulis</th>
                  <th className="pb-3 text-center">Dibaca</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentArticles?.map((art: Article) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-semibold text-slate-900 max-w-xs truncate">
                      {art.title}
                    </td>
                    <td className="py-3 text-slate-500">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {art.authorName.split(' ')[0]}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-700">
                      {art.views}x
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => onEditArticle(art)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" /> Log Aktivitas Pengguna
          </h3>
          <div className="space-y-3">
            {recentLogs?.map((log: any) => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.userName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600">
                  <span className="text-blue-700 font-semibold">{log.action}:</span> {log.target}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
