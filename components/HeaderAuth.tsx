"use client";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import SignIn from "./SignIn";

const HeaderAuth = () => {
  return (
    <ClerkLoaded>
      <SignedIn fallback={<SignIn />}>
        <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
      </SignedIn>
    </ClerkLoaded>
  );
};

export default HeaderAuth;
