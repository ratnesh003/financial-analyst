import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 gap-4 h-16 bg-linear-to-r from-primary to-primary/30">
      <Logo />
      <div className="flex items-center justify-center p-2 gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <Link href="/projects">
            <Button className="hover:cursor-pointer">
              Go to Projects <ChevronRightIcon />
            </Button>
          </Link>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
