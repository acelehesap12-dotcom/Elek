"""
İsmail Doğan Elektrik API - Test Suite
Comprehensive API tests using pytest
"""

import pytest
from datetime import date, timedelta
from httpx import AsyncClient, ASGITransport
from app.main import app


# ============================================
# FIXTURES
# ============================================

@pytest.fixture
def anyio_backend():
    return 'asyncio'


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac


# ============================================
# HEALTH CHECK TESTS
# ============================================

@pytest.mark.anyio
async def test_health_check(client: AsyncClient):
    """Test health check endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


@pytest.mark.anyio
async def test_root_endpoint(client: AsyncClient):
    """Test root endpoint"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "İsmail Doğan" in data["message"]


# ============================================
# SERVICES TESTS
# ============================================

@pytest.mark.anyio
async def test_list_services(client: AsyncClient):
    """Test listing all services"""
    response = await client.get("/api/v1/services")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] > 0


@pytest.mark.anyio
async def test_get_service_by_id(client: AsyncClient):
    """Test getting a specific service"""
    response = await client.get("/api/v1/services/tesisat")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "tesisat"
    assert "name" in data
    assert "base_price" in data


@pytest.mark.anyio
async def test_get_service_not_found(client: AsyncClient):
    """Test getting non-existent service"""
    response = await client.get("/api/v1/services/nonexistent")
    assert response.status_code == 404


# ============================================
# BOOKING TESTS
# ============================================

@pytest.mark.anyio
async def test_create_booking(client: AsyncClient):
    """Test creating a new booking"""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    
    booking_data = {
        "service_category": "ariza",
        "problem_description": "Mutfakta prizlerden biri çalışmıyor. Acil müdahale gerekiyor.",
        "urgency_level": "urgent",
        "district": "Kadıköy",
        "address": "Caferağa Mah. Moda Cad. No:15 D:8",
        "preferred_date": tomorrow,
        "preferred_time_slot": "morning",
        "customer_name": "Test Müşteri",
        "customer_phone": "5321234567",
        "customer_email": "test@example.com",
        "additional_notes": "Test randevusu"
    }
    
    response = await client.post("/api/v1/bookings", json=booking_data)
    assert response.status_code == 201
    data = response.json()
    assert "booking_code" in data
    assert data["booking_code"].startswith("ELK-")
    assert data["status"] == "pending"
    
    return data["booking_code"]


@pytest.mark.anyio
async def test_create_booking_invalid_phone(client: AsyncClient):
    """Test booking creation with invalid phone"""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    
    booking_data = {
        "service_category": "ariza",
        "problem_description": "Test açıklaması - en az 20 karakter olmalı",
        "urgency_level": "normal",
        "district": "Kadıköy",
        "address": "Test Adres - en az 10 karakter",
        "preferred_date": tomorrow,
        "preferred_time_slot": "morning",
        "customer_name": "Test User",
        "customer_phone": "invalid",
        "customer_email": "test@example.com"
    }
    
    response = await client.post("/api/v1/bookings", json=booking_data)
    assert response.status_code == 422


@pytest.mark.anyio
async def test_create_booking_past_date(client: AsyncClient):
    """Test booking creation with past date"""
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    
    booking_data = {
        "service_category": "bakim",
        "problem_description": "Test açıklaması - en az 20 karakter gerekli",
        "urgency_level": "normal",
        "district": "Beşiktaş",
        "address": "Test Adres Bilgisi",
        "preferred_date": yesterday,
        "preferred_time_slot": "afternoon",
        "customer_name": "Test User",
        "customer_phone": "5321234567",
        "customer_email": "test@example.com"
    }
    
    response = await client.post("/api/v1/bookings", json=booking_data)
    assert response.status_code == 422


# ============================================
# PRICING TESTS
# ============================================

