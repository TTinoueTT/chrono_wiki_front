// ユーザープロフィール表示・編集
import RedirectMessage from "@/components/RedirectMessage";
import { fetchUserProfile } from "@/lib/api/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const user = await fetchUserProfile();

  // console.log(user);

  return (
    <>
      <RedirectMessage />
      <div
        style={{
          maxWidth: 400,
          margin: "2rem auto",
          padding: 24,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h1>プロフィール</h1>
        <div className="flex items-center gap-4">
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
          <div>
            <div>
              <strong>{user?.full_name}</strong>
            </div>
            <div>@{user?.username}</div>
          </div>
        </div>
        <div className="mt-4">
          <div>
            <strong>メール:</strong> {user?.email}
          </div>
          <div>
            <strong>自己紹介:</strong> {user?.bio}
          </div>
        </div>
        <button className="mt-4">プロフィール編集</button>
      </div>
    </>
  );
}
