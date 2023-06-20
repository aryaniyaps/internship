import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const requestURL = new URL(request.url);
  const cookieStore = cookies();

  const code = requestURL.searchParams.get("code");
  const continueURL = cookieStore.get("continue")?.value || "/dashboard";

  if (code) {
    try {
      const supabase = createRouteHandlerClient<Database>({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      // set error message here
      const redirectURL = new URL(requestURL.origin.concat("/signin"));
      redirectURL.searchParams.set(
        "error",
        "unexpected error occured. Please try again"
      );
      return NextResponse.redirect(redirectURL);
    }
  }

  return NextResponse.redirect(requestURL.origin.concat(continueURL));
}
