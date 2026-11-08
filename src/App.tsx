import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp.tsx';

// Public pages
import { HomePage } from './components/home/HomePage.tsx';
import { ProfileStaticPage } from './components/pages/ProfileStaticPage.tsx';
import { TeachersPage } from './components/pages/TeachersPage.tsx';
import { StudentsPage } from './components/pages/StudentsPage.tsx';
import { FacilitiesPage } from './components/pages/FacilitiesPage.tsx';
import { NewsListPage } from './components/pages/NewsListPage.tsx';
import { NewsDetailPage } from './components/pages/NewsDetailPage.tsx';
import { AnnouncementsPage } from './components/pages/AnnouncementsPage.tsx';
import { AgendaPage } from './components/pages/AgendaPage.tsx';
import { GalleryPage } from './components/pages/GalleryPage.tsx';
import { AchievementsPage } from './components/pages/AchievementsPage.tsx';
import { ExtracurricularPage } from './components/pages/ExtracurricularPage.tsx';
import { PPDBPage } from './components/pages/PPDBPage.tsx';
import { ContactPage } from './components/pages/ContactPage.tsx';
import { SearchPage } from './components/pages/SearchPage.tsx';
import { LoginPage } from './components/pages/LoginPage.tsx';

// CMS Dashboard components
import { DashboardLayout } from './components/cms/DashboardLayout.tsx';
import { DashboardOverview } from './components/cms/DashboardOverview.tsx';
import { ArticleEditor } from './components/cms/ArticleEditor.tsx';
import { ArticleListPage } from './components/cms/ArticleListPage.tsx';
import { UserManagementPage } from './components/cms/UserManagementPage.tsx';
import { SEOSettingsPage } from './components/cms/SEOSettingsPage.tsx';
import { MediaLibraryPage } from './components/cms/MediaLibraryPage.tsx';
import { SchoolSettingsPage } from './components/cms/SchoolSettingsPage.tsx';
import { PPDBManagementPage } from './components/cms/PPDBManagementPage.tsx';
import { AnnouncementsAndAgendaPage } from './components/cms/AnnouncementsAndAgendaPage.tsx';
import { StaticPagesManagement } from './components/cms/StaticPagesManagement.tsx';
import { UserProfilePage } from './components/cms/UserProfilePage.tsx';

