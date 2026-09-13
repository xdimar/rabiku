import React from "react";
import { Check } from "lucide-react";
import {
  WeddingThemeConfig,
  WEDDING_FONTS,
  FontCategory,
} from "@/config/theme.config";

interface FontPickerTabProps {
  theme: WeddingThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<WeddingThemeConfig>>;
  fontSubTab: "heading" | "body" | "accent";
  setFontSubTab: (tab: "heading" | "body" | "accent") => void;
  fontCategoryFilter: "all" | FontCategory;
  setFontCategoryFilter: (filter: "all" | FontCategory) => void;
}

export default function FontPickerTab({
  theme,
  setTheme,
  fontSubTab,
  setFontSubTab,
  fontCategoryFilter,
  setFontCategoryFilter,
}: FontPickerTabProps) {
  const filteredFonts = WEDDING_FONTS.filter((f) => {
    if (fontCategoryFilter === "all") return true;
    return f.category === fontCategoryFilter;
  });

  return (
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
          {(
            [
              { id: "all" as const, label: `Semua (${WEDDING_FONTS.length})` },
              { id: "serif" as const, label: "Serif Editorial" },
              { id: "script" as const, label: "Script Kaligrafi" },
              { id: "sans" as const, label: "Modern Sans" },
            ]
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFontCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-full border transition-all ${
                fontCategoryFilter === cat.id
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
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
  );
}
