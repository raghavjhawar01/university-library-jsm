import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { count, desc, eq, ne } from "drizzle-orm";
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
  const isFilter = (await searchParams?.filter) || null;

  let allUsers: any[];

  // const status = Object.values(BORROW_STATUS_ENUM);

  if (isFilter) {
    allUsers = await db
      .select({
        id: users.id,
        name: users.fullName,
        email: users.email,
        status: users.status,
        idNo: users.universityId,
        idCardUrl: users.universityCard,
        joiningDate: users.createAt,
      })
      .from(users)
      .where(ne(users.fullName, ""))
      .orderBy(desc(users.createAt));
  } else {
    allUsers = await db
      .select({
        id: users.id,
        name: users.fullName,
        email: users.email,
        status: users.status,
        idNo: users.universityId,
        idCardUrl: users.universityCard,
        joiningDate: users.createAt,
      })
      .from(users)
      .where(ne(users.fullName, ""));
  }

  // noinspection JSFileReferences
  return (
    <div className={"w-max rounded-2xl bg-white p-7"}>
      <div className={"flex flex-wrap items-center justify-between gap-2"}>
        <h2 className={"text-xl font-semibold"}>
          Account Registration Requests
        </h2>
        <Button
          className={
            isFilter
              ? "text-sm text-white inline-flex bg-blue-600 hover:bg-blue-600"
              : "text-sm text-gray-400 inline-flex bg-transparent hover:bg-transparent"
          }
          asChild
        >
          <Link
            href={
              isFilter ? "./account-requests" : "./account-requests?filter=true"
            }
          >
            A-Z
          </Link>
          {/*<Image src={"/admin/"} alt={} width={15} height={15} />*/}
        </Button>
      </div>
      <div className={"mt-7 w-max overflow-y-auto overflow-x-auto"}>
        <table>
          <thead className={"text-left text-sm bg-stone-100 "}>
            <tr>
              <th
                className={"p-2 w-[386px] font-ibm-plex-sans font-extralight"}
              >
                User Details
              </th>
              <th
                className={"p-2 w-[150px] font-ibm-plex-sans font-extralight"}
              >
                Date Joined
              </th>
              <th
                className={"p-2 w-[150px] font-ibm-plex-sans font-extralight"}
              >
                University Id No
              </th>
              <th
                className={"p-2 w-[150px] font-ibm-plex-sans font-extralight"}
              >
                University Id Card
              </th>
              <th
                className={"p-2 w-[220px] font-ibm-plex-sans font-extralight"}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className={"bg-primary-dark text-xs"}>
                <td
                  className={
                    "p-2 w-[386px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <div className={"inline-flex flex-row gap-1"}>
                    <Avatar>
                      {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
                      <AvatarFallback className="bg-amber-100 text-dark-100 font-semibold xs:w-48">
                        {getInitials(user.name || "IN")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={"font-semibold text-xs"}>{user.name}</p>
                      <p className={"font-normal text-gray-500 text-xs"}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className={"p-2 w-[150px] font-ibm-plex-sans text-sm"}>
                  {user.joiningDate?.toString()
                    ? user.joiningDate.toString().slice(4, 15)
                    : ""}
                </td>
                <td
                  className={
                    "p-2 w-[150px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  {user.idNo}
                </td>
                <td
                  className={
                    "p-2 w-[150px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <Link
                    href={config.env.imagekit.urlEndpoint + user.idCardUrl}
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
                    "p-2 w-[220px] font-ibm-plex-sans font-semibold text-sm"
                  }
                >
                  <form>
                    <Select
                      isPage={"accountRequestsPage"}
                      dataId={user.email}
                      defaultValue={
                        user.status === "PENDING" ? "PENDING" : "APPROVED"
                      }
                      options={[
                        { value: "PENDING", name: "Pending" },
                        { value: "APPROVED", name: "Approved" },
                      ]}
                      className={
                        user.status === "PENDING"
                          ? "confirm-reject rounded-2xl border-4  border-red-100"
                          : "confirm-approve rounded-2xl border-4 border-green-100"
                      }
                    />
                  </form>
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
