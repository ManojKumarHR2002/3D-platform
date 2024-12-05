import * as React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopActions from "../TopActions/TopActions";
import MyProjects from "../MyProjects/MyProjects";
import SharedWithMeProjects from "../SharedWithMeProjects/SharedWithMeProjects";
import AssetStore from "../AssetStore/AssetStore"

export default function DashboardPage() {
  return (
    <div className="flex fixed top-0 left-0 h-screen w-screen overflow-hidden bg-zinc-800 max-md:pr-5 max-sm:flex max-sm:flex-col">
      <Sidebar />
      <main className="flex flex-col flex-1 mx-10 max-md:ml-0 max-md:w-full" role="main">
        <div className="flex flex-col items-start mt-12 w-full max-md:mt-10 max-md:max-w-full max-sm:flex max-sm:flex-col max-sm:pr-0.5 max-sm:pl-5">
          <TopActions />
          <MyProjects />
        </div>
      </main>
    </div>
  );
}
