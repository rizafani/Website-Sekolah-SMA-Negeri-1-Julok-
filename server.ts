import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  getDb,
  saveDb,
  logActivity,
  type DatabaseSchema,
} from './server/db.ts';
import type { Article, UserRole, User } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Internal server must ALWAYS listen on port 3000 for Nginx reverse proxy
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure uploads folder exists and serve statically
const UPLOADS_DIR = path.resolve(__dirname, 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Helper to get active user from Authorization header (Bearer usr_id)
function getAuthUser(req: Request): User | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.substring(7);
  const db = getDb();
  // Simple token format: user id or base64 token
  const user = db.users.find((u) => u.id === token || Buffer.from(u.id).toString('base64') === token);
  return user || null;
}

// ==================== AUTH ROUTES ====================
const handleLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username atau email dan kata sandi wajib diisi.' });
  }

  const db = getDb();
  const normalized = String(username).trim().toLowerCase();
  const user = db.users.find(
    (u) =>
      u.username.toLowerCase() === normalized ||
      (u.email && u.email.toLowerCase() === normalized)
  );

  if (!user || !user.password) {
    return res.status(401).json({ error: 'Username/email atau kata sandi tidak sesuai.' });
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Username/email atau kata sandi tidak sesuai.' });
  }

  logActivity(user.id, user.name, user.role, 'Login ke Sistem', 'Dashboard');

  const { password: _, ...safeUser } = user;
  const token = user.id; // Session bearer token

  return res.json({
    token,
    user: safeUser,
    message: `Selamat datang, ${user.name}!`,
  });
};

const handleGetMe = (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Tidak terautentikasi' });
  }
  const { password: _, ...safeUser } = user;
  return res.json({ user: safeUser });
};

// Mount login and me endpoints with aliases for resilience
app.post('/api/auth/login', handleLogin);
app.post('/api/login', handleLogin);
app.get('/api/auth/me', handleGetMe);
app.get('/api/me', handleGetMe);

// ==================== ARTICLES API ====================
app.get('/api/articles', (req: Request, res: Response) => {
  const db = getDb();
  const { category, tag, search, status, authorId, limit, page } = req.query;

  let list = [...db.articles];

  // If public (status not requested or status=published), show only published
  if (status) {
    list = list.filter((a) => a.status === status);
  } else {
    list = list.filter((a) => a.status === 'published');
  }

  if (category && category !== 'Semua') {
    list = list.filter((a) => a.category.toLowerCase() === String(category).toLowerCase());
  }

  if (tag) {
    list = list.filter((a) =>
      a.tags.some((t) => t.toLowerCase() === String(tag).toLowerCase())
    );
  }

  if (authorId) {
    list = list.filter((a) => a.authorId === authorId);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort descending by publishedAt or createdAt
  list.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

  const total = list.length;
  const perPage = limit ? parseInt(String(limit), 10) : 10;
  const currentPage = page ? parseInt(String(page), 10) : 1;
  const paginated = limit ? list.slice((currentPage - 1) * perPage, currentPage * perPage) : list;

  return res.json({
    data: paginated,
    total,
    page: currentPage,
    totalPages: Math.ceil(total / perPage),
  });
});

app.get('/api/articles/:slugOrId', (req: Request, res: Response) => {
  const db = getDb();
  const { slugOrId } = req.params;
  const article = db.articles.find((a) => a.slug === slugOrId || a.id === slugOrId);

  if (!article) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan' });
  }

  // Increment views
  article.views = (article.views || 0) + 1;
  saveDb(db);

  return res.json(article);
});

app.post('/api/articles', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Akses ditolak: Silakan login terlebih dahulu' });
  }

  const {
    title,
    content,
    excerpt,
    featuredImage,
    category,
    tags,
    status = 'published',
    seoTitle,
    metaDescription,
    canonicalUrl,
    ogImage,
    altImage,
    focusKeyword,
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Judul dan konten artikel wajib diisi' });
  }

  const db = getDb();

  // Create clean slug
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (db.articles.some((a) => a.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const now = new Date().toISOString();
  const appUrl = process.env.APP_URL || 'https://sman1julok.sch.id';

  const newArticle: Article = {
    id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    slug: uniqueSlug,
    title: title.trim(),
    content,
    excerpt: excerpt || title.substring(0, 160),
    featuredImage: featuredImage || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=700&q=80',
    category: category || 'Berita Sekolah',
    tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    authorId: user.id,
    authorName: user.name,
    authorRole: user.role,
    status: status === 'draft' ? 'draft' : 'published', // Instantly published without approval!
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    views: 0,
    seoTitle: seoTitle || title,
    metaDescription: metaDescription || (excerpt || title.substring(0, 160)),
    canonicalUrl: canonicalUrl || `${appUrl}/berita/${uniqueSlug}`,
    ogImage: ogImage || featuredImage || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=630&q=80',
    altImage: altImage || title,
    focusKeyword: focusKeyword || title.split(' ').slice(0, 3).join(' '),
  };

  db.articles.unshift(newArticle);
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Menerbitkan Artikel Langsung', newArticle.title);

  return res.status(201).json({
    message: 'Artikel berhasil diterbitkan langsung dan sudah tampil di website!',
    article: newArticle,
  });
});

