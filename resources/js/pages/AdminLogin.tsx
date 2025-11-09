import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login Gagal");
            }

            localStorage.setItem("admin_token", data.token);
            localStorage.setItem("admin_user", JSON.stringify(data.user));

            window.location.href = "/admin";
            // alert('Login Berhasil! Selamat Datang!');
        } catch (err) {
            setError(err.message || "Terjadi kesalahan saat login");
            console.error("Login Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800')`,
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-green-600/50"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Card with shadow */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <Star
                                className="w-6 h-6 text-white"
                                fill="currentColor"
                            />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                            LOGO
                        </span>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Selamat Datang Kembali!
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Masuk untuk melanjutkan
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Masukkan username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                required
                                disabled={isLoading}
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                required
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <div className="text-right mt-2">
                                <a
                                    href="#"
                                    className="text-sm text-green-600 hover:text-green-700 hover:underline"
                                >
                                    Lupa Password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Loading..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
