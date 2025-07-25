import type { NextPage } from "next";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

/**
 * データを取得する
 * @returns
 */
const Page: NextPage = async () => {
  // const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 600 },
  });
  // const response = await fetch("https://jsonplaceholder.typicode.com/users", {
  //   cache: "no-store",
  // });
  const users = await response.json();
  console.log(users);

  return (
    <div>
      {users.map((user: User) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
};

export default Page;