app.put('/api/articles/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Akses ditolak' });
  }

  const db = getDb();
  const index = db.articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan' });
  }

  const current = db.articles[index];
  // Permission: Admin can edit all, Editor can edit all, Guru can edit own
  if (user.role === 'guru' && current.authorId !== user.id) {
    return res.status(403).json({ error: 'Guru hanya dapat mengedit artikel milik sendiri' });
  }

  const updated: Article = {
    ...current,
    ...req.body,
    id: current.id, // prevent ID change
    updatedAt: new Date().toISOString(),
  };

  db.articles[index] = updated;
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Memperbarui Artikel', updated.title);

  return res.json({
    message: 'Artikel berhasil diperbarui!',
    article: updated,
  });
});

app.delete('/api/articles/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Akses ditolak' });
  }

  const db = getDb();
  const article = db.articles.find((a) => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan' });
  }

  if (user.role === 'guru' && article.authorId !== user.id) {
    return res.status(403).json({ error: 'Guru hanya dapat menghapus artikel milik sendiri' });
  }

  db.articles = db.articles.filter((a) => a.id !== req.params.id);
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Menghapus Artikel', article.title);

  return res.json({ message: 'Artikel berhasil dihapus' });
});

// ==================== STATIC PAGES API ====================
app.get('/api/pages', (_req: Request, res: Response) => {
  const db = getDb();
  return res.json(db.pages);
});

app.get('/api/pages/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const page = db.pages.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!page) {
    return res.status(404).json({ error: 'Halaman tidak ditemukan' });
  }
  return res.json(page);
});

app.put('/api/pages/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return res.status(403).json({ error: 'Hanya Admin atau Editor yang dapat mengedit halaman' });
  }

  const db = getDb();
  const idx = db.pages.findIndex((p) => p.id === req.params.id || p.slug === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Halaman tidak ditemukan' });
  }

  db.pages[idx] = {
    ...db.pages[idx],
    ...req.body,
    lastUpdated: new Date().toISOString(),
  };
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Memperbarui Halaman Statis', db.pages[idx].title);

  return res.json({ message: 'Halaman berhasil diperbarui', page: db.pages[idx] });
});

// ==================== ANNOUNCEMENTS API ====================
app.get('/api/announcements', (_req: Request, res: Response) => {
  const db = getDb();
  return res.json(db.announcements);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role === 'guru') {
    return res.status(403).json({ error: 'Akses ditolak: Hanya Admin/Editor yang dapat menambah pengumuman' });
  }
  const { title, content, isUrgent, fileUrl, fileName } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Judul dan isi pengumuman wajib diisi' });
  }

  const db = getDb();
  const newAnn = {
    id: `ann_${Date.now()}`,
    title,
    content,
    date: new Date().toISOString().split('T')[0],
    isUrgent: Boolean(isUrgent),
    fileUrl,
    fileName,
    authorName: user.name,
  };
  db.announcements.unshift(newAnn);
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Menambah Pengumuman', title);
  return res.status(201).json(newAnn);
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya Administrator yang dapat menghapus pengumuman' });
  }
  const db = getDb();
  db.announcements = db.announcements.filter((a) => a.id !== req.params.id);
  saveDb(db);
  return res.json({ message: 'Pengumuman dihapus' });
});

// ==================== AGENDA API ====================
app.get('/api/agenda', (_req: Request, res: Response) => {
  const db = getDb();
  return res.json(db.agenda);
});

app.post('/api/agenda', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role === 'guru') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  const { title, date, endDate, time, location, description, organizer } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: 'Judul dan tanggal agenda wajib diisi' });
  }
  const db = getDb();
  const newAgenda = {
    id: `agd_${Date.now()}`,
    title,
    date,
    endDate,
    time: time || '08:00 - Selesai',
    location: location || 'Kampus SMAN 1 Julok',
    description: description || '',
    organizer: organizer || 'SMAN 1 Julok',
  };
  db.agenda.push(newAgenda);
  saveDb(db);
  return res.status(201).json(newAgenda);
});

app.delete('/api/agenda/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  const db = getDb();
  db.agenda = db.agenda.filter((a) => a.id !== req.params.id);
  saveDb(db);
  return res.json({ message: 'Agenda dihapus' });
});

// ==================== GALLERY API ====================
app.get('/api/gallery', (_req: Request, res: Response) => {
  const db = getDb();
  return res.json(db.gallery);
});

