"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/lib/admin/actions/users";
import { toast } from "@/hooks/use-toast";

interface Props {
  dataIn: string;
  isPage: string;
}

const DeleteLink = ({ dataIn, isPage }: Props) => {
  const router = useRouter();
  console.log(dataIn);

  const page = isPage;

  const handleChange = async () => {
    if (isPage === "usersPage") {
      const deletedUser = await deleteUser(dataIn!);

      if (deletedUser.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        router.push("/admin/users");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        router.push("/admin/users");
      }
    }
  };

  return (
    <Button
      className={"bg-transparent hover:bg-transparent"}
      onClick={handleChange}
    >
      <Image
        src="/icons/admin/trash.svg"
        alt={"delete-icon"}
        width={24}
        height={24}
      ></Image>
    </Button>
  );
};
export default DeleteLink;
