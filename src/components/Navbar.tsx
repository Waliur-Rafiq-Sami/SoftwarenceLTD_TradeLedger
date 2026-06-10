"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import ThemeToggle from "@/components/ThemeToggle";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;
  console.log("[Navbar] session", session);

  return (
    <nav className="p-4 md:p-6 shadow-md bg-background text-foreground border-b border-border transition-colors duration-300">
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <a href="#" className="text-xl font-bold">
          Softwarence LTD TradeLedger
        </a>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ThemeToggle />
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto" variant="outline">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
