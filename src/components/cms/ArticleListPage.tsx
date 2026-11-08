import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Article, Category } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';

interface ArticleListPageProps {
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onViewArticle: (slug: string) => void;
}

export const ArticleListPage: React.FC<ArticleListPageProps> = ({
  onNewArticle,
  onEditArticle,
  onViewArticle,
}) => {
  const { user, canEditArticle, canDeleteArticle } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      // For Guru, fetch with authorId filter; for Admin/Editor fetch all
      const params: any = {
        limit: 100,
      };
      if (user?.role === 'guru') {
        params.authorId = user.id;
      }
      if (selectedCategory !== 'Semua') {
        params.category = selectedCategory;
      }
      if (selectedStatus !== 'Semua') {
        params.status = selectedStatus;
      }

      const res = await api.getArticles(params);
      setArticles(res.data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}" secara permanen?`)) return;
    try {
      await api.deleteArticle(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus artikel');
    }
  };

  const filteredArticles = articles.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.authorName.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {user?.role === 'guru' ? 'Artikel & Berita Milik Saya' : 'Manajemen Seluruh Artikel & Berita'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publikasi berita kegiatan SMA Negeri 1 Julok tanpa antrean approval. Langsung tampil di website.
          </p>
        </div>

        <button
          onClick={onNewArticle}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" /> Tulis Artikel Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan judul, penulis, atau tag..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Berita Sekolah">Berita Sekolah</option>
            <option value="Prestasi Siswa">Prestasi Siswa</option>
            <option value="Akademik & Kurikulum">Akademik & Kurikulum</option>
            <option value="Kegiatan OSIS & Ekskul">Kegiatan OSIS & Ekskul</option>
            <option value="Opini & Karya Guru">Opini & Karya Guru</option>
            <option value="Pengumuman Resmi">Pengumuman Resmi</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Semua">Semua Status</option>
            <option value="published">Diterbitkan (Publik)</option>
            <option value="draft">Draft (Konsep)</option>
          </select>
        </div>
      </div>

      {/* Table of Articles */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat artikel...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Belum ada artikel yang cocok</p>
            <p className="text-xs text-slate-400">Silakan tulis artikel pertama Anda untuk mempublikasikan kegiatan sekolah.</p>
            <button
              onClick={onNewArticle}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Mulai Menulis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Artikel & Gambar</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Penulis</th>
                  <th className="py-3.5 px-4">Tanggal Rilis</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Views</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="w-14 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="max-w-md">
                          <h4 className="font-bold text-slate-900 line-clamp-1 hover:text-blue-700 transition">
                            {art.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /berita/{art.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {art.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div>
                        <span className="font-semibold">{art.authorName}</span>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">{art.authorRole}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(art.publishedAt || art.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          art.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {art.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {art.views || 0}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => onViewArticle(art.slug)}
                        title="Lihat di Website"
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canEditArticle(art.authorId) && (
                        <button
                          onClick={() => onEditArticle(art)}
                          title="Edit Artikel"
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {canDeleteArticle(art.authorId) && (
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          title="Hapus Artikel"
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
