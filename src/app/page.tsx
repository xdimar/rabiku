import Link from "next/link";
import {
  Heart,
  ArrowRight,
  Sparkles,
  PenTool,
  Share2,
  Smartphone,
  ShieldCheck,
  Music,
  CreditCard,
  Layers,
  Quote,
  Sliders,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import HeroSection from "@/components/landing/HeroSection";
import WhatsAppSimulator from "@/components/landing/WhatsAppSimulator";
import ScrollFadeIn from "@/components/landing/ScrollFadeIn";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-stone-900 overflow-x-hidden transition-colors">
      {/* ─── 1. Navigation Bar (Glassmorphism) ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-stone-50/85 backdrop-blur-xl border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                Rabiku
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                Studio Pro
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <a href="#cara-kerja" className="hover:text-stone-900 transition-colors">
              Cara Kerja
            </a>
            <a href="#whatsapp-simulator" className="hover:text-stone-900 transition-colors">
              Simulasi WhatsApp
            </a>
            <a href="#fitur" className="hover:text-stone-900 transition-colors">
              Fitur
            </a>
            <a href="#template" className="hover:text-stone-900 transition-colors">
              Template
            </a>
            <a href="#testimoni" className="hover:text-stone-900 transition-colors">
              Testimoni
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {session.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-semibold hover:bg-amber-200/80 transition-colors shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-all shadow-md hover:shadow-stone-900/20 active:scale-[0.98]"
                >
                  <span>Dashboard Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 px-3.5 py-2 rounded-full hover:bg-stone-200/60 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-all shadow-md hover:shadow-stone-900/20 active:scale-[0.98]"
                >
                  <span>Daftar Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── 2. Hero Section dengan Name Generator & Live Editor Simulation ─── */}
      <HeroSection isLoggedIn={!!session} />

      {/* ─── 3. Workflow Section: 3 Langkah Mudah ─── */}
      <section id="cara-kerja" className="py-24 px-6 bg-white border-y border-stone-200/70">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn direction="up" className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-3 inline-block">
              Alur Kerja Praktis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              3 Langkah Mudah Wujudkan Undangan Impian
            </h2>
            <p className="text-stone-500 mt-3 text-sm sm:text-base">
              Siapapun bisa membuat undangan digital berkelas hanya dalam 10 menit.
            </p>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Pilih Gaya & Tema",
                desc: "Awali dengan template mewah bernuansa minimalis, monokrom modern, atau sentuhan royal gold.",
                icon: Sliders,
                badge: "Siap Pakai",
              },
              {
                step: "02",
                title: "Drag & Drop Komponen",
                desc: "Susun blok mempelai, peta lokasi Google Maps, hitung mundur, audio musik latar, hingga amplop digital.",
                icon: Layers,
                badge: "Visual Builder",
              },
              {
                step: "03",
                title: "Sebar via WhatsApp",
                desc: "Tuliskan nama tamu undangan. Sistem kami otomatis meng-generate cover personal yang membuat tamu tersanjung.",
                icon: Share2,
                badge: "1-Klik Kirim",
              },
            ].map((item, idx) => (
              <ScrollFadeIn
                key={idx}
                direction="up"
                delay={idx * 0.15}
                className="relative p-8 rounded-3xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/50 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-4xl font-bold text-stone-300 group-hover:text-amber-600 transition-colors">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-600 shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center mb-5 text-stone-800 group-hover:bg-stone-900 group-hover:text-amber-400 transition-colors shadow-2xs">
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Simulator Pesan WhatsApp Interaktif ─── */}
      <WhatsAppSimulator />

      {/* ─── 4. Feature Grid Section ─── */}
      <section id="fitur" className="py-24 px-6 bg-white border-b border-stone-200/70">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn direction="up" className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-3 inline-block">
              Fitur Lengkap
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Segala yang Anda Butuhkan untuk Hari Bahagia
            </h2>
            <p className="text-stone-500 mt-3 text-sm sm:text-base">
              Setiap komponen dirancang cermat untuk memberikan pengalaman terbaik bagi Anda dan seluruh tamu undangan.
            </p>
          </ScrollFadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: PenTool,
                title: "Visual Drag & Drop Builder",
                desc: "Editor intuitif dengan live preview instan. Anda memiliki kontrol penuh atas tata letak dan susunan komponen.",
              },
              {
                icon: Smartphone,
                title: "Mobile-First Pixel Perfect",
                desc: "99% tamu mengakses dari smartphone. Tata letak responsif menjamin kenyamanan baca di layar iPhone maupun Android.",
              },
              {
                icon: Share2,
                title: "WhatsApp Smart Preview",
                desc: "Generate tautan khusus berisikan nama tamu undangan, lengkap dengan open graph preview card yang menawan.",
              },
              {
                icon: Heart,
                title: "RSVP & Buku Tamu Real-Time",
                desc: "Tamu dapat mengonfirmasi kehadiran dan menuliskan doa restu. Seluruh data langsung terangkum di dashboard.",
              },
              {
                icon: Music,
                title: "Background Music Autoplay",
                desc: "Ciptakan nuansa intim dan syahdu dengan audio player elegan yang otomatis berputar saat amplop dibuka.",
              },
              {
                icon: CreditCard,
                title: "Amplop Digital & QRIS",
                desc: "Memudahkan tamu yang berhalangan hadir untuk mengirim tanda kasih melalui transfer bank dan QRIS 1-klik salin.",
              },
            ].map((feature, i) => (
              <ScrollFadeIn
                key={i}
                direction="up"
                delay={i * 0.1}
                className="p-7 rounded-3xl bg-stone-50 border border-stone-200/80 hover:border-amber-300/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center mb-5 text-stone-700 group-hover:bg-stone-900 group-hover:text-amber-400 transition-colors shadow-2xs">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {feature.desc}
                </p>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Theme & Template Showcase ─── */}
      <section id="template" className="py-24 px-6 bg-stone-50 border-b border-stone-200/70">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn direction="up" className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-3 inline-block">
              Desain Premium
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Pilihan Tema Estetik &amp; Abadi
            </h2>
            <p className="text-stone-500 mt-3 text-sm sm:text-base">
              Koleksi gaya desain yang dirancang khusus untuk memancarkan aura sakral dan kehangatan pernikahan Anda.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Monochrome Noir",
                desc: "Gaya hitam-putih abadi dengan tipografi serif elegan dan komposisi minimalis modern.",
                color: "bg-stone-900 text-white",
                tag: "Favorit",
              },
              {
                name: "Champagne Royale",
                desc: "Sentuhan aksen emas hangat dan krem lembut untuk nuansa pernikahan agung dan mewah.",
                color: "bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-amber-50",
                tag: "Luxury",
              },
              {
                name: "Botanical Garden",
                desc: "Nuansa floral bersih dengan palet earthy tone yang menyejukkan pandangan mata tamu.",
                color: "bg-stone-800 text-stone-100",
                tag: "Modern",
              },
            ].map((theme, idx) => (
              <ScrollFadeIn
                key={idx}
                direction="up"
                delay={idx * 0.15}
                className="rounded-3xl border border-stone-200/80 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-300/80 transition-all group"
              >
                {/* Visual Card Header */}
                <div className={`p-8 ${theme.color} relative h-48 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                      {theme.tag}
                    </span>
                    <Heart className="w-4 h-4 text-amber-400 fill-amber-400/40" />
                  </div>
                  <div>
                    <span className="text-xs opacity-70">Undangan Pernikahan</span>
                    <h4 className="font-serif text-2xl font-bold mt-0.5">
                      {theme.name}
                    </h4>
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-6">
                  <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                    {theme.desc}
                  </p>
                  <Link
                    href={session ? "/dashboard" : "/onboarding"}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 hover:text-amber-300 transition-colors shadow-sm active:scale-[0.98]"
                  >
                    <span>Coba Tema Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Social Proof / Testimonials ─── */}
      <section id="testimoni" className="py-24 px-6 bg-white border-b border-stone-200/70">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn direction="up" className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-3 inline-block">
              Kisah Pasangan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Dipercaya Ribuan Pasangan Bahagia
            </h2>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Editornya sangat gampang dipakai! Bisa drag & drop musik dan lokasi langsung kelihatan preview-nya. Tamu-tamu pada kagum karena nama mereka ada di amplop.",
                name: "Sarah & Budi",
                city: "Jakarta",
                wedding: "Pernikahan Desember 2025",
                avatarBg: "bg-amber-100 text-amber-900",
              },
              {
                quote:
                  "Undangan monokrom minimalisnya super elegan! Fitur amplop digital dan RSVP otomatis ngebantu banget saat hitung konsumsi katering pesta pernikahan.",
                name: "Dimas & Anisa",
                city: "Bandung",
                wedding: "Pernikahan Januari 2026",
                avatarBg: "bg-stone-200 text-stone-800",
              },
              {
                quote:
                  "Bisa sebar link ke WhatsApp dengan nama masing-masing tamu secara cepat. Desainnya sangat rapi dan sama sekali tidak ada iklan yang mengganggu.",
                name: "Ryan & Jessica",
                city: "Surabaya",
                wedding: "Pernikahan Februari 2026",
                avatarBg: "bg-amber-200/80 text-amber-950",
              },
            ].map((t, idx) => (
              <ScrollFadeIn
                key={idx}
                direction="up"
                delay={idx * 0.15}
                className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 shadow-sm relative flex flex-col justify-between hover:shadow-md hover:border-amber-200/80 transition-all"
              >
                <div>
                  <Quote className="w-8 h-8 text-amber-500/25 mb-4" />
                  <p className="text-stone-600 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200/60 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.avatarBg} font-bold flex items-center justify-center font-serif text-sm border-2 border-white shadow-2xs`}
                  >
                    {t.name.split(" ")[0][0]}
                    {t.name.split("&")[1]?.trim()[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-stone-900">{t.name}</p>
                    <p className="text-[11px] text-stone-400">
                      {t.city} • {t.wedding}
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Final Call to Action (Luxury Dark Banner) ─── */}
      <section className="py-24 px-6 bg-stone-900 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <ScrollFadeIn direction="up">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-6 h-6 fill-amber-400" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-6 leading-tight">
              Hari Bahagia Anda Pantas Mendapatkan Undangan Terbaik
            </h2>
            <p className="text-stone-300 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Mulai sekarang tanpa biaya. Susun undangan impian Anda dengan drag &amp; drop dan bagikan momen sakral kepada kerabat tercinta.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={session ? "/dashboard" : "/onboarding"}
                className="flex items-center gap-2.5 px-9 py-4 rounded-full bg-amber-400 text-stone-950 font-bold text-sm hover:bg-amber-300 transition-all shadow-xl hover:shadow-amber-400/20 hover:scale-105 active:scale-100"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Buat Undangan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo?to=Tamu+Undangan"
                className="px-8 py-4 rounded-full bg-stone-800/90 text-stone-200 font-semibold text-sm border border-stone-700 hover:bg-stone-800 hover:text-white transition-colors"
              >
                Lihat Contoh Live
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ─── 8. Footer ─── */}
      <footer className="py-12 px-6 bg-stone-950 text-stone-400 border-t border-stone-800/80 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Heart className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-serif text-base font-bold text-stone-200">
              Rabiku
            </span>
            <span className="text-stone-500">
              — Platform Undangan Pernikahan Digital Eksklusif
            </span>
          </div>

          <p className="text-stone-500 text-center sm:text-right">
            © {new Date().getFullYear()} Rabiku. Dibuat dengan penuh cinta untuk hari istimewa Anda.
          </p>
        </div>
      </footer>
    </div>
  );
}
