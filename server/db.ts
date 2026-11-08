import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Article,
  Category,
  StaticPage,
  Announcement,
  AgendaItem,
  GalleryItem,
  Teacher,
  Facility,
  Achievement,
  Extracurricular,
  Comment,
  PPDBRegistration,
  ContactMessage,
  SchoolSettings,
  VisitorStats,
  ActivityLog,
  MediaFile,
} from '../src/types/index.ts';

export interface DatabaseSchema {
  users: User[];
  articles: Article[];
  categories: Category[];
  pages: StaticPage[];
  announcements: Announcement[];
  agenda: AgendaItem[];
  gallery: GalleryItem[];
  teachers: Teacher[];
  facilities: Facility[];
  achievements: Achievement[];
  extracurriculars: Extracurricular[];
  comments: Comment[];
  ppdb: PPDBRegistration[];
  contactMessages: ContactMessage[];
  settings: SchoolSettings;
  stats: VisitorStats;
  logs: ActivityLog[];
  media: MediaFile[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultSettings: SchoolSettings = {
  name: 'SMA NEGERI 1 JULOK',
  shortName: 'SMAN 1 Julok',
  npsn: '10102146',
  akreditasi: 'A (Unggul)',
  slogan: 'Unggul dalam Prestasi, Berkarakter, Berakhlak Mulia, dan Berwawasan Lingkungan',
  headmasterName: 'Drs. H. Bakhtiar, M.Pd',
  headmasterNip: '19680512 199303 1 005',
  headmasterWelcome: `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di website resmi SMA Negeri 1 Julok, Kabupaten Aceh Timur. Puji dan syukur kita panjatkan ke hadirat Allah SWT atas rahmat dan karunia-Nya, sehingga website sekolah ini dapat hadir sebagai jendela informasi, wadah transparansi, dan sarana komunikasi antara sekolah dengan masyarakat, orang tua peserta didik, dan segenap civitas akademika.\n\nDi era revolusi digital dan transformasi pendidikan Kurikulum Merdeka, SMA Negeri 1 Julok berkomitmen untuk senantiasa melahirkan generasi unggul yang tidak hanya cakap dalam ilmu pengetahuan dan teknologi (IPTEK), namun juga kokoh dalam keimanan dan ketaqwaan (IMTAQ). Kami terus berbenah melengkapi sarana prasarana modern, membimbing bakat sains dan seni, serta membina karakter siswa berlandaskan syariat dan kearifan lokal Aceh.\n\nSemoga portal resmi ini memberikan manfaat sebesar-besarnya dalam memajukan mutu pendidikan di Aceh Timur dan Indonesia.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`,
  headmasterPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=750&q=80',
  address: 'Jl. Medan - Banda Aceh Km. 368, Blang Pauh Dua, Kec. Julok, Kab. Aceh Timur, Aceh 24458',
  phone: '(0646) 7001234',
  whatsapp: '+6282277889900',
  email: 'info@sman1julok.sch.id',
  website: 'https://sman1julok.sch.id',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15904.793739714857!2d97.682!3d4.985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3037f37471850d99%3A0x67399990595d7eb8!2sJulok%2C%20East%20Aceh%20Regency%2C%20Aceh!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  facebook: 'https://facebook.com/sman1julok',
  instagram: 'https://instagram.com/sman1julok_official',
  youtube: 'https://youtube.com/@sman1julokofficial',
  twitter: 'https://twitter.com/sman1julok',
  seoTitle: 'SMA Negeri 1 Julok - Unggul dalam Prestasi dan Berakhlak Mulia',
  metaDescription: 'Portal resmi SMA Negeri 1 Julok, Aceh Timur. Informasi akademik, berita kegiatan, pendaftaran PPDB online, prestasi siswa, dan galeri sekolah.',
  metaKeywords: 'SMA Negeri 1 Julok, SMAN 1 Julok, SMA Aceh Timur, PPDB SMA Julok, Sekolah Penggerak Aceh',
  canonicalBase: 'https://sman1julok.sch.id',
  googleVerification: 'google-site-verification-sman1julok-sample',
  analyticsId: 'G-SMAN1JULOK',
  ogImageDefault: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=630&q=80',
  robotsTxtContent: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /editor
Disallow: /guru
Disallow: /api/

Sitemap: https://sman1julok.sch.id/sitemap.xml`,
};

function getInitialSeedData(): DatabaseSchema {
  const adminHash = bcrypt.hashSync('admin123', 10);
  const editorHash = bcrypt.hashSync('editor123', 10);
  const guruHash = bcrypt.hashSync('guru123', 10);

  const users: User[] = [
    {
      id: 'usr_admin',
      username: 'admin',
      name: 'Super Administrator SMAN 1 Julok',
      role: 'admin',
      email: 'admin@sman1julok.sch.id',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Kepala Pusat Data & Pengelola Sistem Informasi SMA Negeri 1 Julok.',
      password: adminHash,
      createdAt: '2026-01-01T08:00:00Z',
    },
    {
      id: 'usr_editor',
      username: 'editor',
      name: 'Rahmat Hidayat, S.Kom',
      role: 'editor',
      email: 'editor@sman1julok.sch.id',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Staff Humas & Redaktur Pelaksana Website SMA Negeri 1 Julok.',
      password: editorHash,
      createdAt: '2026-01-05T09:00:00Z',
    },
    {
      id: 'usr_guru1',
      username: 'guru',
      name: 'Drs. Muhammad Nasir, M.Pd',
      role: 'guru',
      email: 'm.nasir@sman1julok.sch.id',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      nip: '19740315 199903 1 002',
      bio: 'Guru Fisika Senior & Pembina Olimpiade Sains Nasional (OSN).',
      password: guruHash,
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'usr_guru2',
      username: 'cutnyak',
      name: 'Cut Nyak Marlina, S.Pd',
      role: 'guru',
      email: 'cutnyak@sman1julok.sch.id',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
      nip: '19820719 200604 2 018',
      bio: 'Guru Bahasa & Sastra Indonesia, Pembina Majalah Dinding & Jurnalistik.',
      password: guruHash,
      createdAt: '2026-01-12T11:00:00Z',
    },
  ];

  const categories: Category[] = [
    { id: 'cat_1', name: 'Berita Sekolah', slug: 'berita-sekolah', description: 'Kabar dan peristiwa seputar kegiatan SMA Negeri 1 Julok' },
    { id: 'cat_2', name: 'Prestasi Siswa', slug: 'prestasi-siswa', description: 'Capaian gemilang putra-putri SMAN 1 Julok di berbagai ajang lomba' },
    { id: 'cat_3', name: 'Akademik & Kurikulum', slug: 'akademik-kurikulum', description: 'Informasi proses belajar mengajar, Kurikulum Merdeka, dan asesmen' },
    { id: 'cat_4', name: 'Kegiatan OSIS & Ekskul', slug: 'kegiatan-osis-ekskul', description: 'Dinamika organisasi kesiswaan dan ekstrakurikuler' },
    { id: 'cat_5', name: 'Opini & Karya Guru', slug: 'opini-karya-guru', description: 'Tulisan inspiratif dan publikasi ilmiah dewan guru' },
    { id: 'cat_6', name: 'Pengumuman Resmi', slug: 'pengumuman-resmi', description: 'Pemberitahuan kedinasan dan informasi umum sekolah' },
  ];

  const articles: Article[] = [
    {
      id: 'art_1',
      slug: 'siswa-sman-1-julok-raih-medali-emas-osn-provinsi-aceh-2026',
      title: 'Siswa SMAN 1 Julok Raih Medali Emas Olimpiade Sains Nasional (OSN) Tingkat Provinsi Aceh 2026',
      content: `<h2>Prestasi Gemilang Tingkat Provinsi</h2>
<p>Kabar membanggakan kembali dipersembahkan oleh putra daerah Aceh Timur. Ananda <strong>Teuku Al-Fathan</strong>, siswa kelas XI MIPA 1 SMA Negeri 1 Julok, berhasil meraih <em>Medali Emas bidang Fisika Terapan</em> pada ajang bergengsi <strong>Olimpiade Sains Nasional (OSN) Tingkat Provinsi Aceh Tahun 2026</strong> yang diselenggarakan oleh Balai Pengembangan Talenta Indonesia (BPTI).</p>

<h3>Persiapan Matang dan Bimbingan Intensif</h3>
<p>Prestasi ini merupakan buah dari pembinaan terstruktur yang dipimpin langsung oleh guru pembina sains, Drs. Muhammad Nasir, M.Pd, bersama tim laboratorium fisika sekolah. Selama empat bulan terakhir, siswa menjalani pemantapan materi teori lanjutan, telaah soal-soal olimpiade internasional, serta praktikum eksperimen mandiri.</p>

<blockquote>"Alhamdulillah, keberhasilan ini adalah bukti bahwa anak-anak Julok memiliki daya saing luar biasa dan mampu bersanding di level tertinggi. Semoga di putaran nasional nanti kita kembali mengharumkan nama Aceh," ujar Kepala Sekolah SMAN 1 Julok, Drs. H. Bakhtiar, M.Pd.</blockquote>

<h3>Tahap Menuju Seleksi Nasional di Jakarta</h3>
<p>Sebagai juara pertama tingkat provinsi, Teuku Al-Fathan berhak mewakili Kontingen Provinsi Aceh pada putaran final OSN Nasional yang dijadwalkan berlangsung di Jakarta pada bulan Mei 2026 mendatang. Seluruh civitas akademika menghaturkan doa restu agar perjuangan ananda membuahkan hasil terbaik.</p>`,
      excerpt: 'Siswa SMAN 1 Julok, Teuku Al-Fathan, berhasil membawa pulang medali emas bidang Fisika pada OSN Tingkat Provinsi Aceh 2026 dan siap melaju ke babak nasional.',
      featuredImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=700&q=80',
      category: 'Prestasi Siswa',
      tags: ['OSN 2026', 'Fisika', 'Prestasi Siswa', 'Aceh Timur', 'Kemdikbud'],
      authorId: 'usr_guru1',
      authorName: 'Drs. Muhammad Nasir, M.Pd',
      authorRole: 'guru',
      status: 'published',
      publishedAt: '2026-03-02T09:30:00Z',
      createdAt: '2026-03-02T08:15:00Z',
      updatedAt: '2026-03-02T09:30:00Z',
      views: 1420,
      seoTitle: 'Siswa SMAN 1 Julok Raih Medali Emas OSN Tingkat Provinsi Aceh 2026',
      metaDescription: 'Prestasi membanggakan siswa SMAN 1 Julok meraih medali emas OSN Fisika tingkat Provinsi Aceh 2026 dan melaju ke babak nasional.',
      canonicalUrl: 'https://sman1julok.sch.id/berita/siswa-sman-1-julok-raih-medali-emas-osn-provinsi-aceh-2026',
      ogImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=630&q=80',
      altImage: 'Penyerahan medali emas OSN Provinsi oleh Kepala Sekolah kepada siswa SMAN 1 Julok',
      focusKeyword: 'SMAN 1 Julok OSN Emas',
    },
    {
      id: 'art_2',
      slug: 'gelar-karya-p5-berbasis-kearifan-lokal-aceh-di-sman-1-julok',
      title: 'Gelar Karya P5: Menggali Nilai Kearifan Lokal dan Kewirausahaan Kreatif Pelajar Aceh',
      content: `<h2>Semarak Festival Budaya dan Inovasi Siswa</h2>
<p>Suasana lapangan utama SMA Negeri 1 Julok tampak semarak dengan berdirinya puluhan stan kreatif siswa dalam gelaran <strong>Pameran Karya Projek Penguatan Profil Pelajar Pancasila (P5)</strong> semester ini. Mengusung tema besar <em>"Kearifan Lokal dan Kewirausahaan Berkelanjutan"</em>, ratusan siswa kelas X dan XI menampilkan berbagai produk olahan pangan khas Aceh Timur serta kerajinan anyaman tradisional pandan.</p>

<h3>Mengintegrasikan Nilai Luhur Budaya</h3>
<p>Koordinator P5 sekolah, Cut Nyak Marlina, S.Pd, menjelaskan bahwa kegiatan ini bukan sekadar pameran, melainkan proses asesmen holistik terhadap enam dimensi profil pelajar Pancasila: beriman bertakwa, mandiri, bergotong royong, bernalar kritis, kreatif, dan berkebinekaan global.</p>

<ul>
  <li><strong>Olahan Pangan Khas:</strong> Meuseukat modifikasi buah nipah pesisir, dodol pulut kelapa pandan, dan minuman herbal rempah aceh.</li>
  <li><strong>Kerajinan Tangan:</strong> Pemanfaatan limbah sabut kelapa menjadi pot gantung estetik dan kerajinan sulam kasab khas Aceh Timur.</li>
  <li><strong>Pentas Seni:</strong> Penampilan tari Ranup Lampuan dan Seudati yang dibawakan langsung oleh sanggar tari sekolah.</li>
</ul>

<p>Acara ini turut dihadiri oleh Pengawas Pembina Cabang Dinas Pendidikan Wilayah Aceh Timur serta perwakilan komite sekolah yang memberikan apresiasi tinggi atas kreasi mandiri siswa.</p>`,
      excerpt: 'SMAN 1 Julok menggelar pameran karya Projek Penguatan Profil Pelajar Pancasila (P5) mengangkat kearifan lokal kuliner dan kerajinan khas Aceh Timur.',
      featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=700&q=80',
      category: 'Akademik & Kurikulum',
      tags: ['Kurikulum Merdeka', 'P5', 'Kearifan Lokal', 'Aceh Timur', 'Seni Budaya'],
      authorId: 'usr_guru2',
      authorName: 'Cut Nyak Marlina, S.Pd',
      authorRole: 'guru',
      status: 'published',
      publishedAt: '2026-02-24T10:00:00Z',
      createdAt: '2026-02-24T09:00:00Z',
      updatedAt: '2026-02-24T10:00:00Z',
      views: 980,
      seoTitle: 'Gelar Karya P5 Kearifan Lokal dan Kewirausahaan Siswa SMAN 1 Julok',
      metaDescription: 'Pameran gelar karya P5 SMAN 1 Julok tampilkan kreasi kuliner lokal dan kerajinan anyaman siswa Kurikulum Merdeka.',
      canonicalUrl: 'https://sman1julok.sch.id/berita/gelar-karya-p5-berbasis-kearifan-lokal-aceh-di-sman-1-julok',
      ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=630&q=80',
      altImage: 'Suasana stan pameran kewirausahaan siswa P5 di halaman sekolah',
      focusKeyword: 'Gelar Karya P5 SMAN 1 Julok',
    },
    {
      id: 'art_3',
      slug: 'peringatan-maulid-nabi-muhammad-saw-1447-h-di-sman-1-julok',
      title: 'Peringatan Maulid Nabi Muhammad SAW 1447 H: Meneladani Akhlak Mulia Rasulullah SAW',
      content: `<h2>Kidung Shalawat Menggema di Kampus SMAN 1 Julok</h2>
<p>Dalam rangka menumbuhkan kecintaan kepada Baginda Nabi Muhammad SAW dan mempererat tali silaturahmi antar-warga sekolah, SMA Negeri 1 Julok menyelenggarakan peringatan <strong>Maulid Nabi Muhammad SAW 1447 Hijriah</strong> dengan khidmat dan meriah.</p>

<p>Kegiatan diawali dengan pembacaan Al-Qur'an secara tartil, shalawat Badar bersama pengurus Rohis, serta tausiyah agama yang disampaikan oleh Tgk. H. Munawar Ismail dari Idi Rayeuk.</p>

<h3>Santunan Anak Yatim dan Idang Meulapeh</h3>
<p>Tradisi khas Aceh <em>Kenduri Maulid</em> dengan sajian <em>Idang Meulapeh</em> menjadi pemandangan penuh berkah di aula sekolah. Dewan guru, staf tata usaha, serta orang tua siswa bekerja sama menyediakan hidangan berkah serta menyerahkan santunan kepada 35 siswa yatim piatu di lingkungan sekolah.</p>`,
      excerpt: 'SMAN 1 Julok memperingati Maulid Nabi Muhammad SAW 1447 H dengan tausiyah keagamaan, shalawat akbar, dan santunan anak yatim piatu.',
      featuredImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&h=700&q=80',
      category: 'Berita Sekolah',
      tags: ['Maulid Nabi', 'Rohis', 'Karakter', 'Santunan Anak Yatim'],
      authorId: 'usr_editor',
      authorName: 'Rahmat Hidayat, S.Kom',
      authorRole: 'editor',
      status: 'published',
      publishedAt: '2026-02-15T11:20:00Z',
      createdAt: '2026-02-15T10:00:00Z',
      updatedAt: '2026-02-15T11:20:00Z',
      views: 730,
      seoTitle: 'Peringatan Maulid Nabi Muhammad SAW 1447 H di SMAN 1 Julok',
      metaDescription: 'Peringatan Maulid Nabi di SMA Negeri 1 Julok diwarnai tausiyah agama, kenduri khas Aceh, dan santunan anak yatim.',
      canonicalUrl: 'https://sman1julok.sch.id/berita/peringatan-maulid-nabi-muhammad-saw-1447-h-di-sman-1-julok',
      ogImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&h=630&q=80',
      altImage: 'Suasana tausiyah Maulid Nabi di Musholla Al-Ikhlas SMAN 1 Julok',
      focusKeyword: 'Maulid Nabi SMAN 1 Julok',
    },
    {
      id: 'art_4',
      slug: 'workshop-pemberdayaan-ai-dan-media-pembelajaran-digital-bagi-dewan-guru',
      title: 'Workshop Guru Hebat: Pemanfaatan Teknologi AI dan Media Digital dalam Pembelajaran Diferensiasi',
      content: `<h2>Meningkatkan Kompetensi Pendidik Menuju Era Edu-Tech</h2>
<p>Sebanyak 48 guru SMA Negeri 1 Julok mengikuti <strong>Workshop Peningkatan Kompetensi Pedagogik Digital</strong> yang berlangsung selama dua hari di Laboratorium Komputer Multimedia. Pelatihan ini memfokuskan pada pemanfaatan Generative AI secara etis dan produktif untuk merancang bahan ajar interaktif, rubrik asesmen, dan modul ajar terdiferensiasi.</p>

<h3>Materi Praktik Langsung</h3>
<p>Narasumber ahli teknologi pembelajaran memandu langsung sesi praktik membuat presentasi interaktif, simulasi sains virtual berbasis PhET, dan pengelolaan asesmen formatif online yang ramah smartphone bagi para siswa.</p>`,
      excerpt: 'Dewan guru SMAN 1 Julok ikuti workshop intensif pemanfaatan AI dan perangkat pembelajaran digital untuk Kurikulum Merdeka.',
      featuredImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=700&q=80',
      category: 'Opini & Karya Guru',
      tags: ['Workshop Guru', 'Literasi Digital', 'Inovasi Pembelajaran'],
      authorId: 'usr_admin',
      authorName: 'Super Administrator SMAN 1 Julok',
      authorRole: 'admin',
      status: 'published',
      publishedAt: '2026-02-05T14:00:00Z',
      createdAt: '2026-02-05T13:00:00Z',
      updatedAt: '2026-02-05T14:00:00Z',
      views: 650,
      seoTitle: 'Workshop Pemanfaatan AI dan Media Digital untuk Guru SMAN 1 Julok',
      metaDescription: 'Guru SMAN 1 Julok tingkatkan literasi digital melalui workshop pemanfaatan artificial intelligence dan modul ajar Kurikulum Merdeka.',
      canonicalUrl: 'https://sman1julok.sch.id/berita/workshop-pemberdayaan-ai-dan-media-pembelajaran-digital-bagi-dewan-guru',
      ogImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=630&q=80',
      altImage: 'Para dewan guru SMAN 1 Julok sedang mempraktikkan modul digital di laboratorium komputer',
      focusKeyword: 'Workshop Guru SMAN 1 Julok',
    },
  ];

  const announcements: Announcement[] = [
    {
      id: 'ann_1',
      title: 'Penerimaan Peserta Didik Baru (PPDB) Tahun Pelajaran 2026/2027 Resmi Dibuka',
      content: 'SMA Negeri 1 Julok membuka pendaftaran peserta didik baru melalui jalur Zonasi (50%), Prestasi Akademik/Non-Akademik (30%), Afirmasi (15%), dan Perpindahan Tugas Orang Tua (5%). Silakan mendaftar online melalui menu PPDB pada website ini atau langsung ke sekretariat panitia di ruang multimedia.',
      date: '2026-03-01',
      fileUrl: '/docs/brosur_ppdb_2026.pdf',
      fileName: 'Brosur_Panduan_PPDB_2026.pdf',
      authorName: 'Panitia PPDB SMAN 1 Julok',
      isUrgent: true,
    },
    {
      id: 'ann_2',
      title: 'Jadwal Penilaian Sumatif Akhir Semester (PSAS) Genap TP 2025/2026',
      content: 'Diberitahukan kepada seluruh peserta didik kelas X, XI, dan XII bahwa Penilaian Sumatif Akhir Semester Genap akan dilaksanakan mulai hari Senin, 18 Mei 2026 dengan menggunakan sistem Computer Based Test (CBT) di laboratorium komputer sekolah.',
      date: '2026-02-28',
      authorName: 'Wakil Kepala Sekolah Bidang Kurikulum',
      isUrgent: false,
    },
    {
      id: 'ann_3',
      title: 'Edaran Jam Belajar Selama Bulan Suci Ramadhan 1447 H',
      content: 'Menindaklanjuti surat edaran Kepala Dinas Pendidikan Aceh, jam pembelajaran tatap muka selama bulan Ramadhan disesuaikan menjadi pukul 08.00 s/d 12.30 WIB dengan memfokuskan pada penguatan materi agama, tadarus Al-Qur\'an, dan kajian fiqih ibadah.',
      date: '2026-02-20',
      authorName: 'Kepala SMA Negeri 1 Julok',
      isUrgent: false,
    },
  ];

  const agenda: AgendaItem[] = [
    {
      id: 'agd_1',
      title: 'Simulasi Akbar UTBK-SNBT 2026 Mandiri Kelas XII',
      date: '2026-03-16',
      endDate: '2026-03-18',
      time: '08:00 - 12:30 WIB',
      location: 'Lab Komputer 1 & 2 SMAN 1 Julok',
      description: 'Uji coba pengerjaan soal TPS dan Literasi SNBT bekerjasama dengan Lembaga Bimbingan Belajar Nasional guna mengukur kesiapan masuk PTN favorit.',
      organizer: 'Bimbingan Konseling & Tim Sukses UTBK',
    },
    {
      id: 'agd_2',
      title: 'Porseni dan Classmeeting Semarak Prestasi Antar Kelas',
      date: '2026-03-23',
      endDate: '2026-03-27',
      time: '08:30 - 16:00 WIB',
      location: 'Kompleks Olahraga SMAN 1 Julok',
      description: 'Lomba futsal, bola voli, bulutangkis, pidato tiga bahasa (Indonesia, Arab, Inggris), dan festival nasyid antar-fase kelas X dan XI.',
      organizer: 'Pengurus OSIS Masa Bakti 2025/2026',
    },
    {
      id: 'agd_3',
      title: 'Rapat Pleno Komite Sekolah & Sosialisasi Program Kelulusan',
      date: '2026-04-04',
      time: '09:00 - 12:00 WIB',
      location: 'Aula Serbaguna Cut Meutia SMAN 1 Julok',
      description: 'Pertemuan dewan komite sekolah bersama orang tua/wali siswa kelas XII mengenai persiapan wisuda, pelepasan, dan karir perkuliahan.',
      organizer: 'Komite Sekolah & Manajemen',
    },
    {
      id: 'agd_4',
      title: 'Kemah Bakti Ramadhan & Pesantren Kilat Terpadu 1447 H',
      date: '2026-04-10',
      endDate: '2026-04-12',
      time: '16:00 - Selesai',
      location: 'Musholla & Kampus Hijau SMAN 1 Julok',
      description: 'Kegiatan pembinaan ruhiyah siswa, tadarus khatam Quran, buka puasa bersama, dan bakti sosial pembagian sembako ke dhuafa sekitar sekolah.',
      organizer: 'Ekstrakurikuler Rohis & OSIS',
    },
  ];

  const gallery: GalleryItem[] = [
    {
      id: 'gal_1',
      type: 'photo',
      title: 'Upacara Bendera Hari Senin Penuh Disiplin',
      url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=800&q=80',
      category: 'Upacara & Apel',
      date: '2026-02-23',
      description: 'Ratusan siswa berbaris rapi dalam pelaksanaan upacara bendera mingguan di lapangan utama sekolah.',
    },
    {
      id: 'gal_2',
      type: 'photo',
      title: 'Praktikum Kimia dan Sains Terpadu di Lab IPA',
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&h=800&q=80',
      category: 'Akademik & Lab',
      date: '2026-02-18',
      description: 'Siswa kelas XI melakukan titrasi asam basa di bawah bimbingan guru mata pelajaran kimia.',
    },
    {
      id: 'gal_3',
      type: 'photo',
      title: 'Perpustakaan Digital dan Pojok Literasi Sekolah',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&h=800&q=80',
      category: 'Fasilitas',
      date: '2026-02-12',
      description: 'Ruang perpustakaan yang sejuk dan dilengkapi katalog e-book untuk mendukung budaya gemar membaca.',
    },
    {
      id: 'gal_4',
      type: 'photo',
      title: 'Latihan Pasukan Baris Berbaris Paskibra Sekolah',
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&h=800&q=80',
      category: 'Ekstrakurikuler',
      date: '2026-02-10',
      description: 'Anggota Paskibra SMAN 1 Julok mematangkan formasi variasi baris berbaris jelang seleksi kabupaten.',
    },
    {
      id: 'gal_5',
      type: 'video',
      title: 'Video Profil Resmi SMA Negeri 1 Julok',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=800&q=80',
      category: 'Profil Sekolah',
      date: '2026-01-20',
      description: 'Dokumentasi komprehensif fasilitas, kegiatan pembelajaran, dan prestasi unggulan SMA Negeri 1 Julok.',
    },
    {
      id: 'gal_6',
      type: 'video',
      title: 'Dokumentasi Tari Ranup Lampuan pada Pembukaan Expo P5',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&h=800&q=80',
      category: 'Seni & Budaya',
      date: '2026-01-15',
      description: 'Tari selamat datang memuliakan tamu khas budaya Aceh yang dibawakan siswi sanggar tari sekolah.',
    },
  ];

  const teachers: Teacher[] = [
    {
      id: 'tch_1',
      name: 'Drs. H. Bakhtiar, M.Pd',
      nip: '19680512 199303 1 005',
      role: 'Kepala Sekolah',
      subject: 'Manajemen Pendidikan & Biologi',
      education: 'S2 Magister Pendidikan Universitas Syiah Kuala',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=500&q=80',
    },
    {
      id: 'tch_2',
      name: 'Drs. Muhammad Nasir, M.Pd',
      nip: '19740315 199903 1 002',
      role: 'Wakil Kepala Sekolah Bidang Kurikulum',
      subject: 'Fisika & Pembina OSN',
      education: 'S2 Pendidikan Fisika UNY',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=500&q=80',
    },
    {
      id: 'tch_3',
      name: 'Hj. Rosdiana, S.Pd, M.Si',
      nip: '19760820 200212 2 004',
      role: 'Wakil Kepala Sekolah Bidang Kesiswaan',
      subject: 'Kimia',
      education: 'S2 Kimia Lingkungan USK',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=500&q=80',
    },
    {
      id: 'tch_4',
      name: 'Iskandar, S.Pd',
      nip: '19800411 200501 1 008',
      role: 'Wakil Kepala Sekolah Bidang Sarana & Prasarana',
      subject: 'Matematika Peminatan',
      education: 'S1 Pendidikan Matematika UIN Ar-Raniry',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=500&q=80',
    },
    {
      id: 'tch_5',
      name: 'Cut Nyak Marlina, S.Pd',
      nip: '19820719 200604 2 018',
      role: 'Guru Kelas / Koordinator P5',
      subject: 'Bahasa & Sastra Indonesia',
      education: 'S1 Pendidikan Bahasa Indonesia Universitas Samudra',
      photo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&h=500&q=80',
    },
    {
      id: 'tch_6',
      name: 'Zulfikar, S.Pd.I',
      nip: '19851025 201001 1 015',
      role: 'Pembina Rohis & Karakter',
      subject: 'Pendidikan Agama Islam & Budi Pekerti',
      education: 'S1 Tarbiyah IAIN Zawiyah Cot Kala',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=500&q=80',
    },
    {
      id: 'tch_7',
      name: 'Nurul Hidayati, S.Pd',
      nip: '19900318 201503 2 007',
      role: 'Pembina English Club',
      subject: 'Bahasa Inggris',
      education: 'S1 Pendidikan Bahasa Inggris USK',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=500&q=80',
    },
    {
      id: 'tch_8',
      name: 'Rahmat Hidayat, S.Kom',
      nip: '19920104 201902 1 003',
      role: 'Kepala Lab Komputer & Tim Humas',
      subject: 'Informatika & TIK',
      education: 'S1 Teknik Informatika Universitas Syiah Kuala',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80',
    },
  ];

  const facilities: Facility[] = [
    {
      id: 'fac_1',
      name: 'Laboratorium Komputer Multimedia & CBT',
      category: 'Akademik',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Dua ruang laboratorium berpendingin udara dengan 80 unit PC terkoneksi serat optik gigabit untuk simulasi UTBK, AKM, dan pembelajaran informatika.',
    },
    {
      id: 'fac_2',
      name: 'Laboratorium IPA Terpadu (Fisika, Kimia, Biologi)',
      category: 'Akademik',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Dilengkapi mikroskop elektrik, kit mekanika, lemari asam, serta bahan kimia terstandar untuk mendukung praktikum sains dan riset olimpiade.',
    },
    {
      id: 'fac_3',
      name: 'Perpustakaan Cahaya Ilmu & E-Library',
      category: 'Literasi',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Koleksi 12.000 judul buku referensi cetak dan ribuan buku elektronik digital, dilengkapi ruang baca santai dan komputer pencarian OPAC.',
    },
    {
      id: 'fac_4',
      name: 'Lapangan Olahraga Multifungsi',
      category: 'Olahraga',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Lapangan berlantai semen standar untuk cabang futsal, bola voli, bola basket, dan upacara bendera berkapasitas 1.000 peserta didik.',
    },
    {
      id: 'fac_5',
      name: 'Musholla Al-Ikhlas SMAN 1 Julok',
      category: 'Ibadah',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Pusat pembinaan kerohanian Islam, shalat dhuha dan dhuhur berjamaah, serta kegiatan tahfidz Al-Qur\'an dan kajian kitab kuning siswa.',
    },
    {
      id: 'fac_6',
      name: 'Aula Cut Meutia Serbaguna',
      category: 'Pertemuan',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Gedung pertemuan representatif dengan sound system modern dan panggung pertunjukan untuk pentas seni, seminar, dan rapat komite.',
    },
  ];

  const achievements: Achievement[] = [
    {
      id: 'ach_1',
      title: 'Medali Emas OSN Bidang Fisika Terapan',
      studentName: 'Teuku Al-Fathan',
      category: 'Sains & Teknologi',
      level: 'Tingkat Provinsi Aceh',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Meraih skor tertinggi bidang Fisika Terapan dan terpilih menjadi wakil resmi Aceh di OSN Nasional.',
    },
    {
      id: 'ach_2',
      title: 'Juara 1 Lomba Cepat Tepat (LCT) Syariat Islam & Bahasa Arab',
      studentName: 'Tim Rohis SMAN 1 Julok',
      category: 'Keagamaan',
      level: 'Tingkat Kabupaten Aceh Timur',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Mengungguli 24 sekolah se-Kabupaten Aceh Timur dalam penguasaan wawasan keislaman dan kaidah fiqih.',
    },
    {
      id: 'ach_3',
      title: 'Juara 2 English Debate Competition SMA',
      studentName: 'Cut Raisa & Zahrina Safitri',
      category: 'Bahasa & Seni',
      level: 'Tingkat Provinsi Aceh',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Debat bahasa Inggris dengan format Asian Parliamentary mengangkat tema transisi energi hijau di Indonesia.',
    },
    {
      id: 'ach_4',
      title: 'Juara 1 Turnamen Futsal Pelajar Piala Bupati',
      studentName: 'Tim Futsal Putra SMAN 1 Julok',
      category: 'Olahraga',
      level: 'Tingkat Kabupaten',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Menumbangkan tim unggulan di partai final dengan skor meyakinkan 4-2.',
    },
  ];

  const extracurriculars: Extracurricular[] = [
    {
      id: 'ex_1',
      name: 'Pramuka Gugus Depan SMAN 1 Julok',
      coach: 'Zulfikar, S.Pd.I',
      schedule: 'Setiap Jumat pukul 14.30 - 17.00 WIB',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Membina kedisiplinan, kepemimpinan, keterampilan pioneering, survival alam terbuka, dan bakti sosial masyarakat.',
      achievements: 'Juara Umum Kemah Silaturahmi Kwarcab Aceh Timur 2024',
    },
    {
      id: 'ex_2',
      name: 'Pasukan Pengibar Bendera (Paskibra)',
      coach: 'Iskandar, S.Pd & Pelatih Koramil Julok',
      schedule: 'Setiap Selasa & Kamis sore',
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Membentuk fisik tangguh, kedisiplinan baris berbaris tingkat tinggi, serta patriotisme kebangsaan.',
      achievements: '3 siswa lolos Pasukan Pengibar Bendera Pusaka (Paskibraka) Aceh Timur',
    },
    {
      id: 'ex_3',
      name: 'Rohis Al-Kautsar & Tahfidz Quran',
      coach: 'Tgk. Muhammad Yusuf & Zulfikar, S.Pd.I',
      schedule: 'Setiap Rabu sore & Sabtu pagi',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Wadah kajian aqidah, tahsin tilawah Al-Qur\'an, setoran hafalan juz 30, serta pengelolaan peringatan hari besar Islam.',
      achievements: 'Mencetak 18 hafiz/hafizah 3 juz pada tahun ajaran 2024/2025',
    },
    {
      id: 'ex_4',
      name: 'Klub Sains & Riset Ilmiah (KIR)',
      coach: 'Drs. Muhammad Nasir, M.Pd',
      schedule: 'Setiap Senin & Kamis pukul 14.00 WIB',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Penelitian eksperimen sains, bimbingan olimpiade sains nasional sembilan bidang, dan inovasi teknologi terapan.',
      achievements: 'Medali Emas OSN Provinsi Aceh 2026',
    },
    {
      id: 'ex_5',
      name: 'Sanggar Seni Budaya & Tari Saman/Ranup Lampuan',
      coach: 'Cut Nyak Marlina, S.Pd',
      schedule: 'Setiap Sabtu siang',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Pelestarian seni tari tradisi dan kreasi Aceh, vokal solo, pembacaan hikayat, dan musik rapai geleng.',
      achievements: 'Penyaji Tari Terbaik FLS2N Tingkat Kabupaten',
    },
    {
      id: 'ex_6',
      name: 'Cyber IT & Jurnalistik Sekolah',
      coach: 'Rahmat Hidayat, S.Kom',
      schedule: 'Setiap Rabu siang',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=500&q=80',
      description: 'Pelatihan pembuatan web, desain grafis, fotografi jurnalistik, penulisan berita, dan manajemen konten media sosial.',
      achievements: 'Pengelola Buletin Digital "Genta Julok"',
    },
  ];

  const pages: StaticPage[] = [
    {
      id: 'page_profil',
      slug: 'profil-sekolah',
      title: 'Profil SMA Negeri 1 Julok',
      subtitle: 'Identitas, Akreditasi, dan Lintasan Mutu Pendidikan di Pesisir Timur Aceh',
      content: `<h2>Identitas Satuan Pendidikan</h2>
<p>SMA Negeri 1 Julok merupakan sekolah menengah atas negeri rujukan yang berlokasi strategis di lintas jalan negara Banda Aceh - Medan, Kecamatan Julok, Kabupaten Aceh Timur. Berdiri di atas lahan seluas 2,4 hektar yang asri dan berwawasan lingkungan hidup.</p>
<table>
  <tr><td><strong>Nama Sekolah</strong></td><td>SMA Negeri 1 Julok</td></tr>
  <tr><td><strong>NPSN</strong></td><td>10102146</td></tr>
  <tr><td><strong>Status</strong></td><td>Negeri</td></tr>
  <tr><td><strong>Bentuk Pendidikan</strong></td><td>Sekolah Menengah Atas (SMA)</td></tr>
  <tr><td><strong>Status Akreditasi</strong></td><td>A (Unggul) dari BAN-S/M</td></tr>
  <tr><td><strong>SK Pendirian</strong></td><td>No. 0260/O/1994</td></tr>
  <tr><td><strong>Alamat</strong></td><td>Jl. Medan - Banda Aceh Km. 368, Blang Pauh Dua, Julok</td></tr>
  <tr><td><strong>Kabupaten/Kota</strong></td><td>Kabupaten Aceh Timur, Provinsi Aceh</td></tr>
  <tr><td><strong>Kode Pos</strong></td><td>24458</td></tr>
  <tr><td><strong>Email Resmi</strong></td><td>info@sman1julok.sch.id</td></tr>
</table>
<h3>Karakteristik dan Lingkungan Belajar</h3>
<p>Dengan menerapkan Kurikulum Merdeka secara penuh, SMAN 1 Julok mengintegrasikan nilai-nilai kearifan lokal syariat Islam, adab budi pekerti, dan penguasaan sains modern untuk menjawab tantangan abad ke-21.</p>`,
      seoTitle: 'Profil Lengkap SMA Negeri 1 Julok - Akreditasi A Aceh Timur',
      metaDescription: 'Kenali profil, NPSN, akreditasi, sejarah, dan lingkungan belajar di SMA Negeri 1 Julok, Kabupaten Aceh Timur.',
      lastUpdated: '2026-03-01',
    },
    {
      id: 'page_sejarah',
      slug: 'sejarah-sekolah',
      title: 'Sejarah SMA Negeri 1 Julok',
      subtitle: 'Jejak Pengabdian Sejak Tahun 1994 Mencetak Generasi Penerus Bangsa',
      content: `<h2>Latar Belakang Pendirian</h2>
<p>Pada dekade 1990-an, kebutuhan akan lembaga pendidikan menengah atas negeri di kawasan barat Aceh Timur sangat mendesak. Masyarakat Julok yang sebelumnya harus menempuh jarak jauh ke Idi Rayeuk atau Simpang Ulim mendambakan hadirnya SMA negeri di tanah kelahirannya.</p>

<p>Atas inisiatif tokoh masyarakat, alim ulama, dan dukungan Pemerintah Daerah Kabupaten Aceh Timur, terbitlah Surat Keputusan Menteri Pendidikan dan Kebudayaan Republik Indonesia Nomor 0260/O/1994 tertanggal 5 Oktober 1994 yang secara resmi menetapkan berdirinya <strong>SMA Negeri 1 Julok</strong>.</p>

<h3>Fase Perkembangan</h3>
<p>Bermula dari 3 ruang kelas belajar dengan fasilitas sederhana, kini SMAN 1 Julok telah bertransformasi menjadi salah satu sekolah unggulan di Aceh Timur dengan 24 rombongan belajar, laboratorium komputer modern, perpustakaan digital, serta sarana olahraga representatif.</p>`,
      seoTitle: 'Sejarah Perjalanan SMA Negeri 1 Julok Sejak 1994',
      metaDescription: 'Sejarah berdirinya SMA Negeri 1 Julok sejak tahun 1994 dan perjalanannya menjadi sekolah berprestasi di Aceh Timur.',
      lastUpdated: '2026-02-15',
    },
    {
      id: 'page_visimisi',
      slug: 'visi-dan-misi',
      title: 'Visi dan Misi Sekolah',
      subtitle: 'Landasan Filosofis dan Komitmen Pembelajaran SMAN 1 Julok',
      content: `<h2>Visi Sekolah</h2>
<blockquote><strong>"Terwujudnya Peserta Didik yang Unggul dalam Prestasi Akademik dan Non-Akademik, Berkarakter Profil Pelajar Pancasila, Berakhlak Mulia Berlandaskan Syariat, serta Berwawasan Lingkungan Hidup."</strong></blockquote>

<h2>Misi Sekolah</h2>
<ol>
  <li>Menyelenggarakan proses pembelajaran yang inovatif, berdiferensiasi, dan berbasis teknologi informasi.</li>
  <li>Membina potensi minat dan bakat peserta didik dalam bidang sains, seni, teknologi, dan olahraga hingga meraih prestasi tingkat nasional.</li>
  <li>Menanamkan nilai-nilai keimanan, ketaqwaan, dan akhlak karimah melalui pembiasaan ibadah dan keteladanan pendidik.</li>
  <li>Mengimplementasikan nilai kearifan lokal Aceh dan nilai-nilai luhur Pancasila dalam kehidupan sehari-hari warga sekolah.</li>
  <li>Menciptakan iklim sekolah yang bersih, asri, ramah anak, bebas perundungan, dan berorientasi pelestarian lingkungan (Green School).</li>
  <li>Membangun sinergi harmonis antara sekolah, komite, alumni, dan dunia usaha/dunia industri.</li>
</ol>

<h2>Tujuan Satuan Pendidikan</h2>
<p>Menghasilkan lulusan yang berkepribadian matang, siap bersaing menembus Perguruan Tinggi Negeri (PTN) favorit dan sekolah kedinasan, serta memiliki kecakapan hidup mandiri.</p>`,
      seoTitle: 'Visi dan Misi SMA Negeri 1 Julok - Membangun Generasi Unggul',
      metaDescription: 'Visi, misi, dan tujuan pendidikan SMA Negeri 1 Julok dalam mencetak generasi cerdas, beriman, dan berdaya saing.',
      lastUpdated: '2026-02-10',
    },
    {
      id: 'page_sambutan',
      slug: 'sambutan-kepala-sekolah',
      title: 'Sambutan Kepala Sekolah',
      subtitle: 'Drs. H. Bakhtiar, M.Pd - Kepala SMA Negeri 1 Julok',
      content: `<h2>Menyambut Masa Depan Pendidikan Gemilang</h2>
<p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
<p>Selamat datang di portal informasi resmi SMA Negeri 1 Julok. Sebagai pimpinan sekolah, saya menyambut hangat segenap tamu, wali murid, alumni, dan para pelajar yang mengakses laman ini.</p>
<p>Pendidikan bukan sekadar transfer pengetahuan, melainkan proses penempaan jiwa, karakter, dan integritas. Kami di SMA Negeri 1 Julok berkomitmen penuh menyajikan iklim sekolah yang aman, memotivasi, dan berorientasi pada kemajuan setiap anak didik.</p>
<p>Terima kasih atas kepercayaan masyarakat dan dedikasi segenap dewan guru dan tenaga kependidikan. Mari bersama-sama kita bawa SMAN 1 Julok menuju puncak prestasi.</p>
<p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>`,
      seoTitle: 'Sambutan Kepala Sekolah SMA Negeri 1 Julok - Drs. H. Bakhtiar, M.Pd',
      metaDescription: 'Pesan resmi dan sambutan Kepala SMA Negeri 1 Julok untuk civitas akademika dan masyarakat luas.',
      lastUpdated: '2026-02-01',
    },
    {
      id: 'page_struktur',
      slug: 'struktur-organisasi',
      title: 'Struktur Organisasi Sekolah',
      subtitle: 'Bagan Kepemimpinan dan Tata Kelola Pendidikan SMA Negeri 1 Julok',
      content: `<h2>Tata Kelola Profesional</h2>
<p>Struktur organisasi di SMA Negeri 1 Julok dirancang untuk memastikan sinergi operasional yang terarah dan akuntabel di bawah koordinasi Kepala Sekolah:</p>
<ul>
  <li><strong>Kepala Sekolah:</strong> Drs. H. Bakhtiar, M.Pd</li>
  <li><strong>Ketua Komite Sekolah:</strong> Tgk. H. Abdul Wahab</li>
  <li><strong>Wakil Kepala Sekolah Bidang Kurikulum:</strong> Drs. Muhammad Nasir, M.Pd</li>
  <li><strong>Wakil Kepala Sekolah Bidang Kesiswaan:</strong> Hj. Rosdiana, S.Pd, M.Si</li>
  <li><strong>Wakil Kepala Sekolah Bidang Sarana & Prasarana:</strong> Iskandar, S.Pd</li>
  <li><strong>Wakil Kepala Sekolah Bidang Humas:</strong> Rahmat Hidayat, S.Kom</li>
  <li><strong>Kepala Tata Usaha:</strong> Marzuki, S.Sos</li>
  <li><strong>Koordinator Bimbingan & Konseling (BK):</strong> Cut Nyak Marlina, S.Pd</li>
  <li><strong>Kepala Laboratorium Komputer:</strong> Rahmat Hidayat, S.Kom</li>
  <li><strong>Kepala Laboratorium IPA:</strong> Hj. Rosdiana, S.Pd, M.Si</li>
  <li><strong>Kepala Perpustakaan:</strong> Dra. Suryani</li>
</ul>`,
      seoTitle: 'Struktur Organisasi SMA Negeri 1 Julok - Manajemen Sekolah',
      metaDescription: 'Bagan dan susunan struktur organisasi kepemimpinan serta dewan komite SMA Negeri 1 Julok.',
      lastUpdated: '2026-02-12',
    },
    {
      id: 'page_kurikulum',
      slug: 'kurikulum-sekolah',
      title: 'Kurikulum & Pembelajaran',
      subtitle: 'Implementasi Kurikulum Merdeka Belajar Berpusat pada Peserta Didik',
      content: `<h2>Kurikulum Merdeka di SMAN 1 Julok</h2>
<p>Mulai tahun ajaran 2023/2024, SMA Negeri 1 Julok telah menjadi Sekolah Pelaksana Kurikulum Merdeka Mandiri Berbagi. Pendekatan ini memberikan kebebasan bagi siswa untuk mengeksplorasi mata pelajaran pilihan sesuai bakat, minat, dan cita-cita karir perguruan tinggi.</p>

<h3>Struktur Pembelajaran</h3>
<ul>
  <li><strong>Intrakurikuler:</strong> Pendalaman materi esensial dengan pembelajaran interaktif dan berbasis riset/proyek.</li>
  <li><strong>Kokurikuler (P5):</strong> Projek Penguatan Profil Pelajar Pancasila dengan alokasi waktu 25-30% jam pelajaran, melatih kepemimpinan dan kerja sama tim.</li>
  <li><strong>Ekstrakurikuler:</strong> Penyaluran minat di bidang sains, keagamaan, olahraga, seni, dan kepemimpinan.</li>
</ul>`,
      seoTitle: 'Kurikulum Merdeka di SMA Negeri 1 Julok - Sistem Pembelajaran',
      metaDescription: 'Informasi penerapan Kurikulum Merdeka, program P5, dan mata pelajaran pilihan di SMAN 1 Julok.',
      lastUpdated: '2026-02-20',
    },
    {
      id: 'page_program',
      slug: 'program-unggulan',
      title: 'Program Unggulan Sekolah',
      subtitle: 'Inovasi Berkelanjutan Mempersiapkan Lulusan Berdaya Saing Global',
      content: `<h2>Lima Program Prioritas</h2>
<ol>
  <li><strong>Klinik Sukses UTBK-SNBT:</strong> Bimbingan intensif persiapan masuk PTN favorit terintegrasi dengan tryout CBT berkala.</li>
  <li><strong>Program Tahfidz & Karakter Islami:</strong> Pendampingan hafalan Al-Qur'an jus 30 dan pembiasaan shalat berjamaah.</li>
  <li><strong>Akademi Sains OSN & Riset Siswa:</strong> Pembinaan khusus siswa berbakat untuk bersaing di olimpiade sains nasional.</li>
  <li><strong>Gerakan Literasi Sekolah (GLS):</strong> Pembiasaan 15 menit membaca buku non-pelajaran setiap pagi sebelum bel masuk.</li>
  <li><strong>Green School & Adiwiyata:</strong> Pengelolaan taman sekolah, pemilahan sampah organik/anorganik, dan konservasi air.</li>
</ol>`,
      seoTitle: 'Program Unggulan SMA Negeri 1 Julok - Persiapan PTN & Tahfidz',
      metaDescription: 'Program unggulan SMAN 1 Julok meliputi Sukses UTBK, Tahfidz Al-Quran, Akademi Sains, dan Sekolah Ramah Lingkungan.',
      lastUpdated: '2026-02-25',
    },
  ];

  const comments: Comment[] = [
    {
      id: 'com_1',
      articleId: 'art_1',
      articleTitle: 'Siswa SMAN 1 Julok Raih Medali Emas Olimpiade Sains Nasional (OSN) Tingkat Provinsi Aceh 2026',
      name: 'Faisal Akbar (Alumni 2022)',
      email: 'faisal.akbar@gmail.com',
      content: 'Selamat untuk adik Teuku Al-Fathan! Luar biasa dedikasi Pak Nasir dan guru-guru SMAN 1 Julok. Semoga emas nasional bisa dibawa pulang ke Julok!',
      date: '2026-03-02T12:00:00Z',
      status: 'approved',
    },
    {
      id: 'com_2',
      articleId: 'art_2',
      articleTitle: 'Gelar Karya P5: Menggali Nilai Kearifan Lokal dan Kewirausahaan Kreatif Pelajar Aceh',
      name: 'Ibu Salbiah (Wali Murid)',
      email: 'salbiah.aceh@yahoo.com',
      content: 'Senang sekali melihat anak-anak belajar memasak kuliner tradisional Aceh dan anyaman pandan. Nilai budaya lokal tetap terjaga.',
      date: '2026-02-25T08:30:00Z',
      status: 'approved',
    },
  ];

  const ppdb: PPDBRegistration[] = [
    {
      id: 'reg_1',
      regNumber: 'PPDB-2026-0001',
      fullName: 'Ahmad Raihan Pratama',
      nisn: '0089283741',
      birthPlace: 'Julok',
      birthDate: '2010-06-15',
      gender: 'Laki-laki',
      previousSchool: 'SMP Negeri 1 Julok',
      phone: '081269001234',
      email: 'raihan.pratama@gmail.com',
      parentName: 'Ibrahim Mahmud',
      parentPhone: '081370005678',
      address: 'Gampong Blang Pauh Dua, Kec. Julok, Aceh Timur',
      chosenTrack: 'Zonasi',
      status: 'verified',
      submittedAt: '2026-03-01T10:15:00Z',
    },
    {
      id: 'reg_2',
      regNumber: 'PPDB-2026-0002',
      fullName: 'Siti Nurhaliza',
      nisn: '0087192834',
      birthPlace: 'Idi Rayeuk',
      birthDate: '2010-08-22',
      gender: 'Perempuan',
      previousSchool: 'MTsN 2 Aceh Timur',
      phone: '082233445566',
      email: 'siti.nurhaliza2010@gmail.com',
      parentName: 'H. Mukhtaruddin',
      parentPhone: '085260112233',
      address: 'Jl. Blang Geulanteu No. 14, Julok, Aceh Timur',
      chosenTrack: 'Prestasi',
      status: 'accepted',
      submittedAt: '2026-03-02T14:30:00Z',
    },
  ];

  const contactMessages: ContactMessage[] = [
    {
      id: 'msg_1',
      name: 'Drs. H. Anwar Kasim',
      email: 'anwar.kasim@kemdikbud.go.id',
      phone: '081168001122',
      subject: 'Koordinasi Pelaksanaan Asesmen Nasional',
      message: 'Mohon konfirmasi kesiapan laboratorium komputer SMAN 1 Julok untuk pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) bulan depan.',
      date: '2026-03-01T08:45:00Z',
      read: true,
    },
    {
      id: 'msg_2',
      name: 'Ibu Maryam',
      email: 'maryam.wali@gmail.com',
      phone: '085277881199',
      subject: 'Pertanyaan Syarat Jalur Prestasi PPDB',
      message: 'Selamat siang admin, apakah piagam kejuaraan tahfidz tingkat kecamatan bisa digunakan untuk melampirkan berkas PPDB jalur prestasi? Terima kasih.',
      date: '2026-03-02T11:20:00Z',
      read: false,
    },
  ];

  const stats: VisitorStats = {
    totalVisits: 14850,
    todayVisits: 342,
    lastVisitDate: '2026-03-02',
    dailyHistory: [
      { date: '2026-02-24', count: 240 },
      { date: '2026-02-25', count: 285 },
      { date: '2026-02-26', count: 310 },
      { date: '2026-02-27', count: 295 },
      { date: '2026-02-28', count: 320 },
      { date: '2026-03-01', count: 390 },
      { date: '2026-03-02', count: 342 },
    ],
    deviceBreakdown: { mobile: 68, desktop: 27, tablet: 5 },
  };

  const logs: ActivityLog[] = [
    {
      id: 'log_1',
      userId: 'usr_guru1',
      userName: 'Drs. Muhammad Nasir, M.Pd',
      role: 'guru',
      action: 'Menerbitkan Artikel Langsung',
      target: 'Siswa SMAN 1 Julok Raih Medali Emas OSN Provinsi 2026',
      timestamp: '2026-03-02T09:30:00Z',
    },
    {
      id: 'log_2',
      userId: 'usr_admin',
      userName: 'Super Administrator',
      role: 'admin',
      action: 'Memperbarui Pengumuman',
      target: 'Pembukaan PPDB 2026/2027',
      timestamp: '2026-03-01T10:00:00Z',
    },
  ];

  const media: MediaFile[] = [
    {
      id: 'med_1',
      name: 'Gedung_Utama_SMAN1_Julok.webp',
      url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=800&q=80',
      size: 245000,
      type: 'image/webp',
      altText: 'Gedung utama dan halaman upacara SMA Negeri 1 Julok',
      uploadedAt: '2026-01-15T08:00:00Z',
    },
    {
      id: 'med_2',
      name: 'Lab_Komputer_CBT.webp',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=800&q=80',
      size: 198000,
      type: 'image/webp',
      altText: 'Laboratorium komputer multimedia dan CBT',
      uploadedAt: '2026-01-18T09:30:00Z',
    },
    {
      id: 'med_3',
      name: 'Brosur_Panduan_PPDB_2026.pdf',
      url: '/docs/brosur_ppdb_2026.pdf',
      size: 1450000,
      type: 'application/pdf',
      altText: 'Dokumen panduan teknis dan alur pendaftaran PPDB 2026',
      uploadedAt: '2026-02-28T14:00:00Z',
    },
  ];

  return {
    users,
    articles,
    categories,
    pages,
    announcements,
    agenda,
    gallery,
    teachers,
    facilities,
    achievements,
    extracurriculars,
    comments,
    ppdb,
    contactMessages,
    settings: defaultSettings,
    stats,
    logs,
    media,
  };
}

let dbInstance: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (dbInstance) return dbInstance;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbInstance = JSON.parse(raw);
      return dbInstance!;
    }
  } catch (err) {
    console.error('Error reading db.json, generating initial seed:', err);
  }

  dbInstance = getInitialSeedData();
  saveDb(dbInstance);
  return dbInstance;
}

export function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    dbInstance = data;
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

export function logActivity(userId: string, userName: string, role: string, action: string, target: string) {
  const db = getDb();
  const newLog: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    userName,
    role,
    action,
    target,
    timestamp: new Date().toISOString(),
  };
  db.logs.unshift(newLog);
  if (db.logs.length > 100) {
    db.logs = db.logs.slice(0, 100);
  }
  saveDb(db);
}
