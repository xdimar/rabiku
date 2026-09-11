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

  return {
    title,
    description,
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
