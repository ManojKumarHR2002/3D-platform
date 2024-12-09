// import * as React from "react";
// import  { useState } from "react";


// export function NavigationButton({ children, variant = "outline", className = "" }) {
//   const [isClicked, setIsClicked] = useState(false);

//   const baseStyles = "px-3 py-2.5 rounded-2xl shadow-[0px_2px_4px_rgba(0,0,0,0.12)] text-sm text-center text-white text-opacity-90";
//   const variants = {
//     outline: "border border-violet-400 border-solid",
//     filled: "bg-violet-400 font-bold"
//   };

//   const handleClick = () => {
//     setIsClicked(true);
//   };

//   return (
//     <button
//       className={`${baseStyles} ${isClicked ? variants.filled : variants[variant]} ${className}`}
//       onClick={handleClick}
//     >
//       {children}
//     </button>
//   );
// }


import * as React from "react";

export function NavigationButton({ children, variant = "outline", className = "", active = false, onClick }) {
  const baseStyles = "px-3 py-2.5 rounded-2xl shadow-[0px_2px_4px_rgba(0,0,0,0.12)] text-sm text-center text-white text-opacity-90";
  const variants = {
    outline: "border border-violet-400 border-solid hover:bg-violet-200 hover:bg-opacity-20",
    filled: "bg-violet-400 font-bold"
  };

  return (
    <button
      className={`${baseStyles} ${active ? variants.filled : variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

