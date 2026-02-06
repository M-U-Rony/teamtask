import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { projectSchema } from "@/lib/zodSchema";
import { Project, User } from "@/models/model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {

    const isAdmin = authMiddleware(req);
            
    if(!isAdmin || isAdmin?.role !== 'admin'){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

        await DBconnect();

       const body = await req.json();

       const parsed = projectSchema.safeParse(body);
       
           if (!parsed.success) {
             return NextResponse.json(
               { success: false, error: {message: "Invalid input" } },
               { status: 400 }
             );
           }


    const { name, description, members } = parsed.data;
    members.push(isAdmin.userId)

    const newProject = await Project.create({
        name,
        description,
        members,
        createdBy: new mongoose.Types.ObjectId(isAdmin.userId)
    })

    return NextResponse.json({success: true, message: "Project created",data: newProject},{status: 201});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in creating project" },
            { status: 500 }
        );
    }
    
}

export async function GET(req:NextRequest) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();
       

       const allProjects = await Project.find().lean();

       if(user.role === 'admin'){

        return NextResponse.json({success: true,projects: allProjects},{status: 200});
       }

       const myProject = allProjects.filter((p) => user.userId == p.members.includes(user.userId))

    return NextResponse.json({success: true, projects: myProject},{status: 200});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in getting project" },
            { status: 500 }
        );
    }
    
}