import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users, books } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Image from "next/image";
import config from "@/lib/config";
import BookCover from "@/components/BookCover";

const Page = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  if (!isAdmin) {
    redirect("/");
  }
  const allBooks = (await db.select().from(books)) as Book[];

  return (
    <div className={"w-full rounded-2xl bg-white p-7"}>
      <div className={"flex flex-wrap items-center justify-between gap-2"}>
        <h2 className={"text-xl font-semibold"}>All Books</h2>
        <Button className={"bg-primary-admin"} asChild>
          <Link href={"/admin/books/new"} className={"text-white"}>
            + Create a New Book
          </Link>
        </Button>
      </div>
      <div className={"mt-7 w-full overflow-hidden"}>
        <table>
          <thead className={"text-left text-sm bg-stone-100 "}>
            <tr>
              <th
                className={"p-2 w-[450px] font-ibm-plex-sans font-extralight"}
              >
                Book Title
              </th>
              <th
                className={"p-2 w-[170px] font-ibm-plex-sans font-extralight"}
              >
                Author
              </th>
              <th
                className={"p-2 w-[170px] font-ibm-plex-sans font-extralight"}
              >
                Genre
              </th>
              <th
                className={"p-2 w-[170px] font-ibm-plex-sans font-extralight"}
              >
                Date Created
              </th>
              <th className={"p-2 w-[97px] font-ibm-plex-sans font-extralight"}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allBooks.map((book) => (
              <tr key={book.title} className={"bg-primary-dark text-xs"}>
                <td className={"p-2 flex w-[450px]"}>
                  <div className={"inline-flex"}>
                    {/*@ts-ignore*/}
                    <BookCover
                      coverColor={book.coverColor}
                      coverImage={book.coverUrl}
                      leftString={"0%"}
                      className={"book-cover_extraSmall"}
                      variant={"extraSmall"}
                    />
                  </div>
                  <div className={"inline-flex items-center"}>{book.title}</div>
                </td>
                <td className={"p-2 w-[170px]"}>{book.author}</td>
                <td className={"p-2 w-[170px]"}>{book.genre}</td>
                <td className={"p-2 w-[170px]"}>
                  {book.createdAt?.toString().slice(3, 15)}
                </td>
                <td
                  className={
                    "p-2 w-[96px] flex-col items-center align-items-center"
                  }
                >
                  <Button className={"p-0 m-0 bg-transparent"} asChild>
                    <Link
                      href={"/admin/books/new/" + book.id + "?edit=true"}
                      className={"inline-flex mr-2.5"}
                    >
                      <Image
                        src="/icons/admin/edit.svg"
                        alt={"delete-icon"}
                        width={24}
                        height={24}
                      />
                    </Link>
                  </Button>
                  <Button className={"p-0 m-0 bg-transparent"} asChild>
                    <Link
                      href={"/admin/delete/" + book.id}
                      className={"inline-flex"}
                    >
                      <Image
                        src="/icons/admin/trash.svg"
                        alt={"delete-icon"}
                        width={24}
                        height={24}
                      />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Page;
