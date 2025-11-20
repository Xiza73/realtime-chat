import RoomCard from "./room-card";
import { Button } from "./ui/button";
import Link from "next/link";

interface RoomListProps {
  title: string;
  rooms: { id: string; name: string | null; memberCount: number }[];
  isJoined?: boolean;
}

export default function RoomList({
  title,
  rooms,
  isJoined = false,
}: RoomListProps) {
  if (rooms.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">{title}</h2>
        <Button asChild>
          <Link href="/rooms/new">Crear sala</Link>
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {rooms.map((room) => (
          <RoomCard {...room} key={room.id} isJoined={isJoined} />
        ))}
      </div>
    </div>
  );
}
