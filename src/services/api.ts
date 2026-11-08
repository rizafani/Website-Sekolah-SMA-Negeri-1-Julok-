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
  MediaFile,
} from '../types/index.ts';

const TOKEN_KEY = 'sman1julok_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 404) {
      throw new Error(
        errorData.error ||
          'Layanan API (404 Not Found) belum siap atau rute tidak ditemukan. Silakan muat ulang halaman atau coba sesaat lagi.'
      );
    }
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    try {
      return await request<{ token: string; user: User; message: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (err: any) {
      // If 404 on /api/auth/login, try alternative /api/login endpoint
      if (err.message && err.message.includes('404')) {
        return await request<{ token: string; user: User; message: string }>('/api/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
      }
      throw err;
    }
  },
  getMe: async () => {
    try {
      return await request<{ user: User }>('/api/auth/me');
    } catch (err: any) {
      if (err.message && err.message.includes('404')) {
        return await request<{ user: User }>('/api/me');
      }
      throw err;
    }
  },

  // Articles
  getArticles: (params: { category?: string; tag?: string; search?: string; status?: string; authorId?: string; limit?: number; page?: number } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.tag) searchParams.append('tag', params.tag);
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.authorId) searchParams.append('authorId', params.authorId);
    if (params.limit) searchParams.append('limit', String(params.limit));
    if (params.page) searchParams.append('page', String(params.page));
    return request<{ data: Article[]; total: number; page: number; totalPages: number }>(`/api/articles?${searchParams.toString()}`);
  },
  getArticle: (slugOrId: string) => request<Article>(`/api/articles/${encodeURIComponent(slugOrId)}`),
  createArticle: (data: Partial<Article>) =>
    request<{ message: string; article: Article }>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateArticle: (id: string, data: Partial<Article>) =>
    request<{ message: string; article: Article }>(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteArticle: (id: string) =>
    request<{ message: string }>(`/api/articles/${id}`, {
      method: 'DELETE',
    }),

  // Pages
  getPages: () => request<StaticPage[]>('/api/pages'),
  getPage: (slug: string) => request<StaticPage>(`/api/pages/${slug}`),
  updatePage: (id: string, data: Partial<StaticPage>) =>
    request<{ message: string; page: StaticPage }>(`/api/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Announcements
  getAnnouncements: () => request<Announcement[]>('/api/announcements'),
  createAnnouncement: (data: Partial<Announcement>) =>
    request<Announcement>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAnnouncement: (id: string) =>
    request<{ message: string }>(`/api/announcements/${id}`, {
      method: 'DELETE',
    }),

  // Agenda
  getAgenda: () => request<AgendaItem[]>('/api/agenda'),
  createAgenda: (data: Partial<AgendaItem>) =>
    request<AgendaItem>('/api/agenda', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAgenda: (id: string) =>
    request<{ message: string }>(`/api/agenda/${id}`, {
      method: 'DELETE',
    }),

  // Gallery
  getGallery: () => request<GalleryItem[]>('/api/gallery'),
  createGalleryItem: (data: Partial<GalleryItem>) =>
    request<GalleryItem>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteGalleryItem: (id: string) =>
    request<{ message: string }>(`/api/gallery/${id}`, {
      method: 'DELETE',
    }),

  // Data Sekolah
  getTeachers: () => request<Teacher[]>('/api/teachers'),
  getFacilities: () => request<Facility[]>('/api/facilities'),
  getAchievements: () => request<Achievement[]>('/api/achievements'),
  getExtracurriculars: () => request<Extracurricular[]>('/api/extracurriculars'),

  // PPDB Online
  getPPDBList: () => request<PPDBRegistration[]>('/api/ppdb'),
  submitPPDB: (data: Partial<PPDBRegistration>) =>
    request<{ message: string; registration: PPDBRegistration }>('/api/ppdb', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePPDBStatus: (id: string, status: PPDBRegistration['status']) =>
    request<{ message: string; registration: PPDBRegistration }>(`/api/ppdb/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Contact
  getContactMessages: () => request<ContactMessage[]>('/api/contact'),
  submitContact: (data: Partial<ContactMessage>) =>
    request<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Comments
  getComments: (articleId?: string) =>
    request<Comment[]>(`/api/comments${articleId ? `?articleId=${articleId}` : ''}`),
  submitComment: (data: { articleId: string; articleTitle: string; name: string; email?: string; content: string }) =>
    request<{ message: string; comment: Comment }>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteComment: (id: string) =>
    request<{ message: string }>(`/api/comments/${id}`, {
      method: 'DELETE',
    }),

  // Settings & SEO
  getSettings: () => request<SchoolSettings>('/api/settings'),
  updateSettings: (data: Partial<SchoolSettings>) =>
    request<{ message: string; settings: SchoolSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Stats
  recordVisit: () => request<{ status: string; total: number }>('/api/stats/visit', { method: 'POST' }),
  getDashboardStats: () =>
    request<{
      stats: VisitorStats;
      totalArticles: number;
      publishedArticles: number;
      totalUsers: number;
      totalTeachers: number;
      totalEditors: number;
      totalAnnouncements: number;
      totalAgendas: number;
      totalPPDB: number;
      totalComments: number;
      recentArticles: Article[];
      recentLogs: any[];
    }>('/api/stats'),

  // Media Library
  getMedia: () => request<MediaFile[]>('/api/media'),
  uploadMedia: (data: Partial<MediaFile>) =>
    request<MediaFile>('/api/media', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMedia: (id: string) =>
    request<{ message: string }>(`/api/media/${id}`, {
      method: 'DELETE',
    }),

  // Users
  getUsers: () => request<User[]>('/api/users'),
  createUser: (data: Partial<User>) =>
    request<{ message: string; user: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: Partial<User>) =>
    request<{ message: string; user: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    request<{ message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    }),

  // Backup & Restore
  exportBackupUrl: '/api/backup',
  restoreBackup: (data: any) =>
    request<{ message: string }>('/api/backup/restore', {
      method: 'POST',
      body: JSON.stringify({ data }),
    }),

  // File Upload API
  uploadFile: async (
    fileOrData: File | string,
    fileName: string = 'image.png',
    fileType: string = 'image/png',
    altText?: string
  ) => {
    let base64 = '';
    let name = fileName;
    let type = fileType;

    if (typeof window !== 'undefined' && fileOrData instanceof File) {
      name = fileOrData.name;
      type = fileOrData.type;
      base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrData);
      });
    } else {
      base64 = fileOrData as string;
    }

    return request<{ url: string; name: string; size: number; type: string; id: string; message: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ fileData: base64, fileName: name, fileType: type, altText }),
    });
  },

  // AI Assistant APIs
  generateAIArticle: (params: {
    topic: string;
    category?: string;
    tone?: string;
    length?: 'short' | 'medium' | 'long';
    keywords?: string;
  }) =>
    request<{
      title: string;
      content: string;
      excerpt: string;
      category: string;
      tags: string[];
      seoTitle: string;
      metaDescription: string;
      focusKeyword: string;
      featuredImage: string;
      altImage: string;
      aiGenerated: boolean;
      model: string;
    }>('/api/ai/generate-article', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  refineAIText: (params: { text: string; action: 'expand' | 'summarize' | 'grammar' | 'seo' | 'catchy-title' }) =>
    request<{ result: string }>('/api/ai/refine-text', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};
