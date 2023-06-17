import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMemo } from "react";
import { Database } from "../database.types";

export default function useSupabase() {
  // wrap supabase client in a `useMemo` hook to
  // prevent it from being recreated on every render
  return useMemo(() => {
    return createClientComponentClient<Database>();
  }, []);
}
