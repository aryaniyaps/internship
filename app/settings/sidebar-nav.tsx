"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  const supabase = createClientComponentClient<Database>();

  const router = useRouter();

  return (
    <nav
      className={cn(
        "flex justify-between items-start space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 w-full h-full",
        className
      )}
      {...props}
    >
      <div className="flex w-full h-full space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <Button
        variant="link"
        className="text-red-500"
        onClick={async () => {
          await supabase.auth.signOut();
          router.refresh();
        }}
      >
        signout
      </Button>
    </nav>
  );
}
