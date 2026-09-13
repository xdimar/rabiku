import { useState, useCallback } from "react";
import {
  WeddingThemeConfig,
  defaultThemeConfig,
  FontCategory,
} from "@/config/theme.config";

type TabKey = "presets" | "fonts" | "style" | "colors";

interface UseTypographyStateOptions {
  isOpen: boolean;
  currentTheme?: WeddingThemeConfig;
  onSave: (newTheme: WeddingThemeConfig) => Promise<void> | void;
  onClose: () => void;
}

export function useTypographyState({
  isOpen,
  currentTheme,
  onSave,
  onClose,
}: UseTypographyStateOptions) {
  const [activeTab, setActiveTab] = useState<TabKey>("presets");
  const [theme, setTheme] = useState<WeddingThemeConfig>({
    ...defaultThemeConfig,
    ...(currentTheme || {}),
  });

  const [prevTheme, setPrevTheme] = useState(currentTheme);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen || currentTheme !== prevTheme) {
    setPrevIsOpen(isOpen);
    setPrevTheme(currentTheme);
    if (isOpen) {
      setTheme({
        ...defaultThemeConfig,
        ...(currentTheme || {}),
      });
    }
  }

  const [fontSubTab, setFontSubTab] = useState<"heading" | "body" | "accent">("heading");
  const [fontCategoryFilter, setFontCategoryFilter] = useState<"all" | FontCategory>("all");
  const [colorSubTab, setColorSubTab] = useState<"heading" | "body" | "accent">("heading");
  const [isSaving, setIsSaving] = useState(false);

  const handleReset = useCallback(() => {
    setTheme({ ...defaultThemeConfig });
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(theme);
      onClose();
    } catch (err) {
      console.error("Failed to save typography settings:", err);
    } finally {
      setIsSaving(false);
    }
  }, [theme, onSave, onClose]);

  return {
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
  };
}

export type { TabKey };
