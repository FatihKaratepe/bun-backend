//! IMPORTANT
USER TYPE OLAYINI DİREKT OLARAK FATURA ADRESİNE TAŞIYACAĞIZ. ADRES YAPISINA FATURA ADRESİ EKLENECEK BUNA BAĞLI OLARAK DA FATURANIN CORPORATE VE BİREYSEL OLMA DURUMU BELİRLENECEK. 
USERDAN KAYIT ESNASINDA CİNSİYET BİLGİSİ AL KULLANICIDAN DOĞUM TARİHİ ALINACAK. 


# TODO LIST
- Trendyol, Hepsiburada, Amazon ve ETSY Entegrasyonu
- Sanal POS entegrasyonu 



[🇬🇧 English](#bun--express-rest-api) | [🇹🇷 Türkçe](#bun--express-rest-api-1)

# Bun + Express REST API

A layered architecture REST API boilerplate written in **TypeScript**, running on the **Bun** runtime, using **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Tech Stack

| Technology                                         | Description                                          |
| -------------------------------------------------- | ---------------------------------------------------- |
| [Bun](https://bun.sh)                              | Fast JavaScript/TypeScript runtime & package manager |
| [Express v5](https://expressjs.com)                | HTTP server framework                                |
| [Prisma ORM](https://www.prisma.io)                | Type-safe database client for PostgreSQL             |
| [TypeScript](https://www.typescriptlang.org)       | Static type checking                                 |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Automatic API documentation (`/api-docs`)            |
| [Helmet](https://helmetjs.github.io)               | HTTP security headers                                |
| [CORS](https://github.com/expressjs/cors)          | Cross-Origin Resource Sharing support                |
| [Morgan](https://github.com/expressjs/morgan)      | HTTP request logging                                 |

---

## 📁 Project Structure

```
bun-backend/
├── src/
│   ├── server.ts              # Application entry point, Express setup
│   ├── config/
│   │   ├── index.ts           # Config barrel export
│   │   └── swagger.ts         # Swagger / OpenAPI 3.0 configuration
│   ├── controllers/
│   │   ├── index.ts           # Controller barrel export
│   │   └── user.controller.ts # HTTP request/response handling
│   ├── services/
│   │   ├── index.ts           # Service barrel export
│   │   └── user.service.ts    # Business logic & Prisma queries
│   ├── routes/
│   │   ├── index.ts           # Route barrel export
│   │   └── user.routes.ts     # /users endpoint definitions
│   ├── middlewares/
│   │   ├── index.ts           # Middleware barrel export
│   │   ├── async-handler.middleware.ts  # Async error wrapper
│   │   ├── error.middleware.ts          # Centralized error handling
│   │   └── not-found.middleware.ts      # 404 handler
│   └── lib/
│       ├── index.ts           # Lib barrel export
│       └── prisma.ts          # Prisma Client singleton (pg adapter)
├── prisma/
│   ├── schema.prisma          # Data model definitions
│   └── migrations/            # Database migration history
├── generated/
│   └── prisma/                # Auto-generated Prisma client
├── scripts/
│   └── merge-prisma.js        # Prisma schema merge helper
├── script.ts                  # General purpose script
├── prisma.config.ts           # Prisma CLI configuration
├── tsconfig.json              # TypeScript configuration
├── package.json
└── .env                       # Environment variables (not committed to git)
```

---

## 🏗️ Architecture

The project follows a **layered architecture** pattern:

```
Request
    ↓
Router          → URL matching and method routing
    ↓
asyncHandler    → Catches errors in async functions
    ↓
Controller      → HTTP only: reads req, writes res
    ↓
Service         → Business logic, validation, Prisma queries
    ↓
Prisma Client   → PostgreSQL database
    ↓
errorMiddleware → Centralized error handling (AppError / 500)
```

---

## 🗃️ Database Schema

The Prisma schema (`prisma/schema.prisma`) currently contains two models:

### User

| Field   | Type      | Description                  |
| ------- | --------- | ---------------------------- |
| `id`    | `Int`     | Auto-incremented primary key |
| `email` | `String`  | Unique email address         |
| `name`  | `String?` | Optional user name           |
| `posts` | `Post[]`  | User's posts (relation)      |

### Post

| Field       | Type      | Description                           |
| ----------- | --------- | ------------------------------------- |
| `id`        | `Int`     | Auto-incremented primary key          |
| `title`     | `String`  | Post title                            |
| `content`   | `String?` | Optional content                      |
| `published` | `Boolean` | Publication status (default: `false`) |
| `author`    | `User`    | Author relation (`authorId` FK)       |

---

## 🔌 API Endpoints

All endpoints are defined under the `/users` prefix.

| Method | URL          | Description                           |
| ------ | ------------ | ------------------------------------- |
| `GET`  | `/users`     | List all users (pagination supported) |
| `GET`  | `/users/:id` | Get a single user by ID               |
| `POST` | `/users`     | Create a new user                     |
| `PUT`  | `/users/:id` | Update a user                         |

### Pagination (GET /users)

The `findAll` service supports query parameters:

| Parameter | Default     | Description      |
| --------- | ----------- | ---------------- |
| `page`    | `1`         | Page number      |
| `limit`   | `10`        | Records per page |
| `sort`    | `createdAt` | Sort field       |

### Swagger UI

While the app is running, access the API documentation at:

```
http://localhost:3000/api-docs
```

---

## ⚙️ Setup & Running

### Requirements

- [Bun](https://bun.sh) v1.3.1 or higher
- PostgreSQL database

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create a `.env` file and add your database connection URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
```

### 3. Generate Prisma Client

```bash
bun run prisma:generate
```

### 4. Apply Migrations

```bash
bunx prisma migrate dev
```

### 5. Start the App

**Development (hot-reload):**

```bash
bun run dev
```

**Production:**

```bash
bun run start
```

The server starts at `http://localhost:3000`.

---

## 🛡️ Middlewares

| Middleware           | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `helmet`             | Adds security-focused HTTP headers                         |
| `cors`               | Allows cross-origin requests                               |
| `morgan`             | Logs HTTP requests in `dev` format                         |
| `asyncHandler`       | Forwards async errors in controllers to `next(err)`        |
| `errorMiddleware`    | Returns `AppError` with its status code, all others as 500 |
| `notFoundMiddleware` | Returns 404 for undefined routes                           |

---

## 🗂️ TypeScript Path Aliases

Aliases defined in `tsconfig.json` avoid long relative import paths:

| Alias          | Maps To             |
| -------------- | ------------------- |
| `@controllers` | `./src/controllers` |
| `@routes`      | `./src/routes`      |
| `@services`    | `./src/services`    |
| `@lib`         | `./src/lib`         |
| `@middlewares` | `./src/middlewares` |
| `@config`      | `./src/config`      |

---

## 📝 Scripts

| Script                    | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| `bun run dev`             | Start in development mode (watches for file changes) |
| `bun run start`           | Start in production mode                             |
| `bun run prisma:generate` | Merge Prisma schemas and regenerate the client       |

---

---

# Bun + Express REST API

TypeScript ile yazılmış, **Bun** runtime üzerinde çalışan, **Express**, **Prisma ORM** ve **PostgreSQL** kullanan katmanlı mimari REST API boilerplate'i.

---

## 🚀 Teknoloji Yığını

| Teknoloji                                          | Açıklama                                               |
| -------------------------------------------------- | ------------------------------------------------------ |
| [Bun](https://bun.sh)                              | Hızlı JavaScript/TypeScript runtime & paket yöneticisi |
| [Express v5](https://expressjs.com)                | HTTP sunucu framework'ü                                |
| [Prisma ORM](https://www.prisma.io)                | PostgreSQL için tip-güvenli veritabanı istemcisi       |
| [TypeScript](https://www.typescriptlang.org)       | Statik tip denetimi                                    |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Otomatik API dokümantasyonu (`/api-docs`)              |
| [Helmet](https://helmetjs.github.io)               | HTTP güvenlik başlıkları                               |
| [CORS](https://github.com/expressjs/cors)          | Cross-Origin Resource Sharing desteği                  |
| [Morgan](https://github.com/expressjs/morgan)      | HTTP istek loglama                                     |

---

## 📁 Proje Yapısı

```
bun-backend/
├── src/
│   ├── server.ts              # Uygulama giriş noktası, Express kurulumu
│   ├── config/
│   │   ├── index.ts           # Config barrel export
│   │   └── swagger.ts         # Swagger / OpenAPI 3.0 ayarları
│   ├── controllers/
│   │   ├── index.ts           # Controller barrel export
│   │   └── user.controller.ts # HTTP istek/yanıt yönetimi
│   ├── services/
│   │   ├── index.ts           # Service barrel export
│   │   └── user.service.ts    # İş mantığı & Prisma sorguları
│   ├── routes/
│   │   ├── index.ts           # Route barrel export
│   │   └── user.routes.ts     # /users endpoint tanımları
│   ├── middlewares/
│   │   ├── index.ts           # Middleware barrel export
│   │   ├── async-handler.middleware.ts  # Async hata sarmalayıcı
│   │   ├── error.middleware.ts          # Merkezi hata yönetimi
│   │   └── not-found.middleware.ts      # 404 yakalayıcı
│   └── lib/
│       ├── index.ts           # Lib barrel export
│       └── prisma.ts          # Prisma Client singleton (pg adapter)
├── prisma/
│   ├── schema.prisma          # Veri modeli tanımları
│   └── migrations/            # Veritabanı migration geçmişi
├── generated/
│   └── prisma/                # Prisma tarafından otomatik üretilen client
├── scripts/
│   └── merge-prisma.js        # Prisma schema birleştirme yardımcısı
├── script.ts                  # Genel amaçlı komut dosyası
├── prisma.config.ts           # Prisma CLI yapılandırması
├── tsconfig.json              # TypeScript yapılandırması
├── package.json
└── .env                       # Ortam değişkenleri (git'e dahil edilmez)
```

---

## 🏗️ Mimari

Proje **katmanlı mimari (layered architecture)** prensibine göre tasarlanmıştır:

```
İstek (Request)
    ↓
Router        → URL eşleştirme ve method yönlendirme
    ↓
asyncHandler  → Async fonksiyonlardaki hataları yakalar
    ↓
Controller    → Sadece HTTP: req/res okuma ve yanıt yazma
    ↓
Service       → İş mantığı, doğrulama ve Prisma sorguları
    ↓
Prisma Client → PostgreSQL veritabanı
    ↓
errorMiddleware → Merkezi hata yönetimi (AppError / 500)
```

---

## 🗃️ Veritabanı Şeması

Prisma şeması (`prisma/schema.prisma`) şu an iki model içermektedir:

### User

| Alan    | Tip       | Açıklama                        |
| ------- | --------- | ------------------------------- |
| `id`    | `Int`     | Otomatik artan birincil anahtar |
| `email` | `String`  | Benzersiz e-posta adresi        |
| `name`  | `String?` | Opsiyonel kullanıcı adı         |
| `posts` | `Post[]`  | Kullanıcının yazıları (ilişki)  |

### Post

| Alan        | Tip       | Açıklama                           |
| ----------- | --------- | ---------------------------------- |
| `id`        | `Int`     | Otomatik artan birincil anahtar    |
| `title`     | `String`  | Yazı başlığı                       |
| `content`   | `String?` | Opsiyonel içerik                   |
| `published` | `Boolean` | Yayın durumu (varsayılan: `false`) |
| `author`    | `User`    | Yazar ilişkisi (`authorId` FK)     |

---

## 🔌 API Endpoint'leri

Tüm endpoint'ler `/users` prefix'i altında tanımlıdır.

| Method | URL          | Açıklama                                        |
| ------ | ------------ | ----------------------------------------------- |
| `GET`  | `/users`     | Tüm kullanıcıları listeler (sayfalama destekli) |
| `GET`  | `/users/:id` | ID'ye göre tek kullanıcı getirir                |
| `POST` | `/users`     | Yeni kullanıcı oluşturur                        |
| `PUT`  | `/users/:id` | Kullanıcıyı günceller                           |

### Sayfalama (GET /users)

`findAll` servisi query parametrelerini destekler:

| Parametre | Varsayılan  | Açıklama                  |
| --------- | ----------- | ------------------------- |
| `page`    | `1`         | Sayfa numarası            |
| `limit`   | `10`        | Sayfa başına kayıt sayısı |
| `sort`    | `createdAt` | Sıralama alanı            |

### Swagger UI

Uygulama çalışırken API dokümantasyonuna şu adresten erişilebilir:

```
http://localhost:3000/api-docs
```

---

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler

- [Bun](https://bun.sh) v1.3.1 veya üstü
- PostgreSQL veritabanı

### 1. Bağımlılıkları Yükle

```bash
bun install
```

### 2. Ortam Değişkenlerini Ayarla

`.env` dosyasını oluşturun ve veritabanı bağlantı URL'sini ekleyin:

```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/veritabani_adi"
```

### 3. Prisma Client'ı Oluştur

```bash
bun run prisma:generate
```

### 4. Migration Uygula

```bash
bunx prisma migrate dev
```

### 5. Uygulamayı Başlat

**Geliştirme (hot-reload):**

```bash
bun run dev
```

**Production:**

```bash
bun run start
```

Sunucu `http://localhost:3000` adresinde ayağa kalkar.

---

## 🛡️ Middleware'ler

| Middleware           | Açıklama                                                      |
| -------------------- | ------------------------------------------------------------- |
| `helmet`             | Güvenlik odaklı HTTP başlıkları ekler                         |
| `cors`               | Cross-Origin isteklerine izin verir                           |
| `morgan`             | `dev` formatında HTTP istek logları basar                     |
| `asyncHandler`       | Controller'lardaki async hataları `next(err)`'e iletir        |
| `errorMiddleware`    | `AppError` ile özel hataları, diğer hataları 500 olarak döner |
| `notFoundMiddleware` | Tanımlanmayan route'lar için 404 yanıt üretir                 |

---

## 🗂️ TypeScript Path Alias'ları

`tsconfig.json` içinde tanımlı kısayollar sayesinde uzun göreli import yollarından kaçınılır:

| Alias          | Karşılık            |
| -------------- | ------------------- |
| `@controllers` | `./src/controllers` |
| `@routes`      | `./src/routes`      |
| `@services`    | `./src/services`    |
| `@lib`         | `./src/lib`         |
| `@middlewares` | `./src/middlewares` |
| `@config`      | `./src/config`      |

---

## 📝 Komutlar

| Komut                     | Açıklama                                                   |
| ------------------------- | ---------------------------------------------------------- |
| `bun run dev`             | Geliştirme modunda başlatır (dosya değişikliklerini izler) |
| `bun run start`           | Production modunda başlatır                                |
| `bun run prisma:generate` | Prisma şemalarını birleştirir ve Client'ı yeniden üretir   |
