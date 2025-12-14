"""
İsmail Doğan Elektrik API - Bookings Router
Handles all booking-related endpoints
"""

from datetime import datetime, date, timedelta
from typing import List, Optional
from uuid import uuid4
from fastapi import APIRouter, HTTPException, Query, status, BackgroundTasks
from loguru import logger

from app.models import (
    BookingCreate,
    BookingUpdate,
    BookingResponse,
    BookingListResponse,
    AvailableSlotsResponse,
    BookingStatus,
    TimeSlot,
)
from app.config import settings

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# In-memory storage for demo (replace with database in production)
bookings_db: dict[str, dict] = {}


def generate_booking_code() -> str:
    """Generate a unique booking code"""
    timestamp = datetime.now().strftime("%y%m%d")
    unique_id = uuid4().hex[:6].upper()
    return f"ELK-{timestamp}-{unique_id}"


def get_time_slot_display(slot: TimeSlot) -> str:
    """Get display text for time slot"""
    slots = {
        TimeSlot.MORNING: "Sabah (09:00 - 12:00)",
        TimeSlot.AFTERNOON: "Öğleden Sonra (12:00 - 17:00)",
        TimeSlot.EVENING: "Akşam (17:00 - 20:00)",
    }
    return slots.get(slot, str(slot))


async def send_booking_confirmation_email(booking: dict):
    """Send booking confirmation email (background task)"""
    logger.info(f"Sending confirmation email for booking {booking['booking_code']}")
    # TODO: Implement email sending
    pass


async def send_booking_confirmation_sms(booking: dict):
    """Send booking confirmation SMS (background task)"""
    logger.info(f"Sending confirmation SMS for booking {booking['booking_code']}")
    # TODO: Implement SMS sending
    pass


# ============================================
# ENDPOINTS
# ============================================

@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new booking",
    description="Create a new service booking request",
)
async def create_booking(
    booking_data: BookingCreate,
    background_tasks: BackgroundTasks,
):
    """
    Create a new booking with the following information:
    - **serviceCategory**: Type of service required
    - **problemDescription**: Detailed description of the issue
    - **urgencyLevel**: How urgent is the request
    - **district**: Istanbul district
    - **address**: Full address
    - **preferredDate**: Preferred service date
    - **preferredTimeSlot**: Preferred time slot
    - **customerName**: Customer's full name
    - **customerPhone**: Customer's phone number
    - **customerEmail**: Customer's email address
    """
    try:
        # Generate unique identifiers
        booking_id = str(uuid4())
        booking_code = generate_booking_code()
        
        # Create booking record
        booking = {
            "id": booking_id,
            "booking_code": booking_code,
            "status": BookingStatus.PENDING,
            
            # Service details
            "service_category": booking_data.service_category,
            "problem_description": booking_data.problem_description,
            "urgency_level": booking_data.urgency_level,
            
            # Location
            "district": booking_data.district,
            "address": booking_data.address,
            
            # Scheduling
            "preferred_date": booking_data.preferred_date,
            "preferred_time_slot": booking_data.preferred_time_slot,
            "estimated_arrival": None,
            
            # Customer
            "customer_name": booking_data.customer_name,
            "customer_phone": booking_data.customer_phone,
            "customer_email": booking_data.customer_email,
            
            # Additional
            "additional_notes": booking_data.additional_notes,
            "photos": booking_data.photos or [],
            
            # Assignment
            "assigned_technician": None,
            
            # Timestamps
            "created_at": datetime.utcnow(),
            "updated_at": None,
        }
        
        # Store in database
        bookings_db[booking_id] = booking
        
        # Schedule background tasks
        background_tasks.add_task(send_booking_confirmation_email, booking)
        background_tasks.add_task(send_booking_confirmation_sms, booking)
        
        logger.info(f"Created booking {booking_code} for {booking_data.customer_name}")
        
        return BookingResponse(
            id=booking["id"],
            booking_code=booking["booking_code"],
            status=booking["status"],
            service_category=booking["service_category"],
            problem_description=booking["problem_description"],
            urgency_level=booking["urgency_level"],
            district=booking["district"],
            address=booking["address"],
            preferred_date=booking["preferred_date"],
            preferred_time_slot=booking["preferred_time_slot"],
            estimated_arrival=booking["estimated_arrival"],
            customer_name=booking["customer_name"],
            customer_phone=booking["customer_phone"],
            customer_email=booking["customer_email"],
            assigned_technician=booking["assigned_technician"],
            created_at=booking["created_at"],
            updated_at=booking["updated_at"],
        )
        
    except Exception as e:
        logger.error(f"Error creating booking: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Randevu oluşturulurken bir hata oluştu",
        )


