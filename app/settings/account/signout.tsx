"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/navigation";

export function SignOut() {
  const supabase = createClientComponentClient<Database>();

  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        await supabase.auth.signOut();
        router.refresh();
      }}
    >
      sign out
    </Button>
  );
}
