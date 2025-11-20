import { cache } from "react";
import { createClient } from "../server/create-client";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  return (await supabase.auth.getUser()).data.user;
});
