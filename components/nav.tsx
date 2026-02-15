"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Navbar() {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; title: string; message: string; time: string }>
  >([]);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchmyInfo() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!res.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser({
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
        });
      } catch (error) {
        setUser(null);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchmyInfo();

    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications", { method: "GET" });
        if (!res.ok) throw new Error("no notifications api");
        const data = await res.json();
        setNotifications(data.notifications ?? []);
      } catch (err) {
        // fallback sample history
        setNotifications([
          {
            id: "1",
            title: "Project created",
            message: "You created 'Class Project'",
            time: "2 days ago",
          },
          {
            id: "2",
            title: "Member invited",
            message: "You invited Alice to 'Second Project'",
            time: "3 days ago",
          },
          {
            id: "3",
            title: "Task assigned",
            message: "Bob assigned you a task",
            time: "5 days ago",
          },
        ]);
      }
    }

    fetchNotifications();

    // click-outside handler to close the history dropdown
    function onDocClick(e: MouseEvent) {
      if (
        showHistory &&
        historyRef.current &&
        !historyRef.current.contains(e.target as Node)
      ) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function handleLogout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!res.ok) {
      toast.error("Something Wrong while logout");
      return;
    }

    window.location.reload();
  }

  return (
    <header className="w-full bg-white shadow-sm">
      <Toaster />
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-slate-900"
        >
          TeamTask
        </Link>

        <div>
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              {/* Notification button + history dropdown */}
              <div className="relative" ref={historyRef}>
                <button
                  aria-label="Notifications"
                  onClick={() => setShowHistory((s) => !s)}
                  className="relative p-2 rounded-md hover:bg-slate-100"
                >
                  <svg
                    className="h-5 w-5 text-slate-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.73 21a2 2 0 01-3.46 0"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] px-1.5 py-0.5">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showHistory && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-lg ring-1 ring-black/5 z-50">
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                      <strong className="text-sm">History</strong>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="max-h-64 overflow-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500">
                          No history
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="p-3 hover:bg-slate-50 border-b last:border-b-0"
                          >
                            <div className="text-sm font-semibold text-slate-900">
                              {n.title}
                            </div>
                            <div className="text-sm text-slate-600">
                              {n.message}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {n.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-sm text-slate-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded-md bg-slate-900 text-white hover:opacity-95 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/login")}
                className="text-sm px-3 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Login
              </button>
              <Link
                href="/signup"
                className="text-sm px-3 py-1 rounded-md bg-slate-900 text-white cursor-pointer"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
