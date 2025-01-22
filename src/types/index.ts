/**
 * 部屋の情報を表す型
 * 使用箇所:
 * - src/pages/dashboard/page.tsx (部屋一覧の表示)
 * - src/pages/rooms/[id]/page.tsx (部屋詳細の表示)
 * - src/components/dashboard/room-list-box/room-list-box.tsx (部屋リストの表示)
 * - src/components/room-detail/property-info-box/property-info-box.tsx (物件情報の表示)
 * - src/components/room-detail/room-info-box/room-info-box.tsx (部屋情報の表示)
 */

// 基本的な型定義のエクスポート
export * from './room-list';
export * from './room-detail';
export * from './user';
export * from './cleaning-report';
export * from './api';
