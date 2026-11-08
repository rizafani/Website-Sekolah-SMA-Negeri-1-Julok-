import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  CheckCircle2,
  RefreshCw,
  FileText,
  Tag,
  Search,
  BookOpen,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Category } from '../../types/index.ts';

interface AIArticleModalProps {
  isOpen?: boolean;
  onClose: () => void;
  categories: Category[];
  currentTitle?: string;
  currentContent?: string;
  onApplyArticle: (generated: {
    title: string;
    slug?: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    seoTitle: string;
    metaDescription: string;
    focusKeyword: string;
    featuredImage: string;
    altImage: string;
  }) => void;
}

const TOPIC_PRESETS = [
  'Gelar Karya P5: Menggali Kuliner Tradisional dan Kerajinan Khas Aceh Timur',
  'Siswa SMAN 1 Julok Lolos Seleksi Olimpiade Sains Nasional (OSN) Tingkat Nasional',
  'Peringatan Maulid Nabi Muhammad SAW 1447 H dan Santunan Anak Yatim Piatu',
  'Workshop Pemanfaatan Artificial Intelligence dan Media Interaktif bagi Dewan Guru',
  'Pembukaan Pendaftaran Peserta Didik Baru (PPDB) Online Tahun Ajaran 2026/2027',
  'Semarak Classmeeting dan Turnamen Futsal Antar-Kelas Mempererat Silaturahmi',
];

export const AIArticleModal: React.FC<AIArticleModalProps> = ({
  isOpen = true,
  onClose,
  categories,
  currentTitle = '',
  currentContent = '',
  onApplyArticle,
}) => {
  const [topic, setTopic] = useState(currentTitle || '');
  const [category, setCategory] = useState('Berita Sekolah');
  const [tone, setTone] = useState('Jurnalistik Resmi');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Silakan masukkan topik atau ide pokok artikel terlebih dahulu.');
      return;
    }

    setError(null);
    setLoading(true);
    setGeneratedResult(null);

    try {
      const res = await api.generateAIArticle({
        topic: topic.trim(),
        category,
        tone,
        length,
        keywords: keywords.trim(),
      });
      setGeneratedResult(res);
    } catch (err: any) {
      setError(err.message || 'Gagal menghasilkan artikel dengan AI. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyArticle(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                Asisten Penulis Artikel Otomatis AI
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Ketikkan ide pokok atau tema, AI akan membuat artikel jurnalistik lengkap dengan SEO otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form Step */}
          {!generatedResult ? (
            <div className="space-y-5">
              {/* Topic Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Ide Pokok / Judul Kegiatan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Siswa SMAN 1 Julok memenangkan Medali Emas OSN Fisika tingkat Provinsi Aceh 2026..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-xs font-medium resize-none shadow-xs"
                  />
                </div>

                {/* Quick Topic Chips */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Contoh Ide Topik Sekolah Cepat:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TOPIC_PRESETS.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTopic(t)}
                        className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-300 transition text-left"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Berita
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Berita Sekolah">Berita Sekolah</option>
                    <option value="Prestasi Siswa">Prestasi Siswa</option>
                    <option value="Akademik & Kurikulum">Akademik & Kurikulum</option>
                    <option value="Kegiatan OSIS & Ekskul">Kegiatan OSIS & Ekskul</option>
                    <option value="Opini & Karya Guru">Opini & Karya Guru</option>
                    <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                  </select>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gaya Penulisan (Tone)
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="Jurnalistik Resmi">Jurnalistik Resmi & Objektif</option>
                    <option value="Inspiratif & Semarak">Inspiratif & Semarak</option>
                    <option value="Edukatif Mendalam">Edukatif & Reflektif</option>
                    <option value="Pengumuman Padat">Ringkas & Lugas</option>
                  </select>
                </div>

                {/* Length */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Panjang Artikel
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="short">Ringkas (~300 kata)</option>
                    <option value="medium">Standar (~500 - 600 kata)</option>
                    <option value="long">Mendalam (~800 - 1000 kata)</option>
                  </select>
                </div>
              </div>

              {/* Keywords Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Kunci / Tag Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Misal: OSN 2026, Kemdikbud, Kurikulum Merdeka, Dr. H. Bakhtiar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGenerate}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Sedang Merancang Artikel Lengkap dengan AI...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-300" />
                      <span>✨ Buat Artikel Otomatis Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Result Preview Step */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Artikel Berhasil Dibuat oleh AI!</span>
                </div>
                <span className="text-[11px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  {generatedResult.model}
                </span>
              </div>

              {/* Preview Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {generatedResult.category}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 leading-snug">
                    {generatedResult.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 italic bg-white p-3 rounded-xl border border-slate-200">
                    "{generatedResult.excerpt}"
                  </p>
                </div>

                {/* SEO Snippet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">SEO Title</span>
                    <span className="text-slate-800 font-semibold truncate block">{generatedResult.seoTitle}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Focus Keyword</span>
                    <span className="text-slate-800 font-semibold">{generatedResult.focusKeyword}</span>
                  </div>
                </div>

                {/* Tags */}
                {generatedResult.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {generatedResult.tags.map((tg: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content Accordion preview */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 max-h-56 overflow-y-auto text-xs space-y-2 text-slate-700 prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: generatedResult.content }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGeneratedResult(null)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Buat Ulang / Ganti Topik
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md text-xs sm:text-sm transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Pasang ke Editor Artikel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
