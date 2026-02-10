 'use client'

import { useRouter } from "next/navigation";
 import { useEffect, useState } from "react"
 import toast,{Toaster} from "react-hot-toast";
 
 export default function Navbar(){

    const [user, setUser] = useState<String | null>("");
    const [loading,setLoading] = useState(true);
    const router = useRouter()

    useEffect(()=>{

        async function fetchmyInfo(){

            try {

                const res = await fetch('/api/auth/me',{
                method: "GET",
                headers:{
                    'Content-type': "application/json"
                }
            })

            if(!res.ok){
                setUser(null);
                setLoading(false)
                return
            }

            const data = await res.json();
            setUser(data.data._id);
                
            } catch (error) {
                setUser(null)
                console.log(error);
            }finally{
                setLoading(false);
            }
            
        }

        fetchmyInfo();

    },[])

    async function handleLogout(){

        const res = await fetch('/api/auth/logout',{
            method: "POST",
                headers:{
                    "Content-type": "application/json"
                }
        })

        if(!res.ok){
            toast.error("Something Wrong while logout");
            return;
        }

        router.push('/login');
    }


    return(
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-300">
            <Toaster/>
            <h1 className="font-bold text-3xl">TeamTask</h1>
            {loading ? "" : (user ? <button  className="cursor-pointer border rounded-md p-2 bg-gray-200 font-semibold hover:bg-gray-300" onClick={handleLogout}>Logout</button> : null)}

        </div>
    )
 }