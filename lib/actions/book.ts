"use server";

import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

interface Props extends BorrowBookParams {
  hasBorrowed: boolean;
}

export const borrowBook = async (params: Props) => {
  const { userId, bookId, hasBorrowed } = params;

  if (!hasBorrowed) {
    try {
      const book = await db
        .select({ availableCopies: books.availableCopies })
        .from(books)
        .where(eq(books.id, bookId))
        .limit(1);

      if (!book.length || book[0].availableCopies <= 0) {
        return {
          success: false,
          error: "Book is not available for borrowing book.",
        };
      }

      const dueDate = dayjs().add(7, "day").toDate().toDateString();

      const record = await db.insert(borrowRecords).values({
        userId,
        bookId,
        dueDate,
        status: "BORROWED",
      });

      await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies - 1 })
        .where(eq(books.id, bookId));

      if (record) {
        return {
          success: true,
          data: JSON.parse(JSON.stringify(record)),
          message: "Book borrowed successfully",
        };
      } else {
        return {
          success: false,
          message: "Book was not borrowed.",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "An error occurred on borrowing the book.",
      };
    }
  } else {
    return {
      success: false,
      message: "Book already borrowed.",
    };
  }
};
