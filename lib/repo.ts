import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

async function getProfile(userId: string, supabase: SupabaseClient<Database>) {
  const result = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .throwOnError()
    .single();

  return result.data;
}

async function getUser(supabase: SupabaseClient<Database>) {
  return await supabase.auth.getUser();
}

const repo = { getProfile, getUser };

export default repo;
