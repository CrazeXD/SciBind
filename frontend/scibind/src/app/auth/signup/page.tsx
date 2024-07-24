"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Initial() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window !== "undefined" && localStorage.getItem("token")) {
          let response = await fetch("http://127.0.0.1:8000/api/verify/", {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            router.push("/dashboard");
          } else {
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error verifying token");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/auth/signup/select-events");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
            Create an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input input-bordered w-full rounded-t-md"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input input-bordered w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="first_name" className="sr-only">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className="input input-bordered w-full"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="sr-only">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className="input input-bordered w-full"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input input-bordered w-full rounded-b-md"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-error text-sm">{error}</div>}

          <div>
            <button type="submit" className="btn btn-primary w-full">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
