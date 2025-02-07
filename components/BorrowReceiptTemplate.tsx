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
    overdueFlag: number;
  };
  userName: string;
}

const BorrowReceiptTemplate = ({ receipt, userName }: Props) => {
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
    overdueFlag: false,
  };

  const styles = {
    body: {
      backgroundColor: "#1f2d37 !important",
      color: "#fff !important",
    },
    cutOutOutside: {
      marginTop: "1.5rem",
      position: "relative" as "relative",
      width: "100%",
      height: "2rem",
      backgroundColor: "#1f2d37 !important",
      color: "#fff !important",
      display: "flex",
      borderBottomLeftRadius: "0.75rem",
      borderBottomRightRadius: "0.75rem",
    },
    cutOutInside: {
      width: "1.5rem",
      height: "auto",
      borderRadius: "9999px",
      backgroundColor: "#111827 !important",
      transform: "translateY(50%)",
    },
    mainContainer: {
      position: "relative" as "relative",
      backgroundColor: "rgb(17 24 39 / var(--tw-bg-opacity, 1))",
      borderRadius: "0.75rem",
    },
    container: {
      width: "400px",
      // backgroundColor: "rgb(17 24 39 / var(--tw-bg-opacity, 1))",
      backgroundColor: "#1f2d37 !important",
      color: "#ffffff !important",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      fontFamily: "Arial, sans-serif",
      position: "relative" as "relative",
      overflow: "hidden" as "hidden",
      textAlign: "left" as "left",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    title: { fontSize: "18px", fontWeight: "bold", marginTop: "10px" },
    info: { margin: "5px 0" },
    highlight: {
      color: "#fadb00 !important",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    divider: {
      border: "none",
      height: "1px",
      background: "#444",
      margin: "10px 0",
    },
    detailsHeader: { fontSize: "16px", fontWeight: "bold" },
    list: { listStyleType: "none", padding: 0, margin: "5px 0" },
    footer: { marginTop: "15px", fontSize: "14px" },
  };

  const data = receipt || exampleReceipt;

  return (
    <html>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body>
        <div style={styles.container}>
          <h2 style={styles.header}>
            <span role="img" aria-label="book">
              📖
            </span>{" "}
            BookWise
          </h2>
          <h3 style={styles.title}>Borrow Receipt</h3>
          <p style={styles.info}>
            Receipt ID: <span style={styles.highlight}>#{data.id}</span>
          </p>
          <p style={styles.info}>Date Issued: {data.dateIssued || "N/A"}</p>
          <hr style={styles.divider} />
          <div>
            <h4 style={styles.detailsHeader}>Book Details:</h4>
            <ul style={styles.list}>
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
                <strong>
                  {data.overdueFlag > 0
                    ? `Your book is overdue. You need to pay a fine for ${data.overdueFlag} days.`
                    : `You can return the book in ${-data.overdueFlag} days to avoid late fees.`}
                </strong>
              </li>
              <li>
                <strong>Duration:</strong>{" "}
                {data.duration ? `${data.duration} days` : "N/A"}
              </li>
            </ul>
          </div>
          <hr style={styles.divider} />
          <div>
            <h4 style={styles.detailsHeader}>Terms</h4>
            <ul style={styles.list}>
              <li>Please return the book by the due date.</li>
              <li>Lost or damaged books may incur replacement costs.</li>
            </ul>
          </div>
          <hr style={styles.divider} />
          <div style={styles.footer}>
            <p>
              Thank you for using <strong>BookWise!</strong>
            </p>
            <p>
              Website:{" "}
              <span style={styles.highlight}>bookwise.example.com</span>
            </p>
            <p>
              Email:{" "}
              <span style={styles.highlight}>support@mail.raghavjhawar.in</span>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default BorrowReceiptTemplate;
