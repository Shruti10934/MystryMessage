"use client";
import {  signIn,  } from "next-auth/react";
import { useState } from "react";

export default function Component() {

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (res?.error)
      console.error(
        res.error === "CredentialsSignin"
          ? "Invalid email or password"
          : res.error
      );
  };

  return (
        <>
          Not signed in <br />
          <form onSubmit={handleLogin}></form>
          <label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChanges}
              required
            />
            Email
          </label>
          <label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChanges}
              required
            />
            password
          </label>
          <button onClick={() => signIn()}>Sign in</button>
        </>
  )
}
