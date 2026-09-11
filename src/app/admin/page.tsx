import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import {
  getAdminStats,
  getAllUsers,
  getAllPlatformInvitations,
} from "@/app/actions/admin";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin Panel — Kelola Pengguna & Platform Rabiku",
  description: "Panel kendali administrator untuk mengelola akun pengguna, hak akses, dan moderasi undangan pernikahan.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const currentAdmin = await requireAdmin();
  const [statsRes, usersRes, invitationsRes] = await Promise.all([
    getAdminStats(),
    getAllUsers(),
    getAllPlatformInvitations(),
  ]);

  const stats = statsRes.success && statsRes.stats
    ? statsRes.stats
    : {
        totalUsers: 0,
        totalInvitations: 0,
        totalGuests: 0,
        totalRsvps: 0,
        totalAdmins: 0,
      };

  const users = usersRes.success && usersRes.users ? usersRes.users : [];
  const invitations =
    invitationsRes.success && invitationsRes.invitations
      ? invitationsRes.invitations
      : [];

  return (
    <AdminClient
      currentAdmin={currentAdmin}
      initialStats={stats}
      initialUsers={users}
      initialInvitations={invitations}
    />
  );
}