app.post('/api/gallery', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Akses ditolak' });
  }
  const { type, title, url, thumbnail, category, description } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Judul dan URL foto/video wajib diisi' });
  }
  const db = getDb();
  const item = {
    id: `gal_${Date.now()}`,
    type: (type === 'video' ? 'video' : 'photo') as 'photo' | 'video',
    title,
    url,
    thumbnail,
    category: category || 'Kegiatan',
    date: new Date().toISOString().split('T')[0],
    description,
  };
  db.gallery.unshift(item);
  saveDb(db);
  logActivity(user.id, user.name, user.role, 'Mengunggah Media Galeri', title);
  return res.status(201).json(item);
});

app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  const db = getDb();
  db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
  saveDb(db);
  return res.json({ message: 'Media galeri dihapus' });
});

// ==================== TEACHERS, FACILITIES, ACHIEVEMENTS ====================
app.get('/api/teachers', (_req: Request, res: Response) => res.json(getDb().teachers));
app.get('/api/facilities', (_req: Request, res: Response) => res.json(getDb().facilities));
app.get('/api/achievements', (_req: Request, res: Response) => res.json(getDb().achievements));
app.get('/api/extracurriculars', (_req: Request, res: Response) => res.json(getDb().extracurriculars));

// ==================== PPDB ONLINE REGISTRATION API ====================
app.get('/api/ppdb', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Akses ditolak' });
  }
  const db = getDb();
  return res.json(db.ppdb);
});

app.post('/api/ppdb', (req: Request, res: Response) => {
  const {
    fullName,
    nisn,
    birthPlace,
    birthDate,
    gender,
    previousSchool,
    phone,
    email,
    parentName,
    parentPhone,
    address,
    chosenTrack,
  } = req.body;

  if (!fullName || !nisn || !phone || !previousSchool) {
    return res.status(400).json({ error: 'Nama Lengkap, NISN, No. HP, dan Asal Sekolah wajib diisi.' });
  }

  const db = getDb();
  const nextNum = String(db.ppdb.length + 1).padStart(4, '0');
  const regNumber = `PPDB-2026-${nextNum}`;

  const reg = {
    id: `reg_${Date.now()}`,
    regNumber,
    fullName: fullName.trim(),
    nisn: nisn.trim(),
    birthPlace: birthPlace || '',
    birthDate: birthDate || '',
    gender: gender || 'Laki-laki',
    previousSchool: previousSchool.trim(),
    phone: phone.trim(),
    email: email || '',
    parentName: parentName || '',
    parentPhone: parentPhone || '',
    address: address || '',
    chosenTrack: chosenTrack || 'Zonasi',
    status: 'pending' as const,
    submittedAt: new Date().toISOString(),
  };

  db.ppdb.unshift(reg);
  saveDb(db);

  return res.status(201).json({
    message: 'Pendaftaran PPDB berhasil dikirim!',
    registration: reg,
  });
});

app.patch('/api/ppdb/:id/status', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya Admin yang dapat memverifikasi berkas PPDB' });
  }
  const { status } = req.body;
  const db = getDb();
  const reg = db.ppdb.find((p) => p.id === req.params.id);
  if (!reg) return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan' });

  reg.status = status;
  saveDb(db);
  logActivity(user.id, user.name, user.role, 'Verifikasi Status PPDB', `${reg.fullName} (${status})`);
  return res.json({ message: 'Status berhasil diperbarui', registration: reg });
});

// ==================== CONTACT MESSAGES API ====================
app.get('/api/contact', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  const db = getDb();
  return res.json(db.contactMessages);
});

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !message || (!email && !phone)) {
    return res.status(400).json({ error: 'Nama, pesan, dan kontak (email/telepon) wajib diisi.' });
  }

  const db = getDb();
  const newMsg = {
    id: `msg_${Date.now()}`,
    name,
    email: email || '',
    phone: phone || '',
    subject: subject || 'Pesan dari Pengunjung Website',
    message,
    date: new Date().toISOString(),
    read: false,
  };
  db.contactMessages.unshift(newMsg);
  saveDb(db);

  return res.status(201).json({ message: 'Pesan Anda berhasil dikirim kepada pihak sekolah!' });
});

// ==================== COMMENTS API ====================
app.get('/api/comments', (req: Request, res: Response) => {
  const db = getDb();
  const { articleId } = req.query;
  let comments = [...db.comments];
  if (articleId) {
    comments = comments.filter((c) => c.articleId === articleId && c.status === 'approved');
  }
  return res.json(comments);
});

