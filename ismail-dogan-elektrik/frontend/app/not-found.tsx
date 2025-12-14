import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[150px] md:text-[200px] font-display font-bold text-cyber-dark-800 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-8xl font-display font-bold gradient-text">
              404
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          Sayfa Bulunamadı
        </h1>

        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya
          dönebilir veya aşağıdaki bağlantıları kullanabilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/" className="cyber-button flex items-center gap-2">
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>

          <Link
            href="/hizmetler"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-neon-blue-500/50 text-neon-blue-400 hover:bg-neon-blue-500/10 transition-all"
          >
            <Search className="w-4 h-4" />
            Hizmetleri İncele
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <Link
            href="/randevu"
            className="p-4 rounded-lg bg-cyber-dark-900/60 border border-cyber-dark-700/50 hover:border-neon-blue-500/30 transition-all text-gray-400 hover:text-white"
          >
            Randevu Al
          </Link>
          <Link
            href="/hizmetler"
            className="p-4 rounded-lg bg-cyber-dark-900/60 border border-cyber-dark-700/50 hover:border-neon-blue-500/30 transition-all text-gray-400 hover:text-white"
          >
            Hizmetler
          </Link>
          <Link
            href="/hakkimizda"
            className="p-4 rounded-lg bg-cyber-dark-900/60 border border-cyber-dark-700/50 hover:border-neon-blue-500/30 transition-all text-gray-400 hover:text-white"
          >
            Hakkımızda
          </Link>
          <Link
            href="/iletisim"
            className="p-4 rounded-lg bg-cyber-dark-900/60 border border-cyber-dark-700/50 hover:border-neon-blue-500/30 transition-all text-gray-400 hover:text-white"
          >
            İletişim
          </Link>
        </div>
      </div>
    </div>
  );
}
