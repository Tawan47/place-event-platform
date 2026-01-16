"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const token = localStorage.getItem("admin_token");

            if (!token) {
                router.push("/admin/login");
                return;
            }

            const res = await fetch("/api/auth/check", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("admin_token");
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            router.push("/admin/login");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("admin_token");
            router.push("/admin/login");
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1220] to-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
                    <p className="text-white/50">กำลังตรวจสอบสิทธิ์...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="relative">
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
            >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">ออกจากระบบ</span>
            </button>

            {children}
        </div>
    );
}
