"""
İsmail Doğan Elektrik API - Database Connection
Async database connection using SQLAlchemy 2.0
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
from loguru import logger

from app.config import settings


# ============================================
# DATABASE ENGINE
# ============================================

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    poolclass=NullPool if settings.ENVIRONMENT == "test" else None,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

# Session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# ============================================
# BASE MODEL
# ============================================

class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


# ============================================
# DEPENDENCY
# ============================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting database session.
    Use in FastAPI endpoints with Depends(get_db)
    """
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            await session.close()


# ============================================
# INITIALIZATION
# ============================================

async def init_database():
    """Initialize database - create tables if they don't exist"""
    try:
        async with engine.begin() as conn:
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise


async def close_database():
    """Close database connection pool"""
    await engine.dispose()
    logger.info("Database connection closed")


# ============================================
# HEALTH CHECK
# ============================================

async def check_database_health() -> bool:
    """Check if database is reachable"""
    try:
        async with async_session_maker() as session:
            await session.execute("SELECT 1")
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False
