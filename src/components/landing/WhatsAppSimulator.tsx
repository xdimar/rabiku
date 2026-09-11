"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  ExternalLink,
  MessageCircle,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Camera,
  Mic,
  Heart,
} from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

type MessageTone = "formal" | "friendly" | "islamic";

export default function WhatsAppSimulator() {
  const [guestName, setGuestName] = useState<string>("Bpk. Hendra & Partner");
  const [coupleNames, setCoupleNames] = useState<string>("Sarah & Budi");
  const [tone, setTone] = useState<MessageTone>("formal");
  const [copied, setCopied] = useState<boolean>(false);

  const cleanGuest = guestName.trim() || "Tamu Undangan";
  const encodedGuest = encodeURIComponent(cleanGuest);
  const shareLink = `https://rabiku.my.id/demo?to=${encodedGuest}`;

  const getMessageContent = () => {
    switch (tone) {
      case "friendly":
        return `Hai ${cleanGuest}! 👋\n\nKabar bahagia nih, akhirnya kami akan melangsungkan pernikahan! Senang banget kalau kamu bisa hadir dan merayakan momen spesial ini bersama kami.\n\nDetail acara dan RSVP bisa kamu cek langsung di link undangan ini ya:\n${shareLink}\n\nSampai jumpa di hari bahagia kami! ❤️✨\n— ${coupleNames}`;
      case "islamic":
        return `Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i ${cleanGuest} untuk menghadiri acara pernikahan kami:\n\n💍 ${coupleNames}\n\nInformasi lengkap mengenai waktu akad, resepsi, serta konfirmasi kehadiran (RSVP) dapat diakses melalui tautan berikut:\n${shareLink}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\nWassalamu’alaikum Warahmatullahi Wabarakatuh.`;
      case "formal":
      default:
        return `Yth. ${cleanGuest},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan pernikahan kami:\n\n💍 ${coupleNames}\n\nDetail informasi acara, lokasi Google Maps, dan konfirmasi kehadiran (RSVP) dapat dilihat melalui undangan digital berikut:\n${shareLink}\n\nKehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kehormatan yang sangat berharga bagi kami sekeluarga.\n\nTerima kasih dan salam hangat,\n${coupleNames}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMessageContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="whatsapp-simulator" className="py-24 px-6 bg-stone-100/70 border-b border-stone-200/70 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <ScrollFadeIn direction="up" className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-500/20">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart WhatsApp Sharing</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Simulator Pesan WhatsApp Interaktif
          </h2>
          <p className="text-stone-600 mt-3 text-sm sm:text-base">
            Setiap tamu akan menerima pesan personal yang rapi dengan sampul kartu nama mereka. Coba langsung di bawah ini!
          </p>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Controls */}
          <ScrollFadeIn direction="right" delay={0.1} className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                Kustomisasi Pesan Undangan
              </h3>
              <p className="text-xs text-stone-500">
                Ubah nama tamu dan gaya bahasa untuk melihat simulasi tampilan chat WhatsApp secara live.
              </p>
            </div>

            {/* Input: Nama Tamu */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Nama Tamu yang Diundang:
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Contoh: Bpk. Joko & Istri"
                maxLength={35}
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 transition-all font-medium"
              />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {["Bpk. Hendra & Partner", "Sahabat Karib - Dian", "Keluarga Bpk. Rahmat"].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGuestName(preset)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Input: Nama Pasangan Pengantin */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Nama Mempelai:
              </label>
              <input
                type="text"
                value={coupleNames}
                onChange={(e) => setCoupleNames(e.target.value)}
                placeholder="Contoh: Sarah & Budi"
                maxLength={30}
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 transition-all font-medium"
              />
            </div>

            {/* Selector: Pilihan Gaya Bahasa */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Pilih Gaya Bahasa:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "formal", label: "Formal & Santun" },
                  { id: "friendly", label: "Hangat & Akrab" },
                  { id: "islamic", label: "Islami & Doa" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id as MessageTone)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                      tone === item.id
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Teks Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Salin Format Pesan</span>
                  </>
                )}
              </button>

              <Link
                href={`/demo?to=${encodedGuest}`}
                target="_blank"
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <span>Buka Undangan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollFadeIn>

          {/* Right: Realistic WhatsApp Smartphone Preview */}
          <ScrollFadeIn direction="left" delay={0.2} className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[380px] sm:max-w-[420px] rounded-[36px] bg-stone-900 p-3 shadow-2xl border-4 border-stone-800 relative">
              {/* Smartphone Camera Notch */}
              <div className="w-28 h-4 bg-stone-950 rounded-full mx-auto mb-2" />

              {/* Screen Display */}
              <div className="rounded-[28px] overflow-hidden bg-[#e5ddd5] flex flex-col h-[520px] border border-stone-700/50 relative">
                {/* WhatsApp Top Bar */}
                <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xs">
                      {cleanGuest[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight truncate max-w-[170px]">
                        {cleanGuest}
                      </p>
                      <p className="text-[10px] text-emerald-200">online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 text-emerald-100">
                    <Video className="w-4 h-4 cursor-pointer hover:text-white" />
                    <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
                    <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
                  </div>
                </div>

                {/* WhatsApp Chat Area */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3 relative">
                  {/* Date Pill */}
                  <div className="text-center my-1">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white/80 text-stone-600 shadow-xs uppercase tracking-wider">
                      Hari Ini
                    </span>
                  </div>

                  {/* Incoming/Outgoing Chat Bubble with Rich Link Card */}
                  <div className="flex justify-end">
                    <div className="max-w-[92%] rounded-2xl rounded-tr-xs bg-[#d9fdd3] text-stone-900 p-2.5 shadow-sm border border-emerald-200/60 text-xs">
                      {/* Rich Open Graph Link Preview Card */}
                      <Link
                        href={`/demo?to=${encodedGuest}`}
                        target="_blank"
                        className="block rounded-xl overflow-hidden bg-white border border-stone-200/90 mb-2 hover:opacity-95 transition-opacity shadow-xs"
                      >
                        <div className="h-28 bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-900 p-3 flex flex-col justify-between text-white relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-bold text-amber-300">
                              Undangan Digital
                            </span>
                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-stone-300">The Wedding of</p>
                            <h5 className="font-serif text-base font-bold text-amber-200">
                              {coupleNames}
                            </h5>
                          </div>
                        </div>
                        <div className="p-2.5 bg-stone-50/90">
                          <p className="font-bold text-[11px] text-stone-900 truncate">
                            Undangan Spesial untuk: {cleanGuest}
                          </p>
                          <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            Buka tautan untuk melihat lokasi, waktu, dan RSVP resepsi.
                          </p>
                          <span className="text-[9px] text-stone-400 font-mono mt-1 block truncate">
                            rabiku.my.id/demo?to={cleanGuest.replace(/\s+/g, "+")}
                          </span>
                        </div>
                      </Link>

                      {/* Message Text Body */}
                      <p className="whitespace-pre-line text-[11px] leading-relaxed text-stone-800">
                        {getMessageContent()}
                      </p>

                      {/* Timestamp & Double Blue Ticks */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-stone-500">
                        <span>10:42</span>
                        <span className="text-sky-600 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Bottom Input Bar */}
                <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-stone-300/60">
                  <div className="flex items-center gap-2 text-stone-500 pl-1">
                    <Smile className="w-5 h-5" />
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <div className="flex-1 bg-white rounded-full px-3.5 py-1.5 text-xs text-stone-400 border border-stone-200">
                    Ketik pesan
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-sm">
                    <Mic className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}
