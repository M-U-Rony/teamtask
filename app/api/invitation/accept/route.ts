import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { acceptInvitationSchema } from "@/lib/zodSchema";
import { Invitation, Project, User } from "@/models/model";
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
        const parsed = acceptInvitationSchema.safeParse(body);

        if (!parsed.success) {
              return NextResponse.json(
                { success: false, error: {message: "Invalid input" } },
                { status: 400 }
              );
            }

        const { userId, projectId, notificationId } = parsed.data;
        
         const user = await User.findById(userId).lean();
            if (!user) {
              return NextResponse.json(
                { success: false, error: { message: "user not found" } },
                { status: 404 }
              );
            }

        const project = await Project.findById(projectId);
            if (!project) {
              return NextResponse.json(
                { success: false, error: { message: "project not found" } },
                { status: 404 }
              );
            }

          if (project.members.includes(new mongoose.Types.ObjectId(userId))) {
            return NextResponse.json(
              { success: false, error: { message: "User is already a member of the project" } },
              { status: 400 }
            );
          }
        project.members.push(new mongoose.Types.ObjectId(userId));
         await project.save();

         await Invitation.findByIdAndUpdate(notificationId, {
            message: "Invitation accepted"
         })

         return NextResponse.json(
           { success: true, message: "Invitation accepted" },
           { status: 200 }
         );
    } catch (error) {
        return NextResponse.json(
          { success: false, error: { message: "Internal server error" } },
          { status: 500 }
        );
    }
    
}