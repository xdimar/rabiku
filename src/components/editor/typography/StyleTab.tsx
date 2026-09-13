import React from "react";
import { Italic, Bold, Type } from "lucide-react";
import {
  WeddingThemeConfig,
  FontWeightOption,
} from "@/config/theme.config";

interface StyleTabProps {
  theme: WeddingThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<WeddingThemeConfig>>;
}

export default function StyleTab({ theme, setTheme }: StyleTabProps) {
  return (
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
          {([
            { id: "compact", label: "Ringkas (88%)", desc: "Minimalis & Kalem" },
            { id: "normal", label: "Standar (100%)", desc: "Proporsional" },
            { id: "large", label: "Megah (115%)", desc: "Elegan Menawan" },
            { id: "dramatic", label: "Dramatis (132%)", desc: "High-Impact XL" },
          ] as const).map((scale) => (
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
              <p className={`text-[10px] mt-0.5 ${
                theme.headingSizeScale === scale.id ? "text-stone-300" : "text-stone-400"
              }`}>
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
          {([
            { id: "small", label: "Kecil (92%)", desc: "Kompak" },
            { id: "normal", label: "Standar (100%)", desc: "Seimbang" },
            { id: "comfortable", label: "Nyaman (108%)", desc: "Mudah Dibaca" },
          ] as const).map((bScale) => (
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
              <p className={`text-[10px] mt-0.5 ${
                theme.bodySizeScale === bScale.id ? "text-stone-300" : "text-stone-400"
              }`}>
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
          {([
            { id: "tight", label: "Rapat (-0.02em)", desc: "Intim & Padat" },
            { id: "normal", label: "Standar (0em)", desc: "Seimbang Alami" },
            { id: "wide", label: "Renggang (+0.08em)", desc: "Elegan Anggun" },
            { id: "widest", label: "Sangat Renggang (+0.2em)", desc: "Luxe Editorial" },
          ] as const).map((spacing) => (
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
              <p className={`text-[10px] mt-0.5 ${
                theme.letterSpacing === spacing.id ? "text-stone-300" : "text-stone-400"
              }`}>
                {spacing.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
