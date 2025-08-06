// ユーザープロフィール表示・編集
import { cookies } from "next/headers";
import { fetchUserProfile } from "@/lib/api/auth";
import { MessageDisplay } from "@/components/MessageDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const user = await fetchUserProfile(accessToken);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <MessageDisplay className="mb-4" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ユーザー情報が見つかりません
            </h1>
            <p className="text-gray-600">ログインが必要です。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <MessageDisplay className="mb-6" />

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              プロフィール
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  基本情報
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      ユーザー名
                    </dt>
                    <dd className="text-sm text-gray-900">{user.username}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      メールアドレス
                    </dt>
                    <dd className="text-sm text-gray-900">{user.email}</dd>
                  </div>
                  {user.full_name && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        本名
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {user.full_name}
                      </dd>
                    </div>
                  )}
                  {user.bio && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        自己紹介
                      </dt>
                      <dd className="text-sm text-gray-900">{user.bio}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <Avatar className="size-16">
                <AvatarImage
                  src={
                    user?.avatar_url
                      ? user.avatar_url
                      : "https://placehold.co/100x100"
                  }
                />
                <AvatarFallback>
                  {user?.full_name?.slice(0, 2) || "N/A"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
