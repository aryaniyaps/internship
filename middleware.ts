import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { Database } from "@/lib/database.types";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Forward to protected route if we have a session
  if (session) {
    return res;
  }

  // Auth condition not met, redirect to signin page.
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/signin";
  const redirectRes = NextResponse.redirect(redirectUrl);
  redirectRes.cookies.set("continue", req.nextUrl.pathname);
  return redirectRes;
}

export const config = {
  matcher: ["/dashboard", "/settings/:path*"],
};
