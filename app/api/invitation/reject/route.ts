import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { rejectInvitationSchema } from "@/lib/zodSchema";
import { Invitation} from "@/models/model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {

    const user = authMiddleware(req);
                
        if(!user){
            return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
        }

    try {

        await DBconnect();

        const body = await req.json();
        const parsed = rejectInvitationSchema.safeParse(body);

        if (!parsed.success) {
              return NextResponse.json(
                { success: false, error: {message: "Invalid input" } },
                { status: 400 }
              );
            }

        const {notificationId } = parsed.data;

         await Invitation.findByIdAndUpdate(notificationId, {
            message: "Invitation rejected"
         })

         return NextResponse.json(
           { success: true, message: "Invitation rejected" },
           { status: 200 }
         );
    } catch (error) {
        return NextResponse.json(
          { success: false, error: { message: "Internal server error" } },
          { status: 500 }
        );
    }
    
}