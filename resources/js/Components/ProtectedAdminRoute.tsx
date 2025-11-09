import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
    children,
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Check authentication synchronously
    const adminToken = localStorage.getItem("admin_token");
    const adminUser = localStorage.getItem("admin_user");

    // Validate that both token and user exist and are not empty
    const isAuthenticated = Boolean(
        adminToken &&
            adminToken.trim() !== "" &&
            adminUser &&
            adminUser.trim() !== ""
    );

    useEffect(() => {
        // Force redirect if not authenticated
        if (!isAuthenticated) {
            // Clear any invalid tokens
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");

            // Force navigation to login
            navigate("/login", {
                replace: true,
                state: { from: location.pathname },
            });
        }
    }, [isAuthenticated, navigate, location.pathname]);

    // If not authenticated, redirect to login immediately
    if (!isAuthenticated) {
        // Clear any invalid tokens
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                    message: "Anda harus login terlebih dahulu",
                }}
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedAdminRoute;
