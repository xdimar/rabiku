"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  PenTool,
  ArrowRight,
  Eye,
  Star,
  Check,
  Wand2,
} from "lucide-react";
import EditorSimulation from "./EditorSimulation";
import ScrollFadeIn from "./ScrollFadeIn";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const PRESETS = [
  { groom: "Sarah", bride: "Budi" },
  { groom: "Dimas", bride: "Anisa" },
  { groom: "Raden", bride: "Kirana" },
  { groom: "Ryan", bride: "Jessica" },
];

export default function HeroSection({ isLoggedIn: _isLoggedIn }: HeroSectionProps) {
  const [groomName, setGroomName] = useState<string>("Sarah");
  const [brideName, setBrideName] = useState<string>("Budi");

  const handlePreset = (groom: string, bride: string) => {
    setGroomName(groom);
    setBrideName(bride);
  };

  const targetOnboardingUrl = `/onboarding?groom=${encodeURIComponent(
    groomName.trim()
  )}&bride=${encodeURIComponent(brideName.trim())}`;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/70 via-stone-50 to-stone-50">
      {/* Decorative background ambient glows with signature Rabiku warm gold & stone tones */}
      <div className="absolute top-16 left-1/4 w-[500px] h-[500px] bg-amber-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-36 right-10 w-[450px] h-[450px] bg-stone-200/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-12 right-1/3 w-80 h-80 bg-amber-200/30 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description, Interactive Name Generator & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 text-left">
            <ScrollFadeIn direction="right" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50/90 border border-amber-200/90 text-amber-900 mb-6 shadow-xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400/40" />
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-900">
                  Studio Undangan Digital Eksklusif
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn direction="right" delay={0.2}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.12] tracking-tight mb-6">
                Wujudkan Undangan{" "}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-stone-950 via-amber-900 to-amber-700">
                  Pernikahan Digital
                </span>{" "}
                yang Begitu Elegan
              </h1>
            </ScrollFadeIn>

            <ScrollFadeIn direction="right" delay={0.3}>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mb-7">
                Rancang undangan pernikahan mewah Anda semudah drag & drop.
                Dilengkapi pemutar musik romantis, RSVP & buku tamu instan,
                amplop digital QRIS, serta tautan personal ke WhatsApp tamu Anda.
              </p>
            </ScrollFadeIn>

            {/* ─── Interactive Name Generator Card (Harmonized 3xl Card) ─── */}
            <ScrollFadeIn direction="right" delay={0.35}>
              <div className="p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-xl shadow-stone-900/5 mb-8 max-w-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-800 shadow-2xs">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 tracking-tight">
                      Personalisasi Nama Anda &amp; Pasangan:
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80 shadow-2xs">
                    Live Preview
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">
                      Mempelai Pria
                    </label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="Contoh: Sarah / Rama"
                      maxLength={20}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-stone-50/80 border border-stone-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white text-stone-900 transition-all placeholder:text-stone-400 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">
                      Mempelai Wanita
                    </label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="Contoh: Budi / Shinta"
                      maxLength={20}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-stone-50/80 border border-stone-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white text-stone-900 transition-all placeholder:text-stone-400 shadow-inner"
                    />
                  </div>
                </div>

                {/* Preset suggestions matching testimonial couples */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[10px] text-stone-400 font-medium">
                    Contoh:
                  </span>
                  {PRESETS.map((p, idx) => {
                    const isActive = groomName === p.groom && brideName === p.bride;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePreset(p.groom, p.bride)}
                        className={`text-[11px] px-3 py-1 rounded-xl border transition-all ${
                          isActive
                            ? "bg-stone-900 text-amber-400 border-stone-900 font-semibold shadow-xs"
                            : "bg-stone-100/80 text-stone-600 border-stone-200/80 hover:bg-stone-200/70 hover:text-stone-900 font-medium"
                        }`}
                      >
                        {p.groom} &amp; {p.bride}
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollFadeIn>

            {/* Action Buttons */}
            <ScrollFadeIn direction="right" delay={0.4}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
                <Link
                  href={targetOnboardingUrl}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:shadow-stone-900/20 active:scale-[0.98] group"
                >
                  <PenTool className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Mulai Desain Undangan Ini</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/demo?to=Bpk.+Hendra+%26+Partner"
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-stone-800 font-semibold text-sm border border-stone-200 hover:bg-stone-100/80 hover:border-stone-300 active:scale-[0.98] transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4 text-stone-500" />
                  <span>Lihat Contoh Undangan</span>
                </Link>
              </div>
            </ScrollFadeIn>

            {/* Social Proof & Value Props */}
            <ScrollFadeIn direction="right" delay={0.5}>
              <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center font-bold font-serif text-[10px] text-amber-900 shadow-xs">
                      SB
                    </div>
                    <div className="w-7 h-7 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center font-bold font-serif text-[10px] text-stone-800 shadow-xs">
                      DA
                    </div>
                    <div className="w-7 h-7 rounded-full bg-amber-200/80 border-2 border-white flex items-center justify-center font-bold font-serif text-[10px] text-amber-950 shadow-xs">
                      RK
                    </div>
                  </div>
                  <div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-stone-800">4.9/5</span> dari 2.400+ pasangan
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-600 font-medium">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200/80 text-[11px] shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Tanpa Coding
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200/80 text-[11px] shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Mobile-Optimized
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200/80 text-[11px] shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Siap WhatsApp
                  </span>
                </div>
              </div>
            </ScrollFadeIn>
          </div>

          {/* Right Column: Interactive Animated Drag & Drop Editor Simulation */}
          <div className="lg:col-span-6 xl:col-span-6">
            <ScrollFadeIn direction="left" delay={0.25} distance={40}>
              <EditorSimulation groomName={groomName} brideName={brideName} />
            </ScrollFadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
