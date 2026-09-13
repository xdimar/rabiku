"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Music,
  MapPin,
  Clock,
  Heart,
  Send,
  CreditCard,
  Smartphone,
  Eye,
  Check,
  MousePointer,
  Maximize2,
  ChevronRight,
  Layers,
  Flame,
} from "lucide-react";

interface PaletteItem {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  previewTitle: string;
  previewDesc: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    id: "countdown",
    name: "Hitung Mundur",
    category: "Waktu",
    icon: Clock,
    previewTitle: "Menuju Hari Bahagia",
    previewDesc: "128 Hari : 14 Jam : 22 Menit",
  },
  {
    id: "location",
    name: "Lokasi & Maps",
    category: "Acara",
    icon: MapPin,
    previewTitle: "Akad & Resepsi",
    previewDesc: "Grand Ballroom Hotel Indonesia Kempinski",
  },
  {
    id: "rsvp",
    name: "RSVP & Tamu",
    category: "Interaktif",
    icon: Send,
    previewTitle: "Konfirmasi Kehadiran",
    previewDesc: "Form interaktif tamu & ucapan doa",
  },
  {
    id: "gift",
    name: "Amplop Digital",
    category: "Fitur",
    icon: CreditCard,
    previewTitle: "Kado Nikah & QRIS",
    previewDesc: "BCA 8291029100 a/n Sarah",
  },
];

export interface EditorSimulationProps {
  groomName?: string;
  brideName?: string;
}

