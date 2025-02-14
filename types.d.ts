interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  rating: number | null;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  description: string;
  author: string;
  genre: string;
  rating?: number | null;
  totalCopies: number;
  coverUrl: string;
  coverColor: string;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}
