"""
İsmail Doğan Elektrik API - Booking Models
Pydantic models for booking requests and responses
"""

from datetime import datetime, date
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field, EmailStr, field_validator
import re


class ServiceCategory(str, Enum):
    """Available service categories"""
    TESISAT = "tesisat"
    PROJE = "proje"
    BAKIM = "bakim"
    ARIZA = "ariza"
    DANISMANLIK = "danismanlik"
    GUVENLIK = "guvenlik"


class UrgencyLevel(str, Enum):
    """Urgency levels for bookings"""
    NORMAL = "normal"
    URGENT = "urgent"
    EMERGENCY = "emergency"


class TimeSlot(str, Enum):
    """Available time slots"""
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"


class BookingStatus(str, Enum):
    """Booking status states"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class IstanbulDistrict(str, Enum):
    """Istanbul districts for service area"""
    ADALAR = "Adalar"
    ARNAVUTKOY = "Arnavutköy"
    ATASEHIR = "Ataşehir"
    AVCILAR = "Avcılar"
    BAGCILAR = "Bağcılar"
    BAHCELIEVLER = "Bahçelievler"
    BAKIRKOY = "Bakırköy"
    BASAKSEHIR = "Başakşehir"
    BAYRAMPASA = "Bayrampaşa"
    BESIKTAS = "Beşiktaş"
    BEYKOZ = "Beykoz"
    BEYLIKDUZU = "Beylikdüzü"
    BEYOGLU = "Beyoğlu"
    BUYUKCEKMECE = "Büyükçekmece"
    CATALCA = "Çatalca"
    CEKMEKOY = "Çekmeköy"
    ESENLER = "Esenler"
    ESENYURT = "Esenyurt"
    EYUPSULTAN = "Eyüpsultan"
    FATIH = "Fatih"
    GAZIOSMANPASA = "Gaziosmanpaşa"
    GUNGOREN = "Güngören"
    KADIKOY = "Kadıköy"
    KAGITHANE = "Kağıthane"
    KARTAL = "Kartal"
    KUCUKCEKMECE = "Küçükçekmece"
    MALTEPE = "Maltepe"
    PENDIK = "Pendik"
    SANCAKTEPE = "Sancaktepe"
    SARIYER = "Sarıyer"
    SILE = "Şile"
    SILIVRI = "Silivri"
    SISLI = "Şişli"
    SULTANBEYLI = "Sultanbeyli"
    SULTANGAZI = "Sultangazi"
    TUZLA = "Tuzla"
    UMRANIYE = "Ümraniye"
    USKUDAR = "Üsküdar"
    ZEYTINBURNU = "Zeytinburnu"


# ============================================
# REQUEST MODELS
# ============================================

class BookingCreate(BaseModel):
    """Request model for creating a new booking"""
    
    # Service Details
    service_category: ServiceCategory = Field(
        ...,
        alias="serviceCategory",
        description="Category of service requested"
    )
    problem_description: str = Field(
        ...,
        alias="problemDescription",
        min_length=20,
        max_length=500,
        description="Detailed description of the problem or requirement"
    )
    urgency_level: UrgencyLevel = Field(
        ...,
        alias="urgencyLevel",
        description="Level of urgency"
    )
    
    # Location Details
    district: str = Field(
        ...,
        description="Istanbul district"
    )
    address: str = Field(
        ...,
        min_length=10,
        max_length=300,
        description="Full address"
    )
    
    # Scheduling
    preferred_date: date = Field(
        ...,
        alias="preferredDate",
        description="Preferred date for service"
    )
    preferred_time_slot: TimeSlot = Field(
        ...,
        alias="preferredTimeSlot",
        description="Preferred time slot"
    )
    
    # Customer Details
    customer_name: str = Field(
        ...,
        alias="customerName",
        min_length=3,
        max_length=100,
        description="Customer full name"
    )
    customer_phone: str = Field(
        ...,
        alias="customerPhone",
        description="Customer phone number"
    )
    customer_email: EmailStr = Field(
        ...,
        alias="customerEmail",
        description="Customer email address"
    )
    
    # Optional
    additional_notes: Optional[str] = Field(
        None,
        alias="additionalNotes",
        max_length=500,
        description="Additional notes or requirements"
    )
    photos: Optional[List[str]] = Field(
        None,
        description="List of photo URLs"
    )

    @field_validator("customer_phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        """Validate Turkish phone number format"""
        # Remove non-digit characters
        cleaned = re.sub(r'\D', '', v)
        
        # Check Turkish mobile format
        if len(cleaned) == 10 and cleaned.startswith('5'):
            return f"0{cleaned}"
        elif len(cleaned) == 11 and cleaned.startswith('05'):
            return cleaned
        else:
            raise ValueError("Geçerli bir Türkiye cep telefonu numarası girin")
        
    @field_validator("preferred_date")
    @classmethod
    def validate_date(cls, v: date) -> date:
        """Ensure date is not in the past"""
        if v < date.today():
            raise ValueError("Geçmiş bir tarih seçilemez")
        return v

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "serviceCategory": "ariza",
                "problemDescription": "Evdeki prizlerden birinde sürekli kısa devre oluyor ve sigorta atıyor.",
                "urgencyLevel": "urgent",
                "district": "Kadıköy",
                "address": "Caferağa Mahallesi, Moda Caddesi No:15 Daire:3",
                "preferredDate": "2024-12-20",
                "preferredTimeSlot": "morning",
                "customerName": "Ahmet Yılmaz",
                "customerPhone": "05551234567",
                "customerEmail": "ahmet@example.com",
                "additionalNotes": "Bina girişinde güvenlik var, lütfen önceden arayın."
            }
        }


class BookingUpdate(BaseModel):
    """Request model for updating a booking"""
    
    status: Optional[BookingStatus] = None
    assigned_technician: Optional[str] = Field(None, alias="assignedTechnician")
    estimated_arrival: Optional[datetime] = Field(None, alias="estimatedArrival")
    notes: Optional[str] = None

    class Config:
        populate_by_name = True


# ============================================
# RESPONSE MODELS
# ============================================

class BookingResponse(BaseModel):
    """Response model for booking data"""
    
    id: str = Field(..., description="Unique booking ID")
    booking_code: str = Field(..., alias="bookingCode", description="Human-readable booking code")
    status: BookingStatus = Field(..., description="Current booking status")
    
    # Service Details
    service_category: ServiceCategory = Field(..., alias="serviceCategory")
    problem_description: str = Field(..., alias="problemDescription")
    urgency_level: UrgencyLevel = Field(..., alias="urgencyLevel")
    
    # Location
    district: str
    address: str
    
    # Scheduling
    preferred_date: date = Field(..., alias="preferredDate")
    preferred_time_slot: TimeSlot = Field(..., alias="preferredTimeSlot")
    estimated_arrival: Optional[datetime] = Field(None, alias="estimatedArrival")
    
    # Customer
    customer_name: str = Field(..., alias="customerName")
    customer_phone: str = Field(..., alias="customerPhone")
    customer_email: str = Field(..., alias="customerEmail")
    
    # Assignment
    assigned_technician: Optional[str] = Field(None, alias="assignedTechnician")
    
    # Timestamps
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt")

    class Config:
        populate_by_name = True
        from_attributes = True


class BookingListResponse(BaseModel):
    """Response model for list of bookings"""
    
    items: List[BookingResponse]
    total: int
    page: int
    page_size: int = Field(..., alias="pageSize")
    total_pages: int = Field(..., alias="totalPages")

    class Config:
        populate_by_name = True


class AvailableSlotsResponse(BaseModel):
    """Response model for available time slots"""
    
    date: date
    district: str
    available_slots: List[TimeSlot] = Field(..., alias="availableSlots")
    
    class Config:
        populate_by_name = True
