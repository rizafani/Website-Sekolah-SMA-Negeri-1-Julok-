import React, { useState } from 'react';
import { UserCheck, Save, Key, ShieldCheck, Mail, Phone, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { ImageUploadField } from '../common/ImageUploadField.tsx';

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [nip, setNip] = useState(user?.nip || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateUser(user.id, {
        name,
        email,
        nip,
        bio,
        avatar,
        ...(password.trim() ? { password } : {}),
      });
      alert('Profil Anda berhasil diperbarui!');
      setPassword('');
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Profil Pengguna Saya
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi nama, NIP, foto avatar, bio publikasi, dan ganti kata sandi akun Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-slate-100 items-start">
          <div className="sm:col-span-1">
            <ImageUploadField
              label="Foto Profil / Avatar"
              value={avatar || user.avatar || ''}
              onChange={setAvatar}
              aspectRatio="square"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5 self-center">
            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
            <p className="text-xs text-slate-500 font-mono">@{user.username}</p>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
              {user.role} (Publikasi Mandiri)
            </span>
            <p className="text-xs text-slate-500 pt-2 leading-relaxed">
              Foto ini akan ditampilkan di kartu penulis setiap artikel berita yang Anda publikasikan di portal SMAN 1 Julok.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19740315 199903 1 002"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ganti Kata Sandi (Kosongkan jika tidak diganti)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi baru..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Bio Singkat / Mata Pelajaran Diampu
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Guru Fisika Senior & Pembina OSN..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-300" />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
