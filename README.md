# LifeHub

資産の記録、メモ、ファイルの保存を一か所で扱う個人向け Web アプリケーションです。Next.js のフロントエンドと Rails API を分離し、Docker Compose でローカル環境を起動できます。

## 主な機能

- **資産管理** — 資産項目の登録・編集・削除、日付ごとの残高記録、複数項目の一括記録
- **メモ** — 作成・編集・削除・検索、通常メモと締切付きメモの管理
- **ファイル管理** — ファイルのアップロード、一覧表示、削除
- **アカウント** — ユーザー登録、ログイン・ログアウト、プロフィールとパスワードの変更
- **データ管理** — 資産・メモ・ファイルの種別ごとの記録初期化

## 技術スタック

| 領域 | 技術 |
| --- | --- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Client state / Data fetching | Zustand, TanStack Query |
| Backend | Ruby on Rails 7.2 (API mode) |
| Authentication | Devise, devise-jwt |
| Database | PostgreSQL 16 |
| File storage | Active Storage (local / S3) |
| Development environment | Docker, Docker Compose |

## セットアップ

### Docker Compose

**必要なもの:** Docker Desktop または Docker Engine と Docker Compose

```bash
# リポジトリのルートで実行
docker compose up --build
```

起動後、[http://localhost:3000](http://localhost:3000) にアクセスしてください。

現在の起動構成では、初回セットアップ時に DB の作成・マイグレーション・シード投入を実行します。

開発用アカウント（シードデータ）:

```text
Email:    test@example.com
Password: password
```

> このアカウント情報はローカル開発用です。公開環境では使用しないでください。

停止する場合:

```bash
docker compose down
```

### Docker を使わずに起動する場合

必要なバージョン: Ruby 3.3.0、Node.js 20 以降、PostgreSQL 16。

バックエンド:

```bash
cd backend
bundle install
# 環境変数はローカル環境に合わせて設定してください
rails db:create db:migrate db:seed
rails server -p 3001
```

フロントエンド（別ターミナル）:

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは http://localhost:3000、API は http://localhost:3001 で起動します。DB 接続や API 接続先などの環境変数は、それぞれのローカル環境に合わせて設定してください。

## 構成

```text
.
├── docker-compose.yml
├── frontend/
│   ├── src/
│   │   ├── app/                 # auth, dashboard, money, memos, files
│   │   ├── components/          # layout, money, memos, files
│   │   ├── lib/api.ts           # API クライアント
│   │   ├── stores/              # Zustand ストア
│   │   └── types/               # TypeScript 型定義
│   └── package.json
└── backend/
    ├── app/
    │   ├── controllers/api/v1/  # 認証・資産・メモ・ファイル API
    │   └── models/              # User, AssetItem, AssetSnapshot, Memo, UserFile
    ├── config/
    │   ├── routes.rb
    │   └── initializers/        # Devise, CORS など
    └── db/migrate/
```

フロントエンドは表示と操作を担当し、Rails API がデータ操作と認証を受け持ちます。資産の時系列記録には `AssetSnapshot`、アップロードファイルの管理には Active Storage を使用します。

## API

API のベースパスは `/api/v1` です。

### 認証・ユーザー

| Method | Path | 内容 |
| --- | --- | --- |
| POST | `/auth` | ユーザー登録 |
| POST | `/auth/sign_in` | ログイン |
| DELETE | `/auth/sign_out` | ログアウト |
| GET | `/me` | ログインユーザー取得 |
| PATCH | `/me` | 表示名変更 |
| PATCH | `/me/password` | パスワード変更 |

ログイン時の JWT は `Authorization: Bearer <token>` 形式で扱います。トークンの保持期間や保存方法は認証設定・クライアント実装に依存します。

### 資産管理

| Method | Path | 内容 |
| --- | --- | --- |
| GET / POST | `/assets` | 資産項目の一覧・作成 |
| PUT / DELETE | `/assets/:id` | 資産項目の更新・削除 |
| GET | `/asset_snapshots` | 資産記録の一覧 |
| POST | `/asset_snapshots` | 資産記録の作成（同日分は上書き） |
| PUT / DELETE | `/asset_snapshots/:id` | 資産記録の更新・削除 |
| POST | `/asset_snapshots/bulk_create` | 複数資産の同日一括記録 |

### メモ

| Method | Path | 内容 |
| --- | --- | --- |
| GET / POST | `/memos` | 一覧・作成（`GET` は `?q=` で検索可能） |
| GET | `/memos/:id` | 詳細 |
| PUT / DELETE | `/memos/:id` | 更新・削除 |

`memo_type` は `normal`（通常）または `deadline`（締切付き）です。`deadline` の場合は `deadline_at` が必須です。既存の通常メモは `memo_type=normal`、`deadline_at=null` として扱います。

### ファイル・データ初期化

| Method | Path | 内容 |
| --- | --- | --- |
| GET / POST | `/files` | ファイル一覧・アップロード（`multipart/form-data`） |
| DELETE | `/files/:id` | ファイル削除 |
| DELETE | `/records/assets` | 資産項目・記録の初期化 |
| DELETE | `/records/memos` | メモの初期化 |
| DELETE | `/records/files` | ファイルの初期化 |

> 表中の各パスには `/api/v1` を付けてアクセスしてください。初期化 API はデータを削除するため、実行時には注意してください。

## 今後の改善候補

- カレンダー形式のスケジュール管理
- 予算設定とアラート
- メモの Markdown プレビュー
- ファイルのフォルダ管理
- PWA 対応
- CSV / PDF エクスポート

## 補足

この README はアプリケーションの概要とローカルでの起動方法をまとめたものです。実際の API 仕様や環境変数の詳細は `backend/config/routes.rb`、認証設定、各サービスの設定ファイルを参照してください。
