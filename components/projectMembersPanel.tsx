import { useState } from "react";

interface Member {
  _id?: string;
  name?: string;
  email?: string;
}

interface ProjectMembersPanelProps {
  members: Array<string | Member>;
  projectId: string;
  projectAdminId: string;
  currentUserId?: string;
}

interface ProjectMemberRowProps {
  member: string | Member;
  onRemove: (memberId: string) => void;
  canManageMembers: boolean;
  projectAdminId: string
}

function ProjectMemberRow({ member, onRemove, canManageMembers,projectAdminId }: ProjectMemberRowProps) {
  const [openMenu, setOpenMenu] = useState(false);

  const memberId = typeof member === "string" ? member : member?._id || "";
  const memberName = typeof member === "string" ? member : member?.name || "";

  return (
    <li className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-400 bg-gray-400" />
        <p className="truncate text-md leading-none text-black">
          {memberName}
          {memberId === projectAdminId ? " (admin)": ""}
        </p>
      </div>

      <div className="relative z-20 h-9 w-5 shrink-0">
        {(canManageMembers && memberId !== projectAdminId) ?
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          onClick={() => {
            setOpenMenu((prev) => !prev);
          }}
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
        </button> : null}
        

        {openMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                onRemove(memberId);
                setOpenMenu(false);
              }}
            >
              Remove from project
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export default function ProjectMembersPanel({ members, projectId, projectAdminId, currentUserId }: ProjectMembersPanelProps) {
  const canManageMembers = currentUserId === projectAdminId;

  async function handleRemove(memberId: string) {

    try {
      const response = await fetch(`/api/projects/${projectId}/removeMember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberId,projectAdminId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove member");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error removing member:", error);
    }
  }

  return (
    <aside className="rounded-3xl border-2 border-slate-200 bg-white p-6 text-black shadow-sm lg:sticky lg:top-6">
      <h2 className="mb-6 text-xl font-medium leading-none tracking-wide text-black">
        All members
      </h2>

      <ul className="space-y-2">
        {members.map((member, idx) => (
          <ProjectMemberRow
            key={idx}
            member={member}
            onRemove={handleRemove}
            canManageMembers={canManageMembers}
            projectAdminId = {projectAdminId}
          />
        ))}
      </ul>
    </aside>
  );
}
