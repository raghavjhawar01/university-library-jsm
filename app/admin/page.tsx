import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { and, count, eq, gt, gte, lt, lte, ne } from "drizzle-orm";
import config from "@/lib/config";
import { getInitials } from "@/lib/utils";
import UserCard from "@/components/admin/UserCard";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notEqual } from "node:assert";

const Page = async () => {
  const borrowedBooks = await db
    .select({
      id: borrowRecords.id,
      title: books.title,
      borrowerId: borrowRecords.userId,
      borrowDate: borrowRecords.borrowDate,
      coverUrl: books.coverUrl,
      author: books.author,
      genre: books.genre,
      fullName: users.fullName,
    })
    .from(books)
    .leftJoin(borrowRecords, eq(books.id, borrowRecords.bookId))
    .rightJoin(users, eq(borrowRecords.userId, users.id))
    .where(ne(books.title, ""));

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayBefore = new Date(today);
  dayBefore.setDate(today.getDate() - 2);

  const booksYesterday = await db
    .select()
    .from(borrowRecords)
    .where(
      and(
        gte(borrowRecords.borrowDate, yesterday),
        lte(borrowRecords.borrowDate, today),
      ),
    );

  const booksToday = await db
    .select()
    .from(borrowRecords)
    .where(gte(borrowRecords.borrowDate, today));

  const usersYesterday = await db
    .select({ email: users.email, joinedOn: users.createAt })
    .from(users)
    .where(and(gte(users.createAt, yesterday), lte(users.createAt, today)));

  const usersToday = await db
    .select({ email: users.email, joinedOn: users.createAt })
    .from(users)
    .where(gte(users.createAt, today));

  const totalBooksYesterday = await db
    .select({ name: books.title })
    .from(books)
    .where(and(gte(books.createdAt, yesterday), lte(books.createdAt, today)));

  const totalBooksToday = await db
    .select({ name: books.title })
    .from(books)
    .where(gte(books.createdAt, today));

  const caretAllBooks = totalBooksToday.length - totalBooksYesterday.length;

  const caretUsers = usersToday.length - usersYesterday.length;

  const caret = booksToday.length - booksYesterday.length;

  const usersRequests = await db
    .select({
      id: users.id,
      name: users.fullName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.status, "PENDING"));

  const allBooks = await db.select().from(books);

  const countUsers = await db.select({ email: users.email }).from(users);

  return (
    <div className={"home-container overflow-auto gap-4 inline-flex w-max"}>
      <div className={"stat-container"}>
        <div className={"stat"}>
          <div className={"stat-label"}>
            Borrowed Books
            <div className={"stat-increase-counter"}>
              <Image
                src={
                  caret >= 0
                    ? "icons/admin/caret-up.svg"
                    : "icons/admin/caret-down.svg"
                }
                width={18}
                height={18}
                alt={"caret_bookWise"}
              />
              {caret > 0 ? caret : -caret}
            </div>
          </div>
          <div className={"stat-count"}>{borrowedBooks.length}</div>
        </div>
        <div className={"stat"}>
          <div className={"stat-label"}>
            Total Users
            <div className={"stat-increase-counter"}>
              <Image
                src={
                  caretUsers >= 0
                    ? "icons/admin/caret-up.svg"
                    : "icons/admin/caret-down.svg"
                }
                width={18}
                height={18}
                alt={"caret_bookWise"}
              />
              {caretUsers > 0 ? caretUsers : -caretUsers}
            </div>
          </div>
          <div className={"stat-count"}>{countUsers.length}</div>
        </div>
        <div className={"stat"}>
          <div className={"stat-label"}>
            Total Books
            <div className={"stat-decrease-counter"}>
              <Image
                src={
                  caretAllBooks >= 0
                    ? "icons/admin/caret-up.svg"
                    : "icons/admin/caret-down.svg"
                }
                width={18}
                height={18}
                alt={"caret_bookWise"}
              />
              {caretAllBooks > 0 ? caretAllBooks : -caretAllBooks}
            </div>
          </div>
          <div className={"stat-count"}>{allBooks.length}</div>
        </div>
      </div>
      <div className={"home-content-container"}>
        <div className={"left-container"}>
          <div
            className={
              "w-full max-h-[50%] overflow-hidden rounded-bl-xl rounded-br-xl"
            }
          >
            <div
              className={
                "borrow-requests-container flex-[1] bg-white p-2 rounded-xl overflow-hidden"
              }
            >
              <div className={"container-header"}>
                <span className={"flex-1  justify-start"}>Borrow Requests</span>
                <span>
                  <Link href={"/admin/borrow-requests"}>View All</Link>
                </span>
              </div>
              {borrowedBooks.map((book) => (
                <div className={"book-stripe"} key={book.id}>
                  <Image
                    src={config.env.imagekit.urlEndpoint + book.coverUrl}
                    alt={book.title + "-cover"}
                    width={50}
                    height={50}
                  />
                  <div className={"title"}>
                    {book.title?.slice(0, 20) === book.title
                      ? book.title
                      : book.title?.slice(0, 20) + "..."}
                    <div className={"author"}>
                      {book.author}| {book.genre}
                    </div>
                    <div className={"user text-xs font-normal items-center"}>
                      <Avatar className={"w-6 h-6"}>
                        <AvatarFallback className={"bg-amber-100"}>
                          {getInitials(book.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      {book.fullName}
                      <div className={"borrow-date text-xs font-normal"}>
                        {book.borrowDate?.toString().slice(4, 15)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "bg-transparent p-4 rounded-2xl flex flex-1 justify-end "
                    }
                  >
                    <Image
                      src={"icons/admin/eye.svg"}
                      alt={"eye"}
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={"bottom-blur"}></div>
          </div>
          <div className={"account-requests-container"}>
            <div className={"container-header"}>
              <span>Account Requests</span>
              <span>
                <Link href={"/admin/account-requests"}>View All</Link>
              </span>
            </div>
            <div
              className={
                "account-requests-row flex flex-1 flex-row gap-2 flex-wrap"
              }
            >
              {usersRequests.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  email={user.email}
                  initials={getInitials(user.name)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={"right-container overflow-hidden rounded-xl"}>
          <div className={"recent-books-container bg-white p-4"}>
            <div className={"container-header"}>
              <span>Recently Added Books</span>
              <span>
                <Link href={"/admin/books"}>View All</Link>
              </span>
            </div>
            <div
              className={
                "p-4 flex flex-1 flex-row bg-light-300 rounded-[0.375rem]"
              }
            >
              <div
                className={
                  "header-addNewBooks flex justify-start items-center flex-1"
                }
              >
                <Button
                  className={
                    "text-sm text-dark-500 bg-transparent shadow-transparent hover:bg-transparent"
                  }
                  asChild
                >
                  <Link
                    href={"/admin/books/new?filter=true"}
                    className={"text-sm"}
                  >
                    <Avatar>
                      <AvatarFallback className={"bg-white"}>+</AvatarFallback>
                    </Avatar>
                    &nbsp;&nbsp;Add New Book
                  </Link>
                </Button>
              </div>
              {/*<div className={"flex items-center justify-end"}>*/}
              {/*  Add New Book*/}
              {/*</div>*/}
            </div>
            <div className={"recent-books-container"}>
              {allBooks.map((book) => (
                <div className={"book-stripe"} key={book.id}>
                  <Image
                    src={config.env.imagekit.urlEndpoint + book.coverUrl}
                    alt={book.title + "-cover"}
                    width={50}
                    height={50}
                  />
                  <div className={"title"}>
                    {book.title?.slice(0, 20) === book.title
                      ? book.title
                      : book.title?.slice(0, 20) + "..."}
                    <div className={"author"}>
                      {book.author}| {book.genre}
                    </div>
                    <div className={"user text-xs font-normal "}>
                      <div className={"borrow-date text-xs font-normal"}>
                        {book.createdAt?.toString().slice(4, 15)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "bg-transparent p-4 rounded-2xl flex flex-1 justify-end items-start"
                    }
                  >
                    <Image
                      src={"icons/admin/eye.svg"}
                      alt={"eye"}
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={"bottom-blur"}></div>
        </div>
      </div>
    </div>
  );
};
export default Page;
