import React from "react";
import { Check } from "lucide-react";
import {
  WeddingThemeConfig,
  COLOR_SWATCHES,
} from "@/config/theme.config";
import { isValidHexColor } from "@/lib/validation";

interface ColorTabProps {
  theme: WeddingThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<WeddingThemeConfig>>;
  colorSubTab: "heading" | "body" | "accent";
  setColorSubTab: (tab: "heading" | "body" | "accent") => void;
}

export default function ColorTab({
  theme,
  setTheme,
  colorSubTab,
  setColorSubTab,
}: ColorTabProps) {
  const currentColor =
    colorSubTab === "heading"
      ? theme.headingColor
      : colorSubTab === "body"
      ? theme.bodyColor
      : theme.accentColor;

  const updateColor = (newHex: string) => {
    // Only update if it's a valid hex color or partial input (user is typing)
    const isPartial = newHex.startsWith("#") && newHex.length <= 7;
    if (!isPartial && !isValidHexColor(newHex)) return;

    if (colorSubTab === "heading") {
      setTheme((prev) => ({ ...prev, headingColor: newHex, presetId: undefined }));
    } else if (colorSubTab === "body") {
      setTheme((prev) => ({ ...prev, bodyColor: newHex, presetId: undefined }));
    } else {
      setTheme((prev) => ({ ...prev, accentColor: newHex, presetId: undefined }));
    }
  };

  return (
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

        {/* Curated Swatches Grid */}
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
    </div>
  );
}
