# Auction Platform

Rails API、Next.js、Nuxt を組み合わせた、C2C オークション型マーケットプレイスです。ユーザー向けサイトと管理画面を別アプリケーションとして構成し、API、ローカル開発環境、本番デプロイ設定を同一リポジトリで管理しています。

## 主な機能

### ユーザー向けサイト

- 商品一覧・詳細、検索、終了間近の商品、1円スタートの商品、最近の落札商品の表示
- 商品の出品と画像アップロード
- オークションへの入札、即決購入、価格交渉
- お気に入り登録
- 取引メッセージ
- プロフィール、住所、ウォレットの管理

### 管理画面

- 管理者ログイン
- ダッシュボード
- ユーザー・商品・カテゴリの管理
- 管理者権限の管理

## 技術構成

| 領域 | 技術 |
| --- | --- |
| API | Ruby 3.2.4、Rails 7.1、PostgreSQL |
| 認証・ファイル管理 | devise_token_auth、Active Storage、HttpOnly Cookie |
| ユーザー向け Web | Next.js 15、React 19、TypeScript、Tailwind CSS、Zustand |
| 管理画面 | Nuxt 4、Vue 3、Pinia、Vuetify |
| 開発・デプロイ | Docker、Docker Compose、Caddy、AWS EC2 |
| オブジェクトストレージ | S3（必要に応じて利用） |

## リポジトリ構成

```text
.
├── backend/                  # Rails API
├── frontend/                 # ユーザー向け Next.js アプリ
├── admin/                    # Nuxt 管理画面
├── deploy/Caddyfile          # 本番用 reverse proxy 設定
├── docker-compose.local.yml  # ローカル開発環境
├── docker-compose.yml        # EC2 本番環境
├── scripts/                  # 起動・停止・デプロイスクリプト
└── .md/                      # 環境構築・デプロイ・構成分析の資料
```

## 起動方法（ローカル）

Docker がインストールされている環境で、リポジトリのルートから実行します。

```bash
./scripts/local-up.sh
```

起動後の URL：

| サービス | URL |
| --- | --- |
| ユーザー向けサイト | http://localhost:3001 |
| 管理画面 | http://localhost:3003 |
| API ヘルスチェック | http://localhost:3000/health |

停止する場合：

```bash
./scripts/local-down.sh
```

環境変数やローカル構成の詳細は [`.md/ENVIRONMENT_GUIDE.md`](.md/ENVIRONMENT_GUIDE.md) を参照してください。環境によって追加の設定が必要な場合は、同ファイルと `.env.local.example` を確認してください。

## API の名前空間

| パス | 用途 |
| --- | --- |
| `/auth` | 共通認証 |
| `/auction/v1` | ユーザー向け API |
| `/admin/v1` | 管理画面向け API |
| `/web/v1` | 将来のメインサイト向け API |
| `/health` | ヘルスチェック |

ユーザー向け機能と管理機能を同じ Rails アプリケーションで提供しつつ、API の名前空間を分けて責務を整理しています。

## 設計上のポイント

### 認証と認可

- ユーザー向けサイトでは Next.js の API Routes を Rails API への proxy として使用し、認証 token を HttpOnly Cookie で扱います。
- 管理画面向け API は `Admin::V1::BaseController` を経由し、管理者のロール（`admin` / `super_admin`）やリソース単位の権限を確認します。
- 商品の更新・削除では、リクエストしたユーザーが出品者本人であることを確認します。

### データ整合性と API の制約

- お気に入りの重複登録は、アプリケーション側の制御に加えて DB の unique index でも防止します。
- wallet API は、任意の金額を直接加算できないようにし、売上をポイントへ反映する用途に制限しています。
- Rails コンテナ起動時の自動 migration は行わず、デプロイ時に明示的に実行する構成です。

### ローカル環境と本番環境

- ローカルでは hot reload を利用し、開発用 Compose から各サービスへアクセスできるようにしています。
- 本番では build 済み image を利用し、Caddy で HTTPS 終端と各アプリケーションへの reverse proxy を行います。
- DB migration をアプリケーション起動処理から分離し、デプロイ手順の中で実行します。

## EC2 へのデプロイ

本番環境では、Caddy がドメインごとにフロントエンド、管理画面、API へリクエストを振り分けます。

| ドメイン例 | 転送先 |
| --- | --- |
| `auction.example.com` | frontend |
| `admin.example.com` | admin |
| `api.example.com` | backend |

### 1. 環境変数の設定

```bash
cp .env.example .env
```

`.env` の値をデプロイ環境に合わせて設定します。少なくとも以下の項目を確認してください。

```dotenv
FRONTEND_DOMAIN=auction.example.com
ADMIN_DOMAIN=admin.example.com
API_DOMAIN=api.example.com
CADDY_EMAIL=your-email@example.com

RAILS_MASTER_KEY=your-rails-master-key
SECRET_KEY_BASE=your-secret-key-base
DATABASE_PASSWORD=your-strong-database-password

APP_HOST=api.example.com
RAILS_HOSTS=api.example.com
RAILS_INTERNAL_HOSTS=backend
FRONTEND_ORIGINS=https://auction.example.com,https://admin.example.com

NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_API_HOST=api.example.com
NUXT_PUBLIC_API_BASE=https://api.example.com
```

上記ドメインは設定例です。実際のドメイン、シークレット、環境変数の書式は `.env.example` とデプロイ資料に合わせてください。`.env` などの秘密情報を含むファイルはリポジトリへコミットしないでください。

### 2. デプロイ

```bash
./scripts/deploy-ec2.sh
```

詳しい手順や前提条件は [`.md/DEPLOYMENT.md`](.md/DEPLOYMENT.md) を参照してください。

本番ログの確認例：

```bash
docker compose --env-file .env -f docker-compose.yml logs -f backend
```

Rails console の起動例：

```bash
docker compose --env-file .env -f docker-compose.yml exec backend bundle exec rails console
```

## 関連ドキュメント

- [環境構築ガイド](.md/ENVIRONMENT_GUIDE.md)
- [デプロイ手順](.md/DEPLOYMENT.md)
- [構成分析・改善方針](.md/PROJECT_ANALYSIS.md)

## 今後の改善項目
現時点で対応を進めたい項目
- 管理画面も server route 経由の BFF 構成に整理する
- OpenAPI schema から frontend / admin の TypeScript 型を生成する
- 購入、入札、オファー承認時の競合制御を強化する
- Rails request spec と frontend / admin の E2E テストを追加する
- EC2 単体構成から ECS、RDS、S3、CloudFront を組み合わせた構成を検討する
