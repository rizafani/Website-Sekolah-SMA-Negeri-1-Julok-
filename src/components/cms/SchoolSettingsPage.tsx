import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Database,
  Download,
  UploadCloud,
  CheckCircle2,
  Building,
  UserCheck,
  Phone,
  Share2,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { SchoolSettings } from '../../types/index.ts';
import { ImageUploadField } from '../common/ImageUploadField.tsx';

export const SchoolSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [restoreJson, setRestoreJson] = useState('');
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await api.updateSettings(settings);
      alert('Identitas dan pengaturan sekolah berhasil diperbarui!');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreJson.trim()) {
      alert('Masukkan konten JSON backup untuk dipulihkan');
      return;
    }
    if (!confirm('Peringatan: Pemulihan backup akan menimpa database saat ini. Lanjutkan?')) return;

    setRestoring(true);
    try {
      const parsed = JSON.parse(restoreJson);
      await api.restoreBackup(parsed);
      alert('Database berhasil dipulihkan dari data backup!');
      setRestoreJson('');
      api.getSettings().then(setSettings);
    } catch (err: any) {
      alert('Format JSON tidak valid atau gagal dipulihkan: ' + err.message);
    } finally {
      setRestoring(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-slate-500">Memuat profil sekolah...</div>;
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Identitas Sekolah & Backup Database
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola profil kelembagaan SMA Negeri 1 Julok, sambutan pimpinan, kontak, dan backup database sistem.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-amber-300" />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form (Left 2 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6 text-xs">
          {/* Kelembagaan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-700" /> Identitas Satuan Pendidikan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Resmi Sekolah</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Singkat / Brand</label>
                <input
                  type="text"
                  value={settings.shortName}
                  onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Pokok Sekolah Nasional (NPSN)</label>
                <input
                  type="text"
                  value={settings.npsn}
                  onChange={(e) => setSettings({ ...settings, npsn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status Akreditasi</label>
                <input
                  type="text"
                  value={settings.akreditasi}
                  onChange={(e) => setSettings({ ...settings, akreditasi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Slogan & Motto Sekolah</label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Kepala Sekolah */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" /> Data Kepala Sekolah
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={settings.headmasterName}
                  onChange={(e) => setSettings({ ...settings, headmasterName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={settings.headmasterNip}
                  onChange={(e) => setSettings({ ...settings, headmasterNip: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>

            <div>
              <ImageUploadField
                label="Foto Resmi Kepala Sekolah"
                value={settings.headmasterPhoto}
                onChange={(url) => setSettings({ ...settings, headmasterPhoto: url })}
                aspectRatio="portrait"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Sambutan Resmi Kepala Sekolah</label>
              <textarea
                rows={5}
                value={settings.headmasterWelcome}
                onChange={(e) => setSettings({ ...settings, headmasterWelcome: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Kontak & Media Sosial */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-700" /> Kontak & Lokasi Sekolah
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Telepon Kantor</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">WhatsApp Resmi</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Resmi</label>
                <input
                  type="text"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Database Backup & Restore Column (Right 1 col) */}
        <div className="space-y-6 text-xs">
          {/* Download Backup */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" /> Ekspor Backup Database
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Unduh salinan cadangan lengkap seluruh artikel, data pendaftar PPDB, berita, dan pengaturan sistem dalam format JSON.
            </p>
            <a
              href="/api/backup"
              download
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" /> Unduh Backup JSON
            </a>
          </div>

          {/* Restore Database */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-red-600" /> Pulihkan Database (Restore)
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Tempelkan isi file JSON cadangan di bawah ini untuk mengembalikan kondisi sistem ke salinan sebelumnya:
            </p>

            <textarea
              rows={6}
              value={restoreJson}
              onChange={(e) => setRestoreJson(e.target.value)}
              placeholder="Paste JSON backup di sini..."
              className="w-full p-2.5 font-mono text-[11px] border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50"
            />

            <button
              onClick={handleRestore}
              disabled={restoring || !restoreJson.trim()}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              {restoring ? 'Memulihkan...' : 'Pulihkan Database Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
