import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
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
      <nav className="container flex gap-4 m-auto">
        <div className="mr-auto flex items-center gap-2">
          <Link className="mr-auto text-lg hover:underline" href="/">
            Course Platform
          </Link>
          <Badge>Admin</Badge>
        </div>
        <Link
          className="px-2 hover:bg-accent/10 text-lg flex items-center"
          href="/admin/courses"
        >
          Courses
        </Link>
        <Link
          className="px-2 hover:bg-accent/10 text-lg flex items-center"
          href="/admin/products"
        >
          Products
        </Link>
        <Link
          className="px-2 hover:bg-accent/10 text-lg flex items-center"
          href="/admin/sales"
        >
          Sales
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
      </nav>
    </header>
  );
}
