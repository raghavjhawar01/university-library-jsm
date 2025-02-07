"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook, returnBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  hasBorrowed: boolean;
}

const ReturnBook = ({ userId, bookId, hasBorrowed }: Props) => {
  const router = useRouter();
  const [hasReturned, setReturned] = useState(false);

  const handleReturn = async () => {
    if (hasReturned) {
      toast({
        title: "Returned Error",
        description: "Error returning the book",
        variant: "destructive",
      });
    } else {
      setReturned(true);

      try {
        const result = await returnBook({ bookId, userId, hasBorrowed });

        if (result.success) {
          toast({
            title: "Success",
            description: "Book returned successfully",
          });

          router.push("/my-profile");
        } else if (hasReturned) {
          toast({
            title: "Success",
            description: "Book Returned Successfully.",
          });

          router.push("/my-profile");
        } else {
          toast({
            title: "Error",
            description: "Error occurred while returning the book.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while returning the book",
          variant: "destructive",
        });
      } finally {
        setReturned(false);
      }
    }
    if (hasReturned) {
      setReturned(true);
      // const email =
      // sendEmail(email,subject,message);
    }
  };

  return (
    <Button
      className="book-btn font-bebas-neue text-dark-100"
      onClick={handleReturn}
      disabled={hasReturned}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {hasReturned ? "Returning...." : hasReturned ? "Returned" : "Return"}
      </p>
    </Button>
  );
};
export default ReturnBook;
