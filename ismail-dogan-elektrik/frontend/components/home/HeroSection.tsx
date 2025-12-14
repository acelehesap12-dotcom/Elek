"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ElectricCircuitCanvas from "./ElectricCircuitCanvas";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const stats = [
    { value: "15+", label: "Yıllık Deneyim" },
    { value: "2500+", label: "Tamamlanan Proje" },
    { value: "99%", label: "Müşteri Memnuniyeti" },
    { value: "24/7", label: "Acil Destek" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-cyber-dark-950" />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Electric Circuit Canvas Animation */}
      <div className="absolute inset-0">
        <ElectricCircuitCanvas />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />

      {/* Radial Gradient Spotlight */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-alert-500/5 rounded-full blur-3xl" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue-500/10 border border-neon-blue-500/30 text-neon-blue-400 text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>İstanbul&apos;un Güvenilir Elektrik Uzmanı</span>
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
          >
            <span className="text-white">Elektrik </span>
            <span className="gradient-text">Mühendisliğinde</span>
            <br />
            <span className="text-white">Profesyonel </span>
            <span className="gradient-text-amber">Çözümler</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Elektrik tesisat projeleri, saha görevleri ve teknik danışmanlık
            hizmetlerinde <span className="text-neon-blue-400">uzman mühendislik</span> desteği.
            Güvenli, verimli ve standartlara uygun çözümler.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/randevu">
              <Button
                size="lg"
                rightIcon={<Calendar className="w-5 h-5" />}
                glowEffect
              >
                Randevu Al
              </Button>
            </Link>
            <Link href="/iletisim">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Phone className="w-5 h-5" />}
              >
                Hemen Ara
              </Button>
            </Link>
            <Link href="/hizmetler">
              <Button
                variant="ghost"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Hizmetleri İncele
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statsVariants}
                custom={index}
                className="relative p-6 rounded-lg bg-cyber-dark-900/40 backdrop-blur-sm border border-cyber-dark-700/50 hover:border-neon-blue-500/30 transition-colors duration-300 group"
              >
                <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2 group-hover:text-glow transition-all duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">Keşfet</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-neon-blue-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-neon-blue-500/20 rounded-tl-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-amber-alert-500/20 rounded-br-3xl" />
    </section>
  );
}