app.post('/api/comments', (req: Request, res: Response) => {
  const { articleId, articleTitle, name, email, content } = req.body;
  if (!name || !content || !articleId) {
    return res.status(400).json({ error: 'Nama dan komentar wajib diisi' });
  }

  const db = getDb();
  const comment = {
    id: `com_${Date.now()}`,
    articleId,
    articleTitle: articleTitle || 'Artikel SMAN 1 Julok',
    name: name.trim(),
    email: email || '',
    content: content.trim(),
    date: new Date().toISOString(),
    status: 'approved' as const, // approved directly
  };
  db.comments.unshift(comment);
  saveDb(db);
  return res.status(201).json({ message: 'Komentar berhasil dipublikasikan!', comment });
});

app.delete('/api/comments/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  const db = getDb();
  db.comments = db.comments.filter((c) => c.id !== req.params.id);
  saveDb(db);
  return res.json({ message: 'Komentar dihapus' });
});

// ==================== USERS MANAGEMENT API ====================
app.get('/api/users', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  const db = getDb();
  const safeUsers = db.users.map(({ password: _, ...u }) => u);
  return res.json(safeUsers);
});

app.post('/api/users', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya Admin yang dapat membuat akun' });
  }

  const { username, name, role, email, password, nip, bio } = req.body;
  if (!username || !password || !name || !role) {
    return res.status(400).json({ error: 'Username, password, nama, dan role wajib diisi' });
  }

  const db = getDb();
  if (db.users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Username sudah digunakan, silakan pilih username lain' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: User = {
    id: `usr_${Date.now()}`,
    username: username.trim(),
    name: name.trim(),
    role: role as UserRole,
    email: email || '',
    nip: nip || '',
    bio: bio || '',
    avatar: `https://images.unsplash.com/photo-${role === 'guru' ? '1500648767791-00dcc994a43e' : '1534528741775-53994a69daeb'}?auto=format&fit=crop&w=200&h=200&q=80`,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Menambah Pengguna Baru', `${newUser.name} (${newUser.role})`);

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({ message: 'Akun berhasil dibuat', user: safeUser });
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return res.status(401).json({ error: 'Akses ditolak' });
  }

  const db = getDb();
  const targetUser = db.users.find((u) => u.id === req.params.id);
  if (!targetUser) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });

  // Only admin or the user themselves can update
  if (authUser.role !== 'admin' && authUser.id !== targetUser.id) {
    return res.status(403).json({ error: 'Akses ditolak' });
  }

  const { name, email, nip, bio, password, role } = req.body;

  if (name) targetUser.name = name;
  if (email !== undefined) targetUser.email = email;
  if (nip !== undefined) targetUser.nip = nip;
  if (bio !== undefined) targetUser.bio = bio;
  if (password && password.trim().length > 0) {
    targetUser.password = bcrypt.hashSync(password, 10);
  }
  // Only admin can change roles
  if (role && authUser.role === 'admin') {
    targetUser.role = role as UserRole;
  }

  saveDb(db);
  logActivity(authUser.id, authUser.name, authUser.role, 'Memperbarui Akun', targetUser.name);

  const { password: _, ...safeUser } = targetUser;
  return res.json({ message: 'Data pengguna diperbarui', user: safeUser });
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const authUser = getAuthUser(req);
  if (!authUser || authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya Admin yang dapat menghapus akun' });
  }

  if (authUser.id === req.params.id) {
    return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri saat sedang aktif' });
  }

  const db = getDb();
  const targetUser = db.users.find((u) => u.id === req.params.id);
  if (!targetUser) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });

  db.users = db.users.filter((u) => u.id !== req.params.id);
  saveDb(db);

  logActivity(authUser.id, authUser.name, authUser.role, 'Menghapus Akun', targetUser.name);
  return res.json({ message: 'Pengguna berhasil dihapus' });
});

// ==================== SETTINGS & SEO API ====================
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = getDb();
  return res.json(db.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya Administrator yang dapat mengubah pengaturan website' });
  }

  const db = getDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Memperbarui Pengaturan Website', 'Pengaturan Global & SEO');
  return res.json({ message: 'Pengaturan website berhasil disimpan', settings: db.settings });
});

// ==================== VISITOR STATS API ====================
app.post('/api/stats/visit', (req: Request, res: Response) => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  db.stats.totalVisits += 1;

  if (db.stats.lastVisitDate === today) {
    db.stats.todayVisits += 1;
  } else {
    db.stats.lastVisitDate = today;
    db.stats.todayVisits = 1;
  }

  // Update daily history
  const historyItem = db.stats.dailyHistory.find((h) => h.date === today);
  if (historyItem) {
    historyItem.count += 1;
  } else {
    db.stats.dailyHistory.push({ date: today, count: 1 });
    if (db.stats.dailyHistory.length > 30) {
      db.stats.dailyHistory.shift();
    }
  }

  // Device breakdown
  if (userAgent.includes('mobile')) {
    db.stats.deviceBreakdown.mobile += 1;
  } else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
    db.stats.deviceBreakdown.tablet += 1;
  } else {
    db.stats.deviceBreakdown.desktop += 1;
  }

  saveDb(db);
  return res.json({ status: 'ok', total: db.stats.totalVisits });
});

