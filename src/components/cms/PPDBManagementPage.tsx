import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  UserCheck,
  Eye,
  FileText,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { PPDBRegistration } from '../../types/index.ts';

export const PPDBManagementPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<PPDBRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedApplicant, setSelectedApplicant] = useState<PPDBRegistration | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getPPDBList();
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: PPDBRegistration['status']) => {
    try {
      const res = await api.updatePPDBStatus(id, newStatus);
      setRegistrations(registrations.map((r) => (r.id === id ? res.registration : r)));
      if (selectedApplicant?.id === id) {
        setSelectedApplicant(res.registration);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status');
    }
  };

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.fullName.toLowerCase().includes(q) ||
      r.nisn.includes(q) ||
      r.regNumber.toLowerCase().includes(q) ||
      r.previousSchool.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (selectedTrack !== 'Semua' && r.chosenTrack !== selectedTrack) return false;
    if (selectedStatus !== 'Semua' && r.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Penerimaan Peserta Didik Baru (PPDB 2026/2027)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data pendaftar calon siswa baru SMA Negeri 1 Julok jalur Zonasi, Prestasi, Afirmasi, dan Mutasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-800 font-bold text-xs rounded-xl border border-blue-200">
            Total Pendaftar: {registrations.length}
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan No. Registrasi, Nama, NISN, atau Asal Sekolah..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 outline-none"
          >
            <option value="Semua">Semua Jalur</option>
            <option value="Zonasi">Jalur Zonasi (50%)</option>
            <option value="Prestasi">Jalur Prestasi (30%)</option>
            <option value="Afirmasi">Jalur Afirmasi (15%)</option>
            <option value="Perpindahan Orang Tua">Jalur Perpindahan (5%)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="verified">Berkas Terverifikasi</option>
            <option value="accepted">Dinyatakan Diterima</option>
            <option value="rejected">Ditolak / Berkas Tidak Lengkap</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat data pendaftar...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">Tidak ada pendaftar yang cocok</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Registrasi</th>
                  <th className="py-3.5 px-4">Nama Lengkap & NISN</th>
                  <th className="py-3.5 px-4">Asal Sekolah</th>
                  <th className="py-3.5 px-4">Jalur Pilihan</th>
                  <th className="py-3.5 px-4">No. Kontak</th>
                  <th className="py-3.5 px-4 text-center">Status Berkas</th>
                  <th className="py-3.5 px-4 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {r.regNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{r.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">NISN: {r.nisn}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {r.previousSchool}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {r.chosenTrack}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {r.phone}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          r.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'verified'
                            ? 'bg-blue-100 text-blue-800'
                            : r.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status === 'accepted'
                          ? 'DITERIMA'
                          : r.status === 'verified'
                          ? 'TERVERIFIKASI'
                          : r.status === 'rejected'
                          ? 'DITOLAK'
                          : 'PENDING'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedApplicant(r)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                      >
                        Detail
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(r.id, 'verified')}
                        title="Verifikasi Berkas"
                        className="p-1 rounded-lg text-blue-600 hover:bg-blue-50"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(r.id, 'accepted')}
                        title="Terima Siswa"
                        className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(r.id, 'rejected')}
                        title="Tolak"
                        className="p-1 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">
                Detail Berkas: {selectedApplicant.regNumber}
              </h3>
              <button onClick={() => setSelectedApplicant(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Lengkap</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedApplicant.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">NISN</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedApplicant.nisn}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tempat, Tanggal Lahir</span>
                  <span className="text-slate-800">{selectedApplicant.birthPlace}, {selectedApplicant.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Jenis Kelamin</span>
                  <span className="text-slate-800">{selectedApplicant.gender}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Asal Sekolah</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.previousSchool}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Jalur Pilihan</span>
                  <span className="text-blue-800 font-bold">{selectedApplicant.chosenTrack}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Orang Tua / Wali</span>
                  <span className="text-slate-800">{selectedApplicant.parentName || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">No. HP Orang Tua</span>
                  <span className="text-slate-800 font-mono">{selectedApplicant.parentPhone || '-'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat Rumah</span>
                <span className="text-slate-800">{selectedApplicant.address || '-'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
