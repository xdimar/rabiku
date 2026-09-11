import React from "react";

/* ─────────────────────────────────────────────
   1. TYPES & INTERFACES
   ───────────────────────────────────────────── */

export type FontCategory = "serif" | "script" | "sans";

export interface FontOption {
  id: string;
  name: string;
  category: FontCategory;
  categoryLabel: string;
  fallback: string;
  sampleText: string;
  description: string;
}

export type HeadingScale = "compact" | "normal" | "large" | "dramatic";
export type BodyScale = "small" | "normal" | "comfortable";
export type LetterSpacingOption = "tight" | "normal" | "wide" | "widest";
export type FontWeightOption = "normal" | "medium" | "semibold" | "bold";

export interface WeddingThemeConfig {
  presetId?: string;

  // Font Families
  headingFont: string;       // e.g. "Cormorant Garamond", "Cinzel", "Great Vibes"
  bodyFont: string;          // e.g. "Plus Jakarta Sans", "Montserrat", "Lora"
  accentFont: string;        // e.g. "Great Vibes", "Pinyon Script", "Alex Brush"

  // Font Sizing Scales
  headingSizeScale: HeadingScale; // 0.88, 1.0, 1.15, 1.30
  bodySizeScale: BodyScale;       // 0.90, 1.0, 1.10

  // Font Styles & Variations
  headingStyle: "normal" | "italic";
  headingWeight: FontWeightOption;
  headingTransform: "none" | "uppercase";
  letterSpacing: LetterSpacingOption;

  // Font Colors
  headingColor: string; // e.g. "#1c1917"
  bodyColor: string;    // e.g. "#57534e"
  accentColor: string;  // e.g. "#a8a29e"
}

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  previewHeadingColor: string;
  previewAccentColor: string;
  config: WeddingThemeConfig;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  category: "monochrome" | "gold" | "rose" | "earth" | "night";
}

/* ─────────────────────────────────────────────
   2. CURATED WEDDING FONTS (17 GOOGLE FONTS)
   ───────────────────────────────────────────── */

