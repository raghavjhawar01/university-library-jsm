import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { count, eq } from "drizzle-orm";
import config from "@/lib/config";
import { getInitials } from "@/lib/utils";
import UserCard from "@/components/admin/UserCard";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    .rightJoin(users, eq(borrowRecords.userId, users.id));

  const usersRequests = await db
    .select({
      id: users.id,
      name: users.fullName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.status, "PENDING"));

  const allBooks = await db.select().from(books).limit(5);

  return (
    <div className={"home-container xs:w-full"}>
      <div className={"stat-container"}>
        <div className={"stat"}>
          <div className={"stat-label"}>
            Borrowed Books
            <div className={"stat-increase-counter"}>2</div>
          </div>
          <div className={"stat-count"}>{borrowedBooks.length}</div>
        </div>
        <div className={"stat"}>
          <div className={"stat-label"}>
            Total Users
            <div className={"stat-increase-counter"}>2</div>
          </div>
          <div className={"stat-count"}>10</div>
        </div>
        <div className={"stat"}>
          <div className={"stat-label"}>
            Total Books
            <div className={"stat-decrease-counter"}>2</div>
          </div>
          <div className={"stat-count"}>100</div>
        </div>
      </div>
      <div className={"home-content-container"}>
        <div className={"left-container w-5/12"}>
          <div
            className={
              "borrow-requests-container flex-[1] bg-white p-2 rounded-xl overflow-y-hidden"
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
                  {book.title?.slice(0, 20)}
                  <div className={"author"}>
                    {book.author}| {book.genre}
                  </div>
                  <div className={"user text-xs font-normal "}>
                    <div className={"avatar bg-amber-100 text-[10px]"}>RJ</div>
                    {book.fullName}
                    <div className={"borrow-date text-xs font-normal"}>
                      {book.borrowDate?.toString().slice(4, 15)}
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
        <div className={"right-container overflow-hidden"}>
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
              <div className={"flex justify-start items-center flex-1"}>
                <Avatar
                  className={"flex justify-start items-center h-4 w-4 bg-white"}
                >
                  <AvatarImage src={"icons/admin/plus.svg"} />
                  <AvatarFallback className={"xs:w-48"}>+</AvatarFallback>
                </Avatar>
              </div>
              <div className={"flex items-center justify-end"}>
                Add New Book
              </div>
            </div>
            <div>
              {allBooks.map((book) => (
                <div className={"book-stripe"} key={book.id}>
                  <Image
                    src={config.env.imagekit.urlEndpoint + book.coverUrl}
                    alt={book.title + "-cover"}
                    width={50}
                    height={50}
                  />
                  <div className={"title"}>
                    {book.title?.slice(0, 20)}
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
        </div>
      </div>
    </div>
  );
};
export default Page;
