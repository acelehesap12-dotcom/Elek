"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: "1",
    customerName: "Ahmet Yılmaz",
    customerLocation: "Kadıköy, İstanbul",
    rating: 5,
    comment:
      "Fabrikamızın elektrik altyapısını tamamen yenilediler. İsmail Bey'in mühendislik yaklaşımı ve detaycılığı gerçekten etkileyiciydi. Proje zamanında ve bütçe dahilinde tamamlandı.",
    serviceType: "Endüstriyel Tesisat",
    date: "2024-01-15",
  },
  {
    id: "2",
    customerName: "Fatma Demir",
    customerLocation: "Beşiktaş, İstanbul",
    rating: 5,
    comment:
      "Gece yarısı elektrik arızası yaşadık ve acil destek hattını aradık. 30 dakika içinde geldiler ve sorunu hızlıca çözdüler. Profesyonel ve güvenilir bir ekip.",
    serviceType: "Acil Arıza Müdahale",
    date: "2024-02-20",
  },
  {
    id: "3",
    customerName: "Mehmet Kaya",
    customerLocation: "Şişli, İstanbul",
    rating: 5,
    comment:
      "Yeni açtığımız mağaza için elektrik projesini hazırladılar. Her şey mükemmel hesaplanmış, onay süreci sorunsuz tamamlandı. Kesinlikle tavsiye ediyorum.",
    serviceType: "Proje Çizimi",
    date: "2024-03-10",
  },
  {
    id: "4",
    customerName: "Ayşe Özkan",
    customerLocation: "Ataşehir, İstanbul",
    rating: 5,
    comment:
      "Evimizin tüm elektrik tesisatını yeniledik. Eski binada ciddi sorunlar vardı ama ekip tüm zorlukları aştı. Şimdi güvenle yaşıyoruz, teşekkürler!",
    serviceType: "Konut Tesisatı",
    date: "2024-04-05",
  },
  {
    id: "5",
    customerName: "Can Arslan",
    customerLocation: "Üsküdar, İstanbul",
    rating: 5,
    comment:
      "Ofis binamızın enerji verimliliği danışmanlığını aldık. Yapılan optimizasyonlar sayesinde elektrik faturamız %40 düştü. Mühendislik bilgisi üst düzey.",
    serviceType: "Teknik Danışmanlık",
    date: "2024-05-18",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-24 bg-gradient-to-b from-cyber-dark-950 to-cyber-dark-900 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-alert-500/5 rounded-full blur-3xl" />

      {/* Grid Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-10" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-neon-blue-400 text-sm font-display font-semibold tracking-widest uppercase mb-4">
            Müşteri Yorumları
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Müşterilerimiz{" "}
            <span className="gradient-text">Ne Diyor?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Yıllardır birlikte çalıştığımız müşterilerimizden gelen
            değerlendirmeler
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial Card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative p-8 md:p-12 rounded-2xl bg-cyber-dark-900/80 backdrop-blur-xl border border-cyber-dark-700/50"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-neon-blue-500/20">
                  <Quote className="w-16 h-16" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < currentTestimonial.rating
                          ? "text-amber-alert-400 fill-amber-alert-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <blockquote className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 font-light italic">
                  &ldquo;{currentTestimonial.comment}&rdquo;
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-blue-500 to-neon-blue-700 flex items-center justify-center text-white font-bold text-lg">
                      {currentTestimonial.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white">
                        {currentTestimonial.customerName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {currentTestimonial.customerLocation}
                      </div>
                    </div>
                  </div>

                  {/* Service Badge */}
                  <div className="px-4 py-2 rounded-full bg-neon-blue-500/10 border border-neon-blue-500/30 text-neon-blue-400 text-sm">
                    {currentTestimonial.serviceType}
                  </div>
                </div>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-neon-blue-500 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 rounded-full bg-cyber-dark-800 border border-cyber-dark-600 text-gray-400 hover:text-neon-blue-400 hover:border-neon-blue-500/50 transition-all duration-300 flex items-center justify-center group"
              aria-label="Önceki yorum"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 rounded-full bg-cyber-dark-800 border border-cyber-dark-600 text-gray-400 hover:text-neon-blue-400 hover:border-neon-blue-500/50 transition-all duration-300 flex items-center justify-center group"
              aria-label="Sonraki yorum"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-neon-blue-500"
                    : "bg-cyber-dark-600 hover:bg-cyber-dark-500"
                }`}
                aria-label={`${index + 1}. yoruma git`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <Star className="w-5 h-5 text-amber-alert-400 fill-amber-alert-400" />
            <span>4.9/5 Ortalama Puan</span>
          </div>
          <div className="w-px h-6 bg-cyber-dark-700 hidden sm:block" />
          <div className="text-gray-400">500+ Olumlu Değerlendirme</div>
          <div className="w-px h-6 bg-cyber-dark-700 hidden sm:block" />
          <div className="text-gray-400">Google & Sosyal Medya Onaylı</div>
        </motion.div>
      </div>
    </section>
  );
}
