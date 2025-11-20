import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, FileText, Grid, List, Tag, LogOut, Ban } from "lucide-react";
import { adminLogout, getAdminUser } from "@/lib/adminAuth";

const AdminSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const adminUser = getAdminUser();

    const links = [
        { to: "/admin", label: "Dashboard", icon: Grid },
        { to: "/admin/reservasi", label: "Reservasi", icon: List },
        { to: "/admin/menu", label: "Menu", icon: Layout },
        { to: "/admin/kategori", label: "Kategori", icon: Tag },
        { to: "/admin/artikel", label: "Artikel", icon: FileText },
        { to: "/admin/blackout", label: "Blackout", icon: Ban},
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await adminLogout();
            // Redirect to login page
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            // Even if there's an error, clear local storage and redirect
            navigate("/login", { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between z-20">
            <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold">
                        C
                    </div>
                    <div>
                        <div className="text-sm font-semibold">CIFOS</div>
                        <div className="text-xs text-muted-foreground">Dashboard</div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {links.map((l) => {
                        const Icon = l.icon as any;
                        const active =
                            location.pathname === l.to ||
                            (l.to === "/admin" && location.pathname === "/admin");
                        return (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                    active
                                        ? "bg-emerald-50 text-emerald-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{l.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6 border-t">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
            </div>
        </aside>

    );
};

export default AdminSidebar;
