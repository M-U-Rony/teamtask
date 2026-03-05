import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { Invitation } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {

    const user = authMiddleware(req);

        if(!user){
            return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
        }

        try{

            await DBconnect();
      
            const msg = await Invitation.find({belongsTo: user.userId}).select("belongsTo invitedBy projectId message");
        
            return NextResponse.json({success: true, notifications: msg},{status: 201})
        } catch(error){
            console.log(error);
            return NextResponse.json({success: false, message: "Error in fetching notifications"},{status: 500});
        }


    
}