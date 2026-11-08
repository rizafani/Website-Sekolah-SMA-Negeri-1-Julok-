import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Eye, Share2, ArrowRight, Tag } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Article } from '../../types/index.ts';
import { SocialShareModal } from '../common/SocialShareModal.tsx';

interface NewsListPageProps {
  onOpenArticle: (slug: string) => void;
  initialCategory?: string;
}

export const NewsListPage: React.FC<NewsListPageProps> = ({ onOpenArticle, initialCategory }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'Semua',
    'Berita Sekolah',
    'Prestasi Siswa',
    'Akademik & Kurikulum',
    'Kegiatan OSIS & Ekskul',
    'Opini & Karya Guru',
    'Pengumuman Resmi',
  ]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Semua');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareArticle, setShareArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await api.getArticles({
        category: selectedCategory !== 'Semua' ? selectedCategory : undefined,
        limit: 50,
      });
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = articles.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      {/* Page Title & Breadcrumb */}
      <div className="space-y-2">
        <nav className="text-xs text-slate-400 flex items-center gap-2">
          <span>Beranda</span>
          <span>/</span>
          <span className="text-blue-900 font-bold">Berita & Publikasi Sekolah</span>
        </nav>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Berita & Publikasi SMA Negeri 1 Julok
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Pusat informasi resmi seputar kegiatan belajar mengajar, prestasi siswa, inovasi kurikulum, dan agenda sekolah.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berita berdasarkan kata kunci..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Memuat artikel...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-700">Tidak ada artikel yang ditemukan</p>
          <p className="text-xs text-slate-400">Silakan ubah filter kategori atau kata kunci pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
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
                  title="Bagikan Berita"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

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
