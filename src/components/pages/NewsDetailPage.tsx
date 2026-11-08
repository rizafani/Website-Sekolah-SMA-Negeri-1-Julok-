import React, { useState, useEffect } from 'react';
import {
  Clock,
  Eye,
  Share2,
  MessageCircle,
  Facebook,
  Send,
  Copy,
  Check,
  ArrowLeft,
  User,
  Calendar,
  Tag,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Article, Comment } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { SocialShareModal } from '../common/SocialShareModal.tsx';

interface NewsDetailPageProps {
  slug: string;
  onBack: () => void;
  onOpenArticle: (slug: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ slug, onBack, onOpenArticle }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // New comment form
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const art = await api.getArticle(slug);
      setArticle(art);

      // Load comments
      api.getComments(art.id).then(setComments).catch(() => {});

      // Load related articles by category
      api.getArticles({ category: art.category, limit: 4 }).then((res) => {
        setRelatedArticles(res.data.filter((a) => a.id !== art.id).slice(0, 3));
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (!article) return;
    const text = `*${article.seoTitle || article.title}*\n\n${article.excerpt}\n\nBaca selengkapnya:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleTelegramShare = () => {
    if (!article) return;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank');
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentName.trim() || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.submitComment({
        articleId: article.id,
        articleTitle: article.title,
        name: commentName.trim(),
        email: commentEmail.trim(),
        content: commentContent.trim(),
      });
      setComments([res.comment, ...comments]);
      setCommentName('');
      setCommentEmail('');
      setCommentContent('');
      alert('Komentar Anda berhasil dipublikasikan!');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim komentar');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Memuat artikel SMAN 1 Julok...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Artikel Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Artikel yang Anda cari mungkin telah dihapus atau dipindahkan.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Daftar Berita
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={onBack} className="hover:text-blue-700 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Berita
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-blue-900 font-semibold">{article.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="truncate max-w-[200px] text-slate-500">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
          {article.category}
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs uppercase">
              {article.authorName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{article.authorName}</p>
              <span className="text-[10px] text-blue-700 uppercase font-semibold">
                {article.authorRole === 'guru' ? 'Dewan Guru' : article.authorRole.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {article.views} kali dibaca
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="space-y-2">
        <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-md">
          <img
            src={article.featuredImage}
            alt={article.altImage || article.title}
            className="w-full h-full object-cover"
          />
        </div>
        {article.altImage && (
          <p className="text-[11px] text-slate-400 italic text-center">
            {article.altImage}
          </p>
        )}
      </div>

      {/* Social Share Strip */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-blue-700" /> Bagikan Kabar Ini:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button
            onClick={handleFacebookShare}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition"
          >
            <Facebook className="w-3.5 h-3.5" /> Facebook
          </button>
          <button
            onClick={handleTelegramShare}
            className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" /> Telegram
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin Link'}
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition"
          >
            Preview OG
          </button>
        </div>
      </div>

      {/* Article Rich Content */}
      <div
        className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Tag Terkait:
          </span>
          {article.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-blue-50 hover:text-blue-800 transition cursor-pointer"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Comments Section */}
      <section className="pt-8 border-t border-slate-200 space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Komentar Pembaca ({comments.length})
        </h3>

        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs">
          <h4 className="font-bold text-slate-800">Tinggalkan Tanggapan Anda:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Nama Lengkap *"
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
            />
            <input
              type="email"
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
              placeholder="Email (Tidak akan dipublikasikan)"
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <textarea
            rows={3}
            required
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Tuliskan pesan apresiasi atau komentar santun Anda..."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingComment}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-sm transition"
            >
              {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          </div>
        </form>

        {/* Comment list */}
        <div className="space-y-3">
          {comments.map((com) => (
            <div key={com.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{com.name}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(com.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{com.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Artikel Terkait Lainnya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onOpenArticle(rel.slug)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[16/10] bg-slate-100">
                  <img src={rel.featuredImage} alt={rel.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-blue-700">
                    {rel.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {new Date(rel.publishedAt || rel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {showShareModal && article && (
        <SocialShareModal
          article={article}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
