"use client";

import React from "react";
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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { approveUser } from "@/lib/admin/actions/users";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface userProps {
  id: string;
  name: string;
  email: string;
  initials: string;
}

const UserCard = ({ id, initials, name, email }: userProps) => {
  const router = useRouter();
  const handleClick = async () => {
    const approveTheUser = await approveUser(id as string);
    if (approveTheUser) {
      toast({
        title: "Approve User",
        description: `Successfully approved ${name}`,
      });
      router.push("/admin");
    } else {
      toast({
        title: "Not Approved!",
        description: `Not Approved user ${name}`,
        variant: "destructive",
      });
      router.push("/admin");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div key={id} className={"user-card"}>
          <Avatar>
            <AvatarFallback className={"bg-amber-100"}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className={"name"}>{name}</div>
          <div className={"email"}>{email}</div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? you want to approve the user {name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={"confirm-reject"}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={"confirm-approve"}
            onClick={handleClick}
          >
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default UserCard;
