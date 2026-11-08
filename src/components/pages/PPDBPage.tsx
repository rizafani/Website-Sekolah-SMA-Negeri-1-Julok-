import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Calendar,
  FileText,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api.ts';
import { PPDBRegistration } from '../../types/index.ts';
import { ImageUploadField } from '../common/ImageUploadField.tsx';

export const PPDBPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nisn: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    previousSchool: '',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    address: '',
    chosenTrack: 'Zonasi' as PPDBRegistration['chosenTrack'],
    photo: '',
  });

  const [registeredItem, setRegisteredItem] = useState<PPDBRegistration | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitPPDB(formData);
      setRegisteredItem(res.registration);
      // Trigger festive celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim pendaftaran');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 min-h-screen">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow inline-block">
          PPDB Online TP 2026/2027
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Penerimaan Peserta Didik Baru SMAN 1 Julok
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Selamat datang calon peserta didik baru! Bergabunglah bersama keluarga besar SMA Negeri 1 Julok,
          sekolah rujukan berakreditasi A (Unggul) yang siap mengantarkan Anda meraih prestasi tingkat nasional dan menembus PTN favorit.
        </p>
      </div>

      {/* If registration proof card is available, show card */}
      {registeredItem ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Pendaftaran Berhasil Dikirimkan!
            </span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" /> Cetak Kartu Bukti
            </button>
          </div>

          {/* Printable Registration Proof Card */}
          <div
            id="printable-card"
            className="bg-white rounded-3xl p-8 border-2 border-blue-900 shadow-xl space-y-6 print:shadow-none print:border-black"
          >
            {/* Card Header with School Crest */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white p-2 flex items-center justify-center ring-2 ring-amber-400">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                    <polygon points="50,5 92,25 92,75 50,95 8,75 8,25" fill="#1e3a8a" stroke="#f59e0b" strokeWidth="4" />
                    <path d="M50 15 L78 30 L50 45 L22 30 Z" fill="#f59e0b" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">SMA NEGERI 1 JULOK</h3>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB)
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Jl. Medan - Banda Aceh Km. 368, Blang Pauh Dua, Julok, Aceh Timur
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">KODE BUKTI:</span>
                <span className="text-sm font-black font-mono text-blue-900">{registeredItem.regNumber}</span>
              </div>
            </div>

            <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-black text-base text-slate-900 uppercase tracking-wider">
                KARTU BUKTI PENDAFTARAN ONLINE
              </h4>
              <p className="text-[11px] text-slate-500">Tahun Ajaran 2026/2027 • Jalur {registeredItem.chosenTrack}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {registeredItem.photo && (
                <div className="w-28 h-36 shrink-0 rounded-xl overflow-hidden border-2 border-slate-300 shadow-xs bg-slate-100">
                  <img
                    src={registeredItem.photo}
                    alt={registeredItem.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 w-full">
                <table className="w-full text-xs text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 w-44 font-semibold">Nomor Registrasi</td>
                  <td className="py-2 font-mono font-bold text-blue-900">{registeredItem.regNumber}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">Nama Lengkap Siswa</td>
                  <td className="py-2 font-bold text-slate-900">{registeredItem.fullName}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">NISN</td>
                  <td className="py-2 font-mono">{registeredItem.nisn}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">Tempat, Tanggal Lahir</td>
                  <td className="py-2">{registeredItem.birthPlace}, {registeredItem.birthDate}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">Jenis Kelamin</td>
                  <td className="py-2">{registeredItem.gender}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">Asal SMP / MTs</td>
                  <td className="py-2 font-semibold text-slate-900">{registeredItem.previousSchool}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">Nama Orang Tua / Wali</td>
                  <td className="py-2">{registeredItem.parentName || '-'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">Kontak WhatsApp</td>
                  <td className="py-2 font-mono">{registeredItem.phone}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-500 font-semibold">Waktu Pendaftaran</td>
                  <td className="py-2 font-mono text-slate-500">
                    {new Date(registeredItem.submittedAt).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">QR Verifikasi Sistem:</span>
                <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center font-mono text-[9px] text-slate-400">
                  [QR VALID]
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[11px] text-slate-500">Julok, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-[11px] font-bold text-slate-800">Panitia PPDB SMAN 1 Julok</p>
                <div className="h-10"></div>
                <p className="text-[10px] text-slate-400 font-mono">Cap Resmi Satuan Pendidikan</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200">
              <strong>Catatan:</strong> Bawa kartu bukti ini beserta dokumen asli (Ijazah/SKL, Kartu Keluarga, Akta Kelahiran)
              saat proses verifikasi berkas fisik di sekretariat sekolah.
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setRegisteredItem(null)}
              className="text-xs text-blue-700 font-bold hover:underline"
            >
              ← Kembali ke Formulir Pendaftaran Baru
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Information & Timeline (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tracks */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Jalur Pendaftaran & Kuota
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                  <div className="flex justify-between font-bold text-blue-900">
                    <span>1. Jalur Zonasi</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">50%</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Bagi calon siswa yang berdomisili di wilayah zonasi Kecamatan Julok dan sekitarnya.</p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                  <div className="flex justify-between font-bold text-amber-950">
                    <span>2. Jalur Prestasi</span>
                    <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-[10px]">30%</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Berdasarkan nilai rapor rata-rata serta sertifikat kejuaraan sains, seni, tahfidz, atau olahraga.</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <div className="flex justify-between font-bold text-emerald-950">
                    <span>3. Jalur Afirmasi</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px]">15%</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Bagi calon peserta didik dari keluarga ekonomi tidak mampu (KIP/PKH).</p>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                  <div className="flex justify-between font-bold text-purple-950">
                    <span>4. Perpindahan Tugas Orang Tua</span>
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-[10px]">5%</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Bagi calon siswa yang orang tua/walinya dipindahtugaskan dinas resmi.</p>
                </div>
              </div>
            </div>

            {/* Syarat Pendaftaran */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Persyaratan Berkas Dokumen
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SMP/MTs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nomor Induk Siswa Nasional (NISN) aktif</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fotokopi Kartu Keluarga (KK) & Akta Kelahiran</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pasfoto berwarna ukuran 3x4 (3 lembar)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Piagam kejuaraan / sertifikat tahfidz (untuk jalur prestasi)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Registration Form (Right 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-900">
                  Formulir Pendaftaran Siswa Baru
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Isi formulir secara cermat sesuai data pada Akta Kelahiran dan Kartu Keluarga Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Jalur Pendaftaran Pilihan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.chosenTrack}
                    onChange={(e) => setFormData({ ...formData, chosenTrack: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold text-blue-900 bg-white outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  >
                    <option value="Zonasi">Jalur Zonasi (Domisili Kecamatan Julok)</option>
                    <option value="Prestasi">Jalur Prestasi (Nilai Rapor & Piagam Juara)</option>
                    <option value="Afirmasi">Jalur Afirmasi (KIP / PKH / Dhuafa)</option>
                    <option value="Perpindahan Orang Tua">Jalur Perpindahan Tugas Orang Tua</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Calon Siswa (Sesuai Ijazah) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Muhammad Raihan Pratama"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor Induk Siswa Nasional (NISN) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      placeholder="0089283741"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      placeholder="Julok"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Sekolah Asal (SMP / MTs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    placeholder="SMP Negeri 1 Julok"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      No. WhatsApp / HP Siswa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="081269001234"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Email (Opsional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="siswa@gmail.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Nama Ayah/Ibu"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">No. HP Orang Tua</label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="081370005678"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Tempat Tinggal</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Gampong Blang Pauh Dua, Kec. Julok, Kab. Aceh Timur"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Pas Foto Calon Siswa (Ukuran 3x4)"
                    value={formData.photo}
                    onChange={(url) => setFormData({ ...formData, photo: url })}
                    aspectRatio="portrait"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Data Anda aman dan dilindungi pihak sekolah.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {submitting ? 'Mengirim Data...' : 'Kirim Pendaftaran Online'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
