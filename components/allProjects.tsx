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
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allprojects.map((p) => (
            <li
              key={p._id}
              onClick={() => router.push(`/dashboard/${p._id}/project`)}
              className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-sm font-semibold text-slate-700 transition-colors group-hover:border-sky-100 group-hover:bg-sky-50 group-hover:text-sky-600">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-sky-600">
                        {p.name}
                      </h3>
                    </div>
                  </div>

                  <div className="relative ml-4 shrink-0">
                    {String(p.createdBy) === currentUserId ? (
                      <>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId((prev) => (prev === p._id ? null : p._id));
                          }}
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === p._id}
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11.5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          </svg>
                        </button>

                        {openMenuId === p._id && (
                          <div className="absolute right-0 top-10 z-20 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                            <button
                              type="button"
                              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(p._id);
                              }}
                            >
                              Delete project
                            </button>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>

                {p.description && (
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {p.description}
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{p.members.length} {p.members.length === 1 ? "member" : "members"}</span>
                </div>
                
                <span className="flex items-center gap-1 text-xs font-semibold text-sky-600 opacity-0 transition-opacity group-hover:opacity-100">
                  View <span aria-hidden="true">&rarr;</span>
                </span>
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
