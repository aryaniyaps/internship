import { cookies } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function LandingPage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <section className="mb-32 text-center">
        <div className="flex justify-center">
          <div className="max-w-[800px]">
            <h2 className="mb-12 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
              landing page title <br />
              <span className="text-primary">goes here</span>
            </h2>
            <p className="text-lg text-neutral-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
              officia consequatur adipisci tenetur repudiandae rerum quos.
            </p>
          </div>
        </div>
      </section>
      {session ? (
        <Link href="/dashboard">
          <Button variant="outline">open {APP_NAME}</Button>
        </Link>
      ) : (
        <Link href="/signin">
          <Button variant="outline">sign in to {APP_NAME}</Button>
        </Link>
      )}
    </div>
  );
}
