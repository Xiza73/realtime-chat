import { createAdminClient } from "@/services/supabase/server";

export default async function getJoinedRooms(userId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("id, name, chat_room_member (member_id)")
    .order("name", { ascending: true });

  if (error) {
    return [];
  }

  return data
    .filter((room) => room.chat_room_member.some((u) => u.member_id === userId))
    .map((room) => ({
      id: room.id,
      name: room.name,
      memberCount: room.chat_room_member.length,
    }));
}
