"use client";

import React, { useEffect, useState } from "react";
import image from "next/image";
import Image from "next/image";

const OpenLibCover = ({ searchTerm }: { searchTerm: string }) => {
  const [bookData, setBookData] = useState<{
    title: string;
    author: string;
    coverUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchTerm) return;

    const fetchBookData = async () => {
      setLoading(true);
      setError("");
      setBookData(null);

      try {
        // Fetch book details from Open Library Search API
        const searchResponse = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`,
        );
        const searchData = await searchResponse.json();

        if (searchData.docs.length === 0) {
          setError("No books found");
          setLoading(false);
          return;
        }

        // Get the first book's ISBN
        const firstBook = searchData.docs[0];
        const isbn = firstBook.isbn ? firstBook.isbn[0] : null;

        if (!isbn) {
          setError("No ISBN available for the first result");
          setLoading(false);
          return;
        }

        // Set book data with details and cover
        setBookData({
          title: firstBook.title,
          author: firstBook.author_name?.[0] || "Unknown Author",
          coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`, // Large cover
        });
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [searchTerm]); // Fetch data whenever `searchTerm` changes

  return (
    <Image
      src={bookData?.coverUrl || "icons/admin/plus.svg"}
      alt={"cover"}
      width={50}
      height={50}
    />
  );
};
export default OpenLibCover;
