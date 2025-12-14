# ============================================
# İsmail Doğan Elektrik - Backend Dockerfile
# Multi-stage build for Python FastAPI + Rust
# ============================================

# ============================================
# STAGE 1: Python Builder (Rust engine is optional)
# ============================================
# Note: The Rust engine is built separately and included as a wheel file
# If not available, the Python fallback will be used automatically

# ============================================
# STAGE 2: Python Builder
# ============================================
FROM python:3.11-slim-bookworm AS python-builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Create virtual environment and install dependencies
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ============================================
# STAGE 3: Production Runtime
# ============================================
FROM python:3.11-slim-bookworm AS runtime

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 --ingroup appgroup appuser

# Copy virtual environment from builder
COPY --from=python-builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy Rust library wheel if exists (optional - Python fallback available)
COPY wheels/*.whl /tmp/ 2>/dev/null || true
RUN pip install /tmp/*.whl 2>/dev/null && rm -f /tmp/*.whl || echo "Rust engine not found, using Python fallback"

# Copy application code
COPY app/ ./app/
COPY alembic/ ./alembic/ 2>/dev/null || true
COPY alembic.ini ./alembic.ini 2>/dev/null || true

# Create logs directory
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
