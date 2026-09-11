"use client";

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import {
  X,
  Music,
  Play,
  Pause,
  Upload,
  Link as LinkIcon,
  Check,
  Loader2,
  Volume2,
  VolumeX,
  Disc3,
  Sparkles,
} from "lucide-react";

export interface AudioTrackPreset {
  id: string;
  title: string;
  artist: string;
  genre: string;
  description: string;
  url: string;
}

export const PRESET_AUDIO_TRACKS: AudioTrackPreset[] = [
  {
    id: "canon-in-d",
    title: "Canon in D (Piano & Strings)",
    artist: "Johann Pachelbel",
    genre: "Klasik & Suci",
    description: "Alunan instrumen klasik yang sakral dan abadi, sangat cocok untuk momen janji suci.",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "romantic-acoustic",
    title: "Romantic Acoustic Prelude",
    artist: "Acoustic Melody",
    genre: "Hangat & Akustik",
    description: "Petikan gitar akustik lembut yang menghadirkan suasana intim, hangat, dan manis.",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "endless-love-piano",
    title: "Endless Love (Piano Solo)",
    artist: "Serenade Pianist",
    genre: "Puitis & Syahdu",
    description: "Denting piano lembut bernuansa tenang dan penuh haru, memperkuat rasa cinta mendalam.",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "gamelan-nusantara",
    title: "Sweet Gamelan & Serenade Nusantara",
    artist: "Tradisi Harmoni",
    genre: "Etnik & Anggun",
    description: "Perpaduan gending gamelan modern dan seruling yang anggun, melambangkan budaya luhur.",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: "joyful-celebration",
    title: "Modern Joyful Celebration",
    artist: "Wedding Ensemble",
    genre: "Ceria & Bahagia",
    description: "Tempo ceria penuh sukacita, menyambut kebahagiaan bersama seluruh tamu undangan.",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
];

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAudioUrl: string | null;
  onSelectAudio: (url: string) => Promise<void> | void;
}

