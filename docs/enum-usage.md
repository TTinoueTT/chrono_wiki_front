# Enumを使用したメッセージ管理システム

## 概要

TypeScriptのEnumを使用して認証関連のメッセージを一元管理するシステムを実装しました。

## ファイル構成

```
src/
├── types/
│   └── messages.ts          # メッセージEnum定義
├── components/
│   └── MessageDisplay.tsx   # メッセージ表示コンポーネント
├── hooks/
│   └── useAuthRedirect.ts   # 認証リダイレクトHook
└── app/(user)/auth/
    ├── login/
    │   ├── actions.ts       # ログインアクション
    │   └── page.tsx         # ログインページ
    └── register/
        ├── actions.ts        # 登録アクション
        └── page.tsx         # 登録ページ
```

## 使用方法

### 1. Enumの定義

```typescript
// src/types/messages.ts
export enum AuthMessage {
  LOGIN_SUCCESS = "login-success",
  LOGIN_FAILED = "login-failed",
  SIGNUP_SUCCESS = "signup-success",
  SIGNUP_FAILED = "signup-failed",
  // ... その他のメッセージ
}
```

### 2. Server Actionでの使用

```typescript
// src/app/(user)/auth/login/actions.ts
import { AuthMessage } from "@/types/messages";

export const loginAction = async (state: FormState, formData: FormData) => {
  // ... 処理ロジック
  
  if (res.ok) {
    return { message: AuthMessage.LOGIN_SUCCESS };
  } else {
    return { success: false, message: AuthMessage.LOGIN_FAILED };
  }
};
```

### 3. クライアントコンポーネントでの使用

```typescript
// src/app/(user)/auth/login/page.tsx
import { AuthMessage } from "@/types/messages";

useEffect(() => {
  if (state.message === AuthMessage.LOGIN_SUCCESS) {
    // 成功時の処理
  }
}, [state.message]);
```

### 4. メッセージ表示コンポーネント

```typescript
// 任意のページで使用
import { MessageDisplay } from "@/components/MessageDisplay";

export default function SomePage() {
  return (
    <div>
      <MessageDisplay className="mb-4" />
      {/* 他のコンテンツ */}
    </div>
  );
}
```

## メリット

1. **型安全性**: TypeScriptのEnumにより、メッセージの値が型安全に管理されます
2. **一元管理**: すべてのメッセージが一箇所で定義され、変更が容易です
3. **自動補完**: IDEでメッセージの候補が自動補完されます
4. **一貫性**: 同じメッセージが複数箇所で異なる表記になることを防げます
5. **保守性**: メッセージの変更が必要な場合、Enumの定義を変更するだけで済みます

## ヘルパー関数

```typescript
// メッセージの種類を判定
isAuthMessage(message: string): boolean

// 成功メッセージかどうかを判定
isSuccessMessage(message: string): boolean

// エラーメッセージかどうかを判定
isErrorMessage(message: string): boolean
```

## 拡張方法

新しいメッセージを追加する場合：

1. `AuthMessage` Enumに新しい値を追加
2. `MessageDisplay` コンポーネントの `getMessageText` 関数にケースを追加
3. 必要に応じて `isSuccessMessage` や `isErrorMessage` の条件を調整

```typescript
// 例：新しいメッセージを追加
export enum AuthMessage {
  // ... 既存のメッセージ
  PASSWORD_CHANGE_SUCCESS = "password-change-success",
  PASSWORD_CHANGE_FAILED = "password-change-failed",
}
```

## 注意事項

- Enumの値は文字列リテラルとして定義し、URLパラメータとして使用できる形式にしています
- メッセージの変更時は、既存のコードとの互換性に注意してください
- 新しいメッセージを追加する際は、適切なカテゴリに分類してください 