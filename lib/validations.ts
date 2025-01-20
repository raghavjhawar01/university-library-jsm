import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(3),
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty("Univeristy card is required"),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
