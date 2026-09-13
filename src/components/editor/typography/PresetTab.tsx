import React from "react";
import { Check } from "lucide-react";
import { WeddingThemeConfig, THEME_PRESETS } from "@/config/theme.config";

interface PresetTabProps {
  theme: WeddingThemeConfig;
  onApplyPreset: (presetId: string) => void;
}

export default function PresetTab({ theme, onApplyPreset }: PresetTabProps) {
  return (
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
              onClick={() => onApplyPreset(preset.id)}
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
  );
}
