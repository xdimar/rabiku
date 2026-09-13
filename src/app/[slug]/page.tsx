import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/app/actions/invitation";
import InvitationClient from "./InvitationClient";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { to } = await searchParams;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return { title: "Undangan Tidak Ditemukan" };
  }

  const title = `The Wedding of ${invitation.groomName} & ${invitation.brideName}`;
  const description = to
    ? `Undangan spesial untuk ${to}. ${title}`
    : `Anda diundang ke pernikahan ${invitation.groomName} & ${invitation.brideName}`;

  const initials = `${invitation.groomName?.[0] || "R"}&${invitation.brideName?.[0] || "K"}`;
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="28" fill="#1c1917"/><text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-family="serif" font-size="36" font-weight="bold" fill="#f59e0b">${initials}</text></svg>`;
  const faviconUrl = `data:image/svg+xml,${encodeURIComponent(svgFavicon)}`;

  return {
    title,
    description,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { to } = await searchParams;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  return (
    <InvitationClient
      invitation={{
        id: invitation.id,
        slug: invitation.slug,
        groomName: invitation.groomName,
        brideName: invitation.brideName,
        layoutData: invitation.layoutData,
        audioUrl: invitation.audioUrl,
        guestbook: invitation.guestbook,
      }}
      guestName={to ?? null}
    />
  );
}
