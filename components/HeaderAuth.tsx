"use client";
import { ClerkLoaded, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import SignIn from "./SignIn";

const HeaderAuth = () => {
  return (
    <ClerkLoaded>
      <SignedIn>
        <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </ClerkLoaded>
  );
};

export default HeaderAuth;
