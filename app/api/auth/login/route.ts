import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Missing credentials" },
                { status: 400 }
            );
        }

        // 1. ค้นหา user ใน Database
        let user = await prisma.user.findUnique({
            where: { username }
        });

        // 2. ถ้าไม่เจอ user และ Database ยังว่างอยู่ -> Auto-seed จาก .env
        if (!user) {
            const userCount = await prisma.user.count();
            if (userCount === 0) {
                const adminUsername = process.env.ADMIN_USERNAME;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (adminUsername && adminPassword) {
                    const hashedPassword = await bcrypt.hash(adminPassword, 10);
                    // สร้าง user admin เริ่มต้น
                    await prisma.user.create({
                        data: {
                            username: adminUsername,
                            password: hashedPassword
                        }
                    });

                    // ถ้าคนที่ login คือ admin พอดี ก็ให้ดึงข้อมูลมาใช้เลย
                    if (username === adminUsername) {
                        user = await prisma.user.findUnique({ where: { username } });
                    }
                }
            }
        }

        // 3. ถ้ายังไม่เจอ user อีก แสดงว่า username ผิด
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // 4. ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // สร้าง token (format เดิม: username:timestamp)
            const token = Buffer.from(`${user.username}:${Date.now()}`).toString("base64");

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
