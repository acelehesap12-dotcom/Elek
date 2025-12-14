from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, Enum, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
import enum
from app.database import Base


class ServiceCategory(str, enum.Enum):
    RESIDENTIAL = "konut"
    COMMERCIAL = "ticari"
    INDUSTRIAL = "endustriyel"
    PROJECT = "proje"


class UrgencyLevel(str, enum.Enum):
    LOW = "dusuk"
    NORMAL = "normal"
    HIGH = "yuksek"
    EMERGENCY = "acil"


class TimeSlot(str, enum.Enum):
    MORNING = "sabah"
    AFTERNOON = "ogle"
    EVENING = "aksam"


class BookingStatus(str, enum.Enum):
    PENDING = "beklemede"
    CONFIRMED = "onaylandi"
    IN_PROGRESS = "devam_ediyor"
    COMPLETED = "tamamlandi"
    CANCELLED = "iptal_edildi"


class Customer(Base):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20), nullable=False, index=True)
    address = Column(Text)
    district = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    bookings = relationship("Booking", back_populates="customer")
    contact_messages = relationship("ContactMessage", back_populates="customer")


class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(Enum(ServiceCategory), nullable=False)
    base_price = Column(Float, nullable=False)
    price_unit = Column(String(20), default="TL")
    duration_minutes = Column(Integer, default=60)
    icon = Column(String(50))
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    features = relationship("ServiceFeature", back_populates="service", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="service")


class ServiceFeature(Base):
    __tablename__ = "service_features"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    feature = Column(String(200), nullable=False)
    sort_order = Column(Integer, default=0)

    # Relationships
    service = relationship("Service", back_populates="features")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_code = Column(String(20), unique=True, nullable=False, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    technician_id = Column(UUID(as_uuid=True), ForeignKey("technicians.id"))
    
    # Details
    address = Column(Text, nullable=False)
    district = Column(String(50), nullable=False)
    description = Column(Text)
    urgency = Column(Enum(UrgencyLevel), default=UrgencyLevel.NORMAL)
    
    # Scheduling
    preferred_date = Column(DateTime(timezone=True), nullable=False)
    time_slot = Column(Enum(TimeSlot), default=TimeSlot.MORNING)
    estimated_duration = Column(Integer)  # minutes
    
    # Status
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    
    # Pricing
    estimated_price = Column(Float)
    final_price = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    confirmed_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

    # Relationships
    customer = relationship("Customer", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")
    technician = relationship("Technician", back_populates="bookings")
    photos = relationship("BookingPhoto", back_populates="booking", cascade="all, delete-orphan")


class BookingPhoto(Base):
    __tablename__ = "booking_photos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_name = Column(String(255))
    mime_type = Column(String(50))
    file_size = Column(Integer)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    booking = relationship("Booking", back_populates="photos")


class Technician(Base):
    __tablename__ = "technicians"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255))
    specializations = Column(ARRAY(String(50)))
    is_active = Column(Boolean, default=True)
    rating = Column(Float, default=5.0)
    total_jobs = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bookings = relationship("Booking", back_populates="technician")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    replied_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    customer = relationship("Customer", back_populates="contact_messages")


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_name = Column(String(100), nullable=False)
    customer_title = Column(String(100))
    avatar_url = Column(String(500))
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    table_name = Column(String(100), nullable=False)
    record_id = Column(UUID(as_uuid=True), nullable=False)
    action = Column(String(20), nullable=False)  # INSERT, UPDATE, DELETE
    old_data = Column(Text)  # JSON
    new_data = Column(Text)  # JSON
    user_id = Column(UUID(as_uuid=True))
    ip_address = Column(String(45))
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
