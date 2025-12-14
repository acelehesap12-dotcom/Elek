// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Service Types
export interface ElectricService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  estimatedDuration: string;
  icon: string;
  features: string[];
}

export type ServiceCategory =
  | "tesisat"
  | "proje"
  | "bakim"
  | "ariza"
  | "danismanlik";

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: string;
}

// Booking Types
export interface BookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  district: IstanbulDistrict;
  serviceId: string;
  problemDescription: string;
  urgencyLevel: UrgencyLevel;
  preferredDate: string;
  preferredTimeSlot: TimeSlot;
  photos?: string[];
  additionalNotes?: string;
}

export interface BookingResponse {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  estimatedArrival?: string;
  assignedTechnician?: string;
  createdAt: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type UrgencyLevel = "normal" | "urgent" | "emergency";

export type TimeSlot =
  | "morning"
  | "afternoon"
  | "evening";

export type IstanbulDistrict =
  | "Adalar"
  | "Arnavutköy"
  | "Ataşehir"
  | "Avcılar"
  | "Bağcılar"
  | "Bahçelievler"
  | "Bakırköy"
  | "Başakşehir"
  | "Bayrampaşa"
  | "Beşiktaş"
  | "Beykoz"
  | "Beylikdüzü"
  | "Beyoğlu"
  | "Büyükçekmece"
  | "Çatalca"
  | "Çekmeköy"
  | "Esenler"
  | "Esenyurt"
  | "Eyüpsultan"
  | "Fatih"
  | "Gaziosmanpaşa"
  | "Güngören"
  | "Kadıköy"
  | "Kağıthane"
  | "Kartal"
  | "Küçükçekmece"
  | "Maltepe"
  | "Pendik"
  | "Sancaktepe"
  | "Sarıyer"
  | "Şile"
  | "Silivri"
  | "Şişli"
  | "Sultanbeyli"
  | "Sultangazi"
  | "Tuzla"
  | "Ümraniye"
  | "Üsküdar"
  | "Zeytinburnu";

// Load Calculation Types (from Rust Engine)
export interface LoadCalculationRequest {
  devices: ElectricDevice[];
  circuitType: CircuitType;
  voltageLevel: number;
  safetyFactor: number;
}

export interface ElectricDevice {
  name: string;
  powerWatts: number;
  quantity: number;
  usageHoursPerDay: number;
  powerFactor: number;
}

export type CircuitType = "single_phase" | "three_phase";

export interface LoadCalculationResult {
  totalLoadKw: number;
  totalCurrentAmps: number;
  recommendedBreakerAmps: number;
  recommendedCableSection: number;
  monthlyConsumptionKwh: number;
  estimatedMonthlyCost: number;
  safetyStatus: SafetyStatus;
  warnings: string[];
  recommendations: string[];
}

export type SafetyStatus = "safe" | "warning" | "danger";

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  comment: string;
  serviceType: string;
  date: string;
  avatar?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// Form Step Types
export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Animation Variants
export interface AnimationVariant {
  initial: object;
  animate: object;
  exit?: object;
  transition?: object;
}

// Stats Types
export interface Stat {
  id: string;
  label: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  icon?: string;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Price Quote Types
export interface PriceQuote {
  basePrice: number;
  laborCost: number;
  materialsCost: number;
  urgencyMultiplier: number;
  distanceMultiplier: number;
  totalPrice: number;
  currency: "TRY";
  validUntil: string;
}
