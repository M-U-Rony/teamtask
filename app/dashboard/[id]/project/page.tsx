"use client";

import TaskCreationForm from "@/components/taskCreationForm";
import InviteMembersModal from "@/components/inviteMembersModal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/nav";

interface Project {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
}

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "GET" });
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setProject(data.project);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    fetchProject();
  }, []);

  async function handleRemoveMember(memberId: string) {
    try {
      const res = await fetch(`/api/projects/${id}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "remove", users: [memberId] }),
      });
      const data = await res.json();
      if (res.ok) {
        setProject(data.project);
      }
    } catch (error) {
      console.error(error);
    }
  }

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

            <div className="flex items-center gap-3">
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
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-medium text-slate-700">Tasks</h2>
            <div className="mt-3 text-sm text-slate-500">
              No tasks yet. Create one to get started.
            </div>
          </div>
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl">
            <TaskCreationForm setShowForm={setShowTaskForm} />
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
