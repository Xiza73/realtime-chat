"use client";

import { ComponentProps } from "react";
import { ActionButton } from "./ui/action-button";
import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import {
  createPVPChatRoom,
  getPVPChatRoom,
} from "@/services/supabase/actions/rooms";

type GoToChatButtonProps = Omit<
  ComponentProps<typeof ActionButton>,
  "action"
> & { contactId: string };

export function GoToChatButton({
  children,
  contactId,
  ...props
}: GoToChatButtonProps) {
  const { user } = useCurrentUser();
  const router = useRouter();

  async function joinChatRoom() {
    if (user == null) {
      return { error: true, message: "User not logged in" };
    }

    const { roomId } = await getPVPChatRoom(contactId);

    if (roomId) {
      router.refresh();
      router.push(`/rooms/${roomId}`);

      return { error: false, message: "Chat obtenido con éxito" };
    }

    const res = await createPVPChatRoom(contactId);

    return res;
  }

  return (
    <ActionButton {...props} action={joinChatRoom}>
      {children}
    </ActionButton>
  );
}
