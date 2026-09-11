"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  UserPlus,
  Copy,
  Check,
  Send,
  Trash2,
  Download,
  Search,
  MessageSquare,
  Users,
  Sparkles,
} from "lucide-react";
import {
  getGuests,
  addBulkGuests,
  toggleGuestSent,
  deleteGuest,
} from "@/app/actions/invitation";

interface GuestItem {
  id: string;
  name: string;
  phone: string | null;
  isSent: boolean;
  createdAt: Date;
}

interface GuestManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId: string;
  slug: string;
  groomName: string;
  brideName: string;
}

const TEMPLATE_PRESETS = [
  {
    id: "formal",
    name: "Formal & Santun",
    text: `Kepada Yth.
Bpk/Ibu/Saudara/i {nama_tamu}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:

{nama_pengantin}

Berikut tautan undangan untuk info lengkap dan konfirmasi kehadiran:
{link_undangan}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`,
  },
  {
    id: "islami",
    name: "Islami",
    text: `Assalamu'alaikum Warahmatullahi Wabarakatuh

Yth. {nama_tamu}

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan akad dan resepsi pernikahan kami:

{nama_pengantin}

Detail acara dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan berikut:
{link_undangan}

Doa restu dan kehadiran Bapak/Ibu/Saudara/i merupakan kebahagiaan tak terhingga bagi kami.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`,
  },
  {
    id: "casual",
    name: "Kasual & Sahabat",
    text: `Halo {nama_tamu}! ✨

We are getting married! 💍
Dengan penuh rasa syukur, kami ingin mengundang kamu untuk hadir di hari bahagia kami:

{nama_pengantin}

Buka undangan digital kami di sini ya:
{link_undangan}

Jangan lupa isi RSVP ya, ditunggu kehadirannya! See you there!`,
  },
];

