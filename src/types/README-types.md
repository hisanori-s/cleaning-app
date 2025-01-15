# 型定義ガイド

## 概要
このディレクトリには、アプリケーション全体で使用される型定義が含まれています。
型定義は、コードの安全性と可読性を向上させ、開発時のエラーを早期に発見するために使用されます。

## ディレクトリ構造
```
src/types/
├── README-types.md  # この文書
├── index.ts         # 型定義のエントリーポイント
└── room.ts          # 部屋関連の型定義
```

## 型定義一覧

### room.ts
部屋情報に関する型定義を提供します。

#### `RoomStatus`
部屋の状態を表す型
```typescript
type RoomStatus = 'urgent' | 'normal' | 'overdue';
```
- `urgent`: 緊急（清掃期限が迫っている）
- `normal`: 通常
- `overdue`: 期限超過

#### `Room`
部屋の基本情報を表す型
```typescript
interface Room {
  property_id: number;      // 物件ID
  property_name: string;    // 物件名
  room_number: string;      // 部屋番号
  vacancy_date: string;     // 空室予定日（ISO 8601形式）
  cleaning_deadline: string; // 清掃期限（ISO 8601形式）
  status: RoomStatus;       // 部屋の状態
}
```

#### `RoomListResponse`
部屋一覧のAPIレスポンス型
```typescript
interface RoomListResponse {
  mock_rooms_list: Room[];
}
```

## テスト用の型定義

テスト用の型定義は `src/__tests__/mocks/types.ts` に配置されています。
これらの型は、テストで使用するモックデータの型安全性を確保するために使用されます。

### モックデータの型
- `MockUser`: 認証用のモックユーザー情報
- `MockAuthResponse`: 認証用のモックレスポンス
- `MockRoomListResponse`: 部屋一覧のモックレスポンス
- `MockRoomDetail`: 部屋詳細のモック情報（`Room`を拡張）
- `MockRoomDetailResponse`: 部屋詳細のモックレスポンス
- `MockCleaningReport`: 清掃レポートのモック情報
- `MockReportResponse`: 清掃レポートのモックレスポンス

## 使用方法

1. 型のインポート
```typescript
import { Room, RoomStatus } from '@/types/room';
```

2. テスト用の型のインポート
```typescript
import { MockRoomListResponse } from '@/__tests__/mocks/types';
```

## 注意事項
1. 日付は必ずISO 8601形式で扱う
2. 新しい型を追加する場合は、このREADMEを更新する
3. テスト用の型は、本番コードでは使用しない
4. 型定義には必ずJSDocコメントを付ける 