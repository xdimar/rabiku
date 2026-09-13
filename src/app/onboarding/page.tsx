import { Metadata } from "next";
import { getSession } from "@/lib/auth";
import OnboardingClient from "./OnboardingClient";

export const metadata: Metadata = {
  title: "Selamat Datang — Mulai Buat Undangan Anda | Rabiku",
  description: "Langkah mudah menyiapkan undangan pernikahan digital Anda pertama kali di Rabiku Studio.",
};

export default async function OnboardingPage() {
  const session = await getSession();

  // If not logged in, they can still try or we redirect
  return <OnboardingClient currentUser={session} />;
}
