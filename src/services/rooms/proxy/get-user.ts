import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";
import { createAdminClient } from "@/services/supabase/server/create-admin-client";

export default async function getUser() {
  const user = await getCurrentUser();
  const supabase = await createAdminClient();
  if (user == null) return null;

  const { data, error } = await supabase
    .from("user_profile")
    .select("id, name, image_url")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
}
