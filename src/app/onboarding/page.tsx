import { Suspense } from "react";
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
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-stone-900 border-t-transparent animate-spin" />
        </div>
      }
    >
      <OnboardingClient currentUser={session} />
    </Suspense>
  );
}
