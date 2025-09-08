"use client";
// import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import React from "react";

const SignIn = () => {
  return (
    <button
      aria-label="Zaloguj się"
      className="group flex items-center gap-1 text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect"
      disabled
    >
      <span className="inline md:hidden">
        <LogIn className="w-5 h-5" />
      </span>
      <span className="hidden md:inline">Login (Disabled)</span>
    </button>
  );
};

export default SignIn;