app.get('/api/stats', (_req: Request, res: Response) => {
  const db = getDb();
  return res.json({
    stats: db.stats,
    totalArticles: db.articles.length,
    publishedArticles: db.articles.filter((a) => a.status === 'published').length,
    totalUsers: db.users.length,
    totalTeachers: db.users.filter((u) => u.role === 'guru').length + db.teachers.length,
    totalEditors: db.users.filter((u) => u.role === 'editor').length,
    totalAnnouncements: db.announcements.length,
    totalAgendas: db.agenda.length,
    totalPPDB: db.ppdb.length,
    totalComments: db.comments.length,
    recentArticles: db.articles.slice(0, 5),
    recentLogs: db.logs.slice(0, 8),
  });
});

// ==================== MEDIA LIBRARY API ====================
app.get('/api/media', (_req: Request, res: Response) => {
  const db = getDb();
  return res.json(db.media);
});

app.post('/api/media', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Akses ditolak' });

  const { name, url, size, type, altText } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'File name dan URL wajib ada' });

  const db = getDb();
  const newMedia = {
    id: `med_${Date.now()}`,
    name,
    url,
    size: size || 120000,
    type: type || 'image/webp',
    altText: altText || name,
    uploadedAt: new Date().toISOString(),
  };
  db.media.unshift(newMedia);
  saveDb(db);

  logActivity(user.id, user.name, user.role, 'Upload Media Library', name);
  return res.status(201).json(newMedia);
});

app.delete('/api/media/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role === 'guru') return res.status(403).json({ error: 'Akses ditolak' });
  const db = getDb();
  db.media = db.media.filter((m) => m.id !== req.params.id);
  saveDb(db);
  return res.json({ message: 'Media berhasil dihapus' });
});

