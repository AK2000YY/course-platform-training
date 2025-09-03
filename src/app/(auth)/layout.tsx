import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  );
}
