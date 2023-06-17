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

async function updateProfile(profile: any, supabase: SupabaseClient<Database>) {
  const result = await supabase
    .from("profiles")
    .update({ username: profile.username, avatar_url: profile.avatar_url })
    .match({ id: profile.id })
    .select("*")
    .throwOnError()
    .single();

  return result.data;
}

async function getUser(supabase: SupabaseClient<Database>) {
  return await supabase.auth.getUser();
}

const repo = { getProfile, updateProfile, getUser };

export default repo;
