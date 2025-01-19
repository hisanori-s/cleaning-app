import { Route, Routes as RouterRoutes } from 'react-router-dom';
import DashboardPage from './pages/dashboard/page';
import RoomDetailPage from './pages/rooms/page';
import ReportFormPage from './pages/rooms/[id]/report/page';
import LoginPage from './pages/auth/page';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
      <Route path="/rooms/:roomId/report" element={<ReportFormPage />} />
    </RouterRoutes>
  );
}