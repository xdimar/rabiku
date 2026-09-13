"use client";

import React from "react";
import {
  X,
  Palette,
  Type,
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  WeddingThemeConfig,
  THEME_PRESETS,
} from "@/config/theme.config";
import { useTypographyState, type TabKey } from "./typography/useTypographyState";
import TypographyPreview from "./typography/TypographyPreview";
import PresetTab from "./typography/PresetTab";
import FontPickerTab from "./typography/FontPickerTab";
import StyleTab from "./typography/StyleTab";
import ColorTab from "./typography/ColorTab";

interface TypographySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: WeddingThemeConfig;
  onSave: (newTheme: WeddingThemeConfig) => Promise<void> | void;
  groomName?: string;
  brideName?: string;
}

const TAB_CONFIG: { key: TabKey; label: string; icon: typeof Sparkles }[] = [
  { key: "presets", label: "Preset Tema 1-Klik", icon: Sparkles },
  { key: "fonts", label: "Pilihan Font (17 Font)", icon: Type },
  { key: "style", label: "Ukuran & Gaya", icon: Sliders },
  { key: "colors", label: "Palet Warna Font", icon: Palette },
];

export default function TypographySettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onSave,
  groomName = "Raden",
  brideName = "Kirana",
}: TypographySettingsModalProps) {
  const {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    fontSubTab,
    setFontSubTab,
    fontCategoryFilter,
    setFontCategoryFilter,
    colorSubTab,
    setColorSubTab,
    isSaving,
    handleReset,
    handleSave,
  } = useTypographyState({ isOpen, currentTheme, onSave, onClose });

  if (!isOpen) return null;

  const handleApplyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setTheme({ ...preset.config });
    }
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
                Studio Tipografi &amp; Warna
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
        <TypographyPreview
          theme={theme}
          groomName={groomName}
          brideName={brideName}
        />

        {/* ─── Navigation Tabs ─── */}
        <div className="flex border-b border-stone-200 px-6 bg-white gap-2">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === key
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ─── Tab Contents ─── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "presets" && (
            <PresetTab theme={theme} onApplyPreset={handleApplyPreset} />
          )}

          {activeTab === "fonts" && (
            <FontPickerTab
              theme={theme}
              setTheme={setTheme}
              fontSubTab={fontSubTab}
              setFontSubTab={setFontSubTab}
              fontCategoryFilter={fontCategoryFilter}
              setFontCategoryFilter={setFontCategoryFilter}
            />
          )}

          {activeTab === "style" && (
            <StyleTab theme={theme} setTheme={setTheme} />
          )}

          {activeTab === "colors" && (
            <ColorTab
              theme={theme}
              setTheme={setTheme}
              colorSubTab={colorSubTab}
              setColorSubTab={setColorSubTab}
            />
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
