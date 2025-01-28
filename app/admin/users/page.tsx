import React from "react";
import { db } from "@/database/drizzle";
import { borrowRecords, ROLE_ENUM, users } from "@/database/schema";
import { count, eq, ne } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import Select from "@/components/admin/Select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeleteLink from "@/components/admin/DeleteLink";
import config from "@/lib/config";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const isFilter = searchParams?.filter || null;

  let allUsers: any[];

  const roles = Object.values(ROLE_ENUM);

  if (isFilter) {
    allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        joiningDate: users.createAt,
        role: users.role,
        universityIdNumber: users.universityId,
        universityIdCard: users.universityCard,
        countBooks: count(borrowRecords.bookId),
      })
      .from(users)
      .leftJoin(borrowRecords, eq(borrowRecords.userId, users.id))
      .where(ne(users.role, "SUPER ADMIN"))
      .groupBy(users.id)
      .orderBy(users.fullName);
  } else {
    allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        joiningDate: users.createAt,
        role: users.role,
        universityIdNumber: users.universityId,
        universityIdCard: users.universityCard,
        countBooks: count(borrowRecords.bookId),
      })
      .from(users)
      .leftJoin(borrowRecords, eq(borrowRecords.userId, users.id))
      .where(ne(users.role, "SUPER ADMIN"))
      .groupBy(users.id);
  }

  // noinspection JSFileReferences
  return (
    <div className={"w-full rounded-2xl bg-white p-7"}>
      <div className={"flex flex-wrap items-center justify-between gap-2"}>
        <h2 className={"text-xl font-semibold"}>All Users</h2>
        <Button
          className={
            isFilter
              ? "text-sm text-white inline-flex bg-blue-600 hover:bg-blue-600"
              : "text-sm text-gray-400 inline-flex bg-transparent hover:bg-transparent"
          }
          asChild
        >
          <Link href={isFilter ? "./users" : "./users?filter=true"}>A-Z</Link>
          {/*<Image src={"/admin/"} alt={} width={15} height={15} />*/}
        </Button>
      </div>
      <div className={"mt-7 w-full overflow-y-auto overflow-x-auto"}>
        <table>
          <thead className={"text-left text-sm bg-stone-100 "}>
            <tr>
              <th
                className={"p-2 w-[320px] font-ibm-plex-sans font-extralight"}
              >
                Name
              </th>
              <th
                className={"p-2 w-[130px] font-ibm-plex-sans font-extralight"}
              >
                Date Joined
              </th>
              <th className={"p-2 w-[50px] font-ibm-plex-sans font-extralight"}>
                Role
              </th>
              <th
                className={"p-2 w-[130px] font-ibm-plex-sans font-extralight"}
              >
                Books Borrowed
              </th>
              <th
                className={"p-2 w-[150px] font-ibm-plex-sans font-extralight"}
              >
                University ID No
              </th>
              <th
                className={"p-2 w-[150px] font-ibm-plex-sans font-extralight"}
              >
                University ID Card
              </th>
              <th className={"p-2 w-[80px] font-ibm-plex-sans font-extralight"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.email} className={"bg-primary-dark text-xs"}>
                <td
                  className={
                    "inline-flex gap-2 p-2 w-[320px] font-ibm-plex-sans text-sm"
                  }
                >
                  <Avatar>
                    {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
                    <AvatarFallback className="bg-amber-100 text-dark-100 font-semibold xs:w-48">
                      {getInitials(user.fullName || "IN")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={"font-semibold"}>{user.fullName}</p>
                    <p className={"font-normal text-gray-500"}>{user.email}</p>
                  </div>
                </td>
                <td
                  className={
                    "p-2 w-[130px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  {user.joiningDate?.toString()
                    ? user.joiningDate.toString().slice(4, 15)
                    : ""}
                </td>
                <td
                  className={
                    "p-2 w-[50px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <form>
                    <Select
                      isPage={"usersPage"}
                      dataId={user.email}
                      defaultValue={user.role === "ADMIN" ? "ADMIN" : "USER"}
                      options={[
                        { value: "USER", name: "User" },
                        { value: "ADMIN", name: "Admin" },
                      ]}
                      className={
                        user.role === "USER"
                          ? "confirm-reject rounded-2xl border-4  border-red-100"
                          : "confirm-approve rounded-2xl border-4 border-green-100"
                      }
                    />
                  </form>
                </td>
                <td
                  className={
                    "p-2 w-[130px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  {user.countBooks}
                </td>
                <td
                  className={
                    "p-2 w-[150px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  {user.universityIdNumber}
                </td>
                <td
                  className={
                    "p-2 w-[150px] font-ibm-plex-sans font-semibold text-sm text-blue-500"
                  }
                >
                  <Link
                    href={
                      config.env.imagekit.urlEndpoint + user.universityIdCard
                    }
                    className={"inline-flex"}
                  >
                    View ID Card &nbsp;
                    <Image
                      src="/icons/admin/link.svg"
                      alt={"link-icon"}
                      width={18}
                      height={18}
                    ></Image>
                  </Link>
                </td>
                <td
                  className={
                    "p-2 w-[80px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <DeleteLink dataIn={user.id} isPage={"usersPage"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Page;
