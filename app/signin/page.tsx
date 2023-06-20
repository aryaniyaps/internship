import { APP_NAME } from "@/lib/constants";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SigninForm } from "./signin-form";
import { SocialLogin } from "./social-login";

export const metadata: Metadata = {
  title: `sign in to ${APP_NAME}`,
  description: "user sign in page",
};

export default async function SigninPage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // user is already logged in
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto max-w-sm flex flex-col items-center justify-center p-8">
      <div className="flex w-full flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            sign in to <Link href="/">{APP_NAME}</Link>
          </h1>
          <p className="text-sm text-muted-foreground">
            enter your email to sign in to your account
          </p>
        </div>

        <SigninForm />

        <SocialLogin />

        <p className="px-8 text-center text-sm text-muted-foreground">
          by clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
