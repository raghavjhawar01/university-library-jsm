"use client";

import React from "react";
import { toast } from "@/hooks/use-toast";
import {
  updateBorrowRequestsStatus,
  updateRoleUser,
  updateUserStatus,
} from "@/lib/admin/actions/users";
import { useRouter } from "next/navigation";

// Define types for the props
interface Option {
  value: string;
  name: string;
}

interface SelectProps {
  className?: string; // Optional className for custom styling
  defaultValue: string; // The default value for the select element
  options: Option[]; // Array of options
  dataId: string;
  isPage: string;
}

const Select: React.FC<SelectProps> = ({
  className,
  defaultValue,
  options,
  dataId,
  isPage,
}) => {
  // Handle change event if onChange is passed

  const router = useRouter();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (isPage === "usersPage") {
      const newRole = event.target.value as string;
      const emailId = dataId as string;

      const updatedUser = await updateRoleUser(newRole, emailId);

      if (updatedUser.success) {
        toast({
          title: "Successfully updated!",
          description: "Role updated successfully!",
        });
        router.push("/admin/users");
      } else {
        toast({
          title: "Not updated!",
          description: "Role not updated!",
          variant: "destructive",
        });
      }
    } else if (isPage === "borrowRequestsPage") {
      const newStatus = event.target.value as string;
      const id = dataId as string;

      const updatedStatus = await updateBorrowRequestsStatus(newStatus, id);

      if (updatedStatus.success) {
        toast({
          title: "Successfully updated!",
          description: "Role updated successfully!",
        });
        router.push("/admin/borrow-requests");
      } else {
        toast({
          title: "Not updated!",
          description: "Role not updated!",
          variant: "destructive",
        });
        router.push("/admin/borrow-requests");
      }
    } else if (isPage === "accountRequestsPage") {
      const newStatus = event.target.value as string;
      const id = dataId as string;

      const updatedStatus = await updateUserStatus(newStatus, id);

      if (updatedStatus.success) {
        toast({
          title: "Successfully updated!",
          description: `User Status was changed to ${newStatus}!`,
        });
        router.push("/admin/account-requests");
      } else {
        toast({
          title: "Status Not Updated!",
          description: `User status not changed to ${newStatus}!`,
          variant: "destructive",
        });
        router.push("/admin/account-requests");
      }
    }
  };

  return (
    <select
      data-id={dataId}
      className={className} // Apply custom className if passed
      defaultValue={defaultValue} // Set default value
      onChange={handleChange} // Handle change event
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default Select;
