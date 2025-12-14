"""
İsmail Doğan Elektrik API - Service Models
Pydantic models for services and pricing
"""

from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field


class ServiceCategory(str, Enum):
    """Service category identifiers"""
    TESISAT = "tesisat"
    PROJE = "proje"
    BAKIM = "bakim"
    ARIZA = "ariza"
    DANISMANLIK = "danismanlik"
    GUVENLIK = "guvenlik"


class CircuitType(str, Enum):
    """Electrical circuit types"""
    SINGLE_PHASE = "single_phase"
    THREE_PHASE = "three_phase"


class SafetyStatus(str, Enum):
    """Safety assessment status"""
    SAFE = "safe"
    WARNING = "warning"
    DANGER = "danger"


# ============================================
# SERVICE MODELS
# ============================================

class ServiceBase(BaseModel):
    """Base service model"""
    
    id: str = Field(..., description="Unique service identifier")
    name: str = Field(..., description="Service name")
    description: str = Field(..., description="Service description")
    category: ServiceCategory = Field(..., description="Service category")
    base_price: float = Field(..., alias="basePrice", ge=0, description="Base price in TRY")
    estimated_duration: str = Field(..., alias="estimatedDuration", description="Estimated duration")
    icon: str = Field(..., description="Icon identifier")
    features: List[str] = Field(default=[], description="List of service features")


class ServiceResponse(ServiceBase):
    """Service response model"""
    
    class Config:
        populate_by_name = True
        from_attributes = True


class ServiceListResponse(BaseModel):
    """List of services response"""
    
    items: List[ServiceResponse]
    total: int


# ============================================
# PRICING MODELS
# ============================================

class PriceQuoteRequest(BaseModel):
    """Request model for price quote"""
    
    service_id: str = Field(..., alias="serviceId", description="Service identifier")
    district: str = Field(..., description="Istanbul district")
    urgency: str = Field(..., description="Urgency level")
    
    class Config:
        populate_by_name = True


class PriceQuoteResponse(BaseModel):
    """Response model for price quote"""
    
    base_price: float = Field(..., alias="basePrice", description="Base service price")
    labor_cost: float = Field(..., alias="laborCost", description="Estimated labor cost")
    materials_cost: float = Field(..., alias="materialsCost", description="Estimated materials cost")
    urgency_multiplier: float = Field(..., alias="urgencyMultiplier", description="Urgency price multiplier")
    distance_multiplier: float = Field(..., alias="distanceMultiplier", description="Distance price multiplier")
    total_price: float = Field(..., alias="totalPrice", description="Total estimated price")
    currency: str = Field(default="TRY", description="Currency code")
    valid_until: str = Field(..., alias="validUntil", description="Quote validity date")
    
    class Config:
        populate_by_name = True


# ============================================
# LOAD CALCULATION MODELS (for Rust Engine)
# ============================================

class ElectricDevice(BaseModel):
    """Electrical device for load calculation"""
    
    name: str = Field(..., description="Device name")
    power_watts: float = Field(..., alias="powerWatts", gt=0, description="Power consumption in watts")
    quantity: int = Field(..., ge=1, description="Number of devices")
    usage_hours_per_day: float = Field(
        ..., 
        alias="usageHoursPerDay", 
        ge=0, 
        le=24, 
        description="Daily usage hours"
    )
    power_factor: float = Field(
        default=0.9, 
        alias="powerFactor", 
        ge=0.1, 
        le=1.0, 
        description="Power factor"
    )
    
    class Config:
        populate_by_name = True


class LoadCalculationRequest(BaseModel):
    """Request model for electrical load calculation"""
    
    devices: List[ElectricDevice] = Field(..., min_length=1, description="List of electrical devices")
    circuit_type: CircuitType = Field(..., alias="circuitType", description="Circuit type")
    voltage_level: float = Field(
        default=220.0, 
        alias="voltageLevel", 
        description="System voltage level"
    )
    safety_factor: float = Field(
        default=1.25, 
        alias="safetyFactor", 
        ge=1.0, 
        le=2.0, 
        description="Safety factor for calculations"
    )
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "devices": [
                    {"name": "Klima", "powerWatts": 2500, "quantity": 2, "usageHoursPerDay": 8, "powerFactor": 0.85},
                    {"name": "Buzdolabı", "powerWatts": 150, "quantity": 1, "usageHoursPerDay": 24, "powerFactor": 0.9},
                    {"name": "Aydınlatma", "powerWatts": 60, "quantity": 10, "usageHoursPerDay": 6, "powerFactor": 0.95}
                ],
                "circuitType": "single_phase",
                "voltageLevel": 220,
                "safetyFactor": 1.25
            }
        }


class LoadCalculationResult(BaseModel):
    """Response model for load calculation results"""
    
    total_load_kw: float = Field(..., alias="totalLoadKw", description="Total load in kilowatts")
    total_current_amps: float = Field(..., alias="totalCurrentAmps", description="Total current in amperes")
    recommended_breaker_amps: int = Field(..., alias="recommendedBreakerAmps", description="Recommended breaker size")
    recommended_cable_section: float = Field(..., alias="recommendedCableSection", description="Recommended cable section in mm²")
    monthly_consumption_kwh: float = Field(..., alias="monthlyConsumptionKwh", description="Estimated monthly consumption")
    estimated_monthly_cost: float = Field(..., alias="estimatedMonthlyCost", description="Estimated monthly cost in TRY")
    safety_status: SafetyStatus = Field(..., alias="safetyStatus", description="Safety assessment")
    warnings: List[str] = Field(default=[], description="Warning messages")
    recommendations: List[str] = Field(default=[], description="Recommendations")
    
    class Config:
        populate_by_name = True


# ============================================
# CONTACT MODELS
# ============================================

class ContactFormRequest(BaseModel):
    """Contact form request model"""
    
    name: str = Field(..., min_length=3, max_length=100)
    email: str = Field(...)
    phone: str = Field(...)
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactFormResponse(BaseModel):
    """Contact form response model"""
    
    success: bool
    message: str


# ============================================
# TESTIMONIAL MODELS
# ============================================

class TestimonialResponse(BaseModel):
    """Testimonial response model"""
    
    id: str
    customer_name: str = Field(..., alias="customerName")
    customer_location: str = Field(..., alias="customerLocation")
    rating: int = Field(..., ge=1, le=5)
    comment: str
    service_type: str = Field(..., alias="serviceType")
    date: str
    avatar: Optional[str] = None
    
    class Config:
        populate_by_name = True
