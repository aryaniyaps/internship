"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileQuery } from "@/lib/queries/profile";
import { User } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export function UserNav({ user }: { user: User }) {
  const { data: profile } = useProfileQuery(user.id);

  return (
    <>
      <Link href="/settings" className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/01.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold leading-none">
          {profile?.username}
        </p>
      </Link>
    </>
  );
}
