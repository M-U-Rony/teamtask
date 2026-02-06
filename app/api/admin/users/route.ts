import DBconnect from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import { User } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {

    const isAdmin = authMiddleware(req);
    
    if(!isAdmin || isAdmin?.role !== 'admin'){
        return NextResponse.json({success: false,message: "Forbidden"},{status: 403});
    }

    try {

        await DBconnect();

        const { searchParams } = new URL(req.url);

        const search = (searchParams.get("name") || "").trim();
        const role = (searchParams.get("role") || "").trim();

        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
        const skip = (page - 1) * limit;

        const filter: Record<string, any> = {};

        if (role) {
        filter.role = role;
        }

        if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
        }

        const [users, total] = await Promise.all([
        User.find(filter)
            .select("_id name email role createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(filter),
        ]);


    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          page,
          total,
        },
      },
      { status: 200 }
    );
        
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
    
}