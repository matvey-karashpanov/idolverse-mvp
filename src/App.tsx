import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './app/hooks';
import { Layout } from './components/Layout';
import { loadIdols } from './features/idols/idolsSlice';
import { getCatalog } from './domain/catalogStorage';
import { AdminPage } from './pages/AdminPage';
import { CorrectionsPage } from './pages/CorrectionsPage';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { GroupsPage } from './pages/GroupsPage';
import { HomePage } from './pages/HomePage';
import { IdolDetailPage } from './pages/IdolDetailPage';
import { IdolsPage } from './pages/IdolsPage';
import { NewsPage } from './pages/NewsPage';


function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Let React Router, rather than the browser, decide where a new page starts.
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      // Hash navigation is intentional (for example, opening a specific news item).
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      });
      return () => window.cancelAnimationFrame(frame);
    }

    // Use an instant reset: the global CSS smooth scrolling must not animate
    // from the previous page's position and leave the new page halfway down.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, hash]);

  return null;
}

function AppRoutes() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.idols.status);

  useEffect(() => {
    // Prepare the normalized catalog once; legacy screens remain compatible during this migration stage.
    getCatalog();
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadIdols());
    }
  }, [dispatch, status]);

  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/idols" element={<IdolsPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route path="/idols/:id" element={<IdolDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/corrections" element={<CorrectionsPage />} />
        <Route
          path="*"
          element={
            <div className="page state-panel">
              <h1>Страница не найдена</h1>
              <p>Такой страницы пока нет в IDOLVERSE.</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