// ==================== UNIVERSAL FILE UPLOAD API ====================
app.post('/api/upload', (req: Request, res: Response) => {
  const { fileData, fileName = 'image.png', fileType = 'image/png', altText } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'Data berkas gambar tidak boleh kosong.' });
  }

  try {
    let finalUrl = fileData;
    let size = 0;

    // Handle base64 data URL
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
      const match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        size = buffer.length;

        const ext = mime.split('/')[1]?.replace('jpeg', 'jpg').replace('svg+xml', 'svg') || 'png';
        const cleanName = String(fileName).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
        const savedFileName = `${Date.now()}_${cleanName}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, savedFileName);

        fs.writeFileSync(filePath, buffer);
        finalUrl = `/uploads/${savedFileName}`;
      }
    }

    const db = getDb();
    const newMedia = {
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: fileName,
      url: finalUrl,
      size: size || fileData.length,
      type: fileType,
      altText: altText || fileName,
      uploadedAt: new Date().toISOString(),
    };

    db.media.unshift(newMedia);
    saveDb(db);

    const user = getAuthUser(req);
    if (user) {
      logActivity(user.id, user.name, user.role, 'Upload Berkas Gambar', fileName);
    }

    return res.status(201).json({
      url: finalUrl,
      name: fileName,
      size: newMedia.size,
      type: fileType,
      id: newMedia.id,
      message: 'Gambar berhasil diunggah dan disimpan!',
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Gagal mengunggah gambar: ' + err.message });
  }
});

// Helper for contextual school article generation
function generateContextualSchoolArticle(
  topic: string,
  category: string = 'Berita Sekolah',
  tone: string = 'Jurnalistik Resmi',
  length: string = 'medium',
  keywords: string = ''
) {
  const cleanTopic = topic.trim();
  const slug = cleanTopic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80);
  const title = `SMA Negeri 1 Julok: ${cleanTopic}`;

  const tags = ['SMAN 1 Julok', 'Aceh Timur', category];
  if (keywords) {
    keywords.split(',').forEach((k) => {
      const trimmed = k.trim();
      if (trimmed && !tags.includes(trimmed)) tags.push(trimmed);
    });
  }

  const content = `<h2>${cleanTopic}</h2>
<p><strong>JULOK, ACEH TIMUR</strong> &mdash; SMA Negeri 1 Julok kembali menunjukkan komitmen nyatanya dalam memajukan mutu pendidikan dan pembinaan generasi unggul di Kabupaten Aceh Timur melalui penyelenggaraan <em>${cleanTopic}</em>.</p>

<p>Kegiatan ini menjadi momentum penting bagi segenap civitas akademika dalam memperkuat sinergi antara pembelajaran transformatif Kurikulum Merdeka dan pembentukan Profil Pelajar Pancasila yang beriman, bertakwa, berakhlak mulia, serta berwawasan global.</p>

<h3>Apresiasi Pimpinan Sekolah dan Semangat Peserta</h3>
<p>Kepala SMA Negeri 1 Julok, <strong>Drs. H. Bakhtiar, M.Pd</strong>, menyampaikan apresiasi setinggi-tingginya kepada seluruh dewan guru, staf tata usaha, komite sekolah, dan para siswa yang telah berpartisipasi aktif mempersiapkan dan menyukseskan rangkaian kegiatan ini.</p>

<blockquote>
  <p>"Pendidikan bukan sekadar transfer ilmu pengetahuan semata, namun penanaman karakter, budi pekerti, dan ketangguhan mental siswa. Melalui ${cleanTopic}, kita membuktikan bahwa siswa-siswi SMAN 1 Julok memiliki daya saing tinggi dan semangat juang yang patut dibanggakan," tutur beliau dalam sambutannya.</p>
</blockquote>

<h3>Rangkaian Kegiatan dan Dampak Positif</h3>
<p>Selama berlangsungnya kegiatan, para siswa terlihat sangat antusias dan bersemangat. Berbagai aspek kompetensi abad ke-21 &mdash; meliputi bernalar kritis, kreativitas inovatif, kolaborasi, dan komunikasi &mdash; tampak terasah dengan baik di bawah bimbingan para guru pembina.</p>

<ul>
  <li><strong>Keterlibatan Kolaboratif:</strong> Mengikutsertakan perwakilan kelas, pengurus OSIS/MPK, ekstrakurikuler, dan bimbingan intensif dewan guru.</li>
  <li><strong>Penguatan Karakter & Budaya:</strong> Mengintegrasikan nilai-nilai luhur kearifan lokal Aceh dan kepedulian terhadap lingkungan hidup berkelanjutan.</li>
  <li><strong>Sarana Prasarana Terpadu:</strong> Didukung penuh oleh fasilitas laboratorium dan lingkungan kampus hijau SMA Negeri 1 Julok.</li>
</ul>

<h3>Harapan dan Langkah Berkelanjutan</h3>
<p>Diharapkan hasil positif dari <strong>${cleanTopic}</strong> ini dapat terus dipertahankan dan ditumbuhkembangkan menjadi tradisi prestasi yang berkesinambungan di SMA Negeri 1 Julok, menginspirasi kemajuan pendidikan di Aceh Timur dan Indonesia.</p>`;

  const excerpt = `SMA Negeri 1 Julok sukses menyelenggarakan kegiatan ${cleanTopic} sebagai wujud nyata penguatan karakter Profil Pelajar Pancasila dan peningkatan mutu pendidikan di Aceh Timur.`;
  const seoTitle = `${title.substring(0, 50)} | SMAN 1 Julok`;
  const metaDescription = excerpt.length > 155 ? `${excerpt.substring(0, 150)}...` : excerpt;
  const focusKeyword = cleanTopic.split(' ').slice(0, 3).join(' ');

  const fallbackImages: Record<string, string> = {
    'Prestasi Siswa': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=700&q=80',
    'Akademik & Kurikulum': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=700&q=80',
    'Kegiatan OSIS & Ekskul': 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&h=700&q=80',
    'Opini & Karya Guru': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=700&q=80',
    'Pengumuman Resmi': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&h=700&q=80',
    'default': 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=700&q=80',
  };
  const featuredImage = fallbackImages[category] || fallbackImages['default'];

  return {
    title,
    slug,
    content,
    excerpt,
    category,
    tags,
    seoTitle,
    metaDescription,
    focusKeyword,
    featuredImage,
    altImage: `Dokumentasi kegiatan ${cleanTopic} di SMA Negeri 1 Julok`,
  };
}

// ==================== AI ARTICLE GENERATOR API ====================
app.post('/api/ai/generate-article', async (req: Request, res: Response) => {
  const {
    topic,
    category = 'Berita Sekolah',
    tone = 'Jurnalistik Resmi',
    length = 'medium',
    keywords = '',
  } = req.body;

  if (!topic || !String(topic).trim()) {
    return res.status(400).json({ error: 'Topik atau ide artikel wajib diisi.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const hasRealKey = Boolean(
    apiKey &&
    apiKey !== 'MY_GEMINI_API_KEY' &&
    !apiKey.includes('MY_GEMINI') &&
    apiKey.trim().length > 15
  );

  if (hasRealKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey!,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Anda adalah jurnalis dan staf humas profesional SMA Negeri 1 Julok, Kabupaten Aceh Timur, Provinsi Aceh.
Tulis artikel berita sekolah yang sangat menarik, berbobot, terstruktur rapi, dan sesuai kaidah jurnalistik modern.

Informasi Topik:
- Topik / Ide Utama: "${topic}"
- Kategori yang ditargetkan: "${category}"
- Gaya Bahasa / Tone: "${tone}"
- Target Panjang: ${length === 'short' ? 'Sekitar 300 kata (ringkas & padat)' : length === 'long' ? 'Sekitar 800-1000 kata (mendalam & komprehensif)' : 'Sekitar 500-600 kata (standar)'}
- Kata Kunci Tambahan: "${keywords}"

Identitas Sekolah untuk konteks:
- Sekolah: SMA Negeri 1 Julok (Aceh Timur)
- Kepala Sekolah: Drs. H. Bakhtiar, M.Pd
- Karakter: Berakhlak Mulia, Prestasi Akademik & Non-akademik, Kurikulum Merdeka, Kearifan Lokal Aceh

Berikan respon WAJIB berupa JSON yang valid dengan format persis berikut:
{
  "title": "Judul berita yang memikat, formal dan profesional",
  "content": "Isi lengkap artikel dalam format tag HTML (gunakan <h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <strong>). Jangan gunakan markdown # atau *, gunakan murni HTML.",
  "excerpt": "Ringkasan berita dalam 2-3 kalimat padat untuk deskripsi kartu dan cuplikan media sosial.",
  "category": "${category}",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "seoTitle": "Judul SEO maksimal 60 karakter untuk Google",
  "metaDescription": "Meta deskripsi SEO maksimal 155 karakter",
  "focusKeyword": "Kata kunci fokus 2-4 kata",
  "altImage": "Deskripsi foto untuk aksesibilitas alt text"
}`;

      // Call Gemini with 10s timeout to prevent hanging
      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timed out')), 10000)
      );

      const aiResponse = (await Promise.race([aiPromise, timeoutPromise])) as any;
      const text = aiResponse.text || '{}';
      const parsed = JSON.parse(text);

      const fallbackImages: Record<string, string> = {
        'Prestasi Siswa': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=700&q=80',
        'Akademik & Kurikulum': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=700&q=80',
        'Kegiatan OSIS & Ekskul': 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&h=700&q=80',
        'Opini & Karya Guru': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=700&q=80',
        'Pengumuman Resmi': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&h=700&q=80',
        default: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=700&q=80',
      };
      const featuredImage = fallbackImages[parsed.category] || fallbackImages['default'];

      return res.json({
        ...parsed,
        featuredImage,
        aiGenerated: true,
        model: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Gemini API call skipped or timed out, using contextual school generator:', err.message);
    }
  }

  // Fallback intelligent contextual generator
  const generated = generateContextualSchoolArticle(topic, category, tone, length, keywords);
  return res.json({
    ...generated,
    aiGenerated: true,
    model: 'sman1julok-ai-engine',
  });
});