export default function EditorSimulation({
  groomName = "Sarah",
  brideName = "Budi",
}: EditorSimulationProps) {
  const cleanGroom = (groomName || "Sarah").trim();
  const cleanBride = (brideName || "Budi").trim();
  const slug = `${cleanGroom.toLowerCase().replace(/[^a-z0-9]/g, "")}-${cleanBride.toLowerCase().replace(/[^a-z0-9]/g, "")}` || "undangan-kita";
  const hashtag = `#${cleanGroom.replace(/[^a-zA-Z0-9]/g, "")}${cleanBride.replace(/[^a-zA-Z0-9]/g, "")}Selamanya`;

  // Animation stage:
  // 0: Idle pointer moving to palette
  // 1: Grabbing block
  // 2: Dragging block to canvas
  // 3: Dropping into canvas
  // 4: Component expanded & success badge
  const [stage, setStage] = useState<number>(0);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [addedItems, setAddedItems] = useState<string[]>(["countdown"]);
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet">("mobile");

  const currentItem = PALETTE_ITEMS[activeItemIndex];

  // Auto-play drag and drop simulation cycle
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (stage === 0) {
      timer = setTimeout(() => setStage(1), 1200);
    } else if (stage === 1) {
      timer = setTimeout(() => setStage(2), 800);
    } else if (stage === 2) {
      timer = setTimeout(() => {
        setStage(3);
        setAddedItems((prev) =>
          prev.includes(currentItem.id) ? prev : [...prev, currentItem.id]
        );
      }, 1200);
    } else if (stage === 3) {
      timer = setTimeout(() => setStage(4), 800);
    } else if (stage === 4) {
      timer = setTimeout(() => {
        // Move to next item or reset
        setActiveItemIndex((prev) => (prev + 1) % PALETTE_ITEMS.length);
        setStage(0);
      }, 3600);
    }

    return () => clearTimeout(timer);
  }, [stage, activeItemIndex, currentItem.id]);

  const handleManualSelect = (index: number) => {
    setActiveItemIndex(index);
    setStage(1);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      {/* Ambient background glow behind mockup */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-amber-200/25 via-stone-200/30 to-amber-100/25 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Floating Badges */}
      {/* 1. Top Right - Music Player Indicator */}
      <motion.div
        animate={{
          y: [-4, 4, -4],
          rotate: [-0.5, 0.5, -0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
        className="absolute -top-6 -right-2 sm:-right-6 z-30 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg shadow-stone-900/5 border border-stone-200/80 text-xs text-stone-800"
      >
        <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700">
          <Music className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div>
          <p className="font-semibold text-[11px] text-stone-900">
            Audio Background
          </p>
          <div className="flex items-center gap-1 text-[10px] text-stone-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Akad — Payung Teduh</span>
          </div>
        </div>
        {/* Equalizer animation */}
        <div className="flex items-end gap-0.5 h-4 ml-1">
          <span className="w-1 bg-amber-600 rounded-full animate-[bounce_0.8s_infinite]" />
          <span className="w-1 bg-amber-600 rounded-full animate-[bounce_1.2s_infinite_0.2s]" />
          <span className="w-1 bg-amber-600 rounded-full animate-[bounce_0.9s_infinite_0.4s]" />
        </div>
      </motion.div>

      {/* 2. Bottom Left - Instant WhatsApp Preview */}
      <motion.div
        animate={{
          y: [3, -3, 3],
          rotate: [0.5, -0.5, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className="absolute -bottom-6 -left-2 sm:-left-6 z-30 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-900/95 backdrop-blur-md shadow-xl text-white text-xs"
      >
        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Send className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="font-medium text-[11px] text-stone-200">
            Smart WhatsApp Invite
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">
            Kepada: Yth. Bpk. Hendra & Partner
          </p>
        </div>
      </motion.div>

      {/* Main Studio Editor Window */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-stone-900 shadow-2xl border border-stone-800/80 overflow-hidden">
        {/* Studio Window Header Bar */}
        <div className="h-11 px-4 bg-stone-950/80 border-b border-stone-800/60 flex items-center justify-between text-xs text-stone-400">
          {/* macOS window controls */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-100 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-100 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-100 transition-opacity" />
            <span className="ml-2 text-[11px] text-stone-500 font-mono hidden sm:inline">
              Rabiku Studio Pro
            </span>
          </div>

          {/* Browser Address Mockup */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">rabiku.my.id/{slug}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-stone-900 rounded-lg p-0.5 border border-stone-800">
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-1 rounded transition-colors ${
                  deviceMode === "mobile"
                    ? "bg-stone-800 text-stone-200"
                    : "text-stone-500 hover:text-stone-300"
                }`}
                title="Tampilan Mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
              ● Live Sync
            </span>
          </div>
        </div>

        {/* Editor Workspace: Sidebar Palet + Canvas */}
        <div className="grid grid-cols-12 min-h-[380px] sm:min-h-[440px] bg-stone-900/60">
          {/* Left: Component Palette */}
          <div className="col-span-4 sm:col-span-4 p-3 sm:p-4 border-r border-stone-800/60 bg-stone-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5 text-stone-300 text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Blok Desain</span>
                </div>
                <span className="text-[10px] text-stone-500">Tarik ke kanan</span>
              </div>

              <div className="space-y-2">
                {PALETTE_ITEMS.map((item, idx) => {
                  const isSelected = idx === activeItemIndex;
                  const isDraggingThis = isSelected && stage >= 1 && stage <= 2;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleManualSelect(idx)}
                      className={`relative p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-stone-800/90 border-amber-500/50 shadow-md shadow-amber-500/5"
                          : "bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-amber-400 text-stone-950 font-bold"
                              : "bg-stone-800 text-stone-400 group-hover:text-stone-200"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-medium truncate ${
                              isSelected ? "text-stone-100" : "text-stone-300"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      {/* Visual indicator when being dragged */}
                      {isDraggingThis && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro helper tip at bottom of sidebar */}
            <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/60 text-[10px] text-stone-400 mt-3 hidden sm:block">
              <div className="flex items-center gap-1.5 text-stone-200 font-medium mb-0.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Drag & Drop Mudah</span>
              </div>
              <p className="text-stone-500 text-[10px] leading-tight">
                Pilih komponen & geser ke canvas undangan untuk menambahkan.
              </p>
            </div>
          </div>

          {/* Right: Interactive Canvas Mockup */}
          <div className="col-span-8 sm:col-span-8 p-3 sm:p-5 bg-gradient-to-b from-stone-950/20 to-stone-900/80 flex items-center justify-center relative overflow-hidden">
            {/* Phone Frame Mockup */}
            <div className="w-full max-w-[280px] sm:max-w-[310px] rounded-3xl bg-stone-50 border-4 border-stone-800/80 shadow-2xl p-2.5 relative flex flex-col h-[340px] sm:h-[400px] overflow-hidden">
              {/* Phone speaker notch */}
              <div className="w-20 h-3 bg-stone-800 rounded-full mx-auto mb-2 flex-shrink-0" />

              {/* Scrollable Canvas Content */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-none">
                {/* 1. Header Wedding Hero Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-stone-100 to-white border border-stone-200 text-center relative overflow-hidden">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium">
                    The Wedding Of
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                    {cleanGroom} &amp; {cleanBride}
                  </h4>
                  <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                    Minggu, 12 Desember 2026
                  </p>
                  <div className="w-8 h-0.5 bg-stone-300 mx-auto my-1.5 rounded-full" />
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-[9px] text-stone-600 border border-stone-200">
                    <Heart className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                    <span>{hashtag}</span>
                  </span>
                </div>

                {/* Drop Indicator Zone (Visible during stage 2) */}
                <AnimatePresence>
                  {stage === 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 48, scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl border-2 border-dashed border-amber-500/80 bg-amber-500/10 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-800"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      <span>+ Lepaskan Blok Disini</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 2. Dynamically Added / Dropped Card */}
                <AnimatePresence>
                  {(stage >= 3 || addedItems.includes(currentItem.id)) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                      className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 relative shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-amber-500 text-stone-950 flex items-center justify-center">
                            {React.createElement(currentItem.icon, {
                              className: "w-3 h-3",
                            })}
                          </div>
                          <span className="text-[11px] font-semibold text-stone-900">
                            {currentItem.previewTitle}
                          </span>
                        </div>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                          Baru
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-600 bg-white/70 p-1.5 rounded-lg border border-amber-100 font-medium text-center">
                        {currentItem.previewDesc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. Pre-existing Location/Couple Card */}
                <div className="p-3 rounded-2xl bg-white border border-stone-200 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span className="text-[11px] font-semibold text-stone-800">
                      Resepsi & Jamuan
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Grand Ballroom Kempinski Jakarta Pusat
                  </p>
                  <button className="mt-2 w-full py-1 text-center text-[10px] font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
                    Buka Petunjuk Arah
                  </button>
                </div>
              </div>

              {/* Toast confirmation message inside phone */}
              <AnimatePresence>
                {stage === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-3 left-3 right-3 py-1.5 px-2.5 rounded-xl bg-stone-900 text-white text-[10px] flex items-center justify-between shadow-lg"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{currentItem.name} ditambahkan!</span>
                    </div>
                    <span className="text-amber-400 font-bold">Tersimpan</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Virtual Simulated Mouse Cursor & Draggable Ghost Block */}
            <motion.div
              animate={
                stage === 0
                  ? { x: -70, y: -20, opacity: 1, scale: 1 }
                  : stage === 1
                  ? { x: -60, y: -20, opacity: 1, scale: 0.95 }
                  : stage === 2
                  ? { x: 30, y: -30, opacity: 1, scale: 1.05 }
                  : stage === 3
                  ? { x: 40, y: -10, opacity: 0.8, scale: 0.9 }
                  : { x: 90, y: 50, opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: stage === 2 ? 1 : 0.6,
                ease: "easeInOut",
              }}
              className="absolute z-50 pointer-events-none flex flex-col items-center"
            >
              {/* Virtual Cursor Icon */}
              <div className="relative">
                <MousePointer className="w-6 h-6 text-amber-400 fill-amber-400 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
              </div>

              {/* Ghost Floating Block Being Dragged */}
              {stage === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-1 px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 shadow-2xl font-bold text-[11px] flex items-center gap-1.5 border border-amber-300"
                >
                  {React.createElement(currentItem.icon, {
                    className: "w-3.5 h-3.5",
                  })}
                  <span>{currentItem.name}</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Studio Window Footer Bar */}
        <div className="h-9 px-4 bg-stone-950/90 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-stone-300 font-medium">Auto-saved to Cloud</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-stone-500">
              Font: Cormorant Garamond
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Eye className="w-3 h-3" />
              <span>Preview Tamu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
