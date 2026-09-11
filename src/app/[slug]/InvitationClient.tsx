"use client";

import { useState } from "react";
import { Render, type Data } from "@puckeditor/core";
import { puckConfig, defaultInvitationData } from "@/config/puck.config";
import EnvelopeCover from "@/components/invitation/EnvelopeCover";
import AudioPlayer from "@/components/invitation/AudioPlayer";
import { ToastProvider } from "@/components/ui/Toast";
import { Heart, Sparkles } from "lucide-react";
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
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col items-center">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100/90 hover:bg-stone-900 border border-stone-200/80 hover:border-stone-900 transition-all duration-300 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-400 transition-colors" />
                <span className="text-xs font-medium text-stone-600 group-hover:text-white transition-colors">
                  Dibuat dengan <strong className="font-semibold text-stone-900 group-hover:text-amber-200">Rabiku</strong>
                </span>
                <span className="text-[11px] text-stone-400 group-hover:text-stone-300 font-medium ml-1">
                  • Buat Undanganmu →
                </span>
              </a>
              <p className="text-[10px] text-stone-400 mt-2">
                Platform Undangan Pernikahan Digital Elegan &amp; Bebas Desain
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  </ToastProvider>
);
}
