"use client";

import TaskCreationForm from "@/components/taskCreationForm";
import InviteMembersModal from "@/components/inviteMembersModal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/nav";
import { useAuth } from "@/lib/authContext";
import { CiEdit } from "react-icons/ci";
import ProjectCreationForm from "@/components/projectCreationForm";
import ProjectMembersPanel from "@/components/projectMembersPanel";

interface Project {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
}

interface Task {
  _id: string;
  name: string;
  status: string;
  description?: string;
  members: string[];
}

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openTaskMenuId, setOpenTaskMenuId] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const {user} = useAuth();

  async function fetchProject() {
    try {
      const [projectres , taskres]= await Promise.all([
        fetch(`/api/projects/${id}`, { method: "GET" }),
        fetch(`/api/projects/${id}/allTask`, { method: "GET" })
      ]);

      if (!projectres.ok) {
        router.push("/dashboard");
        return;
      }

      const [projectData, taskData] = await Promise.all([projectres.json(),taskres.json()]) ;
      setProject(projectData.project);

      setTasks(taskData?.data ?? []);

      // console.log(taskData.data);
     
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchProject();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleTaskStatus(taskId: string, value: string) {


    try {
      
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: value }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }

      fetchProject();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProject();
  }, []);

  if (loading) return null;

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {project.name}
                  </h1>
                  {(user?.id !== project.createdBy) ? null : <button
                    onClick={() => setShowEditForm(true)}
                    className="ml-2 text-black text-2xl hover:text-slate-700"
                  >
                    <CiEdit className="cursor-pointer" />
                  </button>}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {project.description}
                </p>
              </div>

              {(user?.id !== project.createdBy) ? null :  <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm cursor-pointer"
                >
                  Create Task
                </button>
                <button
                  onClick={() => setShowMembersModal(true)}
                  className="px-3 py-2 rounded-md border border-slate-200 text-sm"
                >
                  Invite Member
                </button>
              </div>}
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-medium text-slate-700">{(user?.id !== project.createdBy)? "My Task" : "All Task"}</h2>
              {tasks.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {tasks.map((task) => (
                    <article
                      key={task._id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">
                          Task
                        </span>

                        {user?.id === project.createdBy ? 

                        <p
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                            task.status === "not-started"
                              ? "bg-red-50 text-red-700 ring-red-100"
                              : task.status === "done"
                                ? "bg-green-50 text-green-700 ring-green-100"
                                : "bg-sky-50 text-sky-700 ring-sky-100"
                          }`}
                        >
                          {task.status}
                        </p>
                        
                        :

                        <div className="ml-auto mr-2 flex items-center gap-2">
                          <label
                            htmlFor={`task-status-${task._id}`}
                            className="text-xs font-medium text-slate-600"
                          >
                            Status
                          </label>
                          <select
                            name="status"
                            id={`task-status-${task._id}`}
                            defaultValue={task.status}
                            className={`rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none transition focus:border-slate-400 ${
                              task.status === "not-started"
                                ? "text-red-700"
                                : task.status === "done"
                                  ? "text-green-700"
                                  : "text-slate-700"
                            }`}
                            onChange={(e) => handleTaskStatus(task._id, e.target.value)}
                          >
                            <option value="not-started" className="text-red-800">Not Started</option>
                            <option value="in-progress" className="text-blue-600">In Progress</option>
                            <option value="done" className="text-green-700">Done</option>
                          </select>
                        </div>
                        }




                        {user?.id === project.createdBy ? (
                          <div className="relative">
                            <button
                              type="button"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                              onClick={() =>
                                setOpenTaskMenuId((prev) =>
                                  prev === task._id ? null : task._id,
                                )
                              }
                              aria-label="Task options"
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

                            {openTaskMenuId === task._id && (
                              <div className="absolute right-0 top-full mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-lg">
                                <button
                                  type="button"
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    setOpenTaskMenuId(null);
                                    handleDeleteTask(task._id);
                                  }}
                                >
                                  Delete task
                                </button>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {task.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {task.description?.trim() || "No description provided."}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-medium text-slate-700">No tasks yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Create one to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {project.members && (
            <ProjectMembersPanel
              members={project.members}
              projectId={project._id as string}
              projectAdminId={project.createdBy}
              currentUserId={user?.id}
            />
          )}
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl">
            <TaskCreationForm setShowForm={setShowTaskForm} projectId = {id as string} />
          </div>
        </div>
      )}

      {showMembersModal && (
        <InviteMembersModal
          projectId={id as string}
          onClose={() => setShowMembersModal(false)}
          onInvited={() => fetchProject()}
        />
      )}

        {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl">
            <ProjectCreationForm setShowForm={setShowEditForm} project={project}/>
          </div>
        </div>
        )}
    </div>
  );
}
