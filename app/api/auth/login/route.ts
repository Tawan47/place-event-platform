import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // ค่า default ถ้าไม่มี env
        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (username === adminUsername && password === adminPassword) {
            // สร้าง simple token (ในโปรดักชันควรใช้ JWT)
            const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

            return NextResponse.json({
                success: true,
                token,
                message: "Login successful"
            });
        }

        return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
