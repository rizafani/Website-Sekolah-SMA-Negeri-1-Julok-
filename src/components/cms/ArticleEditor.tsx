import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Quote,
  Eye,
  Send,
  Save,
  Trash2,
  Sparkles,
  Search,
  CheckCircle2,
  Share2,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Article, Category } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { GooglePreview } from '../common/GooglePreview.tsx';
import { ImageUploadField } from '../common/ImageUploadField.tsx';
import { AIArticleModal } from './AIArticleModal.tsx';
import { api } from '../../services/api.ts';

interface ArticleEditorProps {
  initialArticle?: Article | null;
  categories: Category[];
  onSave: (articleData: Partial<Article>, status: 'published' | 'draft') => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialArticle,
  categories,
  onSave,
  onDelete,
  onCancel,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(
    initialArticle?.featuredImage ||
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=700&q=80'
  );
  const [category, setCategory] = useState(initialArticle?.category || 'Berita Sekolah');
  const [tagsInput, setTagsInput] = useState(initialArticle?.tags ? initialArticle.tags.join(', ') : 'Kegiatan Sekolah, SMAN 1 Julok');
  
  // SEO fields
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialArticle?.metaDescription || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialArticle?.canonicalUrl || '');
  const [ogImage, setOgImage] = useState(initialArticle?.ogImage || '');
  const [altImage, setAltImage] = useState(initialArticle?.altImage || '');
  const [focusKeyword, setFocusKeyword] = useState(initialArticle?.focusKeyword || '');

  // Rich text editor state
  const editorRef = useRef<HTMLDivElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [editorContent, setEditorContent] = useState(initialArticle?.content || '<p>Tuliskan isi berita kegiatan SMA Negeri 1 Julok di sini...</p>');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seoTab, setSeoTab] = useState<'edit' | 'google' | 'social'>('edit');

  // Auto-generate slug when title changes (if not editing an existing published slug or user hasn't heavily customized it)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialArticle) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
      if (!seoTitle) setSeoTitle(val);
    }
  };

  // Sync editor innerHTML on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = editorContent;
    }
  }, []);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  // Execute formatting command on contenteditable
  const formatDoc = (cmd: string, val: string = '') => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      editorRef.current.focus();
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  const insertHeading = (level: string) => {
    formatDoc('formatBlock', `<${level}>`);
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin:16px 0; border:1px solid #cbd5e1;">
        <thead>
          <tr style="background-color:#f1f5f9;">
            <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">No</th>
            <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Nama Kegiatan / Peserta</th>
            <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #cbd5e1; padding:8px;">1</td>
            <td style="border:1px solid #cbd5e1; padding:8px;">Contoh data baris 1</td>
            <td style="border:1px solid #cbd5e1; padding:8px;">Keterangan lengkap</td>
          </tr>
        </tbody>
      </table>
    `;
    formatDoc('insertHTML', tableHtml);
  };

  const insertLink = () => {
    const url = prompt('Masukkan tautan URL (misal: https://sman1julok.sch.id):');
    if (url) formatDoc('createLink', url);
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL Gambar (Unsplash atau link foto):', 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80');
    if (url) {
      const imgHtml = `<figure style="margin:20px 0; text-align:center;"><img src="${url}" alt="${title || 'Foto kegiatan'}" style="width:100%; max-height:480px; object-fit:cover; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);" /><figcaption style="font-size:12px; color:#64748b; margin-top:8px; font-style:italic;">Dokumentasi: ${title || 'Kegiatan SMA Negeri 1 Julok'}</figcaption></figure><p></p>`;
      formatDoc('insertHTML', imgHtml);
    }
  };

  // Direct file upload for inline images
  const handleInlineFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInline(true);
    try {
      const uploaded = await api.uploadFile(file);
      const imgHtml = `<figure style="margin:20px 0; text-align:center;"><img src="${uploaded.url}" alt="${file.name}" style="width:100%; max-height:480px; object-fit:cover; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);" /><figcaption style="font-size:12px; color:#64748b; margin-top:8px; font-style:italic;">Dokumentasi kegiatan: ${title || file.name.replace(/\.[^/.]+$/, '')}</figcaption></figure><p></p>`;
      formatDoc('insertHTML', imgHtml);
    } catch (err: any) {
      // Fallback: FileReader data URL
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const imgHtml = `<figure style="margin:20px 0; text-align:center;"><img src="${dataUrl}" alt="${file.name}" style="width:100%; max-height:480px; object-fit:cover; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);" /><figcaption style="font-size:12px; color:#64748b; margin-top:8px; font-style:italic;">Dokumentasi: ${title || 'Foto Kegiatan'}</figcaption></figure><p></p>`;
        formatDoc('insertHTML', imgHtml);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingInline(false);
      if (inlineFileInputRef.current) inlineFileInputRef.current.value = '';
    }
  };

  // Apply AI generated article
  const handleApplyAIArticle = (aiData: {
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    seoTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    altImage?: string;
    featuredImage?: string;
  }) => {
    if (aiData.title) setTitle(aiData.title);
    if (aiData.slug) setSlug(aiData.slug);
    if (aiData.excerpt) setExcerpt(aiData.excerpt);
    if (aiData.content) {
      setEditorContent(aiData.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = aiData.content;
      }
    }
    if (aiData.category) setCategory(aiData.category);
    if (aiData.tags && aiData.tags.length > 0) setTagsInput(aiData.tags.join(', '));
    if (aiData.seoTitle) setSeoTitle(aiData.seoTitle);
    if (aiData.metaDescription) setMetaDescription(aiData.metaDescription);
    if (aiData.focusKeyword) setFocusKeyword(aiData.focusKeyword);
    if (aiData.altImage) setAltImage(aiData.altImage);
    if (aiData.featuredImage) {
      setFeaturedImage(aiData.featuredImage);
      if (!ogImage) setOgImage(aiData.featuredImage);
    }
    setShowAIModal(false);
  };

  const insertYouTube = () => {
    const videoId = prompt('Masukkan Video ID YouTube atau Embed URL (contoh: dQw4w9WgXcQ):', 'dQw4w9WgXcQ');
    if (videoId) {
      const cleanId = videoId.includes('embed/')
        ? videoId.split('embed/')[1].split('?')[0]
        : videoId.includes('v=')
        ? videoId.split('v=')[1].split('&')[0]
        : videoId;
      const iframeHtml = `
        <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; margin:16px 0;">
          <iframe src="https://www.youtube.com/embed/${cleanId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
        </div>
      `;
      formatDoc('insertHTML', iframeHtml);
    }
  };

  // Automatic SEO Generator based on content
  const autoGenerateSEO = () => {
    // Strip HTML tags for clean text
    const textOnly = editorContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const generatedTitle = title ? `${title} | SMAN 1 Julok` : 'Berita SMA Negeri 1 Julok';
    const generatedDesc = textOnly.length > 155 ? `${textOnly.substring(0, 152)}...` : textOnly || title;
    
    setSeoTitle(generatedTitle);
    setMetaDescription(generatedDesc);
    if (!excerpt) setExcerpt(generatedDesc);
    if (!altImage) setAltImage(title);
    if (!ogImage) setOgImage(featuredImage);
    if (!focusKeyword && title) {
      setFocusKeyword(title.split(' ').slice(0, 3).join(' '));
    }
  };

  const handleAction = async (status: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Judul artikel wajib diisi!');
      return;
    }

    setSaving(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave(
        {
          title: title.trim(),
          slug: slug.trim(),
          content: editorContent,
          excerpt: excerpt || title.substring(0, 150),
          featuredImage,
          category,
          tags: parsedTags,
          seoTitle: seoTitle || title,
          metaDescription: metaDescription || excerpt || title.substring(0, 150),
          canonicalUrl: canonicalUrl || `https://sman1julok.sch.id/berita/${slug}`,
          ogImage: ogImage || featuredImage,
          altImage: altImage || title,
          focusKeyword,
        },
        status
      );
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan artikel');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {initialArticle ? 'Edit Artikel & Publikasi' : 'Tulis Artikel & Berita Baru'}
              </h1>
              <p className="text-xs text-slate-500">
                Penulis: <strong className="text-blue-900">{user?.name}</strong> • Hak Akses:{' '}
                <span className="uppercase font-semibold text-emerald-700">{user?.role}</span> (Publikasi Instan)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAIModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Buat Artikel AI (Gemini)
            </button>

            {initialArticle && onDelete && (
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin menghapus artikel ini secara permanen?')) {
                    onDelete(initialArticle.id);
                  }
                }}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus
              </button>
            )}

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>

            <button
              onClick={() => handleAction('draft')}
              disabled={saving}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Draft
            </button>

            {/* Direct Instant Publish Button without approval */}
            <button
              onClick={() => handleAction('published')}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4 text-amber-300" />
              {saving ? 'Memproses...' : 'TERBITKAN LANGSUNG'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Artikel / Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Contoh: Siswa SMAN 1 Julok Raih Medali Emas OSN Provinsi Aceh 2026"
                  className="w-full px-4 py-3 text-lg font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Slug URL (Otomatis & SEO-Friendly):
                </label>
                <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
                  <span className="text-slate-400 select-none">/berita/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent outline-none text-blue-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ringkasan / Excerpt (Tampil di Card & Meta Description)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan singkat berita dalam 1-2 kalimat menarik..."
                  className="w-full px-3.5 py-2 text-xs text-slate-700 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => formatDoc('bold')}
                  title="Tebal (Bold)"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('italic')}
                  title="Miring (Italic)"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('underline')}
                  title="Garis Bawah (Underline)"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="h-5 w-px bg-slate-300 mx-1"></div>

                <button
                  type="button"
                  onClick={() => insertHeading('h1')}
                  title="Heading 1"
                  className="px-2 py-1 rounded hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => insertHeading('h2')}
                  title="Heading 2"
                  className="px-2 py-1 rounded hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertHeading('h3')}
                  title="Heading 3"
                  className="px-2 py-1 rounded hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertHeading('p')}
                  title="Paragraf"
                  className="px-2 py-1 rounded hover:bg-slate-200 text-xs text-slate-700"
                >
                  Normal
                </button>
                <div className="h-5 w-px bg-slate-300 mx-1"></div>

                <button
                  type="button"
                  onClick={() => formatDoc('insertUnorderedList')}
                  title="Daftar Poin"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('insertOrderedList')}
                  title="Daftar Nomor"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('formatBlock', '<blockquote>')}
                  title="Kutipan (Quote)"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={insertTable}
                  title="Sisipkan Tabel"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <div className="h-5 w-px bg-slate-300 mx-1"></div>

                <button
                  type="button"
                  onClick={insertLink}
                  title="Sisipkan Tautan"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  title="Sisipkan Gambar dari URL"
                  className="p-2 rounded hover:bg-slate-200 text-slate-700 transition"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                
                {/* Direct Local Image Upload Button */}
                <input
                  type="file"
                  ref={inlineFileInputRef}
                  onChange={handleInlineFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => inlineFileInputRef.current?.click()}
                  disabled={uploadingInline}
                  title="Unggah Foto dari Perangkat & Sisipkan ke Teks"
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
                  {uploadingInline ? 'Mengunggah...' : 'Unggah Foto'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  title="Buka AI Generator Artikel & Berita"
                  className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Bantuan AI
                </button>

                <button
                  type="button"
                  onClick={insertYouTube}
                  title="Sisipkan Video YouTube"
                  className="p-2 rounded hover:bg-slate-200 text-red-600 transition"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>

              {/* Editor contenteditable area */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="min-h-[420px] p-6 text-slate-800 text-sm focus:outline-none prose max-w-none leading-relaxed"
                style={{ minHeight: '420px' }}
              />
            </div>

            {/* SEO & Search Engine Optimization Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-700" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Pengaturan SEO & Open Graph Berita</h3>
                    <p className="text-[11px] text-slate-500">Optimalkan peluang muncul di Google dan kartu share WhatsApp</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={autoGenerateSEO}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate Otomatis dari Konten
                </button>
              </div>

              <div className="flex gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setSeoTab('edit')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${seoTab === 'edit' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Metadata SEO
                </button>
                <button
                  type="button"
                  onClick={() => setSeoTab('google')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${seoTab === 'google' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Simulasi Google SERP
                </button>
                <button
                  type="button"
                  onClick={() => setSeoTab('social')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${seoTab === 'social' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Simulasi Share Media Sosial
                </button>
              </div>

              {seoTab === 'edit' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-700">SEO Title (Target 30-60 karakter)</label>
                        <span className={`text-[10px] ${seoTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                          {seoTitle.length} karakter
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Judul ramah mesin pencari..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        placeholder="Contoh: SMAN 1 Julok OSN Emas"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-700">Meta Description (Target 120-160 karakter)</label>
                      <span className={`text-[10px] ${metaDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        {metaDescription.length} karakter
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Deskripsi ringkas yang menarik klik pembaca di hasil pencarian..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">ALT Text Gambar Utama</label>
                      <input
                        type="text"
                        value={altImage}
                        onChange={(e) => setAltImage(e.target.value)}
                        placeholder="Deskripsi gambar untuk aksesibilitas dan Google Image..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <div>
                      <ImageUploadField
                        label="Open Graph Image (1200x630)"
                        value={ogImage}
                        onChange={setOgImage}
                        aspectRatio="landscape"
                      />
                    </div>
                  </div>
                </div>
              )}

              {seoTab === 'google' && (
                <GooglePreview
                  title={seoTitle || title || 'Judul Artikel SMAN 1 Julok'}
                  url={`https://sman1julok.sch.id/berita/${slug || 'judul-artikel'}`}
                  description={metaDescription || excerpt || 'Deskripsi artikel sekolah...'}
                  isArticle={true}
                  publishedDate={new Date().toISOString()}
                />
              )}

              {seoTab === 'social' && (
                <div className="bg-[#e5ddd5] p-4 rounded-xl border border-slate-200">
                  <div className="bg-white rounded-lg shadow-md max-w-sm ml-auto overflow-hidden text-xs border-r-4 border-emerald-500">
                    <img
                      src={ogImage || featuredImage}
                      alt={title}
                      className="w-full aspect-[16/9] object-cover bg-slate-200"
                    />
                    <div className="p-3 bg-slate-50 border-t border-slate-100">
                      <p className="font-bold text-slate-900 text-xs line-clamp-2">{seoTitle || title}</p>
                      <p className="text-slate-500 text-[10px] line-clamp-2 mt-0.5">{metaDescription || excerpt}</p>
                      <span className="text-[9px] text-slate-400 mt-1.5 block font-mono">sman1julok.sch.id</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Properties Column (Right 1 col) */}
          <div className="space-y-6">
            {/* Publication Settings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Atribut Publikasi
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Berita</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tag / Label (Pisahkan koma)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="OSN 2026, Fisika, Prestasi Siswa"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Penulis & Hak Akses</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-900">{user?.name}</p>
                  <p className="text-slate-500 flex items-center justify-between">
                    <span>Role: <strong className="uppercase text-blue-800">{user?.role}</strong></span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Direct Publish
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <ImageUploadField
                label="Gambar Utama (Featured Image)"
                value={featuredImage}
                onChange={(url) => {
                  setFeaturedImage(url);
                  if (!ogImage) setOgImage(url);
                }}
                aspectRatio="landscape"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reader View Simulation Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10">
              <span className="text-xs font-bold text-slate-500 uppercase">Simulasi Tampilan Pembaca Website</span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <article className="p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {title || 'Judul Berita'}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Oleh: <strong className="text-slate-800">{user?.name}</strong></span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                <img src={featuredImage} alt={title} className="w-full h-full object-cover" />
              </div>

              <div
                className="prose max-w-none text-slate-800 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />

              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-1.5">
                {tagsInput.split(',').map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                    #{t.trim()}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      )}

      {/* AI Article Generator Modal */}
      {showAIModal && (
        <AIArticleModal
          onClose={() => setShowAIModal(false)}
          onApplyArticle={handleApplyAIArticle}
          currentTitle={title}
          currentContent={editorContent}
          categories={categories}
        />
      )}
    </div>
  );
};
