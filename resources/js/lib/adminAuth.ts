/**
 * Admin Authentication Helper Functions
 */

export interface AdminUser {
    id: number;
    username: string;
    email?: string;
    role: string;
}

/**
 * Get admin token from localStorage
 */
export const getAdminToken = (): string | null => {
    return localStorage.getItem("admin_token");
};

/**
 * Get admin user from localStorage
 */
export const getAdminUser = (): AdminUser | null => {
    const userStr = localStorage.getItem("admin_user");
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
    const token = getAdminToken();
    const user = getAdminUser();
    return Boolean(token && token.trim() !== "" && user);
};

/**
 * Logout admin - calls API and clears localStorage
 */
export const adminLogout = async (): Promise<{
    success: boolean;
    message?: string;
}> => {
    const token = getAdminToken();

    // If no token, just clear localStorage and return success
    if (!token) {
        clearAdminAuth();
        return { success: true };
    }

    try {
        const response = await fetch("/api/admin/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        // Clear localStorage regardless of API response
        clearAdminAuth();

        if (!response.ok) {
            // Even if API fails, we still clear local storage
            return {
                success: true,
                message: data.message || "Logged out locally",
            };
        }

        return { success: true, message: data.message || "Logout successful" };
    } catch (error) {
        // Even if API fails, clear local storage
        clearAdminAuth();
        console.error("Logout error:", error);
        return { success: true, message: "Logged out locally" };
    }
};

/**
 * Clear admin authentication data from localStorage
 */
export const clearAdminAuth = (): void => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
};
