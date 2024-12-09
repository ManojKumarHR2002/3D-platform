import * as React from "react";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/auth/login");
  };

  const [formData, setFormData] = React.useState({
    name:"",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };
  const handleGoogleSignIn = () => {
    // Handle Google sign in
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start pt-16 my-auto">
      <h1 className="text-5xl font-bold text-white max-md:text-4xl pr-32">
        Welcome!
      </h1>
      
      <div className="flex gap-1.5 mt-3 text-base">
        <div className="grow text-white">Already have an account?</div>
        <button 
          className="font-semibold text-violet-400" 
          tabIndex={0}
          onClick={handleNavigation}
        >
            Log in here
        </button>
      </div>
      <FormInput
        label="Name"
        type="name"
        id="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <FormInput
        label="Email"
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <FormInput
        label="Password"
        type="password"
        id="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
        <div className="flex flex-col pt-7 self-center items-center mt-3 max-w-full text-sm text-white w-[300px]">
          <button 
            type="submit"
            className="px-6 py-3 mt-4 text-sm font-bold text-center text-white bg-violet-400 rounded-2xl shadow-[0px_2px_4px_rgba(0,0,0,0.12)] max-md:px-5"
          >
            Log Up
          </button>

          <div className="flex py-5 items-center gap-5 mt-4 w-full">
            <div className="flex-grow h-px bg-stone-300 opacity-30" />
            <div className="text-center text-sm text-stone-300">or</div>
            <div className="flex-grow h-px bg-stone-300 opacity-30" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="flex items-center gap-3.5 px-4 py-2.5 mt-4 text-base font-medium text-white rounded-2xl border border-violet-400 border-solid shadow-[0px_2px_4px_rgba(0,0,0,0.12)] hover:bg-violet-400/10 transition-colors"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/77f5eef20cce35daae6d8f7074e6d05e5e1213978c1b1d16980fdf46d04294db?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
              alt="Google logo"
              className="object-contain rounded-full w-[19px]"
            />
            <span className="flex-grow text-center">Sign up with Google</span>
          </button>
        </div>

    </form>
  );
}