import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { updateTaskStatusSchema } from "@/lib/zodSchema";
import {Task} from "@/models/model";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

    const user = authMiddleware(req);
            
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

     try {
    
        await DBconnect();

        const {id} = await params;
    
        const task = await Task.findById(id);

        if(!task){
            return NextResponse.json({success: false, message: "Task not found"},{status: 404});
        }

        if(task.createdBy.toString() !== user.userId)
            return NextResponse.json({success: false, message: "Unauthorized"},{status: 401});

        await Task.findByIdAndDelete(id);

        return NextResponse.json({success: true, message: "Task deleted successfully"},{status: 200});
            
        } catch (error) {
            console.log(error)
            return NextResponse.json(
                { success: false, message: "Error in deleting task" },
                { status: 500 }
            );
        }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {

    const user = authMiddleware(req);
    if(!user){
        return NextResponse.json({success: false,message: "Unauthorized"},{status: 401});
    }

    try {
    
        await DBconnect();

        const {id} = await params;
    
        const task = await Task.findById(id);

        if(!task){
            return NextResponse.json({success: false, message: "Task not found"},{status: 404});
        }

        if(task.createdBy.toString() !== user.userId)
            return NextResponse.json({success: false, message: "Unauthorized"},{status: 401});
   
        const body = await req.json();
        const parsed = updateTaskStatusSchema.safeParse(body);
        
            if (!parsed.success) {
              return NextResponse.json(
                { success: false, error: {message: "Invalid input" } },
                { status: 400 }
              );
            }

        await Task.findByIdAndUpdate(id, {status: parsed.data.status});

        return NextResponse.json({success: true, message: "Task status updated successfully"},{status: 200});
            
        } catch (error) {
            console.log(error)
            return NextResponse.json(
                { success: false, message: "Error in updating task status" },
                { status: 500 }
            );
        }
}