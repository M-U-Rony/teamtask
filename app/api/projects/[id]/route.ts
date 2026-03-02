import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { Project} from "@/models/model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,{params }: { params: { id: string } }) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();

      const { id } = await params;
      
      const project = await Project.findById(id).populate("members","name email");

       if(!project){
        return NextResponse.json({success: false,message: "Not found"},{status: 404});
       }

        const isBelong = project.members.some((member:any) => member._id.toString() === user.userId.toString());

       if(!isBelong){
        return NextResponse.json({success: false,message: "forbidden"},{status: 403});
       }

    return NextResponse.json({success: true, project: project},{status: 200});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in getting project" },
            { status: 500 }
        );
    }
    
}