// ユーザープロフィール表示・編集
import RedirectMessage from "@/components/RedirectMessage";
import { fetchUserProfile } from "@/lib/api/auth";

export default async function ProfilePage() {
  const user = await fetchUserProfile();

  console.log(user);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <RedirectMessage />
      <h1>プロフィール</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src={
            user?.avatar_url ? user.avatar_url : "https://placehold.co/100x100"
          }
          alt="avatar"
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
        />
        <div>
          <div>
            <strong>{user?.full_name}</strong>
          </div>
          <div>@{user?.username}</div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <div>
          <strong>メール:</strong> {user?.email}
        </div>
        <div>
          <strong>自己紹介:</strong> {user?.bio}
        </div>
      </div>
      <button style={{ marginTop: 24 }}>プロフィール編集</button>
    </div>
  );
}
