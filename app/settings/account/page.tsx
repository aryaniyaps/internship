import { Separator } from "@/components/ui/separator";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AccountForm } from "./account-form";

export default async function SettingsAccountPage() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">user account</h3>
        <p className="text-sm text-muted-foreground">
          manage your user account
        </p>
      </div>
      <Separator />
      <AccountForm user={session!.user} />
    </div>
  );
}
