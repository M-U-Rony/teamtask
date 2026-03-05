import { removeMemberSchema } from "@/lib/zodSchema";
import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { Project} from "@/models/model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest,{params }: { params: { id: string } }) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();
    
       const { id } = await params;
       const body = await req.json();

       const parsed = removeMemberSchema.safeParse(body);
       
           if (!parsed.success) {
             return NextResponse.json(
               { success: false, error: {message: "Invalid input" } },
               { status: 400 }
             );
           }


    const { memberId, projectAdminId} = parsed.data;

    if(projectAdminId === memberId){
        return NextResponse.json({success: false,message: "Can't remove admin"},{status: 403});
    }

    const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
            $pull: { members: memberId }
        },
        { new: true }
    )

    return NextResponse.json({success: true, message: "Member removed",data: updatedProject},{status: 201});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Error in removing member" },
            { status: 500 }
        );
    }
    
}