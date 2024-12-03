import * as React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import MyProjects from "../MyProjects/MyProjects";
import AssetCategories from "../AssetCategories/AssetCategories";

export default function DashboardPage() {
  return (
    <div className="overflow-hidden pr-9 bg-zinc-800 max-md:pr-5 max-sm:flex max-sm:flex-col">
      <div className="flex gap-5 max-md:flex-col">
        <Sidebar />
        <main className="flex flex-col ml-5 w-[81%] max-md:ml-0 max-md:w-full" role="main">
          <div className="flex flex-col items-start mt-12 w-full max-md:mt-10 max-md:max-w-full max-sm:flex max-sm:flex-col max-sm:pr-0.5 max-sm:pl-5">
            <Navbar />
            <MyProjects />
            <AssetCategories />
          </div>
        </main>
      </div>
    </div>
  );
}