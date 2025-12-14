import { Metadata } from "next";
import BookingWizard from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Online Randevu | İsmail Doğan Elektrik",
  description:
    "Elektrik hizmetleri için online randevu oluşturun. Kolay ve hızlı randevu sistemi ile ihtiyacınıza uygun zamanda hizmet alın.",
};

export default function RandevuPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-cyber-dark-950 -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10" />

      {/* Gradient Orbs */}
      <div className="fixed top-1/4 left-0 w-96 h-96 bg-neon-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-1/4 right-0 w-96 h-96 bg-amber-alert-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-neon-blue-400 text-sm font-display font-semibold tracking-widest uppercase mb-4">
            Online Randevu
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Randevu <span className="gradient-text">Oluşturun</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Elektrik hizmeti ihtiyacınız için birkaç adımda randevu oluşturun.
            Size en uygun zamanda profesyonel ekibimiz kapınızda olacak.
          </p>
        </div>

        {/* Booking Wizard */}
        <BookingWizard />
      </div>
    </div>
  );
}
