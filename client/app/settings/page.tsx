import { Separator } from "@/components/ui/separator";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { APP_NAME } from "@/lib/constants";
import { Database } from "@/lib/database.types";
import getQueryClient from "@/lib/query-client";
import repo from "@/lib/repo";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { ProfileForm } from "./profile-form";

export default async function SettingsProfilePage() {
  const client = getQueryClient();

  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  await client.prefetchQuery({
    queryKey: ["profile", session!.user.id],
    queryFn: async () => await repo.getProfile(session!.user.id, supabase),
  });

  const dehydratedState = dehydrate(client, {
    shouldDehydrateQuery: () => true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">user profile</h3>
        <p className="text-sm text-muted-foreground">
          this is how others will see you on {APP_NAME}
        </p>
      </div>
      <Separator />
      <Hydrate state={dehydratedState}>
        <ProfileForm user={session!.user} />
      </Hydrate>
    </div>
  );
}
