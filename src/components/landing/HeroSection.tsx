"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  PenTool,
  ArrowRight,
  Eye,
  Heart,
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
  { groom: "Rama", bride: "Shinta" },
  { groom: "Ahmad", bride: "Aisyah" },
  { groom: "Dimas", bride: "Putri" },
];

export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
  const [groomName, setGroomName] = useState<string>("Sarah");
  const [brideName, setBrideName] = useState<string>("Budi");

  const handlePreset = (groom: string, bride: string) => {
    setGroomName(groom);
    setBrideName(bride);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
      {/* Decorative background ambient glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-48 right-10 w-96 h-96 bg-rose-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description, Interactive Name Generator & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 text-left">
            <ScrollFadeIn direction="right" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold tracking-wide">
                  The Modern Drag & Drop Wedding Builder
                </span>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn direction="right" delay={0.2}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.12] tracking-tight mb-6">
                Wujudkan Undangan{" "}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-800 to-amber-700">
                  Pernikahan Digital
                </span>{" "}
                yang Begitu Elegan
              </h1>
            </ScrollFadeIn>

            <ScrollFadeIn direction="right" delay={0.3}>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mb-6">
                Rancang undangan pernikahan mewah Anda semudah drag & drop.
                Dilengkapi pemutar musik romantis, RSVP & buku tamu instan,
                amplop digital QRIS, serta tautan personal ke WhatsApp tamu Anda.
              </p>
            </ScrollFadeIn>

            {/* ─── Interactive Name Generator Card ─── */}
            <ScrollFadeIn direction="right" delay={0.35}>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-lg shadow-stone-900/5 mb-8 max-w-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      Coba Pasang Nama Anda & Pasangan:
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Live Preview
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                      Mempelai Pria
                    </label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="Contoh: Sarah / Rama"
                      maxLength={20}
                      className="w-full px-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900 transition-all placeholder:text-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                      Mempelai Wanita
                    </label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="Contoh: Budi / Shinta"
                      maxLength={20}
                      className="w-full px-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900 transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* Preset suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-stone-400 font-medium mr-1">
                    Contoh:
                  </span>
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePreset(p.groom, p.bride)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                        groomName === p.groom && brideName === p.bride
                          ? "bg-stone-900 text-amber-400 border-stone-900 font-semibold"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:border-stone-300"
                      }`}
                    >
                      {p.groom} & {p.bride}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollFadeIn>

            {/* Action Buttons */}
            <ScrollFadeIn direction="right" delay={0.4}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/register"}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:shadow-stone-900/20 group"
                >
                  <PenTool className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Mulai Desain Undangan Ini</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/demo?to=Bpk.+Hendra+%26+Partner"
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-stone-800 font-semibold text-sm border border-stone-200 hover:bg-stone-100 hover:border-stone-300 transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4 text-stone-500" />
                  <span>Lihat Contoh Undangan</span>
                </Link>
              </div>
            </ScrollFadeIn>

            {/* Social Proof & Value Props */}
            <ScrollFadeIn direction="right" delay={0.5}>
              <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-amber-900">
                      SB
                    </div>
                    <div className="w-7 h-7 rounded-full bg-stone-300 border-2 border-white flex items-center justify-center font-bold text-[10px] text-stone-800">
                      RS
                    </div>
                    <div className="w-7 h-7 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-rose-900">
                      AA
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

                <div className="flex items-center gap-4 text-stone-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Tanpa Coding
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Mobile-Optimized
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
