import { getInvitationById } from "@/app/actions/invitation";
import EditorClient from "./EditorClient";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const invitation = await getInvitationById(id);

  return (
    <EditorClient
      invitationId={id}
      initialData={invitation?.layoutData ?? null}
      invitationTitle={invitation?.title ?? "Undangan Baru"}
      initialAudioUrl={invitation?.audioUrl ?? null}
    />
  );
}
