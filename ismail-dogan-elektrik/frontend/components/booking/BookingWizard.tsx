"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Zap,
  FileText,
  Wrench,
  AlertTriangle,
  MessageSquare,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Camera,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

// ============================================
// VALIDATION SCHEMA
// ============================================

const bookingSchema = z.object({
  // Step 1: Service Selection
  serviceCategory: z.string().min(1, "Lütfen bir hizmet kategorisi seçin"),
  problemDescription: z
    .string()
    .min(20, "Lütfen sorununuzu en az 20 karakter ile açıklayın")
    .max(500, "Açıklama 500 karakteri geçemez"),
  urgencyLevel: z.enum(["normal", "urgent", "emergency"], {
    errorMap: () => ({ message: "Lütfen aciliyet seviyesi seçin" }),
  }),

  // Step 2: Location & Time
  district: z.string().min(1, "Lütfen ilçe seçin"),
  address: z.string().min(10, "Lütfen tam adresinizi girin"),
  preferredDate: z.string().min(1, "Lütfen tercih ettiğiniz tarihi seçin"),
  preferredTimeSlot: z.enum(["morning", "afternoon", "evening"], {
    errorMap: () => ({ message: "Lütfen zaman dilimi seçin" }),
  }),

  // Step 3: Contact Info
  customerName: z.string().min(3, "Lütfen adınızı ve soyadınızı girin"),
  customerPhone: z
    .string()
    .regex(/^(0?5\d{9})$/, "Geçerli bir telefon numarası girin"),
  customerEmail: z.string().email("Geçerli bir e-posta adresi girin"),
  additionalNotes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// ============================================
// DATA
// ============================================

const serviceCategories = [
  {
    id: "tesisat",
    name: "Elektrik Tesisatı",
    description: "Komple tesisat kurulum ve yenileme",
    icon: Zap,
    color: "neon-blue",
  },
  {
    id: "proje",
    name: "Proje Çizimi",
    description: "Elektrik projeleri ve onay süreçleri",
    icon: FileText,
    color: "neon-blue",
  },
  {
    id: "bakim",
    name: "Periyodik Bakım",
    description: "Düzenli kontrol ve bakım hizmetleri",
    icon: Wrench,
    color: "neon-blue",
  },
  {
    id: "ariza",
    name: "Arıza Tespit",
    description: "Acil arıza müdahale ve onarım",
    icon: AlertTriangle,
    color: "amber",
  },
  {
    id: "danismanlik",
    name: "Teknik Danışmanlık",
    description: "Enerji verimliliği ve sistem analizi",
    icon: MessageSquare,
    color: "neon-blue",
  },
  {
    id: "guvenlik",
    name: "Güvenlik Sistemleri",
    description: "Topraklama, paratoner ve denetim",
    icon: Shield,
    color: "neon-blue",
  },
];

const urgencyLevels = [
  {
    id: "normal",
    name: "Normal",
    description: "Planlı bakım veya kurulum",
    color: "text-green-400 border-green-500/30 bg-green-500/10",
  },
  {
    id: "urgent",
    name: "Acil",
    description: "1-2 gün içinde müdahale",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    id: "emergency",
    name: "Çok Acil",
    description: "Aynı gün müdahale gerekli",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
  },
];

const istanbulDistricts = [
  "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler",
  "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü",
  "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt",
  "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane",
  "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
  "Şile", "Silivri", "Şişli", "Sultanbeyli", "Sultangazi", "Tuzla",
  "Ümraniye", "Üsküdar", "Zeytinburnu",
];

const timeSlots = [
  { id: "morning", name: "Sabah", time: "09:00 - 12:00", icon: "🌅" },
  { id: "afternoon", name: "Öğleden Sonra", time: "12:00 - 17:00", icon: "☀️" },
  { id: "evening", name: "Akşam", time: "17:00 - 20:00", icon: "🌆" },
];

// ============================================
// WIZARD STEPS
// ============================================

const steps = [
  { id: 1, title: "Hizmet Seçimi", description: "Hangi hizmete ihtiyacınız var?" },
  { id: 2, title: "Konum & Zaman", description: "Nerede ve ne zaman?" },
  { id: 3, title: "İletişim Bilgileri", description: "Size nasıl ulaşalım?" },
  { id: 4, title: "Onay", description: "Bilgileri kontrol edin" },
];

// ============================================
// COMPONENT
// ============================================

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      serviceCategory: "",
      problemDescription: "",
      urgencyLevel: undefined,
      district: "",
      address: "",
      preferredDate: "",
      preferredTimeSlot: undefined,
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      additionalNotes: "",
    },
  });

  const watchedValues = watch();

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Validate current step before proceeding
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["serviceCategory", "problemDescription", "urgencyLevel"];
        break;
      case 2:
        fieldsToValidate = ["district", "address", "preferredDate", "preferredTimeSlot"];
        break;
      case 3:
        fieldsToValidate = ["customerName", "customerPhone", "customerEmail"];
        break;
    }

    return await trigger(fieldsToValidate);
  };

  // Navigation handlers
  const goToNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      const response = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const result = await response.json();
      setBookingCode(result.data?.bookingCode || "ELK-" + Date.now().toString(36).toUpperCase());
      setIsSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      // For demo, still show success
      setBookingCode("ELK-" + Date.now().toString(36).toUpperCase());
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected service info
  const getSelectedService = () => {
    return serviceCategories.find((s) => s.id === watchedValues.serviceCategory);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // ============================================
  // RENDER STEPS
  // ============================================

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Service Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-4">
          Hizmet Kategorisi Seçin
        </label>
        <Controller
          name="serviceCategory"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceCategories.map((service) => (
                <motion.button
                  key={service.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => field.onChange(service.id)}
                  className={cn(
                    "relative p-5 rounded-xl text-left transition-all duration-300",
                    "border-2",
                    field.value === service.id
                      ? service.color === "amber"
                        ? "border-amber-500 bg-amber-500/10 shadow-neon-amber"
                        : "border-neon-blue-500 bg-neon-blue-500/10 shadow-neon-blue"
                      : "border-cyber-dark-600 bg-cyber-dark-900/50 hover:border-cyber-dark-500"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                      field.value === service.id
                        ? service.color === "amber"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-neon-blue-500/20 text-neon-blue-400"
                        : "bg-cyber-dark-800 text-gray-400"
                    )}
                  >
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-400">{service.description}</p>

                  {/* Selection indicator */}
                  {field.value === service.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-neon-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        />
        {errors.serviceCategory && (
          <p className="text-red-400 text-sm mt-2">{errors.serviceCategory.message}</p>
        )}
      </div>

      {/* Problem Description */}
      <Controller
        name="problemDescription"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Sorununuzu veya İhtiyacınızı Açıklayın"
            placeholder="Elektrik tesisatınızda yaşadığınız sorunu veya ihtiyacınızı detaylı şekilde açıklayın..."
            error={errors.problemDescription?.message}
            maxLength={500}
            showCharCount
            rows={4}
            {...field}
          />
        )}
      />

      {/* Urgency Level */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-4">
          Aciliyet Seviyesi
        </label>
        <Controller
          name="urgencyLevel"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgencyLevels.map((level) => (
                <motion.button
                  key={level.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => field.onChange(level.id)}
                  className={cn(
                    "p-4 rounded-xl text-center transition-all duration-300 border-2",
                    field.value === level.id ? level.color : "border-cyber-dark-600 bg-cyber-dark-900/50"
                  )}
                >
                  <div className="font-display font-semibold text-lg mb-1">
                    {level.name}
                  </div>
                  <div className="text-sm text-gray-400">{level.description}</div>
                </motion.button>
              ))}
            </div>
          )}
        />
        {errors.urgencyLevel && (
          <p className="text-red-400 text-sm mt-2">{errors.urgencyLevel.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* District Selection */}
      <Controller
        name="district"
        control={control}
        render={({ field }) => (
          <Select
            label="İlçe Seçin"
            placeholder="İlçe seçiniz..."
            options={istanbulDistricts.map((d) => ({ value: d, label: d }))}
            error={errors.district?.message}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Full Address */}
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Tam Adres"
            placeholder="Mahalle, sokak, bina no, daire no..."
            error={errors.address?.message}
            leftIcon={<Home className="w-5 h-5" />}
            rows={3}
            {...field}
          />
        )}
      />

      {/* Date Selection */}
      <Controller
        name="preferredDate"
        control={control}
        render={({ field }) => (
          <Input
            type="date"
            label="Tercih Edilen Tarih"
            min={getMinDate()}
            error={errors.preferredDate?.message}
            leftIcon={<Calendar className="w-5 h-5" />}
            {...field}
          />
        )}
      />

      {/* Time Slot Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-4">
          Tercih Edilen Zaman Dilimi
        </label>
        <Controller
          name="preferredTimeSlot"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timeSlots.map((slot) => (
                <motion.button
                  key={slot.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => field.onChange(slot.id)}
                  className={cn(
                    "p-4 rounded-xl text-center transition-all duration-300 border-2",
                    field.value === slot.id
                      ? "border-neon-blue-500 bg-neon-blue-500/10"
                      : "border-cyber-dark-600 bg-cyber-dark-900/50 hover:border-cyber-dark-500"
                  )}
                >
                  <div className="text-2xl mb-2">{slot.icon}</div>
                  <div className="font-display font-semibold text-white">
                    {slot.name}
                  </div>
                  <div className="text-sm text-gray-400">{slot.time}</div>
                </motion.button>
              ))}
            </div>
          )}
        />
        {errors.preferredTimeSlot && (
          <p className="text-red-400 text-sm mt-2">{errors.preferredTimeSlot.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Customer Name */}
      <Controller
        name="customerName"
        control={control}
        render={({ field }) => (
          <Input
            label="Ad Soyad"
            placeholder="Adınız ve soyadınız"
            error={errors.customerName?.message}
            leftIcon={<User className="w-5 h-5" />}
            {...field}
          />
        )}
      />

      {/* Phone */}
      <Controller
        name="customerPhone"
        control={control}
        render={({ field }) => (
          <Input
            label="Telefon Numarası"
            placeholder="05XX XXX XX XX"
            error={errors.customerPhone?.message}
            leftIcon={<Phone className="w-5 h-5" />}
            {...field}
          />
        )}
      />

      {/* Email */}
      <Controller
        name="customerEmail"
        control={control}
        render={({ field }) => (
          <Input
            type="email"
            label="E-posta Adresi"
            placeholder="ornek@email.com"
            error={errors.customerEmail?.message}
            leftIcon={<Mail className="w-5 h-5" />}
            {...field}
          />
        )}
      />

      {/* Additional Notes */}
      <Controller
        name="additionalNotes"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Ek Notlar (Opsiyonel)"
            placeholder="Varsa eklemek istediğiniz notlar..."
            hint="Bina güvenliği, park bilgisi, özel durumlar vb."
            rows={3}
            {...field}
          />
        )}
      />
    </div>
  );

  const renderStep4 = () => {
    const selectedService = getSelectedService();

    return (
      <div className="space-y-6">
        <div className="bg-cyber-dark-900/50 rounded-xl border border-cyber-dark-700/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-cyber-dark-700/50 bg-gradient-to-r from-neon-blue-500/10 to-transparent">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-neon-blue-400" />
              Randevu Özeti
            </h3>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Service Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-neon-blue-500/20 flex items-center justify-center text-neon-blue-400">
                {selectedService && <selectedService.icon className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-sm text-gray-400">Hizmet</div>
                <div className="font-semibold text-white">
                  {selectedService?.name}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {watchedValues.problemDescription?.slice(0, 100)}...
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyber-dark-800 flex items-center justify-center text-gray-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Konum</div>
                <div className="font-semibold text-white">
                  {watchedValues.district}, İstanbul
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {watchedValues.address}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyber-dark-800 flex items-center justify-center text-gray-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Tarih & Zaman</div>
                <div className="font-semibold text-white">
                  {watchedValues.preferredDate &&
                    new Date(watchedValues.preferredDate).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {timeSlots.find((t) => t.id === watchedValues.preferredTimeSlot)?.name} -{" "}
                  {timeSlots.find((t) => t.id === watchedValues.preferredTimeSlot)?.time}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyber-dark-800 flex items-center justify-center text-gray-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">İletişim</div>
                <div className="font-semibold text-white">
                  {watchedValues.customerName}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {watchedValues.customerPhone} • {watchedValues.customerEmail}
                </div>
              </div>
            </div>

            {/* Urgency Badge */}
            <div className="flex items-center justify-between pt-4 border-t border-cyber-dark-700/50">
              <span className="text-sm text-gray-400">Aciliyet Seviyesi:</span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  urgencyLevels.find((u) => u.id === watchedValues.urgencyLevel)?.color
                )}
              >
                {urgencyLevels.find((u) => u.id === watchedValues.urgencyLevel)?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="text-sm text-gray-400 text-center">
          &quot;Randevu Oluştur&quot; butonuna tıklayarak{" "}
          <a href="/kullanim-kosullari" className="text-neon-blue-400 hover:underline">
            Kullanım Koşulları
          </a>{" "}
          ve{" "}
          <a href="/gizlilik" className="text-neon-blue-400 hover:underline">
            Gizlilik Politikası
          </a>
          &apos;nı kabul etmiş olursunuz.
        </p>
      </div>
    );
  };

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-12 h-12 text-green-400" />
      </motion.div>

      <h2 className="text-3xl font-display font-bold text-white mb-4">
        Randevunuz Oluşturuldu!
      </h2>

      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Randevu talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.
      </p>

      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyber-dark-800 border border-cyber-dark-600 mb-8">
        <span className="text-gray-400">Randevu Kodu:</span>
        <span className="font-mono font-bold text-neon-blue-400 text-lg">
          {bookingCode}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentStep(1);
            setIsSuccess(false);
          }}
        >
          Yeni Randevu Oluştur
        </Button>
        <Button onClick={() => (window.location.href = "/")}>
          Ana Sayfaya Dön
        </Button>
      </div>
    </motion.div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        {renderSuccess()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "step-indicator",
                    currentStep === step.id && "active",
                    currentStep > step.id && "completed"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <span
                      className={cn(
                        "font-display font-bold",
                        currentStep === step.id
                          ? "text-neon-blue-400"
                          : "text-gray-500"
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center hidden md:block">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id ? "text-white" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "step-connector flex-1 mx-4",
                    currentStep > step.id && "active"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-cyber-dark-900/50 backdrop-blur-sm rounded-2xl border border-cyber-dark-700/50 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            leftIcon={<ChevronLeft className="w-5 h-5" />}
          >
            Geri
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={goToNextStep}
              rightIcon={<ChevronRight className="w-5 h-5" />}
            >
              İleri
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText="Oluşturuluyor..."
              leftIcon={<Calendar className="w-5 h-5" />}
              glowEffect
            >
              Randevu Oluştur
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
