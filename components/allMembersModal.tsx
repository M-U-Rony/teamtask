'use client'

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type Member = {
  _id: string;
  name: string;
  role: string;
};

interface AllMembersProps {
  setSelectedMember: Dispatch<SetStateAction<string[]>>;
  selectedMember: string[];
  setshowAllmembersModal: Dispatch<SetStateAction<boolean>>;
}

export default function Allmembers({ setSelectedMember, selectedMember, setshowAllmembersModal }: AllMembersProps){

    const [allmember, setAllmember] = useState<Member[]>([]);

    useEffect(()=>{

    async function addMember(){

    try {

      const [res, meRes] = await Promise.all([
        fetch("/api/admin/users", { method: "GET" }),
        fetch("/api/auth/me", { method: "GET" }),
      ]);

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const [data, meData] = await Promise.all([res.json(), meRes.json()]);
      const currentUser = meData.data._id;
      const allUsers = data.data.users;
 
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
        <div className="bg-gray-200 z-50 absolute p-8 rounded-lg w-80">
          <div className="flex justify-between items-center mb-4">

            <h1 className="font-bold text-3xl">All Members</h1>
            <button type="button" className=" cursor-pointer font-semibold" onClick={()=> setshowAllmembersModal(false)}>X</button>
          </div>
            <ul className="flex flex-col items-center justify-center">
                 {
                allmember.map((p)=>(
                  <div className="flex gap-8 p-6 cursor-pointer" key={p._id}>
                    <input type="checkbox" name={p.name} id={p._id} checked={selectedMember.includes(p._id)} onClick={()=> handleSelect(p._id)}/>
                    <li>{p.name}</li>
                    <p>({p.role})</p>
                  </div>
                ))
                 }
            </ul>
            <button className="font-semibold p-2 bg-blue-500 hover:bg-blue-600 m-2 rounded-md cursor-pointer
          " onClick={()=> setshowAllmembersModal(false)}>Add</button>
        </div>
    )

  }