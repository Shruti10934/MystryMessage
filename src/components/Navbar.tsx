'use client';

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
    const {data : session} = useSession();
    const user: User = session?.user as User;
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container max-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">Mystry Message</a>
        {
          session ? (
            <>
              <span>Welcome, {user?.username || user?.email}</span>
              <Button onClick={() => signOut()} className="w-full md:w-auto">Logout</Button>
            </>
          ) : (
            <div>

            <Link href="/sign-in" className="mr-40">
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full md:w-auto">Register</Button>
            </Link>
            </div>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar
