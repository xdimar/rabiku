"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal terdiri dari 6 karakter");
      return;
    }

    if (!agreeTerms) {
      setError("Harap setujui Syarat & Ketentuan (S&K) layanan untuk melanjutkan pendaftaran.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({ name, email, password });

      if (!res.success) {
        setError(res.error || "Gagal mendaftar");
        setIsLoading(false);
        return;
      }

      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-stone-50 text-stone-900 font-sans relative">
      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-6 flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white/90 hover:bg-white px-4 py-2 rounded-full border border-stone-200 shadow-xs hover:shadow-sm transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-stone-500 group-hover:text-stone-900" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group mb-4 transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-md">
            <Heart className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Rabiku
          </span>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
          Buat Akun Baru
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          Mulai buat undangan pernikahan digital impian Anda secara gratis dan elegan.
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xl">
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmad & Aisyah"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all placeholder:text-stone-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* S&K (Syarat & Ketentuan) Checkbox */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 accent-stone-900 cursor-pointer"
            />
            <label
              htmlFor="agreeTerms"
              className="text-xs text-stone-600 leading-relaxed cursor-pointer select-none"
            >
              Saya telah membaca dan menyetujui{" "}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="font-bold text-stone-900 underline hover:text-amber-800 transition-colors"
              >
                Syarat &amp; Ketentuan (S&amp;K)
              </button>{" "}
              serta Kebijakan Privasi platform Rabiku.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-50 transition-all shadow-md active:scale-[0.99] mt-3"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Daftar Akun Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-stone-900 hover:underline inline-flex items-center gap-1"
            >
              <span>Masuk di Sini</span>
            </Link>
          </p>
        </div>
      </div>

      {/* ─── Modal Syarat & Ketentuan (S&K) ─── */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[88vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-stone-200/80 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Syarat &amp; Ketentuan Layanan
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Platform Rabiku (rabiku.my.id) — Berlaku per 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-600 leading-relaxed font-normal">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-[11px]">
                <p className="font-semibold mb-0.5">Komitmen Privasi &amp; Integritas</p>
                Selamat datang di Rabiku. Dengan mendaftar dan menggunakan layanan kami, Anda menyetujui ketentuan penggunaan di bawah ini demi kenyamanan dan keamanan bersama.
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs mb-1">
                  1. Akun &amp; Keamanan Pengguna
                </h4>
                <p>
                  Pengguna bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi dan seluruh aktivitas yang terjadi pada akun mereka. Anda setuju untuk segera memberitahukan pengelola jika menemukan akses tidak sah ke akun Anda.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs mb-1">
                  2. Kerahasiaan Data &amp; Buku Tamu (RSVP)
                </h4>
                <p>
                  Data tamu, konfirmasi kehadiran, serta ucapan doa restu yang masuk merupakan milik eksklusif pemilik undangan. Rabiku menjamin 100% tidak akan menjual, menyewakan, atau menyalahgunakan data nomor WhatsApp maupun kontak tamu Anda kepada pihak ketiga mana pun.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs mb-1">
                  3. Amplop Digital Tanpa Potongan (0% Komisi)
                </h4>
                <p>
                  Seluruh transfer kado pernikahan, amplop digital, maupun transaksi QRIS yang ditampilkan adalah saluran langsung (*peer-to-peer*) ke rekening pribadi Anda. Rabiku tidak memotong biaya sepeser pun dari dana tanda kasih yang dikirimkan tamu kepada Anda.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs mb-1">
                  4. Masa Aktif &amp; Penyimpanan Media
                </h4>
                <p>
                  Undangan pernikahan digital Anda akan tetap aktif dan dapat diakses publik setidaknya selama 1 (satu) tahun penuh sejak tanggal acara pernikahan, sehingga kenangan hari bahagia Anda tetap tersimpan dengan aman dan indah.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs mb-1">
                  5. Tanggung Jawab Konten
                </h4>
                <p>
                  Pengguna dilarang mengunggah konten yang melanggar hukum Republik Indonesia, norma kesusilaan, pornografi, ujaran kebencian, atau materi yang melanggar hak cipta pihak lain.
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTermsModal(false);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Saya Setuju dengan S&amp;K</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
