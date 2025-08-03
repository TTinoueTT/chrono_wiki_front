import { z } from "zod";

export const RegisterFormSchema = z.object({
  email: z.string().email("メールアドレスが不正です"),
  full_name: z
    .string()
    .max(100, {
      message: "本名は100文字以下で入力してください。",
    })
    .optional(),
  avatar_file: z
    .instanceof(File, { message: "画像ファイルを選択してください" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "ファイルサイズは5MB以下にしてください",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "画像ファイルを選択してください",
    })
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(500, { message: "自己紹介は500文字以内で入力してください" })
    .optional(),
  username: z
    .string()
    .min(3, {
      message: "ユーザー名は3文字以上で入力してください。",
    })
    .max(50, {
      message: "ユーザー名は50文字以下で入力してください。",
    }),
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
        avatar_file?: string[];
        bio?: string[];
      };
      message?: string;
    }
  | {
      success: false;
      message: string;
    }
  | undefined;
