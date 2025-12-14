"""
İsmail Doğan Elektrik API - Services Router
Handles service listing, pricing, and calculations
"""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from loguru import logger

from app.models import (
    ServiceResponse,
    ServiceListResponse,
    PriceQuoteRequest,
    PriceQuoteResponse,
    LoadCalculationRequest,
    LoadCalculationResult,
    ContactFormRequest,
    ContactFormResponse,
    TestimonialResponse,
    SafetyStatus,
    CircuitType,
)
from app.config import settings
from app.services.rust_binding import calculate_electrical_load

router = APIRouter(tags=["Services"])

# ============================================
# SERVICE DATA
# ============================================

SERVICES_DATA = [
    {
        "id": "tesisat",
        "name": "Elektrik Tesisatı",
        "description": "Konut, işyeri ve endüstriyel tesislerde tam kapsamlı elektrik tesisat kurulumu ve yenileme hizmetleri.",
        "category": "tesisat",
        "base_price": 2500.0,
        "estimated_duration": "2-5 gün",
        "icon": "zap",
        "features": [
            "Komple tesisat kurulumu",
            "Eski tesisat yenileme",
            "Elektrik panosu montajı",
            "Kablo çekimi ve döşeme",
            "Topraklama sistemi",
            "Aydınlatma tesisatı",
        ],
    },
    {
        "id": "proje",
        "name": "Proje Çizimi",
        "description": "Mühendislik standartlarına uygun elektrik proje çizimi, hesaplamaları ve onay süreçleri.",
        "category": "proje",
        "base_price": 3000.0,
        "estimated_duration": "3-7 gün",
        "icon": "file-text",
        "features": [
            "Tek hat şeması",
            "Aydınlatma projesi",
            "Kuvvet tesisatı projesi",
            "Yük hesaplamaları",
            "TEDAŞ onay takibi",
        ],
    },
    {
        "id": "bakim",
        "name": "Periyodik Bakım",
        "description": "Elektrik sistemlerinizin güvenli ve verimli çalışması için düzenli bakım ve kontrol hizmetleri.",
        "category": "bakim",
        "base_price": 800.0,
        "estimated_duration": "2-4 saat",
        "icon": "wrench",
        "features": [
            "Termal görüntüleme",
            "Yalıtım direnci ölçümü",
            "Topraklama ölçümü",
            "Pano bakımı",
            "Rapor hazırlama",
        ],
    },
    {
        "id": "ariza",
        "name": "Arıza Tespit ve Onarım",
        "description": "7/24 acil arıza müdahale, profesyonel tespit ekipmanları ile hızlı ve kalıcı çözümler.",
        "category": "ariza",
        "base_price": 500.0,
        "estimated_duration": "1-3 saat",
        "icon": "alert-triangle",
        "features": [
            "7/24 acil müdahale",
            "Kaçak akım tespiti",
            "Kısa devre onarımı",
            "Hat arıza tespiti",
        ],
    },
    {
        "id": "danismanlik",
        "name": "Teknik Danışmanlık",
        "description": "Elektrik sistemleri, enerji verimliliği ve yatırım planlaması konularında uzman danışmanlık.",
        "category": "danismanlik",
        "base_price": 1500.0,
        "estimated_duration": "1-2 gün",
        "icon": "message-square",
        "features": [
            "Enerji verimliliği analizi",
            "Sistem optimizasyonu",
            "Maliyet hesaplamaları",
            "Fizibilite raporları",
        ],
    },
    {
        "id": "guvenlik",
        "name": "Güvenlik Sistemleri",
        "description": "Elektriksel güvenlik denetimleri, topraklama ölçümleri ve paratoner sistemleri kurulumu.",
        "category": "guvenlik",
        "base_price": 1200.0,
        "estimated_duration": "4-8 saat",
        "icon": "shield",
        "features": [
            "Topraklama ölçümü",
            "Paratoner kurulumu",
            "Kaçak akım rölesi",
            "Güvenlik denetimi",
        ],
    },
]

TESTIMONIALS_DATA = [
    {
        "id": "1",
        "customer_name": "Ahmet Yılmaz",
        "customer_location": "Kadıköy, İstanbul",
        "rating": 5,
        "comment": "Fabrikamızın elektrik altyapısını tamamen yenilediler. İsmail Bey'in mühendislik yaklaşımı ve detaycılığı gerçekten etkileyiciydi.",
        "service_type": "Endüstriyel Tesisat",
        "date": "2024-01-15",
    },
    {
        "id": "2",
        "customer_name": "Fatma Demir",
        "customer_location": "Beşiktaş, İstanbul",
        "rating": 5,
        "comment": "Gece yarısı elektrik arızası yaşadık ve acil destek hattını aradık. 30 dakika içinde geldiler.",
        "service_type": "Acil Arıza Müdahale",
        "date": "2024-02-20",
    },
    {
        "id": "3",
        "customer_name": "Mehmet Kaya",
        "customer_location": "Şişli, İstanbul",
        "rating": 5,
        "comment": "Yeni açtığımız mağaza için elektrik projesini hazırladılar. Her şey mükemmel hesaplanmış.",
        "service_type": "Proje Çizimi",
        "date": "2024-03-10",
    },
]