export default function GuestManagerModal({
  isOpen,
  onClose,
  invitationId,
  slug,
  groomName,
  brideName,
}: GuestManagerModalProps) {
  const [activeTab, setActiveTab] = useState<"guests" | "template">("guests");
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateText, setTemplateText] = useState(TEMPLATE_PRESETS[0].text);

  const coupleName = useMemo(() => {
    if (groomName && brideName) return `${groomName} & ${brideName}`;
    return "Mempelai";
  }, [groomName, brideName]);

  // Load guests from database
  const loadGuests = useCallback(async () => {
    if (!invitationId) return;
    try {
      const data = await getGuests(invitationId);
      setGuests(data as GuestItem[]);
    } catch (err) {
      console.error("Failed to load guests:", err);
    } finally {
      setIsLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        loadGuests();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, loadGuests]);

  // Base URL calculation (window.location.origin)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Generate specific guest invitation URL
  const getGuestUrl = useCallback(
    (guestName: string) => {
      const targetSlug = slug || "preview-demo";
      return `${baseUrl}/${targetSlug}?to=${encodeURIComponent(guestName)}`;
    },
    [baseUrl, slug]
  );

  // Generate WhatsApp message for a guest
  const getGuestMessage = useCallback(
    (guestName: string) => {
      const guestUrl = getGuestUrl(guestName);
      return templateText
        .replace(/{nama_tamu}/g, guestName)
        .replace(/{nama_pengantin}/g, coupleName)
        .replace(/{link_undangan}/g, guestUrl);
    },
    [templateText, coupleName, getGuestUrl]
  );

  // Add bulk guests
  const handleAddBulk = async () => {
    if (!bulkInput.trim()) return;
    setIsAdding(true);
    try {
      const lines = bulkInput
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const items = lines.map((name) => ({ name }));
      const result = await addBulkGuests(invitationId, items);

      if (result.success && result.guests) {
        setGuests(result.guests as GuestItem[]);
        setBulkInput("");
      }
    } catch (err) {
      console.error("Failed to add bulk guests:", err);
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle sent status
  const handleToggleSent = async (id: string, currentStatus: boolean) => {
    try {
      await toggleGuestSent(id, !currentStatus);
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, isSent: !currentStatus } : g))
      );
    } catch (err) {
      console.error("Failed to toggle sent status:", err);
    }
  };

  // Delete guest
  const handleDelete = async (id: string) => {
    try {
      await deleteGuest(id);
      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Failed to delete guest:", err);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open WhatsApp Web/App
  const handleOpenWhatsApp = (guestName: string, phone?: string | null) => {
    const text = getGuestMessage(guestName);
    const cleanPhone = phone?.replace(/[^0-9]/g, "");
    let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (cleanPhone) {
      url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    }
    window.open(url, "_blank");
  };

  // Export CSV
  const handleExportCSV = () => {
    if (guests.length === 0) return;

    const headers = ["No", "Nama Tamu", "Status Terkirim", "Link Undangan", "Pesan WhatsApp"];
    const rows = guests.map((g, idx) => [
      idx + 1,
      `"${g.name.replace(/"/g, '""')}"`,
      g.isSent ? "Sudah Terkirim" : "Belum Terkirim",
      `"${getGuestUrl(g.name)}"`,
      `"${getGuestMessage(g.name).replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daftar-tamu-${slug || "undangan"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered list
  const filteredGuests = useMemo(() => {
    if (!searchQuery) return guests;
    return guests.filter((g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [guests, searchQuery]);

  const sentCount = useMemo(() => guests.filter((g) => g.isSent).length, [guests]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/80 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                Kelola Tamu & WhatsApp Blast
              </h2>
              <p className="text-xs text-stone-500">
                Buat tautan personal per tamu dan bagikan pesan WhatsApp dengan mudah.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-stone-200 flex gap-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab("guests")}
            className={`pb-3 text-xs font-medium transition-all border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "guests"
                ? "border-stone-900 text-stone-900 font-semibold"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            <Users className="w-4 h-4" />
            Daftar Tamu ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("template")}
            className={`pb-3 text-xs font-medium transition-all border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "template"
                ? "border-stone-900 text-stone-900 font-semibold"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Template Pesan WhatsApp
          </button>
        </div>

        {/* Tab 1: Guest List & Generator */}
        {activeTab === "guests" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Input Form & Bulk paste */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-stone-600" />
                  Tambah Tamu (Bisa Banyak Sekaligus)
                </label>
                <span className="text-[11px] text-stone-400">
                  Tulis 1 nama tamu per baris
                </span>
              </div>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={"Contoh:\nBapak & Ibu Surya\nDimas & Partner\nKeluarga Besar Bpk. Hartono"}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddBulk}
                  disabled={isAdding || !bulkInput.trim()}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {isAdding ? "Menyimpan..." : "Tambahkan ke Daftar"}
                </button>
              </div>
            </div>

            {/* List Controls & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama tamu..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs text-stone-500">
                  Terkirim: <strong className="text-stone-900">{sentCount}</strong> / {guests.length}
                </span>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={guests.length === 0}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Guest Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
              {isLoading ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  Memuat daftar tamu...
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs text-stone-400">
                    {searchQuery
                      ? "Tidak ada tamu yang cocok dengan pencarian."
                      : "Belum ada tamu. Silakan tambahkan nama tamu di atas."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {filteredGuests.map((guest) => {
                    const guestUrl = getGuestUrl(guest.name);
                    const isCopiedLink = copiedId === `link-${guest.id}`;
                    const isCopiedMsg = copiedId === `msg-${guest.id}`;

                    return (
                      <div
                        key={guest.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                      >
                        {/* Guest info & sent checkbox */}
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={guest.isSent}
                            onChange={() => handleToggleSent(guest.id, guest.isSent)}
                            title="Tandai sudah dikirim"
                            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-medium truncate ${
                                guest.isSent
                                  ? "text-stone-400 line-through"
                                  : "text-stone-900"
                              }`}
                            >
                              {guest.name}
                            </p>
                            <p className="text-[10px] text-stone-400 truncate max-w-xs" title={guestUrl}>
                              {guestUrl}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 justify-end">
                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => handleCopy(guestUrl, `link-${guest.id}`)}
                            className="px-2.5 py-1.5 rounded border border-stone-200 hover:bg-white text-stone-600 text-xs font-medium flex items-center gap-1 transition-all"
                            title="Salin tautan personal"
                          >
                            {isCopiedLink ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Link Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          {/* Copy WhatsApp Message */}
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(getGuestMessage(guest.name), `msg-${guest.id}`)
                            }
                            className="px-2.5 py-1.5 rounded border border-stone-200 hover:bg-white text-stone-600 text-xs font-medium flex items-center gap-1 transition-all"
                            title="Salin template pesan WhatsApp"
                          >
                            {isCopiedMsg ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Pesan Tersalin</span>
                              </>
                            ) : (
                              <>
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Copy WA</span>
                              </>
                            )}
                          </button>

                          {/* Send WhatsApp */}
                          <button
                            type="button"
                            onClick={() => {
                              handleOpenWhatsApp(guest.name, guest.phone);
                              if (!guest.isSent) {
                                handleToggleSent(guest.id, false);
                              }
                            }}
                            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
                            title="Buka WhatsApp langsung"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim WA</span>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(guest.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                            title="Hapus dari daftar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: WhatsApp Template Editor */}
        {activeTab === "template" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Presets */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-2">
                Pilih Preset Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TEMPLATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setTemplateText(preset.text)}
                    className="p-3 text-left rounded-xl border border-stone-200 hover:border-stone-900 bg-stone-50 hover:bg-white transition-all text-xs space-y-1 group"
                  >
                    <p className="font-semibold text-stone-900 group-hover:text-stone-950">
                      {preset.name}
                    </p>
                    <p className="text-[11px] text-stone-500 line-clamp-2">
                      {preset.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-800">
                  Isi Pesan WhatsApp
                </label>
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Tag dinamis: <code>{"{nama_tamu}"}</code>, <code>{"{nama_pengantin}"}</code>, <code>{"{link_undangan}"}</code></span>
                </div>
              </div>
              <textarea
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                rows={10}
                className="w-full px-3.5 py-3 text-xs rounded-xl border border-stone-200 font-sans leading-relaxed text-stone-800 bg-white focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>

            {/* Live Preview Sample */}
            <div className="rounded-xl border border-stone-200/80 bg-stone-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-stone-700">
                Contoh Tampilan Pesan (Pratinjau Tamu &ldquo;Bapak Surya &amp; Ibu&rdquo;):
              </p>
              <div className="p-3.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-800 font-sans whitespace-pre-wrap leading-relaxed shadow-xs">
                {getGuestMessage("Bapak Surya & Ibu")}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between text-xs text-stone-500">
          <span>
            Total Tamu: <strong className="text-stone-900">{guests.length}</strong> orang
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
