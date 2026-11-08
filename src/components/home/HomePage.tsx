import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Calendar,
  Eye,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Bell,
  Clock,
  MapPin,
  Share2,
  CheckCircle2,
  Play,
  Search,
} from 'lucide-react';
import { Article, Announcement, AgendaItem, GalleryItem, Achievement } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { SocialShareModal } from '../common/SocialShareModal.tsx';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenArticle: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenArticle }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [shareArticle, setShareArticle] = useState<Article | null>(null);

  const heroSlides = [
    {
      title: 'Mencetak Generasi Unggul Berkarakter & Berakhlak Mulia',
      subtitle: 'SMA Negeri 1 Julok - Sekolah Penggerak dan Rujukan di Pesisir Aceh Timur',
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&h=750&q=80',
      tag: 'Akreditasi A (Unggul)',
      ctaText: 'Daftar PPDB 2026/2027',
      ctaTarget: 'ppdb',
    },
    {
      title: 'Prestasi Gemilang Olimpiade Sains Nasional (OSN) 2026',
      subtitle: 'Ananda Teuku Al-Fathan Raih Medali Emas OSN Fisika Tingkat Provinsi Aceh',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1600&h=750&q=80',
      tag: 'Prestasi Sains',
      ctaText: 'Baca Berita Prestasi',
      ctaSlug: 'siswa-sman-1-julok-raih-medali-emas-osn-provinsi-aceh-2026',
    },
    {
      title: 'Implementasi Kurikulum Merdeka & Gelar Karya Budaya Aceh',
      subtitle: 'Projek Penguatan Profil Pelajar Pancasila (P5) Berbasis Kearifan Lokal Aceh Timur',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&h=750&q=80',
      tag: 'Kurikulum Merdeka',
      ctaText: 'Jelajahi Program P5',
      ctaTarget: 'kurikulum',
    },
  ];

  useEffect(() => {
    // Record page visit
    api.recordVisit().catch(() => {});

    api.getArticles({ limit: 6 }).then((res) => setArticles(res.data)).catch(() => {});
    api.getAnnouncements().then((res) => setAnnouncements(res.slice(0, 3))).catch(() => {});
    api.getAgenda().then((res) => setAgenda(res.slice(0, 4))).catch(() => {});
    api.getGallery().then((res) => setGallery(res.slice(0, 6))).catch(() => {});
    api.getAchievements().then((res) => setAchievements(res.slice(0, 3))).catch(() => {});

    // Auto rotate hero slides
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Slider */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="relative min-h-[500px] md:min-h-[580px] flex items-center">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background image with gradient overlays */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
            </div>
          ))}

          {/* Slide Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 sm:py-24 w-full">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> {heroSlides[activeSlide].tag}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {heroSlides[activeSlide].title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {heroSlides[activeSlide].subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const slide = heroSlides[activeSlide];
                    if (slide.ctaSlug) {
                      onOpenArticle(slide.ctaSlug);
                    } else if (slide.ctaTarget) {
                      onNavigate(slide.ctaTarget);
                    }
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {heroSlides[activeSlide].ctaText} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('profil')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition"
                >
                  Jelajahi Profil Sekolah
                </button>
              </div>
            </div>
          </div>

          {/* Slide Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* School Highlights / Quick Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-blue-950">748</span>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peserta Didik</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">24 Rombel Aktif</span>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-blue-950">52</span>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guru & Pendidik</p>
            <span className="text-[11px] text-blue-600 font-semibold block">Tersertifikasi & S2</span>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-amber-500">A</span>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akreditasi</p>
            <span className="text-[11px] text-amber-600 font-semibold block">BAN-S/M Unggul</span>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-blue-950">98%</span>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lulus Masuk PTN</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">SNBP & SNBT UTBK</span>
          </div>

          <div className="space-y-1 pt-4 md:pt-0 col-span-2 md:col-span-1">
            <span className="text-3xl sm:text-4xl font-black text-blue-950">1994</span>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Berdiri</p>
            <span className="text-[11px] text-slate-500 font-semibold block">32 Tahun Mengabdi</span>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Photo */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden ring-4 ring-amber-400 shadow-2xl bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=750&q=80"
                    alt="Drs. H. Bakhtiar, M.Pd"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-full shadow whitespace-nowrap">
                  Kepala Sekolah
                </span>
              </div>
              <h4 className="font-bold text-base mt-5 text-white">Drs. H. Bakhtiar, M.Pd</h4>
              <p className="text-xs text-amber-300 font-mono">NIP: 19680512 199303 1 005</p>
            </div>

            {/* Welcome text */}
            <div className="md:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/10">
                Sambutan Pimpinan Satuan Pendidikan
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Membentuk Generasi Berintelektual Tinggi dan Beradab Mulia
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-400 pl-4 py-1">
                "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi SMA Negeri 1 Julok.
                Pendidikan di era kurikulum merdeka adalah ruang tumbuh bagi seluruh potensi anak didik.
                Kami berkomitmen menjaga marwah integritas, akhlak berlandaskan syariat, dan penguasaan sains teknologi modern
                demi masa depan Aceh Timur yang gemilang."
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('sambutan')}
                  className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition shadow"
                >
                  Baca Sambutan Lengkap
                </button>
                <button
                  onClick={() => onNavigate('visimisi')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
                >
                  Visi & Misi Sekolah
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita & Artikel Terbaru */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-700">Warta Kampus</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Berita & Publikasi Sekolah Terkini
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Informasi kegiatan siswa, prestasi kompetisi, dan program akademik terbaru
            </p>
          </div>

          <button
            onClick={() => onNavigate('berita')}
            className="text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center gap-1.5 self-start sm:self-auto group"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => onOpenArticle(art.slug)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={art.featuredImage}
                    alt={art.altImage || art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-900/90 text-white backdrop-blur-sm shadow">
                    {art.category}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(art.publishedAt || art.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {art.views} dibaca
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {art.authorName.split(' ')[0]}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareArticle(art);
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  title="Bagikan Berita (WhatsApp, FB, Telegram)"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pengumuman & Agenda Section (Side-by-Side) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pengumuman Resmi */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Pengumuman Resmi</h3>
                  <p className="text-xs text-slate-500">Pemberitahuan resmi dan edaran kedinasan</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('pengumuman')}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Lihat Semua →
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(ann.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {ann.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-800">
                        Penting
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda & Kalender Sekolah */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Agenda & Kalender</h3>
                  <p className="text-xs text-slate-500">Jadwal kegiatan akademik mendatang</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('agenda')}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Lihat Kalender →
              </button>
            </div>

            <div className="space-y-3">
              {agenda.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-black leading-none">
                      {new Date(item.date).getDate()}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-300 leading-tight">
                      {new Date(item.date).toLocaleDateString('id-ID', { month: 'short' })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.time}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prestasi Siswa & Ekstrakurikuler Showcase */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">Hall of Fame</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Prestasi & Kejuaraan Siswa
            </h2>
          </div>
          <button
            onClick={() => onNavigate('prestasi')}
            className="text-xs font-bold text-blue-800 hover:underline"
          >
            Lihat Semua Prestasi →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  <img src={ach.image} alt={ach.title} className="w-full h-full object-cover" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900">
                  {ach.level} • {ach.year}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">{ach.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">{ach.studentName}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Galeri Kegiatan (Photos & Video) */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-700">Dokumentasi</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Galeri Foto & Video Kampus
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('galeri-foto')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Galeri Foto
            </button>
            <button
              onClick={() => onNavigate('galeri-video')}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition"
            >
              Galeri Video
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.type === 'video' ? 'galeri-video' : 'galeri-foto')}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.thumbnail || item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-3 text-center text-white">
                {item.type === 'video' ? (
                  <Play className="w-8 h-8 text-amber-400 drop-shadow" />
                ) : (
                  <span className="text-[11px] font-bold line-clamp-2">{item.title}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Share Modal */}
      {shareArticle && (
        <SocialShareModal
          article={shareArticle}
          isOpen={Boolean(shareArticle)}
          onClose={() => setShareArticle(null)}
        />
      )}
    </div>
  );
};
