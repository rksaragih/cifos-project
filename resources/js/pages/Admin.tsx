import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { 
  UtensilsCrossed, 
  Calendar, 
  FileText, 
  Users, 
  Settings,
  BarChart3,
  ClipboardList
} from "lucide-react";

const Admin = () => {
  // Mock data untuk statistik
  const stats = [
    {
      title: "Total Menu",
      value: "45",
      icon: UtensilsCrossed,
      description: "Menu aktif",
      color: "text-primary"
    },
    {
      title: "Reservasi Hari Ini",
      value: "12",
      icon: Calendar,
      description: "Menunggu konfirmasi: 3",
      color: "text-secondary"
    },
    {
      title: "Total Artikel",
      value: "28",
      icon: FileText,
      description: "Artikel published",
      color: "text-accent"
    },
    {
      title: "Total Pengguna",
      value: "156",
      icon: Users,
      description: "Pengguna terdaftar",
      color: "text-primary"
    }
  ];

  const adminMenus = [
    {
      title: "Kelola Menu",
      description: "Tambah, edit, dan hapus item menu",
      icon: UtensilsCrossed,
      link: "/admin/menu",
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Kelola Reservasi",
      description: "Lihat dan konfirmasi reservasi pelanggan",
      icon: Calendar,
      link: "/admin/reservasi",
      color: "bg-secondary/10 text-secondary"
    },
    {
      title: "Kelola Artikel",
      description: "Buat dan edit artikel blog",
      icon: FileText,
      link: "/admin/artikel",
      color: "bg-accent/10 text-accent"
    },
    {
      title: "Kelola Pengguna",
      description: "Manajemen pengguna dan akses",
      icon: Users,
      link: "/admin/users",
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Laporan & Statistik",
      description: "Lihat analytics dan laporan",
      icon: BarChart3,
      link: "/admin/reports",
      color: "bg-secondary/10 text-secondary"
    },
    {
      title: "Pengaturan",
      description: "Konfigurasi sistem dan preferensi",
      icon: Settings,
      link: "/admin/settings",
      color: "bg-accent/10 text-accent"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Kelola semua aspek restoran Anda dari satu tempat
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Menu Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Menu Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminMenus.map((menu, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${menu.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <menu.icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{menu.title}</CardTitle>
                    <CardDescription>{menu.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={menu.link}>Buka</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Aksi Cepat
              </CardTitle>
              <CardDescription>Tugas yang sering dilakukan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="default" className="w-full">
                  <Link to="/admin/menu/tambah">Tambah Menu Baru</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/admin/reservasi">Lihat Reservasi Hari Ini</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/artikel/tambah">Tulis Artikel Baru</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
