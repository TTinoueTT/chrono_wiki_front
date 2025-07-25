// ユーザープロフィール表示・編集

export default function ProfilePage() {
  // 仮のユーザーデータ
  const user = {
    username: "sample_user",
    email: "sample@example.com",
    full_name: "サンプル 太郎",
    avatar_url: "https://placehold.co/100x100",
    bio: "これはサンプルの自己紹介です。",
  };

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
      <h1>プロフィール</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src={user.avatar_url}
          alt="avatar"
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
        />
        <div>
          <div>
            <strong>{user.full_name}</strong>
          </div>
          <div>@{user.username}</div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <div>
          <strong>メール:</strong> {user.email}
        </div>
        <div>
          <strong>自己紹介:</strong> {user.bio}
        </div>
      </div>
      <button style={{ marginTop: 24 }}>プロフィール編集</button>
    </div>
  );
}
