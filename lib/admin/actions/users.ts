"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, users } from "@/database/schema";
import { count, eq } from "drizzle-orm";

export const updateRoleUser = async (newValue: string, key: string) => {
  const validRoles = ["USER", "ADMIN", "SUPERADMIN"];
  if (!validRoles.includes(newValue)) {
  }

  const updatedUser = await db
    .update(users)
    // @ts-ignore
    .set({ role: newValue })
    .where(eq(users.email, key));

  if (updatedUser) {
    return {
      success: true,
      message: "User Updated successfully.",
    };
  } else {
    return {
      success: false,
      message: "User not updated.",
    };
  }
};

export const deleteUser = async (userId: string) => {
  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning({ fullName: users.fullName });

  if (deletedUser) {
    return {
      success: true,
      message: "User deleted.",
    };
  } else {
    return {
      success: false,
      message: "User not deleted.",
    };
  }
};

export const approveUser = async (userId: string) => {
  const approvedUser = await db
    .update(users)
    .set({ status: "APPROVED" })
    .where(eq(users.id, userId))
    .returning({ fullName: users.fullName });

  if (approvedUser) {
    return {
      success: true,
      message: "User approved successfully.",
    };
  } else {
    return {
      success: false,
      message: "User not approved, try again later.",
    };
  }
};

export const displayAllUsers = async (isGroupBy: string = "false") => {
  let allUsers: any[];

  if (isGroupBy) {
    allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        joiningDate: users.createAt,
        role: users.role,
        universityIdNumber: users.universityId,
        universityIdCard: users.universityCard,
        countBooks: count(borrowRecords.bookId),
      })
      .from(users)
      .leftJoin(borrowRecords, eq(borrowRecords.userId, users.id))
      .groupBy(users.id);
  } else {
    allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        joiningDate: users.createAt,
        role: users.role,
        universityIdNumber: users.universityId,
        universityIdCard: users.universityCard,
        countBooks: count(borrowRecords.bookId),
      })
      .from(users)
      .leftJoin(borrowRecords, eq(borrowRecords.userId, users.id))
      .groupBy(users.id)
      .orderBy(users.fullName);
  }

  return { allUsers };
};