export default function AudioSettingsModal({
  isOpen,
  onClose,
  currentAudioUrl,
  onSelectAudio,
}: AudioSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "upload" | "custom">("presets");
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAudioUrl || "");
  const [customUrlInput, setCustomUrlInput] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with prop when opened
  const [prevSync, setPrevSync] = useState({ isOpen, currentAudioUrl });
  if (isOpen !== prevSync.isOpen || currentAudioUrl !== prevSync.currentAudioUrl) {
    setPrevSync({ isOpen, currentAudioUrl });
    if (isOpen) {
      setSelectedUrl(currentAudioUrl || "");
    }
  }

  // Stop preview audio when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  const handleTogglePreview = (trackId: string, trackUrl: string) => {
    if (previewingId === trackId) {
      // Pause
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPreviewingId(null);
    } else {
      // Play new preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(trackUrl);
      audio.volume = 0.5;
      audio.play().catch((err) => console.warn("Audio preview playback blocked:", err));
      audio.onended = () => setPreviewingId(null);
      previewAudioRef.current = audio;
      setPreviewingId(trackId);
    }
  };

  const handleStopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setPreviewingId(null);
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("Ukuran file audio maksimal 25MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setSelectedUrl(data.url);
        handleStopPreview();
      } else {
        setUploadError(data.error || "Gagal mengunggah file audio.");
      }
    } catch (err) {
      console.error("Audio upload error:", err);
      setUploadError("Gagal menghubungi server untuk upload audio.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setSelectedUrl(customUrlInput.trim());
    handleStopPreview();
  };

  const handleSaveAudio = async (urlToSave: string) => {
    setIsSaving(true);
    handleStopPreview();
    try {
      await onSelectAudio(urlToSave);
      setSelectedUrl(urlToSave);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    } catch (err) {
      console.error("Failed to save audio selection:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/80 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
              <Disc3 className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                Lagu & Musik Latar Undangan
              </h2>
              <p className="text-xs text-stone-500">
                Pilih musik pernikahan bawaan atau unggah file MP3 sendiri dengan efek fade-in otomatis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              handleStopPreview();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={`pb-3 text-xs font-medium transition-all border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "presets"
                  ? "border-stone-900 text-stone-900 font-semibold"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              <Music className="w-4 h-4" />
              Katalog Lagu Bawaan ({PRESET_AUDIO_TRACKS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`pb-3 text-xs font-medium transition-all border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "upload"
                  ? "border-stone-900 text-stone-900 font-semibold"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload MP3 Sendiri
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`pb-3 text-xs font-medium transition-all border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "custom"
                  ? "border-stone-900 text-stone-900 font-semibold"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              URL Eksternal
            </button>
          </div>

          {/* Quick Mute option */}
          <button
            type="button"
            onClick={() => handleSaveAudio("")}
            className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
              !selectedUrl
                ? "bg-stone-900 text-white border-stone-900"
                : "border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Tanpa Musik</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tab 1: Presets Catalog */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500">
                  Dengarkan cuplikan dengan tombol play, lalu klik <strong>Gunakan Lagu Ini</strong> untuk menyematkannya ke undangan.
                </p>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Bebas Royalti & Ramah Tamu
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {PRESET_AUDIO_TRACKS.map((track) => {
                  const isSelected = selectedUrl === track.url;
                  const isPlaying = previewingId === track.id;

                  return (
                    <div
                      key={track.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? "border-stone-900 bg-stone-50/80 shadow-xs ring-1 ring-stone-900/10"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Play/Pause preview button */}
                        <button
                          type="button"
                          onClick={() => handleTogglePreview(track.id, track.url)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isPlaying
                              ? "bg-stone-900 text-white shadow-md scale-105"
                              : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                          }`}
                          title={isPlaying ? "Jeda Cuplikan" : "Dengarkan Cuplikan"}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs font-semibold text-stone-900">
                              {track.title}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                              {track.genre}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {track.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            Lagu Terpilih
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSaveAudio(track.url)}
                            disabled={isSaving}
                            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-xs"
                          >
                            Pilih Lagu
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Upload MP3 */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/x-m4a,audio/aac"
                className="hidden"
              />

              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-stone-900 bg-stone-100"
                    : "border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50"
                } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
                    <span className="text-xs font-medium text-stone-800">
                      Mengunggah file audio ke server...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-stone-900 mt-1">
                      Pilih File Musik dari Perangkat
                    </p>
                    <p className="text-xs text-stone-500">
                      Tarik file audio ke sini atau klik untuk browse
                    </p>
                    <span className="text-[11px] text-stone-400 mt-1">
                      Mendukung format MP3, WAV, M4A, OGG (Maksimal 25MB)
                    </span>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-xs text-red-500">{uploadError}</p>
              )}

              {/* Show active file info if it's an uploaded file */}
              {selectedUrl && selectedUrl.includes("/uploads/audio_") && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className="w-4 h-4 text-stone-600" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        File Audio Kustom Terpasang
                      </p>
                      <p className="text-[11px] text-stone-400 truncate max-w-sm">
                        {selectedUrl}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePreview("custom-upload", selectedUrl)}
                    className="p-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs flex items-center gap-1"
                  >
                    {previewingId === "custom-upload" ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>{previewingId === "custom-upload" ? "Jeda" : "Dengar"}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Custom External URL */}
          {activeTab === "custom" && (
            <div className="space-y-4">
              <label className="text-xs font-semibold text-stone-800 block">
                Tautan URL Audio Eksternal (Direct MP3 Link)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://domain.com/lagu-pernikahan.mp3"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:border-stone-900"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors shrink-0"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Pastikan tautan dapat diakses publik dan langsung mengarah ke file audio (berakhiran .mp3).
              </p>
            </div>
          )}

          {/* Current Active Status Bar */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-stone-600" />
              <span className="text-stone-600">Lagu Aktif Saat Ini:</span>
              <strong className="text-stone-900 font-medium">
                {selectedUrl
                  ? PRESET_AUDIO_TRACKS.find((p) => p.url === selectedUrl)?.title || "Musik Kustom"
                  : "Tidak Ada (Hening)"}
              </strong>
            </div>

            {savedFeedback && (
              <span className="flex items-center gap-1 text-emerald-600 font-medium animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Pilihan musik tersimpan!
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between text-xs text-stone-500">
          <span>
            Efek <strong className="text-stone-800">Audio Fade-In 2.5s</strong> aktif otomatis saat amplop dibuka tamu.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleStopPreview();
                onClose();
              }}
              className="px-4 py-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => handleSaveAudio(selectedUrl)}
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Pilihan Musik</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
