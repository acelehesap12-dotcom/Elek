"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  hizmetler: [
    { name: "Elektrik Tesisatı", href: "/hizmetler#tesisat" },
    { name: "Proje Çizimi", href: "/hizmetler#proje" },
    { name: "Periyodik Bakım", href: "/hizmetler#bakim" },
    { name: "Arıza Tespit", href: "/hizmetler#ariza" },
    { name: "Teknik Danışmanlık", href: "/hizmetler#danismanlik" },
    { name: "Güvenlik Sistemleri", href: "/hizmetler#guvenlik" },
  ],
  kurumsal: [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "Referanslar", href: "/referanslar" },
    { name: "Blog", href: "/blog" },
    { name: "Kariyer", href: "/kariyer" },
    { name: "Sıkça Sorulan Sorular", href: "/sss" },
  ],
  yasal: [
    { name: "Gizlilik Politikası", href: "/gizlilik" },
    { name: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    { name: "KVKK", href: "/kvkk" },
    { name: "Çerez Politikası", href: "/cerez" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-cyber-dark-950 border-t border-cyber-dark-800/50">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue-500/50 to-transparent" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-blue-500 to-neon-blue-700 flex items-center justify-center shadow-neon-blue">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-xl">
                  İsmail Doğan
                </span>
                <span className="text-sm text-neon-blue-400">
                  Elektrik Mühendisliği
                </span>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              İstanbul genelinde profesyonel elektrik mühendisliği hizmetleri.
              Güvenli, verimli ve standartlara uygun çözümler için yanınızdayız.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+905551234567"
                className="flex items-center gap-3 text-gray-400 hover:text-neon-blue-400 transition-colors group"
              >
                <Phone className="w-5 h-5 group-hover:text-neon-blue-400" />
                <span>0555 123 45 67</span>
              </a>
              <a
                href="mailto:info@ismaildogan.com"
                className="flex items-center gap-3 text-gray-400 hover:text-neon-blue-400 transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:text-neon-blue-400" />
                <span>info@ismaildogan.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Kadıköy, İstanbul, Türkiye</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>Pazartesi - Cumartesi: 08:00 - 20:00</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-cyber-dark-800 border border-cyber-dark-700 flex items-center justify-center text-gray-400 hover:text-neon-blue-400 hover:border-neon-blue-500/50 hover:bg-cyber-dark-700 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">
              Hizmetler
            </h3>
            <ul className="space-y-3">
              {footerLinks.hizmetler.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">
              Kurumsal
            </h3>
            <ul className="space-y-3">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">
              Yasal
            </h3>
            <ul className="space-y-3">
              {footerLinks.yasal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Emergency CTA */}
            <div className="mt-8 p-4 rounded-lg bg-amber-alert-500/10 border border-amber-alert-500/30">
              <div className="flex items-center gap-2 text-amber-alert-400 font-semibold mb-2">
                <Zap className="w-5 h-5" />
                <span>Acil Durum?</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                7/24 acil elektrik arıza hattımız
              </p>
              <a
                href="tel:+905551234568"
                className="text-amber-alert-400 font-bold text-lg hover:text-amber-alert-300 transition-colors"
              >
                0555 123 45 68
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cyber-dark-800/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} İsmail Doğan Elektrik Mühendisliği.
              Tüm hakları saklıdır.
            </p>

            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500">
                Tasarım & Geliştirme: Cyber-Industrial Platform
              </span>

              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-lg bg-cyber-dark-800 border border-cyber-dark-700 flex items-center justify-center text-gray-400 hover:text-neon-blue-400 hover:border-neon-blue-500/50 transition-all duration-300"
                aria-label="Yukarı çık"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-alert-500/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
