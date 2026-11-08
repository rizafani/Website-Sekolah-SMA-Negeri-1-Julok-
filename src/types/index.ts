export type UserRole = 'admin' | 'editor' | 'guru';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  nip?: string;
  bio?: string;
  password?: string; // hashed
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string; // HTML rich text
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  status: 'published' | 'draft';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  // SEO fields
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  altImage: string;
  focusKeyword: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  lastUpdated: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  fileUrl?: string;
  fileName?: string;
  authorName: string;
  isUrgent?: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
}

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  url: string; // photo URL or YouTube embed URL
  thumbnail?: string;
  category: string;
  date: string;
  description?: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  role: string;
  subject: string;
  education: string;
  photo: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  studentName: string;
  category: string; // Sains, Olahraga, Seni, Keagamaan
  level: string; // Kabupaten, Provinsi, Nasional
  year: string;
  image: string;
  description: string;
}

export interface Extracurricular {
  id: string;
  name: string;
  coach: string;
  schedule: string;
  image: string;
  description: string;
  achievements?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  articleTitle: string;
  name: string;
  email: string;
  content: string;
  date: string;
  status: 'approved' | 'pending' | 'spam';
}

export interface PPDBRegistration {
  id: string;
  regNumber: string;
  fullName: string;
  nisn: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  previousSchool: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  address: string;
  chosenTrack: 'Zonasi' | 'Prestasi' | 'Afirmasi' | 'Perpindahan Orang Tua';
  photo?: string;
  status: 'pending' | 'verified' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SchoolSettings {
  name: string;
  shortName: string;
  npsn: string;
  akreditasi: string;
  slogan: string;
  headmasterName: string;
  headmasterNip: string;
  headmasterWelcome: string;
  headmasterPhoto: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  mapsEmbedUrl: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  // SEO Global
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalBase: string;
  googleVerification: string;
  analyticsId: string;
  ogImageDefault: string;
  robotsTxtContent: string;
}

export interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  lastVisitDate: string;
  dailyHistory: { date: string; count: number }[];
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  altText: string;
  uploadedAt: string;
}
