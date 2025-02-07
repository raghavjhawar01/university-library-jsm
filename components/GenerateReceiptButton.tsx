"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowedBookDetails } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  hasBorrowed: boolean;
}

const generateReceiptButton = ({ userId, bookId, hasBorrowed }: Props) => {
  const router = useRouter();
  const [Borrowing, setBorrowing] = useState(false);

  const handleReturn = async () => {
    if (Borrowing) {
      toast({
        title: "Already showing borrowed",
        description: "Error borrowing again the book",
        variant: "destructive",
      });
    } else {
      setBorrowing(true);

      try {
        const result = await borrowedBookDetails({
          bookId,
          userId,
          hasBorrowed,
        });

        if (result?.success) {
          toast({
            title: "Success",
            description: "Receipt Generated successfully",
          });

          router.push("/my-profile");
        } else if (hasBorrowed) {
          toast({
            title: "Success",
            description: "Receipt generated Successfully.",
          });

          router.push("/my-profile");
        } else {
          toast({
            title: "Error",
            description:
              "Error occurred while generating receipt for the book.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while generating receipt of the book",
          variant: "destructive",
        });
      } finally {
        setBorrowing(false);
      }
    }
    if (Borrowing) {
      setBorrowing(true);
      // const email =
      // sendEmail(email,subject,message);
    }
  };

  return (
    <Button
      className="book-btn font-bebas-neue text-dark-100"
      onClick={handleReturn}
      disabled={Borrowing}
    >
      <p className="font-bebas-neue text-xl text-dark-100">
        {Borrowing
          ? "Generating Receipts...."
          : Borrowing
            ? "Generate Receipt"
            : "Generate Receipt"}
      </p>
    </Button>
  );
};
export default generateReceiptButton;
