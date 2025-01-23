import React from "react";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="my-10 flex justify-between gap-5 text-light-100">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        BookWise
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link href="/my-profile">
            <Avatar>
              {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
              <AvatarFallback className="bg-amber-100 text-dark-100 text-1xl font-semibold">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className=""
          >
            <Button className={"text-dark-100 capitalize"}>Logout</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
