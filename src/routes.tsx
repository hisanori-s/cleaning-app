import { Route, Routes as RouterRoutes } from 'react-router-dom';
import DashboardPage from './pages/dashboard/page';
import RoomDetailPage from './pages/rooms/page';
import LoginPage from './pages/auth/page';
import { ReportPage } from './pages/report/page';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/rooms" element={<RoomDetailPage />} />
      <Route path="/report" element={<ReportPage />} />
    </RouterRoutes>
  );
}