import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginPage } from './components/auth/login-page';
import { RoomListPage } from './components/rooms/room-list-page';
import { RoomDetailPage } from './components/rooms/room-detail-page';
import { ReportFormPage } from './components/reports/report-form-page';
import { ReportCompletePage } from './components/reports/report-complete-page';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/rooms" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/rooms',
    element: <RoomListPage />,
  },
  {
    path: '/rooms/:roomId',
    element: <RoomDetailPage />,
  },
  {
    path: '/rooms/:roomId/report',
    element: <ReportFormPage />,
  },
  {
    path: '/report-complete',
    element: <ReportCompletePage />,
  },
  {
    path: '*',
    element: <Navigate to="/rooms" replace />,
  },
]);

export function Routes() {
  return <RouterProvider router={routes} />;
}