export const WEDDING_FONTS: FontOption[] = [
  // ── Serif Anggun & Editorial ──
  {
    id: "Cormorant Garamond",
    name: "Cormorant Garamond",
    category: "serif",
    categoryLabel: "Serif Editorial",
    fallback: "serif",
    sampleText: "Raden & Kirana",
    description: "Klasik Quiet Luxury, puitis, dan tak lekang oleh waktu.",
  },
  {
    id: "Playfair Display",
    name: "Playfair Display",
    category: "serif",
    categoryLabel: "Serif Editorial",
    fallback: "serif",
    sampleText: "Raden & Kirana",
    description: "Kontras garis tegas ala majalah high-fashion dunia.",
  },
  {
    id: "Cinzel",
    name: "Cinzel",
    category: "serif",
    categoryLabel: "Serif Megah",
    fallback: "serif",
    sampleText: "RADEN & KIRANA",
    description: "Terinspirasi prasasti Romawi klasik, sangat megah & berwibawa.",
  },
  {
    id: "Prata",
    name: "Prata",
    category: "serif",
    categoryLabel: "Serif Anggun",
    fallback: "serif",
    sampleText: "Raden & Kirana",
    description: "Gaya Didone Prancis modern yang anggun dan elok.",
  },
  {
    id: "Lora",
    name: "Lora",
    category: "serif",
    categoryLabel: "Serif Kaligrafis",
    fallback: "serif",
    sampleText: "Raden & Kirana",
    description: "Serif dengan kurva kaligrafi yang hangat dan nyaman dibaca.",
  },
  {
    id: "Bodoni Moda",
    name: "Bodoni Moda",
    category: "serif",
    categoryLabel: "Serif Haute Couture",
    fallback: "serif",
    sampleText: "Raden & Kirana",
    description: "Kemewahan haute couture Italia dengan ketegasan visual.",
  },

  // ── Script & Kaligrafi Romantis ──
  {
    id: "Great Vibes",
    name: "Great Vibes",
    category: "script",
    categoryLabel: "Script Kaligrafi",
    fallback: "cursive",
    sampleText: "Raden & Kirana",
    description: "Goresan kaligrafi bersambung yang luwes, mewah, dan romantis.",
  },
  {
    id: "Alex Brush",
    name: "Alex Brush",
    category: "script",
    categoryLabel: "Script Kuas Halus",
    fallback: "cursive",
    sampleText: "Raden & Kirana",
    description: "Goresan kuas halus yang teratur, sangat elegan untuk nama pengantin.",
  },
  {
    id: "Pinyon Script",
    name: "Pinyon Script",
    category: "script",
    categoryLabel: "Script Aristokrat",
    fallback: "cursive",
    sampleText: "Raden & Kirana",
    description: "Gaya penulisan tangan istana Eropa abad ke-19 bernuansa vintage.",
  },
  {
    id: "Dancing Script",
    name: "Dancing Script",
    category: "script",
    categoryLabel: "Script Manis",
    fallback: "cursive",
    sampleText: "Raden & Kirana",
    description: "Gaya kaligrafi yang lincah, akrab, ceria, dan bersahabat.",
  },
  {
    id: "MonteCarlo",
    name: "MonteCarlo",
    category: "script",
    categoryLabel: "Script Ornamen",
    fallback: "cursive",
    sampleText: "Raden & Kirana",
    description: "Kaligrafi kaya ornamen flourish tradisional yang memukau.",
  },
  {
    id: "Parisienne",
    name: "Parisienne",
    category: "script",
    categoryLabel: "Script Romantis",
    fallback: "cursive",
    sampleText: "Raden & Kirana",
    description: "Pesona khas butik mode Paris yang anggun dan feminin.",
  },

  // ── Modern Sans Minimalis ──
  {
    id: "Plus Jakarta Sans",
    name: "Plus Jakarta Sans",
    category: "sans",
    categoryLabel: "Modern Sans",
    fallback: "sans-serif",
    sampleText: "Raden & Kirana",
    description: "Geometris bersih khas modernis kontemporer, sangat rapi.",
  },
  {
    id: "Montserrat",
    name: "Montserrat",
    category: "sans",
    categoryLabel: "Arsitektural Sans",
    fallback: "sans-serif",
    sampleText: "RADEN & KIRANA",
    description: "Tegas, kokoh, dan modern, cocok untuk gaya minimalis berani.",
  },
  {
    id: "Outfit",
    name: "Outfit",
    category: "sans",
    categoryLabel: "Contemporary Sans",
    fallback: "sans-serif",
    sampleText: "Raden & Kirana",
    description: "Sudut huruf lembut yang memberi kesan ramah dan mutakhir.",
  },
  {
    id: "Inter",
    name: "Inter",
    category: "sans",
    categoryLabel: "Clean Sans",
    fallback: "sans-serif",
    sampleText: "Raden & Kirana",
    description: "Keterbacaan sempurna di segala ukuran layar smartphone.",
  },
  {
    id: "Jost",
    name: "Jost",
    category: "sans",
    categoryLabel: "Bauhaus Sans",
    fallback: "sans-serif",
    sampleText: "Raden & Kirana",
    description: "Harmoni proporsi Bauhaus Jerman, simetris dan abadi.",
  },
];

/* ─────────────────────────────────────────────
   3. CURATED COLOR SWATCHES
   ───────────────────────────────────────────── */

export const COLOR_SWATCHES: ColorSwatch[] = [
  // ── Monokrom & Stone ──
  { name: "Obsidian Black", hex: "#0a0a0a", category: "monochrome" },
  { name: "Stone 900 (Arang)", hex: "#1c1917", category: "monochrome" },
  { name: "Deep Charcoal", hex: "#262626", category: "monochrome" },
  { name: "Slate Grey", hex: "#334155", category: "monochrome" },
  { name: "Stone 600 (Abu Elegan)", hex: "#57534e", category: "monochrome" },
  { name: "Muted Stone", hex: "#78716c", category: "monochrome" },

  // ── Royal Gold & Champagne ──
  { name: "Royal Gold", hex: "#b4975a", category: "gold" },
  { name: "Soft Champagne", hex: "#cfb997", category: "gold" },
  { name: "Antique Brass", hex: "#997b3e", category: "gold" },
  { name: "Warm Ochre", hex: "#b8860b", category: "gold" },
  { name: "Bronze Glow", hex: "#7c5a36", category: "gold" },

  // ── Romantic Rose & Berry ──
  { name: "Dusty Rose", hex: "#9b5c6b", category: "rose" },
  { name: "Rose Gold", hex: "#b76e79", category: "rose" },
  { name: "Velvet Mauve", hex: "#784c58", category: "rose" },
  { name: "Deep Burgundy", hex: "#5c1d2e", category: "rose" },
  { name: "Soft Blush", hex: "#c48b9f", category: "rose" },

  // ── Botanical & Earth ──
  { name: "Deep Forest", hex: "#1e3a2b", category: "earth" },
  { name: "Sage Moss", hex: "#4a5d4e", category: "earth" },
  { name: "Warm Terracotta", hex: "#9c5238", category: "earth" },
  { name: "Muted Olive", hex: "#556b2f", category: "earth" },
  { name: "Warm Sand", hex: "#857463", category: "earth" },

  // ── Midnight & Sapphire ──
  { name: "Midnight Slate", hex: "#0f172a", category: "night" },
  { name: "Deep Sapphire", hex: "#1e3a5f", category: "night" },
  { name: "Royal Twilight", hex: "#24293e", category: "night" },
  { name: "Classic Navy", hex: "#1e293b", category: "night" },
];

