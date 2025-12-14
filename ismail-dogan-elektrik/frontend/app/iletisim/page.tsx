import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim | İsmail Doğan Elektrik",
  description:
    "İsmail Doğan Elektrik Mühendisliği ile iletişime geçin. Telefon, e-posta veya iletişim formu ile bize ulaşın. 7/24 acil destek hattı.",
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-cyber-dark-950 -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10" />

      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-neon-blue-400 text-sm font-display font-semibold tracking-widest uppercase mb-4">
            İletişim
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Bize <span className="gradient-text">Ulaşın</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Elektrik hizmetleri hakkında sorularınız mı var? Ücretsiz danışmanlık
            için bize ulaşın, size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <a
                href="tel:+905551234567"
                className="group p-6 rounded-xl bg-cyber-dark-900/60 border border-cyber-dark-700/50 hover:border-neon-blue-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-neon-blue-500/20 flex items-center justify-center text-neon-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Telefon</h3>
                <p className="text-neon-blue-400 font-medium">0555 123 45 67</p>
                <p className="text-gray-500 text-sm mt-1">
                  7/24 Acil Hat: 0555 123 45 68
                </p>
              </a>

              {/* Email */}
              <a
                href="mailto:info@ismaildogan.com"
                className="group p-6 rounded-xl bg-cyber-dark-900/60 border border-cyber-dark-700/50 hover:border-neon-blue-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-neon-blue-500/20 flex items-center justify-center text-neon-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">E-posta</h3>
                <p className="text-neon-blue-400 font-medium">
                  info@ismaildogan.com
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  En geç 24 saat içinde dönüş
                </p>
              </a>

              {/* Address */}
              <div className="p-6 rounded-xl bg-cyber-dark-900/60 border border-cyber-dark-700/50">
                <div className="w-12 h-12 rounded-lg bg-neon-blue-500/20 flex items-center justify-center text-neon-blue-400 mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Adres</h3>
                <p className="text-gray-400">
                  Kadıköy, İstanbul
                  <br />
                  Türkiye
                </p>
              </div>

              {/* Hours */}
              <div className="p-6 rounded-xl bg-cyber-dark-900/60 border border-cyber-dark-700/50">
                <div className="w-12 h-12 rounded-lg bg-neon-blue-500/20 flex items-center justify-center text-neon-blue-400 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Çalışma Saatleri</h3>
                <p className="text-gray-400">
                  Pazartesi - Cumartesi
                  <br />
                  08:00 - 20:00
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-cyber-dark-700/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48173.30461040498!2d29.01217747239!3d40.98901844889272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab86f47a5cf09%3A0x4c7feed554b11a82!2zS2FkxLFrw7Z5L8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1702584000000!5m2!1str!2str"
                width="100%"
                height="300"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="İsmail Doğan Elektrik Konum"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-cyber-dark-900/60 backdrop-blur-sm rounded-2xl border border-cyber-dark-700/50 p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              Mesaj Gönderin
            </h2>

            <form className="space-y-6">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="cyber-input"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="cyber-input"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="cyber-input"
                  placeholder="ornek@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Konu
                </label>
                <select id="subject" name="subject" required className="cyber-input">
                  <option value="">Konu seçiniz...</option>
                  <option value="tesisat">Elektrik Tesisatı</option>
                  <option value="proje">Proje Çizimi</option>
                  <option value="bakim">Periyodik Bakım</option>
                  <option value="ariza">Arıza Bildirimi</option>
                  <option value="danismanlik">Teknik Danışmanlık</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="cyber-input resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />
              </div>

              {/* Submit */}
              <button type="submit" className="cyber-button w-full">
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Mesaj Gönder
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
