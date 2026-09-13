"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  Search,
  MessageSquareHeart,
  RefreshCw,
} from "lucide-react";
import { getRSVPSummary } from "@/app/actions/invitation";

interface GuestbookItem {
  id: string;
  guestName: string;
  attendanceStatus: string;
  message: string | null;
  createdAt: Date;
}

interface RSVPManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId: string;
  slug: string;
  onStatsUpdate?: (stats: { total: number; recentCount: number }) => void;
}

export default function RSVPManagerModal({
  isOpen,
  onClose,
  invitationId,
  slug,
  onStatsUpdate,
}: RSVPManagerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<GuestbookItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [now, setNow] = useState(0);

  const loadData = useCallback(async () => {
    if (!invitationId) return;
    setIsLoading(true);
    try {
      const summary = await getRSVPSummary(invitationId);
      setEntries((summary.entries as GuestbookItem[]) || []);
      setNow(Date.now());
      if (onStatsUpdate) {
        onStatsUpdate({
          total: summary.total || 0,
          recentCount: summary.recentCount || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load RSVP summary:", err);
    } finally {
      setIsLoading(false);
    }
  }, [invitationId, onStatsUpdate]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        loadData();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, loadData]);

  // Statistics
  const attendingCount = useMemo(
    () => entries.filter((e) => e.attendanceStatus === "ATTENDING").length,
    [entries]
  );
  const notAttendingCount = useMemo(
    () => entries.filter((e) => e.attendanceStatus === "NOT_ATTENDING").length,
    [entries]
  );
  const tentativeCount = useMemo(
    () => entries.filter((e) => e.attendanceStatus === "TENTATIVE").length,
    [entries]
  );

  const totalEntries = entries.length;
  const attendingPct = totalEntries > 0 ? Math.round((attendingCount / totalEntries) * 100) : 0;
  const notAttendingPct = totalEntries > 0 ? Math.round((notAttendingCount / totalEntries) * 100) : 0;
  const tentativePct = totalEntries > 0 ? Math.max(0, 100 - attendingPct - notAttendingPct) : 0;

  const donutGradient = useMemo(() => {
    if (totalEntries === 0) return "conic-gradient(#e7e5e4 0deg 360deg)";
    const p1 = attendingPct;
    const p2 = p1 + notAttendingPct;
    return `conic-gradient(#10b981 0% ${p1}%, #ef4444 ${p1}% ${p2}%, #f59e0b ${p2}% 100%)`;
  }, [totalEntries, attendingPct, notAttendingPct]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.message && entry.message.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        filterStatus === "ALL" || entry.attendanceStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [entries, searchQuery, filterStatus]);

  // Export CSV
  const handleExportCSV = () => {
    if (entries.length === 0) return;

    const headers = ["No", "Nama Tamu", "Status Kehadiran", "Pesan Ucapan", "Tanggal Konfirmasi"];
    const rows = entries.map((e, idx) => {
      let statusLabel = "Ragu-ragu";
      if (e.attendanceStatus === "ATTENDING") statusLabel = "Hadir";
      if (e.attendanceStatus === "NOT_ATTENDING") statusLabel = "Tidak Hadir";

      const dateStr = new Date(e.createdAt).toLocaleString("id-ID");

      return [
        idx + 1,
        `"${e.guestName.replace(/"/g, '""')}"`,
        `"${statusLabel}"`,
        `"${(e.message || "-").replace(/"/g, '""')}"`,
        `"${dateStr}"`,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rekap-rsvp-${slug || "undangan"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/80 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                Dashboard Rekap RSVP & Buku Tamu
              </h2>
              <p className="text-xs text-stone-500">
                Pantau konfirmasi kehadiran tamu dan rekap ucapan doa pernikahan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Chart & Stat Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50/70 border border-stone-200">
            {/* Donut Chart Visualizer */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div
                className="w-24 h-24 rounded-full relative flex items-center justify-center shrink-0 shadow-inner"
                style={{ background: donutGradient }}
              >
                <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-xs">
                  <span className="font-serif text-lg font-bold text-stone-900 leading-none">
                    {totalEntries}
                  </span>
                  <span className="text-[9px] text-stone-400 mt-0.5">Total</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-stone-600">Hadir:</span>
                  <strong className="text-emerald-700">{attendingCount} ({attendingPct}%)</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-stone-600">Absen:</span>
                  <strong className="text-red-700">{notAttendingCount} ({notAttendingPct}%)</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-stone-600">Ragu:</span>
                  <strong className="text-amber-700">{tentativeCount} ({tentativePct}%)</strong>
                </div>
              </div>
            </div>

            {/* Quick Proportion Progress Bar */}
            <div className="md:col-span-2 flex flex-col justify-center gap-2">
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span className="font-medium">Komposisi Respon Kehadiran</span>
                <span className="text-[11px] text-stone-400">
                  {totalEntries > 0 ? `${totalEntries} konfirmasi terkumpul` : "Belum ada respon"}
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-stone-200 flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${attendingPct}%` }}
                  title={`Hadir: ${attendingPct}%`}
                />
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${notAttendingPct}%` }}
                  title={`Tidak Hadir: ${notAttendingPct}%`}
                />
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${tentativePct}%` }}
                  title={`Ragu-ragu: ${tentativePct}%`}
                />
              </div>
              <p className="text-[11px] text-stone-500">
                {attendingCount > 0
                  ? `Sebanyak ${attendingCount} tamu sudah menyatakan akan hadir merayakan bersama!`
                  : "Menunggu respon pertama dari tamu undangan."}
              </p>
            </div>
          </div>

          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
              <p className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                Total Konfirmasi
              </p>
              <p className="font-serif text-3xl font-semibold text-stone-900 mt-1">
                {entries.length}
              </p>
              <span className="text-[10px] text-stone-400">tamu mengisi form</span>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-emerald-800 font-medium uppercase tracking-wider">
                  Pasti Hadir
                </p>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="font-serif text-3xl font-semibold text-emerald-900 mt-1">
                {attendingCount}
              </p>
              <span className="text-[10px] text-emerald-600">
                {entries.length > 0
                  ? `${Math.round((attendingCount / entries.length) * 100)}% dari total`
                  : "0%"}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-red-200/80 bg-red-50/40">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-red-800 font-medium uppercase tracking-wider">
                  Berhalangan
                </p>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="font-serif text-3xl font-semibold text-red-900 mt-1">
                {notAttendingCount}
              </p>
              <span className="text-[10px] text-red-600">tidak dapat hadir</span>
            </div>

            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-amber-800 font-medium uppercase tracking-wider">
                  Masih Ragu
                </p>
                <HelpCircle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="font-serif text-3xl font-semibold text-amber-900 mt-1">
                {tentativeCount}
              </p>
              <span className="text-[10px] text-amber-600">tentative / ragu-ragu</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau pesan..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Filter Pills */}
              <div className="flex bg-stone-100 p-0.5 rounded-lg text-xs">
                {[
                  { id: "ALL", label: "Semua" },
                  { id: "ATTENDING", label: "Hadir" },
                  { id: "NOT_ATTENDING", label: "Absen" },
                  { id: "TENTATIVE", label: "Ragu" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterStatus(tab.id)}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${
                      filterStatus === tab.id
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={entries.length === 0}
                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Responses Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Memuat data kehadiran...
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                {searchQuery
                  ? "Tidak ada ucapan yang cocok dengan pencarian."
                  : "Belum ada konfirmasi kehadiran dari tamu."}
              </div>
            ) : (
              <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
                {filteredEntries.map((entry) => {
                  let badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Ragu-ragu
                    </span>
                  );
                  if (entry.attendanceStatus === "ATTENDING") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Hadir
                      </span>
                    );
                  } else if (entry.attendanceStatus === "NOT_ATTENDING") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                        Tidak Hadir
                      </span>
                    );
                  }

                  const isNew =
                    now - new Date(entry.createdAt).getTime() <
                    24 * 60 * 60 * 1000;

                  return (
                    <div key={entry.id} className="p-4 hover:bg-stone-50/70 transition-colors space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-stone-900">
                            {entry.guestName}
                          </p>
                          {badge}
                          {isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                              Baru
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {entry.message && (
                        <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50/60 p-2 rounded-lg border border-stone-100">
                          &ldquo;{entry.message}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between text-xs text-stone-500">
          <span>
            Total: <strong className="text-stone-900">{entries.length}</strong> respons tercatat
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
