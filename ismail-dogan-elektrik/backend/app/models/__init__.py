"""
İsmail Doğan Elektrik API - Models Package
"""

from .booking import (
    BookingCreate,
    BookingUpdate,
    BookingResponse,
    BookingListResponse,
    BookingStatus,
    UrgencyLevel,
    TimeSlot,
    ServiceCategory,
    IstanbulDistrict,
    AvailableSlotsResponse,
)

from .service import (
    ServiceBase,
    ServiceResponse,
    ServiceListResponse,
    PriceQuoteRequest,
    PriceQuoteResponse,
    ElectricDevice,
    LoadCalculationRequest,
    LoadCalculationResult,
    CircuitType,
    SafetyStatus,
    ContactFormRequest,
    ContactFormResponse,
    TestimonialResponse,
)

__all__ = [
    # Booking Models
    "BookingCreate",
    "BookingUpdate",
    "BookingResponse",
    "BookingListResponse",
    "BookingStatus",
    "UrgencyLevel",
    "TimeSlot",
    "ServiceCategory",
    "IstanbulDistrict",
    "AvailableSlotsResponse",
    # Service Models
    "ServiceBase",
    "ServiceResponse",
    "ServiceListResponse",
    "PriceQuoteRequest",
    "PriceQuoteResponse",
    "ElectricDevice",
    "LoadCalculationRequest",
    "LoadCalculationResult",
    "CircuitType",
    "SafetyStatus",
    "ContactFormRequest",
    "ContactFormResponse",
    "TestimonialResponse",
]