import { Article, Category } from './types/index.ts';
import { api } from './services/api.ts';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [viewParam, setViewParam] = useState<string | null>(null);

  // CMS internal tab state
  const [dashboardTab, setDashboardTab] = useState('overview');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Synchronize initial URL path on browser load or refresh
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/berita/')) {
      const slug = path.replace('/berita/', '');
      setCurrentView('berita-detail');
      setViewParam(slug);
    } else if (path === '/berita') {
      setCurrentView('berita');
    } else if (path === '/profil' || path === '/profil-sekolah') {
      setCurrentView('profil');
    } else if (path === '/sejarah' || path === '/sejarah-sekolah') {
      setCurrentView('sejarah');
    } else if (path === '/visimisi' || path === '/visi-dan-misi') {
      setCurrentView('visimisi');
    } else if (path === '/sambutan' || path === '/sambutan-kepala-sekolah') {
      setCurrentView('sambutan');
    } else if (path === '/struktur' || path === '/struktur-organisasi') {
      setCurrentView('struktur');
    } else if (path === '/kurikulum' || path === '/kurikulum-sekolah') {
      setCurrentView('kurikulum');
    } else if (path === '/program' || path === '/program-unggulan') {
      setCurrentView('program');
    } else if (path === '/guru' || path === '/data-guru') {
      setCurrentView('guru');
    } else if (path === '/siswa' || path === '/data-siswa') {
      setCurrentView('siswa');
    } else if (path === '/fasilitas' || path === '/fasilitas-sekolah') {
      setCurrentView('fasilitas');
    } else if (path === '/pengumuman') {
      setCurrentView('pengumuman');
    } else if (path === '/agenda') {
      setCurrentView('agenda');
    } else if (path === '/galeri-foto') {
      setCurrentView('galeri-foto');
    } else if (path === '/galeri-video') {
      setCurrentView('galeri-video');
    } else if (path === '/prestasi') {
      setCurrentView('prestasi');
    } else if (path === '/ekskul' || path === '/ekstrakurikuler') {
      setCurrentView('ekskul');
    } else if (path === '/ppdb') {
      setCurrentView('ppdb');
    } else if (path === '/kontak') {
      setCurrentView('kontak');
    } else if (path === '/search' || path === '/pencarian') {
      setCurrentView('pencarian');
    } else if (path === '/admin' || path === '/dashboard' || path === '/login') {
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
    }

    // Load categories
    api.getArticles({ limit: 10 }).then(() => {
      setCategories([
        { id: '1', name: 'Berita Sekolah', slug: 'berita-sekolah' },
        { id: '2', name: 'Prestasi Siswa', slug: 'prestasi-siswa' },
        { id: '3', name: 'Akademik & Kurikulum', slug: 'akademik-kurikulum' },
        { id: '4', name: 'Kegiatan OSIS & Ekskul', slug: 'kegiatan-osis-ekskul' },
        { id: '5', name: 'Opini & Karya Guru', slug: 'opini-karya-guru' },
        { id: '6', name: 'Pengumuman Resmi', slug: 'pengumuman-resmi' },
      ]);
    }).catch(() => {});
  }, [user]);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser URL
    let newPath = '/';
    if (view === 'home') newPath = '/';
    else if (view === 'berita-detail' && param) newPath = `/berita/${param}`;
    else if (view === 'berita') newPath = '/berita';
    else if (view === 'dashboard') newPath = '/dashboard';
    else if (view === 'login') newPath = '/login';
    else newPath = `/${view}`;

    window.history.pushState({}, '', newPath);
  };

  const handleOpenArticle = (slug: string) => {
    handleNavigate('berita-detail', slug);
  };

  // CMS Article save handler
  const handleSaveArticle = async (articleData: Partial<Article>, status: 'published' | 'draft') => {
    if (editingArticle) {
      await api.updateArticle(editingArticle.id, { ...articleData, status });
      alert('Artikel berhasil diperbarui!');
    } else {
      await api.createArticle({ ...articleData, status });
      alert('Artikel berhasil diterbitkan langsung dan sudah tampil di website!');
    }
    setEditingArticle(null);
    setDashboardTab('articles');
  };

  const handleDeleteArticle = async (id: string) => {
    await api.deleteArticle(id);
    alert('Artikel telah dihapus');
    setEditingArticle(null);
    setDashboardTab('articles');
  };

  // ==================== RENDER CMS DASHBOARD ====================
  if (currentView === 'dashboard') {
    if (!user) {
      return (
        <LoginPage
          onSuccess={() => setCurrentView('dashboard')}
          onBackToHome={() => handleNavigate('home')}
        />
      );
    }

    return (
      <DashboardLayout
        currentTab={dashboardTab}
        onSelectTab={(tab) => {
          if (tab === 'new-article') {
            setEditingArticle(null);
          }
          setDashboardTab(tab);
        }}
        onBackToWebsite={() => handleNavigate('home')}
      >
        {dashboardTab === 'overview' && (
          <DashboardOverview
            onNewArticle={() => {
              setEditingArticle(null);
              setDashboardTab('new-article');
            }}
            onEditArticle={(art) => {
              setEditingArticle(art);
              setDashboardTab('new-article');
            }}
            onNavigateTab={setDashboardTab}
          />
        )}

        {(dashboardTab === 'new-article' || dashboardTab === 'edit-article') && (
          <ArticleEditor
            initialArticle={editingArticle}
            categories={categories}
            onSave={handleSaveArticle}
            onDelete={editingArticle ? handleDeleteArticle : undefined}
            onCancel={() => setDashboardTab('articles')}
          />
        )}

        {dashboardTab === 'articles' && (
          <ArticleListPage
            onNewArticle={() => {
              setEditingArticle(null);
              setDashboardTab('new-article');
            }}
            onEditArticle={(art) => {
              setEditingArticle(art);
              setDashboardTab('new-article');
            }}
            onViewArticle={(slug) => handleNavigate('berita-detail', slug)}
          />
        )}

        {dashboardTab === 'users' && <UserManagementPage />}
        {dashboardTab === 'seo' && <SEOSettingsPage />}
        {dashboardTab === 'media' && <MediaLibraryPage />}
        {dashboardTab === 'settings' && <SchoolSettingsPage />}
        {dashboardTab === 'backup' && <SchoolSettingsPage />}
        {dashboardTab === 'ppdb' && <PPDBManagementPage />}
        {dashboardTab === 'announcements' && <AnnouncementsAndAgendaPage />}
        {dashboardTab === 'agenda' && <AnnouncementsAndAgendaPage />}
        {dashboardTab === 'pages' && (
          <StaticPagesManagement
            onViewPageOnSite={(slug) => handleNavigate(slug)}
          />
        )}
        {dashboardTab === 'profile' && <UserProfilePage />}
      </DashboardLayout>
    );
  }

  // ==================== RENDER LOGIN PAGE ====================
  if (currentView === 'login') {
    return (
      <LoginPage
        onSuccess={() => handleNavigate('dashboard')}
        onBackToHome={() => handleNavigate('home')}
      />
    );
  }

  // ==================== RENDER PUBLIC WEBSITE ====================
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => handleNavigate('pencarian')}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenArticle={handleOpenArticle}
          />
        )}

        {['profil', 'sejarah', 'visimisi', 'sambutan', 'struktur', 'kurikulum', 'program'].includes(currentView) && (
          <ProfileStaticPage
            slug={currentView}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'guru' && <TeachersPage />}
        {currentView === 'siswa' && <StudentsPage />}
        {currentView === 'fasilitas' && <FacilitiesPage />}

        {currentView === 'berita' && (
          <NewsListPage
            onOpenArticle={handleOpenArticle}
            initialCategory={viewParam || undefined}
          />
        )}

        {currentView === 'berita-detail' && viewParam && (
          <NewsDetailPage
            slug={viewParam}
            onBack={() => handleNavigate('berita')}
            onOpenArticle={handleOpenArticle}
          />
        )}

        {currentView === 'pengumuman' && <AnnouncementsPage />}
        {currentView === 'agenda' && <AgendaPage />}

        {currentView === 'galeri-foto' && <GalleryPage initialType="photo" />}
        {currentView === 'galeri-video' && <GalleryPage initialType="video" />}

        {currentView === 'prestasi' && <AchievementsPage />}
        {currentView === 'ekskul' && <ExtracurricularPage />}
        {currentView === 'ppdb' && <PPDBPage />}
        {currentView === 'kontak' && <ContactPage />}

        {currentView === 'pencarian' && (
          <SearchPage
            onOpenArticle={handleOpenArticle}
            onNavigate={handleNavigate}
            initialQuery={viewParam || ''}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
