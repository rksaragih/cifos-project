import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Navbar from "@/Components/contexts/Navbar";
import Footer from "@/Components/contexts/Footer";
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X, LogOut } from "lucide-react";
import { logout as authLogout } from "@/Components/lib/auth";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address || "",
      });
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = {
        ...user,
        ...editData,
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess("Profil berhasil diperbarui!");
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authLogout();
    // Also clear user object
    localStorage.removeItem('user');
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profil Saya</h1>
            <p className="text-muted-foreground mt-2">
              Kelola informasi akun dan preferensi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>
                  {user.provider === "google" ? "Akun Google" : "Akun Email"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>
                      Perbarui informasi pribadi Anda
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isLoading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Menyimpan..." : "Simpan"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Masukkan nama lengkap"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{user.name || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email tidak dapat diubah
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Masukkan nomor telepon"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{user.phone || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editData.address}
                        onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Masukkan alamat"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{user.address || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {user.provider === "google" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Akun Google</h4>
                    <p className="text-sm text-blue-700">
                      Anda masuk menggunakan akun Google. Beberapa informasi seperti email 
                      dan foto profil akan disinkronkan dengan akun Google Anda.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>
                  Kelola akun dan preferensi Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link to="/reservasi" className="flex flex-col items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      <span>Reservasi Saya</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link to="/menu" className="flex flex-col items-center gap-2">
                      <User className="w-6 h-6" />
                      <span>Menu Favorit</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link to="/artikel" className="flex flex-col items-center gap-2">
                      <Mail className="w-6 h-6" />
                      <span>Artikel Tersimpan</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;


