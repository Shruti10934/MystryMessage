"use client";
import { useSession } from "next-auth/react";

export default function DonorPage() {
    const { data: session } = useSession();

    if (!session)
        return (
            <div className="h-screen w-screen bg-black text-white flex justify-center items-center text-5xl">
                You are not logged in.
            </div>
        );

    return (
        <div className="h-screen w-screen bg-black text-white flex justify-center items-center text-5xl">
            {/* <LogoutButton /> */}
            Hello
            <h1 className="text-3xl font-bold">Donor Page</h1>
            {/* <p>Welcome, {session.user.}!</p> */}
        </div>
    );
}
