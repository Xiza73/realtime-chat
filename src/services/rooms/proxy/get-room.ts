import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";
import { createAdminClient } from "@/services/supabase/server/create-admin-client";

export default async function getRoom(id: string) {
  const user = await getCurrentUser();
  if (user == null) return null;

  const supabase = createAdminClient();
  const { data: room, error } = await supabase
    .from("chat_room")
    .select("id, name, chat_room_member!inner (), is_pvp")
    .eq("id", id)
    .eq("chat_room_member.member_id", user.id)
    .single();

  if (error) return null;

  return room;
}
