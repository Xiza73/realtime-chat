import { notFound } from "next/navigation";
import { RoomClient } from "./_client";
import getUser from "@/services/rooms/proxy/get-user";
import getMessages from "@/services/rooms/proxy/get-messages";
import getRoom from "@/services/rooms/proxy/get-room";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  const [room, user, messages] = await Promise.all([
    getRoom(id),
    getUser(),
    getMessages(id),
  ]);

  if (room == null || user == null) return notFound();

  return <RoomClient room={room} user={user} messages={messages} />;
}
