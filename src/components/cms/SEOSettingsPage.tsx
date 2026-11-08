import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  CheckCircle2,
  Save,
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
  FileCode,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { SchoolSettings } from '../../types/index.ts';
import { GooglePreview } from '../common/GooglePreview.tsx';

export const SEOSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'meta' | 'robots' | 'schema' | 'sitelinks'>('meta');

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await api.updateSettings(settings);
      alert('Pengaturan SEO & Webmaster Google berhasil disimpan!');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-slate-500">Memuat konfigurasi SEO...</div>;
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            SEO Google Search Engine & Metadata Global
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi meta tags, Open Graph, Google Search Console, Robots.txt, dan XML Sitemap otomatis.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-amber-300" />
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan SEO'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('meta')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'meta' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Meta Tag & SERP Simulator
        </button>
        <button
          onClick={() => setActiveTab('sitelinks')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'sitelinks' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Google Sitelinks Optimizer
        </button>
        <button
          onClick={() => setActiveTab('robots')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'robots' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Robots.txt & Sitemap XML
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'schema' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Schema.org Structured Data
        </button>
      </div>

      {/* Tab: META & SERP */}
      {activeTab === 'meta' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Metadata Mesin Pencari (Google & Bing)
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Global SEO Title</label>
                <span className="text-[10px] text-slate-400">{settings.seoTitle.length} karakter</span>
              </div>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Global Meta Description</label>
                <span className="text-[10px] text-slate-400">{settings.metaDescription.length} karakter</span>
              </div>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Meta Keywords</label>
              <input
                type="text"
                value={settings.metaKeywords}
                onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Canonical Base URL</label>
              <input
                type="text"
                value={settings.canonicalBase}
                onChange={(e) => setSettings({ ...settings, canonicalBase: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Google Site Verification Tag</label>
                <input
                  type="text"
                  value={settings.googleVerification}
                  onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })}
                  placeholder="google-site-verification-xxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Google Analytics (GA4 ID)</label>
                <input
                  type="text"
                  value={settings.analyticsId}
                  onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Open Graph Image (1200x630)</label>
              <input
                type="text"
                value={settings.ogImageDefault}
                onChange={(e) => setSettings({ ...settings, ogImageDefault: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </form>

          {/* Live SERP Preview */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Live Preview di Google Search
            </h3>
            <GooglePreview
              title={settings.seoTitle}
              url="https://sman1julok.sch.id/"
              description={settings.metaDescription}
              showSitelinks={true}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-blue-950">
                <CheckCircle2 className="w-4 h-4 text-blue-700" /> Server-Side Rendering (SSR) Active
              </span>
              <p className="leading-relaxed">
                Server Express secara otomatis menginjeksi tag Open Graph (`og:title`, `og:image`, `og:url`)
                dan Schema.org JSON-LD ke dalam HTML mentah sebelum dikirim ke crawler mesin pencari dan WhatsApp bot.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Google Sitelinks */}
      {activeTab === 'sitelinks' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">
                Target Struktur Google Sitelinks
              </h3>
              <p className="text-slate-500">
                Google menampilkan sitelinks secara otomatis berdasarkan kejelasan struktur navigasi dan tautan internal.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px]">
              Struktur Sitelinks Memenuhi Syarat
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-3">
            <span className="font-bold text-slate-800 block text-xs">Target Format Hasil Google:</span>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-2">
              <h4 className="text-lg text-blue-800 font-medium">SMA Negeri 1 Julok</h4>
              <p className="text-xs text-emerald-800 font-mono">www.sman1julok.sch.id</p>
              <p className="text-xs text-slate-600">
                Portal resmi SMA Negeri 1 Julok, Aceh Timur. Berita, prestasi siswa, kurikulum, dan pendaftaran PPDB.
              </p>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2 rounded bg-slate-50">
                  <span className="font-bold text-blue-700 block">Beranda</span>
                  <span className="text-[10px] text-slate-500">sman1julok.sch.id</span>
                </div>
                <div className="p-2 rounded bg-slate-50">
                  <span className="font-bold text-blue-700 block">Profil</span>
                  <span className="text-[10px] text-slate-500">sman1julok.sch.id/profil</span>
                </div>
                <div className="p-2 rounded bg-slate-50">
                  <span className="font-bold text-blue-700 block">Berita</span>
                  <span className="text-[10px] text-slate-500">sman1julok.sch.id/berita</span>
                </div>
                <div className="p-2 rounded bg-slate-50">
                  <span className="font-bold text-blue-700 block">Akademik</span>
                  <span className="text-[10px] text-slate-500">sman1julok.sch.id/kurikulum</span>
                </div>
                <div className="p-2 rounded bg-slate-50">
                  <span className="font-bold text-blue-700 block">Galeri</span>
                  <span className="text-[10px] text-slate-500">sman1julok.sch.id/galeri-foto</span>
                </div>
                <div className="p-2 rounded bg-slate-50">
                  <span className="font-bold text-blue-700 block">Kontak</span>
                  <span className="text-[10px] text-slate-500">sman1julok.sch.id/kontak</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">Checklist Implementasi Sitelinks:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Struktur navigasi hierarkis dan konsisten</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Breadcrumb structured data Schema.org</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>XML Sitemap diperbarui otomatis ke /sitemap.xml</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Internal linking deskriptif pada setiap konten</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Robots & Sitemap */}
      {activeTab === 'robots' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" /> Editor Robots.txt
              </h3>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline flex items-center gap-1 font-semibold"
              >
                Buka /robots.txt <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <textarea
              rows={10}
              value={settings.robotsTxtContent}
              onChange={(e) => setSettings({ ...settings, robotsTxtContent: e.target.value })}
              className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 bg-slate-900 text-emerald-400"
            />
            <p className="text-slate-400 text-[11px]">
              Robots.txt memberi instruksi pada Googlebot dan crawler lain terkait rute yang diizinkan dan tautan sitemap.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" /> Dynamic XML Sitemap
              </h3>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline flex items-center gap-1 font-semibold"
              >
                Buka /sitemap.xml <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Karakteristik Sitemap SMAN 1 Julok:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Dihasilkan langsung secara dinamis oleh backend server.ts</li>
                <li>Mencakup seluruh 20+ halaman sekolah dengan prioritas sesuai fungsi</li>
                <li>Setiap artikel berita yang diterbitkan langsung otomatis masuk ke sitemap</li>
                <li>Header respons menggunakan <code>Content-Type: application/xml</code></li>
              </ul>
            </div>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition"
            >
              Lihat XML Sitemap Live <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Tab: Schema.org */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">
              Schema.org JSON-LD Structured Data
            </h3>
            <p className="text-slate-500">
              Berikut struktur data terformat yang disematkan di header dokumen untuk pengenalan institusi oleh Google AI dan Google Search:
            </p>
          </div>

          <div className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
            <pre>{`{
  "@context": "https://schema.org",
  "@type": "School",
  "name": "${settings.name}",
  "alternateName": "${settings.shortName}",
  "url": "${settings.website}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${settings.address}",
    "addressCountry": "ID"
  },
  "telephone": "${settings.phone}",
  "email": "${settings.email}"
}`}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
