"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

const TARGET_VOLUME = 0.6;
const FADE_IN_DURATION_MS = 2500;
const FADE_OUT_DURATION_MS = 400;

export default function AudioPlayer({ audioUrl, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Clear any ongoing fade intervals
  const clearFadeInterval = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  // Smooth Fade-In effect
  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeInterval();
    audio.volume = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          const steps = 40; // 40 steps over 2500ms = 62.5ms per step
          const intervalTime = FADE_IN_DURATION_MS / steps;
          const volumeIncrement = TARGET_VOLUME / steps;

          fadeIntervalRef.current = setInterval(() => {
            if (!audio) {
              clearFadeInterval();
              return;
            }
            if (audio.volume + volumeIncrement >= TARGET_VOLUME) {
              audio.volume = TARGET_VOLUME;
              clearFadeInterval();
            } else {
              audio.volume = Math.min(TARGET_VOLUME, audio.volume + volumeIncrement);
            }
          }, intervalTime);
        })
        .catch((err) => {
          console.warn("Autoplay blocked or audio play error:", err);
          setIsPlaying(false);
        });
    }
  }, [clearFadeInterval]);

  // Smooth Fade-Out before pausing
  const fadeOutAndPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeInterval();
    const steps = 15;
    const intervalTime = FADE_OUT_DURATION_MS / steps;
    const volumeDecrement = audio.volume / steps;

    fadeIntervalRef.current = setInterval(() => {
      if (!audio) {
        clearFadeInterval();
        return;
      }
      if (audio.volume - volumeDecrement <= 0.05) {
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        clearFadeInterval();
      } else {
        audio.volume = Math.max(0, audio.volume - volumeDecrement);
      }
    }, intervalTime);
  }, [clearFadeInterval]);

  // Initialize audio element
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      clearFadeInterval();
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl, clearFadeInterval]);

  const startPlayback = useCallback(() => {
    if (audioRef.current) {
      fadeIn();
      setIsVisible(true);
    }
  }, [fadeIn]);

  useEffect(() => {
    if (autoPlay) {
      startPlayback();
    }
  }, [autoPlay, startPlayback]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      fadeOutAndPause();
    } else {
      fadeIn();
    }
  };

  // Expose startPlayback globally for envelope cover to trigger on opening
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__startAudio = startPlayback;
    return () => {
      delete (window as unknown as Record<string, unknown>).__startAudio;
    };
  }, [startPlayback]);

  if (!audioUrl) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={togglePlayback}
          className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center
            bg-white/85 backdrop-blur-md border border-stone-200 shadow-xl
            hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300
            ${isPlaying ? "audio-pulse" : ""}`}
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
          title={isPlaying ? "Jeda Musik" : "Putar Musik"}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <Music className="w-5 h-5 text-stone-800" />
                {/* Subtle sound wave ping indicator */}
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Pause className="w-5 h-5 text-stone-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
