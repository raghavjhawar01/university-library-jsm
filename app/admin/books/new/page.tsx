import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookForm from "@/components/admin/forms/BookForm";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const isFilter = searchParams?.filter || null;
  console.log("isFilter", isFilter);

  const url = isFilter ? "/admin" : "/admin/books";

  return (
    <>
      <Button className={"back-btn"}>
        <Link href={url}>Go Back</Link>
      </Button>

      <section className={"w-full max-w-2xl"}>
        <BookForm />
      </section>
    </>
  );
};
export default Page;
