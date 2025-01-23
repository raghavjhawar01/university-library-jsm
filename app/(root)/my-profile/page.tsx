import React from "react";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import BookList from "@/components/BookList";
import { books, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { desc, eq } from "drizzle-orm";
import { Session } from "next-auth";
import { auth } from "@/auth";

const Page = async () => {
  const session = await auth();

  const borrowedBooksData = (await db
    .select({
      id: books.id,
      title: books.title,
      description: books.description,
      author: books.author,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      videoUrl: books.videoUrl,
      rating: books.rating,
      summary: books.summary,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      createdAt: books.createdAt,
    })
    .from(books)
    .leftJoin(borrowRecords, eq(books.id, borrowRecords.bookId))
    .where(eq(borrowRecords.userId, session?.user?.id as string))) as Book[];

  console.log(JSON.parse(JSON.stringify(borrowedBooksData)));

  return (
    <>
      <BookList title="Borrowed Books" books={borrowedBooksData}></BookList>
    </>
  );
};
export default Page;
