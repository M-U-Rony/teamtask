"use client";
import LoadingSpinner from "@/components/loadingSpinner";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type taskCreationFormProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TaskCreationForm({
  setShowForm,
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
    } catch (error) {
      toast.error("Project Creation failed");
    } finally {
      setLoading(false);
      setShowForm(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Toaster />
      <div className="flex flex-col items-center justify-center border border-black p-16 rounded-lg">
        <div className="flex items-center justify-between gap-4">

        <h1 className="text-3xl font-bold">Create New Task</h1>
        <button className="cursor-pointer font-semibold" onClick={()=> {setShowForm(false); setSelectedMember([])}}>X</button>
        </div>

        <form
          onSubmit={handleCreate}
          className="flex flex-col items-start gap-2 p-4"
        >
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="border p-1 w-64 rounded-lg px-2"
            required
          />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border h-20 w-64 rounded-lg px-2"
            required
          />

          <button
            className="font-semibold p-2 bg-blue-500 hover:bg-blue-600 m-2 rounded-md cursor-pointer
          "
            onClick={() => setshowAllmembersModal(true)}
            type="button"
          >
            Add Members
          </button>

          {loading ? (
            <button
              type="button"
              disabled
              className="cursor-pointer p-2 rounded-lg w-full bg-black mt-4 text-white flex items-center justify-center"
            >
              <LoadingSpinner />
            </button>
          ) : (
            <button
              type="submit"
              className="cursor-pointer p-2 rounded-lg w-full bg-black hover:bg-gray-800 mt-4 text-white"
            >
              Submit
            </button>
          )}
        </form>
      </div>
      {showAllmembersmodal ? (
        <Allmembers
          setSelectedMember={setSelectedMember}
          selectedMember={selectedMember}
          setshowAllmembersModal={setshowAllmembersModal}
        />
      ) : null}
    </div>
  );
}
