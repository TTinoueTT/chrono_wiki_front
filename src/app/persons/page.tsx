import type { NextPage } from "next";
import { Person } from "@/types/person";
import { fetchPersons } from "@/lib/api/persons";

/**
 * データを取得する
 * @returns
 */
const Page: NextPage = async () => {
  const persons = await fetchPersons();

  if (!persons) return <div>No persons found</div>;

  return (
    <div>
      <h1>Persons</h1>
      <div>
        {persons.map((person: Person) => (
          <p key={person.id}>{person.full_name}</p>
        ))}
      </div>
    </div>
  );
};

export default Page;
