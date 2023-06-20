"use client";
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CompleteEmailChangePage() {
  const router = useRouter();
  const { type, access_token } = router.query;
  console.log(type, access_token);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (type === "recovery" && access_token) {
      // complete the email change
      completeEmailChange(access_token);
    }
  }, [type, access_token]);

  const completeEmailChange = async (access_token: any) => {
    // const { error } = await supabase.auth.updateUser({}, {});
    // if (error) {
    //   console.log(error.message);
    // } else {
    //   router.push("/");
    // }
  };

  return (
    <div>
      <h1>Completing email change...</h1>
    </div>
  );
}
