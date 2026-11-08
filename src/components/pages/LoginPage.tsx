import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToHome }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
    setLoading(true);
    try {
      await login(user, pass);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        {/* Emblem */}
        <div
          onClick={onBackToHome}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 ring-4 ring-amber-400 p-2 mx-auto flex items-center justify-center cursor-pointer shadow-xl transform hover:scale-105 transition"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white">
            <polygon points="50,5 92,25 92,75 50,95 8,75 8,25" fill="#1e3a8a" stroke="#f59e0b" strokeWidth="4" />
            <path d="M50 15 L78 30 L50 45 L22 30 Z" fill="#f59e0b" />
            <circle cx="50" cy="50" r="10" fill="#ef4444" />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          CMS SMA NEGERI 1 JULOK
        </h2>
        <p className="text-xs text-slate-300">
          Sistem Manajemen Konten & Publikasi Instan Sekolah
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white text-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Username Akun
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin / editor / guru"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              {loading ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Pilihan Akun Uji Coba Cepat (1-Klik)
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="p-2.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 transition text-left flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-xs text-red-900 block">1. Administrator (Akses Penuh)</span>
                  <span className="text-[10px] text-red-700 font-mono">User: admin | Pass: admin123</span>
                </div>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                  Masuk Admin →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('editor', 'editor123')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition text-left flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-xs text-blue-900 block">2. Editor (Publikasi Instan Konten)</span>
                  <span className="text-[10px] text-blue-700 font-mono">User: editor | Pass: editor123</span>
                </div>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                  Masuk Editor →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('guru', 'guru123')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 transition text-left flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-xs text-emerald-900 block">3. Guru (Drs. M. Nasir, M.Pd - Fisika)</span>
                  <span className="text-[10px] text-emerald-700 font-mono">User: guru | Pass: guru123</span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                  Masuk Guru →
                </span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Utama Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
