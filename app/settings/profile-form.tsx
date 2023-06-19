"use client";

import * as React from "react";

import { AvatarUpload } from "@/components/ui/avatar-upload";
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
import { useUpdateProfileMutation } from "@/lib/mutations/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useProfileQuery } from "../../lib/queries/profile";

const profileSchema = z.object({
  username: z
    .string({ required_error: "please enter your username" })
    .min(3, {
      message: "username must be at least 3 characters",
    })
    .max(28, {
      message: "username cannot be longer than 28 characters",
    }),
  avatar: z.optional(z.any()), // Assuming we have some way to validate files server-side
});

interface ProfileFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: User;
}

export function ProfileForm({ user, className, ...props }: ProfileFormProps) {
  const supabase = createClientComponentClient<Database>();

  const { toast } = useToast();

  const { data: profile } = useProfileQuery(user.id);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(profile!.avatar_url);

  const mutation = useUpdateProfileMutation();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile!.username,
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    let result;
    if (values.avatar) {
      // upload avatar here
      const { error, data } = await supabase.storage
        .from("avatars")
        .upload(`${user.id}/avatar`, values.avatar);

      if (error) {
        toast({
          description: "couldn't upload avatar, please try again",
          variant: "destructive",
        });
        console.error(error);
      }

      result = await mutation.mutateAsync({
        id: user.id,
        username: values.username,
        avatar_url: data?.path,
      });
    } else {
      result = await mutation.mutateAsync({
        id: user.id,
        username: values.username,
      });
    }

    form.reset({ username: result!.username });

    toast({
      description: "your user profile is updated!",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 flex items-start"
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormControl>
                <AvatarUpload
                  avatarURL={publicUrl}
                  onAvatarChange={onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4 w-6/12">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  this is your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            update profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
