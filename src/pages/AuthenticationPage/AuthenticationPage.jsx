import React from "react";
import { useParams } from "react-router-dom";
import LoginForm from "../../components/AuthenticationPage/LogInForm";
import SignupForm from "../../components/AuthenticationPage/SignUpForm";

export default function AuthenticationPage() {
  const { authType } = useParams(); // Retrieve the authType parameter from the URL

  return (
    <div className="flex fixed top-0 left-0 h-screen w-screen bg-zinc-800 overflow-hidden">
      {/* Form section taking 60% width */}
      <div className="w-[60%] flex items-center justify-center p-10 max-md:px-5">
        {authType === "login" && <LoginForm />}
        {authType === "signup" && <SignupForm />}
      </div>
      {/* Image section taking 40% width */}
      <div className="w-[40%]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/192b5938cfdf5982515ff555cc9a0d5233c41af8905c94b07d6e97eb3a1b81cd?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
          alt="Authentication Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
