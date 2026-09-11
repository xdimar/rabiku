"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2, Check } from "lucide-react";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  readOnly?: boolean;
}

export default function ImageUploadField({
  value = "",
  onChange,
  label,
  readOnly = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar (JPG, PNG, WEBP, GIF) yang diperbolehkan.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 10MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        onChange(data.url);
        setUrlInput(data.url);
      } else {
        setError(data.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Fallback: convert directly to base64 data URL
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setUrlInput(base64);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (readOnly || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!readOnly && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    onChange(urlInput.trim());
  };

  return (
    <div className="w-full space-y-2 text-stone-800 text-xs">
      {label && <label className="font-medium text-stone-700 block">{label}</label>}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={readOnly || isUploading}
      />

      {/* Preview if image exists */}
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-stone-50 group">
          <div className="relative h-32 w-full bg-stone-100 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // If failed to load image URL
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={readOnly || isUploading}
                className="px-2.5 py-1 rounded bg-white/90 hover:bg-white text-stone-900 text-xs font-medium shadow-xs transition-colors"
              >
                Ganti Foto
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={readOnly}
                className="p-1 rounded bg-white/90 hover:bg-red-50 text-red-600 shadow-xs transition-colors"
                title="Hapus Foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-2 flex items-center justify-between text-[11px] text-stone-500 bg-white">
            <span className="truncate max-w-[200px]" title={value}>
              {value.startsWith("data:") ? "Foto Lokal (Base64)" : value.split("/").pop()}
            </span>
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Terpasang
            </span>
          </div>
        </div>
      ) : (
        /* Upload box */
        <div className="space-y-2">
          {/* Tab Switcher */}
          <div className="flex border-b border-stone-200 text-[11px]">
            <button
              type="button"
              onClick={() => setTab("upload")}
              className={`pb-1 px-2 font-medium transition-colors border-b-2 -mb-px flex items-center gap-1 ${
                tab === "upload"
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              <Upload className="w-3 h-3" /> Upload dari Perangkat
            </button>
            <button
              type="button"
              onClick={() => setTab("url")}
              className={`pb-1 px-2 font-medium transition-colors border-b-2 -mb-px flex items-center gap-1 ${
                tab === "url"
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              <LinkIcon className="w-3 h-3" /> Input URL
            </button>
          </div>

          {tab === "upload" ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isUploading && !readOnly && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                isDragOver
                  ? "border-stone-900 bg-stone-100/80"
                  : "border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50"
              } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-700" />
                  <span className="text-xs text-stone-600 font-medium">Mengunggah foto...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium text-stone-800">
                    Klik untuk memilih foto
                  </p>
                  <p className="text-[10px] text-stone-400">
                    atau tarik file ke sini (PNG, JPG, WEBP maks 10MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-1.5">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/foto.jpg"
                className="flex-1 px-2.5 py-1.5 rounded border border-stone-200 text-xs bg-white focus:outline-none focus:border-stone-900"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors shrink-0"
              >
                Gunakan
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
