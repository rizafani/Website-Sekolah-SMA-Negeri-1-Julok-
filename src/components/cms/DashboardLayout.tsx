import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  Users,
  Image,
  Calendar,
  Bell,
  Settings,
  Search,
  Globe,
  Database,
  GraduationCap,
  LogOut,
  ArrowLeft,
  UserCheck,
  ShieldAlert,
  FolderTree,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onBackToWebsite: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onBackToWebsite,
  children,
}) => {
  const { user, logout, quickSwitchUser } = useAuth();

  if (!user) return null;

  // Role badges
  const roleBadges: Record<UserRole, { label: string; bg: string; color: string }> = {
    admin: { label: 'Administrator', bg: 'bg-red-500/10 text-red-400 border-red-500/20', color: 'text-red-400' },
    editor: { label: 'Editor Konten', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', color: 'text-blue-400' },
    guru: { label: 'Guru & Pembina', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', color: 'text-emerald-400' },
  };

  const currentBadge = roleBadges[user.role] || roleBadges.guru;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Brand header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 ring-2 ring-amber-400 p-1.5 flex items-center justify-center text-white">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                <polygon points="50,5 92,25 92,75 50,95 8,75 8,25" fill="#1e3a8a" stroke="#f59e0b" strokeWidth="4" />
                <path d="M50 15 L78 30 L50 45 L22 30 Z" fill="#f59e0b" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">SMAN 1 JULOK</h2>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">CMS PORTAL</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${currentBadge.bg}`}>
                  {currentBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Role Switcher for instant testing */}
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
              Simulasi Uji Coba Akun:
            </label>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
              <button
                onClick={() => quickSwitchUser('admin', 'admin123')}
                className={`py-1 px-1.5 rounded transition truncate ${user.username === 'admin' ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                title="Login sebagai Admin (admin123)"
              >
                Admin
              </button>
              <button
                onClick={() => quickSwitchUser('editor', 'editor123')}
                className={`py-1 px-1.5 rounded transition truncate ${user.username === 'editor' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                title="Login sebagai Editor (editor123)"
              >
                Editor
              </button>
              <button
                onClick={() => quickSwitchUser('guru', 'guru123')}
                className={`py-1 px-1.5 rounded transition truncate ${user.username === 'guru' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                title="Login sebagai Guru (guru123)"
              >
                Guru
              </button>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-medium">
          <button
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
              currentTab === 'overview' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" /> Ringkasan Dashboard
          </button>

          <button
            onClick={() => onSelectTab('new-article')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
              currentTab === 'new-article' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" /> Tulis Berita Baru (Instan)
          </button>

          <button
            onClick={() => onSelectTab('articles')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
              currentTab === 'articles' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>{user.role === 'guru' ? 'Artikel Milik Saya' : 'Kelola Semua Artikel'}</span>
          </button>

          {/* Editor & Admin permissions */}
          {(user.role === 'admin' || user.role === 'editor') && (
            <>
              <div className="pt-2 pb-1 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pengelolaan Konten
              </div>

              <button
                onClick={() => onSelectTab('media')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'media' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Image className="w-4 h-4 text-indigo-400" /> Media Library & WebP
              </button>

              <button
                onClick={() => onSelectTab('announcements')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'announcements' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-400" /> Pengumuman Resmi
              </button>

              <button
                onClick={() => onSelectTab('agenda')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'agenda' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 text-sky-400" /> Agenda & Kalender
              </button>

              <button
                onClick={() => onSelectTab('ppdb')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'ppdb' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" /> Data Pendaftar PPDB
              </button>

              <button
                onClick={() => onSelectTab('pages')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'pages' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FolderTree className="w-4 h-4 text-teal-400" /> Halaman Statis Sekolah
              </button>
            </>
          )}

          {/* Admin exclusive permissions */}
          {user.role === 'admin' && (
            <>
              <div className="pt-2 pb-1 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Sistem & Pengaturan
              </div>

              <button
                onClick={() => onSelectTab('users')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'users' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-purple-400" /> Manajemen Akun Pengguna
              </button>

              <button
                onClick={() => onSelectTab('seo')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'seo' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400" /> SEO Global & Sitelinks
              </button>

              <button
                onClick={() => onSelectTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'settings' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" /> Identitas & Info Sekolah
              </button>

              <button
                onClick={() => onSelectTab('backup')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                  currentTab === 'backup' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 text-orange-400" /> Backup & Restore Database
              </button>
            </>
          )}

          <div className="pt-2 pb-1 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Akun & Akses
          </div>

          <button
            onClick={() => onSelectTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
              currentTab === 'profile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-blue-400" /> Profil Pengguna Saya
          </button>
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Lihat Website Publik
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar Sistem (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
};
