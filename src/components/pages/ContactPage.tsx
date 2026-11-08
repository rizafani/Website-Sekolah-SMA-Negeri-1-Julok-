import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api.ts';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitting(true);
    try {
      await api.submitContact({ name, email, phone, subject, message });
      setSentSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim pesan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 min-h-screen">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-blue-700">Layanan Informasi</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Hubungi SMA Negeri 1 Julok
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Kami siap melayani kebutuhan informasi seputar akademik, pendaftaran PPDB, legalisir ijazah, dan kemitraan pendidikan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info & Map (Left 5 cols) */}
        <div className="lg:col-span-5 space-y-6 text-xs">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Informasi Sekretariat Sekolah
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Alamat Kampus:</span>
                  <p className="text-slate-600 leading-relaxed mt-0.5">
                    Jl. Medan - Banda Aceh Km. 368, Blang Pauh Dua, Kec. Julok, Kab. Aceh Timur, Aceh 24458
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Telepon & WhatsApp:</span>
                  <p className="text-slate-600 mt-0.5">(0646) 7001234</p>
                  <a
                    href="https://api.whatsapp.com/send?phone=6282277889900&text=Halo%20Admin%20SMAN%201%20Julok"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold inline-flex items-center gap-1 hover:underline mt-0.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> +62 822-7788-9900 (WhatsApp)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Email Resmi:</span>
                  <p className="text-slate-600 mt-0.5 font-mono">info@sman1julok.sch.id</p>
                  <p className="text-slate-400 font-mono text-[11px]">sman1julok@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Jam Operasional Layanan:</span>
                  <p className="text-slate-600 mt-0.5">Senin - Kamis: 07.30 - 16.00 WIB</p>
                  <p className="text-slate-600">Jumat: 07.30 - 11.30 WIB</p>
                  <p className="text-slate-600">Sabtu: 07.30 - 14.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2">
            <span className="font-bold text-slate-800 block text-xs">Peta Lokasi Google Maps:</span>
            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <iframe
                title="Peta SMAN 1 Julok"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15904.793739714857!2d97.682!3d4.985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3037f37471850d99%3A0x67399990595d7eb8!2sJulok%2C%20East%20Aceh%20Regency%2C%20Aceh!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Contact Form (Right 7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">Kirimkan Pesan Anda</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sampaikan kritik, saran, atau pertanyaan Anda. Tim Humas SMAN 1 Julok akan merespons secepatnya.
              </p>
            </div>

            {sentSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pesan Anda berhasil dikirim ke sekretariat sekolah!
                </span>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bapak/Ibu/Alumni..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Perihal / Subjek *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Pertanyaan PPDB / Kerjasama"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Pesan Lengkap *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pesan pertanyaan atau permohonan informasi Anda secara terperinci..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  {submitting ? 'Mengirim...' : 'Kirimkan Pesan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
