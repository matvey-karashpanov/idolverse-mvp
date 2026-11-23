import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
      <AppRoutes />
    </BrowserRouter>
  );
}
