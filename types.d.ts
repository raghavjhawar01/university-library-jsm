interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  total_copies?: number;
  available_copies?: number;
  description: string;
  color: string;
  cover: string;
  video?: string;
  summary: string;
  isLoaned?: boolean;
  // coverColor?: string;
  // coverUrl?: string;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}
