import React from "react";
import AdminSidebar from "@/Components/AdminSidebar";
import { Outlet } from "react-router-dom";
import ProtectedAdminRoute from "@/Components/ProtectedAdminRoute";

const AdminLayout: React.FC = () => {
    return (
        <ProtectedAdminRoute>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar />
                <main className="ml-64 p-8">
                    <Outlet />
                </main>
            </div>
        </ProtectedAdminRoute>
    );
};

export default AdminLayout;
