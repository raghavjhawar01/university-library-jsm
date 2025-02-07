import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  let isAdmin = false;
  isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  if (!isAdmin) {
    isAdmin = await db
      .select({ isAdmin: users.role })
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1)
      .then((res) => res[0]?.isAdmin === "SUPER ADMIN");
  }

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <main className={"flex min-h-screen w-full flex-row"}>
      <Sidebar
        session={session}
        //@ts-ignore
        action={async () => {
          "use server";
          await signOut();
        }}
      />
      <div className={"admin-container"}>
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};
export default Layout;
