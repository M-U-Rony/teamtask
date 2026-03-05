"use client";
import LoadingSpinner from "@/components/loadingSpinner";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Allmembers from "./allmembersmodal";

type taskCreationFormProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
};

export default function TaskCreationForm({
  setShowForm,
  projectId,
}: taskCreationFormProps) {
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllmembersmodal, setshowAllmembersModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);

  async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();

    const data = {
      name: name,
      description: description,
      members: selectedMember,
    };

    try {
      const res = await fetch(`/api/projects/${projectId}/createTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.message || result?.error?.message || "Task Creation failed");
        return;
      }

      toast.success(result.message || "task Created");
      setname("");
      setDescription("");
      setShowForm(false);
    } catch (error) {
      toast.error("task Creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <Toaster />
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Create New Task
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add task details and assign teammates.
            </p>
          </div>
          <button
            aria-label="Close create task"
            className="text-slate-500 hover:text-slate-700 ml-4 cursor-pointer"
            onClick={() => {
              setShowForm(false);
              setSelectedMember([]);
            }}
          >
            X
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Task name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 resize-vertical focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <button
            className="w-full rounded-md border border-slate-200 text-slate-700 py-2 hover:bg-slate-50 cursor-pointer"
            onClick={() => setshowAllmembersModal(true)}
            type="button"
          >
            Assign To
          </button>

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
              Create task
            </button>
          )}
        </form>
      </div>
      {showAllmembersmodal ? (
        <Allmembers
          setSelectedMember={setSelectedMember}
          selectedMember={selectedMember}
          setshowAllmembersModal={setshowAllmembersModal}
          projectId={projectId}
        />
      ) : null}
    </div>
  );
}
