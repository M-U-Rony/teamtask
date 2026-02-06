import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export type AuthData = {
  userId: string;
  role: "admin" | "member";
};

export function authMiddleware(request: NextRequest): AuthData | null {
  try {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) return null;

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;

    const userId = payload.userId;
    const role = payload.role;

    if (!userId || !role) return null;

    return { userId: String(userId), role };
  } catch {
    return null;
  }
}
