import { Route, Routes as RouterRoutes } from 'react-router-dom';
import RoomListPage from './components/rooms/room-list-page';
import RoomDetailPage from './components/rooms/room-detail-page';
import ReportFormPage from './components/reports/report-form-page';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/rooms" element={<RoomListPage />} />
      <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
      <Route path="/rooms/:roomId/report" element={<ReportFormPage />} />
    </RouterRoutes>
  );
}