import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { projectSchema,addOrremoveSchema } from "@/lib/zodSchema";
import { Project, User } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req:NextRequest,{params }: { params: { projectId: string } }) {

    const user = authMiddleware(req);
            
    if(!user || user.role !== "admin"){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();

        const body = await req.json();
            const parsed = addOrremoveSchema.safeParse(body);
        
            if (!parsed.success) {
              return NextResponse.json(
                { success: false, error: {message: "Invalid input" } },
                { status: 400 }
              );
            }
        
       const { operation, users} = parsed.data;

       const { projectId } = params;

       if(operation == 'add'){

        const updatedProject = await Project.findByIdAndUpdate(
          projectId,
          { $addToSet: { members: { $each: users } } },
          { new: true }
        );

        if (!updatedProject) {
  return NextResponse.json(
    { success: false, message: "Project not found" },
    { status: 404 }
  );
}


        return NextResponse.json({success: true,project: updatedProject},{status: 200});

       }
       // TODO: Can't remove project owner

       const updatedProject = await Project.findByIdAndUpdate(
          projectId,
          { $pull: { members: { $in: users } } },
          { new: true }
        );

        if (!updatedProject) {
  return NextResponse.json(
    { success: false, message: "Project not found" },
    { status: 404 }
  );
}


    return NextResponse.json({success: true,project: updatedProject},{status: 200});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in add/removing members" },
            { status: 500 }
        );
    }
    
}