"use server";

import { books, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      // @ts-ignore
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while creating the book.",
    };
  }
};

export const updateBook = async (params: BookParams, bookId: string) => {
  try {
    const bookUpdate = await db
      .update(books)
      .set({
        title: params.title,
        author: params.author,
        genre: params.genre,
        description: params.description,
        rating: params.rating?.toString(),
        totalCopies: params.totalCopies,
        coverUrl: params.coverUrl,
        coverColor: params.coverColor,
        videoUrl: params.videoUrl,
        summary: params.summary,
      })
      .where(eq(books.id, bookId))
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(params)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while creating the book.",
    };
  }
};
