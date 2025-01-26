"use client";

import React from "react";
import { toast } from "@/hooks/use-toast";
import { updateRoleUser } from "@/lib/admin/actions/users";
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
}

const Select: React.FC<SelectProps> = ({
  className,
  defaultValue,
  options,
  dataId,
}) => {
  // Handle change event if onChange is passed

  const router = useRouter();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as string;
    const emailId = dataId as string;

    console.log(newRole);

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
