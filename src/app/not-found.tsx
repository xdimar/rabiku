import Link from "next/link";
import { Heart, ArrowLeft, PenTool, Eye, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-200 selection:text-stone-900 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
            Rabiku
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white px-4 py-2 rounded-full border border-stone-200 shadow-xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ke Halaman Utama</span>
        </Link>
      </header>

      {/* Main 404 Hero Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-900 text-xs font-semibold mb-6 border border-amber-500/20 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>404 — Halaman Tidak Ditemukan</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight mb-4 tracking-tight">
            Undangan Ini Belum Tersedia atau Telah Berpindah
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-md mx-auto mb-8">
            Tautan undangan yang Anda tuju mungkin belum diterbitkan oleh calon mempelai, telah kedaluwarsa, atau terdapat salah ketik pada alamat URL.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-stone-900 text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-all shadow-md hover:shadow-stone-900/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-stone-800 text-xs sm:text-sm font-semibold border border-stone-200 hover:bg-stone-100 hover:border-stone-300 transition-all shadow-xs"
            >
              <PenTool className="w-4 h-4 text-amber-600" />
              <span>Buat Undangan Sendiri</span>
            </Link>
          </div>

          {/* Helpful Micro Tip Card */}
          <div className="p-4 rounded-2xl bg-white/90 border border-stone-200/90 shadow-sm max-w-md mx-auto text-left flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-800 mb-0.5">
                Mencari undangan kerabat Anda?
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Silakan hubungi calon pengantin atau pengirim pesan untuk memastikan tautan nama yang benar. Atau lihat{" "}
                <Link
                  href="/demo?to=Tamu+Undangan"
                  className="font-semibold text-amber-800 underline hover:text-amber-900"
                >
                  contoh undangan live di sini
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-stone-400 border-t border-stone-200/60 max-w-7xl mx-auto w-full">
        © {new Date().getFullYear()} Rabiku (rabiku.my.id) — Platform Undangan Pernikahan Digital Eksklusif
      </footer>
    </div>
  );
}
