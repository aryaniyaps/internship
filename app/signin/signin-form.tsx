"use client";

import * as React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const signinSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "please enter a valid email" }),
});

interface SigninFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export function SigninForm({ className, ...props }: SigninFormProps) {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "" },
  });

  const supabase = createClientComponentClient();

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    await supabase.auth.signInWithOtp({
      email: values.email,

      options: {
        emailRedirectTo: `${location.origin}/auth/callback/`,
      },
    });
    toast({
      title: "email link sent",
      description: "check your email for a sign in link!",
    });
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-6", className)}
        {...props}
      >
        <div className="grid gap-4">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            sign in with email
          </Button>
        </div>
      </form>
    </Form>
  );
}
