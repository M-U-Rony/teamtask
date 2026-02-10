'use client'

import Navbar from "@/components/nav";
import { useState } from "react";
import ProjectCreationForm from "@/components/projectCreationForm";



export default function Dashboard() {

    const [showForm, setShowForm] = useState(false);


  return (
    <div className = "">
      <Navbar />
      <button className="border p-2 font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 m-4 cursor-pointer" 
      onClick={ ()=> setShowForm(true)}>Create Project +</button>
      {showForm ? <ProjectCreationForm setShowForm = {setShowForm}/> : null}
    </div>
  );
}