import { createAdminClient } from "@/services/supabase/server";

export default async function getPublicRooms() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("id, name, chat_room_member (count)")
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (error) {
    return [];
  }

  return data.map((room) => ({
    id: room.id,
    name: room.name,
    memberCount: room.chat_room_member[0].count,
  }));
}
