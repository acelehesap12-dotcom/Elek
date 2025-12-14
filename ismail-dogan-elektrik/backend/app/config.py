"""
Configuration module for İsmail Doğan Elektrik API
Environment-based settings with Pydantic validation
"""

from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    """Application Settings - loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "İsmail Doğan Elektrik API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Profesyonel Elektrik Mühendisliği Hizmetleri API"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    RELOAD: bool = False

    # Security
    SECRET_KEY: str = "change-this-in-production-to-a-secure-random-string"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ismaildoganelektrik.com",
        "https://www.ismaildoganelektrik.com",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/elektrik_db"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 3600  # 1 hour

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@ismaildogan.com"
    SMTP_FROM_NAME: str = "İsmail Doğan Elektrik"

    # SMS (Twilio)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "webp", "pdf"]
    UPLOAD_DIR: str = "./uploads"

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds

    # Rust Engine
    RUST_ENGINE_ENABLED: bool = True
    RUST_LIB_PATH: str = "./rust-engine/target/release/libelektrik_engine.so"

    # Pricing
    BASE_LABOR_RATE: float = 500.0  # TRY per hour
    EMERGENCY_MULTIPLIER: float = 2.0
    URGENT_MULTIPLIER: float = 1.5
    ELECTRICITY_PRICE_PER_KWH: float = 2.5  # TRY

    # Service Area
    SERVICE_CITY: str = "İstanbul"
    SERVICE_DISTRICTS: List[str] = [
        "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar",
        "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş",
        "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca",
        "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih",
        "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal",
        "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
        "Şile", "Silivri", "Şişli", "Sultanbeyli", "Sultangazi",
        "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("ALLOWED_EXTENSIONS", mode="before")
    @classmethod
    def parse_extensions(cls, v):
        if isinstance(v, str):
            return [ext.strip() for ext in v.split(",")]
        return v


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Export settings instance
settings = get_settings()
