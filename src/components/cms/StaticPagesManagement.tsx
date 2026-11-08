import React, { useState, useEffect } from 'react';
import { FolderTree, Edit2, Save, Eye, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api.ts';
import { StaticPage } from '../../types/index.ts';

interface StaticPagesManagementProps {
  onViewPageOnSite: (slug: string) => void;
}

export const StaticPagesManagement: React.FC<StaticPagesManagementProps> = ({ onViewPageOnSite }) => {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await api.getPages();
      setPages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setSaving(true);
    try {
      await api.updatePage(editingPage.id, editingPage);
      alert('Halaman sekolah berhasil diperbarui!');
      setEditingPage(null);
      loadPages();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (editingPage) {
    return (
      <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <button
            onClick={() => setEditingPage(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Halaman
          </button>
          <button
            onClick={handleSavePage}
            disabled={saving}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-amber-300" /> {saving ? 'Menyimpan...' : 'Simpan Halaman'}
          </button>
        </div>

        <form onSubmit={handleSavePage} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Judul Halaman</label>
            <input
              type="text"
              value={editingPage.title}
              onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subjudul / Deskripsi Pendek</label>
            <input
              type="text"
              value={editingPage.subtitle || ''}
              onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Konten Halaman (HTML Rich Text)</label>
            <textarea
              rows={14}
              value={editingPage.content}
              onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
              className="w-full p-4 font-mono text-xs border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={editingPage.seoTitle}
                onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Meta Description</label>
              <input
                type="text"
                value={editingPage.metaDescription}
                onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Kelola Halaman Statis Sekolah
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Halaman profil institusi, struktur organisasi, kurikulum merdeka, visi-misi, dan program prioritas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-400 transition"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                /{page.slug}
              </span>
              <h3 className="text-base font-bold text-slate-900">{page.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{page.subtitle || page.metaDescription}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Update: {new Date(page.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewPageOnSite(page.slug)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> Lihat
                </button>
                <button
                  onClick={() => setEditingPage(page)}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg flex items-center gap-1 transition shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Konten
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
