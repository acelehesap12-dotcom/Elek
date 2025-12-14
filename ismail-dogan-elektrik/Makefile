# İsmail Doğan Elektrik - Makefile
# Common development and deployment commands

.PHONY: help dev build start stop logs test clean

# Default target
help:
	@echo "İsmail Doğan Elektrik - Available Commands"
	@echo "==========================================="
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start all services in development mode"
	@echo "  make dev-frontend - Start only frontend dev server"
	@echo "  make dev-backend  - Start only backend dev server"
	@echo ""
	@echo "Docker:"
	@echo "  make build        - Build all Docker images"
	@echo "  make start        - Start all services"
	@echo "  make stop         - Stop all services"
	@echo "  make logs         - View service logs"
	@echo "  make restart      - Restart all services"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run all tests"
	@echo "  make test-frontend - Run frontend tests"
	@echo "  make test-backend  - Run backend tests"
	@echo "  make test-rust     - Run Rust tests"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make setup        - Initial project setup"

# Development
dev:
	docker-compose up

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-rust:
	cd rust-engine && cargo watch -x test

# Docker commands
build:
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

# Testing
test: test-frontend test-backend test-rust

test-frontend:
	cd frontend && npm run lint && npm run type-check

test-backend:
	cd backend && pytest

test-rust:
	cd rust-engine && cargo test

# Utilities
clean:
	rm -rf frontend/.next
	rm -rf frontend/node_modules
	rm -rf backend/__pycache__
	rm -rf backend/.pytest_cache
	rm -rf rust-engine/target
	docker-compose down -v --rmi local

setup:
	@echo "Setting up development environment..."
	cp .env.example .env
	cd frontend && npm install
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd rust-engine && cargo build
	@echo "Setup complete!"

# Database
db-migrate:
	cd backend && alembic upgrade head

db-reset:
	docker-compose down -v
	docker-compose up -d db
	sleep 5
	cd backend && alembic upgrade head

# Rust
rust-build:
	cd rust-engine && cargo build --release

rust-bench:
	cd rust-engine && cargo bench
