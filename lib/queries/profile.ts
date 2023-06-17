import { useQuery } from "@tanstack/react-query";
import useSupabase from "../hooks/use-supabase";
import repo from "../repo";

export function useProfileQuery(userId: string) {
  const supabase = useSupabase();

  const key = ["profile", userId];

  return useQuery(key, async () => await repo.getProfile(userId, supabase));
}
