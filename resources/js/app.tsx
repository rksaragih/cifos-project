import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// CSS
import "../css/app.css";

// Pages
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Artikel from "./pages/Artikel";
import ArtikelDetail from "./pages/ArtikelDetail";
import Contact from "./pages/Contact";
import TentangKami from "./pages/TentangKami";
import Reservasi from "./pages/Reservasi";
import ReservasiMenu from './pages/ReservasiMenu';
import ReservasiReview from './pages/ReservasiInfo';
import ReservasiSuccess from './pages/ReservasiSuccess';
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminReservasi from './pages/admin/Reservasi';
import AdminMenu from './pages/admin/Menu';
import AdminKategori from './pages/admin/Kategori';
import AdminArtikel from './pages/admin/Artikel';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminBlackout from './pages/admin/Blackout';

// Context Providers
import { BookingProvider } from "./Components/BookingContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Komponen utama aplikasi
const App = () => {
    return (
        <BrowserRouter>
            <BookingProvider>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/artikel" element={<Artikel />} />
                    <Route path="/artikel/:id" element={<ArtikelDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/tentang-kami" element={<TentangKami />} />
                    <Route path="/reservasi" element={<Reservasi />} />
                    <Route path="/reservasi/menu" element={<ReservasiMenu />} />
                    <Route path="/reservasi/review" element={<ReservasiReview />} />
                    <Route path="/reservasi/success/:kode_reservasi" element={<ReservasiSuccess />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/order-history" element={<OrderHistory />} />

                    {/* Auth routes */}
                    <Route path="/login" element={<AdminLogin />} />
                    <Route path="/register" element={<AdminRegister />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="reservasi" element={<AdminReservasi />} />
                        <Route path="menu" element={<AdminMenu />} />
                        <Route path="kategori" element={<AdminKategori />} />
                        <Route path="artikel" element={<AdminArtikel />} />
                        <Route path="blackout" element={<AdminBlackout />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BookingProvider>
        </BrowserRouter>
    );
};

// Mount React app
const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </React.StrictMode>
    );
}
