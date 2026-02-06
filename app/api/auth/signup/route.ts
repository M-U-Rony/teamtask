import { NextRequest, NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import { signupSchema } from "@/lib/zodSchema";
import { User } from "@/models/model";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await DBconnect();

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: {message: "Invalid input" } },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return NextResponse.json(
        { success: false, error: {message: "User already exists" } },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "admin"
    });

    return NextResponse.json(
      {
        success: true,
        data: { name: user.name, email: user.email, role: user.role },
        message: "Signup successful",
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { success: false, error: {message: "User already exists" } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: {message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
