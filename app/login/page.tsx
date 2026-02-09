"use client";
import LoadingSpinner from "@/components/loadingSpinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || "Login failed");
        return;
      }

      toast.success(result.message || "Login Successful");
      setEmail("");
      setPassword("");

      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster />
      <div className="flex flex-col items-center justify-center border border-black p-16 rounded-lg">
        <h1 className="text-3xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-1 w-64 rounded-lg px-2"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-1 w-64 rounded-lg px-2"
            required
          />
          {loading ? (
            <button
              type="button"
              disabled
              className="cursor-pointer p-2 rounded-lg  bg-black mt-4 text-white flex items-center justify-center"
            >
              <LoadingSpinner />
            </button>
          ) : (
            <button
              type="submit"
              className="cursor-pointer p-2 rounded-lg bg-black mt-4 text-white"
            >
              Submit
            </button>
          )}
        </form>

        <p className="text-gray-700">Don't have an account? <Link href={'/signup'} className="font-bold text-blue-700">Signup</Link></p>
      </div>
    </div>
  );
}
