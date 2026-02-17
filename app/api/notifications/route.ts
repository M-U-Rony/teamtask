import DBconnect from "@/lib/db";
import { Invitation } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {

    await DBconnect();

    const id = req.nextUrl.searchParams.get("id");

    // if already in the project don't invite
    
    const msg = await Invitation.find({belongsTo: id}).select("belongsTo invitedBy projectId message");

    return NextResponse.json({success: true, notifications: msg},{status: 201})
    
}