import { z } from "zod";

export const RegisterFormSchema = z.object({
  email: z.string().email("メールアドレスが不正です"),
  full_name: z.string().optional(),
  avatar_url: z.string().url("アバターURLが不正です").optional(),
  bio: z
    .string()
    .max(100, { message: "自己紹介は100文字以内で入力してください" })
    .optional(),
  username: z
    .string()
    .min(1, { message: "ユーザー名は必須です" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  password: z
    .string()
    .min(1, { message: "パスワードは必須です" })
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Contain at least one special character.",
    // })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        username?: string[];
        password?: string[];
        full_name?: string[];
        avatar_url?: string[];
        bio?: string[];
      };
      message?: string;
    }
  | {
      success: false;
      message: string;
    }
  | undefined;
