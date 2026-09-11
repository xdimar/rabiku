"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Palette,
  Type,
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
  Italic,
  Bold,
  Eye,
} from "lucide-react";
import {
  WeddingThemeConfig,
  THEME_PRESETS,
  WEDDING_FONTS,
  COLOR_SWATCHES,
  defaultThemeConfig,
  FontCategory,
  HeadingScale,
  BodyScale,
  LetterSpacingOption,
  FontWeightOption,
} from "@/config/theme.config";

interface TypographySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: WeddingThemeConfig;
  onSave: (newTheme: WeddingThemeConfig) => Promise<void> | void;
  groomName?: string;
  brideName?: string;
}

type TabKey = "presets" | "fonts" | "style" | "colors";

export default function TypographySettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onSave,
  groomName = "Raden",
  brideName = "Kirana",
}: TypographySettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("presets");
  const [theme, setTheme] = useState<WeddingThemeConfig>({
    ...defaultThemeConfig,
    ...(currentTheme || {}),
  });

  useEffect(() => {
    if (isOpen) {
      setTheme({
        ...defaultThemeConfig,
        ...(currentTheme || {}),
      });
    }
  }, [isOpen, currentTheme]);

  const [fontSubTab, setFontSubTab] = useState<"heading" | "body" | "accent">("heading");
  const [fontCategoryFilter, setFontCategoryFilter] = useState<"all" | FontCategory>("all");
  const [colorSubTab, setColorSubTab] = useState<"heading" | "body" | "accent">("heading");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  // Apply a 1-click preset
  const handleApplyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setTheme({ ...preset.config });
    }
  };

  // Reset to default
  const handleReset = () => {
    setTheme({ ...defaultThemeConfig });
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(theme);
      onClose();
    } catch (err) {
      console.error("Failed to save typography settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter fonts
  const filteredFonts = WEDDING_FONTS.filter((f) => {
    if (fontCategoryFilter === "all") return true;
    return f.category === fontCategoryFilter;
  });

  // Calculate live preview font family
  const headingFontMeta = WEDDING_FONTS.find((f) => f.id === theme.headingFont);
  const bodyFontMeta = WEDDING_FONTS.find((f) => f.id === theme.bodyFont);
  const accentFontMeta = WEDDING_FONTS.find((f) => f.id === theme.accentFont);

  const previewHeadingFontFamily = `'${theme.headingFont}', ${headingFontMeta?.fallback || "serif"}`;
  const previewBodyFontFamily = `'${theme.bodyFont}', ${bodyFontMeta?.fallback || "sans-serif"}`;
  const previewAccentFontFamily = `'${theme.accentFont}', ${accentFontMeta?.fallback || "cursive"}`;

  const scaleMultiplierMap: Record<HeadingScale, number> = {
    compact: 0.88,
    normal: 1.0,
    large: 1.15,
    dramatic: 1.32,
  };

  const bodyScaleMultiplierMap: Record<BodyScale, number> = {
    small: 0.92,
    normal: 1.0,
    comfortable: 1.08,
  };

  const letterSpacingValueMap: Record<LetterSpacingOption, string> = {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.08em",
    widest: "0.2em",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-xs">
              <Palette className="w-5 h-5 text-stone-100" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-stone-900 tracking-tight">
                Studio Tipografi & Warna
              </h2>
              <p className="text-xs text-stone-500">
                Pilih gaya font eksklusif, ukuran, kerning, dan palet warna undangan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Live Preview Card ─── */}
        <div className="px-6 py-4 bg-stone-100/70 border-b border-stone-200/70">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              Pratinjau Langsung Tipografi & Warna
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 font-medium text-[10px]">
                {theme.headingFont}
              </span>
              <span className="text-stone-300">•</span>
              <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 font-medium text-[10px]">
                {theme.bodyFont}
              </span>
            </div>
          </div>

          <div className="relative p-5 rounded-xl bg-stone-50 border border-stone-200/80 text-center shadow-xs overflow-hidden transition-all duration-300">
            {/* Accent Header */}
            <p
              style={{
                fontFamily: previewAccentFontFamily,
                color: theme.accentColor,
              }}
              className="text-xl sm:text-2xl mb-1 transition-all"
            >
              The Wedding of
            </p>

            {/* Groom & Bride Names */}
            <h1
              style={{
                fontFamily: previewHeadingFontFamily,
                color: theme.headingColor,
                fontSize: `${2.2 * scaleMultiplierMap[theme.headingSizeScale]}rem`,
                fontStyle: theme.headingStyle,
                fontWeight: theme.headingWeight === "bold" ? 700 : theme.headingWeight === "semibold" ? 600 : theme.headingWeight === "medium" ? 500 : 400,
                textTransform: theme.headingTransform,
                letterSpacing: letterSpacingValueMap[theme.letterSpacing],
                lineHeight: 1.15,
              }}
              className="transition-all duration-200 my-1"
            >
              {groomName} &amp; {brideName}
            </h1>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-2.5">
              <div
                style={{ backgroundColor: theme.accentColor }}
                className="w-10 h-px transition-colors"
              />
              <span
                style={{
                  fontFamily: previewAccentFontFamily,
                  color: theme.accentColor,
                }}
                className="text-base italic"
              >
                &amp;
              </span>
              <div
                style={{ backgroundColor: theme.accentColor }}
                className="w-10 h-px transition-colors"
              />
            </div>

            {/* Date & Location in Body Font */}
            <p
              style={{
                fontFamily: previewBodyFontFamily,
                color: theme.bodyColor,
                fontSize: `${0.85 * bodyScaleMultiplierMap[theme.bodySizeScale]}rem`,
              }}
              className="tracking-wider uppercase font-medium transition-all"
            >
              Sabtu, 24 Oktober 2026 • Grand Ballroom Jakarta
            </p>

            {/* Quote excerpt */}
            <p
              style={{
                fontFamily: previewBodyFontFamily,
                color: theme.bodyColor,
                fontSize: `${0.75 * bodyScaleMultiplierMap[theme.bodySizeScale]}rem`,
                opacity: 0.85,
              }}
              className="mt-1 italic transition-all max-w-md mx-auto line-clamp-1"
            >
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup...&rdquo;
            </p>
          </div>
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div className="flex border-b border-stone-200 px-6 bg-white gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "presets"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Tema 1-Klik</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fonts")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "fonts"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Pilihan Font (17 Font)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "style"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ukuran &amp; Gaya</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("colors")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "colors"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Palet Warna Font</span>
          </button>
        </div>

        {/* ─── Tab Contents ─── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ══════════════════════════════════════════
              TAB 1: PRESET TEMA 1-KLIK
             ══════════════════════════════════════════ */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Pilihan Paket Desain Harmonis
                  </h3>
                  <p className="text-xs text-stone-500">
                    Kombinasi font, ukuran, dan warna yang dirancang khusus oleh desainer profesional
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = theme.presetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left flex flex-col justify-between hover:shadow-md ${
                        isSelected
                          ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900 shadow-xs"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                            {preset.badge}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              style={{ backgroundColor: preset.previewHeadingColor }}
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                              title="Warna Judul"
                            />
                            <span
                              style={{ backgroundColor: preset.previewAccentColor }}
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                              title="Warna Aksen"
                            />
                          </div>
                        </div>

                        <h4 className="font-serif text-base font-semibold text-stone-900 mb-0.5">
                          {preset.name}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                          {preset.tagline}
                        </p>

                        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-center mb-2">
                          <p
                            style={{
                              fontFamily: `'${preset.config.headingFont}', serif`,
                              color: preset.previewHeadingColor,
                            }}
                            className="text-lg font-semibold truncate"
                          >
                            Raden &amp; Kirana
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            {preset.config.headingFont} + {preset.config.bodyFont}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-900 mt-2">
                          <Check className="w-3.5 h-3.5" />
                          <span>Tema Aktif</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              TAB 2: PILIHAN FONT (17 FONTS)
             ══════════════════════════════════════════ */}
          {activeTab === "fonts" && (
            <div className="space-y-5">
              {/* Sub-Tabs: Target Element */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFontSubTab("heading")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      fontSubTab === "heading"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Font Judul &amp; Mempelai ({theme.headingFont})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSubTab("body")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      fontSubTab === "body"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Font Teks Isi ({theme.bodyFont})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSubTab("accent")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      fontSubTab === "accent"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Font Aksen / Romantis ({theme.accentFont})
                  </button>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFontCategoryFilter("all")}
                    className={`px-2.5 py-1 rounded-full border transition-all ${
                      fontCategoryFilter === "all"
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Semua ({WEDDING_FONTS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontCategoryFilter("serif")}
                    className={`px-2.5 py-1 rounded-full border transition-all ${
                      fontCategoryFilter === "serif"
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Serif Editorial
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontCategoryFilter("script")}
                    className={`px-2.5 py-1 rounded-full border transition-all ${
                      fontCategoryFilter === "script"
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Script Kaligrafi
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontCategoryFilter("sans")}
                    className={`px-2.5 py-1 rounded-full border transition-all ${
                      fontCategoryFilter === "sans"
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Modern Sans
                  </button>
                </div>
              </div>

              {/* Fonts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredFonts.map((font) => {
                  const currentSelectedFont =
                    fontSubTab === "heading"
                      ? theme.headingFont
                      : fontSubTab === "body"
                      ? theme.bodyFont
                      : theme.accentFont;

                  const isSelected = currentSelectedFont === font.id;

                  return (
                    <div
                      key={font.id}
                      onClick={() => {
                        if (fontSubTab === "heading") {
                          setTheme((prev) => ({ ...prev, headingFont: font.id, presetId: undefined }));
                        } else if (fontSubTab === "body") {
                          setTheme((prev) => ({ ...prev, bodyFont: font.id, presetId: undefined }));
                        } else {
                          setTheme((prev) => ({ ...prev, accentFont: font.id, presetId: undefined }));
                        }
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 text-left hover:shadow-xs flex flex-col justify-between ${
                        isSelected
                          ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900 shadow-xs"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-stone-900">
                            {font.name}
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                            {font.categoryLabel}
                          </span>
                        </div>

                        {/* Live Font Sample */}
                        <div className="py-2 my-1 border-y border-stone-100">
                          <p
                            style={{
                              fontFamily: `'${font.name}', ${font.fallback}`,
                            }}
                            className="text-2xl text-stone-900 truncate"
                          >
                            {font.sampleText}
                          </p>
                        </div>

                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                          {font.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-900 mt-2">
                          <Check className="w-3.5 h-3.5" />
                          <span>Terpilih untuk {fontSubTab === "heading" ? "Judul" : fontSubTab === "body" ? "Isi" : "Aksen"}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              TAB 3: UKURAN & GAYA (SIZING & STYLE)
             ══════════════════════════════════════════ */}
          {activeTab === "style" && (
            <div className="space-y-6">
              {/* 1. Skala Ukuran Judul */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Skala Ukuran Judul / Nama Mempelai
                    </h4>
                    <p className="text-xs text-stone-500">
                      Sesuaikan proporsi kemegahan nama pengantin di layar smartphone dan desktop
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {theme.headingSizeScale.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: "compact", label: "Ringkas (88%)", desc: "Minimalis & Kalem" },
                      { id: "normal", label: "Standar (100%)", desc: "Proporsional" },
                      { id: "large", label: "Megah (115%)", desc: "Elegan Menawan" },
                      { id: "dramatic", label: "Dramatis (132%)", desc: "High-Impact XL" },
                    ] as const
                  ).map((scale) => (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, headingSizeScale: scale.id, presetId: undefined }))
                      }
                      className={`p-3 rounded-lg border text-left transition-all ${
                        theme.headingSizeScale === scale.id
                          ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <p className="text-xs font-semibold">{scale.label}</p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          theme.headingSizeScale === scale.id ? "text-stone-300" : "text-stone-400"
                        }`}
                      >
                        {scale.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Skala Ukuran Teks Isi */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Skala Ukuran Teks Isi / Deskripsi
                    </h4>
                    <p className="text-xs text-stone-500">
                      Ukuran keterbacaan untuk jadwal acara, cerita cinta, dan ayat pernikahan
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {theme.bodySizeScale.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "small", label: "Kecil (92%)", desc: "Kompak" },
                      { id: "normal", label: "Standar (100%)", desc: "Seimbang" },
                      { id: "comfortable", label: "Nyaman (108%)", desc: "Mudah Dibaca" },
                    ] as const
                  ).map((bScale) => (
                    <button
                      key={bScale.id}
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, bodySizeScale: bScale.id, presetId: undefined }))
                      }
                      className={`p-3 rounded-lg border text-left transition-all ${
                        theme.bodySizeScale === bScale.id
                          ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <p className="text-xs font-semibold">{bScale.label}</p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          theme.bodySizeScale === bScale.id ? "text-stone-300" : "text-stone-400"
                        }`}
                      >
                        {bScale.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Gaya & Efek Huruf */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Gaya &amp; Efek Huruf Judul
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Italic Toggle */}
                  <div className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <Italic className="w-3.5 h-3.5" />
                        Gaya Miring (Italic)
                      </p>
                      <p className="text-[10px] text-stone-500">Kesan romantis &amp; puitis</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({
                          ...prev,
                          headingStyle: prev.headingStyle === "italic" ? "normal" : "italic",
                          presetId: undefined,
                        }))
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        theme.headingStyle === "italic" ? "bg-stone-900" : "bg-stone-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          theme.headingStyle === "italic" ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Transform Uppercase */}
                  <div className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5" />
                        UPPERCASE (Kapital)
                      </p>
                      <p className="text-[10px] text-stone-500">Kemegahan editorial</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({
                          ...prev,
                          headingTransform: prev.headingTransform === "uppercase" ? "none" : "uppercase",
                          presetId: undefined,
                        }))
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        theme.headingTransform === "uppercase" ? "bg-stone-900" : "bg-stone-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          theme.headingTransform === "uppercase" ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Weight Toggle */}
                  <div className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <Bold className="w-3.5 h-3.5" />
                        Ketebalan Huruf
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {theme.headingWeight === "bold" ? "Bold (700)" : theme.headingWeight === "semibold" ? "Semi-Bold (600)" : theme.headingWeight === "medium" ? "Medium (500)" : "Normal (400)"}
                      </p>
                    </div>
                    <select
                      value={theme.headingWeight}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          headingWeight: e.target.value as FontWeightOption,
                          presetId: undefined,
                        }))
                      }
                      className="text-xs bg-white border border-stone-300 rounded px-2 py-1 text-stone-800 focus:outline-none"
                    >
                      <option value="normal">Normal (400)</option>
                      <option value="medium">Medium (500)</option>
                      <option value="semibold">Semi-Bold (600)</option>
                      <option value="bold">Bold (700)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Letter Spacing (Tracking) */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Jarak Antar Huruf (Letter Spacing / Tracking)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Memberikan sentuhan *luxury typography* dengan kerapatan atau kerenggangan huruf yang elegan
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {theme.letterSpacing.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: "tight", label: "Rapat (-0.02em)", desc: "Intim & Padat" },
                      { id: "normal", label: "Standar (0em)", desc: "Seimbang Alami" },
                      { id: "wide", label: "Renggang (+0.08em)", desc: "Elegan Anggun" },
                      { id: "widest", label: "Sangat Renggang (+0.2em)", desc: "Luxe Editorial" },
                    ] as const
                  ).map((spacing) => (
                    <button
                      key={spacing.id}
                      type="button"
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, letterSpacing: spacing.id, presetId: undefined }))
                      }
                      className={`p-3 rounded-lg border text-left transition-all ${
                        theme.letterSpacing === spacing.id
                          ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <p className="text-xs font-semibold">{spacing.label}</p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          theme.letterSpacing === spacing.id ? "text-stone-300" : "text-stone-400"
                        }`}
                      >
                        {spacing.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              TAB 4: PALET WARNA FONT
             ══════════════════════════════════════════ */}
          {activeTab === "colors" && (
            <div className="space-y-6">
              {/* Target Element Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setColorSubTab("heading")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    colorSubTab === "heading"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span
                    style={{ backgroundColor: theme.headingColor }}
                    className="w-3.5 h-3.5 rounded-full border border-stone-300"
                  />
                  <span>Warna Judul &amp; Mempelai</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorSubTab("body")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    colorSubTab === "body"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span
                    style={{ backgroundColor: theme.bodyColor }}
                    className="w-3.5 h-3.5 rounded-full border border-stone-300"
                  />
                  <span>Warna Teks Isi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorSubTab("accent")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    colorSubTab === "accent"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span
                    style={{ backgroundColor: theme.accentColor }}
                    className="w-3.5 h-3.5 rounded-full border border-stone-300"
                  />
                  <span>Warna Aksen &amp; Garis</span>
                </button>
              </div>

              {/* Active Color Info & Custom Color Picker */}
              {(() => {
                const currentColor =
                  colorSubTab === "heading"
                    ? theme.headingColor
                    : colorSubTab === "body"
                    ? theme.bodyColor
                    : theme.accentColor;

                const updateColor = (newHex: string) => {
                  if (colorSubTab === "heading") {
                    setTheme((prev) => ({ ...prev, headingColor: newHex, presetId: undefined }));
                  } else if (colorSubTab === "body") {
                    setTheme((prev) => ({ ...prev, bodyColor: newHex, presetId: undefined }));
                  } else {
                    setTheme((prev) => ({ ...prev, accentColor: newHex, presetId: undefined }));
                  }
                };

                return (
                  <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          {colorSubTab === "heading"
                            ? "Warna Judul & Nama Pengantin"
                            : colorSubTab === "body"
                            ? "Warna Teks Isi & Deskripsi"
                            : "Warna Aksen & Simbol Ornamen"}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Pilih dari koleksi swatch terkurasi atau gunakan Color Picker kustom
                        </p>
                      </div>

                      {/* Custom Hex & Color Input */}
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="native-color-picker"
                          className="w-9 h-9 rounded-lg border border-stone-300 shadow-2xs cursor-pointer flex items-center justify-center p-0.5 bg-white hover:scale-105 transition-transform"
                          title="Buka Color Picker Visual"
                        >
                          <span
                            style={{ backgroundColor: currentColor }}
                            className="w-full h-full rounded-md border border-stone-200"
                          />
                        </label>
                        <input
                          id="native-color-picker"
                          type="color"
                          value={currentColor}
                          onChange={(e) => updateColor(e.target.value)}
                          className="sr-only"
                        />
                        <div className="relative">
                          <input
                            type="text"
                            value={currentColor}
                            onChange={(e) => updateColor(e.target.value)}
                            className="w-28 px-3 py-1.5 text-xs font-mono font-semibold uppercase bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Curated Swatches Grid grouped by category */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        Koleksi Swatch Terkurasi (Wedding &amp; Luxury)
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {COLOR_SWATCHES.map((swatch) => {
                          const isSwatchActive = currentColor.toLowerCase() === swatch.hex.toLowerCase();
                          return (
                            <button
                              key={swatch.name + swatch.hex}
                              type="button"
                              onClick={() => updateColor(swatch.hex)}
                              className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all hover:bg-stone-50 ${
                                isSwatchActive
                                  ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-2xs"
                                  : "border-stone-200 bg-white"
                              }`}
                            >
                              <span
                                style={{ backgroundColor: swatch.hex }}
                                className="w-5 h-5 rounded-full border border-stone-300/80 shadow-2xs shrink-0 flex items-center justify-center"
                              >
                                {isSwatchActive && <Check className="w-3 h-3 text-white drop-shadow" />}
                              </span>
                              <div className="overflow-hidden">
                                <p className="text-xs font-medium text-stone-900 truncate">
                                  {swatch.name}
                                </p>
                                <p className="text-[10px] font-mono text-stone-400 uppercase">
                                  {swatch.hex}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* ─── Footer Action Bar ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 text-xs font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Default</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? "Menerapkan..." : "Terapkan & Simpan"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
