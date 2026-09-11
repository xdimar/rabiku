"use client";

import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig, defaultInvitationData, type InvitationData } from "@/config/puck.config";
import { saveInvitationLayout } from "@/app/actions/invitation";
import { useState, useCallback, useMemo } from "react";
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
} from "lucide-react";
import GuestManagerModal from "@/components/editor/GuestManagerModal";
import RSVPManagerModal from "@/components/editor/RSVPManagerModal";
import AudioSettingsModal from "@/components/editor/AudioSettingsModal";
import TypographySettingsModal from "@/components/editor/TypographySettingsModal";
import StudioSidebarDock from "@/components/editor/StudioSidebarDock";
import { type WeddingThemeConfig } from "@/config/theme.config";

interface EditorClientProps {
  invitationId: string;
  initialData: unknown;
  invitationTitle: string;
  initialAudioUrl?: string | null;
}

export default function EditorClient({
  invitationId,
  initialData,
  invitationTitle,
  initialAudioUrl,
}: EditorClientProps) {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isTypographyModalOpen, setIsTypographyModalOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);

  const previewSlug = invitationId === "demo" ? "preview-demo" : invitationId;

  // Ensure data always has valid content array with default template fallback
  const initialValidData: InvitationData = useMemo(() => {
    const parsed = initialData as InvitationData | null | undefined;
    if (parsed && Array.isArray(parsed.content)) {
      return parsed;
    }
    return defaultInvitationData;
  }, [initialData]);

  const [dataState, setDataState] = useState<InvitationData>(initialValidData);

  // Extract couple names from CoverHero if present
  const { groomName, brideName } = useMemo(() => {
    const coverItem = dataState.content?.find((c) => c.type === "CoverHero");
    const groom = (coverItem?.props as { groomName?: string })?.groomName || "Raden";
    const bride = (coverItem?.props as { brideName?: string })?.brideName || "Kirana";
    return { groomName: groom, brideName: bride };
  }, [dataState]);

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
        config={puckConfig}
        data={dataState}
        onPublish={handlePublish}
        headerTitle={invitationTitle}
        headerPath={`/editor/${invitationId}`}
        viewports={[
          { width: 390, height: "auto", icon: "Smartphone", label: "Mobile" },
          { width: 768, height: "auto", icon: "Tablet", label: "Tablet" },
          { width: 1200, height: "auto", icon: "Monitor", label: "Desktop" },
        ]}
        overrides={{
          headerActions: ({ children }) => (
            <div className="flex items-center gap-2">
              {saveStatus && (
                <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {saveStatus}
                </span>
              )}
              {isSaving && (
                <span className="flex items-center gap-1 text-xs text-stone-600 font-medium px-2 py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </span>
              )}

              {/* Quick Tools Dropdown (Compact Header Access) */}
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
                    className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
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
                  </div>
                )}
              </div>

              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs"
                title="Kembali ke Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Live Preview Button */}
              <Link
                href={`/${previewSlug}?to=Tamu+Undangan`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Preview</span>
              </Link>

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
        hasAudio={Boolean(audioUrl)}
      />

      {/* Typography & Color Studio Modal */}
      <TypographySettingsModal
        isOpen={isTypographyModalOpen}
        onClose={() => setIsTypographyModalOpen(false)}
        currentTheme={(dataState.root?.props as { themeConfig?: WeddingThemeConfig })?.themeConfig}
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
      />
    </div>
  );
}
