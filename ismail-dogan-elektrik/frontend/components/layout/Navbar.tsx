"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Zap,
  Phone,
  ChevronDown,
  Calendar,
  FileText,
  Wrench,
  AlertTriangle,
  MessageSquare,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const navigation = [
  { name: "Ana Sayfa", href: "/" },
  {
    name: "Hizmetler",
    href: "/hizmetler",
    children: [
      { name: "Elektrik Tesisatı", href: "/hizmetler#tesisat", icon: Zap },
      { name: "Proje Çizimi", href: "/hizmetler#proje", icon: FileText },
      { name: "Periyodik Bakım", href: "/hizmetler#bakim", icon: Wrench },
      { name: "Arıza Tespit", href: "/hizmetler#ariza", icon: AlertTriangle },
      { name: "Teknik Danışmanlık", href: "/hizmetler#danismanlik", icon: MessageSquare },
      { name: "Güvenlik Sistemleri", href: "/hizmetler#guvenlik", icon: Shield },
    ],
  },
  { name: "Randevu", href: "/randevu" },
  { name: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-cyber-dark-950/90 backdrop-blur-xl border-b border-cyber-dark-800/50 py-4"
            : "bg-transparent py-6"
        )}
      >
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue-500 to-neon-blue-700 flex items-center justify-center group-hover:shadow-neon-blue transition-shadow duration-300">
                <Zap className="w-6 h-6 text-white" />
                <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-lg leading-tight">
                  İsmail Doğan
                </span>
                <span className="text-xs text-neon-blue-400 font-medium tracking-wide">
                  Elektrik Mühendisliği
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      pathname === item.href
                        ? "text-neon-blue-400 bg-neon-blue-500/10"
                        : "text-gray-300 hover:text-white hover:bg-cyber-dark-800/50"
                    )}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          activeDropdown === item.name && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 py-2 bg-cyber-dark-900/95 backdrop-blur-xl border border-cyber-dark-700/50 rounded-xl shadow-xl"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-neon-blue-400 hover:bg-cyber-dark-800/50 transition-colors duration-200"
                            >
                              {child.icon && (
                                <child.icon className="w-5 h-5 text-neon-blue-500/70" />
                              )}
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+905551234567"
                className="flex items-center gap-2 text-gray-300 hover:text-neon-blue-400 transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">0555 123 45 67</span>
              </a>
              <Link href="/randevu">
                <Button size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
                  Randevu Al
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-cyber-dark-800/50 border border-cyber-dark-700 text-gray-300 hover:text-white hover:border-neon-blue-500/50 transition-colors duration-300"
              aria-label="Menüyü aç/kapat"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-cyber-dark-950/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-cyber-dark-900 border-l border-cyber-dark-800 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyber-dark-800 text-gray-400 hover:text-white transition-colors"
                    aria-label="Menüyü kapat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200",
                          pathname === item.href
                            ? "text-neon-blue-400 bg-neon-blue-500/10"
                            : "text-gray-300 hover:text-white hover:bg-cyber-dark-800"
                        )}
                      >
                        {item.name}
                      </Link>
                      {item.children && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-neon-blue-400 transition-colors"
                            >
                              {child.icon && (
                                <child.icon className="w-4 h-4" />
                              )}
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-cyber-dark-800">
                  <a
                    href="tel:+905551234567"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-neon-blue-400 hover:bg-cyber-dark-800 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>0555 123 45 67</span>
                  </a>
                </div>

                {/* CTA Button */}
                <div className="mt-6">
                  <Link href="/randevu" className="block">
                    <Button
                      fullWidth
                      size="lg"
                      leftIcon={<Calendar className="w-5 h-5" />}
                    >
                      Randevu Al
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
