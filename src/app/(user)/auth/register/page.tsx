"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useActionState, startTransition } from "react";
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
import { ImageUpload } from "@/components/ui/image-upload";

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
      avatar_file: null,
      bio: "",
      password: "",
    },
  });

  // カスタムフォーム送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // フォームのバリデーション
    const isValid = await form.trigger();
    if (!isValid) return;

    // フォームデータを取得
    const formData = new FormData();
    const values = form.getValues();

    // 各フィールドをFormDataに追加
    formData.append("email", values.email);
    formData.append("username", values.username);
    if (values.full_name) {
      formData.append("full_name", values.full_name);
    }
    if (values.bio) {
      formData.append("bio", values.bio);
    }
    formData.append("password", values.password);

    // ファイルデータを追加
    if (values.avatar_file) {
      formData.append("avatar_file", values.avatar_file);
    }

    /* eslint-disable no-console */
    console.log("送信するFormData:", {
      email: values.email,
      username: values.username,
      full_name: values.full_name,
      avatar_file: values.avatar_file
        ? {
            name: values.avatar_file.name,
            size: values.avatar_file.size,
            type: values.avatar_file.type,
          }
        : null,
      bio: values.bio,
    });
    /* eslint-enable no-console */

    // startTransitionを使用してServer Actionを呼び出し
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ユーザー新規登録
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    3文字以上で入力してください。
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
              name="avatar_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロフィール画像</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={false} // 画像アップロードを有効にする
                    />
                  </FormControl>
                  <FormDescription>
                    5MB以下の画像ファイルを選択してください。
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
