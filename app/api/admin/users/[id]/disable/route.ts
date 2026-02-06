import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { User } from "@/models/model";
import { NextRequest,NextResponse } from "next/server";


export async function PATCH(req:NextRequest, {params }: { params: { id: string } }) {

    const isAdmin = authMiddleware(req);
        
        if(!isAdmin || isAdmin?.role !== 'admin'){
            return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
        }

    try {
        
        await DBconnect();

         const { id } = await params;


        if( id == isAdmin.userId){
            return NextResponse.json({success: false,message: "Forbidden"},{status: 403});
        }

        const user = await User.findById(id);

        if(!user){
            
            return NextResponse.json({success: false,message: "User not found"},{status: 404});
        }

        const updatedUser = await User.findByIdAndUpdate(id,{isDisabled: true});

        return NextResponse.json({success: true,message: "Account disabled"},{status: 200});

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to disable user" },
            { status: 500 }
        );
    }
    
}