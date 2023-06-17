import { UserNav } from "@/app/dashboard/user-nav";
import { APP_NAME } from "@/lib/constants";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="border-b">
        <div className="max-w-7xl mx-auto flex items-center p-4">
          <h1 className="font-semibold">{APP_NAME}</h1>
          <div className="ml-auto">
            <UserNav user={session!.user} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4">{children}</div>
    </div>
  );
}
