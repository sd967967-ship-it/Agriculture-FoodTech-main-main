import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const DiagnosePage = lazy(() => import('./pages/DiagnosePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const PestLogPage = lazy(() => import('./pages/PestLogPage'));
const HotspotsPage = lazy(() => import('./pages/HotspotsPage'));
const OfficialDashboard = lazy(() => import('./pages/OfficialDashboard'));

export default function App() {
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get('mode');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateScreenMode = () => setIsSmallScreen(mediaQuery.matches);
    updateScreenMode();
    mediaQuery.addEventListener('change', updateScreenMode);
    return () => mediaQuery.removeEventListener('change', updateScreenMode);
  }, []);

  const isMobileMode = mode === 'mobile' || (!mode && isSmallScreen);
  const isDesktopMode = mode === 'desktop' || (!mode && !isSmallScreen);

  return (
    <ErrorBoundary>
      <div className={`app-shell site-shell flex min-h-screen flex-col soft-grid${isMobileMode ? ' mobile-mode' : ''}${isDesktopMode ? ' desktop-mode' : ''}`}>
        <div className="ambient-glow ambient-glow-one" />
        <div className="ambient-glow ambient-glow-two" />
        <Navbar />
        <main className="page-enter relative z-10 flex-1">
          <Suspense fallback={<div className="mx-auto flex min-h-[18rem] max-w-4xl items-center justify-center px-4 text-sm text-emerald-200" role="status">Loading FasalSathi...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/diagnose" element={<DiagnosePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/pest-log" element={<PestLogPage />} />
              <Route path="/pest-observations" element={<PestLogPage />} />
              <Route path="/hotspots" element={<HotspotsPage />} />
              <Route path="/admin/dashboard" element={<OfficialDashboard />} />
              <Route path="/admin" element={<OfficialDashboard />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
