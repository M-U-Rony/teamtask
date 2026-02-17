import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { invitationSchema} from "@/lib/zodSchema";
import { Invitation, User } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest,{params }: { params: { id: string }}) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {

       await DBconnect();

       const body = await req.json();
       const { id } = await params;

       const parsed = invitationSchema.safeParse(body);
       
           if (!parsed.success) {
             return NextResponse.json(
               { success: false, error: {message: "Invalid input" } },
               { status: 400 }
             );
           }


    const  {email} = parsed.data;

    const member = await User.findOne({email: email}).select("_id name email").lean();
    const curUser = await User.findById(user.userId).select("name").lean();
    
    if(!member){
        return NextResponse.json({success: true, message: "User doesn't exist"},{status: 404});
    }

    const invitation = {
        belongsTo : member._id,
        invitedBy: curUser.name,
        projectId :id
    }

    await Invitation.create(invitation);
   

    return NextResponse.json({success: true, message: "Invitation Sent"},{status: 200});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Erron in sending invitation" },
            { status: 500 }
        );
    }
    
}
