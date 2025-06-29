import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// Define types for better type safety
interface Credentials {
    identifier: string;
    password: string;
}

interface User {
    _id?: string;
    email: string;
    username: string;
    password: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                identifier: { label: "Email/Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Credentials | undefined): Promise<User | null> {
                console.log(1);
                await dbConnect();
                
                if (!credentials) {
                    throw new Error("No credentials provided");
                }
                
                const { identifier, password } = credentials;
                
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    });
                    
                    if (!user) {
                        throw new Error("No user found with this email or username");
                    }
                    
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login");
                    }
                    
                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (isPasswordCorrect) {
                        return {
                            _id: user._id?.toString(),
                            email: user.email,
                            username: user.username,
                            password: user.password,
                            isVerified: user.isVerified,
                            isAcceptingMessages: user.isAcceptingMessages,
                        };
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        throw new Error(err.message);
                    }
                    throw new Error("An unknown error occurred");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
};