def get_district_multiplier(district: str) -> float:
    """Calculate distance multiplier based on district"""
    central_districts = [
        "Beşiktaş", "Şişli", "Kadıköy", "Üsküdar", "Fatih",
        "Beyoğlu", "Bakırköy", "Ataşehir",
    ]
    far_districts = [
        "Silivri", "Çatalca", "Şile", "Adalar", "Arnavutköy", "Büyükçekmece",
    ]
    
    if district in central_districts:
        return 1.0
    elif district in far_districts:
        return 1.5
    else:
        return 1.2


def get_urgency_multiplier(urgency: str) -> float:
    """Get urgency price multiplier"""
    multipliers = {
        "normal": 1.0,
        "urgent": settings.URGENT_MULTIPLIER,
        "emergency": settings.EMERGENCY_MULTIPLIER,
    }
    return multipliers.get(urgency, 1.0)


# ============================================
# SERVICE ENDPOINTS
# ============================================

@router.get(
    "/services",
    response_model=ServiceListResponse,
    summary="List all services",
    description="Get list of all available services",
)
async def list_services():
    """Get all available services"""
    return ServiceListResponse(
        items=[ServiceResponse(**s) for s in SERVICES_DATA],
        total=len(SERVICES_DATA),
    )


@router.get(
    "/services/{service_id}",
    response_model=ServiceResponse,
    summary="Get service by ID",
    description="Get detailed information about a specific service",
)
async def get_service(service_id: str):
    """Get service details by ID"""
    service = next((s for s in SERVICES_DATA if s["id"] == service_id), None)
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hizmet bulunamadı",
        )
    
    return ServiceResponse(**service)


@router.get(
    "/services/category/{category}",
    response_model=ServiceListResponse,
    summary="Get services by category",
    description="Get services filtered by category",
)
async def get_services_by_category(category: str):
    """Get services by category"""
    filtered = [s for s in SERVICES_DATA if s["category"] == category]
    return ServiceListResponse(
        items=[ServiceResponse(**s) for s in filtered],
        total=len(filtered),
    )


# ============================================
# PRICING ENDPOINTS
# ============================================

@router.post(
    "/quotes",
    response_model=PriceQuoteResponse,
    summary="Get price quote",
    description="Calculate price quote for a service",
)
async def get_price_quote(request: PriceQuoteRequest):
    """Calculate price quote for a service"""
    
    # Find service
    service = next((s for s in SERVICES_DATA if s["id"] == request.service_id), None)
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hizmet bulunamadı",
        )
    
    # Calculate multipliers
    urgency_mult = get_urgency_multiplier(request.urgency)
    distance_mult = get_district_multiplier(request.district)
    
    # Calculate costs
    base_price = service["base_price"]
    labor_cost = settings.BASE_LABOR_RATE * 2  # Estimate 2 hours
    materials_cost = base_price * 0.3  # 30% of base price for materials
    
    # Total with multipliers
    subtotal = base_price + labor_cost + materials_cost
    total = subtotal * urgency_mult * distance_mult
    
    # Quote validity (7 days)
    valid_until = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    
    return PriceQuoteResponse(
        base_price=base_price,
        labor_cost=labor_cost,
        materials_cost=materials_cost,
        urgency_multiplier=urgency_mult,
        distance_multiplier=distance_mult,
        total_price=round(total, 2),
        currency="TRY",
        valid_until=valid_until,
    )


# ============================================
# CALCULATION ENDPOINTS (Uses Rust Engine)
# ============================================

@router.post(
    "/calculations/load",
    response_model=LoadCalculationResult,
    summary="Calculate electrical load",
    description="Calculate electrical load using high-performance Rust engine",
)
async def calculate_load(request: LoadCalculationRequest):
    """
    Calculate electrical load using the Rust engine.
    Returns recommendations for cable sizing, breaker selection, and safety assessment.
    """
    try:
        # Call Rust engine through binding
        result = calculate_electrical_load(
            devices=[
                {
                    "name": d.name,
                    "power_watts": d.power_watts,
                    "quantity": d.quantity,
                    "usage_hours_per_day": d.usage_hours_per_day,
                    "power_factor": d.power_factor,
                }
                for d in request.devices
            ],
            circuit_type=request.circuit_type.value,
            voltage_level=request.voltage_level,
            safety_factor=request.safety_factor,
        )
        
        return LoadCalculationResult(**result)
        
    except Exception as e:
        logger.error(f"Load calculation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Hesaplama sırasında bir hata oluştu",
        )


# ============================================
# CONTACT ENDPOINTS
# ============================================

@router.post(
    "/contact",
    response_model=ContactFormResponse,
    summary="Submit contact form",
    description="Submit a contact form message",
)
async def submit_contact_form(request: ContactFormRequest):
    """Submit contact form"""
    try:
        logger.info(f"Contact form submitted by {request.name} ({request.email})")
        
        # TODO: Save to database and send notification email
        
        return ContactFormResponse(
            success=True,
            message="Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
        )
        
    except Exception as e:
        logger.error(f"Contact form error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Mesaj gönderilirken bir hata oluştu",
        )


# ============================================
# TESTIMONIALS ENDPOINTS
# ============================================

@router.get(
    "/testimonials",
    response_model=List[TestimonialResponse],
    summary="Get testimonials",
    description="Get customer testimonials",
)
async def get_testimonials():
    """Get customer testimonials"""
    return [TestimonialResponse(**t) for t in TESTIMONIALS_DATA]
