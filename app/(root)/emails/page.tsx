import React from "react";

interface Props {
  receipt: {
    id: string;
    dateIssued: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenre: string;
    borrowDate: string;
    dueDate: string;
    duration: number;
  };
  userName: string;
}

const Page = ({ receipt, userName }: Props) => {
  // Example receipt if none is provided
  const exampleReceipt = {
    id: "12345",
    dateIssued: "31/01/2025",
    bookTitle: "The Great Gatsby",
    bookAuthor: "F. Scott Fitzgerald",
    bookGenre: "Classic Fiction",
    borrowDate: "30/01/2025",
    dueDate: "05/02/2025",
    duration: 7,
  };

  userName = userName ? userName : "Raghav Jhawar";

  const data = receipt || exampleReceipt;

  return (
    <div className="relative bg-gray-900 p-4 rounded-xl shadow-xl">
      <div className="relative bg-gray-800 text-white max-w-md mx-auto  rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span role="img" aria-label="book">
              📖
            </span>{" "}
            BookWise
          </h2>
          <h3 className="mt-4 text-lg font-semibold">Borrow Receipt</h3>
          <p className="mt-2 text-sm">
            Hello {userName} <span className="text-yellow-400">#{data.id}</span>
          </p>
          <p className="mt-2 text-sm">
            Receipt ID: <span className="text-yellow-400">#{data.id}</span>
          </p>
          <p className="text-sm">Date Issued: {data.dateIssued || "N/A"}</p>
          <hr className="my-4 border-gray-700" />
          <div className="text-sm">
            <h4 className="font-semibold">Book Details:</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <strong>Title:</strong> {data.bookTitle || "Unknown"}
              </li>
              <li>
                <strong>Author:</strong> {data.bookAuthor || "Unknown"}
              </li>
              <li>
                <strong>Genre:</strong> {data.bookGenre || "Unknown"}
              </li>
              <li>
                <strong>Borrowed On:</strong> {data.borrowDate || "N/A"}
              </li>
              <li>
                <strong>Due Date:</strong> {data.dueDate || "N/A"}
              </li>
              <li>
                <strong>Duration:</strong>{" "}
                {data.duration ? `${data.duration} days` : "N/A"}
              </li>
            </ul>
          </div>
          <hr className="my-4 border-gray-700" />
          <div className="text-sm">
            <h4 className="font-semibold">Terms</h4>
            <ul className="mt-2 list-disc list-inside">
              <li>Please return the book by the due date.</li>
              <li>Lost or damaged books may incur replacement costs.</li>
            </ul>
          </div>
          <hr className="my-4 border-gray-700" />
          <div className="text-sm">
            <p>
              Thank you for using <strong>BookWise!</strong>
            </p>
            <p>
              Website:{" "}
              <span className="font-semibold">bookwise.example.com</span>
            </p>
            <p>
              Email:{" "}
              <span className="font-semibold">support@raghavjhawar.in</span>
            </p>
          </div>
        </div>
        {/* Semicircle Cutout Effect with Padding */}
        <div className="mt-6 relative w-full h-8 bg-gray-800  flex justify-between rounded-b-xl">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="w-6 h-auto bg-gray-900 rounded-full"
              style={{ transform: "translateY(50%)" }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
