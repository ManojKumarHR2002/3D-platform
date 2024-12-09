import * as React from "react";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import TopActions from "../../components/Dashboard/TopActions/TopActions";
import Home from "../../components/Dashboard/Home/Home"
import MyProjects from "../../components/Dashboard/MyProjects/MyProjects";
import SharedWithMeProjects from "../../components/Dashboard/SharedWithMeProjects/SharedWithMeProjects";
import AssetStore from "../../components/Dashboard/AssetStore/AssetStore"

export default function DashboardPage() {
  // State to track the currently selected view
  const [currentView, setCurrentView] = React.useState("Home");

  // Function to render the selected component
  const renderView = () => {
    switch (currentView) {
      case "Home":
        return <Home />;
      case "MyProjects":
        return <MyProjects />;
      case "SharedWithMe":
        return <SharedWithMeProjects />;
      case "AssetStore":
        return <AssetStore />;
      // Add more cases for other components
      default:
        return <MyProjects />;
    }
  };

  return (
    <div className="flex fixed top-0 left-0 h-screen w-screen overflow-hidden bg-zinc-800 max-md:pr-5 max-sm:flex max-sm:flex-col">
      <Sidebar setCurrentView={setCurrentView} />
      <main className="flex flex-col flex-1 mx-10 max-md:ml-0 max-md:w-full" role="main">
        <div className="flex flex-col items-start mt-12 w-full max-md:mt-10 max-md:max-w-full max-sm:flex max-sm:flex-col max-sm:pr-0.5 max-sm:pl-5">
          <TopActions />
          {renderView()}
        </div>
      </main>
    </div>
  );
}
