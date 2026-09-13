"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Palette,
  Users,
  Layout,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { WEDDING_TEMPLATES } from "@/config/templates";
import { THEME_PRESETS } from "@/config/theme.config";
import { createInvitation } from "@/app/actions/invitation";
import { SessionUser } from "@/lib/auth";

interface OnboardingClientProps {
  currentUser?: SessionUser | null;
}

const STEPS = [
  { step: 1, title: "Mempelai", desc: "Nama & Informasi Dasar", icon: Users },
  { step: 2, title: "Template", desc: "Pilih Desain Awal", icon: Layout },
  { step: 3, title: "Warna", desc: "Nuansa & Tipografi", icon: Palette },
  { step: 4, title: "Selesai", desc: "Siap Menuju Studio", icon: Sparkles },
];

export default function OnboardingClient({ currentUser: _currentUser }: OnboardingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialGroom = searchParams?.get("groom") || "";
  const initialBride = searchParams?.get("bride") || "";

  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [groomName, setGroomName] = useState(initialGroom);
  const [brideName, setBrideName] = useState(initialBride);
  const [title, setTitle] = useState(
    initialGroom && initialBride
      ? `The Wedding of ${initialGroom} & ${initialBride}`
      : ""
  );
  const [slug, setSlug] = useState(
    initialGroom && initialBride
      ? `${initialGroom.toLowerCase().replace(/[^a-z0-9]/g, "")}-${initialBride
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")}`
      : ""
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState("minimalist");
  const [selectedThemePresetId, setSelectedThemePresetId] = useState("classic-monochrome");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill title & slug
  const handleGroomChange = (val: string) => {
    setGroomName(val);
    updateTitleAndSlug(val, brideName);
  };

  const handleBrideChange = (val: string) => {
    setBrideName(val);
    updateTitleAndSlug(groomName, val);
  };

  const updateTitleAndSlug = (g: string, b: string) => {
    if (g && b) {
      setTitle(`The Wedding of ${g} & ${b}`);
      const cleanG = g.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanB = b.toLowerCase().replace(/[^a-z0-9]/g, "");
      setSlug(`${cleanG}-${cleanB}`);
    }
  };

  const selectedTemplate = WEDDING_TEMPLATES.find((t) => t.id === selectedTemplateId) || WEDDING_TEMPLATES[0];
  const selectedTheme = THEME_PRESETS.find((p) => p.id === selectedThemePresetId) || THEME_PRESETS[0];

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!groomName.trim() || !brideName.trim()) {
        setError("Harap isi nama mempelai pria dan wanita.");
        return;
      }
      if (!slug.trim()) {
        setError("Harap isi tautan (slug) undangan.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await createInvitation({
        title: title || `The Wedding of ${groomName} & ${brideName}`,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        groomName: groomName.trim(),
        brideName: brideName.trim(),
        templateType: "preset",
        presetId: selectedTemplateId,
      });

      if (!res.success || !res.invitation) {
        setError(res.error || "Gagal membuat undangan. Silakan coba lagi.");
        setIsCreating(false);
        return;
      }

      router.push(`/editor/${res.invitation.id}`);
    } catch {
      setError("Terjadi kendala sistem saat membuat undangan.");
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-200">
      {/* Top Header */}
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="font-serif text-lg font-bold">Rabiku Studio</span>
          </div>

          <span className="text-xs text-stone-500 font-medium">
            Langkah <strong className="text-stone-900">{currentStep}</strong> dari 4
          </span>
        </div>
      </header>

      {/* Main Stepper Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Step Indicator Tracker */}
        <div className="mb-8 sm:mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isPast = currentStep > s.step;
              const isCurrent = currentStep === s.step;

              return (
                <div key={s.step} className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                      isPast
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-stone-900 text-white shadow-md ring-4 ring-stone-900/10"
                        : "bg-stone-200/70 text-stone-400"
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <p
                    className={`text-xs font-semibold mt-2 hidden sm:block ${
                      isCurrent ? "text-stone-900" : "text-stone-400"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[10px] text-stone-400 hidden sm:block truncate max-w-[120px]">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-stone-200 h-1 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-stone-900 h-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Slide Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl p-6 sm:p-10 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* Step 1: Couple Names */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    Siapa nama kedua mempelai?
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Kami akan menyiapkan undangan pernikahan dengan nama Anda dan pasangan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Nama Mempelai Pria *
                    </label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => handleGroomChange(e.target.value)}
                      placeholder="mis. Raden"
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Nama Mempelai Wanita *
                    </label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => handleBrideChange(e.target.value)}
                      placeholder="mis. Kirana"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Alamat Tautan Undangan (URL Slug) *
                  </label>
                  <div className="flex items-center rounded-xl border border-stone-300 overflow-hidden focus-within:border-stone-900 focus-within:ring-1 focus-within:ring-stone-900">
                    <span className="bg-stone-100 px-3.5 py-3 text-xs text-stone-500 border-r border-stone-200">
                      rabiku.my.id/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                      placeholder="raden-kirana"
                      className="w-full px-3 py-3 text-sm focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Template */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    Pilih Desain Awal Undangan
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Setiap bagian dapat disesuaikan dengan mudah di studio editor nanti.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                  {WEDDING_TEMPLATES.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${
                          isSelected
                            ? "border-stone-900 ring-2 ring-stone-900/20 shadow-md scale-[1.02]"
                            : "border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <div className="h-28 relative overflow-hidden bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tpl.thumbnail}
                            alt={tpl.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                            <span className="font-serif text-xs font-bold text-white truncate">
                              {tpl.name}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[10px] text-stone-500 line-clamp-2">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Colors & Theme */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    Pilih Nuansa Warna &amp; Font
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Sesuaikan palet estetika yang mewakili tema pernikahan Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = selectedThemePresetId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedThemePresetId(preset.id)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900/10 shadow-xs"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <div className="flex -space-x-1 shrink-0">
                          <span
                            className="w-6 h-6 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: preset.previewHeadingColor }}
                          />
                          <span
                            className="w-6 h-6 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: preset.previewAccentColor }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-stone-900 truncate">
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate">
                            {preset.tagline}
                          </p>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-stone-900 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Summary & Ready */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-center sm:text-left"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      Undangan Anda Siap Dibuat!
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                      Berikut ringkasan undangan sebelum masuk ke studio drag &amp; drop.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">Kedua Mempelai:</span>
                    <strong className="text-stone-900">{groomName} &amp; {brideName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">Tautan Undangan:</span>
                    <strong className="text-stone-900 font-mono">rabiku.my.id/{slug}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">Template Terpilih:</span>
                    <strong className="text-stone-900">{selectedTemplate.name}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Tema Warna:</span>
                    <strong className="text-stone-900">{selectedTheme.name}</strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Navigation Footer */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isCreating}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-md"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isCreating}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyiapkan Studio...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Buka di Studio Editor</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="py-4 text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Rabiku Studio &mdash; Platform Undangan Digital Modern
      </footer>
    </div>
  );
}
