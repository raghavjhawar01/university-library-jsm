import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import dayjs from "dayjs";

interface Props extends Book {
  isLoaned: boolean;
}

const BookCard = async ({
  id,
  title,
  genre,
  coverColor,
  isLoaned = false,
  coverUrl,
}: Props) => {
  const session = await auth();

  const hasBorrowed = await db
    .select()
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.bookId, id),
        eq(borrowRecords.userId, session?.user?.id as string),
      ),
    )
    .limit(1);

  const daysLeft = dayjs(hasBorrowed[0].dueDate.slice(0, 10)).diff(
    dayjs().toDate().toDateString(),
    "days",
  );

  if (hasBorrowed.length === 1) {
    isLoaned = true;
  } else {
    isLoaned = false;
  }

  return (
    <li className={cn(isLoaned && "xs:w-52 w-full")}>
      <Link
        href={`/books/${id}`}
        className={cn(isLoaned && "w-full flex flex-col items-center")}
      >
        <BookCover coverColor={coverColor} coverImage={coverUrl} />
        <div className={cn("mt-4 mb-4", !isLoaned && "xs:max-w-40 max-w-28")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>

        {isLoaned && (
          <div className="mt-3 w-full">
            <div className="book-loaned">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-light-100">
                {daysLeft} days left to return the book.
              </p>
            </div>
            <Button className="book-btn font-bebas-neue text-dark-100">
              Download Receipt
            </Button>
            <Button className="book-btn font-bebas-neue text-dark-100">
              Return Book
            </Button>
          </div>
        )}
      </Link>
    </li>
  );
};
export default BookCard;
