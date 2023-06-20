import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "../hooks/use-supabase";
import repo from "../repo";

export function useUpdateAccountMutation() {
  const supabase = useSupabase();

  const queryClient = useQueryClient();

  return useMutation(
    async (account: any) => await repo.updateProfile(account, supabase),
    {
      onSuccess(data) {
        queryClient.setQueryData(["account"], data);
      },
    }
  );
}
