"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Database } from "@/lib/database.types";
import { useToast } from "@/lib/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import * as z from "zod";

const userSchema = z.object({
  email: z
    .string({ required_error: "please enter your email" })
    .email({ message: "please enter a valid email" }),
});

interface AccountFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: User;
}

export function AccountForm({ user, className, ...props }: AccountFormProps) {
  const { toast } = useToast();

  const supabase = createClientComponentClient<Database>();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user.email,
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    const { data, error } = await supabase.auth.updateUser(
      { email: values.email },
      { emailRedirectTo: `${location.origin}/email/change/` }
    );

    console.log(data.user);

    form.reset({ email: user.email });

    if (error) {
      toast({
        description: "unexpected error occured. Please try again",
        variant: "destructive",
      });
      return;
    }

    toast({
      description: `we have sent a confirmation email to ${values.email}. Please follow instructions from there to change your email`,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 flex flex-col w-6/12"
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email address</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormDescription>your email address is private</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          update account
        </Button>
      </form>
    </Form>
  );
}
