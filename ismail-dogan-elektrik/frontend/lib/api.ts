import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import type {
  BookingRequest,
  BookingResponse,
  ContactFormData,
  ElectricService,
  LoadCalculationRequest,
  LoadCalculationResult,
  PriceQuote,
  Testimonial,
} from "@/types";

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create Axios Instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 400:
          console.error("Bad Request:", error.response.data);
          break;
        case 401:
          console.error("Unauthorized access");
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 422:
          console.error("Validation error:", error.response.data);
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error(`HTTP Error ${status}`);
      }
    } else if (error.request) {
      // Request made but no response
      console.error("Network error - no response received");
    } else {
      // Error in request configuration
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// SERVICES API
// ============================================

export async function getServices(): Promise<ElectricService[]> {
  const response = await apiClient.get<{ items: ElectricService[]; total: number }>(
    "/api/v1/services"
  );
  return response.data.items;
}

export async function getServiceById(id: string): Promise<ElectricService> {
  const response = await apiClient.get<ElectricService>(
    `/api/v1/services/${id}`
  );
  return response.data;
}

export async function getServicesByCategory(
  category: string
): Promise<ElectricService[]> {
  const response = await apiClient.get<{ items: ElectricService[]; total: number }>(
    `/api/v1/services/category/${category}`
  );
  return response.data.items;
}

// ============================================
// BOOKING API
// ============================================

export async function createBooking(
  data: BookingRequest
): Promise<BookingResponse> {
  const response = await apiClient.post<BookingResponse>(
    "/api/v1/bookings",
    data
  );
  return response.data;
}

export async function getBookingByCode(code: string): Promise<BookingResponse> {
  const response = await apiClient.get<BookingResponse>(
    `/api/v1/bookings/${code}`
  );
  return response.data;
}

export async function cancelBooking(
  code: string
): Promise<{ success: boolean }> {
  const response = await apiClient.delete<{ success: boolean }>(
    `/api/v1/bookings/${code}`
  );
  return response.data;
}

export async function getAvailableTimeSlots(
  date: string,
  district: string
): Promise<string[]> {
  const response = await apiClient.get<{ slots: string[] }>(
    "/api/v1/bookings/available-slots",
    {
      params: { date, district },
    }
  );
  return response.data.slots;
}

// ============================================
// PRICE QUOTE API
// ============================================

export async function getPriceQuote(
  serviceId: string,
  district: string,
  urgency: string
): Promise<PriceQuote> {
  const response = await apiClient.post<PriceQuote>(
    "/api/v1/quotes",
    {
      serviceId,
      district,
      urgency,
    }
  );
  return response.data;
}

// ============================================
// LOAD CALCULATION API (Rust Engine)
// ============================================

export async function calculateLoad(
  data: LoadCalculationRequest
): Promise<LoadCalculationResult> {
  const response = await apiClient.post<LoadCalculationResult>(
    "/api/v1/calculations/load",
    data
  );
  return response.data;
}

// ============================================
// CONTACT API
// ============================================

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    "/api/v1/contact", 
    data
  );
  return response.data;
}

// ============================================
// TESTIMONIALS API
// ============================================

export async function getTestimonials(): Promise<Testimonial[]> {
  const response = await apiClient.get<Testimonial[]>(
    "/api/v1/testimonials"
  );
  return response.data;
}

// ============================================
// HEALTH CHECK
// ============================================

export async function healthCheck(): Promise<{
  status: string;
  version: string;
}> {
  const response = await apiClient.get<{ status: string; version: string }>(
    "/health"
  );
  return response.data;
}

// Export API client for custom requests
export { apiClient };

// Default export
const api = {
  services: {
    getAll: getServices,
    getById: getServiceById,
    getByCategory: getServicesByCategory,
  },
  bookings: {
    create: createBooking,
    getByCode: getBookingByCode,
    cancel: cancelBooking,
    getAvailableSlots: getAvailableTimeSlots,
  },
  quotes: {
    get: getPriceQuote,
  },
  calculations: {
    load: calculateLoad,
  },
  contact: {
    submit: submitContactForm,
  },
  testimonials: {
    getAll: getTestimonials,
  },
  health: healthCheck,
};

export default api;
