"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Copy,
  Check,
  Trash2,
  CopyPlus,
  Users,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
  Music,
  Send,
  Download,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import {
  createInvitation,
  deleteInvitation,
  duplicateInvitation,
  updateInvitationAudio,
} from "@/app/actions/invitation";
import { logoutUser } from "@/app/actions/auth";
import { SessionUser } from "@/lib/auth";
import GuestManagerModal from "@/components/editor/GuestManagerModal";
import RSVPManagerModal from "@/components/editor/RSVPManagerModal";
import AudioSettingsModal from "@/components/editor/AudioSettingsModal";

type InvitationItem = {
  id: string;
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  isPublished: boolean;
  audioUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    guests: number;
    guestbook: number;
  };
};

interface DashboardClientProps {
  currentUser?: SessionUser | null;
  initialInvitations: InvitationItem[];
}

export default function DashboardClient({
  currentUser,
  initialInvitations,
}: DashboardClientProps) {
  const router = useRouter();
  const [invitations, setInvitations] =
    useState<InvitationItem[]>(initialInvitations);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [selectedForDuplicate, setSelectedForDuplicate] =
    useState<InvitationItem | null>(null);
  const [selectedForDelete, setSelectedForDelete] =
    useState<InvitationItem | null>(null);
  const [selectedForGuests, setSelectedForGuests] =
    useState<InvitationItem | null>(null);
  const [selectedForRSVP, setSelectedForRSVP] =
    useState<InvitationItem | null>(null);
  const [selectedForAudio, setSelectedForAudio] =
    useState<InvitationItem | null>(null);

  // Form states - Create
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states - Duplicate
  const [dupTitle, setDupTitle] = useState("");
  const [dupSlug, setDupSlug] = useState("");

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Helper to slugify
  const generateSlug = (groom: string, bride: string) => {
    const combined = `${groom}-${bride}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
    return combined;
  };

  // Auto-generate title and slug when typing names
  const handleGroomChange = (val: string) => {
    setGroomName(val);
    if (!title || title.startsWith("The Wedding of")) {
      setTitle(`The Wedding of ${val}${brideName ? ` & ${brideName}` : ""}`);
    }
    setSlug(generateSlug(val, brideName));
  };

  const handleBrideChange = (val: string) => {
    setBrideName(val);
    if (!title || title.startsWith("The Wedding of")) {
      setTitle(`The Wedding of ${groomName ? `${groomName} & ` : ""}${val}`);
    }
    setSlug(generateSlug(groomName, val));
  };

  // Handle Copy Public Link
  const handleCopyLink = (invSlug: string) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${invSlug}?to=Tamu+Undangan`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(invSlug);
    showToast("Link undangan publik berhasil disalin!");
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Handle Create Invitation
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const finalSlug = slug.trim().toLowerCase();
    if (!finalSlug) {
      setFormError("Link/Slug URL undangan wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createInvitation({
        title: title || `The Wedding of ${groomName} & ${brideName}`,
        slug: finalSlug,
        userId: "demo-user",
        groomName: groomName || "Mempelai Pria",
        brideName: brideName || "Mempelai Wanita",
      });

      if (res.success && res.invitation) {
        showToast("Undangan baru berhasil dibuat!");
        setIsCreateOpen(false);
        // Reset form
        setGroomName("");
        setBrideName("");
        setTitle("");
        setSlug("");
        // Redirect directly to editor
        router.push(`/editor/${res.invitation.id}`);
      } else {
        setFormError(res.error || "Gagal membuat undangan baru");
      }
    } catch {
      setFormError("Terjadi kesalahan sistem saat membuat undangan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Duplicate Modal
  const openDuplicate = (inv: InvitationItem) => {
    setSelectedForDuplicate(inv);
    setDupTitle(`${inv.title} (Salinan)`);
    setDupSlug(`${inv.slug}-copy`);
    setFormError(null);
    setIsDuplicateOpen(true);
  };

  // Handle Duplicate
  const handleDuplicate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForDuplicate) return;
    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await duplicateInvitation(
        selectedForDuplicate.id,
        dupSlug,
        dupTitle
      );
      if (res.success && res.invitation) {
        showToast("Undangan berhasil diduplikasi!");
        setIsDuplicateOpen(false);
        router.refresh();
      } else {
        setFormError(res.error || "Gagal menduplikasi undangan");
      }
    } catch {
      setFormError("Terjadi kesalahan saat menduplikasi undangan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedForDelete) return;
    setIsSubmitting(true);
    try {
      const res = await deleteInvitation(selectedForDelete.id);
      if (res.success) {
        setInvitations(invitations.filter((i) => i.id !== selectedForDelete.id));
        showToast("Undangan berhasil dihapus");
        setSelectedForDelete(null);
      } else {
        alert(res.error || "Gagal menghapus undangan");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus undangan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter invitations by search
  const filtered = invitations.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.title.toLowerCase().includes(q) ||
      inv.slug.toLowerCase().includes(q) ||
      inv.groomName.toLowerCase().includes(q) ||
      inv.brideName.toLowerCase().includes(q)
    );
  });

  // Calculate global stats
  const totalGuests = invitations.reduce(
    (acc, cur) => acc + (cur._count?.guests || 0),
    0
  );
  const totalRsvp = invitations.reduce(
    (acc, cur) => acc + (cur._count?.guestbook || 0),
    0
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-2xl border border-stone-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <Heart className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                Rabiku
              </span>
            </Link>

            <span className="hidden sm:inline-block w-px h-5 bg-stone-200" />
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-stone-400">
              Dashboard Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Panel</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setIsCreateOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Buat Undangan</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-stone-800 leading-tight">
                    {currentUser.name || currentUser.email.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {currentUser.role === "ADMIN" ? "Administrator" : "Pengguna"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logoutUser();
                    router.push("/login");
                    router.refresh();
                  }}
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
        {/* Welcome & Overview Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mb-1">
                Kelola Undangan Pernikahan
              </h1>
              <p className="text-sm text-stone-500">
                Buat, sunting tata letak, dan pantau rekap RSVP tamu undangan
                Anda.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-xs text-stone-600 self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Database Cloud: Neon PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-medium">
                Total Undangan
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                {invitations.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-medium">
                Tamu Terdata
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                {totalGuests}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-medium">
                Ucapan &amp; RSVP
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                {totalRsvp}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul atau nama mempelai..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200/90 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Invitations Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/70 p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-stone-800 mb-2">
              Tidak Ada Undangan Ditemukan
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              {searchQuery
                ? `Tidak ada hasil pencarian untuk "${searchQuery}". Coba kata kunci lain.`
                : "Anda belum memiliki undangan. Buat undangan pernikahan digital pertama Anda sekarang!"}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Undangan Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((inv) => {
              const isCopied = copiedSlug === inv.slug;
              const formattedDate = new Date(inv.updatedAt).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Card Top Banner / Couple Presentation */}
                  <div className="p-6 pb-4 bg-gradient-to-b from-stone-100/70 to-white border-b border-stone-100">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          inv.isPublished
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {inv.isPublished ? "Dipublikasi" : "Draf"}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-stone-900 truncate mb-1">
                      {inv.groomName} &amp; {inv.brideName}
                    </h2>
                    <p className="text-xs text-stone-500 truncate mb-3">
                      {inv.title}
                    </p>

                    {/* Slug URL Bar */}
                    <div className="flex items-center justify-between bg-stone-50 border border-stone-200/80 rounded-lg px-2.5 py-1.5 text-xs">
                      <span className="text-stone-500 truncate font-mono text-[11px]">
                        /{inv.slug}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(inv.slug)}
                        className="text-stone-400 hover:text-stone-900 transition-colors p-1"
                        title="Salin Link Undangan"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Stats Badges with Direct Modals */}
                  <div className="px-5 py-2.5 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between text-xs text-stone-600 gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedForGuests(inv)}
                      className="flex items-center gap-1.5 hover:text-stone-900 transition-colors py-1 px-1.5 rounded-md hover:bg-stone-200/50"
                      title="Kelola Tamu & Kirim WhatsApp"
                    >
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-medium">{inv._count?.guests || 0} Tamu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedForRSVP(inv)}
                      className="flex items-center gap-1.5 hover:text-stone-900 transition-colors py-1 px-1.5 rounded-md hover:bg-stone-200/50"
                      title="Rekap Kehadiran & Unduh CSV"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-medium">{inv._count?.guestbook || 0} RSVP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedForAudio(inv)}
                      className={`flex items-center gap-1 transition-colors py-1 px-2 rounded-full text-[11px] font-medium ${
                        inv.audioUrl
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                      }`}
                      title={
                        inv.audioUrl
                          ? "Musik Latar Aktif - Klik untuk Ubah"
                          : "Pilih Musik Latar"
                      }
                    >
                      <Music className="w-3 h-3 shrink-0" />
                      <span>{inv.audioUrl ? "Musik Aktif" : "Atur Musik"}</span>
                    </button>
                  </div>

                  {/* Actions Area */}
                  <div className="p-4 mt-auto flex flex-col gap-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedForGuests(inv)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 hover:border-stone-300 transition-all shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tamu &amp; WA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedForRSVP(inv)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 hover:border-stone-300 transition-all shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-600" />
                        <span>Rekap &amp; CSV</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/editor/${inv.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Desain</span>
                        </Link>

                        <Link
                          href={`/${inv.slug}?to=Tamu+Undangan`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-xs font-medium hover:bg-stone-200 hover:text-stone-900 transition-colors"
                          title="Buka Preview Undangan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </Link>
                      </div>

                      {/* Secondary Dropdown Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openDuplicate(inv)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                          title="Duplikat Undangan"
                        >
                          <CopyPlus className="w-4 h-4" />
                        </button>

                        {inv.id !== "demo" && (
                          <button
                            type="button"
                            onClick={() => setSelectedForDelete(inv)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Undangan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: Buat Undangan Baru */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Buat Undangan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Mempelai Pria *
                  </label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => handleGroomChange(e.target.value)}
                    placeholder="mis. Raden"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Mempelai Wanita *
                  </label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => handleBrideChange(e.target.value)}
                    placeholder="mis. Kirana"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Judul Undangan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Wedding of Raden &amp; Kirana"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Link / URL Slug Undangan *
                </label>
                <div className="flex items-center rounded-xl border border-stone-200 overflow-hidden focus-within:border-stone-900">
                  <span className="bg-stone-50 px-3 py-2 text-xs text-stone-400 border-r border-stone-200">
                    rabiku.my.id/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="raden-kirana"
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Hanya huruf kecil, angka, dan tanda hubung (-).
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Membuat...</span>
                    </>
                  ) : (
                    <>
                      <span>Mulai Mendesain</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Duplikat Undangan */}
      {isDuplicateOpen && selectedForDuplicate && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Duplikat Undangan
              </h3>
              <button
                type="button"
                onClick={() => setIsDuplicateOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleDuplicate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Judul Undangan Baru
                </label>
                <input
                  type="text"
                  required
                  value={dupTitle}
                  onChange={(e) => setDupTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Link / Slug URL Baru
                </label>
                <input
                  type="text"
                  required
                  value={dupSlug}
                  onChange={(e) => setDupSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDuplicateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-50"
                >
                  {isSubmitting ? "Menduplikasi..." : "Duplikat Sekarang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus */}
      {selectedForDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Hapus Undangan?
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-stone-800">
                &ldquo;{selectedForDelete.title}&rdquo;
              </strong>
              ? Seluruh data tamu dan pesan RSVP terkait juga akan dihapus
              secara permanen.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedForDelete(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50"
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Kelola Tamu & Kirim WhatsApp Blast */}
      {selectedForGuests && (
        <GuestManagerModal
          isOpen={Boolean(selectedForGuests)}
          onClose={() => setSelectedForGuests(null)}
          invitationId={selectedForGuests.id}
          slug={selectedForGuests.slug}
          groomName={selectedForGuests.groomName}
          brideName={selectedForGuests.brideName}
        />
      )}

      {/* Modal: Rekap RSVP & Unduh CSV */}
      {selectedForRSVP && (
        <RSVPManagerModal
          isOpen={Boolean(selectedForRSVP)}
          onClose={() => setSelectedForRSVP(null)}
          invitationId={selectedForRSVP.id}
          slug={selectedForRSVP.slug}
        />
      )}

      {/* Modal: Pilihan Lagu & Musik Latar */}
      {selectedForAudio && (
        <AudioSettingsModal
          isOpen={Boolean(selectedForAudio)}
          onClose={() => setSelectedForAudio(null)}
          currentAudioUrl={selectedForAudio.audioUrl || null}
          onSelectAudio={async (newUrl) => {
            const res = await updateInvitationAudio(
              selectedForAudio.id,
              newUrl || null
            );
            if (res.success) {
              setInvitations((prev) =>
                prev.map((item) =>
                  item.id === selectedForAudio.id
                    ? { ...item, audioUrl: newUrl || null }
                    : item
                )
              );
              setSelectedForAudio((prev) =>
                prev ? { ...prev, audioUrl: newUrl || null } : null
              );
              showToast(
                newUrl
                  ? "Musik latar berhasil diperbarui & disimpan!"
                  : "Musik latar dinonaktifkan."
              );
            } else {
              showToast(res.error || "Gagal memperbarui musik latar");
            }
          }}
        />
      )}
    </div>
  );
}
