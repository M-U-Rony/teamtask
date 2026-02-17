"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  projectId: string;
  onClose: () => void;
  onInvited?: () => void;
};

export default function InviteMembersModal({
  projectId,
  onClose,
  onInvited,
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendInvite() {
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to send invitation");
        return;
      }

      toast.success("Invitation sent");
      setEmail("");
      onInvited && onInvited();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Invite member
            </h2>
          </div>
          <button
            aria-label="Close invite modal"
            className="text-slate-500 hover:text-slate-700 ml-4 cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendInvite();
            }}
            placeholder="email@example.com"
            className="mt-2 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md border border-slate-200 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={sendInvite}
            disabled={loading}
            className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
