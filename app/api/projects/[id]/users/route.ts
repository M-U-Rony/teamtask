import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { taskSchema } from "@/lib/zodSchema";
import {Project, Task} from "@/models/model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,{params }: { params: { id: string } }) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

      await DBconnect();

      const { id } = await params;
      
      const project = await Project.findById(id).populate("members").lean();

       if(!project){
        return NextResponse.json({success: false,message: "Project Not found"},{status: 404});
       }

      if (String(project.createdBy) !== user.userId) {
        return NextResponse.json({success: false,message: "Forbidden"},{status: 403});
      }

    return NextResponse.json({success: true,data: project.members},{status: 200});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in find users" },
            { status: 500 }
        );
    }
    
}