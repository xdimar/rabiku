import { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getAllInvitations } from "@/app/actions/invitation";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard Undangan — Rabiku",
  description:
    "Kelola seluruh undangan pernikahan digital, tamu, dan rekap konfirmasi RSVP Anda.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await getSession();
  const invitations = await getAllInvitations();

  return (
    <DashboardClient
      currentUser={currentUser}
      initialInvitations={invitations}
    />
  );
}
