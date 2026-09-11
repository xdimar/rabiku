"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronDown } from "lucide-react";

interface EnvelopeCoverProps {
  groomName: string;
  brideName: string;
  guestName?: string;
  weddingDate?: string;
  onOpen: () => void;
}

export default function EnvelopeCover({
  groomName,
  brideName,
  guestName,
  weddingDate,
  onOpen,
}: EnvelopeCoverProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);

    // Trigger audio playback via global function
    const startAudio = (window as unknown as Record<string, () => void>).__startAudio;
    if (startAudio) startAudio();

    setTimeout(() => {
      setIsOpen(true);
      onOpen();
    }, 800);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background layers */}
          <motion.div
            className="absolute inset-0 bg-stone-100"
            animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Decorative top curtain */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-stone-50 origin-top"
            animate={
              isOpening
                ? { scaleY: 0, opacity: 0 }
                : { scaleY: 1, opacity: 1 }
            }
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-px bg-stone-200" />
          </motion.div>

          {/* Decorative bottom curtain */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-stone-50 origin-bottom"
            animate={
              isOpening
                ? { scaleY: 0, opacity: 0 }
                : { scaleY: 1, opacity: 1 }
            }
            transition={{
              duration: 0.7,
              ease: [0.4, 0, 0.2, 1],
              delay: 0.05,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-stone-200" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-8"
            animate={
              isOpening ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Envelope icon */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                <Mail className="w-7 h-7 text-stone-400" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-xs uppercase tracking-[0.25em] text-stone-400 font-medium mb-4"
            >
              The Wedding of
            </motion.p>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900 mb-2"
            >
              {groomName}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="w-8 h-px bg-stone-300 my-3"
            />

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900 mb-6"
            >
              {brideName}
            </motion.h1>

            {/* Wedding date */}
            {weddingDate && (
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-sm text-stone-500 mb-8"
              >
                {weddingDate}
              </motion.p>
            )}

            {/* Guest greeting */}
            {guestName && (
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-8"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-1.5">
                  Kepada Yth.
                </p>
                <p className="text-lg font-medium text-stone-800">
                  Bpk/Ibu/Saudara/i
                </p>
                <p className="text-xl font-serif font-semibold text-stone-900 mt-0.5">
                  {guestName}
                </p>
              </motion.div>
            )}

            {/* Open button */}
            <motion.button
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpen}
              disabled={isOpening}
              className="group flex items-center gap-2 px-8 py-3 rounded-full
                bg-stone-900 text-white text-sm font-medium tracking-wide
                hover:bg-stone-800 transition-colors duration-300
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-md hover:shadow-lg"
            >
              <span>Buka Undangan</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </motion.button>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-6"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="w-4 h-4 text-stone-300" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
