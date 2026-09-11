"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { loginUser } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      if (!res.success) {
        setError(res.error || "Email atau kata sandi tidak cocok");
        setIsLoading(false);
        return;
      }

      // Success -> Redirect to dashboard or admin if admin
      if (res.user?.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-stone-50 text-stone-900 font-sans">
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
          Selamat Datang Kembali
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          Masuk untuk mengelola desain undangan, daftar tamu, dan rekap konfirmasi RSVP Anda.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xl">
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-50 transition-all shadow-md active:scale-[0.99]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-stone-900 hover:underline inline-flex items-center gap-1"
            >
              <span>Daftar Akun Baru</span>
              <Sparkles className="w-3 h-3 text-amber-600" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
