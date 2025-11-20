import RoomList from "@/components/room-list";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import getJoinedRooms from "@/services/rooms/proxy/get-joined-rooms";
import getPublicRooms from "@/services/rooms/proxy/get-public-rooms";
import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user == null) {
    redirect("/auth/login");
  }

  const [publicRooms, joinedRooms] = await Promise.all([
    getPublicRooms(),
    getJoinedRooms(user.id),
  ]);

  if (publicRooms.length === 0 && joinedRooms.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessagesSquareIcon />
            </EmptyMedia>
            <EmptyTitle>Sin salas</EmptyTitle>
            <EmptyDescription>
              Crea una nueva sala de chat para comenzar
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="rooms/new">Crear una sala de chat</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <RoomList title="Tus salas" rooms={joinedRooms} isJoined />
      <RoomList
        title="Salas públicas"
        rooms={publicRooms.filter(
          (room) => !joinedRooms.some((r) => r.id === room.id)
        )}
      />
    </div>
  );
}
