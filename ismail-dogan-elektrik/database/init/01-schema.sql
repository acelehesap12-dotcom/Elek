-- ============================================
-- İsmail Doğan Elektrik - Database Initialization
-- PostgreSQL Schema for Production
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE service_category AS ENUM (
    'tesisat',
    'proje',
    'bakim',
    'ariza',
    'danismanlik',
    'guvenlik'
);

CREATE TYPE urgency_level AS ENUM (
    'normal',
    'urgent',
    'emergency'
);

CREATE TYPE time_slot AS ENUM (
    'morning',
    'afternoon',
    'evening'
);

CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled'
);

-- ============================================
-- TABLES
-- ============================================

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Service details
    service_category service_category NOT NULL,
    problem_description TEXT NOT NULL,
    urgency_level urgency_level DEFAULT 'normal',
    
    -- Location
    district VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    
    -- Scheduling
    preferred_date DATE NOT NULL,
    preferred_time_slot time_slot NOT NULL,
    confirmed_datetime TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status booking_status DEFAULT 'pending',
    assigned_technician VARCHAR(100),
    
    -- Notes
    additional_notes TEXT,
    internal_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_bookings_code ON bookings(booking_code);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(preferred_date);
CREATE INDEX idx_bookings_district ON bookings(district);

-- Booking photos
CREATE TABLE booking_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    filename VARCHAR(255),
    mime_type VARCHAR(50),
    size_bytes INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_photos_booking ON booking_photos(booking_id);

-- Contact messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_read ON contact_messages(is_read);
CREATE INDEX idx_contact_created ON contact_messages(created_at DESC);

-- Services table
CREATE TABLE services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category service_category NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    estimated_duration VARCHAR(50),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Service features
CREATE TABLE service_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id VARCHAR(50) REFERENCES services(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_features_service ON service_features(service_id);

-- Testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(100) NOT NULL,
    customer_location VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    service_type VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    testimonial_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);

-- Technicians
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    specialization service_category[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_audit_record ON audit_log(record_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Booking code generator function
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
BEGIN
    code := 'ELK-' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || 
            UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE TRIGGER trigger_customers_updated
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_bookings_updated
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_services_updated
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default services
INSERT INTO services (id, name, description, category, base_price, estimated_duration, icon, sort_order) VALUES
('tesisat', 'Elektrik Tesisatı', 'Konut, işyeri ve endüstriyel tesislerde tam kapsamlı elektrik tesisat kurulumu ve yenileme hizmetleri.', 'tesisat', 2500.00, '2-5 gün', 'zap', 1),
('proje', 'Proje Çizimi', 'Mühendislik standartlarına uygun elektrik proje çizimi, hesaplamaları ve onay süreçleri.', 'proje', 3000.00, '3-7 gün', 'file-text', 2),
('bakim', 'Periyodik Bakım', 'Elektrik sistemlerinizin güvenli ve verimli çalışması için düzenli bakım ve kontrol hizmetleri.', 'bakim', 800.00, '2-4 saat', 'wrench', 3),
('ariza', 'Arıza Tespit ve Onarım', '7/24 acil arıza müdahale, profesyonel tespit ekipmanları ile hızlı ve kalıcı çözümler.', 'ariza', 500.00, '1-3 saat', 'alert-triangle', 4),
('danismanlik', 'Teknik Danışmanlık', 'Elektrik sistemleri, enerji verimliliği ve yatırım planlaması konularında uzman danışmanlık.', 'danismanlik', 1500.00, '1-2 gün', 'message-square', 5),
('guvenlik', 'Güvenlik Sistemleri', 'Elektriksel güvenlik denetimleri, topraklama ölçümleri ve paratoner sistemleri kurulumu.', 'guvenlik', 1200.00, '4-8 saat', 'shield', 6);

-- Insert service features
INSERT INTO service_features (service_id, feature, sort_order) VALUES
('tesisat', 'Komple tesisat kurulumu', 1),
('tesisat', 'Eski tesisat yenileme', 2),
('tesisat', 'Elektrik panosu montajı', 3),
('tesisat', 'Kablo çekimi ve döşeme', 4),
('tesisat', 'Topraklama sistemi', 5),
('tesisat', 'Aydınlatma tesisatı', 6),
('proje', 'Tek hat şeması', 1),
('proje', 'Aydınlatma projesi', 2),
('proje', 'Kuvvet tesisatı projesi', 3),
('proje', 'Yük hesaplamaları', 4),
('proje', 'TEDAŞ onay takibi', 5),
('bakim', 'Termal görüntüleme', 1),
('bakim', 'Yalıtım direnci ölçümü', 2),
('bakim', 'Topraklama ölçümü', 3),
('bakim', 'Pano bakımı', 4),
('bakim', 'Rapor hazırlama', 5),
('ariza', '7/24 acil müdahale', 1),
('ariza', 'Kaçak akım tespiti', 2),
('ariza', 'Kısa devre onarımı', 3),
('ariza', 'Hat arıza tespiti', 4),
('danismanlik', 'Enerji verimliliği analizi', 1),
('danismanlik', 'Sistem optimizasyonu', 2),
('danismanlik', 'Maliyet hesaplamaları', 3),
('danismanlik', 'Fizibilite raporları', 4),
('guvenlik', 'Topraklama ölçümü', 1),
('guvenlik', 'Paratoner kurulumu', 2),
('guvenlik', 'Kaçak akım rölesi', 3),
('guvenlik', 'Güvenlik denetimi', 4);

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, customer_location, rating, comment, service_type, is_featured, is_approved, testimonial_date) VALUES
('Ahmet Yılmaz', 'Kadıköy, İstanbul', 5, 'Fabrikamızın elektrik altyapısını tamamen yenilediler. İsmail Bey''in mühendislik yaklaşımı ve detaycılığı gerçekten etkileyiciydi.', 'Endüstriyel Tesisat', true, true, '2024-01-15'),
('Fatma Demir', 'Beşiktaş, İstanbul', 5, 'Gece yarısı elektrik arızası yaşadık ve acil destek hattını aradık. 30 dakika içinde geldiler.', 'Acil Arıza Müdahale', true, true, '2024-02-20'),
('Mehmet Kaya', 'Şişli, İstanbul', 5, 'Yeni açtığımız mağaza için elektrik projesini hazırladılar. Her şey mükemmel hesaplanmış.', 'Proje Çizimi', true, true, '2024-03-10');

COMMIT;
