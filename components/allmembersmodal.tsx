'use client'

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type Member = {
  _id: string;
  name: string;
};

interface AllMembersProps {
  setSelectedMember: Dispatch<SetStateAction<string[]>>;
  selectedMember: string[];
  setshowAllmembersModal: Dispatch<SetStateAction<boolean>>;
  projectId: string
}

export default function Allmembers({ setSelectedMember, selectedMember, setshowAllmembersModal,projectId }: AllMembersProps){

    const [allmember, setAllmember] = useState<Member[]>([]);

    useEffect(()=>{

    async function addMember(){

    try {

      const [res, meRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/users`, { method: "GET" }),
        fetch("/api/auth/me", { method: "GET" }),
      ]);

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const [data, meData] = await Promise.all([res.json(), meRes.json()]);
      const currentUser = meData.data._id;
      const allUsers = data.data;
 
      setAllmember(allUsers.filter((p: Member) => p._id !== currentUser));
      
    } catch (error) {
      console.log(error)
    }finally{

    }

  }

  addMember();

},[])

function handleSelect(id: string){
    if(selectedMember.includes(id)){
         setSelectedMember(prev=> prev.filter(m => m !== id));
    }else{
        setSelectedMember(prev => [...prev, id]);
    }

}


    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
        <div className="w-80 rounded-xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">All Members</h1>
            <button
              type="button"
              className="cursor-pointer text-slate-500 hover:text-slate-700"
              onClick={()=> setshowAllmembersModal(false)}
            >
              X
            </button>
          </div>

          <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {allmember.map((p)=>(
              <li
                className="flex items-center justify-between rounded-md border border-slate-200 p-3"
                key={p._id}
              >
                <label htmlFor={p._id} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name={p.name}
                    id={p._id}
                    checked={selectedMember.includes(p._id)}
                    onChange={()=> handleSelect(p._id)}
                    className="h-4 w-4 cursor-pointer accent-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-800">{p.name}</span>
                </label>
               
              </li>
            ))}
          </ul>

          <button
            className="mt-4 w-full cursor-pointer rounded-md bg-slate-900 py-2 text-white hover:bg-slate-800"
            onClick={()=> setshowAllmembersModal(false)}
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    )

  }
