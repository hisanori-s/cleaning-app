import { Route, Routes as RouterRoutes } from 'react-router-dom';
import DashboardPage from './pages/dashboard';
import RoomListPage from './pages/rooms';
import RoomDetailPage from './pages/rooms/[id]';
import ReportFormPage from './pages/rooms/[id]/report';
import ReportCompletePage from './pages/reports/complete';
import LoginPage from './pages/auth/login';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/rooms" element={<RoomListPage />} />
      <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
      <Route path="/rooms/:roomId/report" element={<ReportFormPage />} />
      <Route path="/report-complete" element={<ReportCompletePage />} />
    </RouterRoutes>
  );
}