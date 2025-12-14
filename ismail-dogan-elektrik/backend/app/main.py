"""
İsmail Doğan Elektrik API
Production-Ready FastAPI Backend for Electrical Services Platform

Author: İsmail Doğan Elektrik
Version: 1.0.0
"""

import time
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from loguru import logger

from app.config import settings
from app.routers import bookings_router, services_router
from app.services import is_rust_engine_available, get_engine_info


# ============================================
# LOGGING CONFIGURATION
# ============================================

logger.add(
    "logs/api_{time}.log",
    rotation="1 day",
    retention="30 days",
    compression="gz",
    level="INFO",
)


# ============================================
# LIFESPAN CONTEXT MANAGER
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events handler.
    Handles startup and shutdown operations.
    """
    # Startup
    logger.info("=" * 60)
    logger.info("İsmail Doğan Elektrik API Starting...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug Mode: {settings.DEBUG}")
    logger.info(f"API Version: {settings.API_VERSION}")
    logger.info(f"Rust Engine Available: {is_rust_engine_available()}")
    logger.info("=" * 60)
    
    # Initialize database connections, caches, etc.
    # await init_database()
    # await init_redis()
    
    yield
    
    # Shutdown
    logger.info("Shutting down API...")
    # await close_database()
    # await close_redis()
    logger.info("API shutdown complete")


# ============================================
# APPLICATION FACTORY
# ============================================

def create_application() -> FastAPI:
    """
    Application factory function.
    Creates and configures the FastAPI application.
    """
    
    app = FastAPI(
        title="İsmail Doğan Elektrik API",
        description="""
        ## 🔌 Profesyonel Elektrik Hizmetleri API'si
        
        İstanbul'un güvenilir elektrik mühendisliği platformu için RESTful API.
        
        ### Özellikler
        
        * **Randevu Sistemi** - Online randevu oluşturma ve yönetim
        * **Fiyat Teklifi** - Anlık fiyat hesaplama
        * **Yük Hesaplama** - Elektriksel yük analizi (Rust destekli)
        * **Hizmet Kataloğu** - Tüm hizmetlerin detaylı listesi
        * **İletişim** - Müşteri iletişim formu
        
        ### Teknoloji
        
        - **Backend**: FastAPI (Python 3.11+)
        - **Hesaplama Motoru**: Rust (PyO3)
        - **Veritabanı**: PostgreSQL
        - **Cache**: Redis
        
        ### İletişim
        
        📞 **Acil Hat**: +90 532 123 45 67
        📧 **E-posta**: info@ismaildoganelektrik.com
        """,
        version=settings.API_VERSION,
        docs_url="/api/docs" if settings.DEBUG else None,
        redoc_url="/api/redoc" if settings.DEBUG else None,
        openapi_url="/api/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
        openapi_tags=[
            {
                "name": "Bookings",
                "description": "Randevu oluşturma ve yönetim işlemleri",
            },
            {
                "name": "Services",
                "description": "Hizmet listesi, fiyatlandırma ve hesaplamalar",
            },
        ],
    )
    
    # ============================================
    # MIDDLEWARE
    # ============================================
    
    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Process-Time"],
    )
    
    # Gzip Compression
    app.add_middleware(GZipMiddleware, minimum_size=500)
    
    # ============================================
    # CUSTOM MIDDLEWARE
    # ============================================
    
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        """Add processing time header and request logging"""
        start_time = time.time()
        
        # Log request
        logger.info(
            f"Request: {request.method} {request.url.path} "
            f"from {request.client.host if request.client else 'unknown'}"
        )
        
        response = await call_next(request)
        
        # Calculate process time
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}"
        
        # Log response
        logger.info(
            f"Response: {request.method} {request.url.path} "
            f"status={response.status_code} time={process_time:.4f}s"
        )
        
        return response
    
    # ============================================
    # EXCEPTION HANDLERS
    # ============================================
    
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        """Handle HTTP exceptions"""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.status_code,
                    "message": exc.detail,
                    "type": "http_error",
                },
            },
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handle validation errors"""
        errors = []
        for error in exc.errors():
            errors.append({
                "field": ".".join(str(loc) for loc in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            })
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "error": {
                    "code": 422,
                    "message": "Doğrulama hatası",
                    "type": "validation_error",
                    "details": errors,
                },
            },
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle all other exceptions"""
        logger.exception(f"Unhandled exception: {exc}")
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": 500,
                    "message": "Sunucu hatası oluştu",
                    "type": "internal_error",
                },
            },
        )
    
    # ============================================
    # ROUTES
    # ============================================
    
    # Health check endpoint
    @app.get(
        "/health",
        tags=["Health"],
        summary="Health check",
        description="Check if the API is running",
    )
    async def health_check() -> Dict[str, Any]:
        """Health check endpoint"""
        return {
            "status": "healthy",
            "version": settings.API_VERSION,
            "environment": settings.ENVIRONMENT,
            "rust_engine": is_rust_engine_available(),
        }
    
    # System info endpoint (debug only)
    @app.get(
        "/system",
        tags=["Health"],
        summary="System information",
        include_in_schema=settings.DEBUG,
    )
    async def system_info() -> Dict[str, Any]:
        """Get system information"""
        return {
            "api_version": settings.API_VERSION,
            "environment": settings.ENVIRONMENT,
            "debug": settings.DEBUG,
            "engine": get_engine_info(),
        }
    
    # Root endpoint
    @app.get(
        "/",
        tags=["Root"],
        summary="API root",
    )
    async def root() -> Dict[str, str]:
        """API root endpoint"""
        return {
            "message": "İsmail Doğan Elektrik API",
            "version": settings.API_VERSION,
            "docs": "/api/docs" if settings.DEBUG else "Contact administrator",
        }
    
    # Include routers with API prefix
    app.include_router(bookings_router, prefix="/api/v1")
    app.include_router(services_router, prefix="/api/v1")
    
    return app


# ============================================
# APPLICATION INSTANCE
# ============================================

app = create_application()


# ============================================
# DEVELOPMENT SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
        access_log=True,
    )
