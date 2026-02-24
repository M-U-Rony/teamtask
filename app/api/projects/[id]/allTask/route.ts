import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { Task,Project } from "@/models/model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = authMiddleware(req);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await DBconnect();

    const { id } = await params;

    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project Not found" },
        { status: 404 },
      );
    }

    const allTask = await Task.find({ belongsTo: id }).select("_id name description members").lean();

    if (!allTask) {
      return NextResponse.json(
        { success: false, message: "No Tasks found" },
        { status: 404 },
      );
    }

    if (String(project.createdBy) == user.userId) {
      return NextResponse.json(
        { success: true, data: allTask },
        { status: 200 },
      );
    }

const userId = new mongoose.Types.ObjectId(user.userId);

const myTasks = allTask.filter((task) =>
  task.members?.some((memberId) => memberId.equals(userId))
);

    return NextResponse.json({ success: true, data: myTasks }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Erron in fetching task" },
      { status: 500 },
    );
  }
}
