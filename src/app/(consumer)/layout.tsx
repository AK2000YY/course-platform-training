import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="h-12 flex shadow bg-background z-10">
      <nav className="container flex gap-4">
        <Link
          className="mr-auto px-2 text-lg hover:underline flex items-center"
          href="/"
        >
          Course Platform
        </Link>
        <SignedIn>
          <Link
            className="px-2 hover:bg-accent/10 text-lg flex items-center"
            href="/admin"
          >
            Admin
          </Link>
          <Link
            className="px-2 hover:bg-accent/10 text-lg flex items-center"
            href="/courses"
          >
            My Courses
          </Link>
          <Link
            className="px-2 hover:bg-accent/10 text-lg flex items-center"
            href="/purchases"
          >
            Purchase History
          </Link>
          <div className="size-8 self-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "100%", height: "100%" },
                },
              }}
            />
          </div>
        </SignedIn>
        <SignedOut>
          <Button className="self-center" asChild>
            <SignInButton />
          </Button>
          <Button className="self-center" asChild>
            <SignUpButton />
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}