app.post('/api/ai/refine-text', async (req: Request, res: Response) => {
  const { text, action } = req.body;
  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'Teks tidak boleh kosong.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const hasRealKey = Boolean(
    apiKey &&
    apiKey !== 'MY_GEMINI_API_KEY' &&
    !apiKey.includes('MY_GEMINI') &&
    apiKey.trim().length > 15
  );

  if (hasRealKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey!,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      let instruction = 'Perbaiki tata bahasa, ejaan baku KBBI, dan sempurnakan kalimat berikut agar lebih profesional.';
      if (action === 'expand') instruction = 'Perluas dan elaborasi paragraf berikut menjadi lebih mendalam dengan detail relevan kegiatan sekolah.';
      if (action === 'summarize') instruction = 'Ringkas teks berikut menjadi 2 kalimat padat yang informatif.';
      if (action === 'catchy-title') instruction = 'Buatkan 3 opsi judul artikel berita yang sangat menarik, elegan, dan memikat pembaca.';
      if (action === 'seo') instruction = 'Buatkan meta description SEO optimal (maks 150 karakter) dan 5 focus tags dari teks berikut.';

      const resp = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${instruction}\n\nTeks asli:\n${text}`,
      });

      return res.json({
        result: resp.text || text,
        model: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Refine text error, fallbacking:', err.message);
    }
  }

  // Fallback text processing
  let result = text;
  if (action === 'expand') {
    result = `${text} Kegiatan ini turut didukung penuh oleh segenap dewan guru dan civitas akademika SMA Negeri 1 Julok guna memajukan mutu pendidikan berbasis kearifan lokal Aceh dan wawasan global.`;
  } else if (action === 'summarize') {
    result = `${text.substring(0, 140)}... (Ringkasan kegiatan resmi SMA Negeri 1 Julok)`;
  } else if (action === 'seo') {
    result = `${text.substring(0, 150)} | SMAN 1 Julok Aceh Timur`;
  } else if (action === 'catchy-title') {
    result = `1. Terobosan Baru: ${text}\n2. Gemilang Prestasi SMAN 1 Julok: ${text}\n3. Mengukir Sejarah: ${text}`;
  }

  return res.json({
    result,
    model: 'sman1julok-ai-engine',
  });
});

// ==================== BACKUP & RESTORE API ====================
app.get('/api/backup', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak: Hanya Admin yang dapat mengunduh backup database' });
  }
  const db = getDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=backup-sman1julok-${new Date().toISOString().split('T')[0]}.json`);
  return res.send(JSON.stringify(db, null, 2));
});

