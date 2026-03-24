//! IMPORTANT
USERDAN KAYIT ESNASINDA CİNSİYET BİLGİSİ AL KULLANICIDAN DOĞUM TARİHİ ALINACAK.

# TODO LIST

- Trendyol, Hepsiburada, Amazon ve ETSY Entegrasyonu
- Sanal POS entegrasyonu

[🇬🇧 English](#bun--express-rest-api) | [🇹🇷 Türkçe](#bun--express-rest-api-1)

# Bun + Express REST API

A layered architecture e-commerce REST API written in **TypeScript**, running on the **Bun** runtime, using **Express**, **Prisma ORM**, **PostgreSQL**, and **Keycloak**.

---

## 🚀 Tech Stack

| Technology                                         | Description                                          |
| -------------------------------------------------- | ---------------------------------------------------- |
| [Bun](https://bun.sh)                              | Fast JavaScript/TypeScript runtime & package manager |
| [Express v5](https://expressjs.com)                | HTTP server framework                                |
| [Prisma ORM](https://www.prisma.io)                | Type-safe database client for PostgreSQL             |
| [Keycloak](https://www.keycloak.org)               | Open source identity and access management           |
| [TypeScript](https://www.typescriptlang.org)       | Static type checking                                 |
| [Zod](https://zod.dev)                             | Type-first schema declaration and validation         |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Automatic API documentation (`/api-docs`)            |
| [Helmet](https://helmetjs.github.io)               | HTTP security headers                                |
| [CORS](https://github.com/expressjs/cors)          | Cross-Origin Resource Sharing support                |
| [Morgan](https://github.com/expressjs/morgan)      | HTTP request logging                                 |

---

## 📁 Project Structure

```
bun-backend/
├── src/
│   ├── server.ts                # Application entry point, Express setup
│   ├── config/
│   │   ├── index.ts             # Config barrel export
│   │   ├── morgan-logger.ts     # Morgan HTTP logger configuration
│   │   ├── nodemailler.ts       # Nodemailer email configuration
│   │   └── swagger.ts           # Swagger / OpenAPI 3.0 configuration
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── keycloak.service.ts
│   │   ├── user/                # User management module
│   │   │   ├── user.controller.ts
│   │   │   └── user.service.ts
│   │   ├── company/             # Company setup module
│   │   │   ├── company.controller.ts
│   │   │   └── company.service.ts
│   │   └── product/             # Product management module
│   │       ├── product.controller.ts
│   │       └── product.service.ts
│   ├── routes/
│   │   ├── index.ts             # Route barrel export
│   │   ├── auth.routes.ts       # /auth endpoint definitions
│   │   ├── user.routes.ts       # /users endpoint definitions
│   │   ├── company.routes.ts    # /company endpoint definitions
│   │   └── product.routes.ts    # /products endpoint definitions
│   ├── schemas/                 # Zod validation schemas
│   │   ├── index.ts
│   │   ├── user.validator.ts
│   │   └── product.validator.ts
│   ├── middlewares/
│   │   ├── index.ts             # Middleware barrel export
│   │   ├── async-handler.middleware.ts  # Async error wrapper
│   │   ├── error.middleware.ts          # Centralized error handling
│   │   ├── auth.middleware.ts           # Keycloak authentication guard
│   │   └── not-found.middleware.ts      # 404 handler
│   ├── utils/
│   │   ├── index.ts             # Utils barrel export
│   │   ├── auth.ts              # Authentication utilities
│   │   └── logger.ts            # Application logger
│   ├── types/
│   │   └── express.d.ts         # Express type augmentation
│   └── lib/
│       ├── index.ts             # Lib barrel export
│       └── prisma.ts            # Prisma Client singleton (pg adapter)
├── prisma/
│   ├── schema.prisma            # Main data model definitions (generated)
│   ├── models/                  # Separated prisma models (14 model files)
│   │   ├── user.prisma
│   │   ├── address.prisma
│   │   ├── company.prisma
│   │   ├── product.prisma
│   │   ├── product-variant.prisma
│   │   ├── product-image.prisma
│   │   ├── category.prisma
│   │   ├── brand.prisma
│   │   ├── cart.prisma
│   │   ├── order.prisma
│   │   ├── payment.prisma
│   │   ├── coupon.prisma
│   │   ├── review.prisma
│   │   └── wishlist.prisma
│   └── migrations/              # Database migration history
├── generated/
│   └── prisma/                  # Auto-generated Prisma client
├── scripts/
│   └── merge-prisma.ts          # Prisma schema merge script
├── public/                      # Static files
├── prisma.config.ts             # Prisma CLI configuration
├── tsconfig.json                # TypeScript configuration
├── package.json
└── .env                         # Environment variables (not committed to git)
```

---

## 🏗️ Architecture

The project follows a **module-based layered architecture**:

```
Request
    ↓
Router          → URL matching and method routing
    ↓
asyncHandler    → Catches errors in async functions
    ↓
Middleware      → Auth checks (Keycloak JWT), validations (Zod)
    ↓
Controller      → HTTP only: reads req, writes res
    ↓
Service         → Business logic, Keycloak integration, Prisma queries
    ↓
Prisma Client   → PostgreSQL database
    ↓
errorMiddleware → Centralized error handling (AppError / 500)
```

**Security Stack:**
- Helmet with custom CSP directives
- CORS support
- Rate limiting (100 requests / 15 min per IP)
- JWT-based authentication via Keycloak

---

## 🗃️ Database Schema

The Prisma schema is generated by combining separate model definition files (`prisma/models/*.prisma`). The project includes **14 models** covering a full e-commerce domain:

### User

| Field             | Type        | Description                       |
| ----------------- | ----------- | --------------------------------- |
| `id`              | `String`    | UUID primary key                  |
| `keycloakId`      | `String`    | Unique ID linked to Keycloak      |
| `email`           | `String`    | Unique email address              |
| `firstName`       | `String`    | User's first name                 |
| `lastName`        | `String`    | User's last name                  |
| `phone`           | `String?`   | User's phone number               |
| `isEmailVerified` | `Boolean`   | Email verification state          |
| `activationToken` | `String?`   | Unique token for email activation |
| `addresses`       | `Address[]` | User's addresses (relation)       |

### Address

| Field         | Type          | Description                                  |
| ------------- | ------------- | -------------------------------------------- |
| `id`          | `String`      | UUID primary key                             |
| `userId`      | `String`      | Relation to User                             |
| `title`       | `String`      | Address title (e.g. Home, Work)              |
| `fullName`    | `String`      | Full name for delivery                       |
| `phone`       | `String`      | Contact phone for address                    |
| `country`     | `String`      | Country                                      |
| `city`        | `String`      | City                                         |
| `district`    | `String`      | District/County                              |
| `postalCode`  | `String`      | Postal Code                                  |
| `addressLine` | `String`      | Detailed address line                        |
| `isBilling`   | `Boolean`     | Flag to determine if it is a billing address |
| `billingType` | `BillingType` | Corporate or Individual billing (`enum`)     |
| `companyName` | `String?`     | Company name (if CORPORATE)                  |
| `taxNumber`   | `String?`     | Tax identification number (if CORPORATE)     |
| `taxOffice`   | `String?`     | Tax office (if CORPORATE)                    |

### Company

| Field    | Type     | Description                                                                 |
| -------- | -------- | --------------------------------------------------------------------------- |
| `id`     | `String` | UUID primary key                                                            |
| `name`   | `String` | Company name                                                                |
| `title`  | `String` | Company title                                                               |
| ...      | ...      | Full company details: description, URLs, tax info, social media, address    |

### Product

| Field              | Type       | Description                        |
| ------------------ | ---------- | ---------------------------------- |
| `id`               | `String`   | UUID primary key                   |
| `name`             | `String`   | Product name (unique)              |
| `slug`             | `String`   | URL-friendly slug (unique)         |
| `sku`              | `String`   | Stock Keeping Unit (unique)        |
| `barcode`          | `String?`  | Barcode (unique)                   |
| `basePrice`        | `Decimal`  | Base price                         |
| `salePrice`        | `Decimal?` | Sale/discount price                |
| `currency`         | `String`   | Currency code (default: TRY)       |
| `taxRate`          | `Decimal`  | Tax rate percentage                |
| `stock`            | `Int`      | Stock quantity                     |
| `lowStockThreshold`| `Int`      | Low stock alert threshold          |
| `trackStock`       | `Boolean`  | Whether to track stock             |
| `weight/width/height/length` | `Float?` | Physical dimensions       |
| `isActive`         | `Boolean`  | Active status                      |
| `isFeatured`       | `Boolean`  | Featured product flag              |
| `metaTitle`        | `String?`  | SEO title                          |
| `metaDescription`  | `String?`  | SEO description                    |
| `categoryId`       | `String?`  | Relation to Category               |
| `brandId`          | `String?`  | Relation to Brand                  |

### Other Models

| Model            | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `ProductVariant` | Product options (color, size, etc.) with SKU, price, stock, JSON attributes |
| `ProductImage`   | Product gallery with URL, alt text, sort order, primary flag      |
| `Category`       | Hierarchical product categories (self-referencing parentId)       |
| `Brand`          | Product brands with name, slug, logo                              |
| `Cart`           | Shopping cart per user (1:1 relation)                             |
| `CartItem`       | Cart contents with product, variant, quantity                     |
| `Order`          | Customer orders with status, pricing, shipping/billing addresses  |
| `OrderItem`      | Order line items with snapshot of product data at time of order   |
| `Payment`        | Order payments (credit card, bank transfer, cash on delivery)     |
| `Coupon`         | Discount coupons (percentage or fixed amount)                     |
| `Review`         | Product reviews with rating, title, comment                       |
| `WishlistItem`   | User saved/favorited products                                    |

**Enums:** `BillingType`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `DiscountType`

---

## 🔌 API Endpoints

### Authentication (`/auth`)

| Method | URL                  | Protected | Description                                           |
| ------ | -------------------- | --------- | ----------------------------------------------------- |
| `POST` | `/auth/register`     | No        | Register user (creates Keycloak & Postgres instances) |
| `POST` | `/auth/login`        | No        | Login and receive JWT access/refresh tokens           |
| `POST` | `/auth/logout`       | No        | Logout user & invalidate token                        |
| `GET`  | `/auth/verify-email` | No        | Verify user email with token query                    |
| `POST` | `/auth/verify-email` | No        | Verify user email with token payload                  |
| `PUT`  | `/auth/update`       | Yes       | Update authenticated user profile                     |
| `PUT`  | `/auth/password`     | Yes       | Update authenticated user password                    |

### Users (`/users`)

| Method | URL          | Protected | Description                           |
| ------ | ------------ | --------- | ------------------------------------- |
| `GET`  | `/users`     | Yes       | List all users (pagination supported) |
| `GET`  | `/users/:id` | Yes       | Get a single user by ID               |
| `PUT`  | `/users/:id` | Yes       | Update user info by admin             |

### Company (`/company`)

| Method | URL              | Protected | Description                      |
| ------ | ---------------- | --------- | -------------------------------- |
| `GET`  | `/company`       | No        | Get company information          |
| `POST` | `/company/setup` | No        | Initial company setup (one-time) |

### Products (`/products`)

| Method   | URL                                        | Protected | Description                     |
| -------- | ------------------------------------------ | --------- | ------------------------------- |
| `GET`    | `/products`                                | Yes       | List all products (with filters & pagination) |
| `GET`    | `/products/:id`                            | Yes       | Get product by ID (with variants & images)    |
| `POST`   | `/products`                                | Yes       | Create a new product            |
| `PUT`    | `/products/:id`                            | Yes       | Update product by ID            |
| `DELETE` | `/products/:id`                            | Yes       | Delete product by ID            |

### Product Variants (`/products/:productId/variants`)

| Method   | URL                                             | Protected | Description              |
| -------- | ----------------------------------------------- | --------- | ------------------------ |
| `GET`    | `/products/:productId/variants`                 | Yes       | Get all variants         |
| `POST`   | `/products/:productId/variants`                 | Yes       | Create a variant         |
| `PUT`    | `/products/:productId/variants/:variantId`      | Yes       | Update a variant         |
| `DELETE` | `/products/:productId/variants/:variantId`      | Yes       | Delete a variant         |

### Product Images (`/products/:productId/images`)

| Method   | URL                                           | Protected | Description            |
| -------- | --------------------------------------------- | --------- | ---------------------- |
| `GET`    | `/products/:productId/images`                 | Yes       | Get all images         |
| `POST`   | `/products/:productId/images`                 | Yes       | Add an image           |
| `PUT`    | `/products/:productId/images/:imageId`        | Yes       | Update an image        |
| `DELETE` | `/products/:productId/images/:imageId`        | Yes       | Delete an image        |

### Pagination & Filtering

**GET /users** supports:

| Parameter | Default     | Description      |
| --------- | ----------- | ---------------- |
| `page`    | `1`         | Page number      |
| `limit`   | `10`        | Records per page |
| `sort`    | `createdAt` | Sort field       |

**GET /products** supports:

| Parameter    | Default     | Description              |
| ------------ | ----------- | ------------------------ |
| `page`       | `1`         | Page number              |
| `limit`      | `10`        | Records per page         |
| `sort`       | `createdAt` | Sort field               |
| `categoryId` | -           | Filter by category       |
| `brandId`    | -           | Filter by brand          |
| `isActive`   | -           | Filter by active status  |
| `isFeatured` | -           | Filter by featured       |
| `search`     | -           | Search by name or SKU    |

### Swagger UI

While the app is running, access the fully interactive API documentation at:

```
http://localhost:3000/api-docs
```

---

## ⚙️ Setup & Running

### Requirements

- [Bun](https://bun.sh) v1.3.1 or higher
- PostgreSQL database
- Keycloak server

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create a `.env` file from tracking parameters for Keycloak, DB, SMTP:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
APP_URL="http://localhost:3000"

KEYCLOAK_BASE="http://localhost:8080"
KEYCLOAK_REALM="my-realm"
KEYCLOAK_CLIENT_ID="my-client"
KEYCLOAK_CLIENT_SECRET="client-secret"

SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASS="password"
SMTP_MAIL_USERNAME="Example App <user@example.com>"
```

### 3. Generate Prisma Client

```bash
bun run prisma:generate
```

### 4. Apply Migrations

```bash
bunx --bun prisma migrate dev
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

---

---

# Bun + Express REST API

TypeScript ile yazilmis, **Bun** runtime uzerinde calisan, **Express**, **Prisma ORM**, **PostgreSQL** ve **Keycloak** kullanan e-ticaret REST API boilerplate'i.

---

## 🚀 Teknoloji Yigini

| Teknoloji                                          | Aciklama                                               |
| -------------------------------------------------- | ------------------------------------------------------ |
| [Bun](https://bun.sh)                              | Hizli JavaScript/TypeScript runtime & paket yoneticisi |
| [Express v5](https://expressjs.com)                | HTTP sunucu framework'u                                |
| [Prisma ORM](https://www.prisma.io)                | PostgreSQL icin tip-guvenli veritabani istemcisi       |
| [Keycloak](https://www.keycloak.org)               | Acik kaynak kimlik dogrulama yonetim sistemi           |
| [TypeScript](https://www.typescriptlang.org)       | Statik tip denetimi                                    |
| [Zod](https://zod.dev)                             | Nesne tabanli dinamik veri dogrulama                   |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Otomatik API dokumantasyonu (`/api-docs`)              |
| [Helmet](https://helmetjs.github.io)               | HTTP guvenlik basliklari                               |
| [CORS](https://github.com/expressjs/cors)          | Cross-Origin Resource Sharing destegi                  |
| [Morgan](https://github.com/expressjs/morgan)      | HTTP istek loglama                                     |

---

## 📁 Proje Yapisi

```
bun-backend/
├── src/
│   ├── server.ts                # Uygulama giris noktasi, Express kurulumu
│   ├── config/
│   │   ├── index.ts             # Config barrel export
│   │   ├── morgan-logger.ts     # Morgan HTTP logger yapilandirmasi
│   │   ├── nodemailler.ts       # Nodemailer e-posta yapilandirmasi
│   │   └── swagger.ts           # Swagger / OpenAPI 3.0 ayarlari
│   ├── modules/
│   │   ├── auth/                # Kimlik dogrulama modulu
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── keycloak.service.ts
│   │   ├── user/                # Kullanici yonetimi modulu
│   │   │   ├── user.controller.ts
│   │   │   └── user.service.ts
│   │   ├── company/             # Sirket bilgileri modulu
│   │   │   ├── company.controller.ts
│   │   │   └── company.service.ts
│   │   └── product/             # Urun yonetimi modulu
│   │       ├── product.controller.ts
│   │       └── product.service.ts
│   ├── routes/
│   │   ├── index.ts             # Route barrel export
│   │   ├── auth.routes.ts       # /auth endpoint tanimlari
│   │   ├── user.routes.ts       # /users endpoint tanimlari
│   │   ├── company.routes.ts    # /company endpoint tanimlari
│   │   └── product.routes.ts    # /products endpoint tanimlari
│   ├── schemas/                 # Zod validasyon semalari
│   │   ├── index.ts
│   │   ├── user.validator.ts
│   │   └── product.validator.ts
│   ├── middlewares/
│   │   ├── index.ts             # Middleware barrel export
│   │   ├── async-handler.middleware.ts  # Async hata sarmalayici
│   │   ├── error.middleware.ts          # Merkezi hata yonetimi
│   │   ├── auth.middleware.ts           # Keycloak dogrulama guard'i
│   │   └── not-found.middleware.ts      # 404 yakalayici
│   ├── utils/
│   │   ├── index.ts             # Utils barrel export
│   │   ├── auth.ts              # Kimlik dogrulama yardimcilari
│   │   └── logger.ts            # Uygulama logger'i
│   ├── types/
│   │   └── express.d.ts         # Express tip genisletmesi
│   └── lib/
│       ├── index.ts             # Lib barrel export
│       └── prisma.ts            # Prisma Client singleton
├── prisma/
│   ├── schema.prisma            # Birlestirilmis prisma modeli (otomatik olusturulan)
│   ├── models/                  # Modulerlestirilmis veritabani semalari (14 dosya)
│   │   ├── user.prisma          # Kullanici modeli
│   │   ├── address.prisma       # Adres modeli
│   │   ├── company.prisma       # Sirket modeli
│   │   ├── product.prisma       # Urun modeli
│   │   ├── product-variant.prisma # Urun varyant modeli
│   │   ├── product-image.prisma # Urun gorsel modeli
│   │   ├── category.prisma      # Kategori modeli
│   │   ├── brand.prisma         # Marka modeli
│   │   ├── cart.prisma          # Sepet modeli
│   │   ├── order.prisma         # Siparis modeli
│   │   ├── payment.prisma       # Odeme modeli
│   │   ├── coupon.prisma        # Kupon modeli
│   │   ├── review.prisma        # Degerlendirme modeli
│   │   └── wishlist.prisma      # Istek listesi modeli
│   └── migrations/              # Veritabani goc gecmisi
├── generated/
│   └── prisma/                  # Otomatik uretilmis prisma client
├── scripts/
│   └── merge-prisma.ts          # Prisma sema birlestirme (merge) scripti
├── public/                      # Statik dosyalar
├── prisma.config.ts             # Prisma CLI yapilandirmasi
├── tsconfig.json                # TypeScript yapilandirmasi
├── package.json
└── .env                         # Cevresel degiskenler (git'e eklenmez)
```

---

## 🗃️ Veritabani Semasi

Projedeki Prisma modelleri ayri dosyalarda barinmakta (`prisma/models/*`) ve betik ile tek bir dosyaya (schema.prisma) cevrilmektedir. Proje **14 model** icerir ve tam bir e-ticaret alanini kapsar.

### User Modeli

| Alan              | Tip         | Aciklama                                        |
| ----------------- | ----------- | ----------------------------------------------- |
| `id`              | `String`    | UUID Birincil anahtar                           |
| `keycloakId`      | `String`    | Keycloak id'si ile benzersiz eslestirme         |
| `email`           | `String`    | Benzersiz E-posta adresi                        |
| `firstName`       | `String`    | Kullanici adi                                   |
| `lastName`        | `String`    | Kullanici soyadi                                |
| `phone`           | `String?`   | Telefon numarasi                                |
| `isEmailVerified` | `Boolean`   | Hesabin dogrulanip dogrulanmadigi               |
| `activationToken` | `String?`   | Hesabi aktiflestirme sirasinda kullanilan token  |
| `addresses`       | `Address[]` | Kullanicinin adresleri (iliskisel tablo)        |

### Address Modeli

| Alan          | Tip           | Aciklama                                            |
| ------------- | ------------- | --------------------------------------------------- |
| `id`          | `String`      | UUID Birincil anahtar                               |
| `userId`      | `String`      | User modeline referans                              |
| `title`       | `String`      | Adres basligi (Orn: Ev, Is)                         |
| `fullName`    | `String`      | Teslim alacak kisinin tam adi                       |
| `phone`       | `String`      | Adres iletisim numarasi                             |
| `country`     | `String`      | Ulke                                                |
| `city`        | `String`      | Sehir                                               |
| `district`    | `String`      | Ilce                                                |
| `postalCode`  | `String`      | Posta kodu                                          |
| `addressLine` | `String`      | Tam acik adres                                      |
| `isBilling`   | `Boolean`     | Fatura adresi mi? (`true`/`false`)                  |
| `billingType` | `BillingType` | Kurumsal (`CORPORATE`) veya Bireysel (`INDIVIDUAL`) |
| `companyName` | `String?`     | Sirket adi (eger kurumsal ise)                      |
| `taxNumber`   | `String?`     | Vergi No (eger kurumsal ise)                        |
| `taxOffice`   | `String?`     | Vergi dairesi (eger kurumsal ise)                   |

### Company Modeli

| Alan    | Tip      | Aciklama                                                                |
| ------- | -------- | ----------------------------------------------------------------------- |
| `id`    | `String` | UUID Birincil anahtar                                                   |
| `name`  | `String` | Sirket adi                                                              |
| `title` | `String` | Sirket unvani                                                           |
| ...     | ...      | Tam sirket bilgileri: aciklama, URL'ler, vergi bilgisi, sosyal medya    |

### Product Modeli

| Alan               | Tip        | Aciklama                        |
| ------------------ | ---------- | ------------------------------- |
| `id`               | `String`   | UUID Birincil anahtar           |
| `name`             | `String`   | Urun adi (benzersiz)            |
| `slug`             | `String`   | URL-uyumlu slug (benzersiz)     |
| `sku`              | `String`   | Stok Birim Kodu (benzersiz)     |
| `barcode`          | `String?`  | Barkod (benzersiz)              |
| `basePrice`        | `Decimal`  | Taban fiyat                     |
| `salePrice`        | `Decimal?` | Indirimli fiyat                 |
| `currency`         | `String`   | Para birimi (varsayilan: TRY)   |
| `taxRate`          | `Decimal`  | Vergi orani yuzdesi             |
| `stock`            | `Int`      | Stok miktari                    |
| `lowStockThreshold`| `Int`      | Dusuk stok uyari esigi          |
| `trackStock`       | `Boolean`  | Stok takibi yapilsin mi         |
| `isActive`         | `Boolean`  | Aktiflik durumu                 |
| `isFeatured`       | `Boolean`  | One cikan urun flagi            |
| `metaTitle`        | `String?`  | SEO basligi                     |
| `metaDescription`  | `String?`  | SEO aciklamasi                  |
| `categoryId`       | `String?`  | Kategori iliskisi               |
| `brandId`          | `String?`  | Marka iliskisi                  |

### Diger Modeller

| Model            | Aciklama                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| `ProductVariant` | Urun secenekleri (renk, beden vb.) - SKU, fiyat, stok, JSON attributes |
| `ProductImage`   | Urun gorselleri - URL, alt text, siralama, birincil gorsel flagi       |
| `Category`       | Hiyerarsik urun kategorileri (kendine referansli parentId)             |
| `Brand`          | Urun markalari - ad, slug, logo                                        |
| `Cart`           | Kullanici basina alisveris sepeti (1:1 iliski)                         |
| `CartItem`       | Sepet icerigi - urun, varyant, adet                                    |
| `Order`          | Muesteri siparisleri - durum, fiyatlandirma, teslimat/fatura adresleri |
| `OrderItem`      | Siparis kalemleri - siparis anindaki urun verisinin kopyasi            |
| `Payment`        | Siparis odemeleri (kredi karti, banka transferi, kapida odeme)         |
| `Coupon`         | Indirim kuponlari (yuzdelik veya sabit tutar)                          |
| `Review`         | Urun degerlendirmeleri - puan, baslik, yorum                           |
| `WishlistItem`   | Kullanicinin favori urunleri                                           |

**Enum'lar:** `BillingType`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `DiscountType`

---

## 🔌 API Endpoint'leri

### Kimlik Dogrulama (`/auth`)

| Method | URL                  | Koruma | Aciklama                                                                  |
| ------ | -------------------- | ------ | ------------------------------------------------------------------------- |
| `POST` | `/auth/register`     | Yok    | Yeni kullanici olusturur (Keycloak'ta da olusturur ve onay maili atar)    |
| `POST` | `/auth/login`        | Yok    | Keycloak uzerinden login ile access ve refresh token dondurur             |
| `POST` | `/auth/logout`       | Yok    | Keycloak'taki oturumu/refresh token'i sonlandirir                         |
| `GET`  | `/auth/verify-email` | Yok    | Kullanicinin hesabini dogrulamasini saglar (link url uzerinden token ile) |
| `POST` | `/auth/verify-email` | Yok    | Kullanicinin hesabini dogrulamasini saglar (request body'den token ile)   |
| `PUT`  | `/auth/update`       | Var    | Login olan kullanicinin profil bilgilerini gunceller                      |
| `PUT`  | `/auth/password`     | Var    | Login olan kullanicinin parolasini Keycloak uzerinden gunceller           |

### Kullanicilar (`/users`)

| Method | URL          | Koruma | Aciklama                                        |
| ------ | ------------ | ------ | ----------------------------------------------- |
| `GET`  | `/users`     | Var    | Tum kullanicilari listeler (sayfalama destekli) |
| `GET`  | `/users/:id` | Var    | ID'ye gore tek kullanici getirir                |
| `PUT`  | `/users/:id` | Var    | Kullaniciyi admin/yetkili gunceller             |

### Sirket (`/company`)

| Method | URL              | Koruma | Aciklama                             |
| ------ | ---------------- | ------ | ------------------------------------ |
| `GET`  | `/company`       | Yok    | Sirket bilgilerini getirir           |
| `POST` | `/company/setup` | Yok    | Ilk sirket kurulumu (tek seferlik)   |

### Urunler (`/products`)

| Method   | URL               | Koruma | Aciklama                                       |
| -------- | ----------------- | ------ | ---------------------------------------------- |
| `GET`    | `/products`       | Var    | Tum urunleri listeler (filtreleme & sayfalama) |
| `GET`    | `/products/:id`   | Var    | ID'ye gore urun getirir (varyant & gorsel ile) |
| `POST`   | `/products`       | Var    | Yeni urun olusturur                            |
| `PUT`    | `/products/:id`   | Var    | Urunu gunceller                                |
| `DELETE` | `/products/:id`   | Var    | Urunu siler                                    |

### Urun Varyantlari (`/products/:productId/variants`)

| Method   | URL                                             | Koruma | Aciklama            |
| -------- | ----------------------------------------------- | ------ | ------------------- |
| `GET`    | `/products/:productId/variants`                 | Var    | Tum varyantlar      |
| `POST`   | `/products/:productId/variants`                 | Var    | Varyant olustur     |
| `PUT`    | `/products/:productId/variants/:variantId`      | Var    | Varyant guncelle    |
| `DELETE` | `/products/:productId/variants/:variantId`      | Var    | Varyant sil         |

### Urun Gorselleri (`/products/:productId/images`)

| Method   | URL                                           | Koruma | Aciklama          |
| -------- | --------------------------------------------- | ------ | ----------------- |
| `GET`    | `/products/:productId/images`                 | Var    | Tum gorseller     |
| `POST`   | `/products/:productId/images`                 | Var    | Gorsel ekle       |
| `PUT`    | `/products/:productId/images/:imageId`        | Var    | Gorsel guncelle   |
| `DELETE` | `/products/:productId/images/:imageId`        | Var    | Gorsel sil        |

### Sayfalama ve Filtreleme

**GET /products** desteklenen parametreler:

| Parametre    | Varsayilan  | Aciklama                 |
| ------------ | ----------- | ------------------------ |
| `page`       | `1`         | Sayfa numarasi           |
| `limit`      | `10`        | Sayfa basina kayit       |
| `sort`       | `createdAt` | Siralama alani           |
| `categoryId` | -           | Kategoriye gore filtrele |
| `brandId`    | -           | Markaya gore filtrele    |
| `isActive`   | -           | Aktiflik durumuna gore   |
| `isFeatured` | -           | One cikan urune gore     |
| `search`     | -           | Ad veya SKU ile arama    |

---

## ⚙️ Kurulum ve Calistirma

### Gereksinimler

- [Bun](https://bun.sh) v1.3.1 veya ustu
- PostgreSQL
- Keycloak Sunucusu

### Baslatma Adimlari

```bash
bun install

# Daha sonra .env dosyanizi uygun paramaterler (Yukariya/Ingilizce kisma bakiniz) ekleyerek doldurun.

bun run prisma:generate

bunx --bun prisma migrate dev

# Gelistirme ortaminda calismak icin
bun run dev
```

API belgeleri icin `http://localhost:3000/api-docs` sayfasina goz atabilirsiniz.
