"use client";
import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import React from "react";

const SignIn = () => {
  return (
    <SignInButton mode="modal">
      <button
        aria-label="Zaloguj się"
        className="group flex items-center gap-1 text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect"
        type="button"
        onClick={() => console.log('Sign in button clicked')}
      >
        <span className="inline md:hidden">
          <LogIn className="w-5 h-5" />
        </span>
        <span className="hidden md:inline">Login</span>
      </button>
    </SignInButton>
  );
};

export default SignIn;
