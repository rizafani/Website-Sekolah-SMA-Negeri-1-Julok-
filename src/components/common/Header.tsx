import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Search,
  User,
  LogIn,
  LogOut,
  GraduationCap,
  Calendar,
  Bell,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleNavClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Bar / Emergency & Contact strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> NPSN: 10102146 • AKREDITASI A (UNGGUL)
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-white transition">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Julok, Aceh Timur
            </span>
            <a
              href="tel:06467001234"
              className="hidden lg:inline-flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" /> (0646) 7001234
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=6282277889900&text=Halo%20Admin%20SMAN%201%20Julok"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WA: +62 822-7788-9900
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-300">
                  Hai, <strong className="text-white">{user.name.split(' ')[0]}</strong>
                  <span className="ml-1.5 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-blue-600 text-white">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1 text-slate-400 hover:text-red-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-blue-700 text-slate-200 hover:text-white rounded border border-slate-700 hover:border-blue-500 transition text-xs font-semibold"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" /> Login CMS (Admin / Editor / Guru)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & School Name */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* School Emblem Badge */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-2 shadow-md flex items-center justify-center text-white ring-2 ring-amber-400/80 group-hover:scale-105 transition duration-300">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white">
                <polygon points="50,5 92,25 92,75 50,95 8,75 8,25" fill="#1e3a8a" stroke="#f59e0b" strokeWidth="4" />
                <path d="M50 15 L78 30 L50 45 L22 30 Z" fill="#f59e0b" />
                <polygon points="50,35 70,47 50,60 30,47" fill="#ffffff" />
                <circle cx="50" cy="50" r="12" fill="#ef4444" />
                <polygon points="50,42 53,48 60,48 55,52 57,58 50,54 43,58 45,52 40,48 47,48" fill="#fbbf24" />
                <path d="M30 65 Q50 78 70 65" stroke="#fbbf24" strokeWidth="3" fill="none" />
                <rect x="47" y="60" width="6" height="20" fill="#f59e0b" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-extrabold text-blue-950 tracking-tight leading-none group-hover:text-blue-800 transition">
                  SMA NEGERI 1 JULOK
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 hidden sm:block">
                Unggul dalam Prestasi, Berkarakter, Berakhlak Mulia & Berwawasan Lingkungan
              </p>
              <p className="text-[11px] text-amber-700 font-semibold sm:hidden">
                Aceh Timur • Sekolah Penggerak
              </p>
            </div>
          </div>

          {/* Quick Actions (Desktop Search, PPDB, Mobile Hamburger) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition border border-slate-200"
              title="Cari artikel, agenda, atau info sekolah..."
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavClick('ppdb')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4" /> PPDB 2026/2027
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Desktop Navbar */}
      <nav className="hidden lg:block bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-3 font-semibold transition flex items-center gap-1 border-b-2 ${
                currentView === 'home'
                  ? 'border-amber-400 text-amber-300 bg-white/5'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Beranda
            </button>

            {/* Dropdown: PROFIL */}
            <div className="relative group">
              <button
                className={`px-4 py-3 font-semibold transition flex items-center gap-1 border-b-2 ${
                  ['profil', 'sejarah', 'visimisi', 'sambutan', 'struktur', 'fasilitas'].includes(currentView)
                    ? 'border-amber-400 text-amber-300 bg-white/5'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Profil Sekolah <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition duration-200" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => handleNavClick('sambutan')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-between"
                >
                  Sambutan Kepala Sekolah
                </button>
                <button
                  onClick={() => handleNavClick('profil')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-between"
                >
                  Profil & Identitas Sekolah
                </button>
                <button
                  onClick={() => handleNavClick('visimisi')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-between"
                >
                  Visi, Misi & Tujuan
                </button>
                <button
                  onClick={() => handleNavClick('sejarah')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-between"
                >
                  Sejarah Sekolah
                </button>
                <button
                  onClick={() => handleNavClick('struktur')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-between"
                >
                  Struktur Organisasi
                </button>
                <button
                  onClick={() => handleNavClick('fasilitas')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-between"
                >
                  Fasilitas & Sarpras
                </button>
              </div>
            </div>

            {/* Dropdown: AKADEMIK */}
            <div className="relative group">
              <button
                className={`px-4 py-3 font-semibold transition flex items-center gap-1 border-b-2 ${
                  ['kurikulum', 'program', 'guru', 'siswa'].includes(currentView)
                    ? 'border-amber-400 text-amber-300 bg-white/5'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Akademik <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition duration-200" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-100 py-2 z-50">
                <button
                  onClick={() => handleNavClick('kurikulum')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Kurikulum Merdeka & P5
                </button>
                <button
                  onClick={() => handleNavClick('program')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Program Unggulan Sekolah
                </button>
                <button
                  onClick={() => handleNavClick('guru')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Data Guru & Tenaga Pendidik
                </button>
                <button
                  onClick={() => handleNavClick('siswa')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Data Siswa & Statistik
                </button>
              </div>
            </div>

            {/* Dropdown: KESISWAAN */}
            <div className="relative group">
              <button
                className={`px-4 py-3 font-semibold transition flex items-center gap-1 border-b-2 ${
                  ['prestasi', 'ekskul', 'galeri-foto', 'galeri-video'].includes(currentView)
                    ? 'border-amber-400 text-amber-300 bg-white/5'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Kesiswaan <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition duration-200" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-100 py-2 z-50">
                <button
                  onClick={() => handleNavClick('prestasi')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Prestasi Sekolah & Siswa
                </button>
                <button
                  onClick={() => handleNavClick('ekskul')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Ekstrakurikuler & Organisasi
                </button>
                <button
                  onClick={() => handleNavClick('galeri-foto')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Galeri Foto Kegiatan
                </button>
                <button
                  onClick={() => handleNavClick('galeri-video')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Galeri Video Dokumentasi
                </button>
              </div>
            </div>

            {/* Dropdown: INFORMASI */}
            <div className="relative group">
              <button
                className={`px-4 py-3 font-semibold transition flex items-center gap-1 border-b-2 ${
                  ['berita', 'pengumuman', 'agenda'].includes(currentView)
                    ? 'border-amber-400 text-amber-300 bg-white/5'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Informasi & Berita <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition duration-200" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-100 py-2 z-50">
                <button
                  onClick={() => handleNavClick('berita')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-between"
                >
                  <span>Berita & Artikel Terkini</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-red-100 text-red-700 rounded font-bold">Terupdate</span>
                </button>
                <button
                  onClick={() => handleNavClick('pengumuman')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Pengumuman Resmi
                </button>
                <button
                  onClick={() => handleNavClick('agenda')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-900"
                >
                  Agenda & Kalender Sekolah
                </button>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('ppdb')}
              className={`px-4 py-3 font-bold transition flex items-center gap-1 border-b-2 ${
                currentView === 'ppdb'
                  ? 'border-amber-400 text-amber-300 bg-white/5'
                  : 'border-transparent text-amber-400 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              PPDB 2026
            </button>

            <button
              onClick={() => handleNavClick('kontak')}
              className={`px-4 py-3 font-semibold transition border-b-2 ${
                currentView === 'kontak'
                  ? 'border-amber-400 text-amber-300 bg-white/5'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Kontak
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-amber-300 transition flex items-center gap-1"
              title="Lihat XML Sitemap Google"
            >
              XML Sitemap <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-4 max-h-[80vh] overflow-y-auto space-y-3">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-300">Akses Cepat Pengunjung</span>
            <button
              onClick={() => handleNavClick('ppdb')}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg"
            >
              Daftar PPDB Online
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800"
            >
              Beranda
            </button>

            {/* Profil Accordion */}
            <div>
              <button
                onClick={() => toggleDropdown('profil')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 text-slate-200"
              >
                <span>Profil Sekolah</span>
                <ChevronDown className={`w-4 h-4 transition ${activeDropdown === 'profil' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'profil' && (
                <div className="pl-4 py-1 space-y-1 bg-slate-950/40 rounded-lg my-1">
                  <button onClick={() => handleNavClick('sambutan')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Sambutan Kepala Sekolah</button>
                  <button onClick={() => handleNavClick('profil')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Profil & Identitas</button>
                  <button onClick={() => handleNavClick('visimisi')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Visi & Misi</button>
                  <button onClick={() => handleNavClick('sejarah')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Sejarah Sekolah</button>
                  <button onClick={() => handleNavClick('struktur')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Struktur Organisasi</button>
                  <button onClick={() => handleNavClick('fasilitas')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Fasilitas & Sarpras</button>
                </div>
              )}
            </div>

            {/* Akademik Accordion */}
            <div>
              <button
                onClick={() => toggleDropdown('akademik')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 text-slate-200"
              >
                <span>Akademik</span>
                <ChevronDown className={`w-4 h-4 transition ${activeDropdown === 'akademik' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'akademik' && (
                <div className="pl-4 py-1 space-y-1 bg-slate-950/40 rounded-lg my-1">
                  <button onClick={() => handleNavClick('kurikulum')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Kurikulum Merdeka</button>
                  <button onClick={() => handleNavClick('program')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Program Unggulan</button>
                  <button onClick={() => handleNavClick('guru')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Data Guru & Pendidik</button>
                  <button onClick={() => handleNavClick('siswa')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Data Siswa</button>
                </div>
              )}
            </div>

            {/* Kesiswaan Accordion */}
            <div>
              <button
                onClick={() => toggleDropdown('kesiswaan')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 text-slate-200"
              >
                <span>Kesiswaan</span>
                <ChevronDown className={`w-4 h-4 transition ${activeDropdown === 'kesiswaan' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'kesiswaan' && (
                <div className="pl-4 py-1 space-y-1 bg-slate-950/40 rounded-lg my-1">
                  <button onClick={() => handleNavClick('prestasi')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Prestasi Sekolah</button>
                  <button onClick={() => handleNavClick('ekskul')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Ekstrakurikuler</button>
                  <button onClick={() => handleNavClick('galeri-foto')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Galeri Foto</button>
                  <button onClick={() => handleNavClick('galeri-video')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Galeri Video</button>
                </div>
              )}
            </div>

            {/* Informasi Accordion */}
            <div>
              <button
                onClick={() => toggleDropdown('informasi')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 text-slate-200"
              >
                <span>Informasi & Berita</span>
                <ChevronDown className={`w-4 h-4 transition ${activeDropdown === 'informasi' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'informasi' && (
                <div className="pl-4 py-1 space-y-1 bg-slate-950/40 rounded-lg my-1">
                  <button onClick={() => handleNavClick('berita')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Berita & Artikel</button>
                  <button onClick={() => handleNavClick('pengumuman')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Pengumuman Resmi</button>
                  <button onClick={() => handleNavClick('agenda')} className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white">Agenda Sekolah</button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('kontak')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800"
            >
              Hubungi Kami
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold text-center"
                >
                  Buka Dashboard ({user.role.toUpperCase()})
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2 bg-slate-800 text-red-400 rounded-lg text-xs font-semibold text-center"
                >
                  Keluar Akun
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Masuk CMS (Admin / Editor / Guru)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
