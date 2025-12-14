import { Metadata } from "next";
import {
  Zap,
  FileText,
  Wrench,
  AlertTriangle,
  MessageSquare,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | İsmail Doğan Elektrik",
  description:
    "Profesyonel elektrik mühendisliği hizmetleri: tesisat kurulumu, proje çizimi, periyodik bakım, arıza tespit, teknik danışmanlık ve güvenlik sistemleri.",
};

const services = [
  {
    id: "tesisat",
    title: "Elektrik Tesisatı",
    description:
      "Konut, işyeri ve endüstriyel tesislerde tam kapsamlı elektrik tesisat kurulumu, yenileme ve modernizasyon hizmetleri. TSE ve TEDAŞ standartlarına uygun, güvenli ve verimli sistemler.",
    icon: Zap,
    color: "neon-blue",
    features: [
      "Komple tesisat kurulumu",
      "Eski tesisat yenileme",
      "Elektrik panosu montajı",
      "Kablo çekimi ve döşeme",
      "Topraklama sistemi",
      "Aydınlatma tesisatı",
      "Priz ve anahtar montajı",
      "Endüstriyel tesisat",
    ],
    process: [
      "Yerinde keşif ve analiz",
      "Proje hazırlama",
      "Malzeme tedariki",
      "Kurulum işlemleri",
      "Test ve devreye alma",
      "Garanti belgesi teslimi",
    ],
  },
  {
    id: "proje",
    title: "Proje Çizimi",
    description:
      "Mühendislik standartlarına uygun elektrik proje çizimi, yük hesaplamaları, tek hat şemaları ve resmi onay süreçleri. AutoCAD ve profesyonel yazılımlarla hazırlanan projeler.",
    icon: FileText,
    color: "neon-blue",
    features: [
      "Tek hat şeması",
      "Aydınlatma projesi",
      "Kuvvet tesisatı projesi",
      "Yük hesaplamaları",
      "Kesit hesapları",
      "Pano tasarımı",
      "Topraklama projesi",
      "TEDAŞ onay takibi",
    ],
    process: [
      "İhtiyaç analizi",
      "Ölçülendirme",
      "Hesaplamalar",
      "Proje çizimi",
      "Kontrol ve revizyon",
      "Onay süreçleri",
    ],
  },
  {
    id: "bakim",
    title: "Periyodik Bakım",
    description:
      "Elektrik sistemlerinizin güvenli ve verimli çalışması için düzenli bakım, kontrol ve ölçüm hizmetleri. Arıza riskini minimize eden proaktif bakım anlayışı.",
    icon: Wrench,
    color: "neon-blue",
    features: [
      "Termal görüntüleme",
      "Yalıtım direnci ölçümü",
      "Topraklama ölçümü",
      "Pano bakımı",
      "Kablo kontrolü",
      "Bağlantı sıkılama",
      "Rapor hazırlama",
      "Önleyici bakım",
    ],
    process: [
      "Bakım planlaması",
      "Sistemlerin kontrolü",
      "Ölçüm ve testler",
      "Bakım işlemleri",
      "Raporlama",
      "Öneri ve takip",
    ],
  },
  {
    id: "ariza",
    title: "Arıza Tespit ve Onarım",
    description:
      "7/24 acil arıza müdahale hizmeti. Profesyonel tespit ekipmanları ile hızlı ve kalıcı çözümler. Elektrik kesintisi, kısa devre, kaçak akım gibi tüm arızalara müdahale.",
    icon: AlertTriangle,
    color: "amber",
    features: [
      "7/24 acil müdahale",
      "Kaçak akım tespiti",
      "Kısa devre onarımı",
      "Kesinti analizi",
      "Hat arıza tespiti",
      "Sigorta değişimi",
      "Pano arıza giderme",
      "Acil aydınlatma",
    ],
    process: [
      "Acil çağrı",
      "Hızlı ulaşım",
      "Arıza tespiti",
      "Onarım işlemi",
      "Test ve kontrol",
      "Garanti belgesi",
    ],
  },
  {
    id: "danismanlik",
    title: "Teknik Danışmanlık",
    description:
      "Elektrik sistemleri, enerji verimliliği ve yatırım planlaması konularında uzman mühendislik danışmanlığı. Maliyet optimizasyonu ve sistem iyileştirme önerileri.",
    icon: MessageSquare,
    color: "neon-blue",
    features: [
      "Enerji verimliliği analizi",
      "Sistem optimizasyonu",
      "Maliyet hesaplamaları",
      "Fizibilite raporları",
      "Güç kalitesi analizi",
      "Yatırım danışmanlığı",
      "Teknik şartname",
      "Denetim hizmeti",
    ],
    process: [
      "İhtiyaç görüşmesi",
      "Mevcut durum analizi",
      "Çözüm alternatifleri",
      "Maliyet-fayda analizi",
      "Rapor sunumu",
      "Uygulama takibi",
    ],
  },
  {
    id: "guvenlik",
    title: "Güvenlik Sistemleri",
    description:
      "Elektriksel güvenlik denetimleri, topraklama ölçümleri, paratoner sistemleri kurulumu ve periyodik kontroller. Yönetmeliklere uygun güvenlik çözümleri.",
    icon: Shield,
    color: "neon-blue",
    features: [
      "Topraklama ölçümü",
      "Paratoner kurulumu",
      "Kaçak akım rölesi",
      "Aşırı gerilim koruma",
      "Güvenlik denetimi",
      "Periyodik kontrol",
      "Sertifika düzenleme",
      "Sigorta raporu",
    ],
    process: [
      "Risk değerlendirme",
      "Sistem tasarımı",
      "Kurulum/ölçüm",
      "Test işlemleri",
      "Belgelendirme",
      "Periyodik takip",
    ],
  },
];

