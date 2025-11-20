import { createAdminClient } from "@/services/supabase/server/create-admin-client";
import { Contact } from "../domain/contact";
import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";

export default async function getContacts(): Promise<Contact[]> {
  const user = await getCurrentUser();
  const supabase = createAdminClient();

  if (user == null) return [];

  const { data, error } = await supabase
    .from("user_profile")
    .select("id, name, image_url")
    .neq("id", user.id)
    .order("name", { ascending: true });

  if (error) {
    return [];
  }

  return data.map(
    (user): Contact => ({
      id: user.id,
      name: user.name,
      imageUrl: user.image_url,
    })
  );
}