@router.get(
    "/{booking_code}",
    response_model=BookingResponse,
    summary="Get booking by code",
    description="Retrieve booking details by booking code",
)
async def get_booking(booking_code: str):
    """Get booking details by booking code"""
    
    # Search for booking by code
    booking = None
    for b in bookings_db.values():
        if b["booking_code"] == booking_code:
            booking = b
            break
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Randevu bulunamadı",
        )
    
    return BookingResponse(
        id=booking["id"],
        booking_code=booking["booking_code"],
        status=booking["status"],
        service_category=booking["service_category"],
        problem_description=booking["problem_description"],
        urgency_level=booking["urgency_level"],
        district=booking["district"],
        address=booking["address"],
        preferred_date=booking["preferred_date"],
        preferred_time_slot=booking["preferred_time_slot"],
        estimated_arrival=booking["estimated_arrival"],
        customer_name=booking["customer_name"],
        customer_phone=booking["customer_phone"],
        customer_email=booking["customer_email"],
        assigned_technician=booking["assigned_technician"],
        created_at=booking["created_at"],
        updated_at=booking["updated_at"],
    )


@router.delete(
    "/{booking_code}",
    status_code=status.HTTP_200_OK,
    summary="Cancel booking",
    description="Cancel a booking by booking code",
)
async def cancel_booking(booking_code: str):
    """Cancel a booking"""
    
    # Find booking
    booking_id = None
    for bid, b in bookings_db.items():
        if b["booking_code"] == booking_code:
            booking_id = bid
            break
    
    if not booking_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Randevu bulunamadı",
        )
    
    # Check if booking can be cancelled
    booking = bookings_db[booking_id]
    if booking["status"] in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu randevu iptal edilemez",
        )
    
    # Update status
    bookings_db[booking_id]["status"] = BookingStatus.CANCELLED
    bookings_db[booking_id]["updated_at"] = datetime.utcnow()
    
    logger.info(f"Cancelled booking {booking_code}")
    
    return {"success": True, "message": "Randevu başarıyla iptal edildi"}


@router.get(
    "/available-slots",
    response_model=AvailableSlotsResponse,
    summary="Get available time slots",
    description="Get available time slots for a specific date and district",
)
async def get_available_slots(
    date: date = Query(..., description="Date to check availability"),
    district: str = Query(..., description="Istanbul district"),
):
    """Get available time slots for booking"""
    
    # Check if date is valid
    if date < datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçmiş tarih için müsaitlik sorgulanamaz",
        )
    
    # For demo, return all slots as available
    # In production, this would check against existing bookings and technician availability
    available = [TimeSlot.MORNING, TimeSlot.AFTERNOON, TimeSlot.EVENING]
    
    # Simulate some slots being taken
    booked_slots = []
    for booking in bookings_db.values():
        if (
            booking["preferred_date"] == date
            and booking["district"] == district
            and booking["status"] not in [BookingStatus.CANCELLED]
        ):
            booked_slots.append(booking["preferred_time_slot"])
    
    available = [slot for slot in available if slot not in booked_slots]
    
    return AvailableSlotsResponse(
        date=date,
        district=district,
        available_slots=available,
    )


@router.get(
    "",
    response_model=BookingListResponse,
    summary="List bookings",
    description="List all bookings with pagination and filtering",
)
async def list_bookings(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, alias="pageSize", description="Items per page"),
    status: Optional[BookingStatus] = Query(None, description="Filter by status"),
    district: Optional[str] = Query(None, description="Filter by district"),
):
    """List bookings with pagination"""
    
    # Filter bookings
    filtered = list(bookings_db.values())
    
    if status:
        filtered = [b for b in filtered if b["status"] == status]
    
    if district:
        filtered = [b for b in filtered if b["district"] == district]
    
    # Sort by created_at descending
    filtered.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Pagination
    total = len(filtered)
    total_pages = (total + page_size - 1) // page_size
    start = (page - 1) * page_size
    end = start + page_size
    items = filtered[start:end]
    
    return BookingListResponse(
        items=[
            BookingResponse(
                id=b["id"],
                booking_code=b["booking_code"],
                status=b["status"],
                service_category=b["service_category"],
                problem_description=b["problem_description"],
                urgency_level=b["urgency_level"],
                district=b["district"],
                address=b["address"],
                preferred_date=b["preferred_date"],
                preferred_time_slot=b["preferred_time_slot"],
                estimated_arrival=b["estimated_arrival"],
                customer_name=b["customer_name"],
                customer_phone=b["customer_phone"],
                customer_email=b["customer_email"],
                assigned_technician=b["assigned_technician"],
                created_at=b["created_at"],
                updated_at=b["updated_at"],
            )
            for b in items
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
