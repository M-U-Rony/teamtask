'use client'

import Link from "next/link";
import Navbar from "@/components/nav";
import { useAuth } from "@/lib/authContext";

export default function Home() {

  const {user} = useAuth();
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Simple project management, delightful collaboration
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          Create projects, add members, and track tasks with a minimal, focused
          interface. Built for teams who want less noise and more shipping.
        </p>

        {user ? (
          <div className="mt-10 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:opacity-95"
            >
              Go to Dashboard
            </Link>
          </div>
        ) :
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:opacity-95"
          >
            Get started — it's free
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center px-5 py-3 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
        }

        <div className="mt-14 text-sm text-slate-500">
          <span className="mr-2">Trusted by</span>
          <span className="font-medium text-slate-700">
            small teams • startups • creators
          </span>
        </div>
      </section>

      <section className="w-full border-t border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-slate-600">
          Focus on work, not on tools. Create a project and invite your team in
          seconds.
        </div>
      </section>
    </main>
  );
}
