// lib/jwtUtils.ts
import { Role } from "@/types/enums";

interface JwtPayload {
  sub: string; // ID người dùng
  email: string;
  role: Role; // Role từ payload
  iat?: number; // Issued at
  exp?: number; // Expiration
}

export function decodeToken(token: string): Role | null {
  try {
    // Tách phần payload từ token (JWT có dạng header.payload.signature)
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid token format");

    // Decode base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    // Parse payload thành object
    const payload: JwtPayload = JSON.parse(jsonPayload);

    // Kiểm tra role hợp lệ
    if (!Object.values(Role).includes(payload.role)) {
      throw new Error("Invalid role in token");
    }

    return payload.role;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}