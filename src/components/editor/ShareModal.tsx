"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Link2,
  Check,
  QrCode,
  MessageCircle,
  Send,
  Share2,
  Copy,
  ExternalLink,
  Eye,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  groomName: string;
  brideName: string;
}

function generateQRCodeSVG(data: string, size: number = 200): string {
  // Simple QR Code-like SVG pattern using data URL
  // For a real QR we'd need a library, but we'll generate a useful visual with a link
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=svg`;
}

export default function ShareModal({
  isOpen,
  onClose,
  slug,
  groomName,
  brideName,
}: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [customGuestName, setCustomGuestName] = useState("");

  if (!isOpen) return null;

  const baseUrl = typeof window !== "undefined"
    ? `${window.location.origin}`
    : "";
  const invitationUrl = `${baseUrl}/${slug}`;
  const personalizedUrl = customGuestName
    ? `${invitationUrl}?to=${encodeURIComponent(customGuestName)}`
    : invitationUrl;

  const waMessage = `Assalamualaikum Wr. Wb.\n\nDengan penuh kebahagiaan, kami mengundang ${
    customGuestName || "Bapak/Ibu/Saudara/i"
  } untuk menghadiri pernikahan kami:\n\n💍 *${groomName} & ${brideName}*\n\nBuka undangan digital di:\n${personalizedUrl}\n\nMerupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTerima kasih 🙏`;

  const telegramMessage = `Undangan Pernikahan ${groomName} & ${brideName}\n\n${personalizedUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(personalizedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(waMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const qrUrl = generateQRCodeSVG(personalizedUrl, 256);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-xs">
              <Share2 className="w-5 h-5 text-stone-100" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-stone-900 tracking-tight">
                Bagikan Undangan
              </h2>
              <p className="text-xs text-stone-500">
                Kirim link undangan ke tamu melalui berbagai platform
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Personalize for Guest */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Personalisasi untuk Tamu (Opsional)
            </h3>
            <input
              type="text"
              value={customGuestName}
              onChange={(e) => setCustomGuestName(e.target.value)}
              placeholder="Masukkan nama tamu (mis: Budi Santoso)"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400"
            />
            <p className="text-[10px] text-stone-500">
              Nama tamu akan muncul di amplop digital sebagai sapaan personal
            </p>
          </div>

          {/* Copy Link */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Link Undangan
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg text-stone-700 truncate">
                {personalizedUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  copiedLink
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-stone-900 text-white hover:bg-stone-800"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              QR Code
            </h3>
            <div className="flex justify-center py-4">
              <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`QR Code untuk ${groomName} & ${brideName}`}
                  className="w-48 h-48"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-[10px] text-stone-500 text-center">
              Scan QR Code ini untuk langsung membuka undangan digital
            </p>
          </div>

          {/* Share Buttons */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Kirim via Platform
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold hover:bg-green-100 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(personalizedUrl)}&text=${encodeURIComponent(telegramMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold hover:bg-blue-100 transition-all"
              >
                <Send className="w-4 h-4 text-blue-600" />
                Telegram
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Undangan Pernikahan ${groomName} & ${brideName}`)}&url=${encodeURIComponent(personalizedUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-stone-600" />
                Twitter / X
              </a>
              <a
                href={personalizedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-all"
              >
                <Eye className="w-4 h-4 text-amber-600" />
                Preview
              </a>
            </div>
          </div>

          {/* WhatsApp Message Template */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Template Pesan WhatsApp
              </h3>
              <button
                type="button"
                onClick={handleCopyMessage}
                className={`flex items-center gap-1 text-[11px] font-semibold transition-all ${
                  copiedMsg ? "text-emerald-600" : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {copiedMsg ? (
                  <>
                    <Check className="w-3 h-3" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Salin Pesan
                  </>
                )}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 whitespace-pre-line font-mono leading-relaxed max-h-40 overflow-y-auto">
              {waMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
