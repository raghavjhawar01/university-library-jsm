import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { users } from "@/database/schema";
import { db } from "@/database/drizzle";

const Home = async () => {
  const result = await db.select().from(users);

  console.log(JSON.stringify(result, null, 2));
  return (
    <>
      <BookOverview {...sampleBooks[0]} />

      <BookList
        title="Popular Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

//Can also be
//     <>
//         <Button>Click Me Now</Button>
//     </>
export default Home;
