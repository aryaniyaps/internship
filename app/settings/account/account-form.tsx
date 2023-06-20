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
import { useToast } from "@/lib/hooks/use-toast";
import { useUpdateProfileMutation } from "@/lib/mutations/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import * as z from "zod";

const accountSchema = z.object({
  email: z
    .string({ required_error: "please enter your email" })
    .email({ message: "please enter a valid email" }),
});

interface AccountFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: User;
}

export function AccountForm({ user, className, ...props }: AccountFormProps) {
  const { toast } = useToast();

  const mutation = useUpdateProfileMutation();

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: user.email,
    },
  });

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    const result = await mutation.mutateAsync({
      id: user.id,
      username: values.email,
    });
    form.reset({ email: result!.username });

    toast({
      description: "your user account is updated!",
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
