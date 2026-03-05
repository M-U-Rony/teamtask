import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { updateProjectSchema } from "@/lib/zodSchema";
import { Project} from "@/models/model";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req:NextRequest,{params }: { params: { id: string } }) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();
    
       const { id } = await params;
       const body = await req.json();

       const parsed = updateProjectSchema.safeParse(body);
       
           if (!parsed.success) {
             return NextResponse.json(
               { success: false, error: {message: "Invalid input" } },
               { status: 400 }
             );
           }


    const { name, description} = parsed.data;

    const project = await Project.findById(id);

    if (!project) {
        return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.createdBy.toString() !== user.userId) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
            name,
            description,
        },
        { new: true }
    )

    return NextResponse.json({success: true, message: "Project updated",data: updatedProject},{status: 201});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Error in updating project" },
            { status: 500 }
        );
    }
    
}