import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { projectSchema } from "@/lib/zodSchema";
import { Project, User } from "@/models/model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,{params }: { params: { projectId: string } }) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();

      const { projectId } = params;

       const project = await Project.findById(projectId).lean();

       if(!project){
        return NextResponse.json({success: false,message: "Not found"},{status: 404});
       }

       if(user.role === 'admin'){

        return NextResponse.json({success: true,project: project},{status: 200});
       }

       const isBelong = project.filter((p:any) => user.userId == p.members.includes(user.userId));

       if(!isBelong){
        return NextResponse.json({success: false,message: "forbidden"},{status: 403});
       }

    return NextResponse.json({success: true, project: isBelong},{status: 200});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in getting project" },
            { status: 500 }
        );
    }
    
}