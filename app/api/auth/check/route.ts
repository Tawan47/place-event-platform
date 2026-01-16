import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "No token provided" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        // ตรวจสอบว่า token ถูกต้อง (decode และ check format)
        try {
            const decoded = Buffer.from(token, "base64").toString("utf-8");
            const [username, timestamp] = decoded.split(":");

            // ตรวจสอบว่า token ยังไม่หมดอายุ (24 ชั่วโมง)
            const tokenAge = Date.now() - parseInt(timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (username && timestamp && tokenAge < maxAge) {
                return NextResponse.json({ success: true, username });
            }
        } catch {
            // Token format invalid
        }

        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