export default function HizmetlerPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-cyber-dark-950 -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10" />

      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-neon-blue-400 text-sm font-display font-semibold tracking-widest uppercase mb-4">
            Hizmetlerimiz
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Profesyonel <span className="gradient-text">Elektrik Hizmetleri</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            İstanbul genelinde konut, ticari ve endüstriyel tesisler için
            kapsamlı elektrik mühendisliği çözümleri. Güvenli, verimli ve
            standartlara uygun hizmet anlayışı.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-16">
          {services.map((service, index) => (
            <section
              key={service.id}
              id={service.id}
              className="scroll-mt-32"
            >
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-12 items-start`}
              >
                {/* Service Info */}
                <div className="flex-1">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${
                      service.color === "amber"
                        ? "bg-amber-alert-500/20 text-amber-alert-400"
                        : "bg-neon-blue-500/20 text-neon-blue-400"
                    }`}
                  >
                    <service.icon className="w-8 h-8" />
                  </div>

                  <h2 className="text-3xl font-display font-bold text-white mb-4">
                    {service.title}
                  </h2>

                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <CheckCircle2 className="w-5 h-5 text-neon-blue-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/randevu"
                    className="inline-flex items-center gap-2 text-neon-blue-400 hover:text-neon-blue-300 font-medium transition-colors"
                  >
                    <span>Bu hizmet için randevu al</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Process Steps */}
                <div className="flex-1 w-full">
                  <div className="bg-cyber-dark-900/60 backdrop-blur-sm rounded-2xl border border-cyber-dark-700/50 p-8">
                    <h3 className="text-xl font-display font-semibold text-white mb-6">
                      Süreç Adımları
                    </h3>

                    <div className="space-y-4">
                      {service.process.map((step, stepIndex) => (
                        <div key={step} className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              service.color === "amber"
                                ? "bg-amber-alert-500/20 text-amber-alert-400 border border-amber-alert-500/30"
                                : "bg-neon-blue-500/20 text-neon-blue-400 border border-neon-blue-500/30"
                            }`}
                          >
                            {stepIndex + 1}
                          </div>
                          <span className="text-gray-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < services.length - 1 && (
                <div className="mt-16 border-t border-cyber-dark-800/50" />
              )}
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-neon-blue-500/10 to-amber-alert-500/10 border border-cyber-dark-700/50">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Hangi hizmete ihtiyacınız olduğundan emin değil misiniz?
            </h3>
            <p className="text-gray-400 mb-6">
              Ücretsiz danışmanlık için bizi arayın, ihtiyacınıza en uygun
              çözümü birlikte belirleyelim.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+905551234567" className="cyber-button-amber">
                0555 123 45 67
              </a>
              <Link href="/randevu" className="cyber-button">
                Online Randevu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
