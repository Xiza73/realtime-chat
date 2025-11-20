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

export default function RoomCard({
  id,
  name,
  memberCount,
  isJoined,
}: {
  id: string;
  name: string;
  memberCount: number;
  isJoined: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
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
