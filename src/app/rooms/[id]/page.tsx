import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";
import { notFound } from "next/navigation";
import { RoomClient } from "./_client";
import getUser from "@/services/rooms/proxy/get-user";
import getMessages from "@/services/rooms/proxy/get-messages";
import { createAdminClient } from "@/services/supabase/server/create-admin-client";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  console.log({ id });
  const [room, user, messages] = await Promise.all([
    getRoom(id),
    getUser(),
    getMessages(id),
  ]);

  if (room == null || user == null) return notFound();

  return <RoomClient room={room} user={user} messages={messages} />;
}

async function getRoom(id: string) {
  const user = await getCurrentUser();
  if (user == null) return null;

  const supabase = await createAdminClient();
  const { data: room, error } = await supabase
    .from("chat_room")
    .select("id, name, chat_room_member!inner ()")
    .eq("id", id)
    .eq("chat_room_member.member_id", user.id)
    .single();

  if (error) return null;
  return room;
}
