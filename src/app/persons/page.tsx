import type { NextPage } from "next";

type Person = {
  id: number;
  ssid: string;
  full_name: string;
  display_name: string;
  birth_date: string;
  death_date: string;
  born_country: string;
  born_region: string;
  description: string;
  portrait_url: string;
};

/**
 * データを取得する
 * @returns
 */
const Page: NextPage = async () => {
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": process.env.CHRONO_WIKI_API_KEY || "",
  };

  const response = await fetch("http://localhost:8020/api/v1/persons", {
    headers: headers,
  });
  // const response = await fetch("https://jsonplaceholder.typicode.com/users", {
  //   next: { revalidate: 600 },
  // });
  // const response = await fetch("https://jsonplaceholder.typicode.com/users", {
  //   cache: "no-store",
  // });

  const persons = await response.json();
  console.log(persons);

  return (
    <div>
      {persons.map((person: Person) => (
        <p key={person.id}>{person.full_name}</p>
      ))}
    </div>
  );
};

export default Page;
