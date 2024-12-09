import * as React from "react";
import { useState } from "react";


export default function Sidebar({setCurrentView}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const sidebarItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/3611063559c036f4886cf5a7a620e63d8083ce53fcbe35e1b20962bd432ac294?apiKey=aefa27f3a4d84b2fb61917384a45b85c&", text: "Home", view: "Home"},
    { icon: "https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/8bed5a864dcc9e2bb51b6267ea5e2ebe829e0578788652f5c22d6ef180df09b9?apiKey=aefa27f3a4d84b2fb61917384a45b85c&", text: "My Files", view: "MyProjects" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/83a49c9f43583a48c534eeaf5b57a6377696cc277de878af10dea2416c1b5728?apiKey=aefa27f3a4d84b2fb61917384a45b85c&", text: "Shared with me",view: "SharedWithMe" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/e7d433a88393e0b32117b914db90112b365c729b5d3a1e38012557a4be51b307?apiKey=aefa27f3a4d84b2fb61917384a45b85c&", text: "Asset store",view: "AssetStore" },
    // Separate items that should be at the bottom
    { icon: "https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/d0b87d1799b0b6d551c5a23b8bf6528f642283e9a70f2fc313880808903d26e7?apiKey=aefa27f3a4d84b2fb61917384a45b85c&", text: "Bin",view: "Bin" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/d4c3666586709e77025bc797204906cd79a835916c6a304413fe7ee3409ac0db?apiKey=aefa27f3a4d84b2fb61917384a45b85c&", text: "Help & feedback",view: "HelpAndFeedback" }
  ];

  const handleClick = (item,index) => {
    setActiveIndex(index);
    setCurrentView(item.view);
  };

  return (
    <nav className="flex flex-col w-[15%] max-md:ml-0 max-md:w-full" role="navigation">
      <div className="flex flex-col h-screen  items-start px-2.5 py-9 mx-auto w-full text-base bg-zinc-900 bg-opacity-80 text-white text-opacity-80 max-md:mt-7">
        {/* User Profile Section */}
        <div className="flex gap-4 self-stretch px-5 py-3.5 text-base font-bold text-white whitespace-nowrap rounded-xl bg-zinc-700 shadow-[0px_2px_4px_rgba(0,0,0,0.12)] max-md:px-5">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/04e28020a6bc44dbe8ee85f4a6d19b15b6ce0e98e1e3a650d23a2c332d23e21b?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            alt="User profile"
            className="object-contain shrink-0 aspect-[0.98] rounded-[100px] w-[45px]"
          />
          <div className="grow shrink my-auto w-[95px]">Rahul</div>
        </div>

        {/* Sidebar Menu Items */}
        {/* <div role="menu" className="mt-5">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-5 mt-4 ml-5 max-md:ml-2.5 ${item.isActive ? 'font-bold' : ''}`}
              role="menuitem"
              tabIndex={0}
            >
              <img
                loading="lazy"
                src={item.icon}
                alt={`${item.text} icon`}
                className="object-contain shrink-0 my-auto w-4 aspect-square"
              />
              <div className="text-white">{item.text}</div>
            </div>
          ))}
        </div> */}

        <div role="menu" className="flex flex-col flex-grow w-[100%] mt-17">
          {sidebarItems.slice(0, 4).map((item, index) => (
            <button
              key={index}
              className={`flex w-full gap-5 mt-4 max-md:ml-2.5 px-3 py-2 rounded-lg ${activeIndex === index ? 'bg-zinc-700' : 'bg-transparent'}`}
              role="menuitem"
              onClick={() => handleClick(item,index)}
              tabIndex={0}
            >
              <img
                loading="lazy"
                src={item.icon}
                alt={`${item.text} icon`}
                className="object-contain shrink-0 my-auto w-4 aspect-square"
              />
              <div>{item.text}</div>
            </button>
          ))}
          <div className="mt-auto">
            {sidebarItems.slice(4).map((item, index) => (
              <button
                key={index}
                className={`flex w-full gap-5 mt-4 max-md:ml-2.5 px-3 py-2 rounded-lg ${activeIndex === index + 4 ? 'bg-zinc-700' : 'bg-transparent'}`}
                role="menuitem"
                onClick={() => handleClick(item,index + 4)}
                tabIndex={0}
              >
                <img
                  loading="lazy"
                  src={item.icon}
                  alt={`${item.text} icon`}
                  className="object-contain shrink-0 my-auto w-4 aspect-square"
                />
                <div>{item.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
