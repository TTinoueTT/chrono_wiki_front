chrono_wiki_front は chrono_wiki プロジェクトのフロントエンド用プロジェクトです。
歴史上の人物と、出来事を紐付けて年表形式でプレビューする機能を持ちます。

```
/app
  /page.tsx                ← トップページ（年表プレビュー）
  /timeline/page.tsx       ← 年表ページ（トップと統合可）
  /persons/page.tsx        ← 人物一覧
  /persons/[personId]/page.tsx      ← 人物詳細
  /persons/new/page.tsx    ← 人物新規登録
  /persons/[personId]/edit/page.tsx ← 人物編集
  /events/page.tsx         ← 出来事一覧
  /events/[eventId]/page.tsx        ← 出来事詳細
  /events/new/page.tsx     ← 出来事新規登録
  /events/[eventId]/edit/page.tsx   ← 出来事編集
```


ユーザーログイン機能を作る場合、以下のページルーティングが必要になります：

## 1. 認証関連ページ

### ログイン・ログアウト
- `/auth/login` - ログインページ
- `/auth/logout` - ログアウト処理（リダイレクト）

### ユーザー登録
- `/auth/register` - ユーザー新規登録ページ
- `/auth/verify` - メール認証ページ（必要に応じて）

### パスワード管理
- `/auth/forgot-password` - パスワードリセット申請
- `/auth/reset-password` - パスワードリセット実行

## 2. ユーザー管理ページ

### プロフィール
- `/profile` - ユーザープロフィール表示・編集
- `/profile/edit` - プロフィール編集

### アカウント設定
- `/settings` - アカウント設定
- `/settings/password` - パスワード変更

## 3. 保護されたページ

### 管理者機能（必要に応じて）
- `/admin` - 管理者ダッシュボード
- `/admin/users` - ユーザー管理
- `/admin/persons` - 人物データ管理
- `/admin/events` - 出来事データ管理

## 4. Next.js App Router構成例

```plaintext
/app
  /auth
    /login/page.tsx
    /register/page.tsx
    /logout/page.tsx
    /forgot-password/page.tsx
    /reset-password/page.tsx
  /profile
    /page.tsx
    /edit/page.tsx
  /settings
    /page.tsx
    /password/page.tsx
  /admin
    /page.tsx
    /users/page.tsx
    /persons/page.tsx
    /events/page.tsx
```

## 5. 認証状態管理

### ミドルウェア
- `middleware.ts` - 認証チェック・リダイレクト処理

### コンテキスト・フック
- `contexts/AuthContext.tsx` - 認証状態管理
- `hooks/useAuth.ts` - 認証フック

## 6. 実装のポイント

### 認証フロー
1. **ログイン** → JWT/セッション管理
2. **保護ページ** → ミドルウェアで認証チェック
3. **ログアウト** → セッション削除・リダイレクト

### セキュリティ
- CSRF対策
- パスワードハッシュ化
- レート制限
- HTTPS必須

### UX考慮
- ログイン後のリダイレクト先
- エラーハンドリング
- ローディング状態
- レスポンシブ対応

**どの認証方式（JWT、セッション、OAuth等）を想定しているか教えてもらえれば、より具体的な実装例を提案できる！**
