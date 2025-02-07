"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
  hasBorrowed: boolean;
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
  hasBorrowed,
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    if (hasBorrowed) {
      router.push("/my-profile");
    } else {
      if (!isEligible) {
        toast({
          title: "Borrow Error",
          description: message,
          variant: "destructive",
        });
      } else {
        setBorrowing(true);

        try {
          const result = await borrowBook({ bookId, userId, hasBorrowed });

          if (result.success) {
            toast({
              title: "Success",
              description: "Book borrowed successfully",
            });

            router.push("/my-profile");
          } else if (hasBorrowed) {
            toast({
              title: "Success",
              description: "Book Already Borrowed.",
            });

            router.push("/my-profile");
          } else {
            toast({
              title: "Error",
              description: "Error occurred while borrowing the book.",
            });
            console.log("Here error1!");
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "An error occurred while borrowing the book",
            variant: "destructive",
          });
          console.log(error);
        } finally {
          setBorrowing(false);
          console.log("Here error3!");
        }
      }
      if (hasBorrowed) {
        setBorrowing(true);
        // const email =
        // sendEmail(email,subject,message);
      }
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrow}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing
          ? "Borrowing...."
          : hasBorrowed
            ? "Book in library"
            : "Borrow Book"}
      </p>
    </Button>
  );
};
export default BorrowBook;
