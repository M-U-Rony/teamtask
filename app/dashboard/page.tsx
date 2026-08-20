"use client";

import Navbar from "@/components/nav";
import { useState,useEffect } from "react";
import ProjectCreationForm from "@/components/projectCreationForm";
import Allprojects from "@/components/allProjects";
import { useAuth } from "@/lib/authContext";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const {user }= useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
    
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
    const authMessage = {
    type: 'auth',
    userId: user?.id 
  };

  socket.send(JSON.stringify(authMessage));
    };

    socket.onmessage = (event) => {
      console.log("📩 Message from server:", event.data);
    };

    socket.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex">

          <section className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">
                All Projects
              </h1>
              <div className="flex items-center gap-3">
     
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 rounded-md bg-slate-900 text-white cursor-pointer"
                  >
                    Create Project
                  </button>
       
              </div>
            </div>

            <div className="bg-gray-300 w-[80vw] rounded-lg p-4">
              <Allprojects />
            </div>
          </section>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl p-6">
            <ProjectCreationForm setShowForm={setShowForm} />
          </div>
        </div>
      )}
    </div>
  );
}
