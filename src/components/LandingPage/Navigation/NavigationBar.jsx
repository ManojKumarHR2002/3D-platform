import * as React from "react";
import { useNavigate } from "react-router-dom";
import { NavigationButton } from "./NavigationButton.jsx";

export function NavigationBar() {
  const navigate = useNavigate();
  const [activePath, setActivePath] = React.useState(null);

  const navItems = [
    { label: "Asset Store", variant: "outline", className: "px-4 max-md:px-5", path: "/" },
    { label: "Log In", variant: "outline", className: "px-8 max-md:px-5", path: "/auth/login" },
    { label: "Get Started", variant: "outline", className: "px-4 max-md:px-5", path: "/auth/signup" }
  ];

  const handleButtonClick = (path) => {
    setActivePath(path);
    navigate(path);
  };

  return (
    <div className="flex flex-wrap gap-5 justify-between self-stretch px-8 py-10 w-full font-semibold bg-zinc-900 bg-opacity-100 shadow-[0px_1px_2px_rgba(0,0,0,0.25)] max-md:px-5 max-md:max-w-full">
      <div className="flex gap-5 text-2xl text-white whitespace-nowrap">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5e33f8299cbc34fb77f2e4249115e7c310c4f87a7318b7f448966036395bd20?placeholderIfAbsent=true&apiKey=89a40ed617824239aa8e77522e0cfca9"
          alt="Company Logo"
          className="object-contain shrink-0 aspect-square rounded-[100px] w-[47px]"
        />
        <div className="my-auto">Name</div>
      </div>
      <div className="flex gap-7 self-start mt-1.5">
        {navItems.map((item, index) => (
          <NavigationButton
            key={index}
            variant={item.path === activePath ? "filled" : "outline"}
            className={item.className}
            onClick={() => handleButtonClick(item.path)}
          >
            {item.label}
          </NavigationButton>
        ))}
      </div>
    </div>
  );
}
