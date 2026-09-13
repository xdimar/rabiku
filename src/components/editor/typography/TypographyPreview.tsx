import React from "react";
import { Eye } from "lucide-react";
import {
  WeddingThemeConfig,
  WEDDING_FONTS,
  HeadingScale,
  BodyScale,
  LetterSpacingOption,
} from "@/config/theme.config";

interface TypographyPreviewProps {
  theme: WeddingThemeConfig;
  groomName: string;
  brideName: string;
}

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

export default function TypographyPreview({
  theme,
  groomName,
  brideName,
}: TypographyPreviewProps) {
  const headingFontMeta = WEDDING_FONTS.find((f) => f.id === theme.headingFont);
  const bodyFontMeta = WEDDING_FONTS.find((f) => f.id === theme.bodyFont);
  const accentFontMeta = WEDDING_FONTS.find((f) => f.id === theme.accentFont);

  const previewHeadingFontFamily = `'${theme.headingFont}', ${headingFontMeta?.fallback || "serif"}`;
  const previewBodyFontFamily = `'${theme.bodyFont}', ${bodyFontMeta?.fallback || "sans-serif"}`;
  const previewAccentFontFamily = `'${theme.accentFont}', ${accentFontMeta?.fallback || "cursive"}`;

  return (
    <div className="px-6 py-4 bg-stone-100/70 border-b border-stone-200/70">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          Pratinjau Langsung Tipografi &amp; Warna
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
  );
}
