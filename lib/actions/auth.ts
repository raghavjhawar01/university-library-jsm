"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";
import { hash } from "bcryptjs";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { sendEmail, workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "signIn Error");
    return { success: false, error: "Sign In Error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingUser.length > 0) {
    return { success: false, message: "User already exists." };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    // await workflowClient.trigger({
    //   url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
    //   body: {
    //     email,
    //     fullName,
    //   },
    // });

    await sendEmail({
      email: email,
      subject: "Welcome to BookWise!",
      message: {
        userName: fullName,
        heading: "Welcome to BookWise, Your Reading Companion!",
        text:
          "Welcome to BookWise! We are excited to have you" +
          "join our community of book enthusiasts. Explore a " +
          "wide range of books, borrow with ease, and manage" +
          "your reading journey seamlessly.\n" +
          "Get started by logging in to your account:",
        buttonUrl: "http://localhost:3000/",
        buttonTitle: "Login to BookWise!",
        footerText: "Happy Reading,\n" + "The Bookwise Team",
      },
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "signup error.");
    return { success: false, message: "signUp error." };
  }
};
