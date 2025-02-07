"use server";

import { books, borrowRecords, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import dayjs from "dayjs";
import { sendEmail } from "@/lib/workflow";

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
          error: "Book is not available for borrowing.",
        };
      }

      const dueDate = dayjs().add(7, "day").toDate().toDateString();

      const record = await db.insert(borrowRecords).values({
        userId,
        bookId,
        dueDate,
        status: "BORROWED",
      });

      const borrowDate = dayjs().toDate().toDateString();

      const whichBook = await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies - 1 })
        .where(eq(books.id, bookId))
        .returning({ title: books.title });

      const userDetails = await db
        .select({ fullName: users.fullName, email: users.email })
        .from(users)
        .where(eq(users.id, userId));

      const firstName = userDetails[0].fullName.split(" ");

      await sendEmail({
        email: userDetails[0].email,
        subject: "You have borrowed a book!",
        message: {
          userName: firstName[0],
          text:
            `You’ve successfully borrowed ${whichBook[0].title}. Here are the details:\n` +
            `Borrowed On: ${borrowDate}\n` +
            `Due Date: ${dueDate}\n` +
            "\n" +
            "Enjoy your reading, and don’t forget to return the book on time!",
          heading: "You borrowed a book!",
          buttonUrl: "http://localhost:3000",
          buttonTitle: "Check your library",
        },
      });

      if (record) {
        return {
          success: true,
          data: JSON.parse(JSON.stringify(record)),
          message: "Book borrowed successfully",
        };
      } else {
        console.log("Here error4!");
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

interface grProps extends BorrowBookParams {
  hasBorrowed: boolean;
}

export const borrowedBookDetails = async (params: grProps) => {
  const { userId, bookId } = params;

  const bookDetails = await db
    .select({
      email: users.email,
      fullName: users.fullName,
      title: books.title,
      author: books.author,
      genre: books.genre,
      borrowedOn: borrowRecords.borrowDate,
      dueOn: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
    })
    .from(books)
    .leftJoin(borrowRecords, eq(borrowRecords.bookId, books.id))
    .rightJoin(users, eq(borrowRecords.userId, users.id))
    .where(
      and(eq(borrowRecords.userId, userId), eq(borrowRecords.bookId, bookId)),
    );

  const today = new Date().toDateString();
  const dueOnDate = new Date(bookDetails[0]?.dueOn!);
  const borrowedOnDate = new Date(bookDetails[0]?.borrowedOn!);
  const returnDate = bookDetails[0].returnDate
    ? new Date(bookDetails[0]?.returnDate!)
    : null;

  const durationInMilliSeconds = returnDate
    ? returnDate.getTime() - borrowedOnDate.getTime()
    : dueOnDate.getTime() - borrowedOnDate.getTime();
  const duration = durationInMilliSeconds / (1000 * 60 * 60 * 24);

  const now = new Date();
  const isOverdue =
    (now.getTime() - dueOnDate.getTime()) / (1000 * 60 * 60 * 24);

  let overdueFlag;
  if (isOverdue) {
    overdueFlag = isOverdue ? Math.ceil(isOverdue) : 0;
  } else {
    overdueFlag = isOverdue ? Math.ceil(isOverdue) : 0;
  }

  const receiptId = Math.floor(Math.random() * 90000000) + 10000000; // Generates an 8-digit number

  const updateReceiptId = await db
    .update(borrowRecords)
    .set({
      receiptId: receiptId,
    })
    .where(
      and(
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED"),
      ),
    );

  if (bookDetails && updateReceiptId) {
    await sendEmail({
      email: bookDetails[0].email,
      subject: "Your receipt is generated successfully!",
      message: {
        userName: bookDetails[0].fullName,
        heading: "Borrow Receipt",
        typeOfEmail: "receipt",
        receipt: {
          id: receiptId.toString(),
          dateIssued: today,
          bookTitle: bookDetails[0].title!,
          bookAuthor: bookDetails[0].author!,
          bookGenre: bookDetails[0].genre!,
          borrowDate: bookDetails[0]?.borrowedOn?.toDateString()!,
          dueDate: bookDetails[0].dueOn!,
          duration: Math.round(duration),
          overdueFlag: overdueFlag,
        },
      },
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(bookDetails)),
      message: "Book Details are received.",
    };
  } else {
    return {
      success: false,
      message: "Book details are not received.",
    };
  }
};

interface rbProps extends BorrowBookParams {
  hasBorrowed: boolean;
}

export const returnBook = async (params: rbProps) => {
  const { userId, bookId, hasBorrowed } = params;

  if (hasBorrowed) {
    try {
      const bookBorrowed = await db
        .select({
          bookId: borrowRecords.bookId,
          borrowedOn: borrowRecords.borrowDate,
        })
        .from(borrowRecords)
        .where(
          and(
            eq(borrowRecords.bookId, bookId),
            eq(borrowRecords.userId, userId),
          ),
        )
        .limit(1);

      if (!bookBorrowed.length || !bookBorrowed[0].bookId) {
        return {
          success: false,
          error: "You did not borrow this book.",
        };
      }

      const returnDate = dayjs().toDate().toDateString();

      const book = await db
        .select({ availableCopies: books.availableCopies })
        .from(books)
        .where(eq(books.id, bookId))
        .limit(1);

      const returnedBookUpdate = await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies + 1 })
        .where(eq(books.id, bookId))
        .returning({ title: books.title });

      const returnBorrowRecords = await db
        .update(borrowRecords)
        .set({ returnDate: returnDate, status: "RETURNED" })
        .where(
          and(
            eq(borrowRecords.bookId, bookId),
            eq(borrowRecords.userId, userId),
          ),
        )
        .returning({
          bookId: borrowRecords.bookId,
          userId: borrowRecords.userId,
          status: borrowRecords.status,
        });

      const userDetails = await db
        .select({ fullName: users.fullName, email: users.email })
        .from(users)
        .where(eq(users.id, userId));

      const firstName = userDetails[0].fullName.split(" ");

      const borrowDate = dayjs(bookBorrowed[0].borrowedOn!)
        .toDate()
        .toDateString();

      const returnDatee = dayjs(returnDate);

      const duration = returnDatee.diff(borrowDate, "days");

      await sendEmail({
        email: userDetails[0].email,
        subject: `Thank You for returning ${returnedBookUpdate[0].title}!`,
        message: {
          userName: firstName[0],
          text:
            `We have successfully received your return of ${returnedBookUpdate[0].title}. Thank you for returning it on time.\n` +
            "\nLooking for your next read? Browse our collection and borrow your next favorite book!",
          heading: `Thank You for returning ${returnedBookUpdate[0].title}!`,
          buttonUrl: "http://localhost:3000/",
          buttonTitle: "Explore Books",
        },
      });

      if (returnBorrowRecords) {
        return {
          success: true,
          data: JSON.parse(JSON.stringify(returnBorrowRecords)),
          message: "Book returned successfully",
        };
      } else {
        console.log("Here error4!");
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
