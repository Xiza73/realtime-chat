import { createAdminClient } from "@/services/supabase/server";

export default async function getMessages(roomId: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("message")
    .select(
      "id, text, created_at, author_id, author:user_profile (name, image_url)"
    )
    .eq("chat_room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return [];
  return data;
}
