import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { taskSchema } from "@/lib/zodSchema";
import {Project, Task} from "@/models/model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest,{params }: { params: { id: string } }) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();

       const body = await req.json();
       
              const parsed = taskSchema.safeParse(body);
              
                  if (!parsed.success) {
                    return NextResponse.json(
                      { success: false, error: {message: "Invalid input" } },
                      { status: 400 }
                    );
                  }
       
       
        const { name, description, members } = parsed.data;

      const { id } = await params;
      
      const project = await Project.findById(id).lean();

       if(!project){
        return NextResponse.json({success: false,message: "Project Not found"},{status: 404});
       }

      if (String(project.createdBy) !== user.userId) {
        return NextResponse.json({success: false,message: "Forbidden"},{status: 403});
      }

      if(members.length == 0){
        return NextResponse.json({success: false,message: "At least one member is required"},{status: 400});
      }

      const newTask = await Task.create({
        name,
        description,
        belongsTo: new mongoose.Types.ObjectId(id),
        members
      })

    return NextResponse.json({success: true, project: newTask},{status: 200});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in creating task" },
            { status: 500 }
        );
    }
    
}