@pytest.mark.anyio
async def test_get_price_quote(client: AsyncClient):
    """Test getting a price quote"""
    quote_data = {
        "service_id": "tesisat",
        "district": "Kadıköy",
        "urgency": "normal"
    }
    
    response = await client.post("/api/v1/quotes", json=quote_data)
    assert response.status_code == 200
    data = response.json()
    assert "total_price" in data
    assert "base_price" in data
    assert data["currency"] == "TRY"


@pytest.mark.anyio
async def test_price_quote_urgent_multiplier(client: AsyncClient):
    """Test that urgent requests have higher price"""
    normal_quote = {
        "service_id": "ariza",
        "district": "Şişli",
        "urgency": "normal"
    }
    
    urgent_quote = {
        "service_id": "ariza",
        "district": "Şişli",
        "urgency": "urgent"
    }
    
    normal_response = await client.post("/api/v1/quotes", json=normal_quote)
    urgent_response = await client.post("/api/v1/quotes", json=urgent_quote)
    
    normal_data = normal_response.json()
    urgent_data = urgent_response.json()
    
    assert urgent_data["total_price"] > normal_data["total_price"]


# ============================================
# CALCULATION TESTS
# ============================================

@pytest.mark.anyio
async def test_load_calculation(client: AsyncClient):
    """Test electrical load calculation"""
    calc_data = {
        "devices": [
            {
                "name": "Klima",
                "power_watts": 2500,
                "quantity": 2,
                "usage_hours_per_day": 8,
                "power_factor": 0.85
            },
            {
                "name": "Buzdolabı",
                "power_watts": 150,
                "quantity": 1,
                "usage_hours_per_day": 24,
                "power_factor": 0.9
            }
        ],
        "circuit_type": "single_phase",
        "voltage_level": 220,
        "safety_factor": 1.2
    }
    
    response = await client.post("/api/v1/calculations/load", json=calc_data)
    assert response.status_code == 200
    data = response.json()
    
    assert "total_load_kw" in data
    assert "total_current_amps" in data
    assert "recommended_breaker_amps" in data
    assert "recommended_cable_section" in data
    assert "safety_status" in data


@pytest.mark.anyio
async def test_load_calculation_three_phase(client: AsyncClient):
    """Test three-phase calculation"""
    calc_data = {
        "devices": [
            {
                "name": "Endüstriyel Motor",
                "power_watts": 15000,
                "quantity": 2,
                "usage_hours_per_day": 16,
                "power_factor": 0.85
            }
        ],
        "circuit_type": "three_phase",
        "voltage_level": 380,
        "safety_factor": 1.25
    }
    
    response = await client.post("/api/v1/calculations/load", json=calc_data)
    assert response.status_code == 200
    data = response.json()
    
    # Three phase should result in lower current for same power
    assert data["total_current_amps"] > 0


# ============================================
# CONTACT TESTS
# ============================================

@pytest.mark.anyio
async def test_submit_contact_form(client: AsyncClient):
    """Test contact form submission"""
    contact_data = {
        "name": "Test Kullanıcı",
        "email": "test@example.com",
        "phone": "5321234567",
        "subject": "Fiyat Teklifi İstiyorum",
        "message": "Yeni evim için elektrik tesisatı yaptırmak istiyorum. Detaylı fiyat teklifi alabilir miyim?"
    }
    
    response = await client.post("/api/v1/contact", json=contact_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


@pytest.mark.anyio
async def test_contact_form_invalid_email(client: AsyncClient):
    """Test contact form with invalid email"""
    contact_data = {
        "name": "Test",
        "email": "invalid-email",
        "subject": "Test Subject",
        "message": "Test message content here"
    }
    
    response = await client.post("/api/v1/contact", json=contact_data)
    assert response.status_code == 422


# ============================================
# TESTIMONIALS TESTS
# ============================================

@pytest.mark.anyio
async def test_list_testimonials(client: AsyncClient):
    """Test listing testimonials"""
    response = await client.get("/api/v1/testimonials")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "customer_name" in data[0]
        assert "rating" in data[0]
