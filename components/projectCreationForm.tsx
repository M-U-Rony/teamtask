"use client";
import LoadingSpinner from "@/components/loadingSpinner";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type ProjectCreationFormProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProjectCreationForm({
  setShowForm,
}: ProjectCreationFormProps) {
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();

    const data = {
      name: name,
      description: description,
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || "Project Creation failed");
        setShowForm(false);
        return;
      }

      toast.success(result.message || "Project Created");
      setname("");
      setDescription("");
      window.location.reload();
    } catch (error) {
      toast.error("Project Creation failed");
    } finally {
      setLoading(false);
      setShowForm(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <Toaster />

      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Create New Project
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add a name, description and invite teammates.
            </p>
          </div>

          <button
            aria-label="Close create project"
            className="text-slate-500 hover:text-slate-700 ml-4 cursor-pointer"
            onClick={() => {
              setShowForm(false);
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Project name
            </label>
            <input
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

          <div>
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
                Create project
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
