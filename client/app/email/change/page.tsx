"use client";
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CompleteEmailChangePage() {
  // TODO: DELETE EXISTING OAUTH CONNECTIONS FOR OLD EMAIL ON EMAIL CHANGE
  const router = useRouter();
  const searchParams = new URLSearchParams(location.hash.substring(1));

  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function completeEmailChange(
      access_token: string,
      refresh_token: string
    ) {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (error) {
        console.log(error.message);
      } else {
        router.push("/settings/account");
      }
    }

    if (type === "email_change" && access_token && refresh_token) {
      // complete the email change
      completeEmailChange(access_token, refresh_token);
    }
  }, [type, access_token, refresh_token, router, supabase]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="underline text-gray-400">
        completing email change, redirecting
      </h1>
    </div>
  );
}
