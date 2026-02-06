import { authMiddleware} from "@/lib/middleware";
import DBconnect from "@/lib/db";
import { User } from "@/models/model";
import { NextRequest,NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {

    await DBconnect();

    const auth = await authMiddleware(req);

    if (!auth) {
        return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
        );
    }

    const user = await User.findById(auth.userId).select("_id name email role isDisabled").lean();

      if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

    if (user.isDisabled) {
      return NextResponse.json(
        { success: false, error: {message: "Account disabled" } },
        { status: 403 }
      );
    }

   return NextResponse.json(
    {
      success: true,
      data: user,
    },
    { status: 200 }
  );

        
    } catch (error) {
         return NextResponse.json(
      { success: false, error: {message: "Error in returning user details" } },
      { status: 500 }
    );
    }
    
}