import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { clearInvitationSchema } from "@/lib/zodSchema";
import { Invitation} from "@/models/model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {

    const user = authMiddleware(req);
                
        if(!user){
            return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
        }

    try {

        await DBconnect();

        const body = await req.json();
        const parsed = clearInvitationSchema.safeParse(body);

        if (!parsed.success) {
              return NextResponse.json(
                { success: false, error: {message: "Invalid input" } },
                { status: 400 }
              );
            }

        const { userId } = parsed.data;

        // Only allow clearing invitations for the authenticated user
        if (user.userId !== userId) {
          return NextResponse.json(
            { success: false, message: "Forbidden" },
            { status: 403 }
          );
        }

        // Delete all invitations that belong to this user
        await Invitation.deleteMany({ belongsTo: userId });

         return NextResponse.json(
           { success: true, message: "History Cleared" },
           { status: 200 }
         );
    } catch (error) {
        return NextResponse.json(
          { success: false, error: { message: "Internal server error" } },
          { status: 500 }
        );
    }
    
}