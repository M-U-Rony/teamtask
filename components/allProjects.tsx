"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
}

export default function Allprojects() {
  const [allprojects, setAllProjects] = useState<Project[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId =
    user?.id ?? (user as unknown as { userId?: string } | null)?.userId;

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch("/api/projects", {
          method: "GET",
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => res.statusText);
          throw new Error(
            `Failed to fetch projects: ${res.status} ${errorText}`,
          );
        }

        const data = await res.json();
        console.log(data.projects);
        setAllProjects(data.projects ?? []);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        setAllProjects([]);
      }
    }

    fetchProject();
  }, []);

  async function deleteProject(projectId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to delete project`,
        );
      }

      setAllProjects((prev) =>
        prev.filter((project) => project._id !== projectId),
      );
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }

  return (
    <div className="">
      {allprojects && allprojects.length > 0 ? (
        <ul className="flex gap-4 flex-wrap">
          {allprojects.map((p) => (
            <li
              key={p._id}
              onClick={() => router.push(`/dashboard/${p._id}/project`)}
              className="relative w-full sm:w-auto max-w-sm mx-auto overflow-hidden group cursor-pointer"
            >
              <div className="relative z-10 overflow-hidden rounded-[1.75rem] border border-sky-100/90 bg-linear-to-br from-white via-slate-50/90 to-slate-200/60 shadow-[0_24px_45px_-30px_rgba(15,23,42,0.5)] transition-all duration-300 group-hover:-translate-y-1 ">
                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-indigo-600 shadow-[0_14px_24px_-14px_rgba(37,99,235,0.9)] sm:h-10 sm:w-10">
                        <svg
                          className="h-5 w-5 text-white sm:h-6 sm:w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M13.2 2.6c3.6-.4 7.8.2 7.8.2s.6 4.2.2 7.8c-.3 2.6-1.6 4.6-3.9 6.8l-3-3-3 3-3-3c2.2-2.2 4.2-3.6 6.9-3.9z"
                            fill="currentColor"
                            opacity="0.95"
                          />
                          <circle cx="14.8" cy="8.2" r="1.7" fill="#3B82F6" />
                          <path
                            d="M9.2 14.7l-4.6 1.9 1.8-4.7 2.8 2.8zm2 2l-1.9 4.7 4.7-1.8-2.8-2.9z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                        {p.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none h-8 w-full  from-sky-100/40 via-indigo-100/35 to-sky-200/55 [clip-path:ellipse(72%_90%_at_45%_100%)] sm:h-10" />

                <div className="flex items-center justify-between gap-3 border-t border-slate-100/90 bg-white/70 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-4">
                  <div className="min-w-0 flex items-center gap-x-6 gap-y-2 text-sm text-slate-500 sm:text-base">
                    <div className="inline-flex items-center gap-2.5 min-w-0">
                      <svg
                        className="h-4 w-4 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M15.5 20.5v-1.7a3.5 3.5 0 00-3.5-3.5H6.8a3.5 3.5 0 00-3.5 3.5v1.7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="9.4"
                          cy="8.6"
                          r="3.4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M20.5 20.5v-1.7a3.5 3.5 0 00-2.7-3.4M14.5 5.3a3.4 3.4 0 010 6.6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Team: {p.members.length} {p.members.length > 1 ? "members" : "member"}</span>
                    </div>
                  </div>

                  <div className="relative z-20 h-9 w-9 shrink-0">
                    {String(p.createdBy) === currentUserId ? (
                      <>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        onClick={(e) => {
                          e.stopPropagation();
                        setOpenMenuId((prev) => (prev === p._id ? null : p._id));
                      }}
                      aria-haspopup="menu"
                      aria-expanded={openMenuId === p._id}
                      aria-label="Project actions"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <circle cx="12" cy="5" r="1.75" fill="currentColor" />
                        <circle cx="12" cy="12" r="1.75" fill="currentColor" />
                        <circle cx="12" cy="19" r="1.75" fill="currentColor" />
                      </svg>
                    </button>

                    {openMenuId === p._id ? (
                      <button
                        type="button"
                        className="absolute bottom-full right-0 mb-2 z-30 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-red-600 shadow-sm hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(p._id);
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No projects found
        </div>
      )}
    </div>
  );
}
