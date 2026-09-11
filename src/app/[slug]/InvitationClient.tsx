"use client";

import { useState } from "react";
import { Render, type Data } from "@puckeditor/core";
import { puckConfig, defaultInvitationData } from "@/config/puck.config";
import EnvelopeCover from "@/components/invitation/EnvelopeCover";
import AudioPlayer from "@/components/invitation/AudioPlayer";
import { ToastProvider } from "@/components/ui/Toast";
import { Heart } from "lucide-react";
import { getThemeStyles, type WeddingThemeConfig } from "@/config/theme.config";

interface InvitationClientProps {
  invitation: {
    id: string;
    slug: string;
    groomName: string;
    brideName: string;
    layoutData: unknown;
    audioUrl: string | null;
    guestbook: unknown[];
  };
  guestName: string | null;
}

export default function InvitationClient({
  invitation,
  guestName,
}: InvitationClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const layoutData =
    (invitation.layoutData as Data)?.content?.length > 0
      ? (invitation.layoutData as Data)
      : defaultInvitationData;

  const themeConfig = (layoutData.root?.props as { themeConfig?: WeddingThemeConfig })?.themeConfig;
  const themeStyles = getThemeStyles(themeConfig);

  return (
    <ToastProvider>
      <div data-invitation-root style={themeStyles} className="w-full">
        {/* Envelope Cover Overlay */}
        {!isOpen && (
          <EnvelopeCover
            groomName={invitation.groomName || "Mempelai Pria"}
            brideName={invitation.brideName || "Mempelai Wanita"}
            guestName={guestName ?? undefined}
            onOpen={() => setIsOpen(true)}
          />
        )}

        {/* Audio Player (hidden until envelope opened) */}
        {invitation.audioUrl && (
          <AudioPlayer audioUrl={invitation.audioUrl} />
        )}

        {/* Main Invitation Content */}
        <main
          className={`min-h-screen bg-stone-50 transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Render config={puckConfig} data={layoutData} />

        {/* Footer */}
        <footer className="py-12 px-6 bg-white border-t border-stone-200/60">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-stone-200" />
              <Heart className="w-4 h-4 text-stone-300" />
              <div className="w-8 h-px bg-stone-200" />
            </div>
            <p className="font-serif text-lg text-stone-700 mb-1">
              {invitation.groomName} & {invitation.brideName}
            </p>
            <p className="text-xs text-stone-400">
              Terima kasih atas doa restu Anda
            </p>
            <p className="text-[10px] text-stone-300 mt-6">
              Dibuat dengan{" "}
              <span className="text-stone-400">Rabiku</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  </ToastProvider>
);
}
