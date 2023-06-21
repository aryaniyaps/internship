"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export function SocialLogin() {
  const supabase = createClientComponentClient();

  const router = useRouter();

  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [error, setError] = React.useState<string | null>(null);

  // Listen for changes in search params and set the error state
  useEffect(() => {
    setError(searchParams.get("error"));
  }, [searchParams]);

  // Listen for changes in error state and show a toast
  useEffect(() => {
    if (error) {
      toast({
        description: error,
        variant: "destructive",
      });
      router.replace("/signin");
    }
  }, [error, toast, router]);

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",

            options: {
              redirectTo: `${location.origin}/auth/callback/`,
            },
          });

          if (error) {
            toast({
              description: "unexpected error occured. Please try again",
              variant: "destructive",
            });
          }
        }}
      >
        <Icons.google className="mr-2 h-4 w-4" /> Google
      </Button>
    </>
  );
}
