import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "../hooks/use-supabase";
import repo from "../repo";

export function useUpdateProfileMutation() {
  const supabase = useSupabase();

  const queryClient = useQueryClient();

  return useMutation(
    async (profile: any) => await repo.updateProfile(profile, supabase),
    {
      onSuccess(data, variables) {
        queryClient.setQueryData(["profile", variables.id], data);
      },
    }
  );
}
