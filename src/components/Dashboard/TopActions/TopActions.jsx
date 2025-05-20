
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function TopActions({ onSearch }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query); // Trigger parent filtering
  };

  const handleImport = () => {
    console.log("Import function triggered.");
  };

  const handleNewFile = () => {
    navigate("/canvas");
  };

  return (
    <div className="flex flex-row flex-wrap gap-5 justify-between w-full">
      {/* Search Box */}
      <div className="flex flex-row gap-5 px-6 py-3 text-base text-center rounded-xl bg-zinc-700 shadow-md text-white w-[50%]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/52f81c104b60e4c8147260a90cb640aa3c0773005414571467136807a420338b?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
          alt="Search icon"
          className="object-contain w-[15px] aspect-square"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search projects"
          className="flex-auto bg-transparent border-none outline-none text-white"
          aria-label="Search projects"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-7 text-white">
        <button
          onClick={handleImport}
          className="flex items-center px-4 py-2 bg-red-400 rounded-2xl shadow-md"
          aria-label="Import"
        >
          <span className="text-lg font-semibold">+</span>
          <span className="ml-2 text-sm font-bold">Import</span>
        </button>

        <button
          onClick={handleNewFile}
          className="flex items-center px-4 py-2 bg-violet-400 rounded-2xl shadow-md"
          aria-label="New File"
        >
          <span className="text-lg font-semibold">+</span>
          <span className="ml-2 text-sm font-bold">New File</span>
        </button>
      </div>
    </div>
  );
}
