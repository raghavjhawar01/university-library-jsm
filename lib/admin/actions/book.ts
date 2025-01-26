"use server";

import { books, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import ImageKit from "imagekit";
import config from "@/lib/config";
import { FileObject } from "imagekit/dist/libs/interfaces";

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
      data: JSON.parse(JSON.stringify(bookUpdate[0])),
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while creating the book.",
    };
  }
};

export const deleteBook = async (id: string) => {
  try {
    let coverUrl = "";
    let videoUrl = "";

    const deleteBorrowRecords = await db
      .delete(borrowRecords)
      .where(eq(borrowRecords.bookId, id))
      .returning();

    const deleteBookRecord = await db
      .delete(books)
      .where(eq(books.id, id))
      .returning({ coverUrl: books.coverUrl, videoUrl: books.videoUrl });

    if (deleteBookRecord != null) {
      const imagekit = new ImageKit({
        publicKey: config.env.imagekit.publicKey, // Replace with your public API key
        privateKey: config.env.imagekit.privateKey, // Replace with your private API key
        urlEndpoint: config.env.imagekit.urlEndpoint, // Replace with your ImageKit endpoint
      });

      try {
        const fileIds: string[] = [];
        const filePaths = [coverUrl, videoUrl];
        // Step 1: Fetch fileIds for all file paths
        for (const filePath of filePaths) {
          try {
            const files = await imagekit.listFiles({ path: filePath });

            // Narrow down to FileObject
            const file = files.find((f): f is FileObject => "fileId" in f);

            if (file) {
              fileIds.push(file.fileId); // Collect fileId
            } else {
            }
          } catch (error) {}
        }

        if (fileIds.length === 0) {
          return;
        }

        // // Step 2: Delete files in bulk or one by one
        // for (const fileId of fileIds) {
        //   try {
        //     const response = await imagekit.deleteFile(fileId);
        //   } catch (error) {}
        // }

        // Or use bulk delete for efficiency (optional)
        const bulkResponse = await imagekit.bulkDeleteFiles(fileIds);

        // console.log("Bulk deletion completed:", bulkResponse);
      } catch (error) {}
    }

    return {
      success: true,
      message: "Book deleted successfully.",
      data: JSON.parse(JSON.stringify(deleteBookRecord[0])),
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the book.",
    };
  }
};
