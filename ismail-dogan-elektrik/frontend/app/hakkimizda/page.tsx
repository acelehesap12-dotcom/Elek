import { Metadata } from "next";
import { Award, Users, Target, Heart, Lightbulb, Shield } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda | İsmail Doğan Elektrik",
  description:
    "İsmail Doğan Elektrik Mühendisliği - 15+ yıllık deneyim, binlerce başarılı proje. İstanbul'un güvenilir elektrik uzmanı.",
};

const values = [
  {
    icon: Shield,
    title: "Güvenlik",
    description:
      "Tüm çalışmalarımızda TSE ve TEDAŞ standartlarına tam uyum sağlarız. Güvenlik her zaman önceliğimizdir.",
  },
  {
    icon: Award,
    title: "Kalite",
    description:
      "A sınıfı malzemeler ve profesyonel işçilik ile uzun ömürlü, sorunsuz elektrik sistemleri kuruyoruz.",
  },
  {
    icon: Target,
    title: "Hassasiyet",
    description:
      "Her projeyi detaylı analiz ederek müşterilerimize en uygun ve verimli çözümleri sunuyoruz.",
  },
  {
    icon: Heart,
    title: "Müşteri Odaklılık",
    description:
      "Müşteri memnuniyeti bizim için her şeyden önemli. 7/24 destek ve takip hizmeti sunuyoruz.",
  },
  {
    icon: Lightbulb,
    title: "Yenilikçilik",
    description:
      "Sektördeki gelişmeleri yakından takip eder, en güncel teknolojileri projelerimize uygularız.",
  },
  {
    icon: Users,
    title: "Takım Çalışması",
    description:
      "Deneyimli mühendis ve teknisyen kadromuzla koordineli bir şekilde çalışarak başarılı sonuçlar elde ediyoruz.",
  },
];

const milestones = [
  { year: "2009", title: "Kuruluş", description: "İsmail Doğan Elektrik kuruldu" },
  { year: "2012", title: "İlk Büyük Proje", description: "500+ daireli site projesi tamamlandı" },
  { year: "2015", title: "Endüstriyel Atılım", description: "Fabrika ve sanayi tesisi projelerine başlandı" },
  { year: "2018", title: "Dijital Dönüşüm", description: "Online randevu ve takip sistemi devreye alındı" },
  { year: "2021", title: "Genişleme", description: "İstanbul'un tüm ilçelerine hizmet ağı kuruldu" },
  { year: "2024", title: "Teknoloji Yatırımı", description: "AI destekli hesaplama ve tasarım araçları" },
];

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-cyber-dark-950 -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10" />

      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-neon-blue-400 text-sm font-display font-semibold tracking-widest uppercase mb-4">
            Hakkımızda
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            15+ Yıllık <span className="gradient-text">Deneyim</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            İstanbul&apos;da elektrik mühendisliği alanında 15 yılı aşkın deneyimimizle,
            konutlardan sanayi tesislerine kadar geniş bir yelpazede güvenilir
            hizmet sunuyoruz.
          </p>
        </div>

        {/* About Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Profesyonel Elektrik
                <br />
                <span className="gradient-text">Mühendisliği Hizmetleri</span>
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  İsmail Doğan Elektrik Mühendisliği olarak, 2009 yılından bu yana
                  İstanbul genelinde konut, ticari ve endüstriyel sektörlere
                  profesyonel elektrik hizmetleri sunmaktayız.
                </p>
                <p>
                  Deneyimli mühendis kadromuz ve uzman teknisyen ekibimizle, elektrik
                  tesisatı kurulumundan proje çizimine, periyodik bakımdan acil arıza
                  müdahalesine kadar geniş bir hizmet yelpazesi sunuyoruz.
                </p>
                <p>
                  TSE ve TEDAŞ standartlarına tam uyum sağlayan çalışma prensiplerimiz
                  ve A sınıfı malzeme kullanımı, projelerimizin güvenilirliğini ve
                  dayanıklılığını garanti altına alır.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-xl bg-cyber-dark-900/60 border border-neon-blue-500/20">
                  <div className="text-3xl font-display font-bold gradient-text mb-1">
                    2500+
                  </div>
                  <div className="text-sm text-gray-500">Tamamlanan Proje</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-cyber-dark-900/60 border border-neon-blue-500/20">
                  <div className="text-3xl font-display font-bold gradient-text mb-1">
                    99%
                  </div>
                  <div className="text-sm text-gray-500">Müşteri Memnuniyeti</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-neon-blue-500/20 to-amber-alert-500/10 border border-neon-blue-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-neon-blue-500/20 flex items-center justify-center">
                    <Award className="w-16 h-16 text-neon-blue-400" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    İsmail Doğan
                  </h3>
                  <p className="text-neon-blue-400">Kurucu & Elektrik Mühendisi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Değerlerimiz
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Çalışmalarımızda benimsediğimiz temel değerler, başarımızın temelidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-xl bg-cyber-dark-900/60 border border-cyber-dark-700/50 hover:border-neon-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-neon-blue-500/20 flex items-center justify-center text-neon-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Yolculuğumuz
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              2009&apos;dan bugüne büyüme hikayemiz
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-neon-blue-500 via-neon-blue-500/50 to-transparent" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="inline-block p-6 rounded-xl bg-cyber-dark-900/60 border border-cyber-dark-700/50">
                      <div className="text-neon-blue-400 font-display font-bold text-xl mb-1">
                        {milestone.year}
                      </div>
                      <h3 className="text-white font-semibold mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-neon-blue-500 border-4 border-cyber-dark-950" />

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 px-8 rounded-2xl bg-gradient-to-br from-cyber-dark-900/80 to-cyber-dark-950/80 border border-neon-blue-500/20">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Projenizi Birlikte Gerçekleştirelim
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Elektrik mühendisliği ihtiyaçlarınız için ücretsiz keşif ve danışmanlık
            hizmeti almak ister misiniz?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/randevu" className="cyber-button w-full sm:w-auto text-center">
              Randevu Oluştur
            </Link>
            <Link
              href="/iletisim"
              className="px-6 py-3 rounded-lg border border-neon-blue-500/50 text-neon-blue-400 hover:bg-neon-blue-500/10 transition-all w-full sm:w-auto text-center"
            >
              İletişime Geç
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
