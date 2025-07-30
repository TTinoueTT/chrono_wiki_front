"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useActionState } from "react";
import { signupAction } from "./actions";
import { RegisterFormSchema, FormState } from "./definitions";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

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
import { Textarea } from "@/components/ui/textarea";

type FormData = z.infer<typeof RegisterFormSchema>;

const initialState: FormState = { message: "" };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  // 登録成功時の処理
  useAuthRedirect({
    successMessage: state.message,
    redirectPath: "/profile",
    redirectMessage: "signup-success",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      username: "",
      full_name: "",
      avatar_url: "",
      bio: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ユーザー新規登録
          </h2>
        </div>

        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    2文字以上で入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>本名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="山田 太郎"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロフィール画像URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.jpg"
                      type="url"
                      autoComplete="photo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    有効なURLを入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>自己紹介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="自己紹介を入力してください..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    500文字以下で入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="パスワード"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    8文字以上で、英字と数字を含めてください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "登録中..." : "登録"}
            </Button>
          </form>
        </Form>

        {state.message && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
