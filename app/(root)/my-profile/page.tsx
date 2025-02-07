import React from "react";
import BookList from "@/components/BookList";
import { books, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { and, eq, ne } from "drizzle-orm";
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
    .leftJoin(
      borrowRecords,
      and(
        eq(books.id, borrowRecords.bookId),
        ne(borrowRecords.status, "RETURNED"),
      ),
    )
    .where(eq(borrowRecords.userId, session?.user?.id as string))) as Book[];

  return (
    <>
      <BookList title="Borrowed Books" books={borrowedBooksData}></BookList>
    </>
  );
};
export default Page;
