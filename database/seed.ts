import dummybooks from "../dummybooks.json";
import ImageKit from "imagekit";
import { books } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });
    return response.filePath;
  } catch (e) {
    console.log("Error uploading image to imagekit", e);
  }
};

const seed = async () => {
  console.log("seeding...");

  try {
    for (const book of dummybooks) {
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        "/books/cover",
      )) as string;

      const videoUrl = (await uploadToImageKit(
        book.videoUrl,
        `${book.title}.mp4`,
        "/books/videos",
      )) as string;

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      });
      console.log("Data seeded successfully");
    }
  } catch (err) {
    console.log("Error Seeding Data..");
  }
};

seed();
