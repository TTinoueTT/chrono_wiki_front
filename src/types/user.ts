export type User = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  is_superuser: boolean;
  role: string;
  last_login: string;
  failed_login_attempts: string;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
};
