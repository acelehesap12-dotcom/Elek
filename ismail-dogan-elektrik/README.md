# İsmail Doğan Elektrik

## 🔌 Profesyonel Elektrik Mühendisliği Platformu

İstanbul merkezli, 15+ yıllık deneyime sahip elektrik mühendisliği hizmetleri için production-ready dijital platform.

![Platform Preview](./docs/preview.png)

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Kurulum](#-kurulum)
- [Geliştirme](#-geliştirme)
- [Production Deployment](#-production-deployment)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Proje Yapısı](#-proje-yapısı)
- [Lisans](#-lisans)

---

## ✨ Özellikler

### 🎨 Frontend
- **Cyber-Industrial Luxury** tema tasarımı
- Canvas tabanlı animasyonlu elektrik devre arka planı
- Responsive ve mobil-first tasarım
- Framer Motion ile akıcı animasyonlar
- 4 adımlı randevu sihirbazı
- Türkçe dil desteği

### 🔧 Backend
- RESTful API (FastAPI)
- Pydantic v2 ile güçlü validasyon
- Async/await destekli yüksek performans
- Rate limiting ve güvenlik middleware'leri
- Celery ile arka plan görevleri

### ⚡ Rust Engine
- Yüksek performanslı elektriksel yük hesaplamaları
- PyO3 ile Python entegrasyonu
- Parallel processing (Rayon)
- Kablo kesiti ve sigorta önerileri

### 🔒 Güvenlik
- HTTPS/TLS 1.3 desteği
- CORS yapılandırması
- Rate limiting
- SQL injection koruması
- XSS koruması

---

## 🛠 Teknoloji Yığını

### Frontend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Next.js | 14.2 | React framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Framer Motion | 11.x | Animasyonlar |
| React Hook Form | 7.x | Form yönetimi |
| Zod | 3.x | Schema validation |
| Axios | 1.x | HTTP client |
| Lucide React | Latest | İkonlar |

### Backend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| FastAPI | 0.109 | Python web framework |
| Pydantic | 2.x | Data validation |
| SQLAlchemy | 2.x | ORM |
| asyncpg | 0.29 | PostgreSQL driver |
| Redis | 5.x | Caching |
| Celery | 5.x | Task queue |
| Loguru | 0.7 | Logging |

### Rust Engine
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Rust | 1.75+ | System programming |
| PyO3 | 0.20 | Python bindings |
| Rayon | 1.8 | Parallelization |
| Serde | 1.0 | Serialization |

### Infrastructure
| Teknoloji | Açıklama |
|-----------|----------|
| Docker & Docker Compose | Containerization |
| Nginx | Reverse proxy |
| PostgreSQL 16 | Primary database |
| Redis 7 | Caching & queues |

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 20+
- Python 3.11+
- Rust 1.75+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Hızlı Başlangıç (Docker)

```bash
# Repository'yi klonlayın
git clone https://github.com/ismaildoganelektrik/platform.git
cd platform

# Environment dosyasını oluşturun
cp .env.example .env

# Tüm servisleri başlatın
docker-compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Manuel Kurulum

#### Frontend

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

#### Backend

```bash
cd backend

# Virtual environment oluşturun
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
.\venv\Scripts\activate  # Windows

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Geliştirme sunucusunu başlatın
uvicorn app.main:app --reload
```

#### Rust Engine

```bash
cd rust-engine

# Kütüphaneyi derleyin
cargo build --release

# Python wheel oluşturun (opsiyonel)
pip install maturin
maturin build --release
```

---

## 💻 Geliştirme

### Frontend Geliştirme

```bash
cd frontend

# Geliştirme modu
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

### Backend Geliştirme

```bash
cd backend

# Geliştirme modu
uvicorn app.main:app --reload --port 8000

# Tests
pytest

# Type checking
mypy app/

# Formatting
black app/
isort app/
```

### Rust Engine Geliştirme

```bash
cd rust-engine

# Build
cargo build

# Tests
cargo test

# Benchmarks
cargo bench

# Release build
cargo build --release
```

---

## 🌐 Production Deployment

### Docker Compose ile Deployment

```bash
# Production build
docker-compose -f docker-compose.yml build

# Servisleri başlat
docker-compose -f docker-compose.yml up -d

# Logları takip et
docker-compose logs -f
```

### SSL Sertifikası (Let's Encrypt)

```bash
# Certbot ile sertifika al
certbot certonly --webroot -w /var/www/certbot \
  -d ismaildoganelektrik.com \
  -d www.ismaildoganelektrik.com

# Sertifikaları nginx/ssl/ klasörüne kopyala
cp /etc/letsencrypt/live/ismaildoganelektrik.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/ismaildoganelektrik.com/privkey.pem nginx/ssl/
```

### Environment Variables

Production için aşağıdaki environment değişkenlerini ayarlayın:

| Değişken | Açıklama |
|----------|----------|
| `SECRET_KEY` | JWT ve güvenlik için gizli anahtar |
| `DATABASE_URL` | PostgreSQL bağlantı URL'i |
| `REDIS_URL` | Redis bağlantı URL'i |
| `SENDGRID_API_KEY` | E-posta gönderimi için |
| `TWILIO_*` | SMS gönderimi için |

---

## 📚 API Dokümantasyonu

### Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/health` | Sistem sağlık kontrolü |
| GET | `/api/v1/services` | Hizmet listesi |
| GET | `/api/v1/services/{id}` | Hizmet detayı |
| POST | `/api/v1/bookings` | Randevu oluştur |
| GET | `/api/v1/bookings/{code}` | Randevu sorgula |
| DELETE | `/api/v1/bookings/{code}` | Randevu iptal |
| POST | `/api/v1/quotes` | Fiyat teklifi al |
| POST | `/api/v1/calculations/load` | Yük hesaplama |
| POST | `/api/v1/contact` | İletişim formu |
| GET | `/api/v1/testimonials` | Müşteri yorumları |

### Swagger UI

Development modunda API dokümantasyonuna erişin:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`
- OpenAPI JSON: `http://localhost:8000/api/openapi.json`

---

## 📁 Proje Yapısı

```
ismail-dogan-elektrik/
├── frontend/                   # Next.js frontend
│   ├── app/                    # App Router pages
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── home/               # Home page components
│   │   ├── layout/             # Layout components
│   │   └── booking/            # Booking wizard
│   ├── lib/                    # Utilities and API client
│   └── types/                  # TypeScript types
│
├── backend/                    # FastAPI backend
│   └── app/
│       ├── main.py             # Application entry
│       ├── config.py           # Configuration
│       ├── models/             # Pydantic models
│       ├── routers/            # API routes
│       └── services/           # Business logic
│
├── rust-engine/                # Rust calculation engine
│   └── src/
│       └── lib.rs              # Main library
│
├── nginx/                      # Nginx configuration
├── docker-compose.yml          # Container orchestration
└── README.md                   # This file
```

---

## 📞 İletişim

**İsmail Doğan Elektrik**

- 🌐 Website: [ismaildoganelektrik.com](https://ismaildoganelektrik.com)
- 📧 E-posta: info@ismaildoganelektrik.com
- 📞 Telefon: +90 532 123 45 67
- 📍 Adres: Kadıköy, İstanbul

### Sosyal Medya

- Instagram: [@ismaildoganelektrik](https://instagram.com/ismaildoganelektrik)
- LinkedIn: [İsmail Doğan](https://linkedin.com/in/ismaildogan)

---

## 📄 Lisans

Bu proje özel mülkiyettir. Tüm hakları saklıdır.

© 2024 İsmail Doğan Elektrik. All rights reserved.
