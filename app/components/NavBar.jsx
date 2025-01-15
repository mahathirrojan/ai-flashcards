import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AI Flashcards
        </Link>
        <div className="flex space-x-8">
          {/* Show these buttons only if the user is logged in */}
          <SignedIn>
            <Link href="/" className="text-white hover:text-gray-300">
              Flashcard
            </Link>
            <Link href="/generate" className="text-white hover:text-gray-300">
              Generate
            </Link>
            <Link href="/quiz" className="text-white hover:text-gray-300">
              Quiz
            </Link>
          </SignedIn>

          {/* Show login/signup buttons only if the user is not logged in */}
          <SignedOut>
            <Link href="/sign-in" className="text-white hover:text-gray-300">
              Login
            </Link>
            <Link href="/sign-up" className="text-white hover:text-gray-300">
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
