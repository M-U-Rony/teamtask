"use client";

import TaskCreationForm from "@/components/taskCreationForm";
import InviteMembersModal from "@/components/inviteMembersModal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/nav";
import { useAuth } from "@/lib/authContext";

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
  description?: string;
  members: string[];
}

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {project.name}
              </h1>
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
                      <span className="text-xs text-slate-400">
                        {task.members?.length ?? 0} assignee{(task.members?.length ?? 0) === 1 ? "" : "s"}
                      </span>
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
    </div>
  );
}