/* ─────────────────────────────────────────────
   4. CURATED 1-CLICK THEME PRESETS
   ───────────────────────────────────────────── */

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury Monokrom",
    tagline: "Minimalis, anggun, & tenang",
    badge: "Bawaan",
    previewHeadingColor: "#1c1917",
    previewAccentColor: "#a8a29e",
    config: {
      presetId: "quiet-luxury",
      headingFont: "Cormorant Garamond",
      bodyFont: "Plus Jakarta Sans",
      accentFont: "Great Vibes",
      headingSizeScale: "normal",
      bodySizeScale: "normal",
      headingStyle: "normal",
      headingWeight: "semibold",
      headingTransform: "none",
      letterSpacing: "normal",
      headingColor: "#1c1917",
      bodyColor: "#57534e",
      accentColor: "#a8a29e",
    },
  },
  {
    id: "royal-champagne",
    name: "Royal Champagne & Gold",
    tagline: "Kemegahan megah berpadu sentuhan emas",
    badge: "Mewah",
    previewHeadingColor: "#b4975a",
    previewAccentColor: "#cfb997",
    config: {
      presetId: "royal-champagne",
      headingFont: "Cinzel",
      bodyFont: "Montserrat",
      accentFont: "Pinyon Script",
      headingSizeScale: "large",
      bodySizeScale: "normal",
      headingStyle: "normal",
      headingWeight: "semibold",
      headingTransform: "uppercase",
      letterSpacing: "wide",
      headingColor: "#b4975a",
      bodyColor: "#4a3b2c",
      accentColor: "#cfb997",
    },
  },
  {
    id: "romantic-blush",
    name: "Romansa Kaligrafi & Rose",
    tagline: "Kaligrafi bersambung berbalut dusty rose",
    badge: "Romantis",
    previewHeadingColor: "#9b5c6b",
    previewAccentColor: "#b76e79",
    config: {
      presetId: "romantic-blush",
      headingFont: "Great Vibes",
      bodyFont: "Lora",
      accentFont: "Alex Brush",
      headingSizeScale: "dramatic",
      bodySizeScale: "normal",
      headingStyle: "normal",
      headingWeight: "normal",
      headingTransform: "none",
      letterSpacing: "normal",
      headingColor: "#9b5c6b",
      bodyColor: "#443a3d",
      accentColor: "#b76e79",
    },
  },
  {
    id: "botanical-sage",
    name: "Botanical Garden & Sage",
    tagline: "Harmoni alam hijau hutan & kehangatan bumi",
    badge: "Alami",
    previewHeadingColor: "#1e3a2b",
    previewAccentColor: "#4a5d4e",
    config: {
      presetId: "botanical-sage",
      headingFont: "Prata",
      bodyFont: "Jost",
      accentFont: "Dancing Script",
      headingSizeScale: "normal",
      bodySizeScale: "normal",
      headingStyle: "normal",
      headingWeight: "semibold",
      headingTransform: "none",
      letterSpacing: "normal",
      headingColor: "#1e3a2b",
      bodyColor: "#404a44",
      accentColor: "#4a5d4e",
    },
  },
  {
    id: "vintage-editorial",
    name: "Vintage Editorial Vogue",
    tagline: "Tipografi majalah mode dengan kontras dramatis",
    badge: "Editorial",
    previewHeadingColor: "#262626",
    previewAccentColor: "#857463",
    config: {
      presetId: "vintage-editorial",
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      accentFont: "MonteCarlo",
      headingSizeScale: "large",
      bodySizeScale: "normal",
      headingStyle: "italic",
      headingWeight: "bold",
      headingTransform: "none",
      letterSpacing: "normal",
      headingColor: "#262626",
      bodyColor: "#57534e",
      accentColor: "#857463",
    },
  },
  {
    id: "midnight-starlight",
    name: "Midnight Starlight & Navy",
    tagline: "Keheningan malam bernuansa sapphire & slate",
    badge: "Modern",
    previewHeadingColor: "#0f172a",
    previewAccentColor: "#334155",
    config: {
      presetId: "midnight-starlight",
      headingFont: "Bodoni Moda",
      bodyFont: "Outfit",
      accentFont: "Parisienne",
      headingSizeScale: "normal",
      bodySizeScale: "normal",
      headingStyle: "normal",
      headingWeight: "semibold",
      headingTransform: "none",
      letterSpacing: "wide",
      headingColor: "#0f172a",
      bodyColor: "#334155",
      accentColor: "#64748b",
    },
  },
];

