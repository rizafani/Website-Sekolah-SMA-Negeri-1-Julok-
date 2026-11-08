import React, { useState, useEffect } from 'react';
import { Search, FileText, Bell, Calendar, ArrowRight, Tag } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Article, Announcement, AgendaItem } from '../../types/index.ts';

interface SearchPageProps {
  onOpenArticle: (slug: string) => void;
  onNavigate: (view: string) => void;
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onOpenArticle, onNavigate, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<Article[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length > 1) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const [artRes, annRes, agdRes] = await Promise.all([
        api.getArticles({ search: query, limit: 30 }),
        api.getAnnouncements(),
        api.getAgenda(),
      ]);

      setArticles(artRes.data);
      const q = query.toLowerCase();
      setAnnouncements(annRes.filter((a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)));
      setAgenda(agdRes.filter((g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-slate-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const totalResults = articles.length + announcements.length + agenda.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Pusat Informasi</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Pencarian Terpadu SMAN 1 Julok
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Temukan berita, kegiatan siswa, pengumuman kedinasan, dan kalender akademik sekolah.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik kata kunci pencarian (misal: OSN, Fisika, PPDB, Ramadhan, Kurikulum)..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 shadow-md"
        />
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold">Pencarian Populer:</span>
        {['OSN Fisika', 'PPDB 2026', 'Gelar Karya P5', 'Maulid Nabi', 'Tryout UTBK', 'Kurikulum Merdeka'].map((term) => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-600 font-medium transition"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {query.trim().length > 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Ditemukan <strong className="text-blue-900">{totalResults}</strong> hasil untuk "{query}"
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Mencari...</div>
          ) : totalResults === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
              <p className="font-bold text-slate-800 text-sm">Tidak ada hasil yang cocok</p>
              <p className="text-xs text-slate-400">Coba gunakan kata kunci umum lainnya.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Articles matched */}
              {articles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-700" /> Berita & Artikel ({articles.length})
                  </h3>
                  <div className="space-y-3">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => onOpenArticle(art.slug)}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer space-y-1.5"
                      >
                        <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          {art.category}
                        </span>
                        <h4 className="font-bold text-base text-slate-900">
                          {highlightText(art.title, query)}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {highlightText(art.excerpt, query)}
                        </p>
                        <span className="text-[11px] text-slate-400 block pt-1">
                          Penulis: {art.authorName} • {new Date(art.publishedAt || art.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements matched */}
              {announcements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-600" /> Pengumuman Resmi ({announcements.length})
                  </h3>
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        onClick={() => onNavigate('pengumuman')}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-amber-400 transition cursor-pointer space-y-1"
                      >
                        <h4 className="font-bold text-sm text-slate-900">
                          {highlightText(ann.title, query)}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {highlightText(ann.content, query)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda matched */}
              {agenda.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" /> Agenda Sekolah ({agenda.length})
                  </h3>
                  <div className="space-y-3">
                    {agenda.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onNavigate('agenda')}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-400 transition cursor-pointer space-y-1"
                      >
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {item.date} • {item.time}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {highlightText(item.title, query)}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {highlightText(item.description, query)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
