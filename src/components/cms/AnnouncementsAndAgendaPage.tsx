import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  PlusCircle,
  Trash2,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
  X,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Announcement, AgendaItem } from '../../types/index.ts';

export const AnnouncementsAndAgendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'agenda'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New announcement modal
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annUrgent, setAnnUrgent] = useState(false);
  const [annFileUrl, setAnnFileUrl] = useState('');
  const [annFileName, setAnnFileName] = useState('');

  // New agenda modal
  const [showAgdModal, setShowAgdModal] = useState(false);
  const [agdTitle, setAgdTitle] = useState('');
  const [agdDate, setAgdDate] = useState('');
  const [agdEndDate, setAgdEndDate] = useState('');
  const [agdTime, setAgdTime] = useState('08:00 - 12:00 WIB');
  const [agdLocation, setAgdLocation] = useState('Kampus SMAN 1 Julok');
  const [agdDescription, setAgdDescription] = useState('');
  const [agdOrganizer, setAgdOrganizer] = useState('SMAN 1 Julok');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [annData, agdData] = await Promise.all([
        api.getAnnouncements(),
        api.getAgenda(),
      ]);
      setAnnouncements(annData);
      setAgenda(agdData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    try {
      const item = await api.createAnnouncement({
        title: annTitle,
        content: annContent,
        isUrgent: annUrgent,
        fileUrl: annFileUrl,
        fileName: annFileName,
      });
      setAnnouncements([item, ...announcements]);
      setShowAnnModal(false);
      setAnnTitle('');
      setAnnContent('');
      setAnnUrgent(false);
      setAnnFileUrl('');
      setAnnFileName('');
      alert('Pengumuman resmi berhasil diterbitkan!');
    } catch (err: any) {
      alert(err.message || 'Gagal menerbitkan pengumuman');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return;
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal');
    }
  };

  const handleCreateAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agdTitle || !agdDate) return;
    try {
      const item = await api.createAgenda({
        title: agdTitle,
        date: agdDate,
        endDate: agdEndDate,
        time: agdTime,
        location: agdLocation,
        description: agdDescription,
        organizer: agdOrganizer,
      });
      setAgenda([...agenda, item]);
      setShowAgdModal(false);
      setAgdTitle('');
      setAgdDate('');
      setAgdEndDate('');
      setAgdDescription('');
      alert('Agenda sekolah berhasil ditambahkan ke kalender!');
    } catch (err: any) {
      alert(err.message || 'Gagal');
    }
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!confirm('Hapus agenda ini?')) return;
    try {
      await api.deleteAgenda(id);
      setAgenda(agenda.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal');
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengumuman Resmi & Agenda Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pemberitahuan resmi kedinasan dan kalender kegiatan civitas akademika SMAN 1 Julok.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'announcements' ? (
            <button
              onClick={() => setShowAnnModal(true)}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" /> Buat Pengumuman Baru
            </button>
          ) : (
            <button
              onClick={() => setShowAgdModal(true)}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" /> Tambah Agenda Baru
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'announcements' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" /> Pengumuman Resmi ({announcements.length})
        </button>

        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'agenda' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Kalender & Agenda ({agenda.length})
        </button>
      </div>

      {/* Tab Content: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                ann.isUrgent ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  {ann.isUrgent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" /> Penting
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(ann.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-slate-500">• Oleh: <strong>{ann.authorName}</strong></span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                {ann.fileName && (
                  <span className="inline-block text-[11px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Lampiran: {ann.fileName}
                  </span>
                )}
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                  className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                  title="Hapus Pengumuman"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Agenda */}
      {activeTab === 'agenda' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agenda.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                  </span>
                  <button
                    onClick={() => handleDeleteAgenda(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    title="Hapus Agenda"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.time}
                </span>
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Announcement */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-700" /> Terbitkan Pengumuman Resmi
              </h3>
              <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Informasi Pelaksanaan Ujian PAS Genap 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Surat / Pengumuman *</label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Tuliskan isi pengumuman lengkap..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Dokumen Lampiran (Opsional)</label>
                  <input
                    type="text"
                    value={annFileName}
                    onChange={(e) => setAnnFileName(e.target.value)}
                    placeholder="Brosur_PPDB_2026.pdf"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL File Lampiran (Opsional)</label>
                  <input
                    type="text"
                    value={annFileUrl}
                    onChange={(e) => setAnnFileUrl(e.target.value)}
                    placeholder="/docs/brosur_ppdb_2026.pdf"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={annUrgent}
                  onChange={(e) => setAnnUrgent(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="urgentCheck" className="font-semibold text-slate-800 select-none cursor-pointer">
                  Tandai sebagai Pengumuman PENTING (Badge Amber/Merah)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800"
                >
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Agenda */}
      {showAgdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" /> Tambah Agenda Sekolah
              </h3>
              <button onClick={() => setShowAgdModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAgenda} className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Agenda Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={agdTitle}
                  onChange={(e) => setAgdTitle(e.target.value)}
                  placeholder="Simulasi CBT UTBK-SNBT 2026 Mandiri"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    value={agdDate}
                    onChange={(e) => setAgdDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Selesai (Opsional)</label>
                  <input
                    type="date"
                    value={agdEndDate}
                    onChange={(e) => setAgdEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    value={agdTime}
                    onChange={(e) => setAgdTime(e.target.value)}
                    placeholder="08:00 - 12:30 WIB"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={agdLocation}
                    onChange={(e) => setAgdLocation(e.target.value)}
                    placeholder="Aula Cut Meutia SMAN 1 Julok"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Penyelenggara / Penanggung Jawab</label>
                <input
                  type="text"
                  value={agdOrganizer}
                  onChange={(e) => setAgdOrganizer(e.target.value)}
                  placeholder="OSIS SMAN 1 Julok / Tim Bimbingan Konseling"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kegiatan</label>
                <textarea
                  rows={3}
                  value={agdDescription}
                  onChange={(e) => setAgdDescription(e.target.value)}
                  placeholder="Rincian agenda atau instruksi bagi peserta..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAgdModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
