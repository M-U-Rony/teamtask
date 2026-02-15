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

    const data = { email, password };

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Toaster />

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-slate-900 text-center">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-500 text-center">
          Welcome back — enter your credentials below.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <div className="mt-4">
            {loading ? (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center rounded-md bg-slate-900 text-white py-2"
              >
                <LoadingSpinner />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 text-white py-2 cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-slate-900">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
