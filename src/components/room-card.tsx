import { JoinRoomButton } from "@/components/join-room-button";
import { LeaveRoomButton } from "@/components/leave-room-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface RoomCardProps {
  id: string;
  name: string | null;
  memberCount: number;
  isJoined: boolean;
}

export default function RoomCard({
  id,
  name,
  memberCount,
  isJoined,
}: RoomCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name ?? "Nombre no definido"}</CardTitle>
        <CardDescription>
          {memberCount} {memberCount === 1 ? "miembro" : "miembros"}
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        {isJoined ? (
          <>
            <Button asChild className="grow" size="sm">
              <Link href={`/rooms/${id}`}>Entrar</Link>
            </Button>
            <LeaveRoomButton roomId={id} size="sm" variant="destructive">
              Salir
            </LeaveRoomButton>
          </>
        ) : (
          <JoinRoomButton
            roomId={id}
            variant="outline"
            className="grow"
            size="sm"
          >
            Unirse
          </JoinRoomButton>
        )}
      </CardFooter>
    </Card>
  );
}
