'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-white mb-4">
          Bir Hata Oluştu
        </h1>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Üzgünüz, beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya
          ana sayfaya dönün.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="cyber-button flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-neon-blue-500/50 text-neon-blue-400 hover:bg-neon-blue-500/10 transition-all"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
