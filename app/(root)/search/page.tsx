import React from "react";

const Page = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center text-white">
        <div className={"flex-row flex-wrap"}>DISCOVER YOUR NEXT READ:</div>
        <div className={"flex-row text-5xl font-semibold mt-5"}>
          Explore and Search for
        </div>
        <div className={"flex-row text-5xl font-semibold"}>
          <span className={"text-primary"}>Any Book</span> in our Library.
        </div>
        <form className={"flex-row text-5xl font-semibold xs:w-2/5"}>
          <input className={"search"} />
        </form>
      </div>
    </>
  );
};
export default Page;
