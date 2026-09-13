"use client";

import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig, defaultInvitationData, type InvitationData } from "@/config/puck.config";
import { saveInvitationLayout, getRSVPSummary } from "@/app/actions/invitation";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Check,
  Loader2,
  Users,
  BarChart3,
  Music,
  Palette,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Undo2,
  Redo2,
  Share2,
} from "lucide-react";
import GuestManagerModal from "@/components/editor/GuestManagerModal";
import RSVPManagerModal from "@/components/editor/RSVPManagerModal";
import AudioSettingsModal from "@/components/editor/AudioSettingsModal";
import TypographySettingsModal from "@/components/editor/TypographySettingsModal";
import StudioSidebarDock from "@/components/editor/StudioSidebarDock";
import ShareModal from "@/components/editor/ShareModal";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import {
  type WeddingThemeConfig,
  getThemeStyles,
  defaultThemeConfig,
} from "@/config/theme.config";

interface EditorClientProps {
  invitationId: string;
  slug?: string | null;
  initialData: unknown;
  invitationTitle: string;
  initialAudioUrl?: string | null;
}

export default function EditorClient({
  invitationId,
  slug,
  initialData,
  invitationTitle,
  initialAudioUrl,
}: EditorClientProps) {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isTypographyModalOpen, setIsTypographyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [newRsvpCount, setNewRsvpCount] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);

  const previewSlug = invitationId === "demo" ? "preview-demo" : (slug || invitationId);

  // Ensure data always has valid content array with default template fallback
  const initialValidData: InvitationData = useMemo(() => {
    const parsed = initialData as InvitationData | null | undefined;
    if (parsed && Array.isArray(parsed.content)) {
      return parsed;
    }
    return defaultInvitationData;
  }, [initialData]);

  const [dataState, setDataState] = useState<InvitationData>(initialValidData);
  const [editorKey, setEditorKey] = useState(0);
  const lastSavedDataRef = useRef<string>(JSON.stringify(initialValidData));

  // Undo / Redo Hook
  const {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<InvitationData>(initialValidData);

  // Extract current active themeConfig
  const currentThemeConfig: WeddingThemeConfig = useMemo(() => {
    return (
      (dataState.root?.props as { themeConfig?: WeddingThemeConfig })
        ?.themeConfig || defaultThemeConfig
    );
  }, [dataState.root?.props]);

  const themeStyles = useMemo(() => {
    return getThemeStyles(currentThemeConfig);
  }, [currentThemeConfig]);

  // Extract couple names from CoverHero if present
  const { groomName, brideName } = useMemo(() => {
    const coverItem = dataState.content?.find((c) => c.type === "CoverHero");
    const groom = (coverItem?.props as { groomName?: string })?.groomName || "Raden";
    const bride = (coverItem?.props as { brideName?: string })?.brideName || "Kirana";
    return { groomName: groom, brideName: bride };
  }, [dataState]);

  // Fetch initial RSVP notification count
  useEffect(() => {
    if (!invitationId || invitationId === "demo") return;
    getRSVPSummary(invitationId)
      .then((res) => {
        if (res?.recentCount) {
          setNewRsvpCount(res.recentCount);
        }
      })
      .catch(() => {});
  }, [invitationId]);

  // Undo Handler
  const handleUndo = useCallback(() => {
    const prev = undo();
    if (prev) {
      setDataState(prev);
      setEditorKey((k) => k + 1);
      setIsDirty(true);
    }
  }, [undo]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    const next = redo();
    if (next) {
      setDataState(next);
      setEditorKey((k) => k + 1);
      setIsDirty(true);
    }
  }, [redo]);

  // Keyboard Shortcuts: Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Puck data change handler
  const handlePuckChange = useCallback(
    (newData: Data) => {
      const invData = newData as InvitationData;
      setDataState(invData);
      pushState(invData);
      setIsDirty(true);
    },
    [pushState]
  );

  // Auto-Save Draft (Every 30 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentJson = JSON.stringify(dataState);
      if (
        currentJson !== lastSavedDataRef.current &&
        !isSaving &&
        invitationId !== "demo"
      ) {
        try {
          const coverItem = dataState.content?.find((c) => c.type === "CoverHero");
          const groom = (coverItem?.props as { groomName?: string })?.groomName;
          const bride = (coverItem?.props as { brideName?: string })?.brideName;

          await saveInvitationLayout(invitationId, {
            layoutData: dataState,
            groomName: groom,
            brideName: bride,
            audioUrl: audioUrl || undefined,
            isPublished: true,
          });
          lastSavedDataRef.current = currentJson;
          setIsDirty(false);
          const time = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setSaveStatus(`Otomatis ${time}`);
          setTimeout(() => setSaveStatus(null), 3500);
        } catch (err) {
          console.error("Auto-save failed:", err);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dataState, invitationId, audioUrl, isSaving]);

  const handlePublish = useCallback(
    async (publishData: Data) => {
      setDataState(publishData as InvitationData);
      setIsSaving(true);
      try {
        const coverItem = publishData.content?.find((c) => c.type === "CoverHero");
        const groom = (coverItem?.props as { groomName?: string })?.groomName;
        const bride = (coverItem?.props as { brideName?: string })?.brideName;

        const result = await saveInvitationLayout(invitationId, {
          layoutData: publishData,
          groomName: groom,
          brideName: bride,
          audioUrl: audioUrl || undefined,
          isPublished: true,
        });
        if (result.success) {
          lastSavedDataRef.current = JSON.stringify(publishData);
          setIsDirty(false);
          const time = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setSaveStatus(`Tersimpan ${time}`);
          setTimeout(() => setSaveStatus(null), 4000);
        }
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [invitationId, audioUrl]
  );

  const handleSaveTheme = async (newTheme: WeddingThemeConfig) => {
    const updatedData: InvitationData = {
      ...dataState,
      root: {
        ...dataState.root,
        props: {
          ...dataState.root?.props,
          themeConfig: newTheme,
        },
      },
    };
    setDataState(updatedData);
    pushState(updatedData);
    setEditorKey((prev) => prev + 1);
    setIsSaving(true);
    try {
      const coverItem = updatedData.content?.find((c) => c.type === "CoverHero");
      const groom = (coverItem?.props as { groomName?: string })?.groomName;
      const bride = (coverItem?.props as { brideName?: string })?.brideName;

      const result = await saveInvitationLayout(invitationId, {
        layoutData: updatedData,
        groomName: groom,
        brideName: bride,
        audioUrl: audioUrl || undefined,
        isPublished: true,
      });
      if (result.success) {
        lastSavedDataRef.current = JSON.stringify(updatedData);
        setIsDirty(false);
        setSaveStatus("Tipografi & Warna Disimpan");
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err) {
      console.error("Failed to save theme:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAudio = async (newUrl: string) => {
    setAudioUrl(newUrl);
    try {
      await saveInvitationLayout(invitationId, {
        layoutData: dataState,
        audioUrl: newUrl,
      });
    } catch (err) {
      console.error("Failed to save audio selection:", err);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-100 flex flex-col">
      <Puck
        key={editorKey}
        config={puckConfig}
        data={dataState}
        onChange={handlePuckChange}
        onPublish={handlePublish}
        headerTitle={invitationTitle}
        headerPath={`/editor/${invitationId}`}
        viewports={[
          { width: 390, height: "auto", icon: "Smartphone", label: "Mobile" },
          { width: 768, height: "auto", icon: "Tablet", label: "Tablet" },
          { width: 1200, height: "auto", icon: "Monitor", label: "Desktop" },
        ]}
        overrides={{
          iframe: ({ children, document: iframeDoc }) => {
            return (
              <div
                data-invitation-root
                style={themeStyles}
                className="w-full min-h-screen"
              >
                {iframeDoc && (
                  <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Cinzel:wght@400..700&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Dancing+Script:wght@400..700&family=Great+Vibes&family=Inter:wght@300..700&family=Jost:wght@300..700&family=Lora:ital,wght@0,400..700;1,400..700&family=MonteCarlo&family=Montserrat:wght@300..700&family=Outfit:wght@300..700&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300..700&family=Prata&display=swap"
                  />
                )}
                {children}
              </div>
            );
          },
          headerActions: ({ children }) => (
            <div className="flex items-center gap-2">
              {/* Undo / Redo Actions */}
              <div className="flex items-center bg-stone-100/90 rounded-md p-0.5 border border-stone-200/80 mr-1">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="p-1.5 rounded text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="p-1.5 rounded text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium px-2 py-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSaving
                      ? "bg-amber-500 animate-pulse"
                      : isDirty
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                  }`}
                />
                <span className="hidden sm:inline">
                  {isSaving
                    ? "Menyimpan..."
                    : saveStatus
                    ? saveStatus
                    : isDirty
                    ? "Belum tersimpan"
                    : "Draft aman"}
                </span>
              </div>

              {/* Quick Tools Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs"
                  title="Menu Cepat Alat Undangan"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Alat</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {isQuickMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setIsQuickMenuOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsTypographyModalOpen(true);
                        setIsQuickMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 text-left transition-colors"
                    >
                      <Palette className="w-4 h-4 text-amber-600" />
                      <span>Tipografi &amp; Warna</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAudioModalOpen(true);
                        setIsQuickMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 text-left transition-colors"
                    >
                      <Music className="w-4 h-4 text-emerald-600" />
                      <span>Musik Latar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsGuestModalOpen(true);
                        setIsQuickMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 text-left transition-colors"
                    >
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Kelola Tamu &amp; WA</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRSVPModalOpen(true);
                        setIsQuickMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 text-left transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 text-violet-600" />
                      <span>Rekap RSVP</span>
                    </button>
                    <div className="h-px bg-stone-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsShareModalOpen(true);
                        setIsQuickMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 text-left transition-colors font-medium"
                    >
                      <Share2 className="w-4 h-4 text-rose-600" />
                      <span>Bagikan Undangan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Share Button (Direct Header Access) */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rose-200 bg-rose-50/70 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-all shadow-xs"
                title="Bagikan Undangan (Link, QR Code, WA)"
              >
                <Share2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Bagikan</span>
              </button>

              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs"
                title="Kembali ke Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Preview Button */}
              <a
                href={`/${previewSlug}?to=Tamu+Undangan`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs"
                title="Buka pratinjau publik undangan di tab baru"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Preview</span>
              </a>

              {children}
            </div>
          ),
        }}
      />

      {/* Floating Studio Sidebar Dock on the Right */}
      <StudioSidebarDock
        onOpenTypography={() => setIsTypographyModalOpen(true)}
        onOpenAudio={() => setIsAudioModalOpen(true)}
        onOpenGuest={() => setIsGuestModalOpen(true)}
        onOpenRSVP={() => setIsRSVPModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        hasAudio={Boolean(audioUrl)}
        newRsvpCount={newRsvpCount}
      />

      {/* Typography & Color Studio Modal */}
      <TypographySettingsModal
        isOpen={isTypographyModalOpen}
        onClose={() => setIsTypographyModalOpen(false)}
        currentTheme={currentThemeConfig}
        onSave={handleSaveTheme}
        groomName={groomName}
        brideName={brideName}
      />

      {/* Background Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        currentAudioUrl={audioUrl}
        onSelectAudio={handleSelectAudio}
      />

      {/* Guest & WhatsApp Blast Modal */}
      <GuestManagerModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        invitationId={invitationId}
        slug={previewSlug}
        groomName={groomName}
        brideName={brideName}
      />

      {/* RSVP & Guestbook Summary Modal */}
      <RSVPManagerModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        invitationId={invitationId}
        slug={previewSlug}
        onStatsUpdate={(stats) => setNewRsvpCount(stats.recentCount)}
      />

      {/* Share Modal (QR, Link, WhatsApp, Social) */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        slug={previewSlug}
        groomName={groomName}
        brideName={brideName}
      />
    </div>
  );
}
