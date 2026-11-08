import React, { useState, useEffect } from 'react';
import {
  Image,
  Upload,
  Copy,
  Trash2,
  Check,
  Search,
  Filter,
  FileText,
  Video,
  Sparkles,
  ExternalLink,
  Edit2,
  X,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { MediaFile } from '../../types/index.ts';
import { ImageUploadField } from '../common/ImageUploadField.tsx';

export const MediaLibraryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);

  // Upload form state
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadType, setUploadType] = useState('image/webp');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMedia();
      setMediaList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus berkas media "${name}"?`)) return;
    try {
      await api.deleteMedia(id);
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl || !uploadName) {
      alert('Nama file dan URL berkas wajib diisi!');
      return;
    }

    try {
      const newMedia = await api.uploadMedia({
        name: uploadName.endsWith('.webp') || uploadName.includes('.') ? uploadName : `${uploadName}.webp`,
        url: uploadUrl,
        altText: uploadAlt || uploadName,
        type: uploadType,
        size: 154000,
      });
      setMediaList([newMedia, ...mediaList]);
      setShowUploadModal(false);
      setUploadName('');
      setUploadUrl('');
      setUploadAlt('');
      alert('Media berhasil diunggah ke pustaka sekolah!');
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah media');
    }
  };

  const filtered = mediaList.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.altText.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'image') return m.type.startsWith('image/');
    if (filterType === 'pdf') return m.type.includes('pdf');
    return true;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Media Library & Manajemen Berkas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penyimpanan foto dokumentasi, gambar berita, dan dokumen panduan sekolah dengan optimasi format WebP.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-amber-300" /> Unggah Media Baru
        </button>
      </div>

      {/* Filter and search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari file media atau ALT text..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${filterType === 'all' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Semua Media
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${filterType === 'image' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Foto & Gambar (WebP)
          </button>
          <button
            onClick={() => setFilterType('pdf')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${filterType === 'pdf' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Dokumen (PDF/Doc)
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Memuat berkas media...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Image className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Tidak ada media yang ditemukan</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Unggah Berkas Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                {item.type.includes('pdf') ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-700 p-4">
                    <FileText className="w-10 h-10 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Dokumen PDF</span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/80 text-white uppercase backdrop-blur-sm">
                  {item.type.split('/')[1] || 'WebP'}
                </span>
              </div>

              <div className="p-3 text-xs space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic" title={item.altText}>
                    ALT: {item.altText || item.name}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-mono">
                    {Math.round(item.size / 1024)} KB
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className={`p-1.5 rounded-lg transition ${copiedId === item.id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'}`}
                      title="Salin URL Gambar"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-700 transition"
                      title="Hapus Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-700" /> Unggah ke Media Library
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <ImageUploadField
                  label="Pilih / Unggah Berkas Gambar"
                  value={uploadUrl}
                  onChange={(url) => {
                    setUploadUrl(url);
                    if (!uploadName) {
                      setUploadName(`Media_SMAN1_Julok_${Date.now()}`);
                    }
                  }}
                  aspectRatio="landscape"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Berkas *</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Gedung_Baru_SMAN1_Julok.webp"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ALT Text (SEO & Aksesibilitas) *</label>
                <input
                  type="text"
                  required
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Foto dokumentasi laboratorium fisika SMA Negeri 1 Julok"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Format</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="image/webp">Gambar WebP (Terkompresi)</option>
                    <option value="image/jpeg">Gambar JPEG</option>
                    <option value="image/png">Gambar PNG</option>
                    <option value="application/pdf">Dokumen PDF</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" /> WebP Otomatis Menghemat 60% Bandwidth
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 shadow-sm"
                >
                  Simpan ke Pustaka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
