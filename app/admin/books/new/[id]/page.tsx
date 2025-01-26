import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookForm from "@/components/admin/forms/BookForm";
import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string };
}) => {
  const id = (await params).id;

  const dynamicParams = searchParams;

  const edit = dynamicParams?.edit || null;
  const deleteRecord = dynamicParams?.deleteRecord || null;

  let getBookDetails = [] as Book[];

  if (edit || deleteRecord) {
    getBookDetails = (await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1)) as Book[];
  }

  return (
    <>
      <Button className={"back-btn"}>
        <Link href={"/admin/books"}>Go Back</Link>
      </Button>
      <section className={"w-full max-w-2xl"}>
        <BookForm
          type={edit ? "update" : deleteRecord ? "delete" : "create"}
          {...getBookDetails}
        />
      </section>
    </>
  );
};
export default Page;
