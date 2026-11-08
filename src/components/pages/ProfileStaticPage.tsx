import React, { useEffect, useState } from 'react';
import { Building, BookOpen, Compass, Award, UserCheck, ArrowLeft, Clock, Share2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { StaticPage } from '../../types/index.ts';

interface ProfileStaticPageProps {
  slug: string;
  onNavigate: (view: string) => void;
}

export const ProfileStaticPage: React.FC<ProfileStaticPageProps> = ({ slug, onNavigate }) => {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);

  // Map view slug to page slug in db
  const slugMapping: Record<string, string> = {
    profil: 'profil-sekolah',
    sejarah: 'sejarah-sekolah',
    visimisi: 'visi-dan-misi',
    sambutan: 'sambutan-kepala-sekolah',
    struktur: 'struktur-organisasi',
    kurikulum: 'kurikulum-sekolah',
    program: 'program-unggulan',
  };

  const targetSlug = slugMapping[slug] || slug;

  useEffect(() => {
    loadPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const loadPage = async () => {
    setLoading(true);
    try {
      const data = await api.getPage(targetSlug);
      setPage(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Halaman Sedang Dipersiapkan</h2>
        <p className="text-xs text-slate-500">Informasi ini sedang diperbarui oleh administrator sekolah.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 flex items-center gap-2">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-700 font-semibold">
          Beranda
        </button>
        <span>/</span>
        <span className="text-slate-500">Profil Institusi</span>
        <span>/</span>
        <span className="text-blue-900 font-bold">{page.title}</span>
      </nav>

      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-3">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/10 inline-block">
          SMA Negeri 1 Julok
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {page.subtitle}
          </p>
        )}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Terakhir diperbarui: {new Date(page.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Page Content Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <div
          className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      {/* Profile quick sub-navigation */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-700 block text-xs uppercase tracking-wider">
          Navigasi Halaman Terkait:
        </span>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onNavigate('sambutan')} className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition">
            Sambutan Kepala Sekolah
          </button>
          <button onClick={() => onNavigate('profil')} className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition">
            Profil & Identitas
          </button>
          <button onClick={() => onNavigate('visimisi')} className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition">
            Visi, Misi & Tujuan
          </button>
          <button onClick={() => onNavigate('sejarah')} className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition">
            Sejarah Pendirian
          </button>
          <button onClick={() => onNavigate('struktur')} className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition">
            Struktur Organisasi
          </button>
          <button onClick={() => onNavigate('kurikulum')} className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition">
            Kurikulum Merdeka
          </button>
          <button onClick={() => onNavigate('program')} className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition">
            Program Prioritas
          </button>
        </div>
      </div>
    </div>
  );
};
