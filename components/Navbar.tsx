"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push("/admin/login");
    };

    const isAdminPage = pathname?.startsWith("/admin");

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B1220]">
            <Link href="/" className="flex items-center gap-2 text-[#34d399] font-bold">
                ▲ skytrainspace
            </Link>

            <nav className="flex items-center gap-6">
                <Link href="/events" className="hover:text-[#34d399] transition">
                    EVENTS
                </Link>

                {isAuthenticated && isAdminPage ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-white/80 hover:text-red-400 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                    </button>
                ) : (
                    <Link href="/admin" className="hover:text-[#34d399] transition">
                        ADMIN
                    </Link>
                )}
            </nav>
        </header>
    );
}
