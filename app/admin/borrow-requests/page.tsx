import React from "react";
import { db } from "@/database/drizzle";
import {
  books,
  BORROW_STATUS_ENUM,
  borrowRecords,
  ROLE_ENUM,
  users,
} from "@/database/schema";
import { count, desc, eq, ne } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import Select from "@/components/admin/Select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeleteLink from "@/components/admin/DeleteLink";
import config from "@/lib/config";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const isFilter = (await searchParams?.filter) || null;

  let borrowedBooks: any[];

  // const status = Object.values(BORROW_STATUS_ENUM);

  if (isFilter) {
    borrowedBooks = await db
      .select({
        id: borrowRecords.id,
        name: users.fullName,
        bookName: books.title,
        email: users.email,
        coverUrl: books.coverUrl,
        status: borrowRecords.status,
        borrowDate: borrowRecords.borrowDate,
        returnDate: borrowRecords.returnDate,
        dueDate: borrowRecords.dueDate,
      })
      .from(borrowRecords)
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .rightJoin(users, eq(borrowRecords.userId, users.id))
      .where(ne(books.title, ""))
      .orderBy(desc(borrowRecords.borrowDate));
  } else {
    borrowedBooks = await db
      .select({
        id: borrowRecords.id,
        name: users.fullName,
        bookName: books.title,
        email: users.email,
        coverUrl: books.coverUrl,
        status: borrowRecords.status,
        borrowDate: borrowRecords.borrowDate,
        returnDate: borrowRecords.returnDate,
        dueDate: borrowRecords.dueDate,
      })
      .from(borrowRecords)
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .rightJoin(users, eq(borrowRecords.userId, users.id))
      .where(ne(books.title, ""));
  }

  // noinspection JSFileReferences
  return (
    <div className={"w-max rounded-2xl bg-white p-7"}>
      <div className={"flex flex-wrap items-center justify-between gap-2"}>
        <h2 className={"text-xl font-semibold"}>Borrow Book Requests</h2>
        <Button
          className={
            isFilter
              ? "text-sm text-white inline-flex bg-blue-600 hover:bg-blue-600"
              : "text-sm text-gray-400 inline-flex bg-transparent hover:bg-transparent"
          }
          asChild
        >
          <Link
            href={
              isFilter ? "./borrow-requests" : "./borrow-requests?filter=true"
            }
          >
            A-Z
          </Link>
          {/*<Image src={"/admin/"} alt={} width={15} height={15} />*/}
        </Button>
      </div>
      <div className={"mt-7 w-max overflow-y-auto overflow-x-auto"}>
        <table>
          <thead className={"text-left text-sm bg-stone-100 "}>
            <tr>
              <th
                className={"p-2 w-[210px] font-ibm-plex-sans font-extralight"}
              >
                Book
              </th>
              <th
                className={"p-2 w-[210px] font-ibm-plex-sans font-extralight"}
              >
                User Request
              </th>
              <th
                className={"p-2 w-[124px] font-ibm-plex-sans font-extralight"}
              >
                Status
              </th>
              <th
                className={"p-2 w-[124px] font-ibm-plex-sans font-extralight"}
              >
                Borrowed Date
              </th>
              <th
                className={"p-2 w-[124px] font-ibm-plex-sans font-extralight"}
              >
                Return Date
              </th>
              <th
                className={"p-2 w-[124px] font-ibm-plex-sans font-extralight"}
              >
                Due Date
              </th>
              <th
                className={"p-2 w-[130px] font-ibm-plex-sans font-extralight"}
              >
                Receipt
              </th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((bookRecord) => (
              <tr key={bookRecord.id} className={"bg-primary-dark text-xs"}>
                <td
                  className={
                    "p-2 w-[210px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <div className={"inline-flex flex-row items-center gap-2"}>
                    <Image
                      src={
                        config.env.imagekit.urlEndpoint + bookRecord.coverUrl
                      }
                      width={30}
                      height={30}
                      alt={bookRecord.bookName}
                    />
                    {bookRecord.bookName}
                  </div>
                </td>
                <td
                  className={
                    "flex gap-2 p-2 w-[220px] font-ibm-plex-sans text-sm"
                  }
                >
                  <Avatar>
                    {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
                    <AvatarFallback className="bg-amber-100 text-dark-100 font-semibold xs:w-48">
                      {getInitials(bookRecord.name || "IN")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={"font-semibold text-xs"}>{bookRecord.name}</p>
                    <p className={"font-normal text-gray-500 text-xs"}>
                      {bookRecord.email}
                    </p>
                  </div>
                </td>
                <td
                  className={
                    "p-2 w-[124px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <form>
                    <Select
                      isPage={"borrowRequestsPage"}
                      dataId={bookRecord.id}
                      defaultValue={
                        bookRecord.status === "BORROWED"
                          ? "BORROWED"
                          : "RETURNED"
                      }
                      options={[
                        { value: "BORROWED", name: "Borrowed" },
                        { value: "RETURNED", name: "Returned" },
                      ]}
                      className={
                        bookRecord.status === "BORROWED"
                          ? "confirm-reject rounded-2xl border-4  border-red-100"
                          : "confirm-approve rounded-2xl border-4 border-green-100"
                      }
                    />
                  </form>
                </td>
                <td
                  className={
                    "p-2 w-[124px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  {bookRecord.borrowDate?.toString()
                    ? bookRecord.borrowDate.toString().slice(4, 15)
                    : ""}
                </td>
                <td
                  className={
                    "p-2 w-[124px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  {bookRecord.returnDate?.toString()
                    ? new Date(bookRecord.returnDate.toString())
                        .toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        .replace(",", "")
                        .toString()
                    : "Not Returned"}
                </td>
                <td
                  className={
                    "p-2 w-[124px] font-ibm-plex-sans font-semibold text-sm "
                  }
                >
                  {bookRecord.dueDate?.toString()
                    ? new Date(bookRecord.dueDate.toString())
                        .toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        .replace(",", "")
                        .toString()
                    : ""}
                </td>
                <td
                  className={
                    "p-2 w-[130px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <Link href={"/books/receipt/" + bookRecord.id}>Receipt</Link>
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
