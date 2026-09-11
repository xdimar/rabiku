"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Users,
  Layers,
  MessageSquareHeart,
  Search,
  Check,
  Trash2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  UserX,
  ArrowLeft,
  LogOut,
  Calendar,
  AlertCircle,
  Loader2,
  Mail,
  Sparkles,
} from "lucide-react";
import { SessionUser } from "@/lib/auth";
import { updateUserRole, deleteUser } from "@/app/actions/admin";
import { logoutUser } from "@/app/actions/auth";

interface AdminUserItem {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  _count: {
    invitations: number;
  };
}

interface AdminInvitationItem {
  id: string;
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    guests: number;
    guestbook: number;
  };
}

interface AdminClientProps {
  currentAdmin: SessionUser;
  initialStats: {
    totalUsers: number;
    totalInvitations: number;
    totalGuests: number;
    totalRsvps: number;
    totalAdmins: number;
  };
  initialUsers: AdminUserItem[];
  initialInvitations: AdminInvitationItem[];
}

export default function AdminClient({
  currentAdmin,
  initialStats,
  initialUsers,
  initialInvitations,
}: AdminClientProps) {
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [invitations, setInvitations] =
    useState<AdminInvitationItem[]>(initialInvitations);

  const [activeTab, setActiveTab] = useState<"users" | "invitations">("users");
  const [searchUser, setSearchUser] = useState("");
  const [searchInv, setSearchInv] = useState("");

  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered lists
  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchUser.toLowerCase()))
  );

  const filteredInvitations = invitations.filter(
    (inv) =>
      inv.title.toLowerCase().includes(searchInv.toLowerCase()) ||
      inv.slug.toLowerCase().includes(searchInv.toLowerCase()) ||
      inv.user.email.toLowerCase().includes(searchInv.toLowerCase()) ||
      inv.groomName.toLowerCase().includes(searchInv.toLowerCase()) ||
      inv.brideName.toLowerCase().includes(searchInv.toLowerCase())
  );

  // Handle role update
  const handleRoleToggle = async (targetUser: AdminUserItem) => {
    const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    setIsActionLoading(true);

    try {
      const res = await updateUserRole(targetUser.id, newRole);
      if (res.success && res.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, role: newRole } : u
          )
        );
        setStats((prev) => ({
          ...prev,
          totalAdmins:
            newRole === "ADMIN" ? prev.totalAdmins + 1 : prev.totalAdmins - 1,
        }));
        showToast(
          `Role ${targetUser.name || targetUser.email} berhasil diubah menjadi ${newRole}`
        );
      } else {
        showToast(res.error || "Gagal mengubah role pengguna");
      }
    } catch {
      showToast("Terjadi kesalahan saat mengubah role");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsActionLoading(true);

    try {
      const res = await deleteUser(userToDelete.id);
      if (res.success) {
        const deletedCount = userToDelete._count.invitations;
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setInvitations((prev) =>
          prev.filter((inv) => inv.user.id !== userToDelete.id)
        );
        setStats((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          totalInvitations: prev.totalInvitations - deletedCount,
          totalAdmins:
            userToDelete.role === "ADMIN"
              ? prev.totalAdmins - 1
              : prev.totalAdmins,
        }));
        showToast(`Pengguna ${userToDelete.email} berhasil dihapus`);
        setUserToDelete(null);
      } else {
        showToast(res.error || "Gagal menghapus pengguna");
      }
    } catch {
      showToast("Terjadi kesalahan saat menghapus pengguna");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-2xl border border-stone-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <span className="w-px h-5 bg-stone-200" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold text-stone-900">
                Admin Panel Rabiku
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-stone-400">Login sebagai:</span>
              <span className="font-semibold text-stone-800">
                {currentAdmin.name || currentAdmin.email}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider">
                ADMIN
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
              title="Keluar dari Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Welcome Banner */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-1">
            Pusat Kendali Administrator
          </h1>
          <p className="text-sm text-stone-500">
            Kelola akses seluruh pengguna, pantau aktivitas undangan, dan awasi statistik platform secara terpusat.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Total Pengguna
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Total Undangan
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                {stats.totalInvitations}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Total Tamu &amp; RSVP
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                {stats.totalGuests + stats.totalRsvps}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Total Admin
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                {stats.totalAdmins}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-stone-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "users"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Pengguna ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invitations")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "invitations"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Seluruh Undangan Platform ({invitations.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            {/* Table Search Bar */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Cari nama atau email pengguna..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-stone-900 transition-all"
                />
              </div>

              <span className="text-xs text-stone-400">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/70 border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                    <th className="py-3.5 px-6">Pengguna</th>
                    <th className="py-3.5 px-4">Role Akses</th>
                    <th className="py-3.5 px-4">Jumlah Undangan</th>
                    <th className="py-3.5 px-4">Bergabung Sejak</th>
                    <th className="py-3.5 px-6 text-right">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentAdmin.id;
                    const dateFormatted = new Date(u.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    );

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center shrink-0">
                              {(u.name || u.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                                <span>{u.name || "Tanpa Nama"}</span>
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 text-stone-500 rounded font-normal">
                                    Anda
                                  </span>
                                )}
                              </p>
                              <p className="text-stone-400 text-[11px]">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              u.role === "ADMIN"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-stone-100 text-stone-600 border border-stone-200"
                            }`}
                          >
                            {u.role === "ADMIN" ? (
                              <ShieldCheck className="w-3 h-3 text-amber-700" />
                            ) : (
                              <Users className="w-3 h-3 text-stone-500" />
                            )}
                            <span>{u.role}</span>
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold text-stone-900">
                            {u._count.invitations}
                          </span>{" "}
                          undangan
                        </td>

                        <td className="py-4 px-4 text-stone-500">
                          {dateFormatted}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleRoleToggle(u)}
                              disabled={isActionLoading || isSelf}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                u.role === "ADMIN"
                                  ? "border-stone-200 text-stone-600 hover:bg-stone-100"
                                  : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={
                                isSelf
                                  ? "Tidak dapat mengubah role sendiri"
                                  : u.role === "ADMIN"
                                  ? "Turunkan menjadi User Reguler"
                                  : "Promosikan menjadi Administrator"
                              }
                            >
                              {u.role === "ADMIN"
                                ? "Turunkan ke User"
                                : "Jadikan Admin"}
                            </button>

                            {/* Delete User Button */}
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => setUserToDelete(u)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Akun Pengguna"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PLATFORM INVITATIONS MODERATION */}
        {activeTab === "invitations" && (
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchInv}
                  onChange={(e) => setSearchInv(e.target.value)}
                  placeholder="Cari judul, link, atau pemilik..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-stone-900 transition-all"
                />
              </div>

              <span className="text-xs text-stone-400">
                Menampilkan {filteredInvitations.length} dari{" "}
                {invitations.length} undangan
              </span>
            </div>

            {/* Invitations Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/70 border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                    <th className="py-3.5 px-6">Undangan &amp; Pasangan</th>
                    <th className="py-3.5 px-4">Pemilik Akun</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Tamu &amp; RSVP</th>
                    <th className="py-3.5 px-4">Terakhir Diupdate</th>
                    <th className="py-3.5 px-6 text-right">Pratinjau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredInvitations.map((inv) => {
                    const dateFormatted = new Date(
                      inv.updatedAt
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <p className="font-semibold text-stone-900 font-serif text-sm">
                            {inv.groomName && inv.brideName
                              ? `${inv.groomName} & ${inv.brideName}`
                              : inv.title}
                          </p>
                          <p className="text-[11px] font-mono text-stone-400">
                            /{inv.slug}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-medium text-stone-800">
                            {inv.user.name || "Tanpa Nama"}
                          </p>
                          <p className="text-stone-400 text-[11px]">
                            {inv.user.email}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              inv.isPublished
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {inv.isPublished ? "Dipublikasi" : "Draf"}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-stone-600">
                          <span>{inv._count.guests} Tamu</span> ·{" "}
                          <span>{inv._count.guestbook} RSVP</span>
                        </td>

                        <td className="py-4 px-4 text-stone-500">
                          {dateFormatted}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/${inv.slug}?to=Tamu+Undangan`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Konfirmasi Hapus Pengguna */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Hapus Pengguna?
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun{" "}
              <strong className="text-stone-800">{userToDelete.email}</strong>?
              Seluruh ({userToDelete._count.invitations}) undangan dan data tamu yang dimiliki pengguna ini akan dihapus permanen.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isActionLoading}
                onClick={handleDeleteUser}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isActionLoading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Ya, Hapus Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
