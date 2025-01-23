import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { books, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";

const Home = async () => {
  const result = await db.select().from(users);
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  // console.log(JSON.stringify(result, null, 2));
  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      <BookList
        title="Popular Books"
        books={latestBooks.slice(1)}
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
