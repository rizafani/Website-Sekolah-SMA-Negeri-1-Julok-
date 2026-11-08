import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Heart,
  ShieldCheck,
  Award,
  Globe,
  Share2,
  Users,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { VisitorStats, SchoolSettings } from '../../types/index.ts';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
    api.getDashboardStats().then((res) => {
      setStats(res.stats);
    }).catch(() => {});
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner / Callout for PPDB and School Motto */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border-b border-blue-900/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Penerimaan Peserta Didik Baru TP 2026/2027
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Siap Menjadi Bagian dari Prestasi Gemilang SMAN 1 Julok?
            </h3>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl">
              Daftarkan diri Anda secara online atau kunjungi sekretariat PPDB di kampus SMAN 1 Julok, Aceh Timur.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('ppdb')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs md:text-sm rounded-xl shadow-lg transition"
            >
              Daftar PPDB Online
            </button>
            <button
              onClick={() => onNavigate('kontak')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm rounded-xl border border-white/20 transition"
            >
              Hubungi Sekretariat
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Col 1 & 2: School Bio & Contacts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 p-2 shadow-inner ring-2 ring-amber-400 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white">
                  <polygon points="50,5 92,25 92,75 50,95 8,75 8,25" fill="#1e3a8a" stroke="#f59e0b" strokeWidth="4" />
                  <path d="M50 15 L78 30 L50 45 L22 30 Z" fill="#f59e0b" />
                  <circle cx="50" cy="50" r="10" fill="#ef4444" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-black text-white tracking-tight">SMA NEGERI 1 JULOK</h4>
                <p className="text-xs text-amber-400 font-semibold">NPSN: 10102146 • AKREDITASI A (UNGGUL)</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Lembaga pendidikan menengah atas negeri berprestasi di pesisir Kabupaten Aceh Timur.
              Mengedepankan pembelajaran terpadu IPTEK dan IMTAQ berlandaskan Kurikulum Merdeka dan syariat Islam.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Jl. Medan - Banda Aceh Km. 368, Blang Pauh Dua, Kec. Julok, Kab. Aceh Timur, Aceh 24458</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(0646) 7001234 / +62 822-7788-9900</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@sman1julok.sch.id / sman1julok@gmail.com</span>
              </div>
            </div>

            {/* Social media links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/sman1julok"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition"
                title="Facebook SMA Negeri 1 Julok"
              >
                FB
              </a>
              <a
                href="https://instagram.com/sman1julok_official"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center transition"
                title="Instagram SMA Negeri 1 Julok"
              >
                IG
              </a>
              <a
                href="https://youtube.com/@sman1julokofficial"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition"
                title="YouTube SMA Negeri 1 Julok"
              >
                YT
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=6282277889900"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition"
                title="WhatsApp Resmi"
              >
                WA
              </a>
            </div>
          </div>

          {/* Col 3: Profil & Akademik */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-400 pl-2">
              Profil & Akademik
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('sambutan')} className="hover:text-amber-400 transition">
                  Sambutan Kepala Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('visimisi')} className="hover:text-amber-400 transition">
                  Visi & Misi Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sejarah')} className="hover:text-amber-400 transition">
                  Sejarah SMAN 1 Julok
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('struktur')} className="hover:text-amber-400 transition">
                  Struktur Organisasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kurikulum')} className="hover:text-amber-400 transition">
                  Kurikulum Merdeka & P5
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('program')} className="hover:text-amber-400 transition">
                  Program Unggulan Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guru')} className="hover:text-amber-400 transition">
                  Data Guru & Tenaga Kependidikan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('siswa')} className="hover:text-amber-400 transition">
                  Data & Statistik Siswa
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi & Kesiswaan */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-400 pl-2">
              Informasi Publik
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('berita')} className="hover:text-amber-400 transition">
                  Berita & Publikasi Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pengumuman')} className="hover:text-amber-400 transition">
                  Pengumuman Resmi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('agenda')} className="hover:text-amber-400 transition">
                  Kalender & Agenda Kegiatan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('prestasi')} className="hover:text-amber-400 transition">
                  Prestasi & Penghargaan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ekskul')} className="hover:text-amber-400 transition">
                  Ekstrakurikuler & OSIS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('galeri-foto')} className="hover:text-amber-400 transition">
                  Galeri Foto Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('galeri-video')} className="hover:text-amber-400 transition">
                  Dokumentasi Video
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fasilitas')} className="hover:text-amber-400 transition">
                  Fasilitas & Laboratorium
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Tautan Resmi & Statistik Pengunjung */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-400 pl-2">
              Statistik Kunjungan
            </h5>

            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-400" /> Total Pengunjung:
                </span>
                <span className="font-bold text-amber-400 font-mono">
                  {stats ? (stats.totalVisits).toLocaleString('id-ID') : '14.850'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> Kunjungan Hari Ini:
                </span>
                <span className="font-bold text-emerald-400 font-mono">
                  {stats ? stats.todayVisits : '342'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Status Server:
                </span>
                <span className="text-emerald-400 text-[10px] uppercase font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Online
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <span className="text-slate-400 font-semibold block text-[11px]">Tautan Terkait:</span>
              <a
                href="https://kemdikbud.go.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white transition py-0.5"
              >
                <span>Kemdikbudristek RI</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href="https://disdik.acehprov.go.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white transition py-0.5"
              >
                <span>Dinas Pendidikan Aceh</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-amber-400 transition py-0.5"
              >
                <span>Robots.txt & Indexing</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Sitelinks Target Info */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SMA Negeri 1 Julok, Kabupaten Aceh Timur. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="hover:text-slate-300 transition">Beranda</button>
            <button onClick={() => onNavigate('profil')} className="hover:text-slate-300 transition">Profil</button>
            <button onClick={() => onNavigate('berita')} className="hover:text-slate-300 transition">Berita</button>
            <button onClick={() => onNavigate('galeri-foto')} className="hover:text-slate-300 transition">Galeri</button>
            <button onClick={() => onNavigate('kontak')} className="hover:text-slate-300 transition">Kontak</button>
            <button onClick={() => onNavigate('login')} className="text-blue-400 hover:text-blue-300 font-semibold">CMS Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
