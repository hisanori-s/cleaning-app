# 型定義ガイド

## 概要
このディレクトリには、アプリケーション全体で使用される型定義が含まれています。
型定義は、コードの安全性と可読性を向上させ、開発時のエラーを早期に発見するために使用されます。

## ディレクトリ構造
```
src/types/
├── README-types.md     # この文書
├── index.ts           # 型定義のエントリーポイント
├── api.ts            # API共通の型定義
├── cleaning-report.ts # 清掃レポート関連の型定義
├── room.ts           # 部屋一覧関連の型定義
├── room-detail.ts    # 部屋詳細関連の型定義
└── user.ts           # ユーザー関連の型定義
```

## 型定義一覧

### api.ts
API通信に関する共通の型定義を提供します。

#### `ApiResponse<T>`
APIレスポンスの基本形
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

#### `PaginatedResponse<T>`
ページネーション付きレスポンスの型
```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### room.ts
部屋一覧情報に関する型定義を提供します。

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

### room-detail.ts
部屋詳細情報に関する型定義を提供します。

#### `RoomDetail`
部屋の詳細情報を表す型
```typescript
interface RoomDetail {
  id: number;
  property_id: number;
  property_name: string;
  property_address: string;
  room_number: string;
  vacancy_date: string;
  cleaning_deadline: string;
  room_key_number: string;
  entrance_key_number: string;
  notes: string;
  status: RoomDetailStatus;
}
```

### user.ts
ユーザー情報に関する型定義を提供します。

#### `User`
ユーザー情報を表す型
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  role: 'cleaner';
  assigned_rooms: number[];
}
```

### cleaning-report.ts
清掃レポートに関する型定義を提供します。

#### `CleaningReport`
清掃レポートの情報を表す型
```typescript
interface CleaningReport {
  id: number;
  roomId: number;
  cleanerId: number;
  date: string;
  checklist: {
    floor: boolean;
    bathroom: boolean;
    kitchen: boolean;
    windows: boolean;
    furniture: boolean;
  };
  comments: string;
  images: string[];
  status: 'submitted' | 'approved' | 'rejected';
}
```

## 使用方法

1. 型のインポート
```typescript
import { RoomDetail, User, CleaningReport } from '@/types';
```

2. API関連の型の使用
```typescript
import { ApiResponse, PaginatedResponse } from '@/types';
```

## 注意事項
1. 日付は必ずISO 8601形式で扱う
2. 新しい型を追加する場合は、このREADMEを更新する
3. テスト用の型は、本番コードでは使用しない
4. 型定義には必ずJSDocコメントを付ける 