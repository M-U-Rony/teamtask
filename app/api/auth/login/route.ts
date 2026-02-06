import { NextRequest, NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import { loginSchema } from "@/lib/zodSchema";
import { User } from "@/models/model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await DBconnect();

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: {message: "Invalid input" } },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    if (user.isDisabled) {
      return NextResponse.json(
        { success: false, error: { message: "Account disabled" } },
        { status: 403 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: {message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      { userId: String(user._id), role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 }
    );

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return res;

  } catch (err) {
    return NextResponse.json(
      { success: false, error: {message: "Error while loging" } },
      { status: 500 }
    );
  }
}
