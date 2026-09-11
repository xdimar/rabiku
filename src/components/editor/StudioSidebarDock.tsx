"use client";

import React, { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import {
  Palette,
  Music,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GripVertical,
  ArrowLeftRight,
  RotateCcw,
} from "lucide-react";

interface StudioSidebarDockProps {
  onOpenTypography: () => void;
  onOpenAudio: () => void;
  onOpenGuest: () => void;
  onOpenRSVP: () => void;
  hasAudio?: boolean;
}

export default function StudioSidebarDock({
  onOpenTypography,
  onOpenAudio,
  onOpenGuest,
  onOpenRSVP,
  hasAudio = false,
}: StudioSidebarDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dockSide, setDockSide] = useState<"right" | "left">("right");
  const [resetKey, setResetKey] = useState(0);
  const dragControls = useDragControls();

  const tools = [
    {
      id: "typography",
      label: "Tipografi & Warna",
      sublabel: "17 Font & Palet Tema",
      icon: Palette,
      onClick: onOpenTypography,
      badge: null,
      accentColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      id: "audio",
      label: "Musik Latar",
      sublabel: "Katalog Lagu & MP3",
      icon: Music,
      onClick: onOpenAudio,
      badge: hasAudio ? "Aktif" : null,
      accentColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "guests",
      label: "Kelola Tamu & WA",
      sublabel: "Generator Link Personal",
      icon: Users,
      onClick: onOpenGuest,
      badge: null,
      accentColor: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      id: "rsvp",
      label: "Rekap RSVP",
      sublabel: "Kehadiran & Buku Tamu",
      icon: BarChart3,
      onClick: onOpenRSVP,
      badge: null,
      accentColor: "text-violet-700 bg-violet-50 border-violet-200",
    },
  ];

  const handleToggleSide = () => {
    setDockSide((prev) => (prev === "right" ? "left" : "right"));
    setResetKey((k) => k + 1);
  };

  const handleReset = () => {
    setResetKey((k) => k + 1);
  };

  return (
    <motion.aside
      key={resetKey}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.08}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        cursor: "grabbing",
      }}
      aria-label="Bilah Alat Undangan"
      className={`fixed ${
        dockSide === "right" ? "right-4" : "left-4"
      } top-1/2 -translate-y-1/2 z-40 select-none transition-[width] duration-200 ease-out ${
        isExpanded ? "w-64" : "w-14"
      }`}
    >
      <div className="flex flex-col bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xl rounded-2xl overflow-hidden">
        {/* Dock Header / Drag Handle & Controls */}
        <div
          onPointerDown={(e) => {
            // Only start drag if not clicking a button
            if ((e.target as HTMLElement).closest("button")) return;
            dragControls.start(e);
          }}
          className="flex items-center justify-between px-2.5 py-2 border-b border-stone-100 bg-stone-50/85 cursor-grab active:cursor-grabbing group/header"
          title="Tahan & geser untuk memindahkan posisi bilah alat"
        >
          {isExpanded ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div
                className="p-1 rounded text-stone-400 group-hover/header:text-stone-700 hover:bg-stone-200/60 transition-colors"
                title="Tahan dan geser bilah alat ke posisi mana saja"
              >
                <GripVertical className="w-3.5 h-3.5 shrink-0" />
              </div>
              <Sparkles className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 truncate">
                Alat Undangan
              </span>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center py-0.5">
              <GripVertical className="w-4 h-4 text-stone-400 group-hover/header:text-stone-800 transition-colors" />
            </div>
          )}

          <div className="flex items-center gap-0.5">
            {/* Quick Toggle: Move to Left / Right side */}
            {isExpanded && (
              <>
                <button
                  type="button"
                  onClick={handleToggleSide}
                  className="p-1 rounded-lg hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors"
                  title={
                    dockSide === "right"
                      ? "Pindahkan ke Sisi Kiri (Bebaskan Menu Kanan)"
                      : "Pindahkan ke Sisi Kanan"
                  }
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1 rounded-lg hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors"
                  title="Reset Posisi ke Awal"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </>
            )}

            {/* Expand / Collapse Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors"
              title={isExpanded ? "Ciutkan Bilah Samping" : "Buka Menu Lengkap"}
            >
              {isExpanded ? (
                dockSide === "right" ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5" />
                )
              ) : dockSide === "right" ? (
                <ChevronLeft className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Dock Tools List */}
        <div className="p-1.5 space-y-1">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div key={tool.id} className="relative group">
                <button
                  type="button"
                  onClick={tool.onClick}
                  className={`w-full flex items-center rounded-xl transition-all duration-150 text-left ${
                    isExpanded
                      ? "gap-3 px-3 py-2.5 hover:bg-stone-100 text-stone-800"
                      : "justify-center p-2.5 hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200/70 flex items-center justify-center shrink-0 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all shadow-2xs">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {isExpanded && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {tool.label}
                        </p>
                        {tool.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 truncate">
                        {tool.sublabel}
                      </p>
                    </div>
                  )}
                </button>

                {/* Floating Tooltip when Collapsed (adapts depending on left vs right side) */}
                {!isExpanded && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col items-start px-3 py-1.5 rounded-xl bg-stone-900 text-white shadow-xl pointer-events-none z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 ${
                      dockSide === "right"
                        ? "right-full mr-2.5"
                        : "left-full ml-2.5"
                    }`}
                  >
                    <span className="text-xs font-semibold">{tool.label}</span>
                    <span className="text-[10px] text-stone-400">
                      {tool.sublabel}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info when expanded */}
        {isExpanded && (
          <div className="px-3 py-2 border-t border-stone-100 bg-stone-50/50 text-[10px] text-stone-400 flex items-center justify-between">
            <span>Bisa digeser bebas</span>
            <button
              type="button"
              onClick={handleToggleSide}
              className="text-[10px] text-stone-600 hover:text-stone-900 font-medium underline underline-offset-2"
            >
              Pindah {dockSide === "right" ? "ke Kiri" : "ke Kanan"}
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
