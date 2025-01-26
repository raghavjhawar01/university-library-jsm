import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
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

  const isFilter = searchParams?.filter || null;

  let allBooks = [] as Book[];

  if (isFilter) {
    allBooks = (await db.select().from(books).orderBy(books.title)) as Book[];
  } else {
    allBooks = (await db.select().from(books)) as Book[];
  }
  return (
    <div className={"w-full rounded-2xl bg-white p-7"}>
      <div className={"flex flex-wrap items-center justify-between gap-2"}>
        <h2 className={"text-xl font-semibold"}>All Books</h2>
        <div className={"flex gap-2"}>
          <Button
            className={
              isFilter
                ? "text-sm text-white inline-flex bg-blue-600 hover:bg-blue-600"
                : "text-sm text-gray-400 inline-flex bg-transparent hover:bg-transparent"
            }
            asChild
          >
            <Link href={isFilter ? "./books" : "./books?filter=true"}>A-Z</Link>
            {/*<Image src={"/admin/"} alt={} width={15} height={15} />*/}
          </Button>
          <Button className={"bg-primary-admin"} asChild>
            <Link href={"/admin/books/new"} className={"text-white"}>
              + Create a New Book
            </Link>
          </Button>
        </div>
      </div>
      <div>
        <table className={"mt-7 w-full overflow-y-auto"}>
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
                    "p-2 w-[97px] flex-col items-center align-items-center"
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className={"p-0 m-0 bg-transparent"}>
                        <Image
                          src="/icons/admin/trash.svg"
                          alt={"delete-icon"}
                          width={24}
                          height={24}
                        />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure? you want to delete the Book named{" "}
                          {book.title}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild className={"confirm-reject"}>
                          <Link href={"/admin/books"}>Cancel</Link>
                        </AlertDialogCancel>
                        <AlertDialogAction
                          asChild
                          className={"confirm-approve"}
                        >
                          <Link
                            href={
                              "/admin/books/new/" +
                              book.id +
                              "?deleteRecord=true"
                            }
                          >
                            Delete
                          </Link>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
