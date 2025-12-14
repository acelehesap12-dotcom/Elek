"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  FileText,
  Wrench,
  AlertTriangle,
  MessageSquare,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/ui/Card";

const services = [
  {
    id: "tesisat",
    title: "Elektrik Tesisatı",
    description:
      "Konut, işyeri ve endüstriyel tesislerde tam kapsamlı elektrik tesisat kurulumu ve yenileme hizmetleri.",
    icon: Zap,
    accent: "blue" as const,
    features: ["Komple tesisat", "Pano montajı", "Kablo çekimi", "Topraklama"],
  },
  {
    id: "proje",
    title: "Proje Çizimi",
    description:
      "Mühendislik standartlarına uygun elektrik proje çizimi, hesaplamaları ve onay süreçleri.",
    icon: FileText,
    accent: "blue" as const,
    features: [
      "Tek hat şeması",
      "Aydınlatma projesi",
      "Kuvvet projesi",
      "Yük hesabı",
    ],
  },
  {
    id: "bakim",
    title: "Periyodik Bakım",
    description:
      "Elektrik sistemlerinizin güvenli ve verimli çalışması için düzenli bakım ve kontrol hizmetleri.",
    icon: Wrench,
    accent: "blue" as const,
    features: [
      "Termal görüntüleme",
      "Yalıtım testi",
      "Pano bakımı",
      "Rapor hazırlama",
    ],
  },
  {
    id: "ariza",
    title: "Arıza Tespit",
    description:
      "7/24 acil arıza müdahale, profesyonel tespit ekipmanları ile hızlı ve kalıcı çözümler.",
    icon: AlertTriangle,
    accent: "amber" as const,
    features: [
      "Acil müdahale",
      "Kaçak tespit",
      "Kısa devre",
      "Kesinti analizi",
    ],
  },
  {
    id: "danismanlik",
    title: "Teknik Danışmanlık",
    description:
      "Elektrik sistemleri, enerji verimliliği ve yatırım planlaması konularında uzman danışmanlık.",
    icon: MessageSquare,
    accent: "blue" as const,
    features: [
      "Enerji analizi",
      "Sistem optimizasyonu",
      "Maliyet hesabı",
      "Fizibilite",
    ],
  },
  {
    id: "guvenlik",
    title: "Güvenlik Sistemleri",
    description:
      "Elektriksel güvenlik denetimleri, topraklama ölçümleri ve paratoner sistemleri kurulumu.",
    icon: Shield,
    accent: "blue" as const,
    features: [
      "Topraklama ölçümü",
      "Paratoner",
      "Kaçak akım rölesi",
      "Denetim raporu",
    ],
  },
];

export default function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="relative py-24 bg-cyber-dark-950">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-blue-500/50 to-transparent" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-neon-blue-400 text-sm font-display font-semibold tracking-widest uppercase mb-4">
            Hizmetlerimiz
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Profesyonel{" "}
            <span className="gradient-text">Elektrik Hizmetleri</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            İstanbul genelinde konut, ticari ve endüstriyel tesisler için
            kapsamlı elektrik mühendisliği çözümleri sunuyoruz.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Link href={`/hizmetler#${service.id}`}>
                <div className="group relative h-full p-6 rounded-lg bg-cyber-dark-900/60 backdrop-blur-sm border border-cyber-dark-700/50 hover:border-neon-blue-500/50 transition-all duration-500 hover:shadow-card-hover cursor-pointer">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-lg mb-5 flex items-center justify-center bg-cyber-dark-800 border border-cyber-dark-600 group-hover:border-neon-blue-500/50 transition-colors duration-300 ${
                      service.accent === "amber"
                        ? "text-amber-alert-400"
                        : "text-neon-blue-400"
                    }`}
                  >
                    <service.icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-display font-semibold text-white mb-3 group-hover:text-neon-blue-400 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-1 rounded bg-cyber-dark-800 text-gray-400 border border-cyber-dark-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Learn More */}
                  <div className="flex items-center text-neon-blue-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                    <span>Detaylı Bilgi</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/hizmetler"
            className="inline-flex items-center gap-2 text-neon-blue-400 hover:text-neon-blue-300 font-medium transition-colors duration-300"
          >
            <span>Tüm Hizmetlerimizi Görüntüle</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
