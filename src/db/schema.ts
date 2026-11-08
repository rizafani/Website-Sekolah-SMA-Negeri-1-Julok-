import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  json,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or system user ID
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('guru'), // 'admin' | 'editor' | 'guru'
  email: text('email').notNull(),
  avatar: text('avatar'),
  nip: text('nip'),
  bio: text('bio'),
  password: text('password'), // hashed bcrypt for password auth
  createdAt: timestamp('created_at').defaultNow(),
});

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  featuredImage: text('featured_image').notNull(),
  category: text('category').notNull(),
  tags: json('tags').$type<string[]>().notNull().default([]),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull(),
  status: text('status').notNull().default('published'), // 'published' | 'draft'
  views: integer('views').notNull().default(0),
  seoTitle: text('seo_title'),
  metaDescription: text('meta_description'),
  canonicalUrl: text('canonical_url'),
  ogImage: text('og_image'),
  altImage: text('alt_image'),
  focusKeyword: text('focus_keyword'),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  fileUrl: text('file_url'),
  fileName: text('file_name'),
  authorName: text('author_name').notNull(),
  isUrgent: boolean('is_urgent').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const agenda = pgTable('agenda', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  endDate: text('end_date'),
  time: text('time').notNull(),
  location: text('location').notNull(),
  description: text('description'),
  organizer: text('organizer').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  type: text('type').notNull().default('photo'), // 'photo' | 'video'
  title: text('title').notNull(),
  url: text('url').notNull(),
  thumbnail: text('thumbnail'),
  category: text('category').notNull(),
  date: text('date').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ppdbRegistrations = pgTable('ppdb_registrations', {
  id: serial('id').primaryKey(),
  regNumber: text('reg_number').notNull().unique(),
  fullName: text('full_name').notNull(),
  nisn: text('nisn').notNull(),
  birthPlace: text('birth_place'),
  birthDate: text('birth_date'),
  gender: text('gender').notNull(),
  previousSchool: text('previous_school').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  address: text('address'),
  chosenTrack: text('chosen_track').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'verified' | 'accepted' | 'rejected'
  submittedAt: timestamp('submitted_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleId: text('article_id').notNull(),
  articleTitle: text('article_title').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  content: text('content').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull().default('approved'),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  date: timestamp('date').defaultNow(),
  read: boolean('read').default(false),
});

export const schoolSettings = pgTable('school_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique().default('main'),
  data: json('data').notNull(),
});

export const visitorStats = pgTable('visitor_stats', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique().default('main'),
  totalVisits: integer('total_visits').notNull().default(14850),
  todayVisits: integer('today_visits').notNull().default(342),
  lastVisitDate: text('last_visit_date').notNull(),
  dailyHistory: json('daily_history').notNull(),
  deviceBreakdown: json('device_breakdown').notNull(),
});

export const mediaFiles = pgTable('media_files', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  type: text('type').notNull(),
  altText: text('alt_text').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});