/* ─────────────────────────────────────────────
   5. DEFAULT THEME CONFIG
   ───────────────────────────────────────────── */

export const defaultThemeConfig: WeddingThemeConfig = {
  presetId: "quiet-luxury",
  headingFont: "Cormorant Garamond",
  bodyFont: "Plus Jakarta Sans",
  accentFont: "Great Vibes",
  headingSizeScale: "normal",
  bodySizeScale: "normal",
  headingStyle: "normal",
  headingWeight: "semibold",
  headingTransform: "none",
  letterSpacing: "normal",
  headingColor: "#1c1917",
  bodyColor: "#57534e",
  accentColor: "#a8a29e",
};

/* ─────────────────────────────────────────────
   6. CSS VARIABLE GENERATOR
   ───────────────────────────────────────────── */

export function getThemeStyles(theme?: Partial<WeddingThemeConfig>): React.CSSProperties {
  const t: WeddingThemeConfig = { ...defaultThemeConfig, ...(theme || {}) };

  const headingScaleMap: Record<HeadingScale, string> = {
    compact: "0.88",
    normal: "1",
    large: "1.15",
    dramatic: "1.32",
  };

  const bodyScaleMap: Record<BodyScale, string> = {
    small: "0.92",
    normal: "1",
    comfortable: "1.08",
  };

  const letterSpacingMap: Record<LetterSpacingOption, string> = {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.08em",
    widest: "0.2em",
  };

  const weightMap: Record<FontWeightOption, string> = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  };

  // Find fallback
  const headingFontMeta = WEDDING_FONTS.find((f) => f.id === t.headingFont);
  const bodyFontMeta = WEDDING_FONTS.find((f) => f.id === t.bodyFont);
  const accentFontMeta = WEDDING_FONTS.find((f) => f.id === t.accentFont);

  const headingFontFamily = `'${t.headingFont}', ${headingFontMeta?.fallback || "serif"}`;
  const bodyFontFamily = `'${t.bodyFont}', ${bodyFontMeta?.fallback || "sans-serif"}`;
  const accentFontFamily = `'${t.accentFont || "Great Vibes"}', ${accentFontMeta?.fallback || "cursive"}`;

  return {
    "--theme-heading-font": headingFontFamily,
    "--theme-body-font": bodyFontFamily,
    "--theme-accent-font": accentFontFamily,
    "--theme-heading-scale": headingScaleMap[t.headingSizeScale] || "1",
    "--theme-body-scale": bodyScaleMap[t.bodySizeScale] || "1",
    "--theme-heading-style": t.headingStyle || "normal",
    "--theme-heading-weight": weightMap[t.headingWeight] || "600",
    "--theme-heading-transform": t.headingTransform || "none",
    "--theme-letter-spacing": letterSpacingMap[t.letterSpacing] || "0em",
    "--theme-heading-color": t.headingColor || "#1c1917",
    "--theme-body-color": t.bodyColor || "#57534e",
    "--theme-accent-color": t.accentColor || "#a8a29e",
  } as React.CSSProperties;
}
