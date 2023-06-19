"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Database } from "@/lib/database.types";
import { useProfileQuery } from "@/lib/queries/profile";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export function UserNav({ user }: { user: User }) {
  const supabase = createClientComponentClient<Database>();
  const { data: profile } = useProfileQuery(user.id);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(profile!.avatar_url);

  return (
    <>
      <Link href="/settings" className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={publicUrl} alt="@aryaniyaps" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold leading-none">
          {profile?.username}
        </p>
      </Link>
    </>
  );
}