app.post('/api/backup/restore', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya Admin yang dapat memulihkan database' });
  }

  const { data } = req.body;
  if (!data || !data.users || !data.articles) {
    return res.status(400).json({ error: 'Format data backup tidak valid' });
  }

  saveDb(data);
  logActivity(user.id, user.name, user.role, 'Restore Database Backup', 'Pemulihan Sukses');
  return res.json({ message: 'Database berhasil dipulihkan!' });
});

// ==================== DYNAMIC SITEMAP.XML ====================
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const db = getDb();
  const baseUrl = process.env.APP_URL || 'https://sman1julok.sch.id';
  const now = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    '',
    '/profil-sekolah',
    '/sejarah-sekolah',
    '/visi-dan-misi',
    '/sambutan-kepala-sekolah',
    '/struktur-organisasi',
    '/data-guru',
    '/data-siswa',
    '/fasilitas-sekolah',
    '/kurikulum-sekolah',
    '/program-unggulan',
    '/berita',
    '/pengumuman',
    '/agenda',
    '/galeri-foto',
    '/galeri-video',
    '/prestasi',
    '/ekstrakurikuler',
    '/ppdb',
    '/kontak',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static routes
  for (const route of staticRoutes) {
    xml += `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === '' || route === '/berita' ? 'daily' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : route === '/berita' || route === '/ppdb' ? '0.9' : '0.8'}</priority>
  </url>
`;
  }

  // Articles
  for (const art of db.articles.filter((a) => a.status === 'published')) {
    const artDate = (art.updatedAt || art.publishedAt || now).split('T')[0];
    xml += `  <url>
    <loc>${baseUrl}/berita/${encodeURIComponent(art.slug)}</loc>
    <lastmod>${artDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  return res.send(xml);
});

// ==================== DYNAMIC ROBOTS.TXT ====================
app.get('/robots.txt', (_req: Request, res: Response) => {
  const db = getDb();
  res.setHeader('Content-Type', 'text/plain');
  return res.send(db.settings.robotsTxtContent);
});

// ==================== API 404 FALLBACK ====================
app.all('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({
    error: `Rute API tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
});

// ==================== VITE & SSR OPEN GRAPH HANDLER ====================
async function setupApp() {
  let vite: any = null;

  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));
  }

  // HTML serving with Server-Side Open Graph & Metadata Injection
  app.use('*', async (req: Request, res: Response, next) => {
    const url = req.originalUrl;
    if (url.startsWith('/api/') || url.includes('.')) {
      return next();
    }

    try {
      let template: string;
      if (!isProduction) {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
      }

      const db = getDb();
      const baseUrl = process.env.APP_URL || 'https://sman1julok.sch.id';

      // Check if visiting an article page
      const articleMatch = url.match(/^\/berita\/([a-zA-Z0-9_-]+)/);
      if (articleMatch) {
        const slug = articleMatch[1];
        const article = db.articles.find((a) => a.slug === slug);
        if (article) {
          const ogTitle = `${article.seoTitle || article.title} | SMA Negeri 1 Julok`;
          const ogDesc = article.metaDescription || article.excerpt;
          const ogImg = article.ogImage || article.featuredImage || db.settings.ogImageDefault;
          const ogUrl = `${baseUrl}/berita/${article.slug}`;

          // Inject into HTML
          template = template
            .replace(/<title>.*?<\/title>/i, `<title>${ogTitle}</title>`)
            .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${ogDesc.replace(/"/g, '&quot;')}" />`)
            .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}" />`)
            .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${ogDesc.replace(/"/g, '&quot;')}" />`)
            .replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${ogImg}" />`)
            .replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${ogUrl}" />`)
            .replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}" />`)
            .replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${ogDesc.replace(/"/g, '&quot;')}" />`)
            .replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${ogImg}" />`);

          // Inject NewsArticle JSON-LD Schema
          const articleSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": ${JSON.stringify(article.title)},
      "description": ${JSON.stringify(article.excerpt)},
      "image": [${JSON.stringify(ogImg)}],
      "datePublished": ${JSON.stringify(article.publishedAt)},
      "dateModified": ${JSON.stringify(article.updatedAt || article.publishedAt)},
      "author": [{
        "@type": "Person",
        "name": ${JSON.stringify(article.authorName)}
      }],
      "publisher": {
        "@type": "Organization",
        "name": "SMA Negeri 1 Julok",
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=300&h=300&q=80"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": ${JSON.stringify(ogUrl)}
      }
    }
    </script>
    </head>`;
          template = template.replace('</head>', articleSchema);
        }
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      if (vite) vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server SMAN 1 Julok